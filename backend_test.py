#!/usr/bin/env python3
"""
HeritageFund Backend API Testing Suite
Tests all backend endpoints for the MVP functionality
"""

import requests
import sys
import json
from datetime import datetime

class HeritageFundAPITester:
    def __init__(self, base_url="https://heritageguard.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            self.passed_tests.append(test_name)
            print(f"✅ {test_name} - PASSED")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - FAILED: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            details = ""
            
            if not success:
                details = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'No error details')}"
                except:
                    details += f" - Response: {response.text[:200]}"
            
            self.log_result(name, success, details)
            
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_result(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        self.run_test("API Root", "GET", "", 200)
        self.run_test("Health Check", "GET", "health", 200)

    def test_succession_calculator(self):
        """Test succession calculator endpoint"""
        print("\n" + "="*50)
        print("TESTING SUCCESSION CALCULATOR")
        print("="*50)
        
        # Test with direct line relationship (as specified in requirements)
        calc_data = {
            "property_value": 300000,
            "relationship": "direct_line",
            "previous_donations": 0,
            "has_disability": False
        }
        
        success, response = self.run_test(
            "Succession Calculator - Direct Line 300k",
            "POST",
            "calculator/succession",
            200,
            data=calc_data
        )
        
        if success:
            # Verify response structure
            required_fields = ['property_value', 'relationship', 'abatement', 'taxable_amount', 
                             'tax_rate', 'succession_fees', 'net_inheritance', 'breakdown']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_result("Calculator Response Structure", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Calculator Response Structure", True)
                print(f"   Succession fees: {response.get('succession_fees', 0)}€")
                print(f"   Tax rate: {response.get('tax_rate', 0)}%")
        
        # Test with spouse (should be exempt)
        spouse_data = {
            "property_value": 300000,
            "relationship": "spouse",
            "previous_donations": 0,
            "has_disability": False
        }
        
        success, response = self.run_test(
            "Succession Calculator - Spouse (Exempt)",
            "POST",
            "calculator/succession",
            200,
            data=spouse_data
        )
        
        if success and response.get('succession_fees') == 0:
            self.log_result("Spouse Exemption Logic", True)
        elif success:
            self.log_result("Spouse Exemption Logic", False, f"Expected 0 fees, got {response.get('succession_fees')}")

    def test_platform_stats(self):
        """Test platform statistics endpoint"""
        print("\n" + "="*50)
        print("TESTING PLATFORM STATS")
        print("="*50)
        
        success, response = self.run_test(
            "Platform Statistics",
            "GET",
            "stats/platform",
            200
        )
        
        if success:
            required_fields = ['total_campaigns', 'total_raised', 'total_investors', 'funded_campaigns', 'success_rate']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_result("Stats Response Structure", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Stats Response Structure", True)
                print(f"   Total campaigns: {response.get('total_campaigns', 0)}")
                print(f"   Total raised: {response.get('total_raised', 0)}€")
                print(f"   Total investors: {response.get('total_investors', 0)}")

    def test_campaigns_list(self):
        """Test campaigns listing endpoint"""
        print("\n" + "="*50)
        print("TESTING CAMPAIGNS LIST")
        print("="*50)
        
        success, response = self.run_test(
            "Campaigns List",
            "GET",
            "campaigns",
            200
        )
        
        if success:
            if isinstance(response, list):
                self.log_result("Campaigns List Structure", True)
                print(f"   Found {len(response)} campaigns")
                
                # If there are campaigns, check structure
                if response:
                    campaign = response[0]
                    required_fields = ['campaign_id', 'title', 'description', 'property_type', 
                                     'property_value', 'target_amount', 'raised_amount', 'status']
                    missing_fields = [field for field in required_fields if field not in campaign]
                    
                    if missing_fields:
                        self.log_result("Campaign Object Structure", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_result("Campaign Object Structure", True)
            else:
                self.log_result("Campaigns List Structure", False, "Expected list, got other type")

    def test_auth_endpoints(self):
        """Test authentication endpoints (without actual OAuth)"""
        print("\n" + "="*50)
        print("TESTING AUTH ENDPOINTS")
        print("="*50)
        
        # Test /auth/me without token (should fail)
        self.run_test(
            "Auth Me - No Token",
            "GET",
            "auth/me",
            401
        )
        
        # Test logout endpoint
        self.run_test(
            "Logout Endpoint",
            "POST",
            "auth/logout",
            200
        )

    def test_protected_endpoints(self):
        """Test endpoints that require authentication"""
        print("\n" + "="*50)
        print("TESTING PROTECTED ENDPOINTS")
        print("="*50)
        
        # Test campaigns creation (should require auth)
        campaign_data = {
            "title": "Test Campaign",
            "description": "Test description",
            "story": "Test story",
            "property_type": "house",
            "property_value": 300000,
            "location": "Paris",
            "target_amount": 50000
        }
        
        self.run_test(
            "Create Campaign - No Auth",
            "POST",
            "campaigns",
            401,
            data=campaign_data
        )
        
        # Test my campaigns (should require auth)
        self.run_test(
            "My Campaigns - No Auth",
            "GET",
            "campaigns/mine",
            401
        )
        
        # Test my investments (should require auth)
        self.run_test(
            "My Investments - No Auth",
            "GET",
            "investments/mine",
            401
        )

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting HeritageFund Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("="*70)
        
        # Run test suites
        self.test_health_endpoints()
        self.test_succession_calculator()
        self.test_platform_stats()
        self.test_campaigns_list()
        self.test_auth_endpoints()
        self.test_protected_endpoints()
        
        # Print summary
        print("\n" + "="*70)
        print("TEST SUMMARY")
        print("="*70)
        print(f"Total tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   - {failure['test']}: {failure['details']}")
        
        if self.passed_tests:
            print("\n✅ PASSED TESTS:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test runner"""
    tester = HeritageFundAPITester()
    success = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'investor' | 'heir' | 'notary' | 'admin'
export type KYCStatus = 'pending' | 'submitted' | 'approved' | 'rejected'

export type PropertyType = 'house' | 'farm' | 'business' | 'land' | 'apartment'

export type CampaignStatus =
  | 'draft'
  | 'pending_validation'
  | 'active'
  | 'funded'
  | 'repaying'
  | 'completed'
  | 'cancelled'

export type InvestmentStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'defaulted'

export type RepaymentStatus =
  | 'scheduled'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'late'

export type MessageType = 'comment' | 'update' | 'question' | 'answer'

export type NotificationType =
  | 'investment_confirmed'
  | 'campaign_funded'
  | 'repayment_received'
  | 'campaign_update'
  | 'message_received'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: UserRole
          kyc_status: KYCStatus
          kyc_documents: Json
          iban: string | null
          bank_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: UserRole
          kyc_status?: KYCStatus
          kyc_documents?: Json
          iban?: string | null
          bank_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: UserRole
          kyc_status?: KYCStatus
          kyc_documents?: Json
          iban?: string | null
          bank_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          heir_id: string
          notary_id: string | null
          title: string
          story: string
          location: string
          property_type: PropertyType
          asset_value: number
          tax_amount: number
          target_amount: number
          current_amount: number
          interest_rate: number
          duration_months: number
          images: string[]
          videos: string[]
          documents: string[]
          status: CampaignStatus
          validation_notes: string | null
          created_at: string
          published_at: string | null
          funded_at: string | null
          deadline: string | null
          backers_count: number
          views_count: number
        }
        Insert: {
          id?: string
          heir_id: string
          notary_id?: string | null
          title: string
          story: string
          location: string
          property_type: PropertyType
          asset_value: number
          tax_amount: number
          target_amount: number
          current_amount?: number
          interest_rate: number
          duration_months: number
          images?: string[]
          videos?: string[]
          documents?: string[]
          status?: CampaignStatus
          validation_notes?: string | null
          created_at?: string
          published_at?: string | null
          funded_at?: string | null
          deadline?: string | null
          backers_count?: number
          views_count?: number
        }
        Update: {
          id?: string
          heir_id?: string
          notary_id?: string | null
          title?: string
          story?: string
          location?: string
          property_type?: PropertyType
          asset_value?: number
          tax_amount?: number
          target_amount?: number
          current_amount?: number
          interest_rate?: number
          duration_months?: number
          images?: string[]
          videos?: string[]
          documents?: string[]
          status?: CampaignStatus
          validation_notes?: string | null
          created_at?: string
          published_at?: string | null
          funded_at?: string | null
          deadline?: string | null
          backers_count?: number
          views_count?: number
        }
      }
      investments: {
        Row: {
          id: string
          campaign_id: string
          investor_id: string
          amount: number
          interest_rate: number
          duration_months: number
          status: InvestmentStatus
          payment_method: string | null
          transaction_id: string | null
          monthly_payment: number | null
          total_expected_return: number | null
          total_returned: number
          next_payment_date: string | null
          created_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          campaign_id: string
          investor_id: string
          amount: number
          interest_rate: number
          duration_months: number
          status?: InvestmentStatus
          payment_method?: string | null
          transaction_id?: string | null
          monthly_payment?: number | null
          total_expected_return?: number | null
          total_returned?: number
          next_payment_date?: string | null
          created_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          campaign_id?: string
          investor_id?: string
          amount?: number
          interest_rate?: number
          duration_months?: number
          status?: InvestmentStatus
          payment_method?: string | null
          transaction_id?: string | null
          monthly_payment?: number | null
          total_expected_return?: number | null
          total_returned?: number
          next_payment_date?: string | null
          created_at?: string
          confirmed_at?: string | null
        }
      }
      repayments: {
        Row: {
          id: string
          investment_id: string
          campaign_id: string
          amount: number
          principal: number
          interest: number
          status: RepaymentStatus
          due_date: string
          paid_at: string | null
          transaction_id: string | null
          payment_method: string | null
          created_at: string
        }
        Insert: {
          id?: string
          investment_id: string
          campaign_id: string
          amount: number
          principal: number
          interest: number
          status?: RepaymentStatus
          due_date: string
          paid_at?: string | null
          transaction_id?: string | null
          payment_method?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          investment_id?: string
          campaign_id?: string
          amount?: number
          principal?: number
          interest?: number
          status?: RepaymentStatus
          due_date?: string
          paid_at?: string | null
          transaction_id?: string | null
          payment_method?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          campaign_id: string
          author_id: string
          content: string
          type: MessageType
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          author_id: string
          content: string
          type?: MessageType
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          author_id?: string
          content?: string
          type?: MessageType
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          data: Json
          read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          data?: Json
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          data?: Json
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          event_type: string
          user_id: string | null
          campaign_id: string | null
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          user_id?: string | null
          campaign_id?: string | null
          data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          user_id?: string | null
          campaign_id?: string | null
          data?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JS</Text>
        </View>
        <Text style={styles.name}>Jean-Sébastien</Text>
        <Text style={styles.email}>js@heritagefund.fr</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓ Compte vérifié</Text>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon compte</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👤</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Informations personnelles</Text>
            <Text style={styles.menuSubtitle}>
              Nom, email, téléphone
            </Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🏦</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Informations bancaires</Text>
            <Text style={styles.menuSubtitle}>
              IBAN, prélèvements
            </Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔐</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Sécurité</Text>
            <Text style={styles.menuSubtitle}>
              Mot de passe, 2FA
            </Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📄</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Documents</Text>
            <Text style={styles.menuSubtitle}>
              KYC, justificatifs
            </Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences</Text>

        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Notifications push</Text>
            <Text style={styles.menuSubtitle}>
              Alertes investissements
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#333', true: '#4ecca3' }}
            thumbColor={'#fff'}
          />
        </View>

        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>📧</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Emails</Text>
            <Text style={styles.menuSubtitle}>
              Newsletter, actualités
            </Text>
          </View>
          <Switch
            value={emailUpdates}
            onValueChange={setEmailUpdates}
            trackColor={{ false: '#333', true: '#4ecca3' }}
            thumbColor={'#fff'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aide & Support</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Centre d'aide</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>💬</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Nous contacter</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚖️</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Mentions légales</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Confidentialité</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={styles.version}>
        <Text style={styles.versionText}>
          HeritageFund v1.0.0 • CIP agrément AMF en cours
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ecca3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#0f3460',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    color: '#4ecca3',
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#808080',
  },
  menuArrow: {
    fontSize: 24,
    color: '#808080',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 16,
    backgroundColor: '#4a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});

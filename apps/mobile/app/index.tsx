import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🏛️</Text>
        <Text style={styles.title}>HeritageFund</Text>
        <Text style={styles.subtitle}>
          Préservez votre héritage familial face aux droits de succession
        </Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45%</Text>
            <Text style={styles.statLabel}>Droits succession max</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>6 mois</Text>
            <Text style={styles.statLabel}>Pour payer</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Familles/an</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/calculator')}
        >
          <Text style={styles.primaryButtonText}>
            Calculer mes droits de succession
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.secondaryButtonText}>
            Explorer les campagnes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.linkButtonText}>
            J'ai déjà un compte
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💚 Solidarité • 🔒 Sécurisé • 📈 Rendement 4-7%
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ecca3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4ecca3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    borderWidth: 2,
    borderColor: '#4ecca3',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#4ecca3',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    paddingVertical: 12,
  },
  linkButtonText: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#808080',
    fontSize: 12,
    textAlign: 'center',
  },
});

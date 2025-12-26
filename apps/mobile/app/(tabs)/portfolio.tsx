import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Investment {
  id: string;
  campaignTitle: string;
  amount: number;
  interestRate: number;
  monthlyReturn: number;
  totalReturned: number;
  remainingMonths: number;
  status: 'active' | 'completed' | 'late';
}

const MOCK_INVESTMENTS: Investment[] = [
  {
    id: '1',
    campaignTitle: 'Maison familiale Bretagne',
    amount: 2000,
    interestRate: 5.5,
    monthlyReturn: 91.67,
    totalReturned: 550,
    remainingMonths: 18,
    status: 'active',
  },
  {
    id: '2',
    campaignTitle: 'Exploitation viticole Bordeaux',
    amount: 5000,
    interestRate: 6.0,
    monthlyReturn: 250,
    totalReturned: 3000,
    remainingMonths: 0,
    status: 'completed',
  },
  {
    id: '3',
    campaignTitle: 'Appartement Paris 11e',
    amount: 1000,
    interestRate: 5.0,
    monthlyReturn: 41.67,
    totalReturned: 125,
    remainingMonths: 21,
    status: 'active',
  },
];

export default function PortfolioScreen() {
  const totalInvested = MOCK_INVESTMENTS.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const totalReturned = MOCK_INVESTMENTS.reduce(
    (sum, inv) => sum + inv.totalReturned,
    0
  );
  const monthlyIncome = MOCK_INVESTMENTS.filter(
    (inv) => inv.status === 'active'
  ).reduce((sum, inv) => sum + inv.monthlyReturn, 0);
  const avgRate =
    MOCK_INVESTMENTS.reduce((sum, inv) => sum + inv.interestRate, 0) /
    MOCK_INVESTMENTS.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4ecca3';
      case 'completed':
        return '#808080';
      case 'late':
        return '#ff6b6b';
      default:
        return '#808080';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '✓ Actif';
      case 'completed':
        return '✓ Terminé';
      case 'late':
        return '⚠ Retard';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mon Portfolio</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total investi</Text>
            <Text style={styles.statValue}>
              {formatCurrency(totalInvested)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total récupéré</Text>
            <Text style={styles.statValue}>
              {formatCurrency(totalReturned)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Revenu mensuel</Text>
            <Text style={styles.statValue}>
              {formatCurrency(monthlyIncome)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Taux moyen</Text>
            <Text style={styles.statValue}>{avgRate.toFixed(1)}%</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.investments}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Mes investissements ({MOCK_INVESTMENTS.length})
          </Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Tout voir →</Text>
          </TouchableOpacity>
        </View>

        {MOCK_INVESTMENTS.map((investment) => (
          <TouchableOpacity
            key={investment.id}
            style={styles.investmentCard}
          >
            <View style={styles.investmentHeader}>
              <Text style={styles.investmentTitle}>
                {investment.campaignTitle}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${getStatusColor(
                      investment.status
                    )}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(investment.status) },
                  ]}
                >
                  {getStatusLabel(investment.status)}
                </Text>
              </View>
            </View>

            <View style={styles.investmentStats}>
              <View style={styles.investmentStat}>
                <Text style={styles.investmentStatLabel}>
                  Investi
                </Text>
                <Text style={styles.investmentStatValue}>
                  {formatCurrency(investment.amount)}
                </Text>
              </View>
              <View style={styles.investmentStat}>
                <Text style={styles.investmentStatLabel}>
                  Taux
                </Text>
                <Text style={styles.investmentStatValue}>
                  {investment.interestRate}%
                </Text>
              </View>
              <View style={styles.investmentStat}>
                <Text style={styles.investmentStatLabel}>
                  Récupéré
                </Text>
                <Text
                  style={[
                    styles.investmentStatValue,
                    { color: '#4ecca3' },
                  ]}
                >
                  {formatCurrency(investment.totalReturned)}
                </Text>
              </View>
            </View>

            {investment.status === 'active' && (
              <View style={styles.monthlyReturn}>
                <Text style={styles.monthlyReturnText}>
                  💰 {formatCurrency(investment.monthlyReturn)}/mois •{' '}
                  {investment.remainingMonths} mois restants
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>
            ➕ Investir dans une nouvelle campagne
          </Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>💡 Diversifiez votre portfolio</Text>
          <Text style={styles.infoText}>
            Investissez dans plusieurs campagnes pour réduire les risques
            et augmenter vos chances de rendement stable.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ecca3',
  },
  investments: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionLink: {
    fontSize: 14,
    color: '#4ecca3',
  },
  investmentCard: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  investmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  investmentStat: {
    flex: 1,
  },
  investmentStatLabel: {
    fontSize: 11,
    color: '#808080',
    marginBottom: 2,
  },
  investmentStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  monthlyReturn: {
    backgroundColor: '#0f3460',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  monthlyReturnText: {
    fontSize: 12,
    color: '#4ecca3',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#4ecca3',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#b0b0b0',
    lineHeight: 18,
  },
});

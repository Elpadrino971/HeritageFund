import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Campaign {
  id: string;
  title: string;
  location: string;
  story: string;
  targetAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  image: string;
  interestRate: number;
  propertyType: 'house' | 'farm' | 'business';
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Maison familiale en Guadeloupe',
    location: 'Pointe-à-Pitre, Guadeloupe',
    story:
      'Ma grand-mère a construit cette maison en 1965. 3 générations ont grandi ici. Les droits de succession nous obligent à vendre...',
    targetAmount: 75000,
    currentAmount: 45000,
    backers: 28,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    interestRate: 5.5,
    propertyType: 'house',
  },
  {
    id: '2',
    title: 'Exploitation agricole familiale',
    location: 'Bretagne',
    story:
      'Ferme transmise depuis 4 générations. 15 hectares, 50 vaches laitières. Sans votre aide, nous devrons vendre...',
    targetAmount: 120000,
    currentAmount: 89000,
    backers: 52,
    daysLeft: 8,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    interestRate: 6.0,
    propertyType: 'farm',
  },
  {
    id: '3',
    title: "Maison d'enfance à la montagne",
    location: 'Haute-Savoie',
    story:
      'Chalet familial où mes 5 frères et sœurs avons passé tous nos étés. Mon père vient de décéder...',
    targetAmount: 95000,
    currentAmount: 12000,
    backers: 8,
    daysLeft: 25,
    image: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59',
    interestRate: 5.0,
    propertyType: 'house',
  },
];

export default function CampaignsScreen() {
  const [filter, setFilter] = useState<'all' | 'house' | 'farm' | 'business'>(
    'all'
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProgressPercentage = (campaign: Campaign) => {
    return (campaign.currentAmount / campaign.targetAmount) * 100;
  };

  const filteredCampaigns =
    filter === 'all'
      ? MOCK_CAMPAIGNS
      : MOCK_CAMPAIGNS.filter((c) => c.propertyType === filter);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          Soutenez une famille
        </Text>
        <Text style={styles.headerSubtitle}>
          Investissez avec impact et rendement
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              Toutes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'house' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('house')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'house' && styles.filterTextActive,
              ]}
            >
              🏠 Maisons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'farm' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('farm')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'farm' && styles.filterTextActive,
              ]}
            >
              🌾 Fermes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'business' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('business')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'business' && styles.filterTextActive,
              ]}
            >
              🏢 Entreprises
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      <ScrollView style={styles.campaigns}>
        {filteredCampaigns.map((campaign) => (
          <TouchableOpacity
            key={campaign.id}
            style={styles.campaignCard}
          >
            <Image
              source={{ uri: campaign.image }}
              style={styles.campaignImage}
            />
            <View style={styles.campaignContent}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignLocation}>
                📍 {campaign.location}
              </Text>
              <Text style={styles.campaignStory} numberOfLines={2}>
                {campaign.story}
              </Text>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${getProgressPercentage(campaign)}%` },
                  ]}
                />
              </View>

              <View style={styles.campaignStats}>
                <View>
                  <Text style={styles.statValue}>
                    {formatCurrency(campaign.currentAmount)}
                  </Text>
                  <Text style={styles.statLabel}>
                    sur {formatCurrency(campaign.targetAmount)}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View>
                  <Text style={styles.statValue}>{campaign.backers}</Text>
                  <Text style={styles.statLabel}>investisseurs</Text>
                </View>
                <View style={styles.statDivider} />
                <View>
                  <Text style={styles.statValue}>{campaign.daysLeft}j</Text>
                  <Text style={styles.statLabel}>restants</Text>
                </View>
              </View>

              <View style={styles.campaignFooter}>
                <View style={styles.interestBadge}>
                  <Text style={styles.interestText}>
                    📈 {campaign.interestRate}% /an
                  </Text>
                </View>
                <TouchableOpacity style={styles.investButton}>
                  <Text style={styles.investButtonText}>
                    Investir →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 16,
  },
  filters: {
    marginTop: 8,
  },
  filtersContent: {
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterButtonActive: {
    backgroundColor: '#4ecca3',
    borderColor: '#4ecca3',
  },
  filterText: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  campaigns: {
    flex: 1,
    padding: 16,
  },
  campaignCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  campaignImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
  },
  campaignContent: {
    padding: 16,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  campaignLocation: {
    fontSize: 12,
    color: '#808080',
    marginBottom: 8,
  },
  campaignStory: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ecca3',
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#808080',
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interestBadge: {
    backgroundColor: '#0f3460',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  interestText: {
    color: '#4ecca3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  investButton: {
    backgroundColor: '#4ecca3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  investButtonText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

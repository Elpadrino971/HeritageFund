import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type RelationType = 'direct' | 'spouse' | 'siblings' | 'nephews' | 'other';

interface CalculatorResult {
  assetValue: number;
  taxableAmount: number;
  taxAmount: number;
  effectiveRate: number;
}

const ABATEMENTS = {
  direct: 100000, // Enfants, parents
  spouse: 80724, // Conjoint, PACS
  siblings: 15932,
  nephews: 7967,
  other: 1594,
};

const TAX_BRACKETS = {
  direct: [
    { limit: 8072, rate: 5 },
    { limit: 12109, rate: 10 },
    { limit: 15932, rate: 15 },
    { limit: 552324, rate: 20 },
    { limit: 902838, rate: 30 },
    { limit: 1805677, rate: 40 },
    { limit: Infinity, rate: 45 },
  ],
  siblings: [
    { limit: 24430, rate: 35 },
    { limit: Infinity, rate: 45 },
  ],
  other: [{ limit: Infinity, rate: 60 }],
};

export default function CalculatorScreen() {
  const [assetValue, setAssetValue] = useState('');
  const [relation, setRelation] = useState<RelationType>('direct');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculateTax = () => {
    const value = parseFloat(assetValue.replace(/\s/g, ''));
    if (isNaN(value) || value <= 0) return;

    const abatement = ABATEMENTS[relation];
    const taxableAmount = Math.max(0, value - abatement);

    let tax = 0;
    let remaining = taxableAmount;
    const brackets =
      relation === 'direct'
        ? TAX_BRACKETS.direct
        : relation === 'siblings'
        ? TAX_BRACKETS.siblings
        : TAX_BRACKETS.other;

    let previousLimit = 0;
    for (const bracket of brackets) {
      const bracketAmount = Math.min(
        remaining,
        bracket.limit - previousLimit
      );
      tax += bracketAmount * (bracket.rate / 100);
      remaining -= bracketAmount;
      previousLimit = bracket.limit;
      if (remaining <= 0) break;
    }

    setResult({
      assetValue: value,
      taxableAmount,
      taxAmount: tax,
      effectiveRate: (tax / value) * 100,
    });
  };

  const relations: { value: RelationType; label: string }[] = [
    { value: 'direct', label: 'Enfant/Parent' },
    { value: 'spouse', label: 'Conjoint/PACS' },
    { value: 'siblings', label: 'Frère/Sœur' },
    { value: 'nephews', label: 'Neveu/Nièce' },
    { value: 'other', label: 'Autre' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          Calculateur de droits de succession
        </Text>
        <Text style={styles.headerSubtitle}>
          Estimez gratuitement vos droits à payer
        </Text>
      </LinearGradient>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valeur du bien hérité</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 300 000"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={assetValue}
            onChangeText={setAssetValue}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lien de parenté</Text>
          <View style={styles.relationsGrid}>
            {relations.map((rel) => (
              <TouchableOpacity
                key={rel.value}
                style={[
                  styles.relationButton,
                  relation === rel.value && styles.relationButtonActive,
                ]}
                onPress={() => setRelation(rel.value)}
              >
                <Text
                  style={[
                    styles.relationButtonText,
                    relation === rel.value &&
                      styles.relationButtonTextActive,
                  ]}
                >
                  {rel.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateTax}
        >
          <Text style={styles.calculateButtonText}>Calculer</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.results}>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Valeur héritée</Text>
              <Text style={styles.resultValue}>
                {formatCurrency(result.assetValue)}
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Abattement</Text>
              <Text style={styles.resultValue}>
                - {formatCurrency(ABATEMENTS[relation])}
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Montant taxable</Text>
              <Text style={styles.resultValue}>
                {formatCurrency(result.taxableAmount)}
              </Text>
            </View>

            <View style={[styles.resultCard, styles.resultCardHighlight]}>
              <Text style={styles.resultLabelHighlight}>
                💸 DROITS À PAYER
              </Text>
              <Text style={styles.resultValueHighlight}>
                {formatCurrency(result.taxAmount)}
              </Text>
              <Text style={styles.resultRate}>
                Taux effectif: {result.effectiveRate.toFixed(1)}%
              </Text>
            </View>

            <View style={styles.deadline}>
              <Text style={styles.deadlineText}>
                ⚠️ À payer sous 6 mois après le décès
              </Text>
            </View>

            <TouchableOpacity style={styles.helpButton}>
              <Text style={styles.helpButtonText}>
                💡 Je n'ai pas les liquidités - Comment faire ?
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.infoTitle}>ℹ️ Bon à savoir</Text>
          <Text style={styles.infoText}>
            • Les abattements se renouvellent tous les 15 ans{'\n'}
            • Don avant 80 ans: +31 865€ exonérés (ligne directe){'\n'}
            • Nue-propriété: réduction 40-50% selon l'âge{'\n'}
            • Pénalités retard: 0,20% par mois
          </Text>
        </View>
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
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: '#fff',
  },
  relationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a2e',
  },
  relationButtonActive: {
    backgroundColor: '#4ecca3',
    borderColor: '#4ecca3',
  },
  relationButtonText: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  relationButtonTextActive: {
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#4ecca3',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  calculateButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  results: {
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultCardHighlight: {
    backgroundColor: '#2a2a4e',
    borderWidth: 2,
    borderColor: '#4ecca3',
  },
  resultLabel: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  resultLabelHighlight: {
    fontSize: 16,
    color: '#4ecca3',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultValueHighlight: {
    fontSize: 32,
    color: '#4ecca3',
    fontWeight: 'bold',
  },
  resultRate: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 4,
  },
  deadline: {
    backgroundColor: '#4a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  deadlineText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  helpButton: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  helpButtonText: {
    color: '#4ecca3',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 22,
  },
});

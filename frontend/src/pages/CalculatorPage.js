import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import axios from 'axios';
import { 
    Calculator,
    ArrowRight,
    TrendingDown,
    Wallet,
    AlertCircle
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CalculatorPage() {
    const { isAuthenticated, login } = useAuth();
    
    const [calcInput, setCalcInput] = useState({
        property_value: '',
        relationship: 'direct_line',
        previous_donations: '0',
        has_disability: false
    });
    const [calcResult, setCalcResult] = useState(null);
    const [calcLoading, setCalcLoading] = useState(false);

    const handleCalculate = async () => {
        if (!calcInput.property_value) return;
        
        setCalcLoading(true);
        try {
            const response = await axios.post(`${API}/calculator/succession`, {
                property_value: parseFloat(calcInput.property_value),
                relationship: calcInput.relationship,
                previous_donations: parseFloat(calcInput.previous_donations) || 0,
                has_disability: calcInput.has_disability
            });
            setCalcResult(response.data);
        } catch (err) {
            console.error('Calculation error:', err);
        } finally {
            setCalcLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const relationshipLabels = {
        spouse: 'Conjoint (exonéré)',
        direct_line: 'Enfant (ligne directe)',
        sibling: 'Frère/Soeur',
        nephew_niece: 'Neveu/Nièce',
        other: 'Autre'
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="heading-1 mb-4" data-testid="calculator-page-title">
                        Calculateur de droits de <em className="italic text-primary">succession</em>
                    </h1>
                    <p className="body-large text-muted-foreground max-w-2xl mx-auto">
                        Estimez gratuitement les frais de succession que vous devrez payer selon le barème fiscal français en vigueur.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calculator form */}
                    <Card className="border-2" data-testid="calculator-form">
                        <CardHeader>
                            <CardTitle className="heading-3 flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-primary" />
                                Votre simulation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="property_value">Valeur du bien (€)</Label>
                                <Input
                                    id="property_value"
                                    type="number"
                                    placeholder="Ex: 300000"
                                    value={calcInput.property_value}
                                    onChange={(e) => setCalcInput({...calcInput, property_value: e.target.value})}
                                    className="text-lg"
                                    data-testid="calc-property-value"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="relationship">Lien de parenté avec le défunt</Label>
                                <Select 
                                    value={calcInput.relationship}
                                    onValueChange={(value) => setCalcInput({...calcInput, relationship: value})}
                                >
                                    <SelectTrigger id="relationship" data-testid="calc-relationship">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(relationshipLabels).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="previous_donations">Donations reçues ces 15 dernières années (€)</Label>
                                <Input
                                    id="previous_donations"
                                    type="number"
                                    placeholder="0"
                                    value={calcInput.previous_donations}
                                    onChange={(e) => setCalcInput({...calcInput, previous_donations: e.target.value})}
                                    data-testid="calc-donations"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Les donations antérieures réduisent l'abattement disponible
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="disability"
                                    checked={calcInput.has_disability}
                                    onChange={(e) => setCalcInput({...calcInput, has_disability: e.target.checked})}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="disability" className="text-sm">
                                    Bénéficiaire d'une situation de handicap (abattement supplémentaire)
                                </Label>
                            </div>

                            <Button 
                                onClick={handleCalculate}
                                disabled={!calcInput.property_value || calcLoading}
                                className="w-full btn-primary h-12"
                                data-testid="calc-submit"
                            >
                                <Calculator className="mr-2 h-5 w-5" />
                                {calcLoading ? 'Calcul en cours...' : 'Calculer mes droits'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    {calcResult ? (
                        <Card className="border-2 border-primary/20 bg-primary/5" data-testid="calc-result">
                            <CardHeader>
                                <CardTitle className="heading-3">Résultat de votre simulation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-muted-foreground">Valeur du bien</span>
                                    <span className="font-semibold text-lg">{formatCurrency(calcResult.property_value)}</span>
                                </div>
                                
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <TrendingDown className="h-4 w-4 text-green-500" />
                                        Abattement
                                    </span>
                                    <span className="font-semibold text-lg text-green-600">
                                        -{formatCurrency(Math.min(calcResult.abatement, calcResult.property_value))}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-muted-foreground">Base taxable</span>
                                    <span className="font-semibold">{formatCurrency(calcResult.taxable_amount)}</span>
                                </div>
                                
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-muted-foreground">Taux effectif d'imposition</span>
                                    <span className="font-semibold">{calcResult.tax_rate}%</span>
                                </div>

                                <div className="flex justify-between py-4 bg-accent/10 rounded-lg px-4">
                                    <span className="font-semibold text-lg flex items-center gap-2">
                                        <Wallet className="h-5 w-5" />
                                        Droits à payer
                                    </span>
                                    <span className="font-bold text-2xl text-accent">
                                        {formatCurrency(calcResult.succession_fees)}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between py-4 bg-primary/10 rounded-lg px-4">
                                    <span className="font-semibold text-lg">Héritage net</span>
                                    <span className="font-bold text-2xl text-primary">
                                        {formatCurrency(calcResult.net_inheritance)}
                                    </span>
                                </div>

                                {calcResult.succession_fees > 0 && (
                                    <div className="pt-4 space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            Vous avez {formatCurrency(calcResult.succession_fees)} de droits à payer. 
                                            HeritageFund peut vous aider à les financer sans vendre votre bien.
                                        </p>
                                        <Button 
                                            className="w-full btn-accent"
                                            onClick={() => isAuthenticated ? window.location.href = '/dashboard/heir/create' : login()}
                                            data-testid="calc-cta"
                                        >
                                            Lancer une campagne
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-2 border-dashed flex items-center justify-center">
                            <CardContent className="py-16 text-center">
                                <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="heading-3 mb-2">Votre résultat apparaîtra ici</h3>
                                <p className="text-muted-foreground">
                                    Remplissez le formulaire et cliquez sur calculer
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Info section */}
                <div className="mt-12 p-6 bg-muted/50 rounded-xl border">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold mb-2">À propos de ce calculateur</h3>
                            <p className="text-sm text-muted-foreground">
                                Ce calculateur fournit une estimation basée sur les barèmes fiscaux français en vigueur. 
                                Il ne prend pas en compte certaines situations particulières (assurance-vie, 
                                démembrement de propriété, réductions spécifiques). Pour une estimation précise, 
                                consultez un notaire.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Barème info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="heading-3">Abattements 2025</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b">
                                    <span>Conjoint/partenaire PACS</span>
                                    <span className="font-semibold text-green-600">Exonéré</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>Enfant</span>
                                    <span className="font-semibold">100 000 €</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>Frère/Soeur</span>
                                    <span className="font-semibold">15 932 €</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>Neveu/Nièce</span>
                                    <span className="font-semibold">7 967 €</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>Handicap (supplément)</span>
                                    <span className="font-semibold">159 325 €</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="heading-3">Barème ligne directe</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b">
                                    <span>Jusqu'à 8 072 €</span>
                                    <span className="font-semibold">5%</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>8 072 € à 12 109 €</span>
                                    <span className="font-semibold">10%</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>12 109 € à 15 932 €</span>
                                    <span className="font-semibold">15%</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>15 932 € à 552 324 €</span>
                                    <span className="font-semibold">20%</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>Au-delà de 1 805 677 €</span>
                                    <span className="font-semibold">45%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

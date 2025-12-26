import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { 
    ArrowRight, 
    Shield, 
    TrendingUp, 
    Users, 
    Calculator,
    Home,
    Building,
    Landmark,
    CheckCircle,
    ArrowDown
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Landing() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_campaigns: 0,
        total_raised: 0,
        total_investors: 0,
        success_rate: 0
    });

    // Calculator state
    const [calcInput, setCalcInput] = useState({
        property_value: '',
        relationship: 'direct_line',
        previous_donations: '0',
        has_disability: false
    });
    const [calcResult, setCalcResult] = useState(null);
    const [calcLoading, setCalcLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API}/stats/platform`);
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section 
                className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1597656619916-7afa666bc566)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay absolute inset-0" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
                    <h1 
                        className="heading-display mb-6 animate-fade-in"
                        data-testid="hero-title"
                    >
                        Préservez votre <em className="italic">héritage familial</em>
                    </h1>
                    <p className="body-large max-w-2xl mx-auto mb-8 text-white/90 animate-fade-in stagger-1">
                        Ne laissez pas les frais de succession vous forcer à vendre le patrimoine familial. 
                        Financez vos droits grâce à notre communauté d'investisseurs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-2">
                        <Button 
                            size="lg" 
                            className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                            onClick={() => isAuthenticated ? navigate('/dashboard/heir') : login()}
                            data-testid="hero-cta-heir"
                        >
                            Je suis héritier
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                            onClick={() => navigate('/campaigns')}
                            data-testid="hero-cta-investor"
                        >
                            Je veux investir
                        </Button>
                    </div>
                    <div className="mt-16 animate-fade-in stagger-3">
                        <ArrowDown className="h-8 w-8 mx-auto animate-bounce text-white/70" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center" data-testid="stat-campaigns">
                            <p className="stat-value text-primary">{stats.total_campaigns}</p>
                            <p className="text-muted-foreground mt-1">Campagnes actives</p>
                        </div>
                        <div className="text-center" data-testid="stat-raised">
                            <p className="stat-value text-primary">{formatCurrency(stats.total_raised)}</p>
                            <p className="text-muted-foreground mt-1">Fonds levés</p>
                        </div>
                        <div className="text-center" data-testid="stat-investors">
                            <p className="stat-value text-primary">{stats.total_investors}</p>
                            <p className="text-muted-foreground mt-1">Investisseurs</p>
                        </div>
                        <div className="text-center" data-testid="stat-success">
                            <p className="stat-value text-primary">{stats.success_rate}%</p>
                            <p className="text-muted-foreground mt-1">Taux de succès</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section id="calculator" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="tetris-grid items-start">
                        <div className="md:col-span-7">
                            <h2 className="heading-1 mb-4">
                                Calculez vos droits de <em className="italic text-primary">succession</em>
                            </h2>
                            <p className="body-large text-muted-foreground mb-8">
                                Estimez gratuitement les frais de succession que vous devrez payer. 
                                Notre calculateur prend en compte les abattements et barèmes en vigueur.
                            </p>

                            <Card className="border-2" data-testid="calculator-card">
                                <CardContent className="pt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <Label htmlFor="relationship">Lien de parenté</Label>
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
                                            <Label htmlFor="previous_donations">Donations antérieures (€)</Label>
                                            <Input
                                                id="previous_donations"
                                                type="number"
                                                placeholder="0"
                                                value={calcInput.previous_donations}
                                                onChange={(e) => setCalcInput({...calcInput, previous_donations: e.target.value})}
                                                data-testid="calc-donations"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button 
                                                onClick={handleCalculate}
                                                disabled={!calcInput.property_value || calcLoading}
                                                className="w-full btn-primary h-11"
                                                data-testid="calc-submit"
                                            >
                                                <Calculator className="mr-2 h-4 w-4" />
                                                {calcLoading ? 'Calcul...' : 'Calculer'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-5">
                            {calcResult ? (
                                <Card className="calculator-result border-2 border-primary/20 bg-primary/5" data-testid="calc-result">
                                    <CardHeader>
                                        <CardTitle className="heading-3">Résultat de votre simulation</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Valeur du bien</span>
                                            <span className="font-semibold">{formatCurrency(calcResult.property_value)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Abattement</span>
                                            <span className="font-semibold text-green-600">-{formatCurrency(calcResult.abatement)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Base taxable</span>
                                            <span className="font-semibold">{formatCurrency(calcResult.taxable_amount)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Taux effectif</span>
                                            <span className="font-semibold">{calcResult.tax_rate}%</span>
                                        </div>
                                        <div className="flex justify-between py-3 bg-accent/10 rounded-lg px-4 mt-4">
                                            <span className="font-semibold text-lg">Droits à payer</span>
                                            <span className="font-bold text-xl text-accent">{formatCurrency(calcResult.succession_fees)}</span>
                                        </div>
                                        <div className="flex justify-between py-3 bg-primary/10 rounded-lg px-4">
                                            <span className="font-semibold text-lg">Héritage net</span>
                                            <span className="font-bold text-xl text-primary">{formatCurrency(calcResult.net_inheritance)}</span>
                                        </div>

                                        <div className="pt-4">
                                            <Button 
                                                className="w-full btn-accent"
                                                onClick={() => isAuthenticated ? navigate('/dashboard/heir/create') : login()}
                                                data-testid="calc-cta"
                                            >
                                                Lancer une campagne de financement
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-2 border-dashed">
                                    <CardContent className="py-16 text-center">
                                        <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">
                                            Remplissez le formulaire pour voir votre estimation
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="heading-1 mb-4">Comment ça <em className="italic text-primary">fonctionne</em></h2>
                        <p className="body-large text-muted-foreground max-w-2xl mx-auto">
                            Un processus simple et sécurisé pour financer vos droits de succession
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Home,
                                title: 'Créez votre campagne',
                                description: 'Présentez votre bien familial, son histoire et le montant dont vous avez besoin.'
                            },
                            {
                                icon: Users,
                                title: 'Collectez des fonds',
                                description: 'Les investisseurs participent à votre campagne avec un prêt participatif sécurisé.'
                            },
                            {
                                icon: Shield,
                                title: 'Préservez votre patrimoine',
                                description: 'Payez vos droits de succession et gardez votre bien. Remboursez à votre rythme.'
                            }
                        ].map((step, index) => (
                            <Card key={index} className="card-interactive text-center" data-testid={`step-${index + 1}`}>
                                <CardContent className="pt-8 pb-6">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                        <step.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-primary mb-2 block">Étape {index + 1}</span>
                                    <h3 className="heading-3 mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="tetris-grid items-center">
                        <div className="md:col-span-5 order-2 md:order-1">
                            <img 
                                src="https://images.pexels.com/photos/8848794/pexels-photo-8848794.jpeg"
                                alt="Famille regardant un album photo"
                                className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
                            />
                        </div>
                        <div className="md:col-span-7 order-1 md:order-2 md:pl-12">
                            <h2 className="heading-1 mb-6">
                                Pour les <em className="italic text-primary">héritiers</em>
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    '40% moins cher qu\'un crédit hypothécaire classique',
                                    'Financement en 30-45 jours au lieu de 3 mois en banque',
                                    'Remboursement anticipé sans pénalités',
                                    'Accompagnement juridique par des notaires partenaires'
                                ].map((benefit, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="body-base">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                className="mt-8 btn-primary"
                                onClick={() => isAuthenticated ? navigate('/dashboard/heir') : login()}
                                data-testid="benefits-heir-cta"
                            >
                                Créer ma campagne
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Investor Benefits */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="tetris-grid items-center">
                        <div className="md:col-span-7">
                            <h2 className="heading-1 mb-6">
                                Pour les <em className="italic text-accent">investisseurs</em>
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    'Rendement 4-7% annuel sur des prêts sécurisés',
                                    'Garantie hypothécaire sur des biens immobiliers',
                                    'Investissement à partir de 50€ seulement',
                                    'Impact social : aidez des familles à préserver leur patrimoine'
                                ].map((benefit, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <TrendingUp className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                                        <span className="body-base">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                className="mt-8 btn-accent"
                                onClick={() => navigate('/campaigns')}
                                data-testid="benefits-investor-cta"
                            >
                                Voir les campagnes
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        <div className="md:col-span-5">
                            <img 
                                src="https://images.unsplash.com/photo-1620643482290-1714b6f350a8"
                                alt="Appartement Haussmannien Paris"
                                className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="heading-1 mb-6">
                        Prêt à préserver votre <em className="italic">héritage</em> ?
                    </h2>
                    <p className="body-large mb-8 text-primary-foreground/90">
                        Rejoignez les familles qui ont choisi HeritageFund pour protéger leur patrimoine.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="lg"
                            className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                            onClick={() => isAuthenticated ? navigate('/dashboard/heir') : login()}
                            data-testid="final-cta-heir"
                        >
                            Lancer ma campagne
                        </Button>
                        <Button 
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                            onClick={() => navigate('/campaigns')}
                            data-testid="final-cta-investor"
                        >
                            Découvrir les campagnes
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

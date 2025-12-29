import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { 
    TrendingUp, 
    Users, 
    Clock, 
    AlertTriangle,
    CheckCircle,
    Zap,
    Target,
    Wallet,
    Calculator
} from 'lucide-react';

const PLATFORM_FEE = 0.05; // 5%
const NOTARY_FEE = 0.0025; // 0.25%

export default function CampaignFinanceCalculator({ 
    successionAmount, 
    onConfigChange,
    initialRate = 10,
    initialDuration = 24
}) {
    const [interestRate, setInterestRate] = useState(initialRate);
    const [duration, setDuration] = useState(initialDuration);
    const [customAmount, setCustomAmount] = useState(successionAmount || '');

    const calculations = useMemo(() => {
        const amount = parseFloat(customAmount) || 0;
        if (amount <= 0) return null;

        // Amount to ask (including platform fees)
        const totalFees = PLATFORM_FEE + NOTARY_FEE;
        const amountToAsk = Math.ceil(amount / (1 - totalFees));
        
        // Platform takes
        const platformFee = amountToAsk * PLATFORM_FEE;
        const notaryFee = amountToAsk * NOTARY_FEE;
        
        // Interest calculations
        const totalInterest = amountToAsk * (interestRate / 100) * (duration / 12);
        const totalToRepay = amountToAsk + totalInterest;
        const monthlyPayment = totalToRepay / duration;
        
        // Investor attractiveness score (0-100)
        // Higher rate = more attractive, longer duration = slightly less attractive
        const rateScore = ((interestRate - 8) / 6) * 70; // 8% = 0, 14% = 70
        const durationPenalty = Math.max(0, (duration - 24) / 36) * 20; // Penalty for >24 months
        const attractivenessScore = Math.min(100, Math.max(0, rateScore + 30 - durationPenalty));
        
        // Funding speed estimate (days)
        const baseDays = 45;
        const speedBonus = (attractivenessScore / 100) * 30;
        const estimatedDays = Math.round(baseDays - speedBonus + 15);

        return {
            amountNeeded: amount,
            amountToAsk,
            platformFee,
            notaryFee,
            netToHeir: amountToAsk - platformFee - notaryFee,
            totalInterest,
            totalToRepay,
            monthlyPayment,
            attractivenessScore,
            estimatedDays,
            investorReturn: interestRate * (duration / 12)
        };
    }, [customAmount, interestRate, duration]);

    // Notify parent of config changes
    React.useEffect(() => {
        if (onConfigChange && calculations) {
            onConfigChange({
                targetAmount: calculations.amountToAsk,
                interestRate,
                durationMonths: duration,
                calculations
            });
        }
    }, [calculations, interestRate, duration, onConfigChange]);

    const getAttractivenessColor = (score) => {
        if (score >= 70) return 'text-green-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getAttractivenessLabel = (score) => {
        if (score >= 80) return { label: 'Très attractif', icon: Zap, color: 'bg-green-500' };
        if (score >= 60) return { label: 'Attractif', icon: CheckCircle, color: 'bg-green-400' };
        if (score >= 40) return { label: 'Modéré', icon: Target, color: 'bg-yellow-500' };
        if (score >= 20) return { label: 'Peu attractif', icon: AlertTriangle, color: 'bg-orange-500' };
        return { label: 'Difficile', icon: AlertTriangle, color: 'bg-red-500' };
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const attractiveness = calculations ? getAttractivenessLabel(calculations.attractivenessScore) : null;

    return (
        <div className="space-y-6">
            {/* Amount input */}
            <Card className="border-2">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-primary" />
                        Montant des droits de succession
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="succession-amount">Combien devez-vous payer ? (€)</Label>
                        <Input
                            id="succession-amount"
                            type="number"
                            placeholder="Ex: 68000"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="text-xl font-semibold"
                            data-testid="succession-amount-input"
                        />
                        <p className="text-xs text-muted-foreground">
                            Utilisez notre calculateur de succession pour estimer ce montant
                        </p>
                    </div>
                </CardContent>
            </Card>

            {calculations && (
                <>
                    {/* Interest Rate Slider */}
                    <Card className="border-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Taux d'intérêt annuel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-3xl font-bold text-primary">{interestRate}%</span>
                                <span className="text-sm text-muted-foreground">
                                    Rendement investisseur: {calculations.investorReturn.toFixed(1)}% total
                                </span>
                            </div>
                            
                            <Slider
                                value={[interestRate]}
                                onValueChange={([value]) => setInterestRate(value)}
                                min={8}
                                max={14}
                                step={0.5}
                                className="py-4"
                                data-testid="interest-rate-slider"
                            />
                            
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>8% - Économique</span>
                                <span>11% - Équilibré</span>
                                <span>14% - Attractif</span>
                            </div>

                            {/* Rate impact indicator */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <p className="text-xs text-red-600 dark:text-red-400">Votre coût</p>
                                    <p className="font-semibold text-red-700 dark:text-red-300">
                                        +{formatCurrency(calculations.totalInterest)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-xs text-green-600 dark:text-green-400">Gain investisseurs</p>
                                    <p className="font-semibold text-green-700 dark:text-green-300">
                                        +{formatCurrency(calculations.totalInterest)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Duration Slider */}
                    <Card className="border-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Durée du remboursement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-3xl font-bold text-primary">{duration} mois</span>
                                <span className="text-sm text-muted-foreground">
                                    {Math.floor(duration / 12)} an{duration >= 24 ? 's' : ''} {duration % 12 > 0 ? `et ${duration % 12} mois` : ''}
                                </span>
                            </div>
                            
                            <Slider
                                value={[duration]}
                                onValueChange={([value]) => setDuration(value)}
                                min={12}
                                max={60}
                                step={6}
                                className="py-4"
                                data-testid="duration-slider"
                            />
                            
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>12 mois</span>
                                <span>36 mois</span>
                                <span>60 mois</span>
                            </div>

                            {/* Monthly payment */}
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <p className="text-sm text-muted-foreground">Mensualité estimée</p>
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(calculations.monthlyPayment)}/mois
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attractiveness Gauge */}
                    <Card className="border-2 border-primary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Attractivité pour les investisseurs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Gauge */}
                            <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-500 ${attractiveness.color}`}
                                    style={{ width: `${calculations.attractivenessScore}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-bold text-sm">
                                        {Math.round(calculations.attractivenessScore)}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <attractiveness.icon className={`h-5 w-5 ${getAttractivenessColor(calculations.attractivenessScore)}`} />
                                <span className={`font-semibold ${getAttractivenessColor(calculations.attractivenessScore)}`}>
                                    {attractiveness.label}
                                </span>
                            </div>

                            {/* Tips */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>~{calculations.estimatedDays} jours pour financer</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>~{Math.ceil(calculations.amountToAsk / 500)} investisseurs</span>
                                </div>
                            </div>

                            {calculations.attractivenessScore < 50 && (
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span>
                                            Conseil : Augmentez le taux à 11%+ pour attirer plus d'investisseurs et financer plus rapidement.
                                        </span>
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-primary" />
                                Récapitulatif financier
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Droits de succession</span>
                                    <span className="font-semibold">{formatCurrency(calculations.amountNeeded)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Commission plateforme (5%)</span>
                                    <span className="font-semibold text-amber-600">+{formatCurrency(calculations.platformFee)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Commission notaire (0.25%)</span>
                                    <span className="font-semibold text-amber-600">+{formatCurrency(calculations.notaryFee)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b bg-primary/10 -mx-4 px-4 rounded">
                                    <span className="font-semibold">Montant à demander</span>
                                    <span className="font-bold text-primary text-lg">{formatCurrency(calculations.amountToAsk)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Intérêts ({interestRate}% × {duration} mois)</span>
                                    <span className="font-semibold text-red-600">+{formatCurrency(calculations.totalInterest)}</span>
                                </div>
                                <div className="flex justify-between py-3 bg-accent/10 -mx-4 px-4 rounded">
                                    <span className="font-semibold">Total à rembourser</span>
                                    <span className="font-bold text-accent text-xl">{formatCurrency(calculations.totalToRepay)}</span>
                                </div>
                            </div>

                            {/* Cost comparison */}
                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    <CheckCircle className="h-4 w-4 inline mr-1" />
                                    <strong>Vs crédit bancaire :</strong> Un crédit hypothécaire classique coûterait environ {formatCurrency(calculations.amountNeeded * 0.08 * (duration/12))} d'intérêts + 8% de frais de dossier.
                                    <br />
                                    <strong>Économie estimée : {formatCurrency(Math.max(0, (calculations.amountNeeded * 0.08 * (duration/12) + calculations.amountNeeded * 0.08) - calculations.totalInterest))}</strong>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

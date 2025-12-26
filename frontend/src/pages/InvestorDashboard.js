import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import axios from 'axios';
import { 
    TrendingUp, 
    Wallet,
    PieChart,
    ArrowUpRight,
    ExternalLink,
    Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function InvestorDashboard() {
    const { user, updateRole } = useAuth();
    const navigate = useNavigate();
    const [investments, setInvestments] = useState([]);
    const [stats, setStats] = useState({
        total_invested: 0,
        total_expected_return: 0,
        active_investments: 0,
        average_return_rate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'investor') {
            updateRole('investor').catch(console.error);
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [investmentsRes, statsRes] = await Promise.all([
                axios.get(`${API}/investments/mine`, { withCredentials: true }),
                axios.get(`${API}/investments/stats`, { withCredentials: true })
            ]);
            setInvestments(investmentsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Mock chart data
    const chartData = [
        { month: 'Jan', value: stats.total_invested * 0.2 },
        { month: 'Fév', value: stats.total_invested * 0.4 },
        { month: 'Mar', value: stats.total_invested * 0.5 },
        { month: 'Avr', value: stats.total_invested * 0.7 },
        { month: 'Mai', value: stats.total_invested * 0.85 },
        { month: 'Juin', value: stats.total_invested },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="heading-1 mb-2" data-testid="investor-dashboard-title">
                            Espace <em className="italic text-accent">Investisseur</em>
                        </h1>
                        <p className="text-muted-foreground">
                            Suivez vos investissements et revenus
                        </p>
                    </div>
                    <Button 
                        className="btn-accent mt-4 md:mt-0"
                        onClick={() => navigate('/campaigns')}
                        data-testid="browse-campaigns-btn"
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Voir les campagnes
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card data-testid="stat-invested">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total investi</p>
                                    <p className="stat-value text-accent">{formatCurrency(stats.total_invested)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                    <Wallet className="h-6 w-6 text-accent" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card data-testid="stat-expected">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Rendement attendu</p>
                                    <p className="stat-value text-primary">{formatCurrency(stats.total_expected_return)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card data-testid="stat-active">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Investissements actifs</p>
                                    <p className="stat-value text-primary">{stats.active_investments}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <PieChart className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card data-testid="stat-rate">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Taux moyen</p>
                                    <p className="stat-value text-primary">{stats.average_return_rate.toFixed(1)}%</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ArrowUpRight className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart */}
                {stats.total_invested > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="heading-3">Évolution du portefeuille</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
                                        <Tooltip 
                                            formatter={(value) => [formatCurrency(value), 'Valeur']}
                                            labelStyle={{ color: 'var(--foreground)' }}
                                            contentStyle={{ 
                                                backgroundColor: 'var(--background)', 
                                                border: '1px solid var(--border)',
                                                borderRadius: '0.5rem'
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="hsl(var(--primary))" 
                                            strokeWidth={2}
                                            dot={{ fill: 'hsl(var(--primary))' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Investments list */}
                <Card>
                    <CardHeader>
                        <CardTitle className="heading-3">Mes investissements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {investments.length === 0 ? (
                            <div className="text-center py-12">
                                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="heading-3 mb-2">Aucun investissement</h3>
                                <p className="text-muted-foreground mb-6">
                                    Découvrez les campagnes et commencez à investir
                                </p>
                                <Button 
                                    className="btn-accent"
                                    onClick={() => navigate('/campaigns')}
                                >
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Voir les campagnes
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {investments.map((investment) => {
                                    const profit = investment.expected_return - investment.amount;
                                    const profitPercent = (profit / investment.amount) * 100;
                                    
                                    return (
                                        <div 
                                            key={investment.investment_id}
                                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            data-testid={`investment-${investment.investment_id}`}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold">
                                                            {investment.campaign?.title || 'Campagne'}
                                                        </h4>
                                                        <Badge className={
                                                            investment.status === 'active' 
                                                                ? 'bg-primary text-primary-foreground' 
                                                                : 'bg-green-500 text-white'
                                                        }>
                                                            {investment.status === 'active' ? 'Actif' : 'Remboursé'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {investment.campaign?.duration_months || 24} mois
                                                        </span>
                                                        <span className="flex items-center text-primary">
                                                            <TrendingUp className="h-4 w-4 mr-1" />
                                                            {investment.campaign?.interest_rate || 5}% / an
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">Investi</p>
                                                        <p className="font-semibold">{formatCurrency(investment.amount)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">Retour attendu</p>
                                                        <p className="font-semibold text-primary">
                                                            {formatCurrency(investment.expected_return)}
                                                        </p>
                                                        <p className="text-xs text-green-500">
                                                            +{formatCurrency(profit)} ({profitPercent.toFixed(1)}%)
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/campaigns/${investment.campaign_id}`)}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info box */}
                <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-xl">
                    <h3 className="heading-3 mb-2 text-accent">Rendement sécurisé</h3>
                    <p className="text-muted-foreground">
                        Tous les investissements sont sécurisés par une garantie hypothécaire sur le bien. 
                        En cas de défaut, vous bénéficiez d'une priorité sur le produit de la vente.
                    </p>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import axios from 'axios';
import { 
    Plus, 
    FileText, 
    TrendingUp, 
    Users,
    Eye,
    Edit,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function HeirDashboard() {
    const { user, updateRole } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set role to heir if not already
        if (user?.role !== 'heir') {
            updateRole('heir').catch(console.error);
        }
        fetchMyCampaigns();
    }, [user]);

    const fetchMyCampaigns = async () => {
        try {
            const response = await axios.get(`${API}/campaigns/mine`, { withCredentials: true });
            setCampaigns(response.data);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
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

    const getStatusBadge = (status) => {
        const styles = {
            draft: 'bg-muted text-muted-foreground',
            active: 'bg-primary text-primary-foreground',
            funded: 'bg-green-500 text-white',
            completed: 'bg-blue-500 text-white'
        };
        const labels = {
            draft: 'Brouillon',
            active: 'Active',
            funded: 'Financée',
            completed: 'Terminée'
        };
        return <Badge className={styles[status]}>{labels[status]}</Badge>;
    };

    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raised_amount || 0), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

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
                        <h1 className="heading-1 mb-2" data-testid="heir-dashboard-title">
                            Espace <em className="italic text-primary">Héritier</em>
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez vos campagnes de financement
                        </p>
                    </div>
                    <Button 
                        className="btn-primary mt-4 md:mt-0"
                        onClick={() => navigate('/dashboard/heir/create')}
                        data-testid="create-campaign-btn"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle campagne
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card data-testid="stat-total-raised">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Fonds levés</p>
                                    <p className="stat-value text-primary">{formatCurrency(totalRaised)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card data-testid="stat-campaigns">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Campagnes actives</p>
                                    <p className="stat-value text-primary">{activeCampaigns}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card data-testid="stat-total">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total campagnes</p>
                                    <p className="stat-value text-primary">{campaigns.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Campaigns list */}
                <Card>
                    <CardHeader>
                        <CardTitle className="heading-3">Mes campagnes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {campaigns.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="heading-3 mb-2">Aucune campagne</h3>
                                <p className="text-muted-foreground mb-6">
                                    Créez votre première campagne pour commencer à lever des fonds
                                </p>
                                <Button 
                                    className="btn-primary"
                                    onClick={() => navigate('/dashboard/heir/create')}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer une campagne
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {campaigns.map((campaign) => {
                                    const progress = (campaign.raised_amount / campaign.target_amount) * 100;
                                    return (
                                        <div 
                                            key={campaign.campaign_id}
                                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            data-testid={`campaign-row-${campaign.campaign_id}`}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold">{campaign.title}</h4>
                                                        {getStatusBadge(campaign.status)}
                                                        {campaign.notary_validated && (
                                                            <Badge variant="outline" className="text-primary border-primary">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Notaire
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{campaign.location}</p>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>{formatCurrency(campaign.raised_amount)} / {formatCurrency(campaign.target_amount)}</span>
                                                            <span>{Math.round(progress)}%</span>
                                                        </div>
                                                        <Progress value={progress} className="h-2" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Voir
                                                    </Button>
                                                    {campaign.status === 'draft' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => navigate(`/dashboard/heir/edit/${campaign.campaign_id}`)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Modifier
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tips */}
                <div className="mt-8 p-6 bg-muted/50 rounded-xl border">
                    <h3 className="heading-3 mb-4">Conseils pour une campagne réussie</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-medium">Racontez votre histoire</p>
                                <p className="text-sm text-muted-foreground">Les investisseurs veulent comprendre l'histoire émotionnelle de votre bien.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-medium">Ajoutez des photos</p>
                                <p className="text-sm text-muted-foreground">De belles photos augmentent les chances de succès de 80%.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-medium">Validation notaire</p>
                                <p className="text-sm text-muted-foreground">Une campagne validée par un notaire inspire plus confiance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

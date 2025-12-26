import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { 
    Scale, 
    FileCheck,
    Wallet,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    MapPin
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function NotaryDashboard() {
    const { user, updateRole } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({
        validated_campaigns: 0,
        pending_campaigns: 0,
        total_commission: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'notary') {
            updateRole('notary').catch(console.error);
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [campaignsRes, statsRes] = await Promise.all([
                axios.get(`${API}/notary/campaigns`, { withCredentials: true }),
                axios.get(`${API}/notary/stats`, { withCredentials: true })
            ]);
            setCampaigns(campaignsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            if (err.response?.status === 403) {
                toast.error('Accès réservé aux notaires');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async (campaignId) => {
        try {
            await axios.post(`${API}/notary/validate/${campaignId}`, {}, { withCredentials: true });
            toast.success('Campagne validée avec succès');
            fetchData();
        } catch (err) {
            console.error('Validation error:', err);
            toast.error('Erreur lors de la validation');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

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
                <div className="mb-8">
                    <h1 className="heading-1 mb-2" data-testid="notary-dashboard-title">
                        Espace <em className="italic text-primary">Notaire</em>
                    </h1>
                    <p className="text-muted-foreground">
                        Validez les campagnes et suivez vos commissions
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card data-testid="stat-pending">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">En attente</p>
                                    <p className="stat-value text-amber-500">{stats.pending_campaigns}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card data-testid="stat-validated">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Validées</p>
                                    <p className="stat-value text-primary">{stats.validated_campaigns}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <FileCheck className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card data-testid="stat-commission">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Commissions totales</p>
                                    <p className="stat-value text-primary">{formatCurrency(stats.total_commission)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Wallet className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending campaigns */}
                <Card>
                    <CardHeader>
                        <CardTitle className="heading-3">Campagnes à valider</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {campaigns.length === 0 ? (
                            <div className="text-center py-12">
                                <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="heading-3 mb-2">Aucune campagne en attente</h3>
                                <p className="text-muted-foreground">
                                    Les nouvelles campagnes apparaîtront ici pour validation
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {campaigns.map((campaign) => (
                                    <div 
                                        key={campaign.campaign_id}
                                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        data-testid={`campaign-${campaign.campaign_id}`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">{campaign.title}</h4>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {campaign.location}
                                                    </span>
                                                    <span>
                                                        Valeur: {formatCurrency(campaign.property_value)}
                                                    </span>
                                                    <span>
                                                        Objectif: {formatCurrency(campaign.target_amount)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                    {campaign.description}
                                                </p>
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
                                                <Button
                                                    size="sm"
                                                    className="btn-primary"
                                                    onClick={() => handleValidate(campaign.campaign_id)}
                                                    data-testid={`validate-${campaign.campaign_id}`}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Valider
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Commission info */}
                <div className="mt-8 p-6 bg-muted/50 rounded-xl border">
                    <h3 className="heading-3 mb-4">Structure des commissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Commission par campagne validée</p>
                            <p className="text-2xl font-bold text-primary">5%</p>
                            <p className="text-sm text-muted-foreground">du montant levé une fois financée</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Conditions</p>
                            <ul className="text-sm space-y-1">
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                    Vérification des documents de propriété
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                    Validation de l'estimation du bien
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                    Mise en place de l'hypothèque
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

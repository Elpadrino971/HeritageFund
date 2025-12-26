import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { 
    MapPin, 
    Home, 
    Building, 
    Landmark, 
    Briefcase,
    TrendingUp,
    Clock,
    Users,
    Shield,
    ArrowLeft,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CampaignDetail() {
    const { id } = useParams();
    const { isAuthenticated, login, user } = useAuth();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [investAmount, setInvestAmount] = useState('100');
    const [investing, setInvesting] = useState(false);

    useEffect(() => {
        fetchCampaign();
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const response = await axios.get(`${API}/campaigns/${id}`);
            setCampaign(response.data);
        } catch (err) {
            console.error('Error fetching campaign:', err);
            toast.error('Campagne introuvable');
            navigate('/campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleInvest = async () => {
        if (!isAuthenticated) {
            login();
            return;
        }

        const amount = parseFloat(investAmount);
        if (amount < 50) {
            toast.error('Le montant minimum est de 50€');
            return;
        }

        setInvesting(true);
        try {
            const response = await axios.post(
                `${API}/payments/create-checkout`,
                null,
                {
                    params: { campaign_id: id, amount },
                    withCredentials: true,
                    headers: {
                        'Origin': window.location.origin
                    }
                }
            );
            
            // Redirect to Stripe checkout
            window.location.href = response.data.url;
        } catch (err) {
            console.error('Investment error:', err);
            toast.error('Erreur lors de la création du paiement');
        } finally {
            setInvesting(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const getPropertyIcon = (type) => {
        switch(type) {
            case 'house': return Home;
            case 'apartment': return Building;
            case 'land': return Landmark;
            case 'business': return Briefcase;
            default: return Home;
        }
    };

    const propertyTypeLabels = {
        house: 'Maison',
        apartment: 'Appartement',
        land: 'Terrain',
        business: 'Commerce'
    };

    const calculateExpectedReturn = () => {
        const amount = parseFloat(investAmount) || 0;
        const rate = campaign?.interest_rate || 5;
        const months = campaign?.duration_months || 24;
        return amount * (1 + (rate / 100) * (months / 12));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!campaign) return null;

    const PropertyIcon = getPropertyIcon(campaign.property_type);
    const progress = Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100);

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/campaigns')}
                    className="mb-6"
                    data-testid="back-button"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux campagnes
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero image */}
                        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-muted">
                            {campaign.images?.[0] ? (
                                <img 
                                    src={campaign.images[0]} 
                                    alt={campaign.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <PropertyIcon className="h-24 w-24 text-muted-foreground/50" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="badge-success">
                                    {propertyTypeLabels[campaign.property_type]}
                                </Badge>
                                {campaign.notary_validated && (
                                    <Badge className="bg-primary">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Validé par notaire
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Title and location */}
                        <div>
                            <h1 className="heading-1 mb-2" data-testid="campaign-title">{campaign.title}</h1>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{campaign.location}</span>
                            </div>
                        </div>

                        {/* Owner info */}
                        {campaign.user && (
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarImage src={campaign.user.picture} />
                                    <AvatarFallback>{campaign.user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{campaign.user.name}</p>
                                    <p className="text-sm text-muted-foreground">Porteur du projet</p>
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Description */}
                        <div>
                            <h2 className="heading-3 mb-4">Description du projet</h2>
                            <p className="body-base text-muted-foreground whitespace-pre-line">
                                {campaign.description}
                            </p>
                        </div>

                        {/* Story */}
                        <div>
                            <h2 className="heading-3 mb-4">L'histoire de ce bien</h2>
                            <div className="p-6 bg-muted/50 rounded-xl border">
                                <p className="body-base text-muted-foreground whitespace-pre-line italic">
                                    {campaign.story || "Aucune histoire partagée pour le moment."}
                                </p>
                            </div>
                        </div>

                        {/* Property details */}
                        <div>
                            <h2 className="heading-3 mb-4">Détails du bien</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="pt-6 text-center">
                                        <PropertyIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">Type</p>
                                        <p className="font-semibold">{propertyTypeLabels[campaign.property_type]}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6 text-center">
                                        <Landmark className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">Valeur estimée</p>
                                        <p className="font-semibold">{formatCurrency(campaign.property_value)}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6 text-center">
                                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">Rendement</p>
                                        <p className="font-semibold">{campaign.interest_rate}% / an</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6 text-center">
                                        <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">Durée</p>
                                        <p className="font-semibold">{campaign.duration_months} mois</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Gallery */}
                        {campaign.images?.length > 1 && (
                            <div>
                                <h2 className="heading-3 mb-4">Galerie photos</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {campaign.images.slice(1).map((img, index) => (
                                        <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                                            <img 
                                                src={img} 
                                                alt={`Photo ${index + 2}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Investment card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="border-2" data-testid="investment-card">
                                <CardHeader>
                                    <CardTitle className="heading-3">Investir dans ce projet</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-2xl font-bold text-primary">
                                                {formatCurrency(campaign.raised_amount)}
                                            </span>
                                            <span className="text-muted-foreground">
                                                sur {formatCurrency(campaign.target_amount)}
                                            </span>
                                        </div>
                                        <Progress value={progress} className="h-3" />
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{Math.round(progress)}% financé</span>
                                            <span className="flex items-center">
                                                <Users className="h-4 w-4 mr-1" />
                                                {campaign.investors_count || 0} investisseurs
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Investment amount */}
                                    <div className="space-y-3">
                                        <Label htmlFor="amount">Montant de l'investissement</Label>
                                        <div className="relative">
                                            <Input
                                                id="amount"
                                                type="number"
                                                min="50"
                                                step="10"
                                                value={investAmount}
                                                onChange={(e) => setInvestAmount(e.target.value)}
                                                className="text-lg font-semibold pr-12"
                                                data-testid="invest-amount"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Minimum 50€</p>
                                    </div>

                                    {/* Quick amounts */}
                                    <div className="flex gap-2 flex-wrap">
                                        {[50, 100, 250, 500, 1000].map((amount) => (
                                            <Button
                                                key={amount}
                                                variant={investAmount === String(amount) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setInvestAmount(String(amount))}
                                            >
                                                {amount}€
                                            </Button>
                                        ))}
                                    </div>

                                    {/* Expected return */}
                                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                        <p className="text-sm text-muted-foreground mb-1">Rendement attendu</p>
                                        <p className="text-xl font-bold text-primary">
                                            {formatCurrency(calculateExpectedReturn())}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Soit +{formatCurrency(calculateExpectedReturn() - parseFloat(investAmount || 0))} sur {campaign.duration_months} mois
                                        </p>
                                    </div>

                                    {/* Invest button */}
                                    <Button 
                                        className="w-full btn-primary h-12 text-lg"
                                        onClick={handleInvest}
                                        disabled={investing || campaign.status !== 'active'}
                                        data-testid="invest-button"
                                    >
                                        {investing ? 'Traitement...' : 'Investir maintenant'}
                                    </Button>

                                    {/* Security notice */}
                                    <div className="flex items-start space-x-2 text-xs text-muted-foreground">
                                        <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <p>
                                            Investissement sécurisé par une garantie hypothécaire sur le bien. 
                                            Paiement via Stripe.
                                        </p>
                                    </div>

                                    {!campaign.notary_validated && (
                                        <div className="flex items-start space-x-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                            <p>
                                                Ce projet n'a pas encore été validé par un notaire partenaire.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

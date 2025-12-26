import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import axios from 'axios';
import { 
    Search, 
    MapPin, 
    Home, 
    Building, 
    Landmark, 
    Briefcase,
    TrendingUp,
    Users,
    Clock,
    Filter
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Campaigns() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('all');

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get(`${API}/campaigns`);
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

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            campaign.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = propertyFilter === 'all' || campaign.property_type === propertyFilter;
        return matchesSearch && matchesType;
    });

    const getProgressPercentage = (raised, target) => {
        return Math.min((raised / target) * 100, 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="heading-1 mb-4" data-testid="campaigns-title">
                        Campagnes <em className="italic text-primary">actives</em>
                    </h1>
                    <p className="body-large text-muted-foreground">
                        Investissez dans des projets patrimoniaux sécurisés et aidez des familles à préserver leur héritage.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par titre ou lieu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            data-testid="campaigns-search"
                        />
                    </div>
                    <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                        <SelectTrigger className="w-full md:w-48" data-testid="campaigns-filter">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type de bien" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="house">Maisons</SelectItem>
                            <SelectItem value="apartment">Appartements</SelectItem>
                            <SelectItem value="land">Terrains</SelectItem>
                            <SelectItem value="business">Commerces</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Campaign Grid */}
                {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-16">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="heading-3 mb-2">Aucune campagne trouvée</h3>
                        <p className="text-muted-foreground">
                            {searchTerm || propertyFilter !== 'all' 
                                ? 'Essayez de modifier vos filtres' 
                                : 'Aucune campagne active pour le moment'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign) => {
                            const PropertyIcon = getPropertyIcon(campaign.property_type);
                            const progress = getProgressPercentage(campaign.raised_amount, campaign.target_amount);
                            
                            return (
                                <Card 
                                    key={campaign.campaign_id} 
                                    className="campaign-card overflow-hidden"
                                    data-testid={`campaign-${campaign.campaign_id}`}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 bg-muted">
                                        {campaign.images?.[0] ? (
                                            <img 
                                                src={campaign.images[0]} 
                                                alt={campaign.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <PropertyIcon className="h-16 w-16 text-muted-foreground/50" />
                                            </div>
                                        )}
                                        <Badge className="absolute top-3 left-3 badge-success">
                                            {propertyTypeLabels[campaign.property_type] || campaign.property_type}
                                        </Badge>
                                        {campaign.notary_validated && (
                                            <Badge className="absolute top-3 right-3 bg-primary">
                                                Validé par notaire
                                            </Badge>
                                        )}
                                    </div>

                                    <CardContent className="pt-6">
                                        <h3 className="heading-3 mb-2 line-clamp-1">{campaign.title}</h3>
                                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{campaign.location}</span>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                            {campaign.description}
                                        </p>

                                        {/* Progress */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold">{formatCurrency(campaign.raised_amount)}</span>
                                                <span className="text-muted-foreground">sur {formatCurrency(campaign.target_amount)}</span>
                                            </div>
                                            <Progress value={progress} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{Math.round(progress)}% financé</span>
                                                <span>{campaign.investors_count || 0} investisseurs</span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="h-4 w-4 text-primary" />
                                                <div>
                                                    <p className="text-sm font-semibold">{campaign.interest_rate}%</p>
                                                    <p className="text-xs text-muted-foreground">Rendement</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <div>
                                                    <p className="text-sm font-semibold">{campaign.duration_months} mois</p>
                                                    <p className="text-xs text-muted-foreground">Durée</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0">
                                        <Button 
                                            className="w-full btn-primary"
                                            onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}
                                            data-testid={`invest-btn-${campaign.campaign_id}`}
                                        >
                                            Voir le projet
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* CTA for heirs */}
                <div className="mt-16 text-center p-8 rounded-xl bg-muted/50 border">
                    <h2 className="heading-2 mb-4">Vous avez un bien à financer ?</h2>
                    <p className="text-muted-foreground mb-6">
                        Créez votre campagne et obtenez le financement dont vous avez besoin pour payer vos droits de succession.
                    </p>
                    <Button 
                        className="btn-accent"
                        onClick={() => isAuthenticated ? navigate('/dashboard/heir/create') : login()}
                        data-testid="create-campaign-cta"
                    >
                        Créer ma campagne
                    </Button>
                </div>
            </div>
        </div>
    );
}

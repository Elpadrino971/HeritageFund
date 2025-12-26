import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDropzone } from 'react-dropzone';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { toast } from 'sonner';
import axios from 'axios';
import { 
    ArrowLeft, 
    ArrowRight, 
    Home, 
    Building, 
    Landmark, 
    Briefcase,
    CheckCircle,
    Upload,
    X,
    Loader2
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CreateCampaign() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        story: '',
        property_type: 'house',
        property_value: '',
        location: '',
        target_amount: '',
        interest_rate: 5,
        duration_months: 24,
        images: []
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const propertyTypes = [
        { value: 'house', label: 'Maison', icon: Home },
        { value: 'apartment', label: 'Appartement', icon: Building },
        { value: 'land', label: 'Terrain', icon: Landmark },
        { value: 'business', label: 'Commerce', icon: Briefcase }
    ];

    const validateStep = () => {
        switch(step) {
            case 1:
                if (!formData.title || !formData.location || !formData.property_type) {
                    toast.error('Veuillez remplir tous les champs obligatoires');
                    return false;
                }
                break;
            case 2:
                if (!formData.description) {
                    toast.error('Veuillez ajouter une description');
                    return false;
                }
                break;
            case 3:
                if (!formData.property_value || !formData.target_amount) {
                    toast.error('Veuillez renseigner les montants');
                    return false;
                }
                if (parseFloat(formData.target_amount) > parseFloat(formData.property_value)) {
                    toast.error('Le montant demandé ne peut pas dépasser la valeur du bien');
                    return false;
                }
                break;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (publish = false) => {
        if (!validateStep()) return;
        
        setLoading(true);
        try {
            const campaignData = {
                ...formData,
                property_value: parseFloat(formData.property_value),
                target_amount: parseFloat(formData.target_amount),
                interest_rate: formData.interest_rate,
                duration_months: formData.duration_months
            };
            
            const response = await axios.post(`${API}/campaigns`, campaignData, { withCredentials: true });
            
            if (publish) {
                await axios.post(`${API}/campaigns/${response.data.campaign_id}/publish`, {}, { withCredentials: true });
                toast.success('Campagne publiée avec succès !');
            } else {
                toast.success('Campagne enregistrée en brouillon');
            }
            
            navigate('/dashboard/heir');
        } catch (err) {
            console.error('Error creating campaign:', err);
            toast.error('Erreur lors de la création de la campagne');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/dashboard/heir')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>
                    <h1 className="heading-1" data-testid="create-campaign-title">
                        Créer une <em className="italic text-primary">campagne</em>
                    </h1>
                </div>

                {/* Progress steps */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                            </div>
                            {s < 4 && (
                                <div className={`w-full h-1 mx-2 rounded transition-colors ${
                                    step > s ? 'bg-primary' : 'bg-muted'
                                }`} style={{ width: '60px' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step content */}
                <Card className="border-2">
                    {/* Step 1: Basic info */}
                    {step === 1 && (
                        <>
                            <CardHeader>
                                <CardTitle className="heading-3">Informations de base</CardTitle>
                                <CardDescription>Présentez votre bien familial</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre de la campagne *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Ex: Maison familiale de Provence"
                                        value={formData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        data-testid="input-title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Localisation *</Label>
                                    <Input
                                        id="location"
                                        placeholder="Ex: Aix-en-Provence, 13"
                                        value={formData.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        data-testid="input-location"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Type de bien *</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {propertyTypes.map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => updateField('property_type', value)}
                                                className={`p-4 rounded-lg border-2 transition-colors text-center ${
                                                    formData.property_type === value
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-muted hover:border-primary/50'
                                                }`}
                                                data-testid={`property-type-${value}`}
                                            >
                                                <Icon className={`h-8 w-8 mx-auto mb-2 ${
                                                    formData.property_type === value ? 'text-primary' : 'text-muted-foreground'
                                                }`} />
                                                <span className={`text-sm font-medium ${
                                                    formData.property_type === value ? 'text-primary' : ''
                                                }`}>{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Step 2: Description & Story */}
                    {step === 2 && (
                        <>
                            <CardHeader>
                                <CardTitle className="heading-3">Votre histoire</CardTitle>
                                <CardDescription>Racontez l'histoire de ce bien pour toucher les investisseurs</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description du projet *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Décrivez votre situation et pourquoi vous avez besoin de financement..."
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        rows={4}
                                        data-testid="input-description"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="story">L'histoire de ce bien</Label>
                                    <Textarea
                                        id="story"
                                        placeholder="Racontez l'histoire de ce bien : depuis combien de temps il est dans la famille, les souvenirs qui y sont attachés..."
                                        value={formData.story}
                                        onChange={(e) => updateField('story', e.target.value)}
                                        rows={6}
                                        data-testid="input-story"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Une histoire touchante augmente vos chances de succès de 60%
                                    </p>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Step 3: Financial details */}
                    {step === 3 && (
                        <>
                            <CardHeader>
                                <CardTitle className="heading-3">Détails financiers</CardTitle>
                                <CardDescription>Définissez les paramètres de votre levée de fonds</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="property_value">Valeur du bien (€) *</Label>
                                        <Input
                                            id="property_value"
                                            type="number"
                                            placeholder="Ex: 300000"
                                            value={formData.property_value}
                                            onChange={(e) => updateField('property_value', e.target.value)}
                                            data-testid="input-property-value"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_amount">Montant à lever (€) *</Label>
                                        <Input
                                            id="target_amount"
                                            type="number"
                                            placeholder="Ex: 50000"
                                            value={formData.target_amount}
                                            onChange={(e) => updateField('target_amount', e.target.value)}
                                            data-testid="input-target-amount"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Taux d'intérêt annuel</Label>
                                        <span className="font-semibold text-primary">{formData.interest_rate}%</span>
                                    </div>
                                    <Slider
                                        value={[formData.interest_rate]}
                                        onValueChange={([value]) => updateField('interest_rate', value)}
                                        min={3}
                                        max={8}
                                        step={0.5}
                                        data-testid="slider-interest"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Un taux plus élevé attire plus d'investisseurs mais augmente votre coût
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Durée du prêt</Label>
                                    <Select 
                                        value={String(formData.duration_months)}
                                        onValueChange={(value) => updateField('duration_months', parseInt(value))}
                                    >
                                        <SelectTrigger data-testid="select-duration">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="12">12 mois</SelectItem>
                                            <SelectItem value="24">24 mois</SelectItem>
                                            <SelectItem value="36">36 mois</SelectItem>
                                            <SelectItem value="48">48 mois</SelectItem>
                                            <SelectItem value="60">60 mois</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Cost preview */}
                                {formData.target_amount && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-2">Coût total estimé</p>
                                        <p className="text-xl font-bold">
                                            {formatCurrency(
                                                parseFloat(formData.target_amount) * 
                                                (1 + (formData.interest_rate / 100) * (formData.duration_months / 12))
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Capital + intérêts sur {formData.duration_months} mois
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </>
                    )}

                    {/* Step 4: Photos & Review */}
                    {step === 4 && (
                        <>
                            <CardHeader>
                                <CardTitle className="heading-3">Photos et validation</CardTitle>
                                <CardDescription>Ajoutez des photos et vérifiez votre campagne</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Photo upload with dropzone */}
                                <div className="space-y-2">
                                    <Label>Photos du bien</Label>
                                    <ImageUploader 
                                        images={formData.images}
                                        onImagesChange={(images) => updateField('images', images)}
                                        uploading={uploading}
                                        setUploading={setUploading}
                                    />
                                </div>

                                {/* Summary */}
                                <div className="space-y-4 p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold">Récapitulatif</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">Titre:</span>
                                        <span className="font-medium">{formData.title}</span>
                                        <span className="text-muted-foreground">Lieu:</span>
                                        <span className="font-medium">{formData.location}</span>
                                        <span className="text-muted-foreground">Montant:</span>
                                        <span className="font-medium">{formatCurrency(formData.target_amount)}</span>
                                        <span className="text-muted-foreground">Taux:</span>
                                        <span className="font-medium">{formData.interest_rate}% / an</span>
                                        <span className="text-muted-foreground">Durée:</span>
                                        <span className="font-medium">{formData.duration_months} mois</span>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between p-6 border-t">
                        {step > 1 ? (
                            <Button variant="outline" onClick={prevStep}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Précédent
                            </Button>
                        ) : (
                            <div />
                        )}
                        
                        {step < 4 ? (
                            <Button className="btn-primary" onClick={nextStep} data-testid="next-step-btn">
                                Suivant
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleSubmit(false)}
                                    disabled={loading}
                                    data-testid="save-draft-btn"
                                >
                                    Enregistrer en brouillon
                                </Button>
                                <Button 
                                    className="btn-primary" 
                                    onClick={() => handleSubmit(true)}
                                    disabled={loading}
                                    data-testid="publish-btn"
                                >
                                    {loading ? 'Publication...' : 'Publier la campagne'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

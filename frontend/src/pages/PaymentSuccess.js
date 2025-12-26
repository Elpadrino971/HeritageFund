import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [status, setStatus] = useState('checking'); // checking, success, failed
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            pollPaymentStatus(sessionId);
        } else {
            setStatus('failed');
        }
    }, [searchParams]);

    const pollPaymentStatus = async (sessionId, attempts = 0) => {
        const maxAttempts = 5;
        const pollInterval = 2000;

        if (attempts >= maxAttempts) {
            setStatus('failed');
            return;
        }

        try {
            const response = await axios.get(`${API}/payments/status/${sessionId}`, {
                withCredentials: true
            });

            if (response.data.payment_status === 'paid') {
                setStatus('success');
                setPaymentData(response.data);
                return;
            } else if (response.data.status === 'expired') {
                setStatus('failed');
                return;
            }

            // Continue polling
            setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
        } catch (error) {
            console.error('Error checking payment status:', error);
            if (attempts < maxAttempts - 1) {
                setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
            } else {
                setStatus('failed');
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-8 pb-8 text-center">
                    {status === 'checking' && (
                        <>
                            <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                            <h1 className="heading-2 mb-2">Vérification du paiement</h1>
                            <p className="text-muted-foreground">
                                Veuillez patienter pendant que nous confirmons votre paiement...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <h1 className="heading-2 mb-2" data-testid="payment-success-title">
                                Paiement réussi !
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                Votre investissement de {paymentData && formatCurrency(paymentData.amount)} a été enregistré.
                            </p>
                            <div className="space-y-3">
                                <Button 
                                    className="w-full btn-primary"
                                    onClick={() => navigate('/dashboard/investor')}
                                    data-testid="go-to-portfolio"
                                >
                                    Voir mon portfolio
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/campaigns')}
                                >
                                    Continuer à investir
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="h-12 w-12 text-red-600" />
                            </div>
                            <h1 className="heading-2 mb-2" data-testid="payment-failed-title">
                                Paiement échoué
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                Le paiement n'a pas pu être confirmé. Veuillez réessayer ou contacter le support.
                            </p>
                            <div className="space-y-3">
                                <Button 
                                    className="w-full btn-primary"
                                    onClick={() => navigate('/campaigns')}
                                >
                                    Réessayer
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/')}
                                >
                                    Retour à l'accueil
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

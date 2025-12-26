import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">H</span>
                            </div>
                            <span className="font-semibold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                                HeritageFund
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Préservez votre patrimoine familial grâce au financement participatif.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Plateforme</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/campaigns" className="hover:text-foreground transition-colors">Campagnes</Link></li>
                            <li><Link to="/calculator" className="hover:text-foreground transition-colors">Calculateur</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">Comment ça marche</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Héritiers</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/dashboard/heir" className="hover:text-foreground transition-colors">Créer une campagne</Link></li>
                            <li><Link to="/faq-heirs" className="hover:text-foreground transition-colors">FAQ Héritiers</Link></li>
                            <li><Link to="/testimonials" className="hover:text-foreground transition-colors">Témoignages</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Investisseurs</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/dashboard/investor" className="hover:text-foreground transition-colors">Mon portfolio</Link></li>
                            <li><Link to="/faq-investors" className="hover:text-foreground transition-colors">FAQ Investisseurs</Link></li>
                            <li><Link to="/risks" className="hover:text-foreground transition-colors">Risques</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} HeritageFund. Tous droits réservés.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-muted-foreground">
                        <Link to="/legal" className="hover:text-foreground transition-colors">Mentions légales</Link>
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Confidentialité</Link>
                        <Link to="/terms" className="hover:text-foreground transition-colors">CGU</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
    Home, 
    Calculator, 
    Briefcase, 
    TrendingUp, 
    Scale,
    Sun,
    Moon,
    Menu,
    X,
    LogOut,
    User,
    Settings
} from 'lucide-react';

export default function Navbar() {
    const { user, login, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Accueil', icon: Home },
        { href: '/calculator', label: 'Calculateur', icon: Calculator },
        { href: '/campaigns', label: 'Campagnes', icon: Briefcase },
    ];

    const authLinks = [
        { href: '/dashboard/heir', label: 'Héritier', icon: Briefcase, role: 'heir' },
        { href: '/dashboard/investor', label: 'Investisseur', icon: TrendingUp, role: 'investor' },
        { href: '/dashboard/notary', label: 'Notaire', icon: Scale, role: 'notary' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center space-x-2"
                        data-testid="logo-link"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">H</span>
                        </div>
                        <span className="font-semibold text-xl tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                            HeritageFund
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                data-testid={`nav-${link.label.toLowerCase()}`}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-2">
                        {/* Theme toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            data-testid="theme-toggle"
                            className="rounded-full"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Auth section */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="relative h-10 w-10 rounded-full"
                                        data-testid="user-menu-trigger"
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user?.picture} alt={user?.name} />
                                            <AvatarFallback>
                                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    {authLinks.map((link) => (
                                        <DropdownMenuItem 
                                            key={link.href} 
                                            onClick={() => navigate(link.href)}
                                            data-testid={`menu-${link.role}`}
                                        >
                                            <link.icon className="mr-2 h-4 w-4" />
                                            <span>Espace {link.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="menu-profile">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/settings')} data-testid="menu-settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Paramètres</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Déconnexion</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button 
                                onClick={login} 
                                className="btn-primary"
                                data-testid="login-button"
                            >
                                Connexion
                            </Button>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            data-testid="mobile-menu-toggle"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 mobile-menu-enter">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                                    isActive(link.href)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            >
                                <link.icon className="h-4 w-4" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <>
                                <div className="border-t my-2" />
                                {authLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        <span>Espace {link.label}</span>
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

import { Outlet, Link } from 'react-router-dom'
import { Calculator, Home, TrendingUp, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/calculator', label: 'Calculateur', icon: Calculator },
    { path: '/campaigns', label: 'Campagnes', icon: TrendingUp },
  ]

  const getDashboardPath = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'investor':
        return '/dashboard/investor'
      case 'heir':
        return '/dashboard/heir'
      case 'notary':
        return '/dashboard/notary'
      default:
        return '/dashboard/investor'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg-secondary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-bold text-light-primary dark:text-dark-primary">
                HeritageFund
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              {user ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.full_name || user.email}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-accent dark:hover:text-dark-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary">
                  Connexion
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-light-border dark:border-dark-border">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 py-2"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 py-2"
                  >
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 py-2 text-light-accent dark:text-dark-accent"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary block text-center"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-light-border dark:border-dark-border py-8 bg-light-bg-secondary dark:bg-dark-bg-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🏛️</span>
                <span className="font-bold text-light-primary dark:text-dark-primary">
                  HeritageFund
                </span>
              </div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Préservez votre patrimoine familial
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <li><Link to="/campaigns">Campagnes</Link></li>
                <li><Link to="/calculator">Calculateur</Link></li>
                <li><Link to="/pricing">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <li><Link to="/about">À propos</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <li><Link to="/terms">CGU</Link></li>
                <li><Link to="/privacy">Confidentialité</Link></li>
                <li><Link to="/legal">Mentions légales</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-light-border dark:border-dark-border text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <p>© 2026 HeritageFund SAS • CIP agrément AMF en cours</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      // Navigation
      nav: {
        home: "Accueil",
        calculator: "Calculateur",
        campaigns: "Campagnes",
        login: "Connexion",
        logout: "Déconnexion",
        profile: "Profil",
        settings: "Paramètres",
        heirSpace: "Espace Héritier",
        investorSpace: "Espace Investisseur",
        notarySpace: "Espace Notaire"
      },
      // Hero
      hero: {
        title: "Préservez votre",
        titleHighlight: "héritage familial",
        subtitle: "Ne laissez pas les frais de succession vous forcer à vendre le patrimoine familial. Financez vos droits grâce à notre communauté d'investisseurs.",
        ctaHeir: "Je suis héritier",
        ctaInvestor: "Je veux investir"
      },
      // Stats
      stats: {
        activeCampaigns: "Campagnes actives",
        fundsRaised: "Fonds levés",
        investors: "Investisseurs",
        successRate: "Taux de succès"
      },
      // Calculator
      calculator: {
        title: "Calculez vos droits de",
        titleHighlight: "succession",
        subtitle: "Estimez gratuitement les frais de succession que vous devrez payer selon le barème fiscal français en vigueur.",
        propertyValue: "Valeur du bien (€)",
        relationship: "Lien de parenté",
        previousDonations: "Donations antérieures (€)",
        disability: "Situation de handicap",
        calculate: "Calculer mes droits",
        result: "Résultat de votre simulation",
        abatement: "Abattement",
        taxableAmount: "Base taxable",
        effectiveRate: "Taux effectif",
        taxToPay: "Droits à payer",
        netInheritance: "Héritage net",
        launchCampaign: "Lancer une campagne",
        relationships: {
          spouse: "Conjoint (exonéré)",
          direct_line: "Enfant (ligne directe)",
          sibling: "Frère/Soeur",
          nephew_niece: "Neveu/Nièce",
          other: "Autre"
        }
      },
      // How it works
      howItWorks: {
        title: "Comment ça",
        titleHighlight: "fonctionne",
        subtitle: "Un processus simple et sécurisé pour financer vos droits de succession",
        step1Title: "Créez votre campagne",
        step1Desc: "Présentez votre bien familial, son histoire et le montant dont vous avez besoin.",
        step2Title: "Collectez des fonds",
        step2Desc: "Les investisseurs participent à votre campagne avec un prêt participatif sécurisé.",
        step3Title: "Préservez votre patrimoine",
        step3Desc: "Payez vos droits de succession et gardez votre bien. Remboursez à votre rythme."
      },
      // Benefits
      benefits: {
        forHeirs: "Pour les",
        forHeirsHighlight: "héritiers",
        heir1: "40% moins cher qu'un crédit hypothécaire classique",
        heir2: "Financement en 30-45 jours au lieu de 3 mois en banque",
        heir3: "Remboursement anticipé sans pénalités",
        heir4: "Accompagnement juridique par des notaires partenaires",
        createCampaign: "Créer ma campagne",
        forInvestors: "Pour les",
        forInvestorsHighlight: "investisseurs",
        investor1: "Rendement 4-7% annuel sur des prêts sécurisés",
        investor2: "Garantie hypothécaire sur des biens immobiliers",
        investor3: "Investissement à partir de 50€ seulement",
        investor4: "Impact social : aidez des familles à préserver leur patrimoine",
        seeCampaigns: "Voir les campagnes"
      },
      // CTA
      cta: {
        title: "Prêt à préserver votre",
        titleHighlight: "héritage",
        subtitle: "Rejoignez les familles qui ont choisi HeritageFund pour protéger leur patrimoine.",
        launchCampaign: "Lancer ma campagne",
        discoverCampaigns: "Découvrir les campagnes"
      },
      // Campaigns
      campaigns: {
        title: "Campagnes",
        titleHighlight: "actives",
        subtitle: "Investissez dans des projets patrimoniaux sécurisés et aidez des familles à préserver leur héritage.",
        search: "Rechercher par titre ou lieu...",
        filter: "Type de bien",
        allTypes: "Tous les types",
        houses: "Maisons",
        apartments: "Appartements",
        lands: "Terrains",
        businesses: "Commerces",
        noCampaigns: "Aucune campagne trouvée",
        modifyFilters: "Essayez de modifier vos filtres",
        funded: "financé",
        investors: "investisseurs",
        return: "Rendement",
        duration: "Durée",
        months: "mois",
        viewProject: "Voir le projet",
        validatedByNotary: "Validé par notaire",
        propertyTypes: {
          house: "Maison",
          apartment: "Appartement",
          land: "Terrain",
          business: "Commerce"
        }
      },
      // Campaign detail
      campaignDetail: {
        backToCampaigns: "Retour aux campagnes",
        projectOwner: "Porteur du projet",
        projectDescription: "Description du projet",
        propertyStory: "L'histoire de ce bien",
        propertyDetails: "Détails du bien",
        type: "Type",
        estimatedValue: "Valeur estimée",
        investInProject: "Investir dans ce projet",
        investmentAmount: "Montant de l'investissement",
        minimum: "Minimum 50€",
        expectedReturn: "Rendement attendu",
        over: "sur",
        investNow: "Investir maintenant",
        securedInvestment: "Investissement sécurisé par une garantie hypothécaire sur le bien. Paiement via Stripe.",
        notValidated: "Ce projet n'a pas encore été validé par un notaire partenaire."
      },
      // Dashboards
      dashboard: {
        heir: {
          title: "Espace",
          titleHighlight: "Héritier",
          subtitle: "Gérez vos campagnes de financement",
          newCampaign: "Nouvelle campagne",
          fundsRaised: "Fonds levés",
          activeCampaigns: "Campagnes actives",
          totalCampaigns: "Total campagnes",
          myCampaigns: "Mes campagnes",
          noCampaigns: "Aucune campagne",
          createFirst: "Créez votre première campagne pour commencer à lever des fonds"
        },
        investor: {
          title: "Espace",
          titleHighlight: "Investisseur",
          subtitle: "Suivez vos investissements et revenus",
          seeCampaigns: "Voir les campagnes",
          totalInvested: "Total investi",
          expectedReturn: "Rendement attendu",
          activeInvestments: "Investissements actifs",
          averageRate: "Taux moyen",
          portfolioEvolution: "Évolution du portefeuille",
          myInvestments: "Mes investissements",
          noInvestments: "Aucun investissement",
          discoverCampaigns: "Découvrez les campagnes et commencez à investir",
          securedReturn: "Rendement sécurisé",
          securedReturnDesc: "Tous les investissements sont sécurisés par une garantie hypothécaire sur le bien."
        },
        notary: {
          title: "Espace",
          titleHighlight: "Notaire",
          subtitle: "Validez les campagnes et suivez vos commissions",
          pending: "En attente",
          validated: "Validées",
          totalCommission: "Commissions totales",
          campaignsToValidate: "Campagnes à valider",
          noPending: "Aucune campagne en attente",
          newCampaignsWillAppear: "Les nouvelles campagnes apparaîtront ici pour validation",
          validate: "Valider",
          commissionStructure: "Structure des commissions",
          commissionPerCampaign: "Commission par campagne validée",
          ofRaisedAmount: "du montant levé une fois financée",
          conditions: "Conditions"
        }
      },
      // Create campaign
      createCampaign: {
        title: "Créer une",
        titleHighlight: "campagne",
        back: "Retour",
        step1: "Informations de base",
        step1Desc: "Présentez votre bien familial",
        campaignTitle: "Titre de la campagne",
        location: "Localisation",
        propertyType: "Type de bien",
        step2: "Votre histoire",
        step2Desc: "Racontez l'histoire de ce bien pour toucher les investisseurs",
        projectDescription: "Description du projet",
        propertyStory: "L'histoire de ce bien",
        storyTip: "Une histoire touchante augmente vos chances de succès de 60%",
        step3: "Détails financiers",
        step3Desc: "Définissez les paramètres de votre levée de fonds",
        propertyValue: "Valeur du bien (€)",
        targetAmount: "Montant à lever (€)",
        interestRate: "Taux d'intérêt annuel",
        higherRateTip: "Un taux plus élevé attire plus d'investisseurs mais augmente votre coût",
        loanDuration: "Durée du prêt",
        totalCost: "Coût total estimé",
        capitalPlusInterest: "Capital + intérêts sur",
        step4: "Photos et validation",
        step4Desc: "Ajoutez des photos et vérifiez votre campagne",
        photos: "Photos du bien",
        dragPhotos: "Glissez vos photos ici ou cliquez pour sélectionner",
        maxPhotos: "PNG, JPG, WebP jusqu'à 5MB - Max 10 photos",
        main: "Principale",
        summary: "Récapitulatif",
        previous: "Précédent",
        next: "Suivant",
        saveDraft: "Enregistrer en brouillon",
        publish: "Publier la campagne"
      },
      // Payment
      payment: {
        verifying: "Vérification du paiement",
        pleaseWait: "Veuillez patienter pendant que nous confirmons votre paiement...",
        success: "Paiement réussi !",
        investmentRecorded: "Votre investissement a été enregistré.",
        viewPortfolio: "Voir mon portfolio",
        continueInvesting: "Continuer à investir",
        failed: "Paiement échoué",
        failedDesc: "Le paiement n'a pas pu être confirmé. Veuillez réessayer ou contacter le support.",
        retry: "Réessayer",
        backToHome: "Retour à l'accueil"
      },
      // Footer
      footer: {
        description: "Préservez votre patrimoine familial grâce au financement participatif.",
        platform: "Plateforme",
        howItWorks: "Comment ça marche",
        heirs: "Héritiers",
        createCampaign: "Créer une campagne",
        faqHeirs: "FAQ Héritiers",
        testimonials: "Témoignages",
        investors: "Investisseurs",
        myPortfolio: "Mon portfolio",
        faqInvestors: "FAQ Investisseurs",
        risks: "Risques",
        legal: "Mentions légales",
        privacy: "Confidentialité",
        terms: "CGU",
        allRights: "Tous droits réservés."
      },
      // Common
      common: {
        loading: "Chargement...",
        error: "Erreur",
        success: "Succès",
        cancel: "Annuler",
        confirm: "Confirmer",
        save: "Enregistrer",
        delete: "Supprimer",
        edit: "Modifier",
        view: "Voir",
        close: "Fermer",
        yes: "Oui",
        no: "Non"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        calculator: "Calculator",
        campaigns: "Campaigns",
        login: "Login",
        logout: "Logout",
        profile: "Profile",
        settings: "Settings",
        heirSpace: "Heir Dashboard",
        investorSpace: "Investor Dashboard",
        notarySpace: "Notary Dashboard"
      },
      hero: {
        title: "Preserve your",
        titleHighlight: "family heritage",
        subtitle: "Don't let inheritance taxes force you to sell your family property. Finance your rights through our community of investors.",
        ctaHeir: "I'm an heir",
        ctaInvestor: "I want to invest"
      },
      stats: {
        activeCampaigns: "Active campaigns",
        fundsRaised: "Funds raised",
        investors: "Investors",
        successRate: "Success rate"
      },
      calculator: {
        title: "Calculate your",
        titleHighlight: "inheritance tax",
        subtitle: "Get a free estimate of the inheritance tax you'll need to pay based on French tax rates.",
        propertyValue: "Property value (€)",
        relationship: "Relationship",
        previousDonations: "Previous donations (€)",
        disability: "Disability status",
        calculate: "Calculate my tax",
        result: "Your simulation result",
        abatement: "Allowance",
        taxableAmount: "Taxable amount",
        effectiveRate: "Effective rate",
        taxToPay: "Tax to pay",
        netInheritance: "Net inheritance",
        launchCampaign: "Launch a campaign",
        relationships: {
          spouse: "Spouse (exempt)",
          direct_line: "Child (direct line)",
          sibling: "Sibling",
          nephew_niece: "Nephew/Niece",
          other: "Other"
        }
      },
      howItWorks: {
        title: "How it",
        titleHighlight: "works",
        subtitle: "A simple and secure process to finance your inheritance tax",
        step1Title: "Create your campaign",
        step1Desc: "Present your family property, its story and the amount you need.",
        step2Title: "Collect funds",
        step2Desc: "Investors participate in your campaign with a secured participatory loan.",
        step3Title: "Preserve your heritage",
        step3Desc: "Pay your inheritance tax and keep your property. Repay at your own pace."
      },
      benefits: {
        forHeirs: "For",
        forHeirsHighlight: "heirs",
        heir1: "40% cheaper than a traditional mortgage",
        heir2: "Funding in 30-45 days instead of 3 months with banks",
        heir3: "Early repayment without penalties",
        heir4: "Legal support from partner notaries",
        createCampaign: "Create my campaign",
        forInvestors: "For",
        forInvestorsHighlight: "investors",
        investor1: "4-7% annual return on secured loans",
        investor2: "Mortgage guarantee on real estate",
        investor3: "Investment starting from just €50",
        investor4: "Social impact: help families preserve their heritage",
        seeCampaigns: "See campaigns"
      },
      cta: {
        title: "Ready to preserve your",
        titleHighlight: "heritage",
        subtitle: "Join the families who chose HeritageFund to protect their assets.",
        launchCampaign: "Launch my campaign",
        discoverCampaigns: "Discover campaigns"
      },
      campaigns: {
        title: "Active",
        titleHighlight: "campaigns",
        subtitle: "Invest in secured heritage projects and help families preserve their legacy.",
        search: "Search by title or location...",
        filter: "Property type",
        allTypes: "All types",
        houses: "Houses",
        apartments: "Apartments",
        lands: "Land",
        businesses: "Businesses",
        noCampaigns: "No campaigns found",
        modifyFilters: "Try modifying your filters",
        funded: "funded",
        investors: "investors",
        return: "Return",
        duration: "Duration",
        months: "months",
        viewProject: "View project",
        validatedByNotary: "Validated by notary",
        propertyTypes: {
          house: "House",
          apartment: "Apartment",
          land: "Land",
          business: "Business"
        }
      },
      campaignDetail: {
        backToCampaigns: "Back to campaigns",
        projectOwner: "Project owner",
        projectDescription: "Project description",
        propertyStory: "The story of this property",
        propertyDetails: "Property details",
        type: "Type",
        estimatedValue: "Estimated value",
        investInProject: "Invest in this project",
        investmentAmount: "Investment amount",
        minimum: "Minimum €50",
        expectedReturn: "Expected return",
        over: "over",
        investNow: "Invest now",
        securedInvestment: "Investment secured by a mortgage on the property. Payment via Stripe.",
        notValidated: "This project has not yet been validated by a partner notary."
      },
      dashboard: {
        heir: {
          title: "Heir",
          titleHighlight: "Dashboard",
          subtitle: "Manage your funding campaigns",
          newCampaign: "New campaign",
          fundsRaised: "Funds raised",
          activeCampaigns: "Active campaigns",
          totalCampaigns: "Total campaigns",
          myCampaigns: "My campaigns",
          noCampaigns: "No campaigns",
          createFirst: "Create your first campaign to start raising funds"
        },
        investor: {
          title: "Investor",
          titleHighlight: "Dashboard",
          subtitle: "Track your investments and returns",
          seeCampaigns: "See campaigns",
          totalInvested: "Total invested",
          expectedReturn: "Expected return",
          activeInvestments: "Active investments",
          averageRate: "Average rate",
          portfolioEvolution: "Portfolio evolution",
          myInvestments: "My investments",
          noInvestments: "No investments",
          discoverCampaigns: "Discover campaigns and start investing",
          securedReturn: "Secured return",
          securedReturnDesc: "All investments are secured by a mortgage on the property."
        },
        notary: {
          title: "Notary",
          titleHighlight: "Dashboard",
          subtitle: "Validate campaigns and track your commissions",
          pending: "Pending",
          validated: "Validated",
          totalCommission: "Total commissions",
          campaignsToValidate: "Campaigns to validate",
          noPending: "No pending campaigns",
          newCampaignsWillAppear: "New campaigns will appear here for validation",
          validate: "Validate",
          commissionStructure: "Commission structure",
          commissionPerCampaign: "Commission per validated campaign",
          ofRaisedAmount: "of amount raised once funded",
          conditions: "Conditions"
        }
      },
      createCampaign: {
        title: "Create a",
        titleHighlight: "campaign",
        back: "Back",
        step1: "Basic information",
        step1Desc: "Present your family property",
        campaignTitle: "Campaign title",
        location: "Location",
        propertyType: "Property type",
        step2: "Your story",
        step2Desc: "Tell the story of this property to touch investors",
        projectDescription: "Project description",
        propertyStory: "The story of this property",
        storyTip: "A touching story increases your chances of success by 60%",
        step3: "Financial details",
        step3Desc: "Set the parameters of your fundraising",
        propertyValue: "Property value (€)",
        targetAmount: "Target amount (€)",
        interestRate: "Annual interest rate",
        higherRateTip: "A higher rate attracts more investors but increases your cost",
        loanDuration: "Loan duration",
        totalCost: "Estimated total cost",
        capitalPlusInterest: "Capital + interest over",
        step4: "Photos and validation",
        step4Desc: "Add photos and review your campaign",
        photos: "Property photos",
        dragPhotos: "Drag your photos here or click to select",
        maxPhotos: "PNG, JPG, WebP up to 5MB - Max 10 photos",
        main: "Main",
        summary: "Summary",
        previous: "Previous",
        next: "Next",
        saveDraft: "Save as draft",
        publish: "Publish campaign"
      },
      payment: {
        verifying: "Verifying payment",
        pleaseWait: "Please wait while we confirm your payment...",
        success: "Payment successful!",
        investmentRecorded: "Your investment has been recorded.",
        viewPortfolio: "View my portfolio",
        continueInvesting: "Continue investing",
        failed: "Payment failed",
        failedDesc: "Payment could not be confirmed. Please try again or contact support.",
        retry: "Retry",
        backToHome: "Back to home"
      },
      footer: {
        description: "Preserve your family heritage through crowdfunding.",
        platform: "Platform",
        howItWorks: "How it works",
        heirs: "Heirs",
        createCampaign: "Create a campaign",
        faqHeirs: "FAQ Heirs",
        testimonials: "Testimonials",
        investors: "Investors",
        myPortfolio: "My portfolio",
        faqInvestors: "FAQ Investors",
        risks: "Risks",
        legal: "Legal notice",
        privacy: "Privacy",
        terms: "Terms",
        allRights: "All rights reserved."
      },
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        confirm: "Confirm",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        view: "View",
        close: "Close",
        yes: "Yes",
        no: "No"
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        calculator: "Calculadora",
        campaigns: "Campañas",
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
        profile: "Perfil",
        settings: "Configuración",
        heirSpace: "Espacio Heredero",
        investorSpace: "Espacio Inversor",
        notarySpace: "Espacio Notario"
      },
      hero: {
        title: "Preserve su",
        titleHighlight: "herencia familiar",
        subtitle: "No deje que los impuestos de sucesión le obliguen a vender el patrimonio familiar. Financie sus derechos a través de nuestra comunidad de inversores.",
        ctaHeir: "Soy heredero",
        ctaInvestor: "Quiero invertir"
      },
      stats: {
        activeCampaigns: "Campañas activas",
        fundsRaised: "Fondos recaudados",
        investors: "Inversores",
        successRate: "Tasa de éxito"
      },
      calculator: {
        title: "Calcule sus impuestos de",
        titleHighlight: "sucesión",
        subtitle: "Obtenga una estimación gratuita de los impuestos de sucesión según las tasas fiscales francesas.",
        propertyValue: "Valor del bien (€)",
        relationship: "Parentesco",
        previousDonations: "Donaciones anteriores (€)",
        disability: "Situación de discapacidad",
        calculate: "Calcular mis impuestos",
        result: "Resultado de su simulación",
        abatement: "Deducción",
        taxableAmount: "Base imponible",
        effectiveRate: "Tasa efectiva",
        taxToPay: "Impuestos a pagar",
        netInheritance: "Herencia neta",
        launchCampaign: "Lanzar una campaña",
        relationships: {
          spouse: "Cónyuge (exento)",
          direct_line: "Hijo (línea directa)",
          sibling: "Hermano/a",
          nephew_niece: "Sobrino/a",
          other: "Otro"
        }
      },
      howItWorks: {
        title: "Cómo",
        titleHighlight: "funciona",
        subtitle: "Un proceso simple y seguro para financiar sus impuestos de sucesión",
        step1Title: "Cree su campaña",
        step1Desc: "Presente su propiedad familiar, su historia y la cantidad que necesita.",
        step2Title: "Recaude fondos",
        step2Desc: "Los inversores participan en su campaña con un préstamo participativo asegurado.",
        step3Title: "Preserve su patrimonio",
        step3Desc: "Pague sus impuestos de sucesión y conserve su propiedad. Reembolse a su ritmo."
      },
      benefits: {
        forHeirs: "Para",
        forHeirsHighlight: "herederos",
        heir1: "40% más barato que una hipoteca tradicional",
        heir2: "Financiación en 30-45 días en lugar de 3 meses con bancos",
        heir3: "Reembolso anticipado sin penalizaciones",
        heir4: "Apoyo legal de notarios asociados",
        createCampaign: "Crear mi campaña",
        forInvestors: "Para",
        forInvestorsHighlight: "inversores",
        investor1: "Rendimiento anual del 4-7% en préstamos asegurados",
        investor2: "Garantía hipotecaria sobre bienes inmuebles",
        investor3: "Inversión desde solo 50€",
        investor4: "Impacto social: ayude a familias a preservar su patrimonio",
        seeCampaigns: "Ver campañas"
      },
      cta: {
        title: "¿Listo para preservar su",
        titleHighlight: "herencia",
        subtitle: "Únase a las familias que eligieron HeritageFund para proteger sus activos.",
        launchCampaign: "Lanzar mi campaña",
        discoverCampaigns: "Descubrir campañas"
      },
      campaigns: {
        title: "Campañas",
        titleHighlight: "activas",
        subtitle: "Invierta en proyectos patrimoniales seguros y ayude a familias a preservar su legado.",
        search: "Buscar por título o ubicación...",
        filter: "Tipo de propiedad",
        allTypes: "Todos los tipos",
        houses: "Casas",
        apartments: "Apartamentos",
        lands: "Terrenos",
        businesses: "Negocios",
        noCampaigns: "No se encontraron campañas",
        modifyFilters: "Intente modificar sus filtros",
        funded: "financiado",
        investors: "inversores",
        return: "Rendimiento",
        duration: "Duración",
        months: "meses",
        viewProject: "Ver proyecto",
        validatedByNotary: "Validado por notario",
        propertyTypes: {
          house: "Casa",
          apartment: "Apartamento",
          land: "Terreno",
          business: "Negocio"
        }
      },
      common: {
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        cancel: "Cancelar",
        confirm: "Confirmar",
        save: "Guardar",
        delete: "Eliminar",
        edit: "Editar",
        view: "Ver",
        close: "Cerrar",
        yes: "Sí",
        no: "No"
      }
    }
  },
  pt: {
    translation: {
      nav: {
        home: "Início",
        calculator: "Calculadora",
        campaigns: "Campanhas",
        login: "Entrar",
        logout: "Sair",
        profile: "Perfil",
        settings: "Configurações",
        heirSpace: "Espaço Herdeiro",
        investorSpace: "Espaço Investidor",
        notarySpace: "Espaço Notário"
      },
      hero: {
        title: "Preserve sua",
        titleHighlight: "herança familiar",
        subtitle: "Não deixe os impostos de sucessão forçá-lo a vender o patrimônio familiar. Financie seus direitos através da nossa comunidade de investidores.",
        ctaHeir: "Sou herdeiro",
        ctaInvestor: "Quero investir"
      },
      stats: {
        activeCampaigns: "Campanhas ativas",
        fundsRaised: "Fundos arrecadados",
        investors: "Investidores",
        successRate: "Taxa de sucesso"
      },
      calculator: {
        title: "Calcule seus impostos de",
        titleHighlight: "sucessão",
        subtitle: "Obtenha uma estimativa gratuita dos impostos de sucessão com base nas taxas fiscais francesas.",
        propertyValue: "Valor do imóvel (€)",
        relationship: "Parentesco",
        previousDonations: "Doações anteriores (€)",
        disability: "Situação de deficiência",
        calculate: "Calcular meus impostos",
        result: "Resultado da sua simulação",
        abatement: "Dedução",
        taxableAmount: "Base tributável",
        effectiveRate: "Taxa efetiva",
        taxToPay: "Impostos a pagar",
        netInheritance: "Herança líquida",
        launchCampaign: "Lançar uma campanha",
        relationships: {
          spouse: "Cônjuge (isento)",
          direct_line: "Filho (linha direta)",
          sibling: "Irmão/Irmã",
          nephew_niece: "Sobrinho/Sobrinha",
          other: "Outro"
        }
      },
      howItWorks: {
        title: "Como",
        titleHighlight: "funciona",
        subtitle: "Um processo simples e seguro para financiar seus impostos de sucessão",
        step1Title: "Crie sua campanha",
        step1Desc: "Apresente sua propriedade familiar, sua história e o valor que você precisa.",
        step2Title: "Arrecade fundos",
        step2Desc: "Os investidores participam da sua campanha com um empréstimo participativo garantido.",
        step3Title: "Preserve seu patrimônio",
        step3Desc: "Pague seus impostos de sucessão e mantenha sua propriedade. Reembolse no seu ritmo."
      },
      benefits: {
        forHeirs: "Para",
        forHeirsHighlight: "herdeiros",
        heir1: "40% mais barato que uma hipoteca tradicional",
        heir2: "Financiamento em 30-45 dias em vez de 3 meses com bancos",
        heir3: "Reembolso antecipado sem penalidades",
        heir4: "Apoio jurídico de notários parceiros",
        createCampaign: "Criar minha campanha",
        forInvestors: "Para",
        forInvestorsHighlight: "investidores",
        investor1: "Retorno anual de 4-7% em empréstimos garantidos",
        investor2: "Garantia hipotecária sobre imóveis",
        investor3: "Investimento a partir de apenas 50€",
        investor4: "Impacto social: ajude famílias a preservar seu patrimônio",
        seeCampaigns: "Ver campanhas"
      },
      cta: {
        title: "Pronto para preservar sua",
        titleHighlight: "herança",
        subtitle: "Junte-se às famílias que escolheram HeritageFund para proteger seus bens.",
        launchCampaign: "Lançar minha campanha",
        discoverCampaigns: "Descobrir campanhas"
      },
      campaigns: {
        title: "Campanhas",
        titleHighlight: "ativas",
        subtitle: "Invista em projetos patrimoniais seguros e ajude famílias a preservar seu legado.",
        search: "Pesquisar por título ou localização...",
        filter: "Tipo de imóvel",
        allTypes: "Todos os tipos",
        houses: "Casas",
        apartments: "Apartamentos",
        lands: "Terrenos",
        businesses: "Negócios",
        noCampaigns: "Nenhuma campanha encontrada",
        modifyFilters: "Tente modificar seus filtros",
        funded: "financiado",
        investors: "investidores",
        return: "Retorno",
        duration: "Duração",
        months: "meses",
        viewProject: "Ver projeto",
        validatedByNotary: "Validado por notário",
        propertyTypes: {
          house: "Casa",
          apartment: "Apartamento",
          land: "Terreno",
          business: "Negócio"
        }
      },
      common: {
        loading: "Carregando...",
        error: "Erro",
        success: "Sucesso",
        cancel: "Cancelar",
        confirm: "Confirmar",
        save: "Salvar",
        delete: "Excluir",
        edit: "Editar",
        view: "Ver",
        close: "Fechar",
        yes: "Sim",
        no: "Não"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

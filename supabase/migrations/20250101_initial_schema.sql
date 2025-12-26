-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'investor' CHECK (role IN ('investor', 'heir', 'notary', 'admin')),
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'approved', 'rejected')),
  kyc_documents JSONB DEFAULT '[]'::jsonb,
  iban TEXT,
  bank_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heir_id UUID REFERENCES public.profiles(id) NOT NULL,
  notary_id UUID REFERENCES public.profiles(id),

  -- Campaign details
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'farm', 'business', 'land', 'apartment')),

  -- Financial details
  asset_value DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 4 AND interest_rate <= 10),
  duration_months INTEGER NOT NULL CHECK (duration_months >= 12 AND duration_months <= 120),

  -- Media
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  documents TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_validation', 'active', 'funded', 'repaying', 'completed', 'cancelled')),
  validation_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  funded_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ,

  -- Metadata
  backers_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0
);

-- Investments table
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.campaigns(id) NOT NULL,
  investor_id UUID REFERENCES public.profiles(id) NOT NULL,

  -- Investment details
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 50),
  interest_rate DECIMAL(5,2) NOT NULL,
  duration_months INTEGER NOT NULL,

  -- Payment tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'defaulted')),
  payment_method TEXT,
  transaction_id TEXT,

  -- Repayment tracking
  monthly_payment DECIMAL(12,2),
  total_expected_return DECIMAL(12,2),
  total_returned DECIMAL(12,2) DEFAULT 0,
  next_payment_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,

  UNIQUE(campaign_id, investor_id)
);

-- Repayments table
CREATE TABLE public.repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id UUID REFERENCES public.investments(id) NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) NOT NULL,

  -- Payment details
  amount DECIMAL(12,2) NOT NULL,
  principal DECIMAL(12,2) NOT NULL,
  interest DECIMAL(12,2) NOT NULL,

  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'completed', 'failed', 'late')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,

  -- Payment info
  transaction_id TEXT,
  payment_method TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (for campaign comments/updates)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.campaigns(id) NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,

  content TEXT NOT NULL,
  type TEXT DEFAULT 'comment' CHECK (type IN ('comment', 'update', 'question', 'answer')),
  parent_id UUID REFERENCES public.messages(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,

  type TEXT NOT NULL CHECK (type IN ('investment_confirmed', 'campaign_funded', 'repayment_received', 'campaign_update', 'message_received')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,

  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics/Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  campaign_id UUID REFERENCES public.campaigns(id),

  data JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_heir ON public.campaigns(heir_id);
CREATE INDEX idx_campaigns_published ON public.campaigns(published_at DESC);
CREATE INDEX idx_investments_investor ON public.investments(investor_id);
CREATE INDEX idx_investments_campaign ON public.investments(campaign_id);
CREATE INDEX idx_repayments_due_date ON public.repayments(due_date);
CREATE INDEX idx_repayments_status ON public.repayments(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX idx_messages_campaign ON public.messages(campaign_id);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Campaigns: Public for reading active, heir can manage own
CREATE POLICY "Active campaigns are viewable by everyone"
  ON public.campaigns FOR SELECT
  USING (status = 'active' OR auth.uid() = heir_id OR auth.uid() = notary_id);

CREATE POLICY "Heirs can create campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = heir_id);

CREATE POLICY "Heirs can update own campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() = heir_id);

-- Investments: Investors see their own, campaign owners see all for their campaign
CREATE POLICY "Investors can view own investments"
  ON public.investments FOR SELECT
  USING (
    auth.uid() = investor_id
    OR auth.uid() IN (SELECT heir_id FROM campaigns WHERE id = campaign_id)
  );

CREATE POLICY "Investors can create investments"
  ON public.investments FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

-- Repayments: Similar to investments
CREATE POLICY "Users can view relevant repayments"
  ON public.repayments FOR SELECT
  USING (
    auth.uid() IN (SELECT investor_id FROM investments WHERE id = investment_id)
    OR auth.uid() IN (SELECT heir_id FROM campaigns WHERE id = campaign_id)
  );

-- Messages: Public for campaigns
CREATE POLICY "Messages are viewable by everyone"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Notifications: Private
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for messages
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update campaign current_amount and backers_count
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.campaigns
  SET
    current_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.investments
      WHERE campaign_id = NEW.campaign_id AND status = 'confirmed'
    ),
    backers_count = (
      SELECT COUNT(DISTINCT investor_id)
      FROM public.investments
      WHERE campaign_id = NEW.campaign_id AND status = 'confirmed'
    )
  WHERE id = NEW.campaign_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for investment confirmations
CREATE TRIGGER update_campaign_stats_on_investment
  AFTER INSERT OR UPDATE ON public.investments
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed')
  EXECUTE FUNCTION update_campaign_stats();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

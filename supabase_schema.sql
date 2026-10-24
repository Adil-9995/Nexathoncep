-- ==============================================================================
-- CAMPUSLOOP DATABASE SCHEMA (PostgreSQL / Supabase)
-- Full-stack Peer-to-Peer Learning, Book & Digital PDF Notes Marketplace,
-- and Student Writing Gigs & Escrow Platform
-- Tagline: "Learn One Skill. Teach Another. Grow Together."
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    institution TEXT NOT NULL,
    course TEXT NOT NULL,
    department TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status TEXT CHECK (verification_status IN ('unverified', 'pending', 'verified')) DEFAULT 'unverified',
    bio TEXT,
    preferred_format TEXT CHECK (preferred_format IN ('Online', 'In-Person', 'Hybrid')) DEFAULT 'Hybrid',
    available_days TEXT[] DEFAULT '{}',
    available_time_slots TEXT[] DEFAULT '{}',
    completed_sessions_count INT DEFAULT 0,
    money_saved_inr NUMERIC(12,2) DEFAULT 0,
    earnings_inr NUMERIC(12,2) DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.0,
    role TEXT CHECK (role IN ('student', 'admin')) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Skills Registry & Student Skills Association
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_type TEXT CHECK (skill_type IN ('can_teach', 'want_to_learn')) NOT NULL,
    proficiency_level TEXT CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Learning Preferences Table
CREATE TABLE IF NOT EXISTS public.learning_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    preferred_days TEXT[] DEFAULT '{}',
    preferred_slots TEXT[] DEFAULT '{}',
    format TEXT CHECK (format IN ('Online Video', 'Campus In-Person', 'Hybrid')) DEFAULT 'Online Video',
    notification_alerts BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Credit Wallets Table (5 starter credits, non-cash internal points)
CREATE TABLE IF NOT EXISTS public.credit_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance INT NOT NULL DEFAULT 5, -- 5 Starter Credits
    total_earned INT NOT NULL DEFAULT 5,
    total_spent INT NOT NULL DEFAULT 0,
    unlocked_teacher_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- 6. Credit Transactions Table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES public.credit_wallets(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL, -- e.g. +5, -2, -5, +5
    transaction_type TEXT CHECK (transaction_type IN (
        'starter_grant', 'earned_teaching', 'spent_learning', 'purchased_pack', 'match_unlock', 'refunded'
    )) NOT NULL,
    description TEXT NOT NULL,
    related_entity_id UUID,
    status TEXT CHECK (status IN ('completed', 'pending', 'failed')) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Learning Sessions Table (Mutual Confirmation & 5 Credits Transfer)
CREATE TABLE IF NOT EXISTS public.learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    learner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    format TEXT CHECK (format IN ('Online Video', 'Campus In-Person')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'upcoming', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
    credits_required INT NOT NULL DEFAULT 5,
    credits_transferred BOOLEAN DEFAULT FALSE,
    confirmed_by_mentor BOOLEAN DEFAULT FALSE,
    confirmed_by_learner BOOLEAN DEFAULT FALSE,
    notes TEXT,
    meet_link TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Book & Digital Notes Listings (Second-Hand Textbooks & Curated PDF Notes)
CREATE TABLE IF NOT EXISTS public.book_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    subject TEXT NOT NULL,
    course TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    original_reference_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    condition TEXT CHECK (condition IN ('New', 'Like New', 'Good', 'Fair')) NOT NULL DEFAULT 'Like New',
    item_format TEXT CHECK (item_format IN ('physical', 'pdf')) DEFAULT 'physical',
    pdf_page_count INT,
    pdf_file_size TEXT,
    pdf_sample_url TEXT,
    images TEXT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('Available', 'Reserved', 'Sold')) DEFAULT 'Available',
    views INT DEFAULT 0,
    favourites_count INT DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Book Orders (Transparent 2% Platform Commission)
CREATE TABLE IF NOT EXISTS public.book_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.book_listings(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES public.profiles(id),
    buyer_id UUID REFERENCES public.profiles(id),
    book_title TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL, -- e.g. 500
    platform_commission NUMERIC(10,2) NOT NULL, -- e.g. 10 (2%)
    seller_payout NUMERIC(10,2) NOT NULL, -- e.g. 490
    commission_rate NUMERIC(4,3) DEFAULT 0.020,
    payment_method TEXT DEFAULT 'Simulated Campus UPI',
    status TEXT CHECK (status IN ('completed', 'pending', 'cancelled')) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.learning_sessions(id) ON DELETE SET NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Reports & Academic Integrity Moderation
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT CHECK (target_type IN ('listing', 'session', 'user')) NOT NULL,
    target_id UUID NOT NULL,
    target_title TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'reviewed', 'resolved')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    type TEXT CHECK (type IN (
        'session_request', 'session_accepted', 'session_completed', 'credits_earned', 'credits_spent', 'book_order', 'system'
    )) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Student Writing Gigs (Students offering record & assignment writing)
CREATE TABLE IF NOT EXISTS public.writing_gigs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    writer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    service_type TEXT CHECK (service_type IN (
        'Lab Record Writing',
        'Assignment Writing',
        'Observation Notebook',
        'Project Report / Paper',
        'Diagrams & Engineering Graphs'
    )) NOT NULL,
    pricing_model TEXT CHECK (pricing_model IN ('per_page', 'per_record', 'fixed')) NOT NULL DEFAULT 'per_record',
    rate NUMERIC(10,2) NOT NULL DEFAULT 120.00,
    turnaround_days INT NOT NULL DEFAULT 2,
    handwriting_sample TEXT,
    languages TEXT[] DEFAULT '{"English"}',
    description TEXT NOT NULL,
    completed_jobs_count INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Writing Job Announcements (Students posting works to be written)
CREATE TABLE IF NOT EXISTS public.writing_job_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT CHECK (category IN (
        'Lab Record Writing',
        'Assignment Writing',
        'Observation Notebook',
        'Project Report / Paper',
        'Diagrams & Engineering Graphs'
    )) NOT NULL,
    subject TEXT NOT NULL,
    pages_count INT NOT NULL DEFAULT 10,
    deadline TEXT NOT NULL,
    budget NUMERIC(10,2) NOT NULL DEFAULT 150.00,
    instructions TEXT NOT NULL,
    status TEXT CHECK (status IN ('open', 'assigned', 'in_progress', 'submitted', 'completed', 'cancelled')) DEFAULT 'open',
    assigned_writer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Writing Orders & Escrow (₹10 Advance Deposit, 2% Platform Fee, 98% Writer Payout)
CREATE TABLE IF NOT EXISTS public.writing_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    gig_id UUID REFERENCES public.writing_gigs(id) ON DELETE SET NULL,
    announcement_id UUID REFERENCES public.writing_job_announcements(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    writer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2) NOT NULL,
    advance_amount NUMERIC(10,2) NOT NULL DEFAULT 10.00, -- Strictly ₹10 advance deposit to lock writer
    remaining_amount NUMERIC(10,2) NOT NULL,            -- total_amount - advance_amount
    platform_fee_rate NUMERIC(4,3) DEFAULT 0.020,       -- 2% platform fee
    platform_fee NUMERIC(10,2) NOT NULL,                -- 2% of total_amount to app
    writer_payout NUMERIC(10,2) NOT NULL,               -- 98% of total_amount to writer
    advance_paid BOOLEAN DEFAULT TRUE,
    advance_paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    materials_submitted BOOLEAN DEFAULT TRUE,
    work_instructions TEXT,
    work_submitted BOOLEAN DEFAULT FALSE,
    work_submitted_at TIMESTAMP WITH TIME ZONE,
    work_submission_notes TEXT,
    work_sample_images TEXT[] DEFAULT '{}',
    final_paid BOOLEAN DEFAULT FALSE,
    final_paid_at TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('advance_pending', 'in_progress', 'submitted_for_review', 'completed', 'cancelled')) DEFAULT 'in_progress',
    pages_count INT DEFAULT 1,
    deadline TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- DATABASE FUNCTIONS & ATOMIC CREDIT TRANSFERS
-- ==============================================================================

-- Function to Award 5 Credits upon Mutual Confirmation
CREATE OR REPLACE FUNCTION public.confirm_session_and_award_credits(
    p_session_id UUID,
    p_caller_id UUID
) RETURNS JSON AS $$
DECLARE
    v_session RECORD;
    v_both_confirmed BOOLEAN := FALSE;
BEGIN
    SELECT * INTO v_session FROM public.learning_sessions WHERE id = p_session_id;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Session not found');
    END IF;

    -- Update confirmation flags
    IF v_session.mentor_id = p_caller_id THEN
        UPDATE public.learning_sessions SET confirmed_by_mentor = TRUE WHERE id = p_session_id;
    ELSIF v_session.learner_id = p_caller_id THEN
        UPDATE public.learning_sessions SET confirmed_by_learner = TRUE WHERE id = p_session_id;
    END IF;

    -- Re-fetch updated session
    SELECT * INTO v_session FROM public.learning_sessions WHERE id = p_session_id;

    IF v_session.confirmed_by_mentor AND v_session.confirmed_by_learner AND NOT v_session.credits_transferred THEN
        -- Mark as completed & credits transferred
        UPDATE public.learning_sessions 
        SET status = 'completed', credits_transferred = TRUE, updated_at = NOW() 
        WHERE id = p_session_id;

        -- Award 5 credits to Mentor Wallet
        UPDATE public.credit_wallets 
        SET balance = balance + 5, total_earned = total_earned + 5, updated_at = NOW()
        WHERE profile_id = v_session.mentor_id;

        -- Record transaction
        INSERT INTO public.credit_transactions (wallet_id, profile_id, amount, transaction_type, description, related_entity_id)
        SELECT id, profile_id, 5, 'earned_teaching', 'Earned 5 credits for teaching peer', p_session_id
        FROM public.credit_wallets WHERE profile_id = v_session.mentor_id;

        -- Update session count
        UPDATE public.profiles SET completed_sessions_count = completed_sessions_count + 1 WHERE id IN (v_session.mentor_id, v_session.learner_id);

        RETURN json_build_object('success', true, 'status', 'completed', 'credits_awarded', 5);
    END IF;

    RETURN json_build_object('success', true, 'status', 'partially_confirmed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Book listings viewable by everyone" ON public.book_listings FOR SELECT USING (true);
CREATE POLICY "Sellers can manage own book listings" ON public.book_listings FOR ALL USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = seller_id));

CREATE POLICY "Wallets viewable by owner" ON public.credit_wallets FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = profile_id));

ALTER TABLE public.writing_gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_job_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Writing gigs viewable by everyone" ON public.writing_gigs FOR SELECT USING (true);
CREATE POLICY "Writers can manage own gigs" ON public.writing_gigs FOR ALL USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = writer_id));

CREATE POLICY "Announcements viewable by everyone" ON public.writing_job_announcements FOR SELECT USING (true);
CREATE POLICY "Requesters can manage own announcements" ON public.writing_job_announcements FOR ALL USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = requester_id));

CREATE POLICY "Orders viewable by requester or writer" ON public.writing_orders FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = requester_id) OR
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = writer_id)
);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  StudentUser, 
  BookListing, 
  LearningSession, 
  TransactionRecord,
  ModerationReport,
  NotificationItem,
  CreditTransaction,
  SkillEntry,
  CreditAlert,
  WritingGigListing,
  WritingJobAnnouncement,
  WritingOrder
} from '../types';
import { 
  SEED_USERS, 
  SEED_BOOKS, 
  SEED_SESSIONS, 
  SEED_CREDIT_TRANSACTIONS, 
  SEED_TRANSACTIONS, 
  SEED_REPORTS,
  SEED_NOTIFICATIONS,
  SEED_WRITING_GIGS,
  SEED_WRITING_ANNOUNCEMENTS,
  SEED_WRITING_ORDERS
} from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: StudentUser;
  setCurrentUser: (user: StudentUser) => void;
  switchUserById: (userId: string) => void;
  allUsers: StudentUser[];
  updateUserProfile: (updates: Partial<StudentUser>) => void;
  
  // Learning Credits & Fake Payment
  creditTransactions: CreditTransaction[];
  addCredits: (amount: number, description: string, type: CreditTransaction['type']) => void;
  purchaseCreditPack: (paymentMethod: string) => { success: boolean };
  unlockMatch: (teacherId: string) => { success: boolean; message: string };
  isMatchUnlocked: (teacherId: string) => boolean;
  creditAlert: CreditAlert | null;
  triggerCreditAlert: (alert: Omit<CreditAlert, 'id'>) => void;
  dismissCreditAlert: () => void;
  
  // Fake Payment Modal State
  fakePaymentModalOpen: boolean;
  setFakePaymentModalOpen: (open: boolean) => void;
  pendingUnlockTeacherId: string | null;
  setPendingUnlockTeacherId: (teacherId: string | null) => void;
  
  // Earned Credit Celebration Popup
  earnedCreditPopupOpen: boolean;
  setEarnedCreditPopupOpen: (open: boolean) => void;

  // Book Marketplace
  listings: BookListing[];
  books: BookListing[]; // convenient alias
  favourites: string[];
  toggleFavourite: (bookId: string) => void;
  addBook: (book: Omit<BookListing, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerCollege' | 'sellerRating' | 'status' | 'datePosted' | 'views' | 'favouritesCount'>) => void;
  addListing: (book: Omit<BookListing, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerCollege' | 'sellerRating' | 'status' | 'datePosted' | 'views' | 'favouritesCount'>) => void;
  deleteListing: (bookId: string) => void;
  completePurchase: (bookId: string, paymentMethod: string) => { success: boolean; transaction?: TransactionRecord };
  releaseBookEscrow: (transactionId: string) => { success: boolean; message?: string };
  disputeBookEscrow: (transactionId: string, reason: string) => { success: boolean; message?: string };
  
  // Peer Learning & Sessions
  learningSessions: LearningSession[];
  addSkillToTeach: (skill: SkillEntry) => void;
  addSkillToLearn: (skill: SkillEntry) => void;
  removeSkill: (type: 'teach' | 'learn', skillName: string) => void;
  requestSession: (teacherId: string, skillName: string, date: string, time: string, format: 'Online Video' | 'Campus In-Person', notes?: string) => { success: boolean; message?: string };
  scheduleLearningSession: (peerId: string, skillName: string, date: string, timeSlot: string, format: 'Online Video' | 'Campus In-Person', notes?: string) => void;
  acceptSession: (sessionId: string) => void;
  rejectSession: (sessionId: string) => void;
  confirmSessionCompletion: (sessionId: string, asRole: 'mentor' | 'learner') => void;
  updateSessionStatus: (sessionId: string, status: 'completed' | 'cancelled') => void;

  // Group Learning (3-4 peers) & Live Meet
  joinGroupSession: (sessionId: string) => { success: boolean; message?: string };
  createGroupSession: (data: { 
    topic: string; 
    skillName: string; 
    maxParticipants: number; 
    scheduledDate: string; 
    timeSlot: string; 
    format: 'Online Video' | 'Campus In-Person'; 
    notes?: string; 
    startLiveImmediately?: boolean;
  }) => { success: boolean; session?: LearningSession };
  toggleLiveMeet: (sessionId: string, isLive: boolean) => void;
  activeLiveMeetSession: LearningSession | null;
  setActiveLiveMeetSession: (session: LearningSession | null) => void;
  
  // Student Writing Gigs & Assignments Escrow
  writingGigs: WritingGigListing[];
  writingAnnouncements: WritingJobAnnouncement[];
  writingOrders: WritingOrder[];
  addWritingGig: (data: {
    title: string;
    serviceType: WritingGigListing['serviceType'];
    pricingModel: WritingGigListing['pricingModel'];
    rate: number;
    turnaroundDays: number;
    handwritingSample?: string;
    languages: string[];
    description: string;
  }) => void;
  postWritingAnnouncement: (data: {
    title: string;
    category: WritingJobAnnouncement['category'];
    subject: string;
    pagesCount: number;
    deadline: string;
    budget: number;
    instructions: string;
  }) => void;
  createWritingOrderFromGig: (gigId: string, pagesCount: number, instructions: string) => { success: boolean; order?: WritingOrder; message?: string };
  acceptWritingAnnouncement: (announcementId: string) => { success: boolean; order?: WritingOrder; message?: string };
  submitOrderWork: (orderId: string, notes: string, sampleImages?: string[]) => void;
  approveAndCompleteWritingOrder: (orderId: string) => { success: boolean; message?: string };
  
  // Book Transactions & Commission
  transactions: TransactionRecord[];
  commissionRate: number;
  setCommissionRate: (rate: number) => void;
  
  // Moderation & Admin
  reports: ModerationReport[];
  resolveReport: (reportId: string, action: 'remove_listing' | 'dismiss') => void;
  submitReport: (targetType: 'listing' | 'session' | 'user', targetId: string, targetTitle: string, reason: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  
  // Judge Demo Tour
  demoStep: number;
  setDemoStep: (step: number) => void;
  runDemoNextStep: () => void;
  resetDemoData: () => void;
  
  // Platform Metrics
  platformStats: {
    totalStudents: number;
    skillsExchanged: number;
    creditsCirculated: number;
    booksReused: number;
    moneySaved: number;
    platformCommissionEarned: number;
  };
  sustainabilityStats: {
    itemsReused: number;
    secondHandTransactions: number;
    donationsCompleted: number;
    totalMoneySaved: number;
    peerLearningSessionsCompleted: number;
    studentServiceEarnings: number;
    activeStudents: number;
    estimatedCo2Kg: number;
    platformCommissionEarned: number;
  };

  // Legacy compatibility helpers
  services: any[];
  serviceBookings: any[];
  addService: (s: any) => void;
  bookService: (id: string, date: string, time: string, notes: string) => void;
  updateBookingStatus: (id: string, st: any) => void;
  addServiceReview: (id: string, r: number, c: string) => void;
  postTransactionModalOpen: boolean;
  setPostTransactionModalOpen: (o: boolean) => void;
  lastCompletedTransaction: any;
}

const STORAGE_PREFIX = 'nexathon_v2_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state with automatic merging of new student personas
  const [allUsers, setAllUsers] = useState<StudentUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    if (saved) {
      try {
        const parsed: StudentUser[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(u => u.id));
        const missing = SEED_USERS.filter(u => !existingIds.has(u.id));
        return [...parsed, ...missing];
      } catch {
        return SEED_USERS;
      }
    }
    return SEED_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    return saved || 'user-adil';
  });

  // Book Listings with automatic merging of new 20+ books and PDF notes
  const [listings, setListings] = useState<BookListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'books');
    if (saved) {
      try {
        const parsed: BookListing[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(b => b.id));
        const missing = SEED_BOOKS.filter(b => !existingIds.has(b.id));
        return [...parsed, ...missing];
      } catch {
        return SEED_BOOKS;
      }
    }
    return SEED_BOOKS;
  });

  // Favourites
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'favourites');
    return saved ? JSON.parse(saved) : ['book-1'];
  });

  // Learning Sessions with automatic merging of new group study circles and URL sanitization
  const [learningSessions, setLearningSessions] = useState<LearningSession[]>(() => {
    const sanitizeSession = (s: LearningSession): LearningSession => {
      if (s.meetLink && (s.meetLink.includes('nexathon.edu') || s.meetLink.includes('campusloop.edu'))) {
        const parts = s.meetLink.split('/room/');
        if (parts.length > 1) {
          return { ...s, meetLink: `/room/${parts[1]}` };
        }
      }
      return s;
    };

    const saved = localStorage.getItem(STORAGE_PREFIX + 'sessions');
    if (saved) {
      try {
        const parsed: LearningSession[] = JSON.parse(saved).map(sanitizeSession);
        const existingIds = new Set(parsed.map(s => s.id));
        const missing = SEED_SESSIONS.filter(s => !existingIds.has(s.id));
        return [...parsed, ...missing];
      } catch {
        return SEED_SESSIONS;
      }
    }
    return SEED_SESSIONS;
  });

  // Active Live Meet Video Room Modal
  const [activeLiveMeetSession, setActiveLiveMeetSession] = useState<LearningSession | null>(null);

  // Student Writing Gigs & Assignments
  const [writingGigs, setWritingGigs] = useState<WritingGigListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'writing_gigs');
    if (saved) {
      try {
        const parsed: WritingGigListing[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(g => g.id));
        const missing = SEED_WRITING_GIGS.filter(g => !existingIds.has(g.id));
        return [...parsed, ...missing];
      } catch {
        return SEED_WRITING_GIGS;
      }
    }
    return SEED_WRITING_GIGS;
  });

  const [writingAnnouncements, setWritingAnnouncements] = useState<WritingJobAnnouncement[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'writing_ann');
    if (saved) {
      try {
        const parsed: WritingJobAnnouncement[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(a => a.id));
        const missing = SEED_WRITING_ANNOUNCEMENTS.filter(a => !existingIds.has(a.id));
        return [...parsed, ...missing];
      } catch {
        return SEED_WRITING_ANNOUNCEMENTS;
      }
    }
    return SEED_WRITING_ANNOUNCEMENTS;
  });

  const [writingOrders, setWritingOrders] = useState<WritingOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'writing_orders');
    if (saved) {
      try {
        const parsed: WritingOrder[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(o => o.id));
        const missing = SEED_WRITING_ORDERS.filter(o => !existingIds.has(o.id));
        return [...parsed, ...missing];
      } catch {
        return SEED_WRITING_ORDERS;
      }
    }
    return SEED_WRITING_ORDERS;
  });

  // Credit Transactions
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'credit_tx');
    return saved ? JSON.parse(saved) : SEED_CREDIT_TRANSACTIONS;
  });

  // Book Marketplace Transactions
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'book_tx');
    if (saved) {
      try {
        const parsed: TransactionRecord[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(t => t.id));
        const missing = SEED_TRANSACTIONS.filter(t => !existingIds.has(t.id));
        return [...parsed, ...missing];
      } catch {
        return SEED_TRANSACTIONS;
      }
    }
    return SEED_TRANSACTIONS;
  });

  // Moderation Reports
  const [reports, setReports] = useState<ModerationReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'reports');
    return saved ? JSON.parse(saved) : SEED_REPORTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  // Commission Rate (2% default)
  const [commissionRate, setCommissionRate] = useState<number>(0.02);

  // Modals
  const [fakePaymentModalOpen, setFakePaymentModalOpen] = useState(false);
  const [pendingUnlockTeacherId, setPendingUnlockTeacherId] = useState<string | null>(null);
  const [earnedCreditPopupOpen, setEarnedCreditPopupOpen] = useState(false);

  // Credit Alert Toast Notification
  const [creditAlert, setCreditAlert] = useState<CreditAlert | null>(null);

  const triggerCreditAlert = (alert: Omit<CreditAlert, 'id'>) => {
    const newAlert: CreditAlert = {
      ...alert,
      id: `alert-${Date.now()}`
    };
    setCreditAlert(newAlert);

    if (alert.type === 'added') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.2 }
        });
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      setCreditAlert(current => current?.id === newAlert.id ? null : current);
    }, 4500);
  };

  const dismissCreditAlert = () => {
    setCreditAlert(null);
  };

  // Judge Demo Tour
  const [demoStep, setDemoStep] = useState<number>(1);

  // Current active user
  const currentUser: StudentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(allUsers));
    localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUserId);
    localStorage.setItem(STORAGE_PREFIX + 'books', JSON.stringify(listings));
    localStorage.setItem(STORAGE_PREFIX + 'favourites', JSON.stringify(favourites));
    localStorage.setItem(STORAGE_PREFIX + 'sessions', JSON.stringify(learningSessions));
    localStorage.setItem(STORAGE_PREFIX + 'credit_tx', JSON.stringify(creditTransactions));
    localStorage.setItem(STORAGE_PREFIX + 'book_tx', JSON.stringify(transactions));
    localStorage.setItem(STORAGE_PREFIX + 'reports', JSON.stringify(reports));
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
    localStorage.setItem(STORAGE_PREFIX + 'writing_gigs', JSON.stringify(writingGigs));
    localStorage.setItem(STORAGE_PREFIX + 'writing_ann', JSON.stringify(writingAnnouncements));
    localStorage.setItem(STORAGE_PREFIX + 'writing_orders', JSON.stringify(writingOrders));
  }, [allUsers, currentUserId, listings, favourites, learningSessions, creditTransactions, transactions, reports, notifications, writingGigs, writingAnnouncements, writingOrders]);

  // Switch Active User
  const switchUserById = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
    }
  };

  // Update Profile
  const updateUserProfile = (updates: Partial<StudentUser>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return { ...u, ...updates };
      }
      return u;
    }));
  };

  // --- Learning Credit Management ---

  const addCredits = (amount: number, description: string, type: CreditTransaction['type']) => {
    const tx: CreditTransaction = {
      id: `ctx-${Date.now()}`,
      userId: currentUserId,
      amount,
      type,
      description,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setCreditTransactions(prev => [tx, ...prev]);
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return { ...u, credits: Math.max(0, u.credits + amount) };
      }
      return u;
    }));
  };

  // Fake Payment Top-Up: 5 Credits for ₹10
  const purchaseCreditPack = (paymentMethod: string) => {
    const tx: CreditTransaction = {
      id: `ctx-pack-${Date.now()}`,
      userId: currentUserId,
      amount: 5,
      type: 'purchased_pack',
      description: `Bought 5 Credits Pack for ₹10 via ${paymentMethod}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    setCreditTransactions(prev => [tx, ...prev]);

    // Check if there was a teacher pending unlock
    let updatedUnlocked = currentUser.unlockedTeacherIds;
    let creditsToAdd = 5;

    if (pendingUnlockTeacherId && !updatedUnlocked.includes(pendingUnlockTeacherId)) {
      // Auto-unlock the pending teacher match using 2 credits from the newly bought 5 credits!
      updatedUnlocked = [...updatedUnlocked, pendingUnlockTeacherId];
      creditsToAdd = 3; // +5 - 2 = 3 net gain

      const unlockTx: CreditTransaction = {
        id: `ctx-unlock-${Date.now()}`,
        userId: currentUserId,
        amount: -2,
        type: 'match_unlock',
        description: `Unlocked teacher match (${pendingUnlockTeacherId}) - 2 Credits`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        relatedEntityId: pendingUnlockTeacherId
      };
      setCreditTransactions(prev => [unlockTx, tx, ...prev]);
      setPendingUnlockTeacherId(null);
    }

    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          credits: u.credits + creditsToAdd,
          unlockedTeacherIds: updatedUnlocked
        };
      }
      return u;
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setFakePaymentModalOpen(false);
    return { success: true };
  };

  // Check if match is unlocked
  const isMatchUnlocked = (teacherId: string) => {
    if (teacherId === currentUserId) return true;
    return currentUser.unlockedTeacherIds?.includes(teacherId) || false;
  };

  // Unlock Match: Needs 2 Credits
  const unlockMatch = (teacherId: string): { success: boolean; message: string } => {
    if (isMatchUnlocked(teacherId)) {
      return { success: true, message: 'Already unlocked!' };
    }

    if (currentUser.credits < 2) {
      // Needs payment: open interactive fake payment modal!
      setPendingUnlockTeacherId(teacherId);
      setFakePaymentModalOpen(true);
      return { 
        success: false, 
        message: 'You need 2 credits to unlock this teacher match. Top up 5 credits for just ₹10!' 
      };
    }

    // Deduct 2 credits and unlock
    const unlockTx: CreditTransaction = {
      id: `ctx-unlock-${Date.now()}`,
      userId: currentUserId,
      amount: -2,
      type: 'match_unlock',
      description: `Unlocked teacher match - 2 Credits used`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      relatedEntityId: teacherId
    };

    setCreditTransactions(prev => [unlockTx, ...prev]);
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          credits: u.credits - 2,
          unlockedTeacherIds: [...(u.unlockedTeacherIds || []), teacherId]
        };
      }
      return u;
    }));

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    return { success: true, message: 'Teacher match successfully unlocked for 2 credits!' };
  };

  // --- Peer Learning Sessions ---

  const addSkillToTeach = (skill: SkillEntry) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        const existing = u.skillsCanTeach.some(s => s.name.toLowerCase() === skill.name.toLowerCase());
        if (existing) return u;
        return { ...u, skillsCanTeach: [...u.skillsCanTeach, skill] };
      }
      return u;
    }));
  };

  const addSkillToLearn = (skill: SkillEntry) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        const existing = u.skillsWantToLearn.some(s => s.name.toLowerCase() === skill.name.toLowerCase());
        if (existing) return u;
        return { ...u, skillsWantToLearn: [...u.skillsWantToLearn, skill] };
      }
      return u;
    }));
  };

  const removeSkill = (type: 'teach' | 'learn', skillName: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        if (type === 'teach') {
          return { ...u, skillsCanTeach: u.skillsCanTeach.filter(s => s.name !== skillName) };
        } else {
          return { ...u, skillsWantToLearn: u.skillsWantToLearn.filter(s => s.name !== skillName) };
        }
      }
      return u;
    }));
  };

  const requestSession = (
    teacherId: string, 
    skillName: string, 
    date: string, 
    time: string, 
    format: 'Online Video' | 'Campus In-Person', 
    notes?: string
  ) => {
    const teacher = allUsers.find(u => u.id === teacherId);
    if (!teacher) return { success: false, message: 'Teacher not found' };

    // Check if learner has at least 2 credits
    if (currentUser.credits < 2) {
      triggerCreditAlert({
        type: 'error',
        message: 'You need at least 2 credits to request a session. Sell a book or top up to earn credits!'
      });
      return { success: false, message: 'You need at least 2 credits to request a session.' };
    }

    const newSession: LearningSession = {
      id: `session-${Date.now()}`,
      topic: `${skillName} 1-on-1 Learning Session`,
      skillName,
      mentorId: teacher.id,
      mentorName: teacher.name,
      mentorAvatar: teacher.avatar,
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerAvatar: currentUser.avatar,
      scheduledDate: date,
      timeSlot: time,
      format,
      status: 'pending',
      creditsRequired: 2,
      creditsTransferred: false,
      confirmedByMentor: false,
      confirmedByLearner: false,
      notes: notes || 'Student requested peer learning session.'
    };

    // Deduct 2 credits from the current student
    setAllUsers(users => users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          credits: Math.max(0, u.credits - 2)
        };
      }
      return u;
    }));

    // Record credit transaction
    const deductTx: CreditTransaction = {
      id: `ctx-deduct-${Date.now()}`,
      userId: currentUser.id,
      amount: -2,
      type: 'spent_session',
      description: `Applied for 1-on-1 session: ${skillName} with ${teacher.name}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      relatedEntityId: newSession.id
    };
    setCreditTransactions(prev => [deductTx, ...prev]);

    setLearningSessions(prev => [newSession, ...prev]);

    // Send notification to teacher
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: teacherId,
      title: 'New Session Request!',
      message: `${currentUser.name} requested to learn ${skillName} with you. Accept to schedule and earn credits!`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '#my-sessions',
      type: 'session_request'
    };
    setNotifications(prev => [notif, ...prev]);

    // Interactive Toast Notification
    triggerCreditAlert({
      type: 'deducted',
      amount: 2,
      message: `2 Credits deducted for requesting ${skillName} with ${teacher.name}.`
    });

    return { success: true };
  };

  const scheduleLearningSession = (
    peerId: string, 
    skillName: string, 
    date: string, 
    timeSlot: string, 
    format: 'Online Video' | 'Campus In-Person', 
    notes?: string
  ) => {
    requestSession(peerId, skillName, date, timeSlot, format, notes);
  };

  const acceptSession = (sessionId: string) => {
    setLearningSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'upcoming' };
      }
      return s;
    }));
  };

  const rejectSession = (sessionId: string) => {
    setLearningSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'cancelled' };
      }
      return s;
    }));
  };

  // Mutual Completion Confirmation (transfers 5 credits to teacher)
  const confirmSessionCompletion = (sessionId: string, asRole: 'mentor' | 'learner') => {
    setLearningSessions(prev => prev.map(session => {
      if (session.id !== sessionId) return session;

      const updatedMentorConfirmed = asRole === 'mentor' ? true : session.confirmedByMentor;
      const updatedLearnerConfirmed = asRole === 'learner' ? true : session.confirmedByLearner;
      const bothConfirmed = updatedMentorConfirmed && updatedLearnerConfirmed;

      if (bothConfirmed && !session.creditsTransferred) {
        // Transfer 5 credits to Mentor
        setAllUsers(users => users.map(u => {
          if (u.id === session.mentorId) {
            return {
              ...u,
              credits: u.credits + 5,
              completedSessionsCount: u.completedSessionsCount + 1
            };
          }
          if (u.id === session.learnerId) {
            return {
              ...u,
              completedSessionsCount: u.completedSessionsCount + 1
            };
          }
          return u;
        }));

        // Record credit transaction for Mentor
        const earnTx: CreditTransaction = {
          id: `ctx-earn-${Date.now()}`,
          userId: session.mentorId,
          amount: 5,
          type: 'earned_teaching',
          description: `Earned 5 credits for successfully teaching ${session.skillName} to ${session.learnerName}`,
          timestamp: new Date().toISOString(),
          status: 'completed',
          relatedEntityId: session.id
        };
        setCreditTransactions(txs => [earnTx, ...txs]);

        // If current user is the mentor, trigger the celebration popup!
        if (session.mentorId === currentUserId) {
          setEarnedCreditPopupOpen(true);
        }

        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.5 }
          });
        } catch {
          // ignore
        }

        return {
          ...session,
          status: 'completed',
          confirmedByMentor: true,
          confirmedByLearner: true,
          creditsTransferred: true
        };
      }

      return {
        ...session,
        confirmedByMentor: updatedMentorConfirmed,
        confirmedByLearner: updatedLearnerConfirmed
      };
    }));
  };

  const updateSessionStatus = (sessionId: string, status: 'completed' | 'cancelled') => {
    if (status === 'completed') {
      confirmSessionCompletion(sessionId, 'mentor');
      confirmSessionCompletion(sessionId, 'learner');
    } else {
      rejectSession(sessionId);
    }
  };

  // --- Group Learning (3-4 Peers) & Live Meet ---

  const joinGroupSession = (sessionId: string): { success: boolean; message?: string } => {
    const session = learningSessions.find(s => s.id === sessionId);
    if (!session) return { success: false, message: 'Study group not found.' };

    if (session.mentorId === currentUserId) {
      return { success: false, message: 'You are the host/mentor of this group session!' };
    }

    const participants = session.enrolledParticipants || [];
    if (participants.some(p => p.studentId === currentUserId)) {
      return { success: false, message: 'You have already enrolled in this study group!' };
    }

    const max = session.maxParticipants || 4;
    if (participants.length >= max) {
      return { success: false, message: `This study group is full (maximum ${max} peers allowed).` };
    }

    if (currentUser.credits < 2) {
      triggerCreditAlert({
        type: 'error',
        message: 'You need at least 2 credits to join this group study circle. Top up or teach to earn credits!'
      });
      return { success: false, message: 'You need at least 2 credits to join.' };
    }

    // Deduct 2 credits
    setAllUsers(users => users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, credits: Math.max(0, u.credits - 2) };
      }
      return u;
    }));

    const deductTx: CreditTransaction = {
      id: `ctx-group-${Date.now()}`,
      userId: currentUser.id,
      amount: -2,
      type: 'spent_session',
      description: `Joined Group Study Circle: "${session.topic}" with ${session.mentorName}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      relatedEntityId: session.id
    };
    setCreditTransactions(prev => [deductTx, ...prev]);

    const newParticipant = {
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      role: 'learner' as const,
      joinedAt: 'Just now'
    };

    setLearningSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          enrolledParticipants: [...(s.enrolledParticipants || []), newParticipant]
        };
      }
      return s;
    }));

    // Notify mentor
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: session.mentorId,
      title: 'New Student Joined Your Group Study!',
      message: `${currentUser.name} joined "${session.topic}". Cohort now has ${(session.enrolledParticipants?.length || 0) + 1}/${max} peers.`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '#my-sessions',
      type: 'session_request'
    };
    setNotifications(prev => [notif, ...prev]);

    triggerCreditAlert({
      type: 'deducted',
      amount: 2,
      message: `2 Credits deducted. Enrolled in "${session.topic}" (${participants.length + 1}/${max} peers)!`
    });

    return { success: true };
  };

  const createGroupSession = (data: { 
    topic: string; 
    skillName: string; 
    maxParticipants: number; 
    scheduledDate: string; 
    timeSlot: string; 
    format: 'Online Video' | 'Campus In-Person'; 
    notes?: string; 
    startLiveImmediately?: boolean;
  }): { success: boolean; session?: LearningSession } => {
    const newSession: LearningSession = {
      id: `session-group-${Date.now()}`,
      topic: data.topic,
      skillName: data.skillName,
      mentorId: currentUser.id,
      mentorName: currentUser.name,
      mentorAvatar: currentUser.avatar,
      learnerId: 'group-cohort',
      learnerName: `Cohort of ${data.maxParticipants} Students`,
      learnerAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=250&q=80',
      scheduledDate: data.startLiveImmediately ? 'Today (Live Teaching)' : data.scheduledDate,
      timeSlot: data.startLiveImmediately ? 'Now Streaming' : data.timeSlot,
      format: data.format,
      status: 'upcoming',
      creditsRequired: 2,
      creditsTransferred: false,
      confirmedByMentor: false,
      confirmedByLearner: false,
      notes: data.notes || `Interactive group study circle for ${data.maxParticipants} peers.`,
      meetLink: `/room/${data.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
      sessionType: 'group',
      maxParticipants: data.maxParticipants,
      isLive: !!data.startLiveImmediately,
      liveStartedAt: data.startLiveImmediately ? new Date().toISOString() : undefined,
      enrolledParticipants: []
    };

    setLearningSessions(prev => [newSession, ...prev]);

    triggerCreditAlert({
      type: 'added',
      amount: 0,
      message: `Group study circle "${data.topic}" created (Max ${data.maxParticipants} peers)!`
    });

    if (data.startLiveImmediately) {
      setActiveLiveMeetSession(newSession);
    }

    return { success: true, session: newSession };
  };

  const toggleLiveMeet = (sessionId: string, isLive: boolean) => {
    setLearningSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        const updated = {
          ...s,
          isLive,
          liveStartedAt: isLive ? new Date().toISOString() : undefined
        };
        if (isLive) {
          setActiveLiveMeetSession(updated);
        }
        return updated;
      }
      return s;
    }));
  };

  // --- Book Marketplace ---

  const toggleFavourite = (bookId: string) => {
    setFavourites(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const addBook = (bookData: Omit<BookListing, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerCollege' | 'sellerRating' | 'status' | 'datePosted' | 'views' | 'favouritesCount'>) => {
    const newBook: BookListing = {
      ...bookData,
      id: `book-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerCollege: currentUser.institution,
      sellerRating: currentUser.rating,
      status: 'active',
      datePosted: new Date().toISOString().split('T')[0],
      views: 1,
      favouritesCount: 0,
      tags: bookData.tags || [bookData.category, 'Textbook'],
      isDemo: true
    };
    setListings(prev => [newBook, ...prev]);
  };

  const addListing = addBook;

  const deleteListing = (bookId: string) => {
    setListings(prev => prev.filter(b => b.id !== bookId));
  };

  const completePurchase = (bookId: string, paymentMethod: string) => {
    const targetBook = listings.find(b => b.id === bookId);
    if (!targetBook || targetBook.status !== 'active') {
      return { success: false };
    }

    const price = targetBook.price;
    const platformCommission = Math.round(price * commissionRate); // e.g. 2% of ₹500 = ₹10
    const sellerPayout = price - platformCommission;                // ₹490
    const savings = Math.max(0, targetBook.originalReferencePrice - price);
    const isDigitalPdf = targetBook.itemFormat === 'pdf';

    const tx: TransactionRecord = {
      id: `tx-book-${Date.now()}`,
      listingId: targetBook.id,
      listingTitle: targetBook.title,
      listingCategory: targetBook.category,
      sellerId: targetBook.sellerId,
      sellerName: targetBook.sellerName,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      price,
      originalReferencePrice: targetBook.originalReferencePrice,
      estimatedStudentSavings: savings,
      commissionRate,
      platformCommission,
      sellerPayout,
      listingType: 'sell',
      status: isDigitalPdf ? 'completed' : 'escrow_hold',
      timestamp: new Date().toISOString(),
      isDemo: true,
      paymentMethod,
      itemFormat: targetBook.itemFormat || 'physical',
      escrowStatus: isDigitalPdf ? 'released_to_seller' : 'held_in_escrow',
      escrowHeldAmount: price,
      inspectionDeadline: isDigitalPdf ? undefined : 'In 48 Hours (Campus Handover & Inspection Window)'
    };

    // Mark book as sold
    setListings(prev => prev.map(b => b.id === bookId ? { ...b, status: 'sold' as const } : b));
    setTransactions(prev => [tx, ...prev]);

    if (isDigitalPdf) {
      // PDF: immediate payout and immediate +2 credits
      setAllUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return { 
            ...u, 
            credits: u.credits + 2,
            moneySaved: u.moneySaved + savings,
            itemsReusedCount: (u.itemsReusedCount || 0) + 1
          };
        }
        if (u.id === targetBook.sellerId) {
          return { 
            ...u, 
            credits: u.credits + 2,
            earnings: u.earnings + sellerPayout,
            itemsReusedCount: (u.itemsReusedCount || 0) + 1
          };
        }
        return u;
      }));

      const buyerRewardTx: CreditTransaction = {
        id: `ctx-book-buy-${Date.now()}`,
        userId: currentUser.id,
        amount: 2,
        type: 'earned_book',
        description: `Earned +2 bonus credits for purchasing PDF notes: "${targetBook.title}"`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        relatedEntityId: tx.id
      };

      const sellerRewardTx: CreditTransaction = {
        id: `ctx-book-sell-${Date.now()}`,
        userId: targetBook.sellerId,
        amount: 2,
        type: 'earned_book',
        description: `Earned +2 bonus credits for selling PDF notes: "${targetBook.title}"`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        relatedEntityId: tx.id
      };

      setCreditTransactions(prev => [buyerRewardTx, sellerRewardTx, ...prev]);

      const sellerNotif: NotificationItem = {
        id: `notif-${Date.now()}-seller`,
        userId: targetBook.sellerId,
        title: 'PDF Notes Purchased!',
        message: `${currentUser.name} purchased "${targetBook.title}". ₹${sellerPayout} earnings and +2 credits deposited to your wallet!`,
        timestamp: 'Just now',
        read: false,
        actionUrl: '#credits',
        type: 'book_order'
      };
      setNotifications(prev => [sellerNotif, ...prev]);

      triggerCreditAlert({
        type: 'added',
        amount: 2,
        message: `+2 Credits added to your wallet for PDF purchase!`
      });
    } else {
      // Physical Book: Funds are held safely in Campus Escrow!
      setAllUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return { 
            ...u, 
            moneySaved: u.moneySaved + savings,
            itemsReusedCount: (u.itemsReusedCount || 0) + 1
          };
        }
        return u;
      }));

      const sellerNotif: NotificationItem = {
        id: `notif-${Date.now()}-seller`,
        userId: targetBook.sellerId,
        title: 'New Book Order in Campus Escrow!',
        message: `${currentUser.name} purchased "${targetBook.title}". ₹${price} is securely locked in Campus Escrow. Meet on campus to handover book.`,
        timestamp: 'Just now',
        read: false,
        actionUrl: '#marketplace',
        type: 'book_order'
      };

      const buyerNotif: NotificationItem = {
        id: `notif-${Date.now()}-buyer`,
        userId: currentUser.id,
        title: 'Escrow Protection Active',
        message: `₹${price} for "${targetBook.title}" is locked in Campus Escrow. Inspect book on campus & tap 'Release Escrow' within 48h.`,
        timestamp: 'Just now',
        read: false,
        actionUrl: '#marketplace',
        type: 'book_order'
      };

      setNotifications(prev => [sellerNotif, buyerNotif, ...prev]);

      triggerCreditAlert({
        type: 'added',
        message: `Escrow Active: ₹${price} safely locked in Campus Escrow!`
      });
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    return { success: true, transaction: tx };
  };

  const releaseBookEscrow = (transactionId: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return { success: false, message: 'Transaction not found' };
    if (tx.status === 'completed' || tx.escrowStatus === 'released_to_seller') {
      return { success: false, message: 'Escrow has already been released' };
    }

    // Update transaction to completed & released
    const updatedTx: TransactionRecord = {
      ...tx,
      status: 'completed',
      escrowStatus: 'released_to_seller',
      escrowReleasedAt: new Date().toISOString()
    };

    setTransactions(prev => prev.map(t => t.id === transactionId ? updatedTx : t));

    // Credit seller with payout earnings and both parties with +2 credits
    setAllUsers(prev => prev.map(u => {
      if (u.id === tx.sellerId) {
        return {
          ...u,
          credits: u.credits + 2,
          earnings: u.earnings + tx.sellerPayout,
          itemsReusedCount: (u.itemsReusedCount || 0) + 1
        };
      }
      if (u.id === tx.buyerId) {
        return {
          ...u,
          credits: u.credits + 2
        };
      }
      return u;
    }));

    const buyerRewardTx: CreditTransaction = {
      id: `ctx-escrow-buy-${Date.now()}`,
      userId: tx.buyerId,
      amount: 2,
      type: 'earned_book',
      description: `Earned +2 bonus credits for verifying receipt of "${tx.listingTitle}"`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      relatedEntityId: tx.id
    };

    const sellerRewardTx: CreditTransaction = {
      id: `ctx-escrow-sell-${Date.now()}`,
      userId: tx.sellerId,
      amount: 2,
      type: 'earned_book',
      description: `Earned +2 bonus credits & received ₹${tx.sellerPayout} payout for "${tx.listingTitle}"`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      relatedEntityId: tx.id
    };

    setCreditTransactions(prev => [buyerRewardTx, sellerRewardTx, ...prev]);

    const sellerNotif: NotificationItem = {
      id: `notif-${Date.now()}-seller-rel`,
      userId: tx.sellerId,
      title: 'Escrow Released — ₹' + tx.sellerPayout + ' Credited!',
      message: `${tx.buyerName} confirmed receipt of "${tx.listingTitle}". Your payout of ₹${tx.sellerPayout} and +2 credits have been credited to your wallet!`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '#credits',
      type: 'book_order'
    };

    const buyerNotif: NotificationItem = {
      id: `notif-${Date.now()}-buyer-rel`,
      userId: tx.buyerId,
      title: 'Book Escrow Verified & Completed',
      message: `You released escrow for "${tx.listingTitle}". +2 Learning Credits rewarded!`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '#marketplace',
      type: 'book_order'
    };

    setNotifications(prev => [sellerNotif, buyerNotif, ...prev]);

    triggerCreditAlert({
      type: 'added',
      amount: 2,
      message: `Escrow Released! ₹${tx.sellerPayout} paid to seller & +2 credits rewarded!`
    });

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    return { success: true };
  };

  const disputeBookEscrow = (transactionId: string, reason: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return { success: false, message: 'Transaction not found' };

    const updatedTx: TransactionRecord = {
      ...tx,
      status: 'disputed',
      escrowStatus: 'disputed',
      disputeReason: reason
    };

    setTransactions(prev => prev.map(t => t.id === transactionId ? updatedTx : t));

    const rep: ModerationReport = {
      id: `rep-escrow-${Date.now()}`,
      targetType: 'listing',
      targetId: tx.id,
      targetTitle: `Escrow Dispute: ${tx.listingTitle}`,
      reporterName: currentUser.name,
      reason: `Buyer raised escrow dispute: ${reason}. Total held: ₹${tx.price}.`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setReports(prev => [rep, ...prev]);

    triggerCreditAlert({
      type: 'error',
      message: `Escrow disputed. Funds remain on hold for campus mediation.`
    });

    return { success: true };
  };

  // ============================================================
  // STUDENT WRITING GIGS & ASSIGNMENT / RECORD ESCROW
  // ============================================================

  const addWritingGig = (data: {
    title: string;
    serviceType: WritingGigListing['serviceType'];
    pricingModel: WritingGigListing['pricingModel'];
    rate: number;
    turnaroundDays: number;
    handwritingSample?: string;
    languages: string[];
    description: string;
  }) => {
    const newGig: WritingGigListing = {
      id: `gig-${Date.now()}`,
      writerId: currentUser.id,
      writerName: currentUser.name,
      writerAvatar: currentUser.avatar,
      writerCollege: currentUser.institution,
      writerRating: currentUser.rating || 4.95,
      reviewsCount: 1,
      title: data.title,
      serviceType: data.serviceType,
      pricingModel: data.pricingModel,
      rate: data.rate,
      turnaroundDays: data.turnaroundDays,
      handwritingSample: data.handwritingSample || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      languages: data.languages.length > 0 ? data.languages : ['English'],
      description: data.description,
      completedJobsCount: 0,
      isAvailable: true,
      datePosted: new Date().toISOString().split('T')[0]
    };

    setWritingGigs(prev => [newGig, ...prev]);
    triggerCreditAlert({
      type: 'added',
      message: `Your writing service "${data.title}" is now live for students to hire!`
    });
  };

  const postWritingAnnouncement = (data: {
    title: string;
    category: WritingJobAnnouncement['category'];
    subject: string;
    pagesCount: number;
    deadline: string;
    budget: number;
    instructions: string;
  }) => {
    const newAnn: WritingJobAnnouncement = {
      id: `ann-${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      requesterCollege: currentUser.institution,
      title: data.title,
      category: data.category,
      subject: data.subject,
      pagesCount: data.pagesCount,
      deadline: data.deadline,
      budget: data.budget,
      instructions: data.instructions,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWritingAnnouncements(prev => [newAnn, ...prev]);
    triggerCreditAlert({
      type: 'added',
      message: `Announcement posted! Student writers will be able to review and claim your work.`
    });
  };

  const createWritingOrderFromGig = (gigId: string, pagesCount: number, instructions: string) => {
    const gig = writingGigs.find(g => g.id === gigId);
    if (!gig) return { success: false, message: 'Writing service not found' };

    const totalAmount = gig.pricingModel === 'per_page' 
      ? Math.max(gig.rate * Math.max(pagesCount, 1), 50) 
      : gig.rate;
    const advanceAmount = 10; // Strictly ₹10 advance as required
    const remainingAmount = Math.max(totalAmount - advanceAmount, 0);
    const platformFee = Math.round(totalAmount * 0.02 * 100) / 100; // 2% to app
    const writerPayout = Math.round((totalAmount - platformFee) * 100) / 100; // 98% to writer

    const orderNumber = `WR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: WritingOrder = {
      id: `order-${Date.now()}`,
      orderNumber,
      gigId: gig.id,
      title: `${gig.serviceType}: ${gig.title}`,
      category: gig.serviceType,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterCollege: currentUser.institution,
      writerId: gig.writerId,
      writerName: gig.writerName,
      writerAvatar: gig.writerAvatar,
      writerCollege: gig.writerCollege,
      totalAmount,
      advanceAmount,
      remainingAmount,
      platformFeeRate: 0.02,
      platformFee,
      writerPayout,
      advancePaid: true,
      advancePaidAt: new Date().toLocaleString(),
      materialsSubmitted: true,
      workInstructions: instructions,
      workSubmitted: false,
      finalPaid: false,
      status: 'in_progress',
      pagesCount,
      deadline: `${gig.turnaroundDays} Days Delivery`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWritingOrders(prev => [newOrder, ...prev]);

    // Send notification to writer
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: gig.writerId,
      title: 'New Writing Order Assigned! (₹10 Advance Received)',
      message: `${currentUser.name} hired you for "${gig.title}". ₹10 advance escrow locked. Total payout upon completion: ₹${writerPayout}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system'
    };
    setNotifications(prev => [notif, ...prev]);

    triggerCreditAlert({
      type: 'added',
      message: `₹10 Advance paid! Order #${orderNumber} locked with ${gig.writerName}.`
    });

    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
    } catch {}

    return { success: true, order: newOrder };
  };

  const acceptWritingAnnouncement = (announcementId: string) => {
    const ann = writingAnnouncements.find(a => a.id === announcementId);
    if (!ann) return { success: false, message: 'Announcement not found' };

    const totalAmount = ann.budget;
    const advanceAmount = 10;
    const remainingAmount = Math.max(totalAmount - advanceAmount, 0);
    const platformFee = Math.round(totalAmount * 0.02 * 100) / 100;
    const writerPayout = Math.round((totalAmount - platformFee) * 100) / 100;

    const orderNumber = `WR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: WritingOrder = {
      id: `order-${Date.now()}`,
      orderNumber,
      announcementId: ann.id,
      title: ann.title,
      category: ann.category,
      requesterId: ann.requesterId,
      requesterName: ann.requesterName,
      requesterCollege: ann.requesterCollege,
      writerId: currentUser.id,
      writerName: currentUser.name,
      writerAvatar: currentUser.avatar,
      writerCollege: currentUser.institution,
      totalAmount,
      advanceAmount,
      remainingAmount,
      platformFeeRate: 0.02,
      platformFee,
      writerPayout,
      advancePaid: true,
      advancePaidAt: new Date().toLocaleString(),
      materialsSubmitted: true,
      workInstructions: ann.instructions,
      workSubmitted: false,
      finalPaid: false,
      status: 'in_progress',
      pagesCount: ann.pagesCount,
      deadline: ann.deadline,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWritingOrders(prev => [newOrder, ...prev]);
    setWritingAnnouncements(prev => prev.map(a => a.id === announcementId ? {
      ...a,
      status: 'assigned',
      assignedWriterId: currentUser.id,
      assignedWriterName: currentUser.name
    } : a));

    triggerCreditAlert({
      type: 'added',
      message: `You accepted "${ann.title}"! ₹10 advance locked in escrow.`
    });

    return { success: true, order: newOrder };
  };

  const submitOrderWork = (orderId: string, notes: string, sampleImages?: string[]) => {
    setWritingOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          workSubmitted: true,
          workSubmittedAt: new Date().toLocaleString(),
          workSubmissionNotes: notes,
          workSampleImages: sampleImages || [
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80'
          ],
          status: 'submitted_for_review'
        };
      }
      return order;
    }));

    const order = writingOrders.find(o => o.id === orderId);
    if (order) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: order.requesterId,
        title: 'Writing Work Submitted for Review!',
        message: `${order.writerName} has submitted completed work for "${order.title}". Review and release payment.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'system'
      };
      setNotifications(prev => [notif, ...prev]);
    }

    triggerCreditAlert({
      type: 'added',
      message: 'Work submitted for student review!'
    });
  };

  const approveAndCompleteWritingOrder = (orderId: string) => {
    const order = writingOrders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    // Update order status to completed
    setWritingOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      finalPaid: true,
      finalPaidAt: new Date().toLocaleString(),
      status: 'completed'
    } : o));

    // Update student balances:
    // Writer receives writerPayout (98%), app earns platformFee (2%), and both earn +2 credits
    setAllUsers(prev => prev.map(u => {
      if (u.id === order.writerId) {
        return {
          ...u,
          credits: u.credits + 2,
          earnings: u.earnings + order.writerPayout,
          completedSessionsCount: (u.completedSessionsCount || 0) + 1
        };
      }
      if (u.id === order.requesterId) {
        return {
          ...u,
          credits: u.credits + 2
        };
      }
      return u;
    }));

    // Record credit transactions (+2 for both)
    const reqCreditTx: CreditTransaction = {
      id: `ctx-writing-req-${Date.now()}`,
      userId: order.requesterId,
      amount: 2,
      type: 'earned_book',
      description: `Earned +2 bonus credits for completing writing order: "${order.title}"`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    const writerCreditTx: CreditTransaction = {
      id: `ctx-writing-wri-${Date.now()}`,
      userId: order.writerId,
      amount: 2,
      type: 'earned_teaching',
      description: `Earned +2 bonus credits for writing delivery: "${order.title}"`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    setCreditTransactions(prev => [reqCreditTx, writerCreditTx, ...prev]);

    triggerCreditAlert({
      type: 'added',
      message: `Work approved! Remaining ₹${order.remainingAmount} released. (2% App Fee: ₹${order.platformFee.toFixed(2)}, Writer Payout: ₹${order.writerPayout.toFixed(2)}). +2 Bonus Credits added!`
    });

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    } catch {}

    return { success: true };
  };

  // --- Reports & Moderation ---

  const submitReport = (targetType: 'listing' | 'session' | 'user', targetId: string, targetTitle: string, reason: string) => {
    const report: ModerationReport = {
      id: `rep-${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      reporterName: currentUser.name,
      reason,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setReports(prev => [report, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'remove_listing' | 'dismiss') => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: 'resolved' };
      }
      return r;
    }));

    if (action === 'remove_listing') {
      const rep = reports.find(r => r.id === reportId);
      if (rep && rep.targetType === 'listing') {
        setListings(prev => prev.filter(b => b.id !== rep.targetId));
      }
    }
  };

  // --- Notifications ---
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // --- Judge Demo Tour Steps ---
  const runDemoNextStep = () => {
    setDemoStep(prev => (prev >= 6 ? 1 : prev + 1));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setAllUsers(SEED_USERS);
    setCurrentUserId('user-adil');
    setListings(SEED_BOOKS);
    setLearningSessions(SEED_SESSIONS);
    setCreditTransactions(SEED_CREDIT_TRANSACTIONS);
    setTransactions(SEED_TRANSACTIONS);
    setReports(SEED_REPORTS);
    setNotifications(SEED_NOTIFICATIONS);
    setDemoStep(1);
    setFakePaymentModalOpen(false);
    setEarnedCreditPopupOpen(false);
  };

  // Metrics calculation
  const totalMoneySaved = transactions.reduce((sum, t) => sum + (t.estimatedStudentSavings || 0), 2800);
  const platformCommissionEarned = transactions.reduce((sum, t) => sum + (t.platformCommission || 0), 24);
  const booksReused = transactions.length + 5;
  const peerSessionsCompleted = learningSessions.filter(s => s.status === 'completed').length;

  const platformStats = {
    totalStudents: allUsers.length,
    skillsExchanged: 18,
    creditsCirculated: creditTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0),
    booksReused,
    moneySaved: totalMoneySaved,
    platformCommissionEarned
  };

  const sustainabilityStats = {
    itemsReused: booksReused,
    secondHandTransactions: transactions.length,
    donationsCompleted: 2,
    totalMoneySaved,
    peerLearningSessionsCompleted: peerSessionsCompleted,
    studentServiceEarnings: transactions.reduce((acc, t) => acc + (t.sellerPayout || 0), 1200),
    activeStudents: allUsers.length,
    estimatedCo2Kg: Math.round(booksReused * 2.4),
    platformCommissionEarned
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser: (u) => setAllUsers(prev => prev.map(user => user.id === u.id ? u : user)),
      switchUserById,
      allUsers,
      updateUserProfile,

      // Credits & Fake Payment
      creditTransactions,
      addCredits,
      purchaseCreditPack,
      unlockMatch,
      isMatchUnlocked,
      fakePaymentModalOpen,
      setFakePaymentModalOpen,
      pendingUnlockTeacherId,
      setPendingUnlockTeacherId,
      earnedCreditPopupOpen,
      setEarnedCreditPopupOpen,
      creditAlert,
      triggerCreditAlert,
      dismissCreditAlert,

      // Books
      listings,
      books: listings,
      favourites,
      toggleFavourite,
      addBook,
      addListing,
      deleteListing,
      completePurchase,
      releaseBookEscrow,
      disputeBookEscrow,

      // Learning Sessions
      learningSessions,
      addSkillToTeach,
      addSkillToLearn,
      removeSkill,
      requestSession,
      scheduleLearningSession,
      acceptSession,
      rejectSession,
      confirmSessionCompletion,
      updateSessionStatus,

      // Group Learning & Live Meet
      joinGroupSession,
      createGroupSession,
      toggleLiveMeet,
      activeLiveMeetSession,
      setActiveLiveMeetSession,

      // Student Writing Gigs & Assignments Escrow
      writingGigs,
      writingAnnouncements,
      writingOrders,
      addWritingGig,
      postWritingAnnouncement,
      createWritingOrderFromGig,
      acceptWritingAnnouncement,
      submitOrderWork,
      approveAndCompleteWritingOrder,

      // Transactions & Commission
      transactions,
      commissionRate,
      setCommissionRate,

      // Reports & Notifications
      reports,
      resolveReport,
      submitReport,
      notifications,
      markNotificationRead,

      // Demo Tour & Stats
      demoStep,
      setDemoStep,
      runDemoNextStep,
      resetDemoData,
      platformStats,
      sustainabilityStats,

      // Legacy compatibility
      services: [],
      serviceBookings: [],
      addService: () => {},
      bookService: () => {},
      updateBookingStatus: () => {},
      addServiceReview: () => {},
      postTransactionModalOpen: false,
      setPostTransactionModalOpen: () => {},
      lastCompletedTransaction: null
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

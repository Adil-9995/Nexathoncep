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
  CreditAlert
} from '../types';
import { 
  SEED_USERS, 
  SEED_BOOKS, 
  SEED_SESSIONS, 
  SEED_CREDIT_TRANSACTIONS, 
  SEED_TRANSACTIONS, 
  SEED_REPORTS,
  SEED_NOTIFICATIONS 
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

  // Book Listings
  const [listings, setListings] = useState<BookListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'books');
    return saved ? JSON.parse(saved) : SEED_BOOKS;
  });

  // Favourites
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'favourites');
    return saved ? JSON.parse(saved) : ['book-1'];
  });

  // Learning Sessions with automatic merging of new group study circles
  const [learningSessions, setLearningSessions] = useState<LearningSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'sessions');
    if (saved) {
      try {
        const parsed: LearningSession[] = JSON.parse(saved);
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

  // Credit Transactions
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'credit_tx');
    return saved ? JSON.parse(saved) : SEED_CREDIT_TRANSACTIONS;
  });

  // Book Marketplace Transactions
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'book_tx');
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
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
  }, [allUsers, currentUserId, listings, favourites, learningSessions, creditTransactions, transactions, reports, notifications]);

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
      meetLink: `https://meet.nexathon.edu/room/${data.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
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
      status: 'completed',
      timestamp: new Date().toISOString(),
      isDemo: true,
      paymentMethod
    };

    // Mark book as sold
    setListings(prev => prev.map(b => b.id === bookId ? { ...b, status: 'sold' as const } : b));
    setTransactions(prev => [tx, ...prev]);

    // Update student savings, seller earnings, and reward +2 CREDITS TO BOTH PERSONS
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

    // Record +2 Credit Transactions for Both Buyer and Seller
    const buyerRewardTx: CreditTransaction = {
      id: `ctx-book-buy-${Date.now()}`,
      userId: currentUser.id,
      amount: 2,
      type: 'earned_book',
      description: `Earned +2 bonus credits for purchasing textbook: "${targetBook.title}"`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      relatedEntityId: tx.id
    };

    const sellerRewardTx: CreditTransaction = {
      id: `ctx-book-sell-${Date.now()}`,
      userId: targetBook.sellerId,
      amount: 2,
      type: 'earned_book',
      description: `Earned +2 bonus credits for selling textbook: "${targetBook.title}"`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      relatedEntityId: tx.id
    };

    setCreditTransactions(prev => [buyerRewardTx, sellerRewardTx, ...prev]);

    // Send notification to Seller
    const sellerNotif: NotificationItem = {
      id: `notif-${Date.now()}-seller`,
      userId: targetBook.sellerId,
      title: 'Book Sold & +2 Credits Added!',
      message: `${currentUser.name} purchased "${targetBook.title}". ₹${sellerPayout} earnings and +2 bonus learning credits added to your wallet!`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '#my-credits',
      type: 'book_order'
    };
    setNotifications(prev => [sellerNotif, ...prev]);

    // Interactive Toast Notification for Buyer
    triggerCreditAlert({
      type: 'added',
      amount: 2,
      message: `+2 Credits added to your wallet for book transaction!`
    });

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

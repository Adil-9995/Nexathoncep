export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningFormat = 'Online' | 'In-Person' | 'Hybrid';

export type BookCategory = 
  | 'Computer Science & IT'
  | 'Electronics & Communication'
  | 'Mechanical & Civil'
  | 'Design & Architecture'
  | 'Mathematics & Sciences'
  | 'Business & Management'
  | 'Competitive Exams'
  | 'General Reference';

export type ListingCategory = 
  | 'Textbooks'
  | 'Calculators'
  | 'Stationery'
  | 'Lab Accessories'
  | 'Educational Equipment'
  | 'Original Study Notes'
  | 'Free Donations'
  | BookCategory;

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair';
export type ListingType = 'sell' | 'donate' | 'exchange';
export type ListingStatus = 'active' | 'sold' | 'reserved' | 'donated';

export interface SkillEntry {
  name: string;
  level: SkillLevel;
  category?: string;
  description?: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  institution: string;
  course: string;
  department: string;
  academicYear: string;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  skillsCanTeach: SkillEntry[];
  skillsWantToLearn: SkillEntry[];
  preferredFormat: LearningFormat;
  availableDays: string[];
  availableTimeSlots: string[];
  bio: string;
  credits: number; // CampusLoop Learning Credits (5 credits earned per teaching session, 2 needed to unlock match)
  unlockedTeacherIds: string[]; // Teacher matches unlocked by this student
  completedSessionsCount: number;
  itemsReusedCount: number;
  moneySaved: number;
  earnings: number;
  rating: number;
  reviewsCount?: number;
  role: 'student' | 'admin';
}

export interface ServiceListing {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerCollege: string;
  providerRating: number;
  reviewCount: number;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  deliveryMode: 'Online' | 'In-Person' | 'Flexible';
  availability: string;
  isDemo?: boolean;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  providerId: string;
  providerName: string;
  clientId: string;
  clientName: string;
  scheduledDate: string;
  timeSlot: string;
  price: number;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  notes: string;
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface CreditAlert {
  id: string;
  type: 'added' | 'deducted' | 'error';
  amount?: number;
  message: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // e.g. +5, -2, -5, +5, +2
  type: 'earned_teaching' | 'spent_learning' | 'purchased_pack' | 'starter_grant' | 'match_unlock' | 'refunded' | 'earned_book' | 'spent_session';
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  relatedEntityId?: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  author?: string;
  subject?: string;
  course?: string;
  description: string;
  category: ListingCategory;
  price: number; // in INR (₹)
  originalReferencePrice: number; // For transparent savings calculation
  condition: ItemCondition;
  listingType: ListingType;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerCollege: string;
  sellerRating: number;
  status: ListingStatus;
  datePosted: string;
  views: number;
  favouritesCount: number;
  tags: string[];
  isDemo?: boolean;

  // Digital PDF Notes extensions
  itemFormat?: 'physical' | 'pdf';
  pdfPageCount?: number;
  pdfFileSize?: string;
  pdfSampleUrl?: string;
}

export type BookListing = MarketplaceListing;

export type WritingServiceType = 
  | 'Lab Record Writing'
  | 'Assignment Writing'
  | 'Observation Notebook'
  | 'Project Report / Paper'
  | 'Diagrams & Engineering Graphs';

export interface WritingGigListing {
  id: string;
  writerId: string;
  writerName: string;
  writerAvatar: string;
  writerCollege: string;
  writerRating: number;
  reviewsCount: number;
  title: string;
  serviceType: WritingServiceType;
  pricingModel: 'per_page' | 'per_record' | 'fixed';
  rate: number; // in INR
  turnaroundDays: number;
  handwritingSample: string;
  languages: string[];
  description: string;
  completedJobsCount: number;
  isAvailable: boolean;
  datePosted: string;
}

export interface WritingJobAnnouncement {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterCollege: string;
  title: string;
  category: WritingServiceType;
  subject: string;
  pagesCount: number;
  deadline: string;
  budget: number; // in INR
  instructions: string;
  status: 'open' | 'assigned' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
  assignedWriterId?: string;
  assignedWriterName?: string;
  createdAt: string;
}

export interface WritingOrder {
  id: string;
  orderNumber: string;
  gigId?: string;
  announcementId?: string;
  title: string;
  category: WritingServiceType;
  requesterId: string;
  requesterName: string;
  requesterCollege: string;
  writerId: string;
  writerName: string;
  writerAvatar: string;
  writerCollege: string;
  totalAmount: number;
  advanceAmount: number; // Always 10 INR as required
  remainingAmount: number; // totalAmount - 10
  platformFeeRate: number; // 0.02 (2% to app)
  platformFee: number; // 2% of totalAmount
  writerPayout: number; // remaining/total - platformFee
  advancePaid: boolean;
  advancePaidAt?: string;
  materialsSubmitted: boolean;
  workInstructions?: string;
  workSubmitted: boolean;
  workSubmittedAt?: string;
  workSubmissionNotes?: string;
  workSampleImages?: string[];
  finalPaid: boolean;
  finalPaidAt?: string;
  status: 'advance_pending' | 'in_progress' | 'submitted_for_review' | 'completed' | 'cancelled';
  pagesCount: number;
  deadline: string;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  price: number;
  originalReferencePrice: number;
  estimatedStudentSavings: number;
  commissionRate: number; // e.g. 0.02 (2%)
  platformCommission: number; // e.g. ₹10 on ₹500
  sellerPayout: number; // e.g. ₹490 on ₹500
  listingType: ListingType;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: string;
  isDemo: boolean;
  paymentMethod?: string;
}

export interface SessionParticipant {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  role: 'learner' | 'mentor';
  joinedAt?: string;
}

export interface LearningSession {
  id: string;
  topic: string;
  skillName: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  scheduledDate: string;
  timeSlot: string;
  format: 'Online Video' | 'Campus In-Person';
  status: 'pending' | 'accepted' | 'upcoming' | 'completed' | 'cancelled' | 'disputed';
  creditsRequired: number; // default 2 or 5 credits
  creditsTransferred: boolean;
  confirmedByMentor: boolean;
  confirmedByLearner: boolean;
  notes?: string;
  meetLink?: string;
  location?: string;
  
  // Group Learning & Live Meet
  sessionType?: '1-on-1' | 'group';
  maxParticipants?: number; // 3 or 4 peers
  enrolledParticipants?: SessionParticipant[];
  isLive?: boolean;
  liveStartedAt?: string;
}

export interface LearningMatchCycleNode {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  college: string;
  teachesSkill: string;
  teachesToId: string;
  teachesToName: string;
  learnsSkill: string;
  learnsFromId: string;
  learnsFromName: string;
}

export interface LearningMatch {
  id: string;
  type: 'direct' | '3-way-cycle';
  nodes: LearningMatchCycleNode[];
  compatibilityScore: number;
  matchReasons: string[];
  status: 'suggested' | 'accepted' | 'declined';
  isUnlocked?: boolean;
}

export interface ModerationReport {
  id: string;
  targetType: 'listing' | 'session' | 'user';
  targetId: string;
  targetTitle: string;
  reporterName: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  type: 'session_request' | 'session_accepted' | 'session_completed' | 'credits_earned' | 'credits_spent' | 'book_order' | 'system';
}

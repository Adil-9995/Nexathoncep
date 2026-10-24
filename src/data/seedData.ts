import { 
  StudentUser, 
  BookListing, 
  LearningSession, 
  TransactionRecord,
  ModerationReport,
  NotificationItem,
  CreditTransaction
} from '../types';

export const SEED_USERS: StudentUser[] = [
  {
    id: 'user-adil',
    name: 'Adil Hassan',
    email: 'adil.h@nexathon.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    institution: 'National Institute of Technology',
    course: 'B.Tech Computer Science',
    department: 'School of Computing',
    academicYear: '3rd Year',
    isVerified: true,
    verificationStatus: 'verified',
    skillsCanTeach: [
      { name: 'Figma', level: 'Advanced', category: 'UI/UX Design', description: 'Design systems, prototyping, wireframing & auto-layout' },
      { name: 'Java', level: 'Advanced', category: 'Programming', description: 'OOP concepts, collections, concurrency & algorithms' }
    ],
    skillsWantToLearn: [
      { name: 'Flutter', level: 'Beginner', category: 'Mobile Dev', description: 'Cross-platform app building with Dart & state management' },
      { name: 'Django', level: 'Beginner', category: 'Backend Web', description: 'Python REST APIs & ORM models' }
    ],
    preferredFormat: 'Hybrid',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['Evening (5 PM - 8 PM)', 'Weekend Mornings'],
    bio: 'CS student passionate about UI/UX design in Figma and backend Java. Looking to learn Flutter from peer developers!',
    credits: 5, // 5 starter credits
    unlockedTeacherIds: [],
    completedSessionsCount: 4,
    itemsReusedCount: 3,
    moneySaved: 2800,
    earnings: 1950,
    rating: 4.95,
    reviewsCount: 8,
    role: 'student',
  },
  {
    id: 'user-anu',
    name: 'Anu Susan',
    email: 'anu.s@nexathon.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    institution: 'National Institute of Technology',
    course: 'B.Tech Information Technology',
    department: 'School of IT',
    academicYear: '3rd Year',
    isVerified: true,
    verificationStatus: 'verified',
    skillsCanTeach: [
      { name: 'Django', level: 'Advanced', category: 'Backend Web', description: 'Python backend, Django REST framework, PostgreSQL integration' },
      { name: 'Python', level: 'Advanced', category: 'Programming', description: 'Core Python, scripting, data handling and automation' }
    ],
    skillsWantToLearn: [
      { name: 'Figma', level: 'Beginner', category: 'UI/UX Design', description: 'Modern UI design, responsive grids and component variants' }
    ],
    preferredFormat: 'Online',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    availableTimeSlots: ['Evening (5 PM - 8 PM)', 'Afternoon (2 PM - 5 PM)'],
    bio: 'Backend developer proficient in Django and Python. Eager to master Figma design from student peers to design my own web apps!',
    credits: 5,
    unlockedTeacherIds: [],
    completedSessionsCount: 6,
    itemsReusedCount: 2,
    moneySaved: 3400,
    earnings: 2400,
    rating: 5.0,
    reviewsCount: 12,
    role: 'student',
  },
  {
    id: 'user-anju',
    name: 'Anju Kurian',
    email: 'anju.k@nexathon.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    institution: 'National Institute of Technology',
    course: 'B.Tech Computer Science',
    department: 'School of Computing',
    academicYear: '4th Year',
    isVerified: true,
    verificationStatus: 'verified',
    skillsCanTeach: [
      { name: 'Flutter', level: 'Advanced', category: 'Mobile Dev', description: 'Cross-platform Android & iOS apps, Riverpod state management & animations' },
      { name: 'Canva', level: 'Intermediate', category: 'Graphic Design', description: 'Social media branding, student club posters and pitch decks' }
    ],
    skillsWantToLearn: [
      { name: 'UI/UX Design', level: 'Intermediate', category: 'UI/UX Design', description: 'Design heuristics, accessibility and user testing' },
      { name: 'Django', level: 'Beginner', category: 'Backend Web', description: 'Fullstack web API architecture' }
    ],
    preferredFormat: 'In-Person',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['Evening (5 PM - 8 PM)', 'Weekend Mornings'],
    bio: 'Mobile developer with 3 published student flutter apps. Happy to teach Flutter and earn credits to explore deep UI/UX!',
    credits: 10,
    unlockedTeacherIds: ['user-adil'],
    completedSessionsCount: 9,
    itemsReusedCount: 5,
    moneySaved: 4900,
    earnings: 3200,
    rating: 4.9,
    reviewsCount: 15,
    role: 'student',
  },
  {
    id: 'user-admin',
    name: 'Prof. Suresh Kumar (Admin)',
    email: 'moderator@nexathon.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    institution: 'National Institute of Technology',
    course: 'Academic & Student Affairs',
    department: 'Office of Peer Education',
    academicYear: 'Faculty Staff',
    isVerified: true,
    verificationStatus: 'verified',
    skillsCanTeach: [],
    skillsWantToLearn: [],
    preferredFormat: 'Online',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['Morning (9 AM - 12 PM)'],
    bio: 'Nexathon Faculty Advisor and Academic Integrity Moderator overseeing peer credit safety and book marketplace fair-pricing.',
    credits: 100,
    unlockedTeacherIds: [],
    completedSessionsCount: 0,
    itemsReusedCount: 0,
    moneySaved: 0,
    earnings: 0,
    rating: 5.0,
    reviewsCount: 0,
    role: 'admin',
  }
];

export const SEED_BOOKS: BookListing[] = [
  {
    id: 'book-1',
    title: 'Core Java: Fundamentals (11th Edition)',
    author: 'Cay S. Horstmann',
    subject: 'Computer Science',
    course: 'B.Tech CS / IT',
    description: 'Pristine condition computer science textbook covering OOP, streams, generics, and concurrent programming. Clean pages with zero markings.',
    category: 'Computer Science & IT',
    price: 500,
    originalReferencePrice: 1250,
    condition: 'Like New',
    listingType: 'sell',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user-adil',
    sellerName: 'Adil Hassan',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    sellerCollege: 'National Institute of Technology',
    sellerRating: 4.95,
    status: 'active',
    datePosted: '2026-10-22',
    views: 168,
    favouritesCount: 21,
    tags: ['Java', 'CS', 'Programming', 'Horstmann'],
    isDemo: true
  },
  {
    id: 'book-2',
    title: 'Django for Beginners: Build Websites with Python',
    author: 'William S. Vincent',
    subject: 'Web Development',
    course: 'B.Tech IT / BCA',
    description: 'Step-by-step guide to building production web apps in Django. Covers user authentication, forms, and deployment. Excellent clean copy.',
    category: 'Computer Science & IT',
    price: 450,
    originalReferencePrice: 1100,
    condition: 'Like New',
    listingType: 'sell',
    images: [
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user-anu',
    sellerName: 'Anu Susan',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    sellerCollege: 'National Institute of Technology',
    sellerRating: 5.0,
    status: 'active',
    datePosted: '2026-10-21',
    views: 114,
    favouritesCount: 16,
    tags: ['Django', 'Python', 'Web Dev', 'Backend'],
    isDemo: true
  },
  {
    id: 'book-3',
    title: 'Flutter in Action: Multi-Platform Mobile Apps',
    author: 'Eric Windmill',
    subject: 'Mobile App Development',
    course: 'B.Tech CS / Software Engineering',
    description: 'Comprehensive guide to Dart and Flutter widget trees, animations, and clean architecture. Includes handwritten architecture summary sheet.',
    category: 'Computer Science & IT',
    price: 550,
    originalReferencePrice: 1450,
    condition: 'Good',
    listingType: 'sell',
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user-anju',
    sellerName: 'Anju Kurian',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    sellerCollege: 'National Institute of Technology',
    sellerRating: 4.9,
    status: 'active',
    datePosted: '2026-10-20',
    views: 142,
    favouritesCount: 19,
    tags: ['Flutter', 'Mobile', 'Dart', 'App Dev'],
    isDemo: true
  },
  {
    id: 'book-4',
    title: 'Higher Engineering Mathematics (44th Edition)',
    author: 'B.S. Grewal',
    subject: 'Engineering Mathematics',
    course: 'All Engineering Semesters 1-4',
    description: 'The definitive engineering mathematics standard covering differential calculus, linear algebra, vector calculus, and Fourier transforms.',
    category: 'Mathematics & Sciences',
    price: 480,
    originalReferencePrice: 1150,
    condition: 'Good',
    listingType: 'sell',
    images: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user-adil',
    sellerName: 'Adil Hassan',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    sellerCollege: 'National Institute of Technology',
    sellerRating: 4.95,
    status: 'active',
    datePosted: '2026-10-19',
    views: 89,
    favouritesCount: 11,
    tags: ['Maths', 'Grewal', 'Engineering', 'Core'],
    isDemo: true
  },
  {
    id: 'book-5',
    title: 'The Design of Everyday Things (Revised & Expanded)',
    author: 'Don Norman',
    subject: 'Human-Computer Interaction',
    course: 'Design & UX Minor',
    description: 'Foundational reading for product designers, cognitive psychology enthusiasts, and UI developers. Minor highlighting on chapter 2.',
    category: 'Design & Architecture',
    price: 380,
    originalReferencePrice: 899,
    condition: 'Like New',
    listingType: 'sell',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user-anu',
    sellerName: 'Anu Susan',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    sellerCollege: 'National Institute of Technology',
    sellerRating: 5.0,
    status: 'active',
    datePosted: '2026-10-23',
    views: 204,
    favouritesCount: 31,
    tags: ['UX', 'Design', 'Norman', 'Product'],
    isDemo: true
  },
  {
    id: 'book-6',
    title: 'Operating System Concepts (10th Edition)',
    author: 'Silberschatz, Galvin & Gagne',
    subject: 'Operating Systems',
    course: 'B.Tech CS / IT Semester 4',
    description: 'The famous dinosaur textbook on OS internals: thread scheduling, virtual memory, filesystems, security, and Linux kernel walkthroughs.',
    category: 'Computer Science & IT',
    price: 520,
    originalReferencePrice: 1395,
    condition: 'Good',
    listingType: 'sell',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
    ],
    sellerId: 'user-anju',
    sellerName: 'Anju Kurian',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    sellerCollege: 'National Institute of Technology',
    sellerRating: 4.9,
    status: 'active',
    datePosted: '2026-10-18',
    views: 125,
    favouritesCount: 14,
    tags: ['OS', 'Silberschatz', 'Computer Science'],
    isDemo: true
  }
];

export const SEED_SESSIONS: LearningSession[] = [
  {
    id: 'session-demo-1',
    topic: 'Figma Auto-Layout & Design Tokens for Developers',
    skillName: 'Figma',
    mentorId: 'user-adil',
    mentorName: 'Adil Hassan',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    learnerId: 'user-anu',
    learnerName: 'Anu Susan',
    learnerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    scheduledDate: '2026-10-27',
    timeSlot: '6:00 PM - 7:00 PM',
    format: 'Online Video',
    status: 'pending', // Demo step 2-4: Adil accepts and confirms!
    creditsRequired: 5,
    creditsTransferred: false,
    confirmedByMentor: false,
    confirmedByLearner: false,
    notes: 'Anu requested 1-on-1 coaching to turn backend mental models into modern Figma frames.'
  },
  {
    id: 'session-demo-2',
    topic: 'Django REST Framework Serializers & Auth Tokens',
    skillName: 'Django',
    mentorId: 'user-anu',
    mentorName: 'Anu Susan',
    mentorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    learnerId: 'user-anju',
    learnerName: 'Anju Kurian',
    learnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    scheduledDate: '2026-10-28',
    timeSlot: '5:00 PM - 6:00 PM',
    format: 'Campus In-Person',
    status: 'upcoming',
    creditsRequired: 5,
    creditsTransferred: false,
    confirmedByMentor: false,
    confirmedByLearner: false,
    notes: 'Meeting at Central Campus Tech Hub Room 204.'
  },
  {
    id: 'session-demo-3',
    topic: 'Flutter State Management: Riverpod vs Bloc',
    skillName: 'Flutter',
    mentorId: 'user-anju',
    mentorName: 'Anju Kurian',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    learnerId: 'user-adil',
    learnerName: 'Adil Hassan',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    scheduledDate: '2026-10-22',
    timeSlot: '7:00 PM - 8:00 PM',
    format: 'Online Video',
    status: 'completed',
    creditsRequired: 5,
    creditsTransferred: true,
    confirmedByMentor: true,
    confirmedByLearner: true,
    notes: 'Both verified completion! Anju received 5 learning credits.'
  }
];

export const SEED_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'ctx-001',
    userId: 'user-adil',
    amount: 5,
    type: 'starter_grant',
    description: 'Nexathon Welcome Starter Bonus (5 Learning Credits)',
    timestamp: '2026-10-15T09:00:00Z',
    status: 'completed'
  },
  {
    id: 'ctx-002',
    userId: 'user-anu',
    amount: 5,
    type: 'starter_grant',
    description: 'Nexathon Welcome Starter Bonus (5 Learning Credits)',
    timestamp: '2026-10-15T09:00:00Z',
    status: 'completed'
  },
  {
    id: 'ctx-003',
    userId: 'user-anju',
    amount: 5,
    type: 'starter_grant',
    description: 'Nexathon Welcome Starter Bonus (5 Learning Credits)',
    timestamp: '2026-10-15T09:00:00Z',
    status: 'completed'
  },
  {
    id: 'ctx-004',
    userId: 'user-anju',
    amount: 5,
    type: 'earned_teaching',
    description: 'Earned 5 credits for teaching Flutter to Adil Hassan',
    timestamp: '2026-10-22T20:05:00Z',
    status: 'completed',
    relatedEntityId: 'session-demo-3'
  }
];

export const SEED_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-001',
    listingId: 'book-past-1',
    listingTitle: 'Data Structures & Algorithms in Java (6th Edition)',
    listingCategory: 'Computer Science & IT',
    sellerId: 'user-anju',
    sellerName: 'Anju Kurian',
    buyerId: 'user-adil',
    buyerName: 'Adil Hassan',
    price: 500,
    originalReferencePrice: 1200,
    estimatedStudentSavings: 700,
    commissionRate: 0.02,
    platformCommission: 10, // 2% of ₹500
    sellerPayout: 490,       // ₹490 to seller
    listingType: 'sell',
    status: 'completed',
    timestamp: '2026-10-18T14:30:00Z',
    isDemo: true,
    paymentMethod: 'Simulated Campus UPI'
  }
];

export const SEED_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    targetType: 'listing',
    targetId: 'book-flag-1',
    targetTitle: 'Midterm Unofficial Exam Leak (Prohibited)',
    reporterName: 'Adil Hassan',
    reason: 'Violates academic integrity policy — unauthorized leaked exam sheet.',
    timestamp: '2026-10-23T11:20:00Z',
    status: 'reviewed'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-adil',
    title: 'New Session Request!',
    message: 'Anu Susan wants to book a Figma session with you. Accept to schedule and earn 5 credits!',
    timestamp: '15 mins ago',
    read: false,
    actionUrl: '#my-sessions',
    type: 'session_request'
  },
  {
    id: 'notif-2',
    userId: 'user-adil',
    title: '5 Credits in Wallet',
    message: 'You have 5 starter credits. Use 2 credits to unlock teacher matches, or top up 5 credits for just ₹10!',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '#credits',
    type: 'system'
  }
];

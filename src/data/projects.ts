export interface ProjectItem {
  id: string;
  index: number;
  title: string;
  category: string;
  projectType: string;
  status?: string;
  description: string;
  highlights: string[];
  technologies: string[];
  image?: string;
  imageAlt?: string;
  video?: string;
  liveUrl?: string;
  repositoryUrl?: string;
  scrollPreview?: boolean;
  isProfessional?: boolean;
}

export interface SelectedWorkData {
  eyebrow: string;
  title: string;
  projects: ProjectItem[];
}

export const selectedWorkData: SelectedWorkData = {
  eyebrow: 'MY PROJECTS',
  title: 'SELECTED WORK',
  projects: [
    {
      id: 'the-spot-exam',
      index: 1,
      title: 'THE SPOT EXAM — EXAMINATION & PROCTORING PLATFORM',
      category: 'PROFESSIONAL EXPERIENCE',
      projectType: 'ENTERPRISE SAAS',
      status: 'Ongoing / Live',
      description:
        'Contributed full-stack engineering to The Spot Exam at Tech Creature Solutions — an enterprise multi-tenant examination SaaS platform for coaching companies and exam bodies with subscription plans, billing, and complete exam lifecycle management.',
      highlights: [
        'Engineered Node.js / Express / TypeScript backend with 80+ modular domain modules (controller–service–repository pattern) on MongoDB/Mongoose with Zod request validation.',
        'Implemented JWT authentication and granular RBAC across 10+ roles (Master Admin, Company Admin, Exam Manager, Center Manager, Observer, Candidate) with audit logging & Helmet security.',
        'Built real-time proctoring and live monitoring with Socket.IO (Redis adapter for multi-instance scaling), BullMQ job queues, node-cron schedulers, and Redis caching.',
        'Constructed React + TypeScript admin portal with role-specific layouts, Zustand state management, React Hook Form + Zod, lazy loading, and PWA support.',
        'Developed candidate exam client with in-browser face verification (face-api.js) and real-time violation detection (tab switch, focus loss, copy/paste, multi-face events).',
        'Integrated Razorpay payments, Nodemailer, Firebase push notifications, Cloudinary, and PM2 deployment with Winston logging.',
      ],
      technologies: [
        'Node.js',
        'Express',
        'TypeScript',
        'MongoDB',
        'Redis',
        'BullMQ',
        'Socket.io',
        'React',
        'Zustand',
        'Tailwind CSS',
      ],
      video: '/video/thespotexam.mp4',
      liveUrl: 'https://thespotexam.com',
      // Private company repository at Tech Creature Solutions - hidden per instructions
      repositoryUrl: undefined,
      scrollPreview: false,
      isProfessional: true,
    },
    {
      id: 'aura-headphones',
      index: 2,
      title: 'AURA HEADPHONES — PREMIUM AUDIO E-COMMERCE',
      category: 'PERSONAL PROJECT',
      projectType: 'FULL-STACK E-COMMERCE',
      status: 'Full-Stack Showcase',
      description:
        'A full-stack premium audio e-commerce platform with AI product recommendations featuring product catalog discovery, dynamic filtering, multi-step cart & checkout flows, live order tracking, authentication, and an administrative dashboard.',
      highlights: [
        'Full-stack e-commerce flow (catalog, details, cart, checkout, order tracking, user profile) with React frontend on Vercel and Node/Express REST API on Render.',
        'Implemented Firebase Authentication (email/password & Google sign-in) with server-side ID-token verification, JWT-protected routes, and admin role middleware.',
        'Sub-second API response times with Redis caching (1-hour TTL) for product catalog, express-rate-limit, and Cloudinary image optimization.',
        'Comprehensive admin dashboard to manage inventory, product listings, orders, users, and discount promotional coupons.',
        'Fluid interactive shopping experience with lazy-loaded routes and GSAP/Lenis smooth scroll animations.',
      ],
      technologies: [
        'React',
        'Node.js',
        'Express',
        'MongoDB',
        'Redis',
        'Firebase',
        'GSAP',
        'Cloudinary',
      ],
      video: '/video/auraheadphone.mp4',
      liveUrl: 'https://auraheadphones.vercel.app',
      repositoryUrl: 'https://github.com/LekhrajMahajan/AURAHEADPHONES',
      scrollPreview: false,
      isProfessional: false,
    },
  ],
};

export default selectedWorkData;

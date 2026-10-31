export interface SocialLink {
  name: string;
  url: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'mail';
  ariaLabel: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CreativeCTAStat {
  value: string;
  label: string;
}

export interface CreativeCTAData {
  introPill: string;
  headlineLine1: string;
  headlineLine2: string;
  supportingText: string;
  startProjectHref: string;
  startProjectLabel?: string;
  viewWorkHref: string;
  viewWorkLabel?: string;
  cardLabel: string;
  cardTitle: string;
  features: string[];
  stats: CreativeCTAStat[];
  topMarqueeItems: string[];
  bottomMarqueeItems: string[];
}

export interface AboutData {
  eyebrow: string;
  headlineLine1: string;
  headlineHighlight: string;
  headlineLine3: string;
  location: string;
  introduction: string;
  keyPoints: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface SkillItem {
  name: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  summary: string;
  skills: SkillItem[];
}

export interface ProfileStat {
  label: string;
  value: string;
  iconName: 'code' | 'layers' | 'zap';
}

export interface SkillsData {
  eyebrow: string;
  title: string;
  categories: SkillCategory[];
  profileCard: {
    avatar: string;
    name: string;
    subtitle: string;
    githubUrl: string;
    stats: ProfileStat[];
  };
}

export interface PortfolioData {
  name: string;
  firstName: string;
  lastName: string;
  eyebrow: string;
  roles: string[];
  introduction: string;
  resumeUrl: string;
  portraitImage: string;
  portraitAlt: string;
  contactSectionId: string;
  navItems: NavItem[];
  socialLinks: SocialLink[];
  creativeCta: CreativeCTAData;
  about: AboutData;
  skills: SkillsData;
}

export const portfolioData: PortfolioData = {
  name: 'Lekhraj Mahajan',
  firstName: 'Lekhraj',
  lastName: 'Mahajan',
  eyebrow: 'WELCOME TO MY PORTFOLIO',
  roles: [
    'MERN Stack Developer',
    'Full-Stack Developer',
    'Backend & Node.js Engineer',
    'React & TypeScript Developer',
  ],
  introduction:
    'I build scalable enterprise SaaS applications, modular Node.js/TypeScript backends, and responsive React web experiences with a focus on real-time architecture and high performance.',
  // Links directly to the user's CV in public/Lekhraj Resume.pdf
  resumeUrl: '/Lekhraj Resume.pdf',
  // Portrait cutout with brush stroke (WebP for ultra-fast LCP)
  portraitImage: '/assets/portfolioImg2.webp',
  portraitAlt: 'Lekhraj Mahajan - MERN Stack & Full-Stack Developer',
  contactSectionId: 'contact',
  navItems: [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#selected-work' },
    { label: 'CONTACT', href: '#contact' },
  ],
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/LekhrajMahajan',
      icon: 'github',
      ariaLabel: 'Visit my GitHub profile',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/lekhraj-mahajan-1212b6364/',
      icon: 'linkedin',
      ariaLabel: 'Visit my LinkedIn profile',
    },
    {
      name: 'Email',
      url: 'mailto:lekhrajmahajan506@gmail.com',
      icon: 'mail',
      ariaLabel: 'Send me an email',
    },
  ],
  creativeCta: {
    introPill: 'CURRENT WORK EXPERIENCE • MAY 2026 – PRESENT',
    headlineLine1: 'MERN STACK',
    headlineLine2: 'DEVELOPER.',
    supportingText:
      'At Tech Creature Solutions (Gandhinagar), I engineer core full-stack features for The Spot Exam — an enterprise multi-tenant examination & AI proctoring SaaS. Built 80+ modular backend domains (controller–service–repo), 10+ role RBAC security, real-time Socket.IO live monitoring with Redis, and resilient React admin portals.',
    startProjectHref: 'https://thespotexam.com',
    startProjectLabel: 'VIEW THE SPOT EXAM',
    viewWorkHref: '#selected-work',
    viewWorkLabel: 'VIEW ALL PROJECTS',
    cardLabel: 'PROFESSIONAL EXPERIENCE',
    cardTitle: 'THE SPOT EXAM',
    features: [
      '80+ Modular Backend Domains (Controller-Service-Repo) with Zod & MongoDB',
      'Real-Time Proctoring & Live Monitoring (Socket.IO, Redis Scaling & Face-API)',
      'Granular RBAC Across 10+ Roles, BullMQ Job Queues & PM2 Deployment',
    ],
    stats: [
      { value: '80+', label: 'Modular Domains' },
      { value: '10+', label: 'Enterprise Roles' },
      { value: 'MAY 2026+', label: 'Current Role' },
    ],
    topMarqueeItems: [
      'TECH CREATURE SOLUTIONS',
      'THE SPOT EXAM',
      'ENTERPRISE EXAMINATION SAAS',
      'GANDHINAGAR, GUJARAT',
    ],
    bottomMarqueeItems: [
      'MERN STACK DEVELOPER',
      'NODE.JS & TYPESCRIPT',
      'SOCKET.IO & REDIS',
      'REACT & PWA',
    ],
  },
  about: {
    eyebrow: 'ABOUT ME',
    headlineLine1: 'Engineering',
    headlineHighlight: 'Scalable Systems',
    headlineLine3: 'That Deliver',
    location:
      'MERN Stack Developer & Computer Engineering Graduate based in Ahmedabad, Gujarat',
    introduction:
      "I'm a Full-Stack MERN Developer with a Bachelor of Technology in Computer Engineering (CGPA 8.60). Currently contributing at Tech Creature Solutions on The Spot Exam — an enterprise multi-tenant examination SaaS. I specialize in building modular Node.js/TypeScript backends (controller-service-repository pattern), real-time proctoring with Socket.IO & Redis, and resilient, responsive frontends with React and TypeScript.",
    keyPoints: [
      'B.Tech Computer Engineering (CGPA: 8.60)',
      'Enterprise SaaS & Multi-Tenant Architecture',
      'Modular Node.js / Express (80+ Modules)',
      'Real-Time Proctoring & Socket.IO Scaling',
      'Granular RBAC & Security (Helmet, Zod)',
      'Redis Caching & BullMQ Background Queues',
    ],
    ctaLabel: 'MORE ABOUT ME',
    ctaHref: '#skills',
  },
  skills: {
    eyebrow: 'MY SKILLS',
    title: 'TECHNOLOGIES & EXPERTISE',
    categories: [
      {
        id: 'frontend',
        title: 'FRONTEND',
        summary:
          'Modern reactive interfaces, state management, component architecture, and fluid motion.',
        skills: [
          { name: 'React' },
          { name: 'TypeScript' },
          { name: 'JavaScript' },
          { name: 'Vite' },
          { name: 'Tailwind CSS' },
          { name: 'Zustand' },
          { name: 'React Hook Form' },
          { name: 'GSAP' },
          { name: 'PWA' },
          { name: 'HTML5' },
          { name: 'CSS3' },
        ],
      },
      {
        id: 'backend',
        title: 'BACKEND & ARCHITECTURE',
        summary:
          'Modular domain services, real-time WebSockets, background queues, and resilient REST APIs.',
        skills: [
          { name: 'Node.js' },
          { name: 'Express' },
          { name: 'TypeScript' },
          { name: 'Socket.io' },
          { name: 'WebSocket' },
          { name: 'BullMQ' },
          { name: 'node-cron' },
          { name: 'REST APIs' },
          { name: 'Zod' },
        ],
      },
      {
        id: 'database',
        title: 'DATABASES & SECURITY',
        summary:
          'Data modeling, in-memory caching layers, granular RBAC, and security hardening.',
        skills: [
          { name: 'MongoDB' },
          { name: 'Mongoose' },
          { name: 'Redis' },
          { name: 'JWT' },
          { name: 'RBAC' },
          { name: 'bcrypt' },
          { name: 'Helmet' },
          { name: 'Rate Limiting' },
          { name: 'Audit Logging' },
          { name: 'Face Verification' },
        ],
      },
      {
        id: 'tools',
        title: 'TOOLS & DEPLOYMENT',
        summary:
          'Payment gateways, notifications, media pipelines, process management, and cloud hosting.',
        skills: [
          { name: 'Git' },
          { name: 'GitHub' },
          { name: 'Postman' },
          { name: 'PM2' },
          { name: 'Vercel' },
          { name: 'Render' },
          { name: 'Netlify' },
          { name: 'Razorpay' },
          { name: 'Nodemailer' },
          { name: 'Firebase' },
          { name: 'Cloudinary' },
          { name: 'VS Code' },
        ],
      },
    ],
    profileCard: {
      avatar: 'https://avatars.githubusercontent.com/u/129394209?v=4',
      name: 'LEKHRAJ MAHAJAN',
      subtitle: 'GITHUB & FULL-STACK OVERVIEW',
      githubUrl: 'https://github.com/LekhrajMahajan',
      stats: [
        { value: '20', label: 'Public repos', iconName: 'code' },
        { value: '2', label: 'Followers', iconName: 'layers' },
        { value: 'Live', label: '365 day graph', iconName: 'zap' },
      ],
    },
  },
};

export default portfolioData;

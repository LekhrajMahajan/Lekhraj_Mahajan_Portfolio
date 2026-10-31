export interface ContactInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  degree: string;
  cgpa: string;
  availability: string;
  linkedin: string;
  github: string;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  supportingText: string;
}

export const contactData: ContactInfo = {
  name: 'Lekhraj Mahajan',
  role: 'MERN Stack / Full-Stack Developer',
  email: 'lekhrajmahajan506@gmail.com',
  phone: '+91 6354245706',
  location: 'Ahmedabad, Gujarat, India',
  education: 'Silver Oak University, Ahmedabad',
  degree: 'B.Tech in Computer Engineering',
  cgpa: '8.60 CGPA',
  availability: 'Available for Full-Time Roles & Opportunities',
  linkedin: 'https://www.linkedin.com/in/lekhraj-mahajan-1212b6364/',
  github: 'https://github.com/LekhrajMahajan',
  eyebrow: 'GET IN TOUCH',
  headlineLine1: "LET'S BUILD",
  headlineLine2: 'SOMETHING GREAT.',
  supportingText:
    "Actively open for full-time MERN Stack & Full-Stack Developer positions. Whether you have an engineering opportunity or want to discuss architecture, let's connect!",
};

export default contactData;

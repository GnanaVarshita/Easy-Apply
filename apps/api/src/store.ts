import { CompanyCareerLink, UserProfile, ApplicationRecord } from '@velmurugan/shared';

export let savedCompanyLinks: CompanyCareerLink[] = [];
export let savedApplications: ApplicationRecord[] = [];

export let currentUserProfile: UserProfile = {
  id: 'user_1',
  name: 'GnanaVarshita Kamisetty',
  email: 'gnanavarshitagv@gmail.com',
  phone: '+91-7816037193',
  location: 'India',
  yoe: 2,
  targetJobTitles: ['Software Engineer', 'Full Stack Developer', 'React Engineer', 'Frontend Developer'],
  skills: [
    'React', 'ReactJS', 'TypeScript', 'Node.js', 'GraphQL', 'LLMs / Gemini AI',
    'Semantic Search Engine', 'Monorepo', 'REST API', 'Data Structures & Algorithms', 'OOPs', 'DBMS'
  ],
  experienceSummary: [
    'Software Engineer at Trane Technologies (July 2025 - Present): Engineered UI enhancements within extensive monorepo using React and TypeScript to align with design tokens, migrating 2 legacy modules to React and improving codebase maintainability by 30%.',
    'Software Engineer at Trane Technologies (July 2025 - Present): Developed 3 POC applications like Smart Assistant by integrating LLMs, resolving 80% of role-based user queries automatically through a natural language semantic search engine.',
    'Software Engineer at Trane Technologies (July 2025 - Present): Contributed in building in-house knowledge sharing application and developing real-time device monitoring tool for 500+ endpoints, implementing token-based authentication and achieving 99.9% uptime with graphical statuses updating every 5 seconds.',
    'Software Engineer Intern at Trane Technologies (July 2024 - June 2025): Awarded the Excellence Award for delivering the Next-Gen Application, replacing an 18-year-old legacy architecture to serve 2,000+ active enterprise users.',
    'Software Engineer Intern at Trane Technologies (July 2024 - June 2025): Developed web pages using ReactJS and TypeScript, integrating GraphQL mutations to optimize data-fetch logic, which reduced transaction costs and cut API response times by 50%.',
    'Software Engineer Intern at Trane Technologies (July 2024 - June 2025): Engineered custom Node.js module classes, enhancing modular design and reducing overall feature development time by 90%.'
  ],
  education: [
    {
      degree: 'Integrated M.Tech',
      field: 'Computer Science & Engineering (CGPA: 8.25/10.0)',
      institution: 'VIT Vellore',
      year: '2020 - 2025'
    }
  ],
  layoutTheme: {
    primaryColor: '#B8860B',
    fontFamily: 'Arial, sans-serif',
    sectionOrder: ['Education', 'Work Experience', 'Positions of Responsibility']
  }
};

export function updateCurrentUserProfile(newProfile: UserProfile) {
  currentUserProfile = newProfile;
}

export function setSavedCompanyLinks(links: CompanyCareerLink[]) {
  savedCompanyLinks = links;
}

export function setSavedApplications(apps: ApplicationRecord[]) {
  savedApplications = apps;
}

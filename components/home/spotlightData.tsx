export interface SpotlightHonoree {
    id: string;
    month: string; // e.g. "September 2026"
    year: number; // 2026
    monthIndex: number; // 0-11
    name: string;
    roleTitle: string; // e.g. "Final Year Radiography Student & Peer Tutor"
    category: 'Student of the Month' | 'Radiographer of the Month' | 'Peer Mentor of the Month' | 'Innovator of the Month' | 'Community Champion';
    institution: string; // e.g. "University of Nigeria, Nsukka / UNTH"
    location: string; // e.g. "Enugu, Nigeria"
    image: string; // URL or local path in /public (e.g., "/spotlight-sep2026.jpg")
    achievement: string; // Brief impact summary
    story: string; // Full inspiring story
    quote: string; // Inspiring quote
    badges: string[]; // e.g. ["Top Quiz Streak (45 Days)", "Trained 80+ Students in CT Basics"]
    cheersCount: number; // Initial cheer count
    featured?: boolean;
    socials?: {
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }
  
  /**
   * 💡 Community Spotlight Data
   * To update or replace the honoree for a month, simply edit the list below:
   * - You can set `image` to a web URL or to an image placed in the `public/` directory (e.g. `/my-image.jpg`).
   */
  export const DEFAULT_SPOTLIGHTS: SpotlightHonoree[] = [
    {
      id: 'spotlight-sep-2026-1',
      month: 'September 2026',
      year: 2026,
      monthIndex: 8,
      name: 'Chidubem Okafor',
      roleTitle: 'Final Year Radiography Student & Lead Peer Mentor',
      category: 'Student of the Month',
      institution: 'University of Nigeria, Nsukka (UNTH)',
      location: 'Enugu, Nigeria',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      achievement: 'Authored 15 high-yield CT anatomy study guides and mentored 120+ junior radiography students through clinical positioning exams.',
      story: 'Chidubem has been an outstanding beacon in the radiography student community. Balancing his intensive clinical internship at UNTH with active peer instruction, he launched a weekly image critique circle that helped dozens of students master skull and cross-sectional CT interpretation. His dedication to accessible learning embodies the core spirit of StudiRad.',
      quote: 'Radiography is where precision engineering meets empathetic clinical care. When we lift each other up, patient care everywhere gets better.',
      badges: ['Top Quiz Performer', '120+ Students Mentored', 'Clinical Honors'],
      cheersCount: 342,
      featured: true,
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'chidubem.radiology@example.com'
      }
    },
    {
      id: 'spotlight-sep-2026-2',
      month: 'September 2026',
      year: 2026,
      monthIndex: 8,
      name: 'Rad. Funmilayo Adeleke',
      roleTitle: 'Senior MRI & CT Clinical Specialist',
      category: 'Radiographer of the Month',
      institution: 'Lagos University Teaching Hospital (LUTH)',
      location: 'Lagos, Nigeria',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      achievement: 'Pioneered low-dose pediatric neuro-imaging protocols and conducted 4 free virtual masterclasses on MRI Artifact Mitigation for StudiRad.',
      story: 'With over 8 years in tertiary hospital clinical practice, Rad. Adeleke has continuously dedicated her weekends to training interns and newly graduated radiographers. Her masterclasses on MRI sequence optimization and artifact troubleshooting have gained nationwide praise for demystifying difficult pulse sequences.',
      quote: 'Never stop being curious about the physics behind the beam. Understanding the why makes you an exceptional diagnostician.',
      badges: ['Masterclass Educator', 'Pediatric Protocol Lead', '8+ Years Excellence'],
      cheersCount: 285,
      featured: false,
      socials: {
        linkedin: 'https://linkedin.com'
      }
    },
    {
      id: 'spotlight-aug-2026-1',
      month: 'August 2026',
      year: 2026,
      monthIndex: 7,
      name: 'Ibrahim Danjuma',
      roleTitle: 'Clinical Sonographer & Academic Tutor',
      category: 'Peer Mentor of the Month',
      institution: 'Ahmadu Bello University Teaching Hospital (ABUTH)',
      location: 'Zaria, Nigeria',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      achievement: 'Organized hands-on obstetric and Doppler ultrasound workshops for 65 radiography interns across Northern healthcare centers.',
      story: 'Ibrahim is known for his patient, methodical approach to ultrasound probe ergonomics and Doppler angle correction. He dedicated his leave to traveling to rural community centers to demonstrate point-of-care ultrasound (POCUS) triage for expectant mothers.',
      quote: 'Knowledge is only powerful when shared with those who need it most in the field.',
      badges: ['Ultrasound Specialist', '60+ Interns Trained', 'Community Champion'],
      cheersCount: 198,
      featured: false
    },
    {
      id: 'spotlight-jul-2026-1',
      month: 'July 2026',
      year: 2026,
      monthIndex: 6,
      name: 'Ngozi Blessing Eze',
      roleTitle: 'Medical Physics Researcher & Radiographer',
      category: 'Innovator of the Month',
      institution: 'University of Calabar (UNICAL)',
      location: 'Calabar, Nigeria',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
      achievement: 'Published groundbreaking undergraduate research on diagnostic reference levels (DRLs) in digital chest radiography.',
      story: 'Ngozi presented her research on radiation protection optimization at the National Radiography Scientific Conference, winning the Young Investigator of the Year award. She also actively produces infographics that educate patients on radiation safety.',
      quote: 'Radiation safety is not just a regulatory checklist; it is an act of clinical empathy for every patient who walks into our room.',
      badges: ['Young Investigator 2026', 'Radiation Safety Advocate', 'Published Author'],
      cheersCount: 224,
      featured: false
    }
  ];
  
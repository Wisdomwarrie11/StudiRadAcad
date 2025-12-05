
import { LucideIcon } from 'lucide-react';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Internship' | 'Job' | 'Scholarship' | 'Research';
  location: string;
  datePosted: string;
}

export interface Course {
  id: number;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  rating: number;
  img: string;
  enrolled?: string;
  duration?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface HowItWorksItem {
  icon: LucideIcon;
  title: string;
  details: string[];
}

export interface CourseOutline {
  week: string;
  title: string;
  topics: string;
  alignment: string;
  icon: LucideIcon;
}

export interface TimelineEvent {
  date: string;
  title: string;
  isHighlight?: boolean;
}

// --- New Types for Opportunities ---

export interface JobListing {
  id: number | string;
  title: string;
  company: string;
  location: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  salary?: string;
  deadline: string;
  contactAddress?: string; // Physical or Email
  directApplyLink?: string; // If null, "Apply Direct" is disabled
}

export interface InternshipListing {
  id: number | string;
  title: string;
  organization: string;
  location: string;
  duration: string;
  deadline: string;
  description: string;
  requirements?: string[];
  stipend?: string;
  contactInfo?: string;
}

export interface ScholarshipListing {
  id: number | string;
  title: string;
  provider: string;
  amount: string;
  eligibility: string;
  deadline: string;
  type: string;
  description?: string;
  requirements?: string[];
  applyLink?: string;
}

// --- Daily Challenge Types ---

export enum ChallengeLevel {
  BASIC = 'Basic',
  ADVANCED = 'Advanced',
  MASTER = 'Master'
}

export enum ChallengePurpose {
  READING = 'Reading',
  EXAMS = 'Exams',
  FUN = 'Fun',
  GROWTH = 'Track Growth'
}

export enum ChallengeTopic {
  TECHNIQUE = 'Radiographic Techniques',
  SAFETY = 'Radiation Safety',
  PHYSICS = 'Radiation Physics',
  MRI = 'Magnetic Resonance Imaging (MRI)',
  CT = 'Computed Tomography (CT)',
  USS = 'Ultrasound (USS)'
}

export interface ChallengeQuestion {
  id?: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  referenceLink?: string;
  level?: ChallengeLevel;
  topic?: ChallengeTopic;
}

export interface UserChallengeProfile {
  uid: string; // Firebase Document ID (usually email or auth UID)
  email: string;
  displayName: string;
  level: ChallengeLevel;
  purpose: ChallengePurpose;
  currentDay: number; // 1 to 6
  lastPlayedDate: string | null; // ISO Date string
  scores: Record<string, number>; // "day1": 25
  totalScore: number;
  coins: number; // "Grey" currency
  unlockedDays: number[]; // Array of day numbers unlocked via coins [1, 2, 5]
  completedLevels: ChallengeLevel[]; // Track which levels are fully completed
}

export interface QuestionReport {
  questionId: string;
  userEmail: string;
  reason: string;
  timestamp: string;
}
export interface ChallengeQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  referenceLink?: string;
}

export interface QuestionCategory {
  id: string;
  title: string;
  description: string;
  level: 'Basic' | 'Advanced' | 'Master';
  questions: ChallengeQuestion[];
  icon?: React.ReactNode;
}

export type AppState = 'home' | 'quiz' | 'summary';

export interface QuizState {
  categoryId: string | null;
  currentQuestionIndex: number;
  score: number;
  answers: (number | null)[]; // Index of selected answer per question
  isCompleted: boolean;
}
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
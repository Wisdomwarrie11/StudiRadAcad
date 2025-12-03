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
  enrolled?: string; // Optional for mock data
  duration?: string; // Optional for mock data
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

export interface Course {
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
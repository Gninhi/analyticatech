
import { LucideIcon } from 'lucide-react';

export type Locale = 'fr' | 'en';

export interface BilingualString {
  fr: string;
  en: string;
}

export interface Feature<T = BilingualString> {
  title: T;
  description: T;
}

export interface Service<T = BilingualString> {
  id: string;
  title: T;
  shortDescription: T;
  fullDescription: T;
  marketImpact: T;
  roiTimeline: T;
  technicalComplexity: 'Standard' | 'Advanced' | 'Critical';
  icon: LucideIcon;
  icon_name?: string;
  tags: string[];
  process: { step: T; desc: T }[];
  benefits: T[];
  caseStudyId?: string;
}

export interface Solution<T = BilingualString> {
  id: string;
  title: T;
  subtitle: T;
  shortDescription: T;
  fullDescription: T;
  icon: LucideIcon;
  icon_name?: string;
  kpis: { label: T; value: string }[];
  techStack: string[];
  features: Feature<T>[];
  useCases: T[];
}

export interface NavItem {
  label: BilingualString;
  path: string;
  id?: string;
}

export interface Testimonial<T = BilingualString> {
  id: string;
  name: string;
  role: T;
  company: string;
  content: T;
  avatar: string;
}

export interface TeamMember<T = BilingualString> {
  id: string;
  name: string;
  role: T;
  spec: string;
  status: 'Online' | 'Busy' | 'Offline';
  img: string;
}

export interface Milestone<T = BilingualString> {
  id: string;
  version: string;
  year: string;
  title: T;
  desc: T;
}

export interface CoreValue<T = BilingualString> {
  id: string;
  title: T;
  desc: T;
  icon: LucideIcon;
}

export interface TickerMetric<T = BilingualString> {
  id: string;
  label: T;
  baseValue: number;
  suffix: string;
  trend: string;
  color: string;
  icon: LucideIcon;
  graph: string;
}

export interface FeaturedCase<T = BilingualString> {
  id: string;
  sector: T;
  title: T;
  description: T;
  result: T;
  tags: string[];
  iconName: string;
}

export interface Resource<T = BilingualString> {
  id: string;
  type: 'prompt' | 'workflow' | 'whitepaper' | 'article';
  title: T;
  description: T;
  category: T[];
  date: string;
  author: string;
  isPremium?: boolean;
  model?: string;
  content?: string;
  tags?: string[];
  platform?: string;
  integrations?: string[];
  complexity?: 'Low' | 'Medium' | 'High';
  readTime?: T;
  thumbnailUrl?: string;
  slug?: string;
}

export enum ThemeMode {
  DARK = 'dark',
  LIGHT = 'light'
}
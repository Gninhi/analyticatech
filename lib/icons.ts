// Centralized icon exports from Lucide React
// This file provides a single source of truth for all icons used in the project

export {
  // Navigation & UI
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  
  // Services & Features
  Brain,
  Database,
  BarChart3,
  Workflow,
  Cpu,
  Target,
  Shield,
  Search,
  FileText,
  Layers,
  Terminal,
  Code2,
  GitBranch,
  Zap,
  Server,
  Lock,
  TrendingUp,
  Activity,
  Globe,
  
  // Industries
  Briefcase,
  Factory,
  ShoppingCart,
  Scale,
  
  // Contact & Info
  Mail,
  MapPin,
  Phone,
  Clock,
  Users,
  
  // Social
  Github,
  Linkedin,
  Twitter,
  
  // Status
  AlertTriangle,
  Check,
  Loader2,
  Sparkles,
  
  // Layout
  LayoutGrid,
  Home,
  RefreshCcw,
  
  // Type for icon mapping
  type LucideIcon
} from 'lucide-react';

// Icon name to component mapping for dynamic icon resolution
// Used when icon names come from Supabase as strings
import {
  Brain, Database, BarChart3, Workflow, Cpu, Target, Shield, Search, FileText,
  Layers, Terminal, Code2, GitBranch, Zap, Server, Lock, TrendingUp, Activity,
  Globe, Briefcase, Factory, ShoppingCart, Scale, type LucideIcon
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Database,
  BarChart3,
  Workflow,
  Cpu,
  Target,
  Shield,
  Search,
  FileText,
  Layers,
  Terminal,
  Code2,
  GitBranch,
  Zap,
  Server,
  Lock,
  TrendingUp,
  Activity,
  Globe,
  Briefcase,
  Factory,
  ShoppingCart,
  Scale,
};

// Helper function to get icon by name
export const getIconByName = (iconName: string | undefined): LucideIcon => {
  if (!iconName) return BarChart3;
  return ICON_MAP[iconName] || BarChart3;
};
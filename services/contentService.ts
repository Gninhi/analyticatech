
import { supabase, isLiveMode, getStorageUrl } from '../lib/supabase';
import {
  SERVICES, SOLUTIONS, RESOURCES, TESTIMONIALS,
  TEAM, MILESTONES, CORE_VALUES, TICKER_METRICS, FEATURED_CASES
} from '../data/constants';
import {
  Service, Solution, Resource, Testimonial, Locale,
  TeamMember, Milestone, CoreValue, TickerMetric, FeaturedCase
} from '../types/index';
import { resolveLocale, snakeToCamel } from '../utils/i18n';
import { LucideIcon, getIconByName } from '../lib/icons';

const mapIcon = getIconByName;

const f = resolveLocale;

// Resilience table aliases
const TABLE_ALIASES: Record<string, string[]> = {
  'resources': ['resource'],
  'featured_cases': ['featured_case', 'cases', 'case_studies', 'case_study', 'project', 'projects'],
  'team_members': ['team_member', 'team', 'members', 'staff', 'users'],
  'core_values': ['core_value', 'values', 'value'],
  'testimonials': ['testimonial', 'reviews', 'review'],
  'services': ['service'],
  'solutions': ['solution'],
  'milestones': ['milestone', 'history', 'roadmap'],
  'ticker_metrics': ['ticker_metric', 'metrics', 'kpi', 'kpis']
};

// Order by column mapping per table
const ORDER_BY_MAP: Record<string, string> = {
  'resources': 'date',
  'featured_cases': 'id',
  'team_members': 'id',
  'core_values': 'id',
  'testimonials': 'id',
  'services': 'id',
  'solutions': 'id',
  'milestones': 'year',
  'ticker_metrics': 'id'
};

// Dev-only logging
const isDev = import.meta.env.DEV;
const devLog = (...args: any[]) => isDev && console.log(...args);
const devWarn = (...args: any[]) => isDev && console.warn(...args);
const devError = (...args: any[]) => isDev && console.error(...args);

/**
 * Strictly typed data fetcher
 */
async function fetchData<T>(
  logicalTable: string,
  fallback: T[],
  orderBy?: string
): Promise<Array<Record<string, any>>> {
  if (isLiveMode() && supabase) {
    try {
      const candidates = [
        logicalTable,
        ...(TABLE_ALIASES[logicalTable] || []),
        logicalTable.endsWith('s') ? logicalTable.slice(0, -1) : null
      ].filter((t): t is string => !!t);

      const uniqueCandidates = [...new Set(candidates)];
      const sortColumn = orderBy || ORDER_BY_MAP[logicalTable] || 'id';

      for (const table of uniqueCandidates) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order(sortColumn, { ascending: true });

        if (!error && data) {
          devLog(`[Supabase] ${data.length} enregistrements récupérés de "${table}"`);
          return data.map(item => snakeToCamel(item));
        }

        if (
          error.code === '42P01' ||
          error.code === '42703' ||
          error.message?.includes('Could not find the table') ||
          error.message?.includes('does not exist')
        ) {
          continue;
        }

        devError(`[Supabase] Erreur technique sur "${table}":`, error.message);
        throw error;
      }
    } catch (err) {
      devWarn(`[Supabase] Utilisation des données locales pour "${logicalTable}".`, err);
    }
  }

  devLog(`[ContentService] Utilisation du fallback local pour "${logicalTable}"`);
  return fallback as unknown as Array<Record<string, any>>;
}

class HybridContentService {
  async getServices(locale: Locale): Promise<Service<string>[]> {
    const raw = await fetchData<Service>('services', SERVICES);
    return raw.map(s => {
      // Handle icon: use existing LucideIcon component, or map from string name
      let iconComponent: LucideIcon;
      if (s.icon && typeof s.icon === 'function') {
        iconComponent = s.icon as LucideIcon;
      } else {
        iconComponent = mapIcon(s.iconName || s.icon_name || s.icon as string);
      }

      return {
        id: String(s.id),
        title: f(s.title, locale),
        shortDescription: f(s.shortDescription, locale),
        fullDescription: f(s.fullDescription, locale),
        marketImpact: f(s.marketImpact, locale),
        roiTimeline: f(s.roiTimeline, locale),
        technicalComplexity: (s.technicalComplexity || 'Standard') as 'Standard' | 'Advanced' | 'Critical',
        icon: iconComponent,
        tags: Array.isArray(s.tags) ? s.tags : [],
        process: (Array.isArray(s.process) ? s.process : []).map((p: Record<string, any>) => ({
          step: f(p.step, locale),
          desc: f(p.desc, locale)
        })),
        benefits: (Array.isArray(s.benefits) ? s.benefits : []).map((b: any) => f(b, locale)),
        caseStudyId: s.caseStudyId
      } as Service<string>;
    });
  }

  async getServiceById(id: string, locale: Locale): Promise<Service<string> | undefined> {
    const services = await this.getServices(locale);
    return services.find(s => s.id === id);
  }

  async getSolutions(locale: Locale): Promise<Solution<string>[]> {
    const raw = await fetchData<Solution>('solutions', SOLUTIONS);
    return raw.map(s => {
      // Handle icon: use existing LucideIcon component, or map from string name
      let iconComponent: LucideIcon;
      if (s.icon && typeof s.icon === 'function') {
        // Already a LucideIcon component (from local data)
        iconComponent = s.icon as LucideIcon;
      } else {
        // Map from string name (from Supabase)
        iconComponent = mapIcon(s.iconName || s.icon_name || s.icon as string);
      }

      return {
        id: String(s.id),
        title: f(s.title, locale),
        subtitle: f(s.subtitle, locale),
        shortDescription: f(s.shortDescription, locale),
        fullDescription: f(s.fullDescription, locale),
        icon: iconComponent,
        techStack: Array.isArray(s.techStack) ? s.techStack : [],
        kpis: (Array.isArray(s.kpis) ? s.kpis : []).map((k: Record<string, any>) => ({
          label: f(k.label, locale),
          value: String(k.value || '')
        })),
        features: (Array.isArray(s.features) ? s.features : []).map((feat: Record<string, any>) => ({
          title: f(feat.title, locale),
          description: f(feat.description, locale)
        })),
        useCases: (Array.isArray(s.useCases) ? s.useCases : []).map((u: any) => f(u, locale))
      } as Solution<string>;
    });
  }

  async getSolutionById(id: string, locale: Locale): Promise<Solution<string> | undefined> {
    const solutions = await this.getSolutions(locale);
    return solutions.find(s => s.id === id);
  }

  async getResources(locale: Locale, category: string = 'all'): Promise<Resource<string>[]> {
    const raw = await fetchData<Resource>('resources', RESOURCES);

    const mapped = raw.map(r => {
      let categories: string[] = [];
      const rawCategory = r.category;

      if (Array.isArray(rawCategory)) {
        categories = rawCategory.map((c: any) => f(c, locale));
      } else if (typeof rawCategory === 'string') {
        try {
          const parsed = JSON.parse(rawCategory);
          if (Array.isArray(parsed)) {
            categories = parsed.map((c: any) => f(c, locale));
          } else {
            categories = [f(rawCategory as any, locale)];
          }
        } catch {
          categories = [f(rawCategory as any, locale)];
        }
      }

      // Extract metadata from JSONB (Supabase structure)
      const metadata = r.metadata || {};
      const model = metadata.model || r.model || '';
      const content = metadata.content || r.content || '';

      return {
        id: String(r.id || r.slug || ''),
        title: f(r.title, locale),
        description: f(r.description, locale),
        thumbnailUrl: getStorageUrl(r.thumbnailUrl || r.thumbnail_url || r.image || r.img || r.cover),
        category: categories,
        readTime: f(r.readTime || "5 min", locale),
        type: (String(r.type || 'article').toLowerCase()) as any,
        model: String(model),
        content: String(content),
        isPremium: Boolean(r.isPremium || r.is_premium),
        date: String(r.date || ''),
        author: String(r.author || 'Analyticatech')
      } as Resource<string>;
    });

    if (category === 'all') return mapped;
    return mapped.filter(r => r.type === category);
  }

  async getTestimonials(_locale: Locale): Promise<Testimonial<string>[]> {
    const raw = await fetchData<Testimonial>('testimonials', TESTIMONIALS);
    return raw.map(t => ({
      id: String(t.id),
      name: String(t.name || ''),
      role: String(t.role || ''),
      content: String(t.content || ''),
      author: String(t.author || ''),
      company: String(t.company || ''),
      avatar: getStorageUrl(t.avatarUrl || t.avatar_url || t.avatar || t.image)
    } as Testimonial<string>));
  }

  async getTeam(locale: Locale): Promise<TeamMember<string>[]> {
    const raw = await fetchData<TeamMember>('team_members', TEAM);
    return raw.map(t => ({
      id: String(t.id),
      name: String(t.name || ''),
      role: f(t.role, locale),
      bio: f(t.bio, locale),
      spec: String(t.spec || ''),
      status: (t.status || 'Online') as 'Online' | 'Busy' | 'Offline',
      img: getStorageUrl(t.img || t.image || t.avatarUrl || t.photo),
      social: t.social || {}
    } as TeamMember<string>));
  }

  async getMilestones(locale: Locale): Promise<Milestone<string>[]> {
    const raw = await fetchData<Milestone>('milestones', MILESTONES);
    return raw.map(m => ({
      id: String(m.id),
      year: String(m.year || ''),
      version: String(m.version || '1.0'),
      title: f(m.title, locale),
      desc: f(m.desc, locale)
    } as Milestone<string>));
  }

  async getCoreValues(locale: Locale): Promise<CoreValue<string>[]> {
    const raw = await fetchData<CoreValue>('core_values', CORE_VALUES);
    return raw.map(v => {
      // Handle icon: use existing LucideIcon component, or map from string name
      let iconComponent: LucideIcon;
      if (v.icon && typeof v.icon === 'function') {
        iconComponent = v.icon as LucideIcon;
      } else {
        iconComponent = mapIcon(v.iconName || v.icon_name || v.icon as string);
      }

      return {
        id: String(v.id),
        title: f(v.title, locale),
        desc: f(v.desc, locale),
        icon: iconComponent
      } as CoreValue<string>;
    });
  }

  async getTickerMetrics(locale: Locale): Promise<TickerMetric<string>[]> {
    const raw = await fetchData<TickerMetric>('ticker_metrics', TICKER_METRICS);
    return raw.map(m => {
      // Handle icon: use existing LucideIcon component, or map from string name
      let iconComponent: LucideIcon;
      if (m.icon && typeof m.icon === 'function') {
        iconComponent = m.icon as LucideIcon;
      } else {
        iconComponent = mapIcon(m.iconName || m.icon_name || m.icon as string);
      }

      return {
        id: String(m.id),
        label: f(m.label, locale),
        baseValue: Number(m.baseValue || 0),
        suffix: String(m.suffix || ''),
        trend: String(m.trend || ''),
        color: String(m.color || ''),
        icon: iconComponent,
        graph: String(m.graph || '')
      } as TickerMetric<string>;
    });
  }

  async getFeaturedCases(locale: Locale): Promise<FeaturedCase<string>[]> {
    const raw = await fetchData<FeaturedCase>('featured_cases', FEATURED_CASES);
    return raw.map(c => ({
      id: String(c.id),
      sector: f(c.sector, locale),
      title: f(c.title, locale),
      description: f(c.description, locale),
      result: f(c.result, locale),
      tags: Array.isArray(c.tags) ? c.tags : [],
      iconName: String(c.iconName || c.icon_name || '')
    } as FeaturedCase<string>));
  }
}

export const contentService = new HybridContentService();

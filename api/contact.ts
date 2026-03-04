import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { ContactSchema } from '../utils/schemas';
import { z } from 'zod';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/**
 * API SERVERLESS - SECURE CONTACT ENDPOINT
 * ----------------------------------------
 * Architecture: Zero-Trust & Validation Layer + Persistent Rate Limiting
 */

const POW_DIFFICULTY_PREFIX = '0000';

// Fallback in-memory store in case Supabase is not configured or fails
const ipCache = new Map<string, number>();

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const verifyPoW = (timestamp: number, nonce: number, hash: string): boolean => {
  const now = Date.now();
  // Validité du PoW : 5 minutes pour éviter le replay
  if (now - timestamp > 5 * 60 * 1000 || now - timestamp < -5000) return false;
  if (!hash.startsWith(POW_DIFFICULTY_PREFIX)) return false;
  const input = `${timestamp}::${nonce}::ANALYTICATECH_SECURE`;
  const serverHash = crypto.createHash('sha256').update(input).digest('hex');
  return serverHash === hash;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Headers de sécurité API
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Persistent Rate Limiting (IP Based)
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  try {
    if (supabase) {
      // Fetch the last request time for this IP
      const { data, error } = await supabase
        .from('rate_limits')
        .select('last_request_time')
        .eq('ip', clientIp)
        .maybeSingle();

      if (data && data.last_request_time) {
        const lastRequestTime = new Date(data.last_request_time).getTime();
        if (now - lastRequestTime < 10000) {
          return res.status(429).json({ error: 'Trop de requêtes. Veuillez patienter.' });
        }
      }

      // Upsert the new request time
      await supabase
        .from('rate_limits')
        .upsert({ ip: clientIp, last_request_time: new Date(now).toISOString() })
        .eq('ip', clientIp);
    } else {
      // Fallback to in-memory limit
      const lastRequest = ipCache.get(clientIp);
      if (lastRequest && (now - lastRequest) < 10000) {
        return res.status(429).json({ error: 'Trop de requêtes. Veuillez patienter.' });
      }
      ipCache.set(clientIp, now);
    }
  } catch (dbError) {
    console.error('[RateLimit Error]', dbError);
    // Continue processing if rate limiting fails rather than blocking legitimate users
  }

  try {
    // 3. HONEYPOT CHECK
    if (req.body._gotcha && req.body._gotcha !== '') {
      return res.status(200).json({ success: true }); // Silent fail for bots
    }

    // 4. ZOD VALIDATION (Schema Validation)
    // On parse le body avec le schéma strict. Si ça échoue, Zod lance une erreur.
    const validatedData = ContactSchema.parse(req.body);

    // 5. PROOF OF WORK VERIFICATION
    if (!validatedData.pow || !verifyPoW(validatedData.pow.timestamp, validatedData.pow.nonce, validatedData.pow.hash)) {
      return res.status(400).json({ error: 'Échec de la validation de sécurité (PoW).' });
    }

    // 6. SANITIZATION FINALE
    // Même si Zod valide le format, on échappe le HTML pour éviter tout XSS stocké si ces données sont affichées dans un admin panel.
    const safeName = escapeHtml(validatedData.name);
    const safeEmail = escapeHtml(validatedData.email);
    const safeMessage = escapeHtml(validatedData.message);
    const safeCompany = validatedData.company ? escapeHtml(validatedData.company) : '';

    // --- SIMULATION ENVOI EMAIL ---
    await new Promise(resolve => setTimeout(resolve, 300));

    // Log only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SECURE MAIL] From: ${safeEmail} (IP: ${clientIp})`);
      console.log(`[DATA] Name: ${safeName}, Company: ${safeCompany}`);
      console.log(`[CONTENT] ${safeMessage.substring(0, 50)}...`);
    }

    return res.status(200).json({ success: true, message: 'Message reçu et sécurisé.' });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Erreur de validation structurée
      const errorMap = error.flatten().fieldErrors;
      // On ne renvoie que la première erreur pour simplifier l'UI
      const firstError = Object.values(errorMap)[0]?.[0] || 'Données invalides';
      return res.status(400).json({ error: firstError, details: errorMap });
    }

    // Log only in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('[SERVER ERROR]', error);
    }

    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
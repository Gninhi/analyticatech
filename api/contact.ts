import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { Resend } from 'resend';
import { ContactSchema } from '../utils/schemas';
import { z } from 'zod';

import { createClient } from '@supabase/supabase-js';

// ── Server-side Configuration ─────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL_DESTINATION || 'contact@analyticatech.fr';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * API SERVERLESS - SECURE CONTACT ENDPOINT
 * ----------------------------------------
 * Architecture: Zero-Trust & Validation Layer + Persistent Rate Limiting
 * Flow: Validate → Rate Limit → PoW Check → Sanitize → Save to DB → Send Email
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

/**
 * Build the HTML email template for the contact notification.
 */
const buildEmailHtml = (name: string, email: string, company: string, message: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; margin: 0; padding: 40px 0; color: #18181b; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; }
        .header h1 { color: #818cf8; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.3px; }
        .header p { color: #94a3b8; margin: 8px 0 0; font-size: 13px; }
        .body { padding: 32px 40px; }
        .field { margin-bottom: 20px; }
        .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; font-weight: 600; margin-bottom: 4px; }
        .field-value { font-size: 15px; color: #27272a; line-height: 1.5; }
        .field-value a { color: #818cf8; text-decoration: none; }
        .message-box { background: #f9fafb; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; margin-top: 4px; }
        .footer { padding: 20px 40px; background: #fafafa; text-align: center; font-size: 11px; color: #a1a1aa; border-top: 1px solid #f0f0f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AnalyticaTech</h1>
          <p>Nouveau message depuis le formulaire de contact</p>
        </div>
        <div class="body">
          <div class="field">
            <div class="field-label">Nom</div>
            <div class="field-value">${name}</div>
          </div>
          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value"><a href="mailto:${email}">${email}</a></div>
          </div>
          ${company ? `
          <div class="field">
            <div class="field-label">Entreprise</div>
            <div class="field-value">${company}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="field-label">Message</div>
            <div class="message-box">
              <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
        <div class="footer">
          Reçu via le formulaire de contact analyticatech.fr &bull; ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </body>
    </html>
  `;
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

    // 7. SAVE TO DATABASE (Supabase)
    if (supabase) {
      try {
        const { error: insertError } = await supabase
          .from('leads')
          .insert({
            name: safeName,
            email: safeEmail,
            company: safeCompany || null,
            message: safeMessage,
            source: 'contact_form',
            status: 'new',
            metadata: {
              pow_timestamp: validatedData.pow.timestamp,
              pow_nonce: validatedData.pow.nonce,
              ip: clientIp,
            },
          });

        if (insertError) {
          console.error('[Supabase Insert Error]', insertError);
          // Don't fail the request if DB insert fails — the email is more critical
        }
      } catch (dbInsertError) {
        console.error('[Supabase Insert Exception]', dbInsertError);
      }
    }

    // 8. SEND EMAIL VIA RESEND
    if (resend) {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'AnalyticaTech <onboarding@resend.dev>',  // Use verified domain in production
        to: [CONTACT_EMAIL],
        replyTo: validatedData.email,  // Use raw email for reply-to (not escaped)
        subject: `Nouveau contact — ${safeCompany || safeName}`,
        html: buildEmailHtml(safeName, safeEmail, safeCompany, safeMessage),
      });

      if (emailError) {
        console.error('[Resend Error]', emailError);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.' });
      }

      // Log only in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[EMAIL SENT] ID: ${emailData?.id}, To: ${CONTACT_EMAIL}`);
      }
    } else {
      // Resend not configured — log warning but don't fail
      console.warn('[WARN] Resend API key not configured. Email was NOT sent.');
      console.warn('[WARN] Set RESEND_API_KEY in your environment variables.');
    }

    return res.status(200).json({ success: true, message: 'Message reçu et envoyé avec succès.' });

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
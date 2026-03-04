
/**
 * SECURITY UTILS - MILITARY GRADE
 * Défense en profondeur : PoW, Sanitization, Validation.
 */

// --- 1. PROOF OF WORK (ANTI-BOT CPU-BOUND) ---
// Force le client à "payer" en temps de calcul pour envoyer une requête.
// Rend les attaques de spam massivement coûteuses pour l'attaquant.

interface PoWPayload {
  timestamp: number;
  nonce: number;
  hash: string;
}

const DIFFICULTY = 4; // Nombre de zéros requis au début du hash
const PREFIX = '0'.repeat(DIFFICULTY);

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const generateProofOfWork = (): Promise<PoWPayload> => {
  return new Promise((resolve) => {
    const timestamp = Date.now();
    let nonce = 0;
    
    // Optimisation: On ne bloque pas le thread principal.
    // On calcule par blocs de 100 itérations et on laisse la main (yield) au navigateur.
    const mine = async () => {
      const batchSize = 100; // Nombre de hashs avant de laisser respirer l'UI
      
      for (let i = 0; i < batchSize; i++) {
        const input = `${timestamp}::${nonce}::ANALYTICATECH_SECURE`;
        const hash = await sha256(input);
        
        if (hash.startsWith(PREFIX)) {
          resolve({ timestamp, nonce, hash });
          return;
        }
        nonce++;
      }
      
      // Laisser le thread principal respirer pour ne pas freezer l'UI
      setTimeout(mine, 0);
    };
    
    mine();
  });
};

// --- 2. ADVANCED SANITIZATION (XSS DEFENSE) ---

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Normalisation Unicode (évite les bypass via caractères exotiques)
  let clean = input.trim().normalize('NFKC');
  
  // Suppression radicale des vecteurs XSS connus
  clean = clean
    .replace(/javascript:/gi, '[BLOCK]') 
    .replace(/vbscript:/gi, '[BLOCK]')
    .replace(/data:/gi, '[BLOCK]')
    .replace(/on\w+=/gi, '[BLOCK]'); // onEvent=

  // Encodage HTML strict des caractères spéciaux
  return clean.replace(/[&<>"'/`=]/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return entities[char];
  });
};

// --- 3. VALIDATION ---

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  // Regex conforme RFC 5322 simplifiée mais stricte sur la structure
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
  
  if (!email || email.length > 254) return { isValid: false, error: "Email trop long." };
  if (!emailRegex.test(email)) return { isValid: false, error: "Format invalide." };
  
  // Bloquer les domaines jetables courants (liste non exhaustive)
  const blocklist = ['tempmail.com', 'throwawaymail.com', 'mailinator.com'];
  const domain = email.split('@')[1];
  if (blocklist.includes(domain)) return { isValid: false, error: "Domaine non autorisé." };

  return { isValid: true };
};

export const validateText = (text: string, minLength: number = 2, maxLength: number = 1000): ValidationResult => {
  if (!text || text.length < minLength) return { isValid: false, error: `Minimum ${minLength} caractères.` };
  if (text.length > maxLength) return { isValid: false, error: `Maximum ${maxLength} caractères.` };

  // Détection de spam (liens excessifs)
  const linkCount = (text.match(/http/g) || []).length;
  if (linkCount > 2) return { isValid: false, error: "Trop de liens détectés." };
  
  return { isValid: true };
};

// --- 4. CLIENT SIDE RATE LIMITING (UX LAYER) ---
// Simple couche UX, ne remplace pas la sécurité serveur
export const RATE_LIMIT_COOLDOWN_MS = 60000; // 1 minute
const LAST_SUBMISSION_KEY = 'last_submission';

export const checkRateLimit = (): boolean => {
  try {
    const lastSub = localStorage.getItem(LAST_SUBMISSION_KEY);
    if (!lastSub) return true;
    const parsedTime = parseInt(lastSub, 10);
    if (isNaN(parsedTime)) return true; // Handle invalid timestamp
    const timeDiff = Date.now() - parsedTime;
    return timeDiff >= RATE_LIMIT_COOLDOWN_MS;
  } catch {
    return true; 
  }
};

export const recordSubmission = () => {
  try { 
    localStorage.setItem(LAST_SUBMISSION_KEY, Date.now().toString()); 
  } catch {
    // Silently fail if localStorage is not available
  }
};

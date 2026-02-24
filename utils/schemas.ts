import { z } from 'zod';

// Schéma strict pour le formulaire de contact
export const ContactSchema = z.object({
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { message: "Le nom est trop long." })
    .regex(/^[\p{L}\s\-']+$/u, { message: "Caractères invalides dans le nom." }), // Unicode letters only
  
  email: z.string()
    .email({ message: "Adresse email invalide." })
    .max(254, { message: "Email trop long." })
    .refine((email) => !email.endsWith("@tempmail.com"), { message: "Domaines temporaires interdits." }),

  company: z.string()
    .max(100, { message: "Nom de société trop long." })
    .optional()
    .or(z.literal('')),

  message: z.string()
    .min(10, { message: "Le message est trop court (min 10 car.)." })
    .max(2000, { message: "Le message dépasse la limite de 2000 caractères." }),

  _gotcha: z.string().optional(), // Honeypot
  
  // Proof of Work Payload Validation
  pow: z.object({
    timestamp: z.number(),
    nonce: z.number(),
    hash: z.string().length(64) // SHA-256 hex length
  }).optional()
});

export type ContactFormData = z.infer<typeof ContactSchema>;
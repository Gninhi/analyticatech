
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MapPin, Send, Loader2, Check, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import Turnstile from '../components/UI/Turnstile';
import { checkRateLimit, recordSubmission, generateProofOfWork, sanitizeInput } from '../utils/security';
import { usePageSEO } from '../hooks/usePageSEO';
import { ContactSchema, ContactFormData } from '../utils/schemas';
import { z } from 'zod';
import { useI18n } from '../components/System/I18nProvider';
import { supabase } from '../lib/supabase';
import { config } from '../config/env';

const Contact: React.FC = () => {
  const { t } = useI18n();
  usePageSEO({ title: "Contact", description: "Initialisez le protocole. Contactez nos experts pour un audit." });
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const ghostX = useTransform(scrollY, [0, 500], ["0%", "10%"]);

  const [formData, setFormData] = useState<Partial<ContactFormData>>({ name: '', email: '', company: '', message: '', _gotcha: '' });
  const [status, setStatus] = useState<'idle' | 'computing' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
    if (status === 'error') setStatus('idle');
  };

  const validateForm = (): boolean => {
    try {
      // Validation Zod Partielle (sans PoW)
      ContactSchema.omit({ pow: true }).parse(formData);
      setFieldErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) errors[e.path[0] as string] = e.message;
        });
        setFieldErrors(errors);
        setErrorMessage("Veuillez corriger les erreurs dans le formulaire.");
        setStatus('error');
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!checkRateLimit()) { setStatus('error'); setErrorMessage(t('contact.error.rate_limit')); return; }

    const hasCaptcha = config.turnstile.siteKey &&
      config.turnstile.siteKey !== '' &&
      config.turnstile.siteKey !== 'YOUR_TURNSTILE_SITE_KEY_HERE';

    if (hasCaptcha && !turnstileToken) {
      setStatus('error');
      setErrorMessage('Veuillez compléter le CAPTCHA.');
      return;
    }

    // Étape 1: Génération du Proof of Work (sécurité anti-bot)
    setStatus('computing');

    try {
      const pow = await generateProofOfWork();

      // Étape 2: Sanitization des inputs (protection XSS)
      const sanitizedData = {
        name: sanitizeInput(formData.name || ''),
        email: sanitizeInput(formData.email || ''),
        company: formData.company ? sanitizeInput(formData.company) : null,
        message: sanitizeInput(formData.message || ''),
      };

      setStatus('submitting');

      // Étape 3: Insertion sécurisée dans Supabase avec PoW
      if (!supabase) {
        throw new Error('Configuration Supabase manquante');
      }

      const { error: supabaseError } = await supabase
        .from('leads')
        .insert({
          name: sanitizedData.name,
          email: sanitizedData.email,
          company: sanitizedData.company,
          message: sanitizedData.message,
          source: 'contact_form',
          status: 'new',
          // Stocker le PoW pour validation côté serveur si nécessaire
          metadata: { pow_timestamp: pow.timestamp, pow_nonce: pow.nonce },
        });

      if (supabaseError) {
        throw new Error(supabaseError.message || 'Erreur lors de l\'envoi');
      }

      recordSubmission();
      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '', _gotcha: '' });
      setFieldErrors({});
    } catch (err: any) {
      console.error('[Contact Error]', err);
      setStatus('error');
      setErrorMessage(err.message || t('contact.error.generic'));
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <section className="h-[70vh] flex flex-col justify-center px-4 max-w-7xl mx-auto relative z-10 pt-20 overflow-hidden">
        <motion.div style={{ x: ghostX }} className="absolute top-[20%] right-[-10%] text-[20vw] font-display font-bold text-slate-100/50 dark:text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter">CONNEXION</motion.div>
        <motion.div style={{ y: titleY }} className="relative z-10">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-[1px] bg-analytica-accent"></div><span className="text-analytica-accent font-mono text-sm tracking-[0.2em] uppercase">{t('contact.hero_sub')}</span></div>

          <AnimatedHeading
            text={t('contact.title_1')}
            highlightText={t('contact.title_2')}
            size="9xl"
          />

        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="h-full">
            <Card variant="tech" className="space-y-8 p-8 h-full">
              <AnimatedHeading text={t('contact.coords')} size="6xl" />
              <div className="space-y-6">
                <div className="flex items-start gap-5 group">
                  <div className="bg-analytica-accent/10 p-4 rounded-xl text-analytica-accent"><MapPin size={24} /></div>
                  <div><h4 className="text-slate-900 dark:text-white font-bold text-lg mb-1">{t('contact.headquarters')}</h4><address className="text-slate-500 dark:text-slate-400 not-italic">1 rue François 1er<br />75008 Paris, France</address></div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="bg-analytica-accent/10 p-4 rounded-xl text-analytica-accent"><Mail size={24} /></div>
                  <div><h4 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Email</h4><a href="mailto:contact@analyticatech.fr" className="text-slate-500 dark:text-slate-400 hover:text-analytica-accent transition-colors text-lg">contact@analyticatech.fr</a></div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card variant="tech" className="p-8 md:p-10 !rounded-3xl shadow-2xl relative">
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                <input type="text" name="_gotcha" value={formData._gotcha} onChange={handleChange} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                {status === 'success' ? (
                  <div className="text-center py-20">
                    <div className="bg-green-500/20 text-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40} /></div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{t('contact.success.title')}</h3>
                    <p className="text-slate-500 mb-6">{t('contact.success.desc')}</p>
                    <button type="button" onClick={() => setStatus('idle')} className="text-analytica-accent hover:underline font-mono uppercase text-sm">{t('contact.success.retry')}</button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-slate-500 dark:text-slate-300 ml-1">{t('contact.form.name')}</label>
                        <input id="name" type="text" name="name" required value={formData.name} onChange={handleChange} className={`w-full bg-slate-50 dark:bg-[#000510] border ${fieldErrors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-analytica-accent focus:ring-1 focus:ring-analytica-accent outline-none transition-all`} placeholder={t('contact.form.name_ph')} />
                        {fieldErrors.name && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 font-medium"><AlertCircle size={14} /> {fieldErrors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-slate-500 dark:text-slate-300 ml-1">{t('contact.form.email')}</label>
                        <input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} className={`w-full bg-slate-50 dark:bg-[#000510] border ${fieldErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-analytica-accent focus:ring-1 focus:ring-analytica-accent outline-none transition-all`} placeholder={t('contact.form.email_ph')} />
                        {fieldErrors.email && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 font-medium"><AlertCircle size={14} /> {fieldErrors.email}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-bold text-slate-500 dark:text-slate-300 ml-1">{t('contact.form.company')}</label>
                      <input id="company" type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#000510] border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-analytica-accent focus:ring-1 focus:ring-analytica-accent outline-none transition-all" placeholder={t('contact.form.company_ph')} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-bold text-slate-500 dark:text-slate-300 ml-1">{t('contact.form.message')}</label>
                      <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className={`w-full bg-slate-50 dark:bg-[#000510] border ${fieldErrors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-analytica-accent focus:ring-1 focus:ring-analytica-accent outline-none resize-none transition-all`} placeholder={t('contact.form.message_ph')}></textarea>
                      {fieldErrors.message && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 font-medium"><AlertCircle size={14} /> {fieldErrors.message}</p>}
                    </div>

                    <Turnstile onSuccess={(token) => setTurnstileToken(token)} onError={() => setTurnstileToken('')} />

                    {status === 'error' && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {errorMessage}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {status === 'computing' ? (
                          <span className="text-analytica-accent animate-pulse flex items-center gap-2"><Lock size={14} /> {t('contact.security.hashing')}</span>
                        ) : (
                          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-500" /> {t('contact.security.encrypted')}</span>
                        )}
                      </div>

                      <Button type="submit" variant="shiny" disabled={status === 'submitting' || status === 'computing'} icon={false}>
                        {status === 'computing' ? <><>{t('contact.btn.secure')} <Loader2 className="animate-spin ml-2" size={16} /></></> : status === 'submitting' ? <><>{t('contact.btn.sending')} <Loader2 className="animate-spin ml-2" size={16} /></></> : <><>{t('contact.btn.send')} <Send size={20} /></></>}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import { usePageSEO } from '../hooks/usePageSEO';

const Legal: React.FC = () => {
  usePageSEO({ title: "Mentions Légales", description: "Informations légales et politique de confidentialité." });
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const ghostX = useTransform(scrollY, [0, 500], ["0%", "10%"]);

  return (
    <div className="w-full overflow-hidden">
       {/* SIGNATURE HERO */}
      <section className="h-[70vh] flex flex-col justify-center px-4 max-w-7xl mx-auto relative z-10 pt-20 overflow-hidden">
        {/* Ghost Text */}
        <motion.div 
          style={{ x: ghostX }}
          className="absolute top-[20%] left-[-10%] text-[20vw] font-display font-bold text-slate-200 dark:text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0"
        >
          CONFORMITÉ
        </motion.div>

        <motion.div style={{ y: titleY }} className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-[1px] bg-analytica-accent"></div>
             <span className="text-analytica-accent font-mono text-sm tracking-[0.2em] uppercase">
               Protocoles Légaux
             </span>
          </div>
          
          {/* NOUVEAU TITRE PIXEL */}
          <AnimatedHeading 
             text="MENTIONS" 
             highlightText="LÉGALES"
             size="9xl"
          />

        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-10">
        <div className="space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-white/80 dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-xl dark:shadow-none">
          <section>
            <AnimatedHeading text="1. Éditeur du site" size="5xl" />
            <p>
              Le site <strong>Analyticatech</strong> est édité par la société Analyticatech SAS, au capital de 50 000 euros.<br/>
              Immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.<br/>
              Siège social : 1 rue François 1er, 75008 Paris, France.<br/>
              Directeur de la publication : Jean Rivière.
            </p>
          </section>

          <section>
            <AnimatedHeading text="2. Hébergement" size="5xl" />
            <p>
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
            </p>
          </section>

          <section>
            <AnimatedHeading text="3. Propriété Intellectuelle" size="5xl" />
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <AnimatedHeading text="4. Protection des données (RGPD)" size="5xl" />
            <p className="mb-2">
              Analyticatech s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site, soient conformes au règlement général sur la protection des données (RGPD).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Finalité :</strong> Les données sont collectées pour répondre aux demandes de contact et d'audit.</li>
              <li><strong>Conservation :</strong> Les données sont conservées pour une durée maximale de 3 ans après le dernier contact.</li>
              <li><strong>Droits :</strong> Vous disposez d'un droit d'accès, de rectification et d'effacement de vos données.</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:dpo@analyticatech.fr" className="text-analytica-accent hover:underline">dpo@analyticatech.fr</a>.
            </p>
          </section>

          <section>
            <AnimatedHeading text="5. Cookies" size="5xl" />
            <p>
              Ce site utilise des cookies techniques nécessaires au bon fonctionnement de l'application (mémorisation du thème sombre/clair). Aucune donnée publicitaire n'est collectée sans votre consentement explicite.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;
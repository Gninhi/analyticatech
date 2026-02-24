
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'shiny';
  className?: string;
  icon?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  onClick,
  variant = 'primary',
  className = '',
  icon = true,
  type = 'button',
  disabled = false,
  ariaLabel
}) => {

  // BASE: Structure, Typographie, Transition et Feedback Tactile
  const baseStyles = `
    relative overflow-hidden 
    font-display font-bold tracking-[0.15em] uppercase text-xs md:text-sm 
    rounded-xl 
    flex items-center justify-center gap-3 
    py-3 px-6 md:py-4 md:px-8 box-border min-w-fit
    transition-all duration-300 ease-out
    active:scale-[0.98] active:brightness-90
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    group
  `;

  // PALETTE EXACTE:
  // Main Blue: #03318C
  // Darker Blue: #022873
  // Deepest Blue: #022859
  // Accent Orange: #F26D3D

  const variants = {
    // PRIMARY: Le "Saphir" - Dégradé Bleu Royal + Reflet Lumière
    primary: `
      bg-gradient-to-b from-[#03318C] to-[#022873]
      text-white
      border border-[#03318C] border-t-white/20
      shadow-[0_4px_14px_0_rgba(3,49,140,0.39)]
      hover:shadow-[0_6px_20px_rgba(3,49,140,0.23)]
      hover:bg-[#022859]
      hover:border-t-white/30
    `,

    // SECONDARY: Le "Noyau" - Accent Orange Vibrant + Aura
    secondary: `
      bg-gradient-to-b from-[#F26D3D] to-[#d65a2d]
      text-white
      border border-[#F26D3D] border-t-white/20
      shadow-[0_4px_14px_0_rgba(242,109,61,0.39)]
      hover:shadow-[0_6px_24px_rgba(242,109,61,0.4)]
      hover:brightness-110
    `,

    // OUTLINE: Le "Cadre" - Subtil, Élégant, Réactif
    outline: `
      bg-transparent
      text-[#03318C] dark:text-white
      border border-slate-300 dark:border-[#03318C]/50
      hover:border-[#F26D3D] dark:hover:border-[#F26D3D]
      hover:text-[#F26D3D] dark:hover:text-[#F26D3D]
      hover:bg-[#F26D3D]/5
      backdrop-blur-sm
    `,

    // GHOST: Minimaliste
    ghost: `
      bg-transparent 
      text-slate-600 dark:text-slate-400 
      hover:text-[#03318C] dark:hover:text-white 
      hover:bg-slate-100 dark:hover:bg-[#011C40]/50
      shadow-none border-none
    `,

    // SHINY: L'Holographique - Pour les CTAs ultimes
    shiny: `
      shiny-cta text-white 
      shadow-[0_0_20px_rgba(3,49,140,0.3)]
      hover:shadow-[0_0_30px_rgba(242,109,61,0.4)]
      hover:scale-[1.02]
      border border-[#03318C]/50
    `
  };

  const renderContent = () => (
    <>
      {/* SHINY LAYERS (Effet spécial) */}
      {variant === 'shiny' && (
        <>
          <div className="absolute inset-0 opacity-20 bg-[url('/assets/noise.svg')] brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>
          {/* Le gradient tourne autour du bleu nuit (#011C40) et du bleu royal (#03318C) */}
          <div className="absolute inset-0 rounded-[inherit] [background:radial-gradient(circle_at_var(--position)_var(--position),rgba(255,255,255,0.1)_0.5px,transparent_0)_padding-box] [background-size:4px_4px] [background-repeat:space] [mask-image:conic-gradient(from_calc(var(--gradient-angle)+45deg),black,transparent_10%_90%,black)] opacity-40 pointer-events-none" />
        </>
      )}

      {/* GLOW EFFECT ON HOVER (Standard buttons) */}
      {(variant === 'primary' || variant === 'secondary') && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
      )}

      {/* DECORATION */}
      {variant === 'primary' && icon && (
        <Terminal size={14} className="opacity-60 group-hover:opacity-100 group-hover:text-white transition-opacity" />
      )}
      {variant === 'secondary' && icon && (
        <Sparkles size={14} className="opacity-80 group-hover:rotate-12 transition-transform" />
      )}

      <span className="relative z-20 flex items-center gap-2">
        {children}
      </span>

      {icon && (
        <ArrowRight
          size={16}
          className="relative z-20 transform group-hover:translate-x-1 transition-transform duration-300"
        />
      )}
    </>
  );

  const finalClassName = `${baseStyles} ${variants[variant]} ${className}`;

  // CSS Houdini Fallback style for Shiny button (Custom Colors from Palette)
  const shinyStyle = variant === 'shiny' ? {
    // Fond: Bleu Nuit -> Bleu Royal
    // Shine: Accent Orange (#F26D3D)
    background: `linear-gradient(#011C40, #03318C) padding-box, conic-gradient(from calc(var(--gradient-angle) - var(--gradient-angle-offset)), transparent 0%, #03318C 5%, #F26D3D 15%, #03318C 30%, transparent 40%, transparent 100%) border-box`,
    border: '1px solid transparent',
  } : {};

  if (to) {
    return (
      <NavLink
        to={to}
        className={finalClassName}
        style={shinyStyle}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {renderContent()}
      </NavLink>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
      style={shinyStyle}
      aria-label={ariaLabel}
    >
      {renderContent()}
    </button>
  );
};

export default Button;

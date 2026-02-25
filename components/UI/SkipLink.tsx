import React from 'react';

/**
 * Skip Link pour l'accessibilité
 * Permet aux utilisateurs de clavier d'accéder directement au contenu principal
 */
const SkipLink: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 focus:z-[100] focus:px-4 focus:py-2 
                 focus:bg-analytica-accent focus:text-white 
                 focus:rounded-lg focus:font-bold focus:shadow-lg
                 focus:outline-none focus:ring-2 focus:ring-white"
      aria-label="Aller au contenu principal"
    >
      Aller au contenu principal
    </a>
  );
};

export default SkipLink;

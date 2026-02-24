
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  wrapperClassName = "",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900 ${wrapperClassName}`}>
      
      {/* 1. Loading Skeleton (Visible tant que l'image n'est pas chargée ET qu'il n'y a pas d'erreur) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-10" />
      )}
      
      {/* 2. Error Fallback */}
      {hasError && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-4 text-center z-20">
            <ImageOff size={24} className="mb-2 opacity-50" />
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">Image non disponible</span>
         </div>
      )}

      {/* 3. The Image (Native Lazy Loading) */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
          }}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;

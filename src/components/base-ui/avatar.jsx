import React, { useState, useEffect } from 'react';

export const Avatar = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`avatar-base-ui ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border-color)',
        flexShrink: 0,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export const AvatarImage = ({ src, alt = '', className = '', style = {} }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }
    
    setIsLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  if (hasError || !isLoaded) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={`avatar-image-base-ui ${className}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style
      }}
    />
  );
};

export const AvatarFallback = ({ children, className = '', style = {} }) => {
  return (
    <div
      className={`avatar-fallback-base-ui ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontWeight: '700',
        fontSize: '0.85rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        textTransform: 'uppercase',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
        ...style
      }}
    >
      {children}
    </div>
  );
};

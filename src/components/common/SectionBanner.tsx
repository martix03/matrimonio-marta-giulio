import React from 'react';
import { TimeBolle, MiniWave } from '../home/GraficaElements';

export interface SectionBannerProps {
  /**
   * Componente grafico per il titolo (es: TimeTitle, MappaTitle, ViaggioTitle),
   * elemento JSX, oppure stringa (URL immagine o testo semplice).
   */
  title: React.ReactNode | React.ComponentType<{ className?: string }>;

  /**
   * Testo o contenuto JSX per il sottotitolo.
   */
  subtitle?: React.ReactNode;

  /**
   * Classi personalizzate per il titolo (default: "h-16 lg:h-20 w-auto mb-2")
   */
  titleClassName?: string;

  /**
   * Classi personalizzate per il sottotitolo (default: "sottotitolo text-white/80 text-left lg:text-center max-w-md lg:mx-auto mb-8")
   */
  subtitleClassName?: string;

  /**
   * Elemento decorativo in alto a destra (default: TimeBolle).
   * Passare `false` per disabilitarlo.
   */
  bubble?: React.ReactNode | React.ComponentType<{ className?: string }> | false;

  /**
   * Se mostrare l'onda inferiore a 2 curve (default: true).
   */
  showWave?: boolean;

  /**
   * Colore di riempimento dell'onda inferiore (default: "#fffcf7").
   */
  waveColor?: string;

  /**
   * Se mostrare la decorazione MiniWave sotto al titolo (default: true).
   */
  showMiniWave?: boolean;

  /**
   * Colore della MiniWave (default: "#667b4e").
   */
  miniWaveColor?: string;

  /**
   * Colore di sfondo del banner (default: "bg-[#8c2035]").
   */
  bgColor?: string;

  /**
   * Classi CSS aggiuntive per il container esterno.
   */
  className?: string;

  /**
   * Elementi figli opzionali posizionati sotto al sottotitolo (es: bottoni o date).
   */
  children?: React.ReactNode;
}

export const SectionBanner: React.FC<SectionBannerProps> = ({
  title,
  subtitle,
  titleClassName = 'h-16 lg:h-20 w-auto mb-2',
  subtitleClassName = 'sottotitolo text-white/80 text-left lg:text-center max-w-md lg:mx-auto mb-8',
  bubble,
  showWave = true,
  waveColor = '#fffcf7',
  showMiniWave = true,
  miniWaveColor = '#667b4e',
  bgColor = 'bg-[#8c2035]',
  className = '',
  children,
}) => {
  const renderTitle = () => {
    if (!title) return null;

    if (typeof title === 'function' || (typeof title === 'object' && title !== null && 'render' in title)) {
      const TitleComponent = title as React.ComponentType<{ className?: string }>;
      return <TitleComponent className={titleClassName} />;
    }

    if (React.isValidElement(title)) {
      return title;
    }

    if (typeof title === 'string' && (title.includes('/') || title.endsWith('.svg') || title.endsWith('.png'))) {
      return (
        <img
          src={title}
          alt=""
          className={`pointer-events-none select-none ${titleClassName}`}
        />
      );
    }

    if (typeof title === 'string') {
      return <h2 className={`titolo text-white ${titleClassName}`}>{title}</h2>;
    }

    return title;
  };

  const renderBubble = () => {
    if (bubble === false) return null;

    const BubbleTarget = bubble ?? TimeBolle;

    if (
      typeof BubbleTarget === 'function' ||
      (typeof BubbleTarget === 'object' && BubbleTarget !== null && 'render' in BubbleTarget)
    ) {
      const BubbleComponent = BubbleTarget as React.ComponentType<{ className?: string }>;
      return <BubbleComponent className="absolute top-0 right-0 w-1/3 lg:w-[15%] pointer-events-none" />;
    }

    if (React.isValidElement(BubbleTarget)) {
      return BubbleTarget;
    }

    return null;
  };

  return (
    <div
      className={`relative overflow-hidden ${bgColor} text-white pl-8 pr-8 pt-8 lg:pt-16 pb-16 lg:pb-32 ${className}`}
    >
      {/* ONDA A 2 CURVE (sale e scende) */}
      {showWave && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            className="relative block w-full h-12 sm:h-20 lg:h-28"
            viewBox="0 0 1200 360"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,56 C 257,56 461,358 725,358 C 909,358 1106,206 1200,127 L 1200,360 L 0,360 Z"
              fill={waveColor}
            />
          </svg>
        </div>
      )}

      {/* Organic soft pink blob at top right */}
      {renderBubble()}

      <div className="flex flex-col items-start lg:items-center mt-6">
        {renderTitle()}

        {showMiniWave && (
          <MiniWave
            color={miniWaveColor}
            className="w-44 lg:w-60 h-auto my-2"
            strokeWidth={1.5}
            lgStrokeWidth={1}
          />
        )}

        {subtitle && (
          <p className={subtitleClassName}>
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};

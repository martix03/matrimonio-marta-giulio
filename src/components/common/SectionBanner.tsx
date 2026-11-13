import React from "react";
import { Orchidea, Orchidea2 } from "../home/GraficaElements";

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
   * Se mostrare l'onda inferiore a 2 curve (default: true).
   */
  showWave?: boolean;

  /**
   * Colore di riempimento dell'onda inferiore (default: "#fffcf7").
   */
  waveColor?: string;

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
  titleClassName = "h-16 lg:h-20 w-auto mb-2 lg:mt-8 text-lightRosa",
  subtitleClassName = "body sm:sottotitolo lg:sottotitolo text-lightRosa/70 text-center max-w-md mx-auto mb-10 lg:mb-16",
  showWave = true,
  waveColor = "#fffcf7",
  bgColor = "bg-burgundy",
  className = "",
  children,
}) => {
  const renderTitle = () => {
    if (!title) return null;

    if (
      typeof title === "function" ||
      (typeof title === "object" && title !== null && "render" in title)
    ) {
      const TitleComponent = title as React.ComponentType<{
        className?: string;
      }>;
      return <TitleComponent className={titleClassName} />;
    }

    if (React.isValidElement(title)) {
      return title;
    }

    if (
      typeof title === "string" &&
      (title.includes("/") || title.endsWith(".svg") || title.endsWith(".png"))
    ) {
      return (
        <img
          src={title}
          alt=""
          className={`pointer-events-none select-none ${titleClassName}`}
        />
      );
    }

    if (typeof title === "string") {
      return (
        <h2 className={`titolo text-lightRosa ${titleClassName}`}>{title}</h2>
      );
    }

    return title;
  };

  const RenderOrchidee = () => {
    return (
      <div className="pointer-events-none select-none">
        <Orchidea className="absolute top-16 sm:top-10 -left-2 w-[18%] sm:w-[12%] lg:w-[8%] rotate-[45deg] pointer-events-none" />
        <Orchidea2 className="absolute top-8 -right-2 w-[22%]  sm:w-[13%] lg:w-[9%] -rotate-[55deg]" />
      </div>
    );
  };

  return (
    <div
      className={`relative overflow-hidden ${bgColor} text-white pl-8 pr-8 pt-8 pb-6 sm:pb-8 lg:pb-12 ${className}`}
    >
      {/* ONDA A 2 CURVE (sale e scende) */}
      {showWave && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            className="relative block w-full h-20 sm:h-24 lg:h-32"
            viewBox="0 0 1200 360"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,100 C 280,100 460,280 720,280 C 920,280 1080,190 1200,150 L 1200,360 L 0,360 Z"
              fill={waveColor}
            />
          </svg>
        </div>
      )}

      {/* Organic soft pink blob at top right */}
      {RenderOrchidee()}

      <div className="flex flex-col items-center text-center mt-4">
        {renderTitle()}

        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}

        {children}
      </div>
    </div>
  );
};

import React from "react";
import { Calla, CallaBianca } from "../home/GraficaElements";
import { SectionBannerProps } from "./SectionBanner";

export const SectionBannerVerde: React.FC<SectionBannerProps> = ({
  title,
  subtitle,
  titleClassName = "h-12 lg:h-20 w-auto mb-2 lg:mt-8 text-lightRosa",
  subtitleClassName = "body sm:sottotitolo lg:sottotitolo text-lightRosa text-center max-w-md mx-auto mb-10 lg:mb-16",
  showWave = true,
  waveColor = "#fbf5f4",
  bgColor = "bg-[#adb6a0]",
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

  const RenderCalle = () => {
    return (
      <div className="pointer-events-none select-none">
        <Calla className="absolute -top-0 -left-2 w-[18%] sm:w-[7%] lg:w-[6%] rotate-[25deg] pointer-events-none" />
        <CallaBianca className="absolute bottom-8 right-0 w-[12%] sm:w-[6%] lg:w-[5%] -rotate-[38deg]" />
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

      {/* Decorative Calle */}
      {RenderCalle()}

      <div className="flex flex-col items-center text-center mt-4">
        {renderTitle()}

        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}

        {children}
      </div>
    </div>
  );
};

export const SectionVerdeBanner = SectionBannerVerde;

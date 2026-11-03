import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-13 h-13',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const logoSrc = "/assets/aistudio/file_00000000a39082439c40a40d766f0f82_c1fea296.png";

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      <div className="relative">
        {/* Subtle gold luxury ambient glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 via-[#E6007A]/20 to-[#ECC260]/40 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
        <img 
          src={logoSrc} 
          alt="P-Kess Fashion World Official Brand Logo" 
          className={`relative z-10 ${sizeClasses[size]} object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] rounded-full transition-transform duration-300 group-hover:scale-105`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-brand-display tracking-[0.16em] uppercase text-sm sm:text-base font-bold bg-gradient-to-r from-[#FFE898] via-[#F4CF68] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-sm">
            P-Kess
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/90 font-medium -mt-0.5">
            Fashion World
          </span>
          <span className="font-serif-luxury italic text-[9px] sm:text-[10px] text-[#FF2A85] tracking-wider">
            Creating Elegance
          </span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: { container: 'w-8 h-8', text: 'text-sm', icon: 20, subtitle: 'text-xs' },
    md: { container: 'w-12 h-12', text: 'text-lg', icon: 28, subtitle: 'text-xs' },
    lg: { container: 'w-16 h-16', text: 'text-xl', icon: 36, subtitle: 'text-sm' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`${currentSize.container} bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ESP Building Structure */}
          <rect x="6" y="10" width="20" height="18" rx="1" fill="white" fillOpacity="0.95"/>
          
          {/* Windows pattern */}
          <rect x="8" y="13" width="2.5" height="2" fill="#2563eb"/>
          <rect x="12" y="13" width="2.5" height="2" fill="#2563eb"/>
          <rect x="16" y="13" width="2.5" height="2" fill="#2563eb"/>
          <rect x="20" y="13" width="2.5" height="2" fill="#2563eb"/>
          
          <rect x="8" y="17" width="2.5" height="2" fill="#2563eb"/>
          <rect x="12" y="17" width="2.5" height="2" fill="#2563eb"/>
          <rect x="16" y="17" width="2.5" height="2" fill="#2563eb"/>
          <rect x="20" y="17" width="2.5" height="2" fill="#2563eb"/>
          
          <rect x="8" y="21" width="2.5" height="2" fill="#2563eb"/>
          <rect x="12" y="21" width="2.5" height="2" fill="#2563eb"/>
          <rect x="16" y="21" width="2.5" height="2" fill="#2563eb"/>
          <rect x="20" y="21" width="2.5" height="2" fill="#2563eb"/>
          
          <rect x="8" y="25" width="2.5" height="2" fill="#2563eb"/>
          <rect x="12" y="25" width="2.5" height="2" fill="#2563eb"/>
          <rect x="16" y="25" width="2.5" height="2" fill="#2563eb"/>
          <rect x="20" y="25" width="2.5" height="2" fill="#2563eb"/>
          
          {/* Budget symbol crown */}
          <circle cx="16" cy="6" r="4" fill="white" stroke="#2563eb" strokeWidth="0.5"/>
          <path d="M13 6 L16 3 L19 6 L16 9 Z" fill="#2563eb"/>
          <circle cx="16" cy="6" r="1.5" fill="white"/>
        </svg>
      </motion.div>
      
      {variant === 'full' && (
        <div>
          <h1 className={`font-bold ${currentSize.text} bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight`}>
            ESP Budget
          </h1>
          <p className={`${currentSize.subtitle} text-gray-500 leading-tight font-medium`}>
            Gestion Budgétaire
          </p>
        </div>
      )}
    </div>
  );
};
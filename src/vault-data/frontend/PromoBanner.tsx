'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Gift, Star, Zap } from 'lucide-react';

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  variant?: 'gradient' | 'solid' | 'glass';
  accentColor?: 'pink' | 'purple' | 'blue' | 'green' | 'orange';
  onCtaClick?: () => void;
  dismissible?: boolean;
  className?: string;
}

/**
 * PromoBanner Component
 * 
 * A beautiful promotional banner with macOS pastel aesthetics.
 * Features smooth animations, multiple variants, and glassmorphism effects.
 * Perfect for highlighting special offers, announcements, or featured content.
 * 
 * @example
 * ```tsx
 * <PromoBanner
 *   title="Special Offer!"
 *   subtitle="Get 50% off on all premium features"
 *   ctaText="Claim Now"
 *   variant="gradient"
 *   accentColor="pink"
 * />
 * ```
 */
const PromoBanner: React.FC<PromoBannerProps> = ({
  title = 'Special Offer!',
  subtitle = 'Get 50% off on all premium features',
  ctaText = 'Learn More',
  variant = 'gradient',
  accentColor = 'pink',
  onCtaClick,
  dismissible = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // macOS pastel color palettes
  const colorVariants = {
    pink: {
      gradient: 'from-pink-400/30 via-rose-400/20 to-orange-400/20',
      solid: 'bg-pink-500/20',
      glass: 'bg-pink-500/10 backdrop-blur-xl',
      accent: 'text-pink-400',
      button: 'bg-pink-500 hover:bg-pink-600 text-white',
      icon: 'text-pink-400',
    },
    purple: {
      gradient: 'from-purple-400/30 via-violet-400/20 to-fuchsia-400/20',
      solid: 'bg-purple-500/20',
      glass: 'bg-purple-500/10 backdrop-blur-xl',
      accent: 'text-purple-400',
      button: 'bg-purple-500 hover:bg-purple-600 text-white',
      icon: 'text-purple-400',
    },
    blue: {
      gradient: 'from-blue-400/30 via-cyan-400/20 to-teal-400/20',
      solid: 'bg-blue-500/20',
      glass: 'bg-blue-500/10 backdrop-blur-xl',
      accent: 'text-blue-400',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
      icon: 'text-blue-400',
    },
    green: {
      gradient: 'from-green-400/30 via-emerald-400/20 to-teal-400/20',
      solid: 'bg-green-500/20',
      glass: 'bg-green-500/10 backdrop-blur-xl',
      accent: 'text-green-400',
      button: 'bg-green-500 hover:bg-green-600 text-white',
      icon: 'text-green-400',
    },
    orange: {
      gradient: 'from-orange-400/30 via-amber-400/20 to-yellow-400/20',
      solid: 'bg-orange-500/20',
      glass: 'bg-orange-500/10 backdrop-blur-xl',
      accent: 'text-orange-400',
      button: 'bg-orange-500 hover:bg-orange-600 text-white',
      icon: 'text-orange-400',
    },
  };

  const colors = colorVariants[accentColor];

  const baseStyles = `relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${className}`;

  const variantStyles = {
    gradient: `bg-gradient-to-r ${colors.gradient} border border-white/10`,
    solid: `${colors.solid} border border-white/10`,
    glass: `${colors.glass} border border-white/20 shadow-lg`,
  };

  const icons = [Sparkles, Gift, Star, Zap];
  const RandomIcon = icons[Math.floor(Math.random() * icons.length)];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`${baseStyles} ${variantStyles[variant]}`}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${colors.accent.replace('text-', 'bg-')} opacity-30`}
              initial={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 200 - 100,
                scale: 0 
              }}
              animate={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 200 - 100,
                scale: [0, 1, 0],
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-start gap-4">
          {/* Icon with glow effect */}
          <motion.div
            className={`p-3 rounded-xl ${colors.solid}`}
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <RandomIcon className={`w-6 h-6 ${colors.icon}`} />
          </motion.div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <motion.h3 
              className="text-white font-semibold text-lg mb-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-white/70 text-sm mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {subtitle}
            </motion.p>

            {/* CTA Button */}
            <motion.button
              onClick={onCtaClick}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${colors.button}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <motion.button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ rotate: 90 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Bottom accent line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.solid.replace('/20', '/50')}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBanner;

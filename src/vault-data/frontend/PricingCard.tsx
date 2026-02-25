'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

/**
 * PricingCard Component
 * 
 * A beautiful pricing card component with glassmorphism effect
 * and smooth animations. Perfect for SaaS pricing pages.
 * 
 * @example
 * ```tsx
 * <PricingCard
 *   title="Pro"
 *   price="$29"
 *   period="/month"
 *   description="Perfect for small teams"
 *   features={[
 *     "Up to 10 team members",
 *     "10GB storage",
 *     "Priority support",
 *     "Analytics dashboard"
 *   ]}
 *   isPopular={true}
 * />
 * ```
 */
const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period = '',
  description = '',
  features = [],
  isPopular = false,
  ctaText = 'Get Started',
  onCtaClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-3xl p-8 transition-all duration-300 ${
        isPopular
          ? 'bg-gradient-to-b from-spio-accent/20 to-spio-accent/5 border-2 border-spio-accent shadow-lg shadow-spio-accent/20'
          : 'glass-heavy border border-white/10 hover:border-white/20'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-spio-accent text-black text-xs font-bold px-4 py-1.5 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-white/90 font-semibold text-lg mb-2">{title}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-white">{price}</span>
          {period && (
            <span className="text-white/50 text-sm">{period}</span>
          )}
        </div>
        {description && (
          <p className="text-white/50 text-sm mt-3">{description}</p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <Check className="w-5 h-5 text-spio-accent flex-shrink-0 mt-0.5" />
            <span className="text-white/80 text-sm">{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCtaClick}
        className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
          isPopular
            ? 'bg-spio-accent text-black hover:bg-spio-accent/90 shadow-lg shadow-spio-accent/30'
            : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
        }`}
      >
        {ctaText}
      </motion.button>
    </motion.div>
  );
};

export default PricingCard;

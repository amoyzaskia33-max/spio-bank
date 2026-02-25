---
title: Skeleton Loader
description: Animated loading skeleton for content placeholders
category: Frontend
---
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonLoader({
  variant = 'text',
  width = '100%',
  height,
  className = '',
}: SkeletonLoaderProps) {
  const baseStyles = 'bg-white/5 overflow-hidden';
  
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const heightValue = height || (variant === 'circular' ? width : undefined);

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width, height: heightValue }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  contentClassName?: string;
  delay?: number;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  className = '',
  contentClassName = '',
  delay = 300
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 40;
      
      let x = 0;
      let y = 0;
      
      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2 - tooltipWidth / 2;
          y = rect.top - tooltipHeight - 8;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2 - tooltipWidth / 2;
          y = rect.bottom + 8;
          break;
        case 'left':
          x = rect.left - tooltipWidth - 8;
          y = rect.top + rect.height / 2 - tooltipHeight / 2;
          break;
        case 'right':
          x = rect.right + 8;
          y = rect.top + rect.height / 2 - tooltipHeight / 2;
          break;
      }
      
      // Ensure tooltip stays within viewport
      x = Math.max(10, Math.min(x, window.innerWidth - tooltipWidth - 10));
      y = Math.max(10, Math.min(y, window.innerHeight - tooltipHeight - 10));
      
      setCoords({ x, y });
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const tooltipClasses = cn(
    'fixed z-50 px-3 py-2 text-sm rounded-md shadow-md bg-gray-800 text-white max-w-xs',
    {
      'opacity-0 invisible': !isVisible,
      'opacity-100 visible': isVisible,
    },
    contentClassName
  );

  return (
    <div 
      ref={triggerRef}
      className={cn('inline-block', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {mounted && isVisible && createPortal(
        <div 
          ref={tooltipRef}
          className={tooltipClasses}
          style={{ 
            left: `${coords.x}px`, 
            top: `${coords.y}px`,
            transition: 'opacity 150ms ease-in-out',
          }}
          role="tooltip"
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
}

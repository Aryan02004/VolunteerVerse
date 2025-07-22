"use client";

import { useEffect } from 'react';

interface PerformanceMonitorProps {
  routeName: string;
}

export default function PerformanceMonitor({ routeName }: PerformanceMonitorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log page load performance
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log(`🚀 ${routeName} Performance:`, {
              loadTime: `${entry.duration.toFixed(2)}ms`,
              domContentLoaded: `${(entry as PerformanceNavigationTiming).domContentLoadedEventEnd.toFixed(2)}ms`,
              firstPaint: 'Measuring...'
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      // Measure largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`📊 ${routeName} LCP: ${entry.startTime.toFixed(2)}ms`);
        });
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
      };
    }
  }, [routeName]);

  return null;
}

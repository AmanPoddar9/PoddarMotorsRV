'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics ID - Replace with your actual GA4 measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Page view tracking
export const pageview = (url) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for Poddar Motors
export const trackCarView = (carDetails) => {
  event({
    action: 'view_car',
    category: 'Cars',
    label: `${carDetails.make} ${carDetails.model}`,
    value: carDetails.price,
  });
};

export const trackLeadSubmission = (leadType) => {
  event({
    action: 'lead_submit',
    category: 'Conversions',
    label: leadType,
  });
};

export const trackPhoneClick = () => {
  event({
    action: 'click_phone',
    category: 'Contact',
    label: 'Phone Number',
  });
};

export const trackWhatsAppClick = () => {
  event({
    action: 'click_whatsapp',
    category: 'Contact',
    label: 'WhatsApp',
  });
};

export const trackSearch = (searchQuery) => {
  event({
    action: 'search',
    category: 'Engagement',
    label: searchQuery,
  });
};

export const trackFilterUse = (filterType, filterValue) => {
  event({
    action: 'use_filter',
    category: 'Engagement',
    label: `${filterType}: ${filterValue}`,
  });
};

export const trackBlogRead = (blogTitle, category) => {
  event({
    action: 'read_blog',
    category: 'Content',
    label: `${category} - ${blogTitle}`,
  });
};

export const trackSocialShare = (platform, contentType) => {
  event({
    action: 'share',
    category: 'Social',
    label: `${platform} - ${contentType}`,
  });
};

// Analytics component for route tracking
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

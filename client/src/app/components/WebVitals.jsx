import { useReportWebVitals } from 'next/web-vitals'
 
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to Google Analytics via gtag
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  })
  
  return null
}

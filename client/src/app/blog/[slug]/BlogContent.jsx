'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function BlogContent({ content, shareUrl, shareTitle }) {
  const [activeSection, setActiveSection] = useState('');
  const [showTOC, setShowTOC] = useState(false);
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);

  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Extract headings from content for table of contents
  useEffect(() => {
    if (contentRef.current) {
      const headingElements = contentRef.current.querySelectorAll('h2, h3');
      const headingData = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent,
          level: heading.tagName.toLowerCase()
        };
      });
      setHeadings(headingData);
      setShowTOC(headingData.length > 2);
    }
  }, [content]);

  // Track active section while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-custom-accent to-yellow-400 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table of Contents - Desktop Sidebar */}
        {showTOC && (
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <div className="glass-dark rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-custom-accent rounded-full" />
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {headings.map(({ id, text, level }) => (
                    <button
                      key={id}
                      onClick={() => scrollToHeading(id)}
                      className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
                        level === 'h3' ? 'pl-6 text-xs' : ''
                      } ${
                        activeSection === id
                          ? 'bg-custom-accent/20 text-custom-accent font-semibold border-l-2 border-custom-accent'
                          : 'text-custom-platinum hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className={showTOC ? 'lg:col-span-9' : 'lg:col-span-12'}>
          {/* Mobile TOC Dropdown */}
          {showTOC && (
            <details className="lg:hidden mb-8 glass-dark rounded-2xl overflow-hidden border border-white/10">
              <summary className="p-4 cursor-pointer font-bold text-white flex items-center justify-between hover:bg-white/5 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-1 h-5 bg-custom-accent rounded-full" />
                  Table of Contents
                </span>
                <span className="text-custom-accent">▼</span>
              </summary>
              <nav className="p-4 pt-0 space-y-2 max-h-64 overflow-y-auto">
                {headings.map(({ id, text, level }) => (
                  <button
                    key={id}
                    onClick={() => scrollToHeading(id)}
                    className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
                      level === 'h3' ? 'pl-6 text-xs' : ''
                    } ${
                      activeSection === id
                        ? 'bg-custom-accent/20 text-custom-accent font-semibold'
                        : 'text-custom-platinum hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </nav>
            </details>
          )}

          {/* Blog Content */}
          <div 
            ref={contentRef}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:text-white
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-custom-seasalt prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-custom-accent prose-a:no-underline hover:prose-a:text-yellow-400 prose-a:transition-colors
              prose-strong:text-white prose-strong:font-bold
              prose-ul:text-custom-seasalt prose-ul:my-6
              prose-ol:text-custom-seasalt prose-ol:my-6
              prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-custom-accent prose-blockquote:bg-white/5 
              prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:my-6
              prose-blockquote:text-custom-seasalt prose-blockquote:italic
              prose-code:text-custom-accent prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-custom-jet prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8 prose-img:border prose-img:border-white/10
              prose-hr:border-white/10 prose-hr:my-8
              prose-table:border-collapse prose-table:w-full prose-table:my-6
              prose-th:bg-custom-accent/20 prose-th:text-white prose-th:font-bold prose-th:p-3 prose-th:border prose-th:border-white/10
              prose-td:p-3 prose-td:border prose-td:border-white/10 prose-td:text-custom-seasalt
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Call to Action */}
          <div className="mt-12 glass-dark rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-custom-accent/10 to-yellow-400/10">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Looking for Your Perfect Car?
            </h3>
            <p className="text-custom-seasalt mb-6">
              Browse our extensive collection of quality certified used cars or get in touch with our experts.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/buy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                Browse Cars
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 glass-dark border border-white/20 text-white font-semibold rounded-xl hover:border-custom-accent transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

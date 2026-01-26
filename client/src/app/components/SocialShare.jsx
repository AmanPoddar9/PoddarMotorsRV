'use client';

import React, { useState } from 'react';
import { 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaLink 
} from 'react-icons/fa';
import { IoCheckmark } from 'react-icons/io5';

const SocialShare = ({ url, title, className = '' }) => {
  const [copied, setCopied] = useState(false);
  
  // detailedUrl should be absolute
  const shareUrl = typeof window !== 'undefined' ? (url.startsWith('http') ? url : `${window.location.origin}${url}`) : url;
  const shareText = encodeURIComponent(title);
  const shareLink = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: `https://api.whatsapp.com/send?text=${shareText}%20${shareLink}`,
      color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
      bg: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20'
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
      color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
      bg: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareLink}`,
      color: 'hover:bg-black hover:text-white hover:border-black',
      bg: 'bg-black/10 text-black border-black/20 dark:bg-white/10 dark:text-white dark:border-white/20'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareLink}&title=${shareText}`,
      color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
      bg: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20'
    }
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-semibold text-custom-platinum mr-2 hidden md:inline-block">Share:</span>
      
      {shareLinks.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
          className={`
            p-2.5 rounded-full border transition-all duration-300 transform hover:-translate-y-1
            flex items-center justify-center
            ${platform.bg}
            ${platform.color}
          `}
        >
          <platform.icon className="text-lg" />
        </a>
      ))}

      <button
        onClick={handleCopy}
        aria-label="Copy Link"
        className={`
          p-2.5 rounded-full border transition-all duration-300 transform hover:-translate-y-1
          flex items-center justify-center
          ${copied 
            ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white' 
            : 'bg-custom-jet/50 text-custom-platinum border-white/10 hover:bg-custom-accent hover:text-custom-black hover:border-custom-accent'
          }
        `}
      >
        {copied ? <IoCheckmark className="text-lg" /> : <FaLink className="text-lg" />}
      </button>
    </div>
  );
};

export default SocialShare;

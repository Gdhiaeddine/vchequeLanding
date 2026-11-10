'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Linkedin, Facebook } from 'lucide-react';

interface ArticleShareBarProps {
  title: string;
  slug: string;
}

export default function ArticleShareBar({ title, slug }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://vcheque.com/blog/${slug}`;
  };

  const handleCopy = async () => {
    try {
      const url = getArticleUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignored
    }
  };

  const shareWhatsApp = () => {
    const url = getArticleUrl();
    const text = `${title} - ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const shareLinkedIn = () => {
    const url = getArticleUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareFacebook = () => {
    const url = getArticleUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="article-share-bar">
      <div className="share-label-group">
        <Share2 size={16} className="text-[#B99A5A]" />
        <span>Partager cet article :</span>
      </div>

      <div className="share-buttons-group">
        <button
          type="button"
          onClick={shareWhatsApp}
          className="btn-share btn-share-whatsapp"
          title="Partager sur WhatsApp"
          aria-label="Partager sur WhatsApp"
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={shareLinkedIn}
          className="btn-share btn-share-linkedin"
          title="Partager sur LinkedIn"
          aria-label="Partager sur LinkedIn"
        >
          <Linkedin size={15} />
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          onClick={shareFacebook}
          className="btn-share btn-share-facebook"
          title="Partager sur Facebook"
          aria-label="Partager sur Facebook"
        >
          <Facebook size={15} />
          <span>Facebook</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className={`btn-share btn-share-copy ${copied ? 'copied' : ''}`}
          title="Copier le lien"
          aria-label="Copier le lien"
        >
          {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
          <span>{copied ? 'Lien copié !' : 'Copier le lien'}</span>
        </button>
      </div>
    </div>
  );
}

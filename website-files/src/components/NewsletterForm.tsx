'use client';

import { useState, FormEvent } from 'react';

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !gdprConsent) {
      setStatus('error');
      setMessage('Please enter your email and agree to receive updates.');
      return;
    }

    setStatus('loading');

    // Mailchimp JSONP endpoint for client-side submission
    const MAILCHIMP_URL = 'https://cvaneastmidlands.us2.list-manage.com/subscribe/post-json';
    const u = '4dc5179fc1569c0e4d4c013ba';
    const id = '294a31719b';

    // Build URL with parameters
    const params = new URLSearchParams({
      u,
      id,
      EMAIL: email,
      'gdpr[373]': 'Y',
      // Honeypot field (should be empty)
      [`b_${u}_${id}`]: '',
    });

    try {
      // Use JSONP approach via script tag to bypass CORS
      const callbackName = `mailchimpCallback_${Date.now()}`;

      const promise = new Promise<{ result: string; msg: string }>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 10000);

        (window as unknown as Record<string, unknown>)[callbackName] = (data: { result: string; msg: string }) => {
          clearTimeout(timeout);
          delete (window as unknown as Record<string, unknown>)[callbackName];
          document.body.removeChild(script);
          resolve(data);
        };

        const script = document.createElement('script');
        script.src = `${MAILCHIMP_URL}?${params.toString()}&c=${callbackName}`;
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Network error'));
        };
        document.body.appendChild(script);
      });

      const data = await promise;

      if (data.result === 'success') {
        setStatus('success');
        setMessage('Thanks for subscribing!');
        setEmail('');
        setGdprConsent(false);
      } else {
        setStatus('error');
        // Clean up Mailchimp's HTML in error messages
        const cleanMsg = data.msg.replace(/<[^>]*>/g, '').replace(/^[0-9]+ - /, '');
        setMessage(cleanMsg || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`${className}`}>
        <p className="text-lg font-semibold text-cvan-green">Thanks for subscribing!</p>
        <p className="text-sm text-white/80 mt-1">Check your inbox for a confirmation email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 text-black bg-white border-2 border-transparent focus:border-cvan-green focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-cvan-green text-black font-semibold hover:bg-cvan-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>

      <label className="flex items-start gap-3 mt-3 cursor-pointer">
        <input
          type="checkbox"
          checked={gdprConsent}
          onChange={(e) => setGdprConsent(e.target.checked)}
          className="mt-1 w-4 h-4 accent-cvan-green"
          required
        />
        <span className="text-sm text-white/80">
          I agree to receive email updates from CVAN East Midlands
        </span>
      </label>

      {status === 'error' && message && (
        <p className="mt-3 text-sm text-cvan-orange">{message}</p>
      )}
    </form>
  );
}

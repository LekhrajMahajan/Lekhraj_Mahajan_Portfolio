import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import {
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  Send,
  Check,
  Copy,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { contactData } from '../../data/contact';
import './contact.css';

export interface ContactProps {
  id?: string;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const Contact: React.FC<ContactProps> = ({ id = 'contact' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const botcheckRef = useRef<HTMLInputElement>(null);
  const lastSubmitTimeRef = useRef<number>(0);

  // GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Reveal Section Header with masked line reveal
      if (headerRef.current) {
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        const lines = headerRef.current.querySelectorAll('.contact-title-line');
        const eyebrow = headerRef.current.querySelector('.contact-eyebrow');
        const desc = headerRef.current.querySelector('.contact-desc');

        if (eyebrow) {
          headerTl.fromTo(
            eyebrow,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }
          );
        }

        if (lines && lines.length > 0) {
          headerTl.fromTo(
            Array.from(lines),
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              stagger: 0.12,
              duration: 0.8,
              ease: 'power3.out',
              immediateRender: false,
            },
            '-=0.3'
          );
        }

        if (desc) {
          headerTl.fromTo(
            desc,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', immediateRender: false },
            '-=0.35'
          );
        }
      }

      // Reveal Form and Contact Info
      const elementsToAnimate = [formRef.current, infoRef.current].filter(Boolean);
      if (elementsToAnimate.length > 0) {
        gsap.fromTo(
          elementsToAnimate,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submissionStatus !== 'idle') {
      setSubmissionStatus('idle');
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Rate limiting cooldown to prevent form spam and quota exhaustion
    const now = Date.now();
    const COOLDOWN_MS = 20000;
    if (now - lastSubmitTimeRef.current < COOLDOWN_MS) {
      setErrors((prev) => ({
        ...prev,
        message: 'Please wait a moment before sending another message.',
      }));
      return;
    }

    // Silent honeypot check against automated bots
    if (botcheckRef.current?.checked) {
      setSubmissionStatus('success');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');

    // Fallback mailto URL to launch default mail client if Web3Forms fails or is unconfigured
    const mailtoSubject = encodeURIComponent(`[Portfolio] ${formData.subject.trim()}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
    );
    const mailtoUrl = `mailto:${contactData.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!web3formsKey) {
      try {
        window.location.href = mailtoUrl;
      } catch {
        // Ignore navigation cancellation
      }
      setIsSubmitting(false);
      setSubmissionStatus('error');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: `[Portfolio Contact] ${formData.subject.trim()}`,
          message: formData.message.trim(),
          from_name: `${formData.name.trim()} (Portfolio)`,
          reply_to: formData.email.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        lastSubmitTimeRef.current = Date.now();
        setSubmissionStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch {
      try {
        window.location.href = mailtoUrl;
      } catch {
        // Ignore navigation cancellation
      }
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full pt-4 sm:pt-6 lg:pt-8 pb-16 sm:pb-20 lg:pb-24 bg-topo-pattern text-[#161616] overflow-hidden"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Eyebrow, Heading, and Supporting Text with Masked Reveal */}
        <div
          ref={headerRef}
          className="mb-12 sm:mb-16 border-b border-[#161616]/12 pb-8 sm:pb-12"
        >
          <div className="overflow-hidden mb-3">
            <span className="contact-eyebrow font-['Poppins'] text-[#bf4a1a] font-semibold text-xs sm:text-sm tracking-widest uppercase inline-block">
              {contactData.eyebrow}
            </span>
          </div>
          <h2
            id="contact-heading"
            className="font-['Big_Shoulders_Display',sans-serif] text-[#161616] font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.92]"
          >
            <span className="block overflow-hidden pb-1">
              <span className="contact-title-line inline-block will-change-transform">
                {contactData.headlineLine1}
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="contact-title-line inline-block will-change-transform text-[#bf4a1a]">
                {contactData.headlineLine2}
              </span>
            </span>
          </h2>
          <p className="contact-desc mt-4 font-['Poppins'] text-sm sm:text-base text-[#161616]/75 max-w-2xl leading-relaxed">
            {contactData.supportingText}
          </p>
        </div>

        {/* Main Content Layout: Form (Left) & Contact Details (Right) */}
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14 xl:gap-20">
          {/* Left Column: Accessible Editorial Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="w-full lg:w-[58%] xl:w-[60%] flex flex-col gap-5 sm:gap-6"
            aria-label="Contact inquiry form"
          >
            {/* Honeypot field for bot suppression */}
            <input
              ref={botcheckRef}
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            {/* Field 01: Full Name */}
            <div
              data-no-cursor="true"
              className={`contact-field-wrap group relative rounded-2xl border bg-white/60 p-4 sm:p-5 backdrop-blur-xs transition-all duration-300 ${
                errors.name
                  ? 'border-red-500/70 bg-red-500/5'
                  : 'border-[#161616]/12 focus-within:border-[#bf4a1a] focus-within:shadow-[0_8px_30px_rgba(191,74,26,0.08)]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-['Poppins'] text-xs font-bold text-[#bf4a1a]">
                  01
                </span>
                <label
                  htmlFor="contact-name"
                  className="font-['Poppins'] text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#161616]/85"
                >
                  Full Name <span className="text-[#bf4a1a]">*</span>
                </label>
              </div>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'error-name' : undefined}
                className="w-full bg-transparent font-['Poppins'] text-sm sm:text-base text-[#161616] placeholder-[#161616]/35 outline-none pl-7"
              />
              {errors.name && (
                <p
                  id="error-name"
                  role="alert"
                  className="mt-2 flex items-center gap-1.5 font-['Poppins'] text-xs font-medium text-red-600 pl-7"
                >
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Field 02: Email Address */}
            <div
              data-no-cursor="true"
              className={`contact-field-wrap group relative rounded-2xl border bg-white/60 p-4 sm:p-5 backdrop-blur-xs transition-all duration-300 ${
                errors.email
                  ? 'border-red-500/70 bg-red-500/5'
                  : 'border-[#161616]/12 focus-within:border-[#bf4a1a] focus-within:shadow-[0_8px_30px_rgba(191,74,26,0.08)]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-['Poppins'] text-xs font-bold text-[#bf4a1a]">
                  02
                </span>
                <label
                  htmlFor="contact-email"
                  className="font-['Poppins'] text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#161616]/85"
                >
                  Email Address <span className="text-[#bf4a1a]">*</span>
                </label>
              </div>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'error-email' : undefined}
                className="w-full bg-transparent font-['Poppins'] text-sm sm:text-base text-[#161616] placeholder-[#161616]/35 outline-none pl-7"
              />
              {errors.email && (
                <p
                  id="error-email"
                  role="alert"
                  className="mt-2 flex items-center gap-1.5 font-['Poppins'] text-xs font-medium text-red-600 pl-7"
                >
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Field 03: Subject (Proceeds directly to Subject, without inquiry dropdown) */}
            <div
              data-no-cursor="true"
              className={`contact-field-wrap group relative rounded-2xl border bg-white/60 p-4 sm:p-5 backdrop-blur-xs transition-all duration-300 ${
                errors.subject
                  ? 'border-red-500/70 bg-red-500/5'
                  : 'border-[#161616]/12 focus-within:border-[#bf4a1a] focus-within:shadow-[0_8px_30px_rgba(191,74,26,0.08)]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-['Poppins'] text-xs font-bold text-[#bf4a1a]">
                  03
                </span>
                <label
                  htmlFor="contact-subject"
                  className="font-['Poppins'] text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#161616]/85"
                >
                  Subject <span className="text-[#bf4a1a]">*</span>
                </label>
              </div>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer Role / Web App Project"
                aria-required="true"
                aria-invalid={errors.subject ? 'true' : 'false'}
                aria-describedby={errors.subject ? 'error-subject' : undefined}
                className="w-full bg-transparent font-['Poppins'] text-sm sm:text-base text-[#161616] placeholder-[#161616]/35 outline-none pl-7"
              />
              {errors.subject && (
                <p
                  id="error-subject"
                  role="alert"
                  className="mt-2 flex items-center gap-1.5 font-['Poppins'] text-xs font-medium text-red-600 pl-7"
                >
                  <AlertCircle size={13} />
                  <span>{errors.subject}</span>
                </p>
              )}
            </div>

            {/* Field 04: Message (Multiline Textarea) */}
            <div
              data-no-cursor="true"
              className={`contact-field-wrap group relative rounded-2xl border bg-white/60 p-4 sm:p-5 backdrop-blur-xs transition-all duration-300 ${
                errors.message
                  ? 'border-red-500/70 bg-red-500/5'
                  : 'border-[#161616]/12 focus-within:border-[#bf4a1a] focus-within:shadow-[0_8px_30px_rgba(191,74,26,0.08)]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-['Poppins'] text-xs font-bold text-[#bf4a1a]">
                  04
                </span>
                <label
                  htmlFor="contact-message"
                  className="font-['Poppins'] text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#161616]/85"
                >
                  Message <span className="text-[#bf4a1a]">*</span>
                </label>
              </div>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Hello Lekhraj, I would like to discuss an opportunity..."
                aria-required="true"
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'error-message' : undefined}
                className="w-full resize-y bg-transparent font-['Poppins'] text-sm sm:text-base text-[#161616] placeholder-[#161616]/35 outline-none pl-7 leading-relaxed"
              />
              {errors.message && (
                <p
                  id="error-message"
                  role="alert"
                  className="mt-2 flex items-center gap-1.5 font-['Poppins'] text-xs font-medium text-red-600 pl-7"
                >
                  <AlertCircle size={13} />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Submission Status Notice */}
            {submissionStatus === 'success' && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-emerald-600/20 bg-emerald-500/10 p-4 sm:p-5 font-['Poppins'] text-xs sm:text-sm text-emerald-900"
              >
                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-6 text-emerald-600 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      className="animate-checkmark-circle"
                    />
                    <path
                      d="M7.5 12.5l3 3 6.5-6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-checkmark-check"
                    />
                  </svg>
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-emerald-800">
                      Message Sent Successfully!
                    </h4>
                    <p className="mt-1 text-emerald-800/80 leading-relaxed">
                      Thank you for reaching out! Your message has been sent directly to{' '}
                      <span className="font-bold underline">
                        {contactData.email}
                      </span>
                      . I will review it and get back to you shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submissionStatus === 'error' && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 sm:p-5 font-['Poppins'] text-xs sm:text-sm text-red-900"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-red-800">
                      Submission Notice
                    </h4>
                    <p className="mt-1 text-red-800/80 leading-relaxed">
                      {!import.meta.env.VITE_WEB3FORMS_KEY ? (
                        <>
                          Web3Forms Access Key is not yet configured in your <code className="font-mono bg-red-200/60 px-1 py-0.5 rounded text-red-950 font-bold">.env</code> file. Please add your key to enable instant email delivery, or email me directly at{' '}
                          <span className="font-bold">{contactData.email}</span>.
                        </>
                      ) : (
                        <>
                          Could not complete transmission. Please click "COPY EMAIL" below or email me directly at{' '}
                          <span className="font-bold">{contactData.email}</span>.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons: Submit & Direct Email */}
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#161616] px-8 font-['Poppins'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#e5e3dc] transition-all duration-300 hover:bg-black hover:text-white shadow-sm disabled:opacity-60 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] hover-this"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-[#e5e3dc] border-t-transparent" />
                    <span>PREPARING...</span>
                  </>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#161616]/20 bg-white px-5 font-['Poppins'] text-xs font-bold uppercase tracking-wider text-[#161616] transition-all duration-300 hover:bg-[#161616] hover:text-[#e5e3dc] hover:border-[#161616] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] hover-this"
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-700">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column: Contact Details & Social Links */}
          <div
            ref={infoRef}
            className="w-full lg:w-[42%] xl:w-[40%] flex flex-col gap-6 sm:gap-8"
          >
            {/* Developer Status & Profile Card */}
            <div className="rounded-3xl border border-[#161616]/10 bg-white/60 p-6 sm:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(22,22,22,0.05)]">
              {/* Name & Role */}
              <h3 className="font-['Big_Shoulders_Display',sans-serif] text-3xl sm:text-4xl font-extrabold uppercase text-[#161616] tracking-tight">
                {contactData.name}
              </h3>
              <p className="font-['Poppins'] text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#bf4a1a] mt-1">
                {contactData.role}
              </p>

              {/* Direct Details List */}
              <div className="mt-8 flex flex-col gap-4 sm:gap-5 border-t border-[#161616]/8 pt-6">
                {/* Education / Degree */}
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-full bg-[#161616]/5 flex items-center justify-center shrink-0 text-[#bf4a1a]">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <span className="block font-['Poppins'] text-[11px] font-bold uppercase tracking-wider text-[#161616]/50">
                      Education & Degree
                    </span>
                    <span className="font-['Poppins'] text-xs sm:text-sm font-semibold text-[#161616] block">
                      {contactData.degree} ({contactData.cgpa})
                    </span>
                    <span className="font-['Poppins'] text-xs text-[#161616]/70 block mt-0.5">
                      {contactData.education} (2023 - 2026)
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-full bg-[#161616]/5 flex items-center justify-center shrink-0 text-[#bf4a1a]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block font-['Poppins'] text-[11px] font-bold uppercase tracking-wider text-[#161616]/50">
                      Location
                    </span>
                    <span className="font-['Poppins'] text-xs sm:text-sm font-medium text-[#161616]">
                      {contactData.location}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-full bg-[#161616]/5 flex items-center justify-center shrink-0 text-[#bf4a1a]">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block font-['Poppins'] text-[11px] font-bold uppercase tracking-wider text-[#161616]/50">
                      Phone Number
                    </span>
                    <a
                      href={`tel:${contactData.phone.replace(/\s+/g, '')}`}
                      data-no-cursor="true"
                      className="no-magnetic inline-block font-['Poppins'] text-xs sm:text-sm font-medium text-[#161616] hover:text-[#bf4a1a] transition-colors"
                      aria-label={`Call ${contactData.phone}`}
                    >
                      {contactData.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-full bg-[#161616]/5 flex items-center justify-center shrink-0 text-[#bf4a1a]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block font-['Poppins'] text-[11px] font-bold uppercase tracking-wider text-[#161616]/50">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${contactData.email}`}
                      data-no-cursor="true"
                      className="no-magnetic inline-block font-['Poppins'] text-xs sm:text-sm font-medium text-[#161616] hover:text-[#bf4a1a] transition-colors break-all"
                      aria-label={`Send email to ${contactData.email}`}
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Connect Buttons */}
              <div className="mt-8 border-t border-[#161616]/8 pt-6">
                <span className="block font-['Poppins'] text-[11px] font-bold uppercase tracking-wider text-[#161616]/50 mb-3.5">
                  Professional Networks
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {/* LinkedIn */}
                  <a
                    href={contactData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#161616]/15 bg-white px-4 py-2 font-['Poppins'] text-xs font-bold uppercase tracking-wide text-[#161616] transition-all hover:bg-[#161616] hover:text-[#e5e3dc] hover:border-[#161616] hover:scale-105 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] hover-this"
                    aria-label="Visit Lekhraj Mahajan's LinkedIn profile"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-3.5 fill-current shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LINKEDIN</span>
                    <ArrowUpRight size={13} className="opacity-60" />
                  </a>

                  {/* GitHub */}
                  <a
                    href={contactData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#161616]/15 bg-white px-4 py-2 font-['Poppins'] text-xs font-bold uppercase tracking-wide text-[#161616] transition-all hover:bg-[#161616] hover:text-[#e5e3dc] hover:border-[#161616] hover:scale-105 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] hover-this"
                    aria-label="Visit Lekhraj Mahajan's GitHub profile"
                  >
                    <svg
                      viewBox="0 0 98 96"
                      className="size-3.5 fill-current shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                      />
                    </svg>
                    <span>GITHUB</span>
                    <ArrowUpRight size={13} className="opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import Link from 'next/link';
import { FC, ReactNode, useEffect, useState } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type Feature = {
  id: string;
  emoji: ReactNode;
  title: string;
  description: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string; // URL
};

export type PricingTier = {
  id: string;
  name: string;
  price: ReactNode; // e.g. "$12/mo" or "Free"
  description?: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  highlighted?: boolean; // renders with primary accent
};

export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

export type Stat = {
  id: string;
  value: string;
  label: string;
};

export type HowItWorksStep = {
  id: string;
  step: number;
  title: string;
  description: string;
};

// ─────────────────────────────────────────────
// Section types (all optional in the top-level)
// ─────────────────────────────────────────────

export type FeaturesSection = {
  title?: ReactNode;
  items: Feature[];
};

export type TestimonialsSection = {
  title?: ReactNode;
  items: Testimonial[];
};

export type PricingSection = {
  title?: ReactNode;
  description?: ReactNode;
  tiers: PricingTier[];
};

export type FaqSection = {
  title?: ReactNode;
  items: FaqItem[];
};

export type StatsSection = {
  title?: ReactNode;
  items: Stat[];
};

export type HowItWorksSection = {
  title?: ReactNode;
  steps: HowItWorksStep[];
};

// ─────────────────────────────────────────────
// Top-level content shape (all sections optional)
// ─────────────────────────────────────────────

export type LandingContent = {
  navbar?: {
    title: ReactNode;
    buttonText: string;
    buttonHref: string;
  };
  hero?: {
    title: ReactNode;
    tagline?: ReactNode;
    buttonText: string;
    buttonHref: string;
  };
  stats?: StatsSection;
  features?: FeaturesSection;
  howItWorks?: HowItWorksSection;
  testimonials?: TestimonialsSection;
  pricing?: PricingSection;
  faq?: FaqSection;
  cta?: {
    title: ReactNode;
    description?: ReactNode;
    buttonText: string;
    buttonHref: string;
  };
  footer?: {
    name: string;
    year?: number;
    links?: { label: string; href: string }[];
  };
};

// ─────────────────────────────────────────────
// Floating ambient light (decorative)
// ─────────────────────────────────────────────

const FloatingLight: FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.35)_0%,rgba(250,204,21,0.15)_35%,transparent_70%)] blur-3xl" />
  </div>
);

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────

const Navbar: FC<NonNullable<LandingContent['navbar']>> = ({
  title,
  buttonText,
  buttonHref,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 z-50 w-full transition-all duration-300">
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between px-6 py-3 transition-all duration-300 ${
            scrolled
              ? 'border-base-300/40 bg-base-100/25 mt-3 rounded-full border shadow-xl backdrop-blur-lg'
              : 'bg-transparent'
          }`}>
          <div className="text-xl font-bold">{title}</div>
          <Link href={buttonHref} className="btn btn-primary btn-sm">
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────

const HeroSection: FC<NonNullable<LandingContent['hero']>> = ({
  title,
  tagline,
  buttonText,
  buttonHref,
}) => (
  <section className="flex h-screen w-screen items-center justify-center px-6 text-center">
    <div className="container mx-auto space-y-6">
      <h1 className="text-5xl font-bold md:text-6xl">{title}</h1>
      {tagline && <p className="text-lg opacity-70">{tagline}</p>}
      <Link href={buttonHref} className="btn btn-primary btn-lg">
        {buttonText}
      </Link>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────

const StatsSection: FC<StatsSection> = ({ title, items }) => (
  <section className="px-6 py-16">
    <div className="container mx-auto space-y-10">
      {title && <h2 className="text-center text-3xl font-bold">{title}</h2>}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {items.map((stat) => (
          <div
            key={`stat-${stat.id}`}
            className="flex flex-col items-center gap-1 text-center">
            <span className="text-primary text-4xl font-extrabold">
              {stat.value}
            </span>
            <span className="text-sm opacity-60">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────

const FeaturesSection: FC<FeaturesSection> = ({ title, items }) => (
  <section className="px-6 py-24">
    <div className="container mx-auto space-y-12">
      {title && <h2 className="text-center text-3xl font-bold">{title}</h2>}
      <div className="grid gap-12 md:grid-cols-3">
        {items.map((feature) => (
          <div key={`feature-${feature.id}`} className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-lg font-semibold">
              <span className="text-3xl">{feature.emoji}</span>
              <span>{feature.title}</span>
            </div>
            <p className="text-center opacity-70">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// How It Works
// ─────────────────────────────────────────────

const HowItWorksSection: FC<HowItWorksSection> = ({ title, steps }) => (
  <section className="px-6 py-24">
    <div className="container mx-auto space-y-12">
      {title && <h2 className="text-center text-3xl font-bold">{title}</h2>}
      <div className="grid gap-10 md:grid-cols-3">
        {steps.map((step) => (
          <div key={`step-${step.id}`} className="space-y-3">
            <div className="text-primary text-5xl font-extrabold opacity-30">
              {String(step.step).padStart(2, '0')}
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="opacity-70">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────

const TestimonialsSection: FC<TestimonialsSection> = ({ title, items }) => (
  <section className="px-6 py-24">
    <div className="container mx-auto space-y-12">
      {title && <h2 className="text-center text-3xl font-bold">{title}</h2>}
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((t) => (
          <div
            key={`testimonial-${t.id}`}
            className="bg-base-200/50 border-base-300/30 space-y-4 rounded-2xl border p-6">
            <p className="italic opacity-80">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              {t.avatar && (
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <div>
                <div className="text-sm font-semibold">{t.author}</div>
                {t.role && <div className="text-xs opacity-50">{t.role}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────

const PricingSection: FC<PricingSection> = ({ title, description, tiers }) => (
  <section className="px-6 py-24">
    <div className="container mx-auto space-y-12">
      {(title || description) && (
        <div className="space-y-3 text-center">
          {title && <h2 className="text-3xl font-bold">{title}</h2>}
          {description && <p className="opacity-70">{description}</p>}
        </div>
      )}
      <div className="grid items-start gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={`tier-${tier.id}`}
            className={`space-y-6 rounded-2xl border p-8 ${
              tier.highlighted
                ? 'border-primary bg-primary/10 shadow-primary/20 shadow-lg'
                : 'border-base-300/30 bg-base-200/30'
            }`}>
            <div className="space-y-1">
              <div className="text-sm font-semibold tracking-widest uppercase opacity-60">
                {tier.name}
              </div>
              <div className="text-4xl font-extrabold">{tier.price}</div>
              {tier.description && (
                <p className="text-sm opacity-60">{tier.description}</p>
              )}
            </div>
            <ul className="space-y-2">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="opacity-80">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={tier.buttonHref}
              className={`btn btn-sm w-full ${tier.highlighted ? 'btn-primary' : 'btn-outline'}`}>
              {tier.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────

const FaqSection: FC<FaqSection> = ({ title, items }) => (
  <section className="px-6 py-24">
    <div className="container mx-auto space-y-12">
      {title && <h2 className="text-center text-3xl font-bold">{title}</h2>}
      <div className="mx-auto max-w-2xl space-y-2">
        {items.map((item) => (
          <details
            key={`faq-${item.id}`}
            className="collapse-arrow border-base-300/30 bg-base-200/30 collapse rounded-xl border">
            <summary className="collapse-title cursor-pointer text-base font-semibold">
              {item.question}
            </summary>
            <div className="collapse-content">
              <p className="pt-2 text-sm opacity-70">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────

const CTASection: FC<NonNullable<LandingContent['cta']>> = ({
  title,
  description,
  buttonText,
  buttonHref,
}) => (
  <section className="px-6 py-24">
    <div className="container mx-auto space-y-6 text-center">
      <h2 className="text-4xl font-bold">{title}</h2>
      {description && <p className="opacity-70">{description}</p>}
      <Link href={buttonHref} className="btn btn-primary btn-lg">
        {buttonText}
      </Link>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────

const Footer: FC<NonNullable<LandingContent['footer']>> = ({
  name,
  year,
  links,
}) => (
  <footer className="px-6 py-8">
    <div className="container mx-auto flex flex-col items-center gap-3 text-center text-sm opacity-60">
      {links && links.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-opacity hover:opacity-100">
              {link.label}
            </Link>
          ))}
        </div>
      )}
      <span>
        © {year ?? new Date().getFullYear()} {name}. All rights reserved.
      </span>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// Landing Template
// ─────────────────────────────────────────────

export const LandingTemplate: FC<{ content: LandingContent }> = ({
  content,
}) => (
  <div className="text-base-content relative overflow-x-hidden">
    <FloatingLight />
    {content.navbar && <Navbar {...content.navbar} />}
    {content.hero && <HeroSection {...content.hero} />}
    {content.stats?.items.length && <StatsSection {...content.stats} />}
    {content.features?.items.length && (
      <FeaturesSection {...content.features} />
    )}
    {content.howItWorks?.steps.length && (
      <HowItWorksSection {...content.howItWorks} />
    )}
    {content.testimonials?.items.length && (
      <TestimonialsSection {...content.testimonials} />
    )}
    {content.pricing?.tiers.length && <PricingSection {...content.pricing} />}
    {content.faq?.items.length && <FaqSection {...content.faq} />}
    {content.cta && <CTASection {...content.cta} />}
    {content.footer && <Footer {...content.footer} />}
  </div>
);

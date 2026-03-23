import {
  LandingContent,
  LandingTemplate,
} from '@dot/templates/LandingTemplate';
import { NextPage } from 'next';

const content: LandingContent = {
  navbar: {
    title: 'AppName',
    buttonText: 'Open App',
    buttonHref: '/app',
  },
  hero: {
    title: 'Simple, Powerful, and Built for Speed',
    tagline:
      'A fast and intuitive app designed to help you get things done quickly and efficiently.',
    buttonText: 'Get Started',
    buttonHref: '/app',
  },
  features: {
    title: 'Features',
    items: [
      {
        id: 'fast',
        emoji: '⚡',
        title: 'Fast and Responsive',
        description:
          'Enjoy a smooth and responsive experience designed for speed and efficiency.',
      },
      {
        id: 'easy',
        emoji: '✨',
        title: 'Easy to Use',
        description:
          'Clean and intuitive design that lets you focus on what matters most.',
      },
      {
        id: 'powerful',
        emoji: '🧰',
        title: 'Powerful Tools',
        description:
          'Packed with useful features to help you work smarter and more effectively.',
      },
      {
        id: 'privacy',
        emoji: '🔒',
        title: 'Privacy First',
        description:
          'Your data stays in your control with privacy-focused design and secure processing.',
      },
      {
        id: 'accessible',
        emoji: '🌐',
        title: 'Accessible Anywhere',
        description:
          'Use the app from any modern browser on desktop, tablet, or mobile.',
      },
      {
        id: 'lightweight',
        emoji: '📦',
        title: 'Lightweight',
        description:
          'Minimal dependencies and optimized performance for a fast loading experience.',
      },
    ],
  },
  cta: {
    title: 'Ready to Get Started?',
    description:
      'Open the app and start using it instantly. No signup required.',
    buttonText: 'Open App',
    buttonHref: '/app',
  },
  footer: {
    name: 'AppName',
  },
};

const HomePage: NextPage = () => {
  return <LandingTemplate content={content} />;
};

export default HomePage;

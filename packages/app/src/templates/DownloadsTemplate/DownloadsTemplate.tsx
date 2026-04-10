'use client';

import { FC, useState } from 'react';

type CopiedKey = string | null;

const useCopy = (): [
  CopiedKey,
  (text: string, key: string) => Promise<void>,
] => {
  const [copied, setCopied] = useState<CopiedKey>(null);
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };
  return [copied, copy];
};

// ── DOWNLOAD BUTTON ──
const DownloadButton: FC<{
  href: string;
  label: string;
  primary?: boolean;
}> = ({ href, label, primary = false }) => (
  <a
    href={href}
    download
    className={`btn btn-sm ${primary ? 'btn-primary' : 'btn-ghost border-base-300 border'}`}>
    ↓ {label}
  </a>
);

// ── PLATFORM CARD ──
const PlatformCard: FC<{
  emoji: string;
  name: string;
  description: string;
  badge?: string;
  badgeClass?: string;
  children: React.ReactNode;
}> = ({
  emoji,
  name,
  description,
  badge,
  badgeClass = 'badge-neutral',
  children,
}) => (
  <div className="card bg-base-200 border-base-300 hover:border-primary/40 border transition-colors">
    <div className="card-body p-7">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl">
          {emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            {badge && (
              <span className={`badge badge-sm ${badgeClass}`}>{badge}</span>
            )}
          </div>
          <p className="text-base-content/40 text-xs">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  </div>
);

// ── CLI CARD ──
const CliCard: FC<{ cli: string }> = ({ cli }) => {
  const [copied, copy] = useCopy();
  return (
    <div className="card bg-base-200 border-base-300 hover:border-primary/40 border transition-colors">
      <div className="card-body p-7">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl">
            🖥️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">CLI</h3>
              <span className="badge badge-sm badge-info">Terminal</span>
            </div>
            <p className="text-base-content/40 text-xs">
              Install via package manager
            </p>
          </div>
        </div>
        {/* Command block */}
        <div className="bg-base-300 border-base-content/10 flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
          <code className="text-primary font-mono text-sm break-all">
            {cli}
          </code>
          <button
            onClick={() => copy(cli, 'cli')}
            className={`btn btn-xs shrink-0 ${copied === 'cli' ? 'btn-success' : 'btn-ghost border-base-300 border'}`}>
            {copied === 'cli' ? '✓' : '⎘'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DownloadsTemplate: FC<{
  cli: string;
  macos: { app: string; dmg: string };
  ubuntu: { appImage: string; deb: string };
  windows: { exe: string; msi: string };
}> = ({
  cli = '',
  macos = { app: '', dmg: '' },
  ubuntu = { appImage: '', deb: '' },
  windows = { exe: '', msi: '' },
}) => {
  return (
    <div
      className="bg-base-100 text-base-content relative flex min-h-screen flex-col items-center justify-center px-6 py-20 md:px-12"
      data-theme="luxury">
      {/* Ambient glow */}
      <div className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">
        {/* Header — mirrors Section label + Hero heading pattern */}
        <div className="mb-14 text-center">
          <p className="text-primary mb-7 text-xs tracking-[0.2em] uppercase">
            Latest release
          </p>
          <h1 className="mb-6 font-serif text-6xl leading-[1.05] font-black tracking-tight md:text-7xl">
            Download the app
          </h1>
          <p className="text-base-content/60 mx-auto max-w-md text-base leading-relaxed">
            Available for every platform. Pick your preferred install method and
            get started in seconds.
          </p>
        </div>

        {/* Platform cards — ordered: CLI, macOS, Ubuntu, Windows */}
        <div className="mb-10 flex flex-col gap-5">
          {/* CLI */}
          <CliCard cli={cli} />

          {/* macOS */}
          <PlatformCard
            emoji="🍎"
            name="macOS"
            description="macOS 12 Monterey or later · Apple Silicon & Intel"
            badge="Recommended"
            badgeClass="badge-success">
            <DownloadButton href={macos.app} label=".app bundle" primary />
            <DownloadButton href={macos.dmg} label=".dmg installer" />
          </PlatformCard>

          {/* Ubuntu */}
          <PlatformCard
            emoji="🐧"
            name="Ubuntu / Linux"
            description="Ubuntu 20.04+ · Debian-based distros · x86_64"
            badge="AppImage · deb"
            badgeClass="badge-neutral">
            <DownloadButton href={ubuntu.appImage} label=".AppImage" primary />
            <DownloadButton href={ubuntu.deb} label=".deb package" />
          </PlatformCard>

          {/* Windows */}
          <PlatformCard
            emoji="🪟"
            name="Windows"
            description="Windows 10 / 11 · x86_64"
            badge="exe · msi"
            badgeClass="badge-neutral">
            <DownloadButton href={windows.exe} label=".exe installer" primary />
            <DownloadButton href={windows.msi} label=".msi package" />
          </PlatformCard>
        </div>

        {/* Footer badges — mirrors Hero badge cluster */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="badge badge-success gap-1">● Stable</span>
          <span className="badge badge-info">Free</span>
          <span className="badge badge-neutral">MIT License</span>
          <span className="badge badge-ghost border-base-300 border">
            WCAG 2.1 AA
          </span>
        </div>
      </div>
    </div>
  );
};

DownloadsTemplate.displayName = 'DownloadsTemplate';

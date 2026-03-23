import { NextPage } from 'next';
import { useState, useEffect, useRef, useCallback } from 'react';

const DOT_SPACING = 20;
const LIGHT_RADIUS = 80;
const HOVER_FADE_MS = 700;
const TEXT_LINGER_MS = 4000;
const TEXT_FADE_MS = 900;
const RIPPLE_DURATION_MS = 500;

// Letter gap = 1 dot column between each character
const LETTER_GAP_PX = DOT_SPACING * 1; // one dot-unit of extra spacing

interface Dot {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  breatheSpeed: number;
  litAt: number | null;
  textLitAt: number | null;
}

function buildDots(w: number, h: number): Dot[] {
  const dots: Dot[] = [];
  const cols = Math.ceil(w / DOT_SPACING) + 1;
  const rows = Math.ceil(h / DOT_SPACING) + 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rnd = Math.random();
      dots.push({
        x: c * DOT_SPACING,
        y: r * DOT_SPACING,
        r: rnd < 0.1 ? 2.2 : rnd < 0.3 ? 1.6 : 1.1,
        baseAlpha: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        breatheSpeed: 0.3 + Math.random() * 0.5,
        litAt: null,
        textLitAt: null,
      });
    }
  }
  return dots;
}

/**
 * Draw each character individually with explicit spacing so we get
 * exactly one dot-column of gap between letters regardless of font kerning.
 * Returns total width drawn.
 */
function measureSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  letterGap: number
): number {
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    totalWidth += ctx.measureText(text[i]).width;
    if (i < text.length - 1) totalWidth += letterGap;
  }
  return totalWidth;
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  startX: number,
  y: number,
  letterGap: number
) {
  let x = startX;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, y);
    x += ctx.measureText(text[i]).width + letterGap;
  }
}

function getTextDotKeys(
  text: string,
  canvasW: number,
  canvasH: number
): Set<string> {
  const cols = Math.ceil(canvasW / DOT_SPACING) + 1;
  const rows = Math.ceil(canvasH / DOT_SPACING) + 1;

  const off = document.createElement('canvas');
  off.width = canvasW;
  off.height = canvasH;
  const ctx = off.getContext('2d')!;

  const maxLineWidth = canvasW * 0.82;
  let fontSize = Math.floor(canvasW * 0.11);

  const setFont = (size: number) => {
    ctx.font = `900 ${size}px 'Georgia', serif`;
  };

  setFont(fontSize);

  // Word-wrap — account for spaced width
  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const candidate = currentLine ? currentLine + ' ' + word : word;
    const w = measureSpacedText(ctx, candidate, LETTER_GAP_PX);
    if (w > maxLineWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Shrink font to fit height
  const maxTotalH = canvasH * 0.65;
  while (lines.length * fontSize * 1.35 > maxTotalH && fontSize > 10) {
    fontSize -= 2;
    setFont(fontSize);
  }

  // Draw
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = 'white';
  setFont(fontSize);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const lineH = fontSize * 1.35;
  const totalH = lines.length * lineH;
  const startY = (canvasH - totalH) / 2 + lineH / 2;

  for (let i = 0; i < lines.length; i++) {
    const lineWidth = measureSpacedText(ctx, lines[i], LETTER_GAP_PX);
    const startX = (canvasW - lineWidth) / 2;
    drawSpacedText(ctx, lines[i], startX, startY + i * lineH, LETTER_GAP_PX);
  }

  // Sample
  const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data = imageData.data;
  const halfStep = Math.floor(DOT_SPACING / 2) - 1;
  const step = 2;
  const keys = new Set<string>();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * DOT_SPACING;
      const cy = r * DOT_SPACING;
      let hit = false;
      outer: for (let dy = -halfStep; dy <= halfStep; dy += step) {
        for (let dx = -halfStep; dx <= halfStep; dx += step) {
          const px = Math.round(cx + dx);
          const py = Math.round(cy + dy);
          if (px < 0 || py < 0 || px >= canvasW || py >= canvasH) continue;
          const idx = (py * canvasW + px) * 4;
          if (data[idx + 3] > 40) {
            hit = true;
            break outer;
          }
        }
      }
      if (hit) keys.add(`${c},${r}`);
    }
  }

  return keys;
}

const AppPage: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const buildGrid = useCallback((w: number, h: number) => {
    dotsRef.current = buildDots(w, h);
  }, []);

  const lightTextDots = useCallback((text: string, w: number, h: number) => {
    const keys = getTextDotKeys(text, w, h);
    const now = performance.now();
    const cx = w / 2;
    const cy = h / 2;

    let maxDist = 1;
    dotsRef.current.forEach((dot) => {
      const c = Math.round(dot.x / DOT_SPACING);
      const r = Math.round(dot.y / DOT_SPACING);
      if (keys.has(`${c},${r}`)) {
        const d = Math.hypot(dot.x - cx, dot.y - cy);
        if (d > maxDist) maxDist = d;
      }
    });

    dotsRef.current.forEach((dot) => {
      const c = Math.round(dot.x / DOT_SPACING);
      const r = Math.round(dot.y / DOT_SPACING);
      if (keys.has(`${c},${r}`)) {
        const dist = Math.hypot(dot.x - cx, dot.y - cy);
        const stagger = (dist / maxDist) * RIPPLE_DURATION_MS;
        dot.textLitAt = now + stagger;
      } else {
        dot.textLitAt = null;
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildGrid(canvas.width, canvas.height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [buildGrid]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let last = 0;

    const draw = (ts: number) => {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current?.x ?? -9999;
      const my = mouseRef.current?.y ?? -9999;
      const now = performance.now();

      for (const dot of dotsRef.current) {
        const ddx = dot.x - mx;
        const ddy = dot.y - my;
        if (ddx * ddx + ddy * ddy < LIGHT_RADIUS * LIGHT_RADIUS)
          dot.litAt = now;

        let alpha = dot.baseAlpha;
        let radius = dot.r;
        ctx.shadowBlur = 0;

        if (dot.textLitAt !== null) {
          const age = now - dot.textLitAt;
          if (age < 0) {
            dot.phase += dot.breatheSpeed * dt;
            alpha =
              dot.baseAlpha +
              ((Math.sin(dot.phase) + 1) / 2) * dot.baseAlpha * 1.2;
          } else if (age < TEXT_LINGER_MS) {
            const rampT = Math.min(age / 120, 1);
            alpha = rampT;
            radius = dot.r * (1 + rampT * 0.7);
            ctx.shadowBlur = 10 * rampT;
            ctx.shadowColor = 'rgba(255,255,255,0.9)';
          } else if (age < TEXT_LINGER_MS + TEXT_FADE_MS) {
            const t = (age - TEXT_LINGER_MS) / TEXT_FADE_MS;
            alpha = 1 - t * (1 - dot.baseAlpha);
            radius = dot.r * (1.7 - t * 0.7);
            ctx.shadowBlur = 10 * (1 - t);
            ctx.shadowColor = 'rgba(255,255,255,0.9)';
          } else {
            dot.textLitAt = null;
          }
        } else if (dot.litAt !== null) {
          const age = now - dot.litAt;
          if (age < HOVER_FADE_MS) {
            const t = age / HOVER_FADE_MS;
            alpha = 1 - t * (1 - dot.baseAlpha);
            radius = dot.r * (1 + (1 - t) * 1.1);
            ctx.shadowBlur = 7 * (1 - t);
            ctx.shadowColor = 'rgba(255,255,255,0.6)';
          } else {
            dot.litAt = null;
            dot.phase += dot.breatheSpeed * dt;
            alpha =
              dot.baseAlpha +
              ((Math.sin(dot.phase) + 1) / 2) * dot.baseAlpha * 1.2;
          }
        } else {
          dot.phase += dot.breatheSpeed * dt;
          alpha =
            dot.baseAlpha +
            ((Math.sin(dot.phase) + 1) / 2) * dot.baseAlpha * 1.2;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha, 1).toFixed(3)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (!displayText) return;
    const period = RIPPLE_DURATION_MS + TEXT_LINGER_MS + TEXT_FADE_MS + 1200;
    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (canvas) lightTextDots(displayText, canvas.width, canvas.height);
    }, period);
    return () => clearInterval(interval);
  }, [displayText, lightTextDots]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = null;
  }, []);

  useEffect(() => {
    if (modalOpen) setTimeout(() => textareaRef.current?.focus(), 60);
  }, [modalOpen]);

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    setDisplayText(inputText);
    setModalOpen(false);
    const canvas = canvasRef.current!;
    lightTextDots(inputText, canvas.width, canvas.height);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
    if (e.key === 'Escape') setModalOpen(false);
  };

  return (
    <div className="bg-base-100 relative h-screen w-screen cursor-crosshair overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8">
        {!displayText && (
          <p className="font-mono text-xs tracking-widest text-white/20 uppercase">
            move your cursor · click to write
          </p>
        )}
        <button
          className="btn btn-outline btn-sm pointer-events-auto rounded-full border-white/20 font-mono text-xs tracking-widest text-white/40 uppercase hover:border-white/40 hover:bg-white/10 hover:text-white/80"
          onClick={() => setModalOpen(true)}>
          {displayText ? '✦ edit' : '✦ write something'}
        </button>
      </div>

      <dialog
        className={`modal modal-bottom sm:modal-middle ${modalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box bg-base-200/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          <h3 className="mb-5 font-serif text-2xl text-white/90">
            What should it say?
          </h3>

          <textarea
            ref={textareaRef}
            className="textarea w-full resize-none rounded-xl border border-white/10 bg-white/5 font-mono text-sm leading-relaxed text-white/80 placeholder-white/20 focus:border-white/30 focus:outline-none"
            rows={4}
            placeholder="Type anything…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <p className="mt-2 font-mono text-xs tracking-wider text-white/20">
            ⌘ + Enter to confirm · Esc to close
          </p>

          <div className="modal-action mt-5">
            <button
              className="btn btn-ghost btn-sm border border-white/10 font-mono text-xs tracking-wide text-white/30"
              onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-sm text-base-100 border-none bg-white font-mono text-xs tracking-wide hover:bg-white/85"
              onClick={handleSubmit}>
              Confirm
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AppPage;

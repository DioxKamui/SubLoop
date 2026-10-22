// ============================================================================
// generate-icons.mjs — Genera los íconos de SubLoop a partir de SVG
// ----------------------------------------------------------------------------
// Rasteriza un "loop" dorado (motivo de rotación) sobre el fondo espacial de la
// marca. Usa @resvg/resvg-js (la misma lib que FINA) para producir PNG sin
// necesitar herramientas externas de diseño.
//   Uso:  node scripts/generate-icons.mjs
// ============================================================================
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('assets/images');
const GOLD = '#F4B740';
const WHITE = '#FFFFFF';
const DARK = '#0B0E17';

// Trayectorias del "loop" (flecha circular tipo refresh), viewBox 24x24.
const PATHS = [
  'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
  'M21 3v5h-5',
  'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
  'M3 21v-5h5',
];

// Grupo SVG del loop (con capa opcional de "glow" detrás).
function loopGroup(color, strokeWidth, opacity = 1) {
  const inner = PATHS.map((d) => `<path d="${d}"/>`).join('');
  return `<g fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${opacity}">${inner}</g>`;
}

// Loop centrado y escalado dentro de un lienzo cuadrado de `size`.
function loopMark(size, color, scale, glow) {
  const layers = [];
  if (glow) layers.push(loopGroup(color, 3.4, 0.35));
  layers.push(loopGroup(color, 1.8, 1));
  const t = `translate(${size / 2} ${size / 2}) scale(${scale}) translate(-12 -12)`;
  return `<g transform="${t}">${layers.join('')}</g>`;
}

// Renderiza un SVG a PNG y lo guarda.
function renderSvg({ size, content, file, background = null, gradient = false }) {
  let defs = '';
  let bg = '';
  if (gradient) {
    defs = `<defs><radialGradient id="bg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#1B2440"/><stop offset="100%" stop-color="#0B0E17"/></radialGradient></defs>`;
    bg = `<rect width="${size}" height="${size}" fill="url(#bg)"/>`;
  } else if (background) {
    bg = `<rect width="${size}" height="${size}" fill="${background}"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${defs}${bg}${content}</svg>`;
  const png = new Resvg(svg).render().asPng();
  fs.writeFileSync(path.join(DIR, file), png);
  console.log(`✓ ${file}`);
}

// Ícono principal (launcher general): fondo con gradiente + loop dorado.
renderSvg({ size: 1024, content: loopMark(1024, GOLD, 25, true), gradient: true, file: 'icon.png' });

// Android adaptive: foreground transparente (loop dentro de la zona segura).
renderSvg({ size: 1024, content: loopMark(1024, GOLD, 22, true), file: 'android-icon-foreground.png' });

// Android adaptive: background sólido.
renderSvg({ size: 1024, content: '', background: DARK, file: 'android-icon-background.png' });

// Android adaptive: versión monocromática (para tema).
renderSvg({ size: 1024, content: loopMark(1024, WHITE, 22, false), file: 'android-icon-monochrome.png' });

// Favicon web.
renderSvg({ size: 48, content: loopMark(48, GOLD, 1.5, false), background: DARK, file: 'favicon.png' });

// Splash: loop dorado transparente (el fondo lo pone el `backgroundColor` del splash).
renderSvg({ size: 512, content: loopMark(512, GOLD, 10, false), file: 'splash-icon.png' });

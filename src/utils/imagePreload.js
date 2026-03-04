const imageCache = new Set();

export const isRenderableImageSrc = (src) =>
  typeof src === 'string' && src.trim().length > 0 && src.trim() !== '#';

export function preloadImage(src) {
  if (!isRenderableImageSrc(src)) return null;
  if (typeof window === 'undefined' || typeof Image === 'undefined') return null;
  if (imageCache.has(src)) return null;

  const img = new Image();
  img.decoding = 'async';
  img.src = src;

  const markReady = () => imageCache.add(src);
  img.onload = markReady;
  img.onerror = markReady;

  return img;
}

export function preloadImages(sources, options = {}) {
  const limit = Number.isFinite(options.limit) ? Math.max(0, options.limit) : Infinity;

  return (Array.isArray(sources) ? sources : [])
    .filter(isRenderableImageSrc)
    .slice(0, limit)
    .map((src) => preloadImage(src));
}

export function preloadAdjacentImages(sources, index, radius = 1) {
  const items = (Array.isArray(sources) ? sources : []).filter(isRenderableImageSrc);
  if (items.length <= 1) return [];

  const safeIndex = Number.isFinite(index) ? index : 0;
  const normalizedIndex = ((safeIndex % items.length) + items.length) % items.length;
  const neighbors = [];

  for (let offset = 1; offset <= radius; offset += 1) {
    neighbors.push(items[(normalizedIndex + offset) % items.length]);
    neighbors.push(items[(normalizedIndex - offset + items.length) % items.length]);
  }

  return preloadImages(neighbors);
}

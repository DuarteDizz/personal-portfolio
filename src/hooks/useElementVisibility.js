import { useEffect, useState } from 'react';

export default function useElementVisibility(
  ref,
  {
    threshold = 0.15,
    root = null,
    rootMargin = '0px',
    initialInView = false,
    once = false
  } = {}
) {
  const [isVisible, setIsVisible] = useState(initialInView);

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    let observer;

    observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting || entry.intersectionRatio > 0;
        setIsVisible(nextVisible);

        if (nextVisible && once) {
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once, ref, root, rootMargin, threshold]);

  return isVisible;
}

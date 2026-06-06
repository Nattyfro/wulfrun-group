import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export default function useOffSetTop(top?: number) {
  const [offsetTop, setOffSetTop] = useState(false);
  const isTop = top || 100;

  useEffect(() => {
    const handleScroll = () => {
      setOffSetTop(window.pageYOffset > isTop);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isTop]);

  return offsetTop;
}

// Usage
// const offset = useOffSetTop(100);

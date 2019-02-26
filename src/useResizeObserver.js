// Modified from: https://github.com/ZeeCoder/use-resize-observer

import { useEffect } from "react";

export default function(ref, handleResize) {
  useEffect(() => {
    const element = ref.current;
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, []);
}
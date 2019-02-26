// Modified from: https://github.com/varHarrie/use-dragging

import { useState, useEffect, useCallback } from "react";

function useDragging(ref, handlers = {}) {
  const [dragging, setDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    if (handlers.onDrag) {
      handlers.onDrag(e);
    }
  }, [ref.current]);

  const handleDragStop = useCallback((e) => {
    const current = ref.current;
    const { ownerDocument } = current;

    setDragging(false);

    ownerDocument.removeEventListener("mousemove", handleDrag);
    ownerDocument.removeEventListener("touchmove", handleDrag);
    ownerDocument.removeEventListener("mouseup", handleDragStop);
    ownerDocument.removeEventListener("touchend", handleDragStop);

    if (handlers.onDragStop) {
      handlers.onDragStop(e);
    }
  }, [ref.current]);

  const handleDragStart = useCallback((e) => {
    const current = ref.current;
    if (!current) return;

    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const { ownerDocument } = current;
    ownerDocument.getSelection().removeAllRanges();
    const { left, top } = current.getBoundingClientRect();

    if (handlers.onDragStart) {
      if (! handlers.onDragStart(e, {left: clientX - left, top: clientY - top })) return;
    }

    setDragging(true);

    ownerDocument.addEventListener("mousemove", handleDrag);
    ownerDocument.addEventListener("touchmove", handleDrag);
    ownerDocument.addEventListener("mouseup", handleDragStop);
    ownerDocument.addEventListener("touchend", handleDragStop);
  }, [ref.current]);

  useEffect(() => {
    const current = ref.current;
    if (!current) return;
    
    current.addEventListener("mousedown", handleDragStart);
    current.addEventListener("touchstart", handleDragStart);

    return () => {
      current.removeEventListener("mousedown", handleDragStart);
      current.removeEventListener("touchstart", handleDragStart);
    }
  }, [ref.current]);

  return dragging;
};

export default useDragging;

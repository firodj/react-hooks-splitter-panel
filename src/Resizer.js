import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import useDragging from "./useDragging";

function Resizer({ children, orientation, size, onChange }) {
  const ref = useRef(null);
  const dragShiftRef = useRef({left: 0, top: 0});

  const onDrag = useCallback(function(e) {
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const { left, top } = dragShiftRef.current;
    const newPos = { x: clientX - left + size/2, y: clientY - top + size/2 };
    onChange(newPos);
  });

  const onDragStart = useCallback(function(e, newDragShift) {
    dragShiftRef.current = newDragShift;
    return true;
  });

  const dragging = useDragging(ref, { onDrag, onDragStart });

  const style = {
    [orientation === "horizontal" ? "width" : "height"]: size,
    cursor: orientation === "horizontal" ? "ew-resize": "ns-resize",
  };

  return <div ref={ref} style={style} className={ dragging ? "bg-red-dark" : "bg-red"}>
    { children }
  </div>;
};

Resizer.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  onChange: PropTypes.func,
  size: PropTypes.number,
};

export default Resizer;

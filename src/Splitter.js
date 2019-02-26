import React, { useState, useEffect, useRef } from "react";
import Resizer from "./Resizer";
import PropTypes from "prop-types";
import useResizeObserver from "./useResizeObserver";

function Splitter({ children, orientation }) {
  const [ sizerPos, setSizerPos ] = useState(Array(children.length).fill(0));
  const parentEl = useRef(null);
  const splitterSize = 8;
  const minSize = (children.length - 1) * splitterSize;
  const initPos = useRef(true);

  function updateSizerPos(prevState) {
    var lastPos = parentEl.current[orientation === "horizontal" ? "clientWidth" : "clientHeight"];

    if (lastPos === prevState[prevState.length-1])
      return prevState;
      
    var newState = [...prevState];
    
    if (lastPos < minSize) lastPos = minSize;
    newState[prevState.length - 1] = lastPos;
    for (var i = newState.length-2; i>=0; i--) {
      if (newState[i] > (newState[i+1] - splitterSize/2))
        newState[i] = newState[i+1] - splitterSize/2;
    }

    return newState;
  }

  function initSizerPos() {
    const lastPos = parentEl.current[orientation === "horizontal" ? "clientWidth" : "clientHeight"];
    const nextPos = lastPos / children.length;
    const newSizerPos = Array(children.length).fill(0).map((e, i) => i + 1 < children.length ? nextPos * (i + 1) : lastPos);
    setSizerPos(newSizerPos);
  }

  function handleResize(elements) {
    for (var element of elements) {
      if (element.target !== parentEl.current) continue;
      if (initPos.current)
        initSizerPos();
      else
        setSizerPos(updateSizerPos);
    }
  }

  useResizeObserver(parentEl, handleResize);

  useEffect(() => {
    initSizerPos();
  }, []);

  function handleChange(e, i) {
    const current = parentEl.current;
    if (!current) return;
    const { left, top } = current.getBoundingClientRect();
    setSizerPos(prevState => {
      initPos.current = false;

      var newState = [...prevState];
      
      let pos = e[orientation === "horizontal" ? "x" : "y"];
      pos -= (orientation === "horizontal" ? left : top);

      if (i === 0) {
        if (pos < splitterSize/2) pos = splitterSize/2;
      } else {
        if (pos < newState[i-1] + splitterSize/2) pos = newState[i-1] + splitterSize/2;
      }
      if (pos > newState[i+1] - splitterSize/2)
        pos = newState[i+1] - splitterSize/2;
      newState[i] = pos;
      return newState;
    });
  };

  return <div ref={parentEl} className={"flex h-full w-full" + (orientation === "horizontal" ? " flex-row" : " flex-col")}>
    { children.map((child, i) => {
      const panelSize = (sizerPos[i] - (i > 0 ? sizerPos[i-1] : 0)) - splitterSize/2;
      const childs = [<div key={`panel-${i}`}
        style={{ [orientation === "horizontal" ? "width" : "height"]: panelSize }}
      >
        { child }
      </div>];

      if (i + 1 < children.length) {
        childs.push(<Resizer key={`splitter-${i}`} orientation={orientation} size={splitterSize} onChange={(e) => handleChange(e, i)} className="bg-red">
        </Resizer>);
      }

      return childs;
    }) }
  </div>;
};

Splitter.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  children: PropTypes.array.isRequired
};

export default Splitter;

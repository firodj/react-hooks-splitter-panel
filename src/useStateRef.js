// Taken from: https://blog.castiel.me/posts/2019-02-19-react-hooks-get-current-state-back-to-the-future/

import { useState, useEffect, useRef } from "react";

export default function useRefState(initialValue) {
  const [state, setState] = useState(initialValue)
  const stateRef = useRef(state)
  useEffect(
    () => { stateRef.current = state },
    [state]
  )
  return [state, stateRef, setState]
}

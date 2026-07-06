import { useCallback, useRef } from "react";

/**
 * Thin wrapper around a react-zoom-pan-pinch ref exposing simple
 * zoom-in/zoom-out/reset helpers for the interactive floor plan toolbar.
 */
export function useMapControls() {
  const transformRef = useRef(null);

  const zoomIn = useCallback(() => transformRef.current?.zoomIn(), []);
  const zoomOut = useCallback(() => transformRef.current?.zoomOut(), []);
  const resetView = useCallback(() => transformRef.current?.resetTransform(), []);
  const centerView = useCallback(() => transformRef.current?.centerView(), []);

  return { transformRef, zoomIn, zoomOut, resetView, centerView };
}

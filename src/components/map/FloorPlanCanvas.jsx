import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { StallShape } from "./StallShape";

/**
 * Renders a Hall's stall layout as a pan/zoom-able SVG. Coordinates come
 * straight from the backend's LayoutPosition (xCoord/yCoord/width/height),
 * so the SVG viewBox matches the Hall's own layout dimensions 1:1.
 *
 * Pass `editable` + `onMoveStall` to allow dragging stalls to new
 * coordinates (used by the owner's Blueprint Editor); panning is disabled
 * for the duration of a stall drag so the two gestures don't fight.
 */
export function FloorPlanCanvas({
  hallWidth,
  hallHeight,
  stalls = [],
  selectedStallId,
  onSelectStall,
  transformRef,
  editable = false,
  onMoveStall,
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <TransformWrapper
      ref={transformRef}
      minScale={0.5}
      maxScale={6}
      centerOnInit
      panning={{ disabled: dragging }}
    >
      <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
        <svg
          viewBox={`0 0 ${hallWidth} ${hallHeight}`}
          className="w-full h-full bg-[var(--muted)] rounded-md"
        >
          {stalls.map((stall) => (
            <StallShape
              key={stall.id}
              stall={stall}
              isSelected={stall.id === selectedStallId}
              onSelect={onSelectStall}
              editable={editable}
              onMoveEnd={onMoveStall}
              onDragStateChange={setDragging}
            />
          ))}
        </svg>
      </TransformComponent>
    </TransformWrapper>
  );
}

import { useRef, useState } from "react";

const STATUS_COLORS = {
  AVAILABLE: "#22c55e",
  BOOKED: "#ef4444",
  BLOCKED: "#9ca3af",
  PENDING: "#f59e0b",
};

/** Converts a pointer event's screen coordinates into the SVG's own user
 * space (the Hall's layout coordinate system), independent of whatever
 * CSS pan/zoom transform react-zoom-pan-pinch has applied to the wrapper. */
function toSvgPoint(svg, clientX, clientY) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

export function StallShape({
  stall,
  isSelected,
  onSelect,
  editable = false,
  onMoveEnd,
  onDragStateChange,
}) {
  const { xCoord, yCoord, width, height, name, status } = stall.layout
    ? { ...stall.layout, name: stall.name, status: stall.status }
    : { ...stall, name: stall.name, status: stall.status };

  const fill = STATUS_COLORS[status] ?? "#94a3b8";

  const [drag, setDrag] = useState(null); // { dx, dy } while actively dragging
  const dragState = useRef(null);

  const displayX = drag ? xCoord + drag.dx : xCoord;
  const displayY = drag ? yCoord + drag.dy : yCoord;

  function handlePointerDown(e) {
    if (!editable) return;
    e.stopPropagation();
    const svg = e.currentTarget.ownerSVGElement;
    const start = toSvgPoint(svg, e.clientX, e.clientY);
    dragState.current = { svg, startX: start.x, startY: start.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    onDragStateChange?.(true);
  }

  function handlePointerMove(e) {
    if (!editable || !dragState.current) return;
    const { svg, startX, startY } = dragState.current;
    const point = toSvgPoint(svg, e.clientX, e.clientY);
    const dx = point.x - startX;
    const dy = point.y - startY;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) dragState.current.moved = true;
    setDrag({ dx, dy });
  }

  function handlePointerUp(e) {
    if (!editable || !dragState.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    const { moved } = dragState.current;
    const finalDrag = drag;
    dragState.current = null;
    setDrag(null);
    onDragStateChange?.(false);

    if (moved && finalDrag) {
      const newX = Math.max(0, Math.round(xCoord + finalDrag.dx));
      const newY = Math.max(0, Math.round(yCoord + finalDrag.dy));
      onMoveEnd?.(stall, { xCoord: newX, yCoord: newY, width, height });
    } else {
      onSelect?.(stall);
    }
  }

  return (
    <g
      onClick={() => !editable && onSelect?.(stall)}
      className={editable ? "cursor-move" : "cursor-pointer"}
      role="button"
      tabIndex={0}
      aria-label={`Stall ${name}, status ${status}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <rect
        x={displayX}
        y={displayY}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={isSelected || drag ? 1 : 0.75}
        stroke={isSelected || drag ? "#171717" : "#ffffff"}
        strokeWidth={isSelected || drag ? 2 : 1}
        strokeDasharray={drag ? "4 2" : undefined}
        rx={2}
      />
      <text
        x={displayX + width / 2}
        y={displayY + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={Math.max(8, Math.min(width, height) / 3)}
        fill="#ffffff"
        pointerEvents="none"
      >
        {name}
      </text>
    </g>
  );
}

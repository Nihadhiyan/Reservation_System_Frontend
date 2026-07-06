import api, { unwrap } from "./api";

// LayoutPositionDto: { xCoord, yCoord, width, height }
export const layoutService = {
  updateStallCoordinates: (stallId, layoutPositionDto) =>
    api.put(`/layout/stall/${stallId}/coordinates`, layoutPositionDto).then(unwrap),
};

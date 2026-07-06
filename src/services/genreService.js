import api, { unwrap } from "./api";

export const genreService = {
  getAll: () => api.get("/genres").then(unwrap),
};

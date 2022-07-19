export const genLSKey = (id, rType) => `round/${id}/reactions:${rType}`;

export const genRoundPath = (id) => `rounds/${id}`;
export const genRoundURL = (id) =>
  `http://${window.location.host}/${genRoundPath(id)}`;

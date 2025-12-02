export const getCords = (coordenadas?: string) => {
  if (!coordenadas) return { latitude: 0, longitude: 0 };

  const [latitude, longitude] = coordenadas.split(",").map(Number);
  return { latitude, longitude };
};

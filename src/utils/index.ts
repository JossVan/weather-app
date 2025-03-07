export const formatTemperature = (temp: number) => {
  return parseInt((temp - 273.15).toString());
};

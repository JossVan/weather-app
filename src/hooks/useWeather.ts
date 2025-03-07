import axios from "axios";
import { SearchType } from "../types";
// import { z } from "zod";
import { object, string, number, InferOutput, parse } from "valibot";
import { useMemo, useState } from "react";
// const Weather = z.object({
//   name: z.string(),
//   main: z.object({
//     temp: z.number(),
//     temp_min: z.number(),
//     temp_max: z.number(),
//   }),
// });

// type Weather = z.infer<typeof Weather>;

const weatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_min: number(),
    temp_max: number(),
  }),
});

export type Weather = InferOutput<typeof weatherSchema>;
export default function useWeather() {
  const [weather, setWeather] = useState<Weather>({
    name: "",
    main: {
      temp: 0,
      temp_min: 0,
      temp_max: 0,
    },
  });
  //   function isWeatherResponse(weather: unknown): weather is Weather {
  //     return (
  //       Boolean(weather) &&
  //       typeof weather === "object" &&
  //       typeof (weather as Weather).name === "string" &&
  //       typeof (weather as Weather).main.temp === "number" &&
  //       typeof (weather as Weather).main.temp_min === "number" &&
  //       typeof (weather as Weather).main.temp_max === "number"
  //     );
  //   }
  const fetchWeather = async (search: SearchType) => {
    try {
      const appId = import.meta.env.VITE_API_KEY;
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

      const { data } = await axios(geoUrl);

      const { lat, lon } = data[0];

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      // Castear el type
      const { data: weatherResult } = await axios(weatherUrl);

      //   const result = isWeatherResponse(weatherResult);

      //   if (result) {
      //     console.log(weatherResult.main);
      //   }{
      //     console.log("Respuesta mal formada")
      //   }

      //Zod

      //   const result = Weather.safeParse(weatherResult);

      //   if (result.success) {
      //     console.log(result.data.name);
      //   } else {
      //     console.log("Respuesta mal formada");
      //   }

      // Valibot

      const result = parse(weatherSchema, weatherResult);

      setWeather(result);
    } catch (error) {
      console.log(error);
    }
  };
  const hasWeatherData = useMemo(() => weather.name, [weather]);
  return {
    weather,
    fetchWeather,
    hasWeatherData,
  };
}

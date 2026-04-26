const DEFAULT_MONTEVIDEO_COORDS = {
  lat: -34.9011,
  lon: -56.1645,
};

type WeatherApiRequest = {
  lat?: number;
  lon?: number;
};

type OpenWeatherCondition = {
  main?: string;
  description?: string;
  icon?: string;
};

type OneCallCurrent = {
  temp?: number;
  feels_like?: number;
  weather?: OpenWeatherCondition[];
  clouds?: number;
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
};

type OneCallHourly = {
  dt: number;
  temp?: number;
  feels_like?: number;
  weather?: OpenWeatherCondition[];
  clouds?: number;
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
};

type OneCallDaily = {
  temp?: {
    min?: number;
    max?: number;
  };
};

type OneCallResponse = {
  lat?: number;
  lon?: number;
  timezone?: string;
  current?: OneCallCurrent;
  hourly?: OneCallHourly[];
  daily?: OneCallDaily[];
};

type CurrentWeatherResponse = {
  name?: string;
  sys?: {
    country?: string;
  };
  main?: {
    temp?: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
  };
  weather?: OpenWeatherCondition[];
  clouds?: {
    all?: number;
  };
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
};

type ForecastEntry = {
  dt: number;
  main: {
    temp?: number;
    feels_like?: number;
  };
  weather?: OpenWeatherCondition[];
  clouds?: {
    all?: number;
  };
  rain?: {
    "3h"?: number;
  };
  snow?: {
    "3h"?: number;
  };
};

type ForecastResponse = {
  list?: ForecastEntry[];
  city?: {
    timezone?: number;
    name?: string;
    country?: string;
  };
};

type ReverseGeocodeEntry = {
  name?: string;
  country?: string;
};

export type WeatherApiResult = {
  city: string;
  country?: string;
  temperature: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  condition: string;
  hourly: Array<{
    time: string;
    temp: number;
    feels_like: number;
    condition: string;
    icon: string;
  }>;
  source: "onecall-3.0" | "current-and-forecast";
  coordinates: {
    lat: number;
    lon: number;
  };
};

function getCoordinates(body: WeatherApiRequest | null | undefined) {
  const lat =
    typeof body?.lat === "number" ? body.lat : DEFAULT_MONTEVIDEO_COORDS.lat;
  const lon =
    typeof body?.lon === "number" ? body.lon : DEFAULT_MONTEVIDEO_COORDS.lon;

  return { lat, lon };
}

function roundMetric(value: number | undefined) {
  return Math.round(typeof value === "number" ? value : 0);
}

function formatHour(timestamp: number, timeZone = "UTC") {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone,
  }).format(new Date(timestamp * 1000));
}

function selectCondition(input: {
  weather?: OpenWeatherCondition[];
  clouds?: number;
  rainVolume?: number;
  snowVolume?: number;
}) {
  if (typeof input.rainVolume === "number" && input.rainVolume > 0) {
    return input.weather?.[0]?.description ?? input.weather?.[0]?.main ?? "rain";
  }

  if (typeof input.snowVolume === "number" && input.snowVolume > 0) {
    return input.weather?.[0]?.description ?? input.weather?.[0]?.main ?? "snow";
  }

  if (typeof input.clouds === "number" && input.clouds >= 85) {
    return input.weather?.[0]?.description ?? "cloudy";
  }

  if (typeof input.clouds === "number" && input.clouds >= 35) {
    return input.weather?.[0]?.description ?? "partly cloudy";
  }

  return input.weather?.[0]?.description ?? input.weather?.[0]?.main ?? "clear";
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const data = (await response.json()) as T;

  return { response, data };
}

async function fetchReverseGeocode(
  lat: number,
  lon: number,
  key: string
): Promise<ReverseGeocodeEntry | null> {
  const reverseUrl =
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}` +
    `&limit=1&appid=${key}`;

  const { response, data } = await fetchJson<ReverseGeocodeEntry[]>(reverseUrl);

  if (!response.ok) {
    return null;
  }

  return data[0] ?? null;
}

function validateCoordinates(body: WeatherApiRequest | null | undefined) {
  if (!body) {
    return;
  }

  if (
    ("lat" in body && typeof body.lat !== "number") ||
    ("lon" in body && typeof body.lon !== "number")
  ) {
    throw new Error("INVALID_COORDINATES");
  }
}

function normalizeOneCallData(
  data: OneCallResponse,
  location: ReverseGeocodeEntry | null,
  lat: number,
  lon: number
): WeatherApiResult {
  const current = data.current;
  const hourly = data.hourly ?? [];
  const dailyToday = data.daily?.[0];

  if (
    !current ||
    typeof current.temp !== "number" ||
    typeof current.feels_like !== "number"
  ) {
    throw new Error("INVALID_ONECALL_PAYLOAD");
  }

  return {
    city: location?.name ?? "Montevideo",
    country: location?.country,
    temperature: roundMetric(current.temp),
    temp: roundMetric(current.temp),
    feels_like: roundMetric(current.feels_like),
    temp_min: roundMetric(dailyToday?.temp?.min ?? current.temp),
    temp_max: roundMetric(dailyToday?.temp?.max ?? current.temp),
    condition: selectCondition({
      weather: current.weather,
      clouds: current.clouds,
      rainVolume: current.rain?.["1h"],
      snowVolume: current.snow?.["1h"],
    }),
    hourly: hourly.slice(0, 8).map((entry) => ({
      time: formatHour(entry.dt, data.timezone),
      temp: roundMetric(entry.temp),
      feels_like: roundMetric(entry.feels_like ?? entry.temp),
      condition: selectCondition({
        weather: entry.weather,
        clouds: entry.clouds,
        rainVolume: entry.rain?.["1h"],
        snowVolume: entry.snow?.["1h"],
      }),
      icon: entry.weather?.[0]?.icon ?? "01d",
    })),
    source: "onecall-3.0",
    coordinates: { lat, lon },
  };
}

function normalizeFallbackData(
  current: CurrentWeatherResponse,
  forecast: ForecastResponse,
  lat: number,
  lon: number
): WeatherApiResult {
  const forecastList = forecast.list ?? [];
  const currentTemp = current.main?.temp;
  const currentFeelsLike = current.main?.feels_like;

  if (
    typeof currentTemp !== "number" ||
    typeof currentFeelsLike !== "number"
  ) {
    throw new Error("INVALID_FALLBACK_PAYLOAD");
  }

  const hourly = forecastList.slice(0, 8).map((entry) => ({
    time: formatHour(entry.dt),
    temp: roundMetric(entry.main.temp),
    feels_like: roundMetric(entry.main.feels_like ?? entry.main.temp),
    condition: selectCondition({
      weather: entry.weather,
      clouds: entry.clouds?.all,
      rainVolume: entry.rain?.["3h"],
      snowVolume: entry.snow?.["3h"],
    }),
    icon: entry.weather?.[0]?.icon ?? "01d",
  }));

  return {
    city: current.name ?? forecast.city?.name ?? "Montevideo",
    country: current.sys?.country ?? forecast.city?.country,
    temperature: roundMetric(currentTemp),
    temp: roundMetric(currentTemp),
    feels_like: roundMetric(currentFeelsLike),
    temp_min: roundMetric(current.main?.temp_min ?? currentTemp),
    temp_max: roundMetric(current.main?.temp_max ?? currentTemp),
    condition: selectCondition({
      weather: current.weather,
      clouds: current.clouds?.all,
      rainVolume: current.rain?.["1h"],
      snowVolume: current.snow?.["1h"],
    }),
    hourly,
    source: "current-and-forecast",
    coordinates: { lat, lon },
  };
}

export async function fetchOpenWeatherData(
  body: WeatherApiRequest | null | undefined
): Promise<WeatherApiResult> {
  validateCoordinates(body);

  const key = process.env.OPENWEATHER_KEY;

  if (!key) {
    throw new Error("MISSING_OPENWEATHER_KEY");
  }

  const { lat, lon } = getCoordinates(body);
  const locationPromise = fetchReverseGeocode(lat, lon, key);
  const oneCallUrl =
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}` +
    `&units=metric&exclude=minutely,alerts&appid=${key}`;

  const { response: oneCallResponse, data: oneCallData } =
    await fetchJson<OneCallResponse>(oneCallUrl);

  console.log("OpenWeather One Call response:", JSON.stringify(oneCallData));

  if (oneCallResponse.ok) {
    const location = await locationPromise;
    return normalizeOneCallData(oneCallData, location, lat, lon);
  }

  const currentUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` +
    `&units=metric&appid=${key}`;
  const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}` +
    `&units=metric&appid=${key}`;

  const [
    { response: currentResponse, data: currentData },
    { response: forecastResponse, data: forecastData },
  ] = await Promise.all([
    fetchJson<CurrentWeatherResponse>(currentUrl),
    fetchJson<ForecastResponse>(forecastUrl),
  ]);

  console.log("OpenWeather current response:", JSON.stringify(currentData));
  console.log("OpenWeather forecast response:", JSON.stringify(forecastData));

  if (!currentResponse.ok || !forecastResponse.ok) {
    throw new Error("OPENWEATHER_REQUEST_FAILED");
  }

  return normalizeFallbackData(currentData, forecastData, lat, lon);
}

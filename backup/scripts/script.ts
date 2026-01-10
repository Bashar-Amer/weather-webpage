const fetchWeather = async () => {
  const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto");
  const data = await response.json();

  // 1. Current Weather (Main Card)
  const currentTemp = data.current.temperature_2m;
  const weatherCode = data.current.weather_code; // Use this for the big icon

  // 2. Details Grid
  const feelsLike = data.current.apparent_temperature;
  const humidity = data.current.relative_humidity_2m;
  const windSpeed = data.current.wind_speed_10m;
  const precipitation = data.current.precipitation;

  // 3. Hourly Forecast (Next few hours)
  const hourlyTimes = data.hourly.time.slice(0, 24); 
  const hourlyTemps = data.hourly.temperature_2m.slice(0, 24);

  // 4. 7-Day Forecast
  const dailyData = data.daily.time.map((time, i) => ({
    date: time,
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
    code: data.daily.weather_code[i]
  }));
};

fetchWeather()
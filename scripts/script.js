const Day_Names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function getWeatherImage(weatherCode){

  switch (weatherCode) {
    case 0:
      return 'sunny';
     
    case 1:
    case 2:
    case 3:
      return 'partly-cloudy';

    case 45:
    case 48:
      return 'fog';
      

    case 51:
    case 53:
    case 55:
      return 'drizzle';


    case 61:
    case 63:
    case 65:
      return 'rain';
      

    case 71:
    case 73:
    case 75:
      return 'snow';
      

    case 95:
    case 96:
    case 99:
      return 'storm';
      
  
    default:
      return 'sunny';
  }
}



async function fetchWeather(latitude,longitude) {

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
  const data = await response.json();

  // 1. Current Weather (Main Card)
  const currentTemp = data.current.temperature_2m;
  const weatherCode = data.current.weather_code; // Use this for the big icon

  // Details 
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

  return data;
};


// import * as ui from './UI.js';




// ---------------------



async function getLatitudeLongitude(city2chars) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city2chars}&count=8&format=json`);
  const data = await response.json();
  return data;
}



// Search box


const searchInput = document.querySelector('.search_box > input');
const suggestionsBox = document.querySelector('.suggestions');


searchInput.addEventListener('input', async () => {
  const inputValue = searchInput.value.trim().toLowerCase();

  suggestionsBox.innerHTML = '';

  if (inputValue.length == '') return;

  let data ;

  try {
    data = await getLatitudeLongitude(inputValue);
    if (data.results == undefined)
      return;
    
  } catch  {
    return;
  }

  const filtered = data.results.filter(item =>
    item.name.toLowerCase().includes(inputValue)
  );

  filtered.forEach(item => {
    const div = document.createElement('div');

    let location;
    if (item.name == item.country) 
      location = item.country
    else
      location = `${item.name}, ${item.country}`
    
    div.textContent = location;
    div.classList.add('suggestion-item');
    div.addEventListener('click', async () => {
      searchInput.value = location;
      suggestionsBox.innerHTML = '';

      data = await fetchWeather(item.latitude,item.longitude);
     
      await changeUI({...data,location});
    });
    suggestionsBox.appendChild(div);
  });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search_box')) {
      suggestionsBox.innerHTML = '';
    }
  });


const searchBtn = document.querySelector('.search_box_wrapper > button');

searchBtn.addEventListener('click', async () => {
  console.log('clicked');
  const inputValue = searchInput.value.trim().toLowerCase();

  suggestionsBox.innerHTML = '';

  if (inputValue.length == '') return;

  let data ;

  try {
    data = await getLatitudeLongitude(inputValue);
    if (data.results == undefined)
      return;
    
  } catch  {
    return;
  }

  const filtered = data.results.filter(item =>
    item.name.toLowerCase().includes(inputValue)
  );

  filtered.forEach(item => {
    const div = document.createElement('div');

    let location;
    if (item.name == item.country) 
      location = item.country
    else
      location = `${item.name}, ${item.country}`
    
    div.textContent = location;
    div.classList.add('suggestion-item');
    div.addEventListener('click', async () => {
      searchInput.value = location;
      suggestionsBox.innerHTML = '';

      data = await fetchWeather(item.latitude,item.longitude);
     
      await changeUI({...data,location});
    });
    suggestionsBox.appendChild(div);
  });
});



// drop down menu

const btn = document.querySelector('.hourly_forecast button');
const menu = document.querySelector('.hourly_forecast .dropdown-menu');

menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      const daySpan = document.querySelector('.hourly_forecast span');
      daySpan.textContent = e.target.textContent;
    }
  });








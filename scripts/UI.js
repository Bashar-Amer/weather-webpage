function changeTodaySection(data) {

  const todayDate = new Date(data.date);
  const dayName = Day_Names[todayDate.getDay()];
  
 
  let image = getWeatherImage(data.weatherCode);
  const imagePath = `./assets/images/icon-${image}.webp`;

  const today = document.querySelector('.today');

  today.innerHTML= `
  <div class="city_date">
              <p class="city">${data.location}</p>
              <p class="date">${dayName}, Aug 5, 2025</p>
            </div>
            <div class="temperature">
              <img
                src=${imagePath}
                alt="Weather status icon"
              /><!--  
           --><span><span class="number">${data.temperature}</span>°</span>
            </div>
            `
}

function changeClimateSection(data) {
  const climate = document.querySelector('.climate');

  climate.innerHTML= `
  <div>
              <p class="title">Feels Like</p>
              <p class="info">${data.apparentTemp}<sup>o</sup></p>
            </div>
            <div>
              <p class="title">Humidity</p>
              <p class="info">${data.humidity}%</p>
            </div>
            <div>
              <p class="title">Wind</p>
              <p class="info">${data.windSpeed} km/h</p>
            </div>
            <div>
              <p class="title">Preciptation</p>
              <p class="info">${data.precipitation} mm</p>
            </div>`;
}


function changeDailySection(data){
  const daily = document.querySelector('.daily_forecast');

  let content = '';

  for (const i in data.time) {
    const date = new Date(data.time[i]);
    const dayName = Day_Names[date.getDay()];

    let image = getWeatherImage(data.weather_code[i]);
    const imagePath = `./assets/images/icon-${image}.webp`;

    content += `
    <div class="day">
              <p class="name">${dayName}</p>
              <img
                src=${imagePath}
                alt="day weather icon"
              />
              <div class="temp">
                <p>${data.temperature_2m_min[i]}°</p>
                <p>${data.temperature_2m_max[i]}°</p>
              </div>
            </div>`;
  }

  daily.innerHTML= content;
}



async function changeUI(data) {
  
  changeTodaySection({
    location:data.location,
    date:data.current.time,
    temperature:data.current.temperature_2m,
    weatherCode:data.current.weather_code
  });

  changeClimateSection({
    apparentTemp : data.current.apparent_temperature,
    humidity : data.current.relative_humidity_2m,
    windSpeed : data.current.wind_speed_10m,
    precipitation : data.current.precipitation
  });

  changeDailySection(data.daily);

  
  

}
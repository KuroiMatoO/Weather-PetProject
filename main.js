import './style.css'

function currentWeatherIcon(icon, clouds, precipitation, isday, rain, snow) {
    if (isday) {
        if (rain > 0) {
            icon.src = 'img/Day_rain.png'
        } else if (snow > 0) {
            icon.src = 'img/Day_snow.png'
        } else if (clouds >= 30 && precipitation == 0) {
            icon.src = 'img/Day_cloudy.png'
        } else {
            icon.src = 'img/Day.png'
        }
    } else {
        if (rain > 0 && precipitation > 0) {
            icon.src = 'img/Night_rain.png'
        } else if (snow > 0 && precipitation > 0) {
            icon.src = 'img/Night_snow.png'
        } else if (clouds >= 30 && precipitation == 0) {
            icon.src = 'img/Night_cloudy.png'
        } else {
            icon.src = 'img/Night.png'
        }
    }
}

function dailyWeatherIcon(icon, sunshine, sunshineAverage, rain, snow){
    if (rain > 0){
        icon.src = 'img/Day_rain.png'
    } else if (snow > 0){
        icon.src = 'img/Day_snow.png'
    } else if (sunshine < 0.8 * sunshineAverage){
        icon.src = 'img/Day_cloudy.png'
    } else {
        icon.src = 'img/Day.png'
    }
}
//location
async function fetchLocation() {
    const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Location API request failed');
    }
    return response.json();
}

//weather
async function fetchWeather(lat,lng) {
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,snowfall,cloud_cover,pressure_msl,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,sunshine_duration,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum&wind_speed_unit=ms&forecast_days=16`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather API request failed');
    }
    return response.json();
}
async function updateUI() {
    try {
        const locationData = await fetchLocation();
        const weatherData = await fetchWeather(locationData.latitude, locationData.longitude);
        const today = new Date();
        console.log(locationData);
        console.log(weatherData)
        
        //current
        const hours = String(today.getHours()).padStart(2, '0');  
        const minutes = String(today.getMinutes()).padStart(2, '0');  
        const currentClouds = weatherData.current.cloud_cover
        const currentPrecipitation = weatherData.current.precipitation
        const isday = weatherData.current.is_day
        const currentRain = weatherData.current.rain
        const currentSnow = weatherData.current.snowfall
        let currentIcon = document.querySelector('#icon img')
        currentIcon = currentWeatherIcon(currentIcon, currentClouds, currentPrecipitation, isday, currentRain, currentSnow)

        document.querySelector('#temperature').innerHTML = Math.round(weatherData.current.temperature_2m) + '°';
        
        document.querySelector('#time').innerHTML = `${hours}:${minutes}`;
        const options = { month: 'long', day: 'numeric', weekday: 'long'};
        document.querySelector('#date').innerHTML = new Intl.DateTimeFormat('en-US', options).format(today);
        document.querySelector('#location').innerHTML = `${locationData.countryCode}, ${locationData.city}`;
        
        document.querySelector('#wind').innerHTML = `Wind: ${weatherData.current.wind_speed_10m} m/s`;
        document.querySelector('#humidity').innerHTML = `Humidity: ${weatherData.current.relative_humidity_2m}%`;
        document.querySelector('#pressure').innerHTML = 'Pressure: ' + Math.round(weatherData.current.pressure_msl * 0.7500637554) + ' mm'
                
        //hourly [wip]
        let chartTime = document.querySelectorAll('.charts-css th');
        let chartTempText = document.querySelectorAll('.area td .data');
        let chartDrawArea = document.querySelectorAll('.area td');
        let chartDrawLine = document.querySelectorAll('.line td');
        let now = new Date(); 
        let nowTime = now.getHours()

        for (let i = 0; i < 10; i++) {
            if (i == 0){
                console.log('nowTime = ' + nowTime)
                chartDrawArea[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime - 2]}/30)`);
                chartDrawArea[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime]}/30)`);
                chartDrawLine[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime - 2]}/30)`);
                chartDrawLine[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime]}/30)`);
                console.log(weatherData.hourly.temperature_2m[nowTime - 1])
            }
            chartDrawArea[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime]}/30)`);
            chartDrawArea[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime + 2]}/30)`);
            chartDrawLine[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime]}/30)`);
            chartDrawLine[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime + 2]}/30)`);
            
            if (i < 9){
                chartTempText[i].innerHTML = Math.round(weatherData.hourly.temperature_2m[nowTime])+'°'
                nowTime = nowTime + 2;
            }
        }
        for (let i = 0; i < 9; i++) {
            let nextHour = new Date(today); 
            nextHour.setHours(today.getHours() + 2 * i); 
            chartTime[i].innerHTML = `${nextHour.getHours()}:00`;
        }

        //weekly
        let dailyDate = document.querySelectorAll('.daily_date');
        let dailyIcons = document.querySelectorAll('.day img');
        let dailyTemp = document.querySelectorAll('.daily_temp');
        let sunshine = weatherData.daily.sunshine_duration;
        let totalSunshine = sunshine.reduce((total, current) => total + current, 0);
        let sunshineAverage = totalSunshine / sunshine.length;
        
        for (let i = 0; i < 7; i++){
            let nextDay = new Date(today); 
            nextDay.setDate(today.getDate() + i); 
            const dailyOptions = { month: 'long', day: 'numeric' };
            dailyDate[i].innerHTML = new Intl.DateTimeFormat('en-US', dailyOptions).format(nextDay);            
            
            dailyWeatherIcon(dailyIcons[i], sunshine[i], sunshineAverage, weatherData.daily.rain_sum[i], weatherData.daily.snowfall_sum[i]);
            
            dailyTemp[i].innerHTML = (Math.round((weatherData.daily.temperature_2m_max[i] + weatherData.daily.temperature_2m_min[i]) / 2)) + '°';
        }
        
    } catch (error) {
        console.error(error); 
    }
}
updateUI();

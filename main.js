import './style.css'
function Current_Weather_Icon(icon, clouds, precipitation, isday, rain, snow) {
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

function Daily_Weather_Icon(icon, sunshine, sunshineAverage, rain, snow){
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
async function Fetch_Location(lat,lng) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Location API request failed');
    }
    return response.json();
}

//weather
async function Fetch_Weather(lat,lng) {
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,snowfall,cloud_cover,pressure_msl,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,sunshine_duration,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum&wind_speed_unit=ms&forecast_days=16`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather API request failed');
    }
    return response.json();
}
async function Update_UI() {
    try {
        let locationData;
        let weatherData;
        if (lat && lng){
            locationData = await Fetch_Location(lat,lng);
            weatherData = await Fetch_Weather(lat, lng);
        } else {
            locationData = await Fetch_Location();
            weatherData = await Fetch_Weather(locationData.latitude, locationData.longitude);
        }
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
        currentIcon = Current_Weather_Icon(currentIcon, currentClouds, currentPrecipitation, isday, currentRain, currentSnow)

        document.querySelector('#temperature').innerHTML = Math.round(weatherData.current.temperature_2m) + '°';
        
        document.querySelector('#time').innerHTML = `${hours}:${minutes}`;
        const options = { month: 'long', day: 'numeric', weekday: 'long'};
        document.querySelector('#date').innerHTML = new Intl.DateTimeFormat('en-US', options).format(today);
        document.querySelector('#location').innerHTML = `${locationData.countryCode}, ${locationData.city}`;
        
        document.querySelector('#wind').innerHTML = `Wind: ${weatherData.current.wind_speed_10m} m/s`;
        document.querySelector('#humidity').innerHTML = `Humidity: ${weatherData.current.relative_humidity_2m}%`;
        document.querySelector('#pressure').innerHTML = 'Pressure: ' + Math.round(weatherData.current.pressure_msl * 0.7500637554) + ' mm'
                
        //hourly
        let chartTime = document.querySelectorAll('.charts-css th');
        let chartTempText = document.querySelectorAll('.area td .data');
        let chartDrawArea = document.querySelectorAll('.area td');
        let chartDrawLine = document.querySelectorAll('.line td');
        let now = new Date(); 
        let nowTime = now.getHours()

        for (let i = 0; i < 10; i++) {
            if (i == 0){
                // console.log('nowTime = ' + nowTime)
                chartDrawArea[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime - 2]}/45)`);
                chartDrawArea[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime]}/45)`);
                chartDrawLine[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime - 2]}/45)`);
                chartDrawLine[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime]}/45)`);
                // console.log(weatherData.hourly.temperature_2m[nowTime - 1])
            }
            chartDrawArea[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime]}/45)`);
            chartDrawArea[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime + 2]}/45)`);
            chartDrawLine[i].style.setProperty('--start', `calc(${weatherData.hourly.temperature_2m[nowTime]}/45)`);
            chartDrawLine[i].style.setProperty('--end', `calc(${weatherData.hourly.temperature_2m[nowTime + 2]}/45)`);
            
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
            
            Daily_Weather_Icon(dailyIcons[i], sunshine[i], sunshineAverage, weatherData.daily.rain_sum[i], weatherData.daily.snowfall_sum[i]);
            
            dailyTemp[i].innerHTML = (Math.round((weatherData.daily.temperature_2m_max[i] + weatherData.daily.temperature_2m_min[i]) / 2)) + '°';
        }
        
    } catch (error) {
        console.error(error); 
    }
}

let lat;
let lng;

Update_UI();



//Choosing location manually

//VARIABLES
//wrapper
let location = document.querySelector('.location');
let changeLocationButton = document.querySelector('#change_location_btn');
let closeLocationButton = document.querySelector('#location_header button')
let bg = document.querySelector('#dark_background');
let tip = document.querySelector('.tip');

//search
let searchLocationData = {}
let searchInput = document.querySelector('#location_search input');
let searchResult = document.querySelector('.search_result');
let searchResultItem = document.querySelectorAll('.result_item');
let searchResultItemCity = document.querySelectorAll('.search_result .city');
let searchResultItemIMG = document.querySelectorAll('.search_result .flag img');
let searchResultItemCountry = document.querySelectorAll('.search_result .country');
let typingTimeout;

//favorite
let favoriteLocationData = {}
let favoriteLocations = document.querySelector('.favorite_locations');
let favoriteItem = document.querySelectorAll('.favorite_item');
let favoriteItemCity = document.querySelectorAll('.favorite_locations .city');
let favoriteItemIMG = document.querySelectorAll('.favorite_locations .flag img');
let favoriteItemCountry = document.querySelectorAll('.favorite_locations .country');
let addFavotite  = document.querySelectorAll('.add_favorite');
let removeFavotite = document.querySelectorAll('.remove_favorite');

//localStorage
let localLength = localStorage.length;
let retrievedFavLocalString;
let retrievedFavLocal

//FUNCTIONS
function Location_Visibility(){
    if (location.className == 'location invisible'){
        location.className = 'location';
        bg.style.display = 'block';
    } else {
        location.className = 'location invisible';
        bg.style.display = 'none';
    }
}

function Location_Body_Visibility(){
    let FLDLength = Object.keys(favoriteLocationData).length
    if (!searchInput.value && FLDLength){
        searchResult.className = 'search_result hidden';
        favoriteLocations.className = 'favorite_locations';
        tip.className = 'tip';
        // console.log('!searchInput.value && favoriteLocationData')
        // console.log(favoriteLocationData.length)
    } else if (!searchInput.value && !FLDLength){
        searchResult.className = 'search_result hidden';
        favoriteLocations.className = 'favorite_locations hidden';
        tip.className = 'tip';
        // console.log('!searchInput.value && !favoriteLocationData')
    } else if (searchInput.value && searchInput.value.length > 1 && FLDLength){
        searchResult.className = 'search_result';
        favoriteLocations.className = 'favorite_locations';
        tip.className = 'tip hidden';    
        // console.log('searchInput.value && favoriteLocationData')
    } else if (searchInput.value.length > 1){
        searchResult.className = 'search_result';
        favoriteLocations.className = 'favorite_locations hidden';
        tip.className = 'tip hidden';
        // console.log('ELSE')
    }
}

async function Fetch_Search_Location(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=10&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Location API request failed');
    }
    //console.log(response)
    return response.json();
}

async function Update_Location_List() {
    try {
        //SEARCH
        const locationSearchResponse = await Fetch_Search_Location(searchInput.value);
        if (searchInput.value && searchInput.value.length > 1 && locationSearchResponse.results) {
            
            let LSRLength= Object.keys(locationSearchResponse.results).length

            for (let i = 0; i < LSRLength && i < 5; i++) {
                searchLocationData[`loc${i}`] = {
                    city: locationSearchResponse.results[i].name,
                    country: locationSearchResponse.results[i].country,
                    latitude: locationSearchResponse.results[i].latitude,
                    longitude: locationSearchResponse.results[i].longitude,
                    countryCode: locationSearchResponse.results[i].country_code.toLowerCase(),
                }
                searchResultItemCountry[i].innerHTML = searchLocationData[`loc${i}`].country
                searchResultItemIMG[i].src = `https://open-meteo.com/images/country-flags/${searchLocationData[`loc${i}`].countryCode}.svg`
                let cityNameNode = searchResultItemCity[i].childNodes[searchResultItemCity[i].childNodes.length - 1];
                cityNameNode.nodeValue = searchLocationData[`loc${i}`].city;
                searchResultItem[i].style.display = 'flex';
                
                //make all but last item's borders straight 
                if (i < LSRLength - 1 && i < 4){
                    searchResultItem[i].style.borderBottomLeftRadius = '0px';
                    searchResultItem[i].style.borderBottomRightRadius = '0px';
                }
                
                //hide unused items and make last visible item's borders round    
                if (LSRLength < 5){
                    for (let n = 5; n > LSRLength; n--) {
                        if (searchResultItem[n - 1].style.display == 'flex'){
                            searchResultItem[n - 1].style.display = 'none';
                        } 
                    }
                    if (i == LSRLength - 1){
                        searchResultItem[i].style.borderBottomLeftRadius = '5px';
                        searchResultItem[i].style.borderBottomRightRadius = '5px';
                    }
                
                //console.log(LSRLength)
                // console.log(searchResultItemIMG[i].src)
                // console.log(searchResultItemCountry[i].innerHTML)  
                }
            }
            Location_Body_Visibility()

        }
        
        //FAVORITES
        let FLDLength = Object.keys(favoriteLocationData).length
        console.log('FLDLength = ' + FLDLength)
        if (FLDLength == 0) {
            Location_Body_Visibility()
            //} else if (localLength > 0 && favoriteItem.length < Object.keys(favoriteLocationData).length) {
        } else {
            for (let i = 0; i < FLDLength; i++) {
                // console.log(favoriteLocationData)
                favoriteItemCity[i].nodeValue = favoriteLocationData[`loc${i}`].city
                favoriteItemCountry[i].innerHTML = favoriteLocationData[`loc${i}`].country
                favoriteItemIMG[i].src = `https://open-meteo.com/images/country-flags/${favoriteLocationData[`loc${i}`].countryCode}.svg`
                let cityNameNode = favoriteItemCity[i].childNodes[favoriteItemCity[i].childNodes.length - 1];
                cityNameNode.nodeValue = favoriteLocationData[`loc${i}`].city;
                favoriteItem[i].style.display = 'flex';


                if (i < FLDLength - 1 && i < 2) {
                    favoriteItem[i].style.borderBottomLeftRadius = '0px';
                    favoriteItem[i].style.borderBottomRightRadius = '0px';
                }

                if (FLDLength < 3) {
                    for (let n = 3; n > FLDLength; n--) {
                        if (favoriteItem[n - 1].style.display !== 'none') {
                            favoriteItem[n - 1].style.display = 'none';
                        }
                    }
                    if (i == FLDLength - 1) {
                        favoriteItem[i].style.borderBottomLeftRadius = '5px';
                        favoriteItem[i].style.borderBottomRightRadius = '5px';
                    }
                }
            }
            Location_Body_Visibility()
        }
    } catch (error) {
        console.error(error);
        // console.log('Search output is: ' + locationSearchResponse.results)

    }
}

function Favorite_Locations_Add(buttonIndex) {
    let nextIndex = Object.keys(favoriteLocationData).length;
    if (nextIndex < 3) {
        favoriteLocationData[`loc${nextIndex}`] = {
            city: searchLocationData[`loc${buttonIndex}`].city,
            country: searchLocationData[`loc${buttonIndex}`].country,
            latitude: searchLocationData[`loc${buttonIndex}`].latitude,
            longitude: searchLocationData[`loc${buttonIndex}`].longitude,
            countryCode: searchLocationData[`loc${buttonIndex}`].countryCode,
        }
        // console.log(favoriteLocationData)

        let favLocalString = JSON.stringify(favoriteLocationData);
        // console.log(favLocalString)
        localStorage.setItem('fav', favLocalString);
        retrievedFavLocalString = localStorage.getItem('fav')
        retrievedFavLocal = JSON.parse(retrievedFavLocalString);

        // console.log(retrievedFavLocal)
        // console.log(favoriteLocationData)
        
        favoriteItemCity[nextIndex].nodeValue = favoriteLocationData[`loc${nextIndex}`].city
        favoriteItemCountry[nextIndex].innerHTML = favoriteLocationData[`loc${nextIndex}`].country
        favoriteItemIMG[nextIndex].src = `https://open-meteo.com/images/country-flags/${favoriteLocationData[`loc${nextIndex}`].countryCode}.svg`
        let cityNameNode = favoriteItemCity[nextIndex].childNodes[favoriteItemCity[nextIndex].childNodes.length - 1];
        cityNameNode.nodeValue = favoriteLocationData[`loc${nextIndex}`].city;
        Update_Location_List()
        Debug_Fill()

    } else {
        console.log('fav data is 3')
        // console.log(favoriteLocationData)
        // favoriteLocationData = {}
        // console.log('fav data cleared')
        // favoriteLocationData = {}
        Debug_Fill()

    }

}

function Favorite_Locations_Remove(buttonIndex){
    delete favoriteLocationData[`loc${buttonIndex}`]
    const newFavoriteLocationData = {};
    Object.keys(favoriteLocationData).sort().forEach((key, index) => {
        newFavoriteLocationData[`loc${index}`] = favoriteLocationData[key];
      });
      favoriteLocationData = newFavoriteLocationData;
    let favLocalString = JSON.stringify(favoriteLocationData);
        localStorage.setItem('fav', favLocalString);
        retrievedFavLocalString = localStorage.getItem('fav')
        retrievedFavLocal = JSON.parse(retrievedFavLocalString);
    Update_Location_List()
    Debug_Fill()

}
function Choose_Location(buttonIndex, event){
    const target = event.currentTarget
    if (target.classList.contains('favorite_item')) {
        console.log('Favorite item clicked:', buttonIndex);
        lat = favoriteLocationData[`loc${buttonIndex}`].latitude
        lng = favoriteLocationData[`loc${buttonIndex}`].longitude
        console.log(lat, lng)
    } else if (target.classList.contains('result_item')) {
        console.log('Search result item clicked:', buttonIndex);
        lat = searchLocationData[`loc${buttonIndex}`].latitude
        lng = searchLocationData[`loc${buttonIndex}`].longitude
        console.log(lat, lng)
    } else {
        console.log('Unknown class clicked:', buttonIndex);
    }
    Fetch_Weather(lat,lng)
    Location_Visibility()
    Update_UI()
}

//EXECUTION

changeLocationButton.addEventListener('click',() => {    
    Update_Location_List();    
    Debug_Fill()
    Location_Visibility();
});
closeLocationButton.addEventListener('click', Location_Visibility)
bg.addEventListener('click', Location_Visibility)

if (localLength) {
    retrievedFavLocalString = localStorage.getItem('fav')
    retrievedFavLocal = JSON.parse(retrievedFavLocalString);
    favoriteLocationData = retrievedFavLocal
} else {
    localLength = '0';
}

searchInput.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(Update_Location_List, 500);
});

addFavotite.forEach((button, buttonIndex) => {
    button.addEventListener('click', () => Favorite_Locations_Add(buttonIndex));
});

removeFavotite.forEach((button, buttonIndex) => {
    button.addEventListener('click', () => Favorite_Locations_Remove(buttonIndex));
});

favoriteItem.forEach((button, buttonIndex) => {
    button.addEventListener('click', (event) => {
        Choose_Location(buttonIndex, event);
    });
});

searchResultItem.forEach((button, buttonIndex) => {
    button.addEventListener('click', (event) => {
        Choose_Location(buttonIndex, event);
    });
});



let detectLocation = document.querySelector('#detect_location')
detectLocation.addEventListener('click', Detect_Location)
function Detect_Location(){
    lat = '';
    lng = '';
    Fetch_Weather(lat,lng)
    Location_Visibility()
    Update_UI()
}


Update_Location_List();    


//DEBUG

let debugVars = document.querySelector('#debug #variables')
let debugLS = document.querySelector('#debug #local_storage')

function Debug_Fill(){
    debugVars.innerHTML = JSON.stringify(favoriteLocationData);
    debugLS.innerHTML = JSON.stringify(localStorage) + ' localLength = ' + localLength + ' Object.keys(favoriteLocationData).length = ' + Object.keys(favoriteLocationData).length;
}
Debug_Fill()

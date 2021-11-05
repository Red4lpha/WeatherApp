const apikey = '7a36fc07f959804b2a9a8d55494ac3dc';
let searchQuery = 'Tijuana'
const api = `http://api.openweathermap.org/data/2.5/weather?q=`;
//https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}
//lon: -117.0167, lat: 32.5333 } - tijuana


const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



const weather = document.querySelector('#weather-results');
const btn = document.querySelector('#search-button');
const input = document.querySelector('#search-input');
const city = document.querySelector('#city');
const country = document.querySelector('#country');
const time = document.querySelector('#time');
const day = document.querySelector('#day');
const date = document.querySelector('#date');
const temperature = document.querySelector('#temperature');
const weatherType = document.querySelector('#weather-type');
const weatherImg = document.querySelector('#weather-img');


btn.addEventListener('click', () => {
    searchQuery = input.value;
    let query = `${api}${searchQuery}&APPID=${apikey}`;
    //console.log(query);
    getResults(query);
});

async function getResults(query){
    const result = await axios.get(query);
    console.log(result.data);
    let data = result.data;
    //grabs lat and lon data for the 2nd API query for the forecase dates
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let forecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apikey}`;
    const forecast = await axios.get(forecastAPI);
    console.log(forecast.data);

    //Main text info
    let temp = convertToF(data.main.temp);
    let dt = data.dt;
    let timeOffSet = data.timezone;
    let localTime = new Time(dt, timeOffSet);
    day.innerText = localTime.getLocalDay();
    time.innerText = localTime.getLocalTime();
    date.innerText = localTime.getLocalDate();
    city.innerText = data.name + ', ';
    country.innerText = data.sys.country
    temperature.innerText = temp;
    weatherType.innerText = data.weather[0].description;
    let icon = data.weather[0].icon;
    weatherImg.src =`http://openweathermap.org/img/wn/${icon}@2x.png`;

    //forecast info

}
getResults().catch((err) => {
    console.log('get request failed');
    console.log(err);
});


class Time {
    constructor(dateTime, timeZoneOffSet){
        this.dateTime = dateTime;
        this.timeZoneOffSet = timeZoneOffSet;
        this.localTime = new Date((dateTime + timeZoneOffSet) * 1000); 
    };
    getLocalTime(){
        //It's necessary to use UTC to get the local of the search quary because regular
        //getHour & getMinutes methods will return local time of the user
        let UTChour = this.localTime.getUTCHours();
        let UTCMins = this.localTime.getUTCMinutes();
        return `${UTChour}:${UTCMins}`;
    };
    getLocalDay(){
        let day = DAYS[this.localTime.getUTCDay()];
        return day;
    };
    getLocalDate(){
        let month = MONTHS[this.localTime.getUTCMonth()];
        let day = this.localTime.getUTCDay();
        return `${month} ${day}`;
    };
}


function convertToF(kelvin = 0){
    return Math.floor((kelvin - 273.15) * (9/5) + 32); 
};
function convertToC(kelvin = 0){
    return Math.floor(kelvin - 273.15);
}

//let forecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}`
//getResults(test);
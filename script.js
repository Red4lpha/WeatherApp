const apikey = '7a36fc07f959804b2a9a8d55494ac3dc';
let searchQuery = 'Tijuana'
const api = `https://api.openweathermap.org/data/2.5/weather?q=`;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const BGIMAGES = [
    {
        icon: ['01d'],
        image: './media/ClearSky-Day.jpeg'
    },
    {
        icon: ['01n'],
        image: './media/ClearSky-Night.jpeg'
    },
    {
        icon: ['02d', '03d', '04d'],
        image: './media/Cloud-day.jpg'
    },
    {
        icon: ['02n', '03n', '04n'],
        image: './media/Cloud-night.jpeg'
    },
    {
        icon: ['09d', '10d'],
        image: './media/Rain-Day2.jpeg'
    },
    {
        icon: ['09n', '10n'],
        image: './media/Rain-Night2.jpeg'
    },
    {
        icon: ['11d'],
        image: './media/Thunder-day.jpeg'
    },
    {
        icon: ['11n'],
        image: './media/Thunder-Night.webp'
    },
    {
        icon: ['13d'],
        image: './media/Snow-day2.jpeg'
    },
    {
        icon: ['13n'],
        image: './media/Snow-night.jpeg'
    },
    {
        icon: ['50d'],
        image: './media/Mist-DAy.jpeg'
    },
    {
        icon: ['50n'],
        image: './media/Mist-Night2.jpeg'
    },

];


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
const forecastDay1 = document.querySelector('#forecast-date1');
const forecastImg1 = document.querySelector('#forecast-img1');
const forecastTemp1 = document.querySelector('#forecast-temp1');
const forecastCards = document.querySelectorAll('.forecast-card');
const degrees = document.querySelectorAll('.degree-text');
const degreeSwitcher = document.querySelector('#degree-switch');
const largeDegree = document.querySelector('#degree');
const bgImage = document.querySelector('.bg-container');
const errorContainer = document.querySelector('#error-container');

//This is to keep track if using Fahrenheit or Celsius 
let isFDegrees = true;
let degreeText = '&degF';

degreeSwitcher.addEventListener('change', () => {
    isFDegrees = !isFDegrees;
    if (isFDegrees) { degreeText = '&degF' }
    else { degreeText = '&degC' }
    //Grabs just the number and possible negative sign from the temperature text
    let largeNum = parseInt(temperature.innerText.match(/-?\d+/g).join(''), 10);
    //console.log('largeNum', largeNum);
    let newLargeNum = convertFromTemp(largeNum);
    temperature.innerText = newLargeNum;
    largeDegree.innerHTML = degreeText;
    degrees.forEach((degree) => {
        let oldTemp = parseInt(degree.innerText.match(/-?\d+/g).join(''), 10);
        let newTemp = convertFromTemp(oldTemp);
        degree.innerHTML = `${newTemp}&deg`;
    });
});

btn.addEventListener('click', () => {
    searchQuery = input.value;
    let query = `${api}${searchQuery}&APPID=${apikey}`;
    //console.log(query);
    getResults(query).catch(async (err) => {
        //console.log('get request failed');
        //console.log(err);
        errorContainer.className = 'error';
        await new Promise(r => setTimeout(r, 2000));
        errorContainer.className = 'error hidden';
    });
});

async function getResults(query) {
    const result = await axios.get(query);
    //console.log(result.data);
    let data = result.data;
    //grabs lat and lon data for the 2nd API query for the forecase dates
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let forecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apikey}`;
    const forecastResult = await axios.get(forecastAPI);
    /* console.log(forecastResult.data); */

    //Main text info
    let temp = '';
    temp = convertFromK(data.main.temp);
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
    weatherImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    //This uses the icon data from the API to look up what BG image to use
    let obj = BGIMAGES.find(o => o.icon.find(o2 => o2 == icon));
    //If the icon data doesnt match any from my array list then just use default day cloudy bg
    if (obj === undefined) {
        bgImage.setAttribute('style',
            `background-image: url(./media/Cloud-day.jpg);`);
    }
    else {
        bgImage.setAttribute('style',
            `background-image: url(${obj.image});`);
    }

    //forecast info
    let forecastData = new Forecast(forecastResult);
    forecastCards.forEach((card, index) => {
        /* console.log(card); */
        let dayNum = (localTime.getLocalDayNum() + index) % DAYS.length;
        card.children[0].innerText = DAYS[dayNum].substr(0, 3);
        let FCIcon = forecastData.getIcon(index);
        card.children[1].src = `http://openweathermap.org/img/wn/${FCIcon}@2x.png`
        card.children[2].children[0].innerHTML = convertFromK(forecastData.getHigh(index)) + '&deg';
        card.children[2].children[1].innerHTML = convertFromK(forecastData.getLow(index)) + '&deg';
    });
}

class Time {
    constructor(dateTime, timeZoneOffSet) {
        this.dateTime = dateTime;
        this.timeZoneOffSet = timeZoneOffSet;
        this.localTime = new Date((dateTime + timeZoneOffSet) * 1000);
    };
    getLocalTime() {
        //It's necessary to use UTC to get the local of the search quary because regular
        //getHour & getMinutes methods will return local time of the user
        let UTChour = this.localTime.getUTCHours();
        let UTCMins = this.localTime.getUTCMinutes();
        if (UTCMins < 10) {
            UTCMins = `0${UTCMins}`;
        }
        return `${UTChour}:${UTCMins}`;
    };
    getLocalDay() {
        let day = DAYS[this.localTime.getUTCDay()];
        return day;
    };
    getLocalDayNum() {
        let day = this.localTime.getUTCDay();
        return day;
    }
    getLocalDate() {
        let month = MONTHS[this.localTime.getUTCMonth()];
        let day = this.localTime.getUTCDate();
        return `${month} ${day}`;
    };
}
class Forecast {
    constructor(result) {
        this.result = result;
    }
    getIcon(index) {
        return this.result.data.daily[index].weather[0].icon;
    };
    getHigh(index) {
        return this.result.data.daily[index].temp.max;
    }
    getLow(index) {
        return this.result.data.daily[index].temp.min;
    }
};


function convertFromK(kelvin = 0) {
    if (isFDegrees) { return Math.floor((kelvin - 273.15) * (9 / 5) + 32); }
    else { return Math.floor(kelvin - 273.15); }
};
function convertFromTemp(previousTemp) {
    if (isFDegrees) { return Math.floor((previousTemp * (9 / 5)) + 32) }
    else { return Math.floor((previousTemp - 32) * (5 / 9)) }
}

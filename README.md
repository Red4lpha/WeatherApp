# Weather App

API project done for [The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/weather-app) curriculum.
[Live Site](https://red4lpha.github.io/WeatherApp/)

My goal for this was to make a clean and minimalist design to fit neatly without too much scrolling. 

Functionality information:
1. User enters search query
2. API call for that search query
  - If invalid query -> Timeout interval for two seconds to display CSS error code before returning back to default
  - If valid query -> Continue onto async function for API results
3. Search query data is parsed of weather, latitude, and longitude data
4. Latitude and longitude data is used for 2nd API call for query area 7-day forecast
5. Use the query and forecast data to fill in all the relevant text fields
6. Fill in weather icons based off API icon data
7. Changed weather container background based off the API icon data(type of weather and if day or night)
8. Derive search query local time based off UTC information from API data


## Used

- Vanilla HTML / CSS / JS
- [Openweathermap API](https://openweathermap.org/)
- Axios JS

## Practice

- API manipulation
- Axios JS - Get and Catch
- Async Await
- DateTime() manipulation
- Working with UTC time and offsets
- Responsive Design

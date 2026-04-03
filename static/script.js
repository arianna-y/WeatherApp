// map weather codes to icons
const weatherCodeMap = {
    "1000": { description: "Clear", icon: "/static/Images/WeatherIcons/clear_day.svg" },
    "1100": { description: "Mostly Clear", icon: "/static/Images/WeatherIcons/mostly_clear_day.svg" },
    "1101": { description: "Partly Cloudy", icon: "/static/Images/WeatherIcons/partly_cloudy_day.svg" },
    "1102": { description: "Mostly Cloudy", icon: "/static/Images/WeatherIcons/mostly_cloudy.svg" },
    "1001": { description: "Cloudy", icon: "/static/Images/WeatherIcons/cloudy.svg" },
    "2000": { description: "Fog", icon: "/static/Images/WeatherIcons/fog.svg" },
    "2100": { description: "Light Fog", icon: "/static/Images/WeatherIcons/fog_light.svg" },
    "4000": { description: "Drizzle", icon: "/static/Images/WeatherIcons/drizzle.svg" },
    "4001": { description: "Rain", icon: "/static/Images/WeatherIcons/rain.svg" },
    "4200": { description: "Light Rain", icon: "/static/Images/WeatherIcons/rain_light.svg" },
    "4201": { description: "Heavy Rain", icon: "/static/Images/WeatherIcons/rain_heavy.svg" },
    "5000": { description: "Snow", icon: "/static/Images/WeatherIcons/snow.svg" },
    "5001": { description: "Flurries", icon: "/static/Images/WeatherIcons/flurries.svg" },
    "5100": { description: "Light Snow", icon: "/static/Images/WeatherIcons/snow_light.svg" },
    "5101": { description: "Heavy Snow", icon: "/static/Images/WeatherIcons/snow_heavy.svg" },
    "6000": { description: "Freezing Drizzle", icon: "/static/Images/WeatherIcons/freezing_drizzle.svg" },
    "6001": { description: "Freezing Rain", icon: "/static/Images/WeatherIcons/freezing_rain.svg" },
    "6200": { description: "Light Freezing Rain", icon: "/static/Images/WeatherIcons/freezing_rain_light.svg" },
    "6201": { description: "Heavy Freezing Rain", icon: "/static/Images/WeatherIcons/freezing_rain_heavy.svg" },
    "7000": { description: "Ice Pellets", icon: "/static/Images/WeatherIcons/ice_pellets.svg" },
    "7101": { description: "Heavy Ice Pellets", icon: "/static/Images/WeatherIcons/ice_pellets_heavy.svg" },
    "7102": { description: "Light Ice Pellets", icon: "/static/Images/WeatherIcons/ice_pellets_light.svg" },
    "8000": { description: "Thunderstorm", icon: "/static/Images/WeatherIcons/tstorm.svg" }
} 

// Precipitation map
const precipitationTypeMap = {
    "0": { description: "N/A" },
    "1": { description: "Rain" },
    "2": { description: "Snow" },
    "3": { description: "Freezing Rain" },
    "4": { description: "Ice Pellets" }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('weather-form').reset();
    document.getElementById('clear-button').addEventListener('click', function() {
        document.getElementById('weather-form').reset();
        document.getElementById('street-name').disabled = false;
        document.getElementById('city-name').disabled = false;
        document.getElementById('state-name').disabled = false;
        
        document.getElementById("current-weather").style.display ='none';
        document.getElementById("weather-table").style.display = 'none';
        document.getElementById("detailed-weather").style.display = 'none';
        document.getElementById("weather-chart-content").style.display = "none";

        document.getElementById("weather-chart-range").style.display = "none";
        document.getElementById("weather-chart-hourly").style.display = "none";
        document.getElementById("weather-chart-click-me").innerHTML = `<img src="/static/Images/point-down-512.png" width="32" height="32">`;

    })
    document.querySelector('input[name=auto-detect]').addEventListener('change', function() {
        console.log(`${this.checked}`)

        if (this.checked) {
            document.getElementById('street-name').value = '';
            document.getElementById('city-name').value = '';
            document.getElementById('state-name').value = '';
            document.getElementById('street-name').disabled = true;
            document.getElementById('city-name').disabled = true;
            document.getElementById('state-name').disabled = true;
        }
        else {
            document.getElementById('street-name').disabled = false;
            document.getElementById('city-name').disabled = false;
            document.getElementById('state-name').disabled = false;
        }
    });

    document.getElementById('weather-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const street = document.getElementById('street-name').value;
        const city = document.getElementById('city-name').value;
        const state = document.getElementById('state-name').value;
        const autoDetect = document.getElementById('auto-detect').checked;
    
        let fetchURL

        // if auto-detect is selected 
        if (autoDetect) {
            fetchURL = 'get_weather?auto_detect';
        }
        else {
            fetchURL = `get_weather?street=${street}&city=${city}&state=${state}`;
        }

        // const data = fetch(fetchURL)
        //     .then(response => response.json())
        //     .catch(error => {
        //         console.error("there was an error fetching weather data:", error)
        //         return null
        //     })
        // if (data) {
        //     displayData(data)
        // }
    
        // // fetch weather data from flask
        console.log(`${fetchURL}`)
        fetch(fetchURL).then(response => {
            if (!response.ok) {
                throw Error("try again: network response not okay");
            }
            return response.json();
        })
        .then(data => {
            console.log(`handle data`)

            document.getElementById("current-weather").style.display ='block';
            document.getElementById("weather-table").style.display = 'block';
            document.getElementById("detailed-weather").style.display = 'none';
            document.getElementById("weather-chart-content").style.display = "none";

            document.getElementById("weather-chart-range").style.display = "none";
            document.getElementById("weather-chart-hourly").style.display = "none";
            document.getElementById("weather-chart-click-me").innerHTML = `<img src="/static/Images/point-down-512.png" width="32" height="32">`;
            
            displayWeatherData(data);
            displayWeatherTable(data);
        })
        .catch(error => {
            console.log(`There was an error when displaying weather data: ${error}`);
        });

        



    });

    chartContent = document.getElementById("weather-chart-click-me");
    chartContent.addEventListener("click", function(event) {
        console.log(`${event.currentTarget}`);
        click_weather_chart(event.currentTarget);
    });
});

// function getData(data) {
// fetch(`https://api.tomorrow.io/v4/weather/realtime?`) 
//     .then (response => response.json())
//     .then (data => console.log(data))

// getData(data);
// }



// Display fetched weather data
function displayWeatherData(data) {
    console.log(`data=${JSON.stringify(data)}`)
    // update current daily card
    const weatherCard = document.getElementById('current-weather');
    // const location = data.location.formatted_address || `${data.location.street}, ${data.location.city}, ${data.location.state}`;
    const location = data.location ? data.location.formatted_address : `${data.location.street}, ${data.location.city}, ${data.location.state}`;
    // const weatherValues = data.data.timelines[0].intervals[0].values;
    const weatherValues = data.data.values;
    const weatherStatus = weatherCodeMap[weatherValues.weatherCode].description
    const weatherIcon = weatherCodeMap[weatherValues.weatherCode].icon

    weatherCard.innerHTML = `
        <h2 style="height: 10px;width: 800px;margin-bottom: 0px;"> ${location} </h2>
        <div class="weather-card-header">
            <div class="weather-card-status">
                <img src="${weatherIcon}" height="80" width="80" style="margin-top: 25px;">
                <p style="margin-top: 2px;"> ${weatherStatus} </p>
            </div>
            <div class="weather-card-temp" style="height: 300px; width: 350px; margin-top: -90px; margin-bottom: -10px">
                <p style="margin-left: -30px;margin-bottom: 0px;margin-top: 110px;"> ${weatherValues.temperature}° </p>
            </div>
        </div>
        <div class="weather-card-details">
            <div class="detail">
                <p> Humidity </p>
                <img src="/static/Images/humidity.png" alt="humidity icon">
                ${weatherValues.humidity}%
            </div>

            <div class="detail">
                <p> Pressure </p>
                <img src="/static/Images/pressure.png" alt="pressure icon">
                ${weatherValues.pressureSurfaceLevel}inHg
            </div>
            
            <div class="detail">
                <p> Wind Speed </p>
                <img src="/static/Images/Wind_Speed.png" alt="wind speed icon">
                ${weatherValues.windSpeed}mph
            </div>

            <div class="detail">
                <p> Visibility </p>
                <img src="/static/Images/Visibility.png" alt="visibility icon">
                ${weatherValues.visibility}mi
            </div>

            <div class="detail">
                <p> Cloud Cover </p>
                <img src="/static/Images/Cloud_Cover.png" alt="cloud cover icon">
                ${weatherValues.cloudCover}%
            </div>

            <div class="detail">
                <p> UV Level </p>
                <img src="/static/Images/UV_Level.png" alt="uv level icon">
                ${weatherValues.uvIndex}
            </div>
        </div>
            
    `
};

// Display forecast weather table
function displayWeatherTable(data) {
    console.log(`weatherTable: ${data}`);

    // const weatherData = data.data.timelines[0].intervals;
    console.log(`displayWeatherTable`)
    const weatherTableContent = document.getElementById('weather-table');
    weatherTableContent.innerHTML = '';
    const intervals = data.timelines[0].intervals;
    console.log(`${JSON.stringify(intervals)}`)

    // const weatherValues = data.data.values;
    // const weatherStatus = weatherCodeMap[weatherValues.weatherCode].description
    // const weatherIcon = weatherCodeMap[weatherValues.weatherCode].icon

    // const weatherTable = document.getElementById('weather-table');

    // let tableHTML = `
    //     <table>
    //         <thead>
    //             <tr>
    //                 <th> Date </th>
    //                 <th> Status </th>
    //                 <th> Temp High </th>
    //                 <th> Temp Low </th>
    //                 <th> Wind Speed </th>
    //             </tr>
    //         </thead>
    //         <tbody>
    // `;

    // forecast.forEach((day) => {
    //     const date = item.startTime.split('T')[0];
    //     const values = item.values;
    //     const weatherCode = values.weatherCode.toString();
    //     const weatherInfo = weatherCodeMap[weatherCode] || {description: "uknown", icon: ""};

    //     const row = document.createElement('table row');
    //     row.innerHTML = `
    //         <td> ${date} </td>
    //         <td> 
    //             <img src="${weatherInfo.icon}" alt="${weatherInfo.description}" width="20" heigh="20">
    //             ${weatherInfo.description}
    //         </td>
    //         <td> ${values.temperatureMax} </td>
    //         <td> ${values.temperatureMin} </td>
    //         <td> ${values.windSpeed} </td>
    //     `;
    //     weatherTableContent.appendChild(row);
    // });
    
    let tbl = document.createElement("table")
    let tblBody = document.createElement('tbody')

    let row = document.createElement('tr');
    row.innerHTML = `
        <div class="weather-table">
            <table>
                <thead>
                    <tr>
                        <th> Date </th>
                        <th> Status </th>
                        <th> Temp High </th>
                        <th> Temp Low </th>
                        <th> Wind Speed </th>
                    </tr>
                </thead>
            </table>
        </div>
    `;
    console.log(`row=${row.innerHTML}`);
    tblBody.appendChild(row);

    intervals.forEach((interval, i) => {
        // const date = new Date(interval.startTime).toLocaleDateString();
        
        const options = {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: 'America/Los_Angeles'
        };
        const date = new Date(interval.startTime).toLocaleDateString('en-US', options);

        // const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        // const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
        // const month = dateObj.toLocaleDateString('en-US', {month: 'short' });
        // const year = dateObj.toLocaleDateString('en-US', { year: 'numeric' });

        // const date = `${weekday}, ${day}, ${month}, ${year}`;

        // const date = new Date(interval.startTime).toLocaleDateString();
        // const day = String(date.getDate()).padStart(2, '0');
        // const month = date.toLocaleString('en-GB', { month: 'long' });
        // const year = date.getFullYear(); // Full year
        // const weekday = date.toLocaleString('en-GB', { weekday: 'long' });
        // const formatted_date = `${weekday}, ${day} ${month} ${year}`;

        const weatherCode = interval.values.weatherCode;
        const weatherStatus = weatherCodeMap[weatherCode].description
        const weatherIcon = weatherCodeMap[weatherCode].icon;
        const highTemp = interval.values.temperatureMax;
        const lowTemp = interval.values.temperatureMin;
        const windSpeed = interval.values.windSpeed;

        let row = document.createElement('tr');
        row.addEventListener('click', function(event) {
            showDetailedWeather(event.currentTarget);
        })
        row.innerHTML = `
            <div class="weather-table">
                <table>
                    <tbody>
                        <tr>
                            <td> ${date} </td>
                            <td>
                                <img src= ${weatherIcon} height="60" width="60" style="margin-bottom: -22px;"> 
                                <p id="weather-status"> ${weatherStatus} </p>
                            </td>
                            <td> ${highTemp} </td>
                            <td> ${lowTemp} </td>
                            <td> ${windSpeed} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        console.log(`row=${row.innerHTML}`);
        tblBody.appendChild(row);
    });

    tbl.appendChild(tblBody);
    weatherTableContent.appendChild(tbl);

    // tableHTML += `
    //         </tbody>
    //     </table>
    // `
    // weatherTableContent.innerHTML = tableHTML;

}

function showDetailedWeather(row) {
    console.log(`row=${row.innerHTML}`)

    const street = document.getElementById('street-name').value;
    const city = document.getElementById('city-name').value;
    const state = document.getElementById('state-name').value;
    const autoDetect = document.getElementById('auto-detect').checked;

    let fetchURL

    // if auto-detect is selected 
    if (autoDetect) {
        fetchURL = 'get_weather?auto_detect';
    }
    else {
        fetchURL = `get_weather?street=${street}&city=${city}&state=${state}`;
    }
    fetchURL += '&detail';

    console.log(`cell[0]=${JSON.stringify(row.cells[0].innerHTML)}`)
    date = new Date(row.cells[0].innerHTML).toISOString().split('T')[0];
    fetchURL += `&date=${date}`

    // const data = fetch(fetchURL)
    //     .then(response => response.json())
    //     .catch(error => {
    //         console.error("there was an error fetching weather data:", error)
    //         return null
    //     })
    // if (data) {
    //     displayData(data)
    // }

    // // fetch weather data from flask
    console.log(`${fetchURL}`)
    fetch(fetchURL).then(response => {
        if (!response.ok) {
            throw Error("try again: network response not okay");
        }
        return response.json();
    })
    .then(data => {
        console.log(`handle data`)
        console.log(`showDetailedWeather: data=${JSON.stringify(data)}`)

        document.getElementById("current-weather").style.display = 'none';
        document.getElementById("weather-table").style.display = 'none';
        document.getElementById("detailed-weather").style.display = 'block';
        document.getElementById("weather-chart-content").style.display = "block";
    
        displayDetailedWeather(data.data);
        displayWeatherChart(data.chart);
    })
    .catch(error => {
        console.log(`There was an error when displaying weather data: ${error}`);
    });

}

function displayDetailedWeather(weatherData) {
    const detailedContent = document.getElementById('detailed-content');
    detailedContent.innerHTML = '';

    const weatherValues = weatherData.values;
    const weatherStatus = weatherCodeMap[weatherValues.weatherCode].description;
    const weatherIcon = weatherCodeMap[weatherValues.weatherCode].icon;
    const highTemp = weatherData.values.temperatureMax;
    const lowTemp = weatherData.values.temperatureMin;
    const windSpeed = weatherData.values.windSpeed;
    const precipitationType = weatherData.values.precipitationType;
    const precipitationTypeName = precipitationTypeMap[weatherValues.precipitationType].description
    const precipitationProbability = weatherData.values.precipitationProbability;
    const humidity = weatherData.values.humidity;
    const visibility = weatherData.values.visibility;

    const options = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    };
    const date = new Date(weatherData.startTime).toLocaleDateString('en-US', options);

    // const date = new Date(interval.startTime).toLocaleDateString();
    // const day = String(date.getDate()).padStart(2, '0');
    // const month = date.toLocaleString('en-GB', { month: 'short' });
    // const year = date.getFullYear(); // Full year
    // const weekday = date.toLocaleString('en-GB', { weekday: 'long' });
    // const formatted_date = `${weekday}, ${day} ${month} ${year}`;

    sunrise = new Date(weatherData.values.sunriseTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    sunset = new Date(weatherData.values.sunsetTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });


    let content_html = `
            <table>
                <tbody>
                    <tr>
                        <td class="detailed-content-date" style="padding-bottom: 0; padding-left: 19px; width:100%;">${date} </td>
                    </tr>
                    <tr>
                        <td class="detailed-content-weather-status" style="padding-bottom: 0; padding-top: 0; padding-left: 8px;">${weatherStatus} </td>
                        <td class="detailed-content-weather-icon" style="padding-bottom: 0; padding-top: 0;"> <img src=${weatherIcon} height="40" width="40"> </td>
                    </tr>
                    <tr>
                        <td class="detailed-content-weather-high-low-temp" style="padding-bottom: 16px; padding-top: 0; padding-right: 4px; padding-left: 18px;">${highTemp}°F/${lowTemp}°F </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td style="font-size: 16px; color: white; text-align: right; width: 50%; padding:0; padding-top:40px;"> Precipitation:</td>
                        <td class="detailed-content-precipitation-type" style="font-size:16px; color: white; text-align:left; padding:0; padding-left:6px; padding-top:40px;">${precipitationTypeName} </td>
                    </tr>
                    <tr>
                        <td style="color: white; text-align: right; width: 50%; font-size: 16px; text-align: right; width: 50%; padding:0; padding-top:8px;"> Chance of Rain:</td>
                        <td class="detailed-content-precipitation-prob" style="text-align: left; font-size: 16px; color: white; width: 50%; padding:0; padding-left:6px; padding-top:8px;"> ${precipitationProbability}% </td>
                    </tr>
                    <tr>
                        <td style="color: white; text-align: right; width: 50%; font-size: 16px; text-align: right; width: 50%; padding:0; padding-top:8px;"> Wind Speed:</td>
                        <td class="detailed-content-wind-speed" style="text-align: left; font-size: 16px; color: white; width: 50%; padding:0; padding-left:6px; padding-top:8px;">${windSpeed} mph </td>
                    </tr>
                    <tr>
                        <td style="color: white; text-align: right; width: 50%; font-size: 16px; text-align: right; width: 50%; padding:0; padding-top:8px;">  Humidity:</td>
                        <td class="detailed-content-humidity" style="text-align: left; font-size: 16px; color: white; width: 50%; padding:0; padding-left:6px; padding-top:8px;">${humidity}% </td>
                    </tr>
                    <tr>
                        <td style="color: white; text-align: right; width: 50%; font-size: 16px; text-align: right; width: 50%; padding:0; padding-top:8px;"> Visibility:</td>
                        <td class="detailed-content-visibility" style="text-align: left; font-size: 16px; color: white; width: 50%; padding:0; padding-left:6px; padding-top:8px;">${visibility} mi </td>
                    </tr>
                    <tr>
                        <td style="color: white; text-align: right; width: 50%; font-size: 16px; text-align: right; width: 50%; padding: 0; padding-bottom:20px; padding-top:8px;"> Sunrise/Sunset:</td>
                        <td class="detailed-content-sunrise-sunset" style="text-align: left; font-size: 16px; color: white; width: 50%; padding-bottom:20px; padding-left:6px; padding-top:8px;">${sunrise}/${sunset} </td>
                    </tr>
                </tbody>
            </table>
    `
    detailedContent.innerHTML = content_html

    // document.getElementById('detailedDate').innerText = `Date: ${weatherData.startTime.split('T')[0]}`;
    // document.getElementById('detailedStatus').innerText = `Status: ${weatherData.weatherCode}`;
    // document.getElementById('detailedTemperature').innerText = `Temperature: High - ${weatherData.temperatureHigh}°C, Low - ${weatherData.temperatureLow}°C`;
    // document.getElementById('detailedPrecipitation').innerText = `Precipitation: ${weatherData.precipitationSum} mm`;
    // document.getElementById('detailedChanceOfRain').innerText = `Chance of Rain: ${weatherData.precipitationProbability}%`;
    // document.getElementById('detailedWindSpeed').innerText = `Wind Speed: ${weatherData.windSpeed} m/s`;
    // document.getElementById('detailedHumidity').innerText = `Humidity: ${weatherData.humidity}%`;
    // document.getElementById('detailedVisibility').innerText = `Visibility: ${weatherData.visibility} m`;
    // document.getElementById('detailedSunriseSunset').innerText = `Sunrise: ${weatherData.sunrise}, Sunset: ${weatherData.sunset}`;

    // Show the detailed weather section
    // document.getElementById('detailedWeather').style.display = 'block';
}

function displayWeatherChart(chartData) {
    console.log(`displayWeatherChart: chartData=${JSON.stringify(chartData)}`);
    displayChartRange(chartData.range);
    displayChartHourly(chartData.hourly);
    // displayChartRange(test_data_range);
    // displayChartHourly(test_data_hourly);
}

function click_weather_chart(event) {
    console.log(`click_weather_chart`);
    click_me = document.getElementById("weather-chart-click-me");
    chart_range = document.getElementById("weather-chart-range");
    chart_hourly = document.getElementById("weather-chart-hourly");
    console.log(`range display: ${JSON.stringify(chart_range)}`)
    if (chart_range.style.display == "none") {
        chart_range.style.display = "block";
        chart_hourly.style.display = "block";
        click_me.innerHTML = `<img src="/static/Images/point-up-512.png" height="32" width="32">`;
    }
    else if(chart_range.style.display == "block") {
        chart_range.style.display = "none";
        chart_hourly.style.display = "none";
        click_me.innerHTML = `<img src="/static/Images/point-down-512.png" height="32" width="32">`;
    }
}

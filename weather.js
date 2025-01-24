import {fetchDataOpenMeteo, fetchDataOpenWeather} from './api.js';
import {createHourlyForecastCards, createDailyForecastCards} from './ui.js';

const currentTemp = document.querySelector('.desc h1:nth-child(1)');
const currentWeather = document.querySelector('.desc h1:nth-child(2)');
const currentDesc = document.querySelector('.desc p');

const feelsLikeTemp = document.querySelector('.feels-like h1:nth-child(3)');
const feelsLikeDesc = document.querySelector('.feels-like p');

const precipitationValue = document.querySelector('.precipitation h1:nth-child(3)');
const precipitationDesc = document.querySelector('.precipitation p');

const visibilityValue = document.querySelector('.visibility h1:nth-child(3)');

const humidityValue = document.querySelector('.humidity h1:nth-child(3)');
const humidityDesc = document.querySelector('.humidity p');

const uvValue = document.querySelector('.uv-index h1');
const uvType = document.querySelector('.uv-index h2:nth-child(4)');

const windSpeedValue = document.querySelector('.wind div:nth-child(3) div:nth-child(1)');
const gustSpeedValue = document.querySelector('.wind div:nth-child(5) div:nth-child(1)');

const marker = document.querySelector('.marker');
const progressBarWidth = document.querySelector('.uv-scale').offsetWidth;

const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');

function setBackground(weatherCondition) {
    const body = document.body;
    const root = document.documentElement;

    switch (weatherCondition.toLowerCase()) {
        case 'thunderstorm':
            body.style.backgroundImage = "url('assets/images/thunderstorm.png')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(0, 0, 0, 0.6)');
            break;
        case 'drizzle':
            body.style.backgroundImage = "url('assets/images/drizzle.png')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(0, 0, 0, 0.4)');
            break;
        case 'rain':
            body.style.backgroundImage = "url('assets/images/rainy.png')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(0, 0, 0, 0.5)');
            break;
        case 'snow':
            body.style.backgroundImage = "url('assets/images/snow.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(255, 255, 255, 0.5)');
            break;
        case 'mist':
        case 'fog':
            body.style.backgroundImage = "url('assets/images/fog.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(200, 200, 200, 0.5)');
            break;
        case 'smoke':
            body.style.backgroundImage = "url('assets/images/smoke.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(100, 100, 100, 0.5)');
            break;
        case 'haze':
            body.style.backgroundImage = "url('assets/images/haze.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(150, 150, 150, 0.5)');
            break;
        case 'dust':
        case 'sand':
            body.style.backgroundImage = "url('assets/images/dust.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(200, 200, 200, 0.5)');
            break;
        case 'ash':
            body.style.backgroundImage = "url('assets/images/ash.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(100, 100, 100, 0.5)');
            break;
        case 'squall':
            body.style.backgroundImage = "url('assets/images/squall.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(0, 0, 0, 0.5)');
            break;
        case 'tornado':
            body.style.backgroundImage = "url('assets/images/tornado.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(0, 0, 0, 0.5)');
            break;
        case 'clear':
            body.style.backgroundImage = "url('assets/images/clear.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(255, 255, 255, 0.3)');
            break;
        case 'clouds':
            body.style.backgroundImage = "url('assets/images/cloudy.jpg')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(100, 100, 100, 0.5)');
            break;
        default:
            body.style.backgroundImage = "url('assets/images/background.png')";
            root.style.setProperty('--scrollbar-thumb-color', 'rgba(0, 0, 0, 0.3)');
            break;
    }
}

function updateCurrentWeather(temperature, weatherCondition, description) {
    currentTemp.textContent = temperature + '°C';
    currentWeather.textContent = weatherCondition;
    currentDesc.textContent = description;
    setBackground(weatherCondition);
}

function updateFeelsLike(feelsLikeTemperature, temperature, windSpeed, humidity) {
    feelsLikeTemp.textContent = feelsLikeTemperature.toFixed(0) + '°C';
    const humidityImpact = getFeelsLikeDescription(feelsLikeTemperature, temperature, humidity, windSpeed);
    feelsLikeDesc.textContent = `${humidityImpact}.`;
}

function updatePrecipitation(precipitation) {
    precipitationValue.textContent = precipitation;
    precipitationDesc.textContent = precipitation ? 'Rain expected' : 'No rain';
}

function updateVisibility(visibility) {
    visibilityValue.textContent = visibility + ' miles';
}

function updateHumidity(humidity) {
    humidityValue.textContent = humidity + '%';
    humidityDesc.textContent = `The dew point is ${calculateDewPoint(humidity)}° right now`;
}

function updateUV(uvIndex) {
    uvValue.textContent = uvIndex;
    uvType.textContent = getUVDescription(uvIndex);
}

function updateWind(windSpeed, gustsSpeed) {
    windSpeedValue.textContent = windSpeed;
    gustSpeedValue.textContent = gustsSpeed ? gustsSpeed : 'N/A';
}

function updateUvMarker(uvIndex) {
    const markerPosition = (progressBarWidth / 10) * uvIndex;
    marker.style.left = markerPosition + 'px';
}

function updateWeather(weatherData) {
    updateFeelsLike(weatherData.feelsLikeTemperature, weatherData.temperature, weatherData.windSpeed, weatherData.humidity);
    updatePrecipitation(weatherData.precipitation);
    updateVisibility(weatherData.visibility);
    updateHumidity(weatherData.humidity);
    updateUV(weatherData.uvIndex);
    updateUvMarker(weatherData.uvIndex);
    updateWind(weatherData.windSpeed, weatherData.gustsSpeed);
    updateCurrentWeather(weatherData.temperature, weatherData.weatherCondition, getWeatherDescription(weatherData.weatherCondition));
}

function getFeelsLikeDescription(feelsLikeTemperature, temperature, humidity, windSpeed) {
    if (feelsLikeTemperature !== temperature) {
        if (humidity > 70 && windSpeed < 10) {
            return "The high humidity combined with low wind speed can make it feel warmer than the actual temperature.";
        } else if (humidity < 30 && windSpeed > 15) {
            return "The low humidity combined with strong winds can make it feel cooler than the actual temperature.";
        } else {
            return "The 'feels like' temperature factor considers additional factors such as humidity and wind speed to estimate how the temperature actually feels.";
        }
    } else {
        return "The 'feels like' temperature is close to the actual temperature, indicating that weather conditions are relatively consistent.";
    }
}

function getUVDescription(uvIndex) {
    if (uvIndex < 3) return 'Low'; else if (uvIndex < 6) return 'Moderate'; else if (uvIndex < 8) return 'High'; else if (uvIndex < 11) return 'Very High'; else return 'Extreme';
}

function getWeatherDescription(weatherCondition) {
    switch (weatherCondition) {
        case 'Rain':
            return 'Expect rain showers.';
        case 'Drizzle':
            return 'Light rain showers expected.';
        case 'Thunderstorm':
            return 'Thunderstorms with lightning and heavy rain.';
        case 'Snow':
            return 'Snowfall expected.';
        case 'Mist':
            return 'Misty conditions with reduced visibility.';
        case 'Fog':
            return 'Foggy conditions with significantly reduced visibility.';
        case 'Smoke':
            return 'Smoke in the air, affecting visibility.';
        case 'Haze':
            return 'Hazy conditions with reduced visibility.';
        case 'Dust':
            return 'Dusty conditions, take precautions if you have respiratory issues.';
        case 'Sand':
            return 'Sandstorm or dusty conditions, take precautions.';
        case 'Ash':
            return 'Ash fall from volcanic activity.';
        case 'Squall':
            return 'Sudden, intense bursts of wind and rain.';
        case 'Tornado':
            return 'Tornadoes are possible, seek shelter immediately.';
        case 'Clear':
            return 'Clear skies and sunshine.';
        case 'Clouds':
            return 'Partly cloudy skies with a chance of showers.';
        default:
            return 'Weather description unavailable.';
    }
}

function calculateDewPoint(humidity) {
    const temperature = parseFloat(feelsLikeTemp.textContent);
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return Math.round(dewPoint);
}

function calculateAggregateHourlyTemperature(hourlyForecast) {
    try {
        const dailyAverageTemperatures = [];
        let sumTemp = 0;
        let count = 0;
        let currentDate = null;

        hourlyForecast.time.forEach((time, index) => {
            const date = new Date(time);
            const temperature = hourlyForecast.temperature_2m[index];

            if (!currentDate || date.getDate() !== currentDate.getDate()) {
                if (currentDate) {
                    const avgTemp = sumTemp / count;
                    dailyAverageTemperatures.push({date: currentDate, avgTemp});
                }

                currentDate = date;
                sumTemp = temperature;
                count = 1;
            } else {
                sumTemp += temperature;
                count++;
            }
        });

        if (currentDate) {
            const avgTemp = sumTemp / count;
            dailyAverageTemperatures.push({date: currentDate, avgTemp});
        }

        return dailyAverageTemperatures;
    } catch (error) {
        console.error("Error while aggregating hourly temperature data:", error);
        return [];
    }
}

async function createCards(latitude, longitude) {
    try {
        const hourlyForecast = await fetchDataOpenMeteo(latitude, longitude);
        const dailyAverageTemperatures = calculateAggregateHourlyTemperature(hourlyForecast);

        if (!dailyAverageTemperatures || dailyAverageTemperatures.length === 0) {
            console.error("Failed to calculate daily average temperatures");
        }

        createHourlyForecastCards(hourlyForecast, 'hourlyForecastCard');
        createDailyForecastCards(dailyAverageTemperatures, 'dailyForecastCard');
    } catch (error) {
        console.error(error);
    }
}

searchButton.addEventListener('click', function () {
    handleSearch().then(() => console.log('Search completed'));
});

searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        handleSearch().then(() => console.log('Search completed'));
    }
});

function getCityAndCountry(inputValue) {
    const regex = /^([a-zA-Z\s]+),\s*([a-zA-Z\s]+)$/;

    const match = inputValue.match(regex);

    if (match) {
        const city = match[1].trim();
        const country = match[2].trim();
        return {city, country};
    } else {
        alert('Invalid input format. Please enter in city, country format.');
        return null;
    }
}

export const handleSearch = async () => {
    try {
        const inputElement = document.querySelector('.search-bar input');
        const inputValue = inputElement.value.trim();

        const cityAndCountry = getCityAndCountry(inputValue);

        if (!cityAndCountry) {
            console.error('Invalid input format. Please enter in city, country format.');
            return;
        }

        const weatherData = await fetchDataOpenWeather(cityAndCountry.city, cityAndCountry.country);
        updateWeather(weatherData);
        await createCards(weatherData.latitude, weatherData.longitude);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

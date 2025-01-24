export function defaultData() {
    return {
        temperature: 50,
        weatherCondition: 'Rainy',
        humidity: 50,
        precipitation: 5,
        visibility: 5,
        windSpeed: 5,
        gustsSpeed: 5,
        uvIndex: 5
    };
}

export async function fetchDataOpenWeather(cityName, countryName) {
    try {
        const apiKey = 'your-api-key';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryName}&appid=${apiKey}&units=metric`);

        if (!response.ok) {
            console.error('Failed to fetch weather data');
        }

        const data = await response.json();
        console.log(data);

        const latitude = data.coord.lat;
        const longitude = data.coord.lon;

        const rawTemperature = data.main.temp;
        const temperature = isValidTemperature(rawTemperature) ? rawTemperature : null;

        const rawFeelsLikeTemperature = data.main.feels_like;
        const feelsLikeTemperature = isValidTemperature(rawFeelsLikeTemperature) ? rawFeelsLikeTemperature : null;

        const weatherCondition = data.weather && data.weather[0] ? data.weather[0].main : null;
        const weatherDescription = data.weather && data.weather[0] ? data.weather[0].description : null;

        const humidity = data.main && data.main.humidity ? data.main.humidity : null;
        const precipitation = data.rain ? data.rain['1h'] : 0;
        const visibility = data.visibility || null;
        const windSpeed = data.wind && data.wind.speed ? data.wind.speed : null;

        const gustsSpeed = data.wind && data.wind.gust ? data.wind.gust : "No Data available";

        const uvIndex = data.uvi !== undefined ? data.uvi : 3;

        return {
            latitude,
            longitude,
            temperature,
            feelsLikeTemperature,
            weatherCondition,
            weatherDescription,
            humidity,
            precipitation,
            visibility,
            windSpeed,
            gustsSpeed,
            uvIndex
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return defaultData();
    }
}

export async function fetchDataOpenMeteo(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`);

        if (!response.ok) {
            console.error("Failed to fetch hourly data");
        }

        const data = await response.json();

        if (!data.hourly) {
            console.error("Incomplete or unexpected data received from the API");
        }

        console.log(data);

        return data.hourly;
    } catch (error) {
        console.error("Error fetching hourly data:", error);
        throw error;
    }
}

function isValidTemperature(temperature) {
    return typeof temperature === 'number' && !isNaN(temperature);
}
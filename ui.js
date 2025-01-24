export function createHourlyForecastCards(hourlyForecast, targetId) {
    const forecastTemplate = document.getElementById(targetId);

    forecastTemplate.innerHTML = '';

    const forecastLength = hourlyForecast.time.length;

    const startIndex = Math.max(0, forecastLength - 20); 

    for (let i = forecastLength - 1; i >= startIndex; i--) {
        const time = hourlyForecast.time[i];
        const temperature = hourlyForecast.temperature_2m[i];

        const card = document.createElement('div');
        card.classList.add('card');

        const timeElement = document.createElement('div');
        const valueElement = document.createElement('div');
        timeElement.textContent = formatTime(time);
        valueElement.textContent = formatTemperature(temperature);
        card.appendChild(timeElement);
        card.appendChild(valueElement);

        forecastTemplate.appendChild(card);
    }
}

export function createDailyForecastCards(dailyForecast, targetId) {
    const forecastTemplate = document.getElementById(targetId);

    forecastTemplate.innerHTML = '';

    dailyForecast.forEach(({ date, avgTemp }) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const dateElement = document.createElement('div');
        const tempElement = document.createElement('div');
        dateElement.textContent = formatDate(date);
        tempElement.textContent = formatTemperature(avgTemp);
        card.appendChild(dateElement);
        card.appendChild(tempElement);

        forecastTemplate.appendChild(card);
    });
}

function formatTime(time) {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatTemperature(temperature) {
    return `${Math.round(temperature)}°`;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    return `${day}/${month}`;
}
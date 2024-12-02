document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });

    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 1000);
    });

    const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
    const CITY = 'Wingate';
    const STATE_CODE = 'NC';
    const COUNTRY_CODE = 'US';

    async function getWeather() {
        try {
            // Get coordinates first
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${CITY},${STATE_CODE},${COUNTRY_CODE}&limit=1&appid=${API_KEY}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            
            if (geoData.length === 0) throw new Error('Location not found');
            
            const { lat, lon } = geoData[0];
            
            // Get weather data
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            updateWeatherUI(weatherData);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    }

    function updateWeatherUI(data) {
        // Update temperature
        document.querySelector('.main').textContent = `${Math.round(data.main.temp)}°`;
        
        // Update weather description
        document.querySelector('.mainsub').textContent = data.weather[0].main;
        
        // Update humidity
        document.querySelector('.percentage').textContent = `${data.main.humidity}%`;
        
        // Update feels like temperature
        document.querySelector('.realfeel div:first-child').textContent = `${Math.round(data.main.feels_like)}°`;
        
        // Update AQI (Note: This requires a separate API call for accurate data)
        // For now, we'll use a placeholder based on general conditions
        const quality = data.main.humidity < 60 ? 'Good' : 'Moderate';
        document.querySelector('.quality').textContent = quality;
        
        // Update weather icon
        updateWeatherIcon(data.weather[0].icon);
    }

    function updateWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'sun',
            '01n': 'moon',
            '02d': 'cloud-sun',
            '02n': 'cloud-moon',
            '03d': 'cloud',
            '03n': 'cloud',
            '04d': 'clouds',
            '04n': 'clouds',
            '09d': 'cloud-showers-heavy',
            '09n': 'cloud-showers-heavy',
            '10d': 'cloud-rain',
            '10n': 'cloud-rain',
            '11d': 'bolt',
            '11n': 'bolt',
            '13d': 'snowflake',
            '13n': 'snowflake',
            '50d': 'smog',
            '50n': 'smog'
        };

        const iconClass = iconMap[iconCode] || 'sun';
        const weatherIcon = document.querySelector('.weather-icon');
        weatherIcon.innerHTML = `<i class="fas fa-${iconClass}"></i>`;
    }

    // Initial weather fetch
    getWeather();

    // Update weather every 30 minutes
    setInterval(getWeather, 30 * 60 * 1000);
}); 
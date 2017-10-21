function attachEvents() {
    let location = $('#location');
    let todayForecast = $('#current');
    let threeDayForecast = $('#upcoming');

    $('#submit').click(getWeather);
    let weatherAndIcon = {
        'Sunny': '&#x2600;', // ☀
        'Partly sunny': '&#x26C5', // ⛅
        'Overcast': '&#x2601', // ☁
        'Rain': '&#x2614', // ☂
    };

    let degrees = '&#176;';

    function getWeather() { //for all locations
        let req = {
            url: 'https://judgetests.firebaseio.com/locations.json',
            success: getLocationWeather
        };
        $.ajax(req);
    }

    function getLocationWeather(data) {
        $('#forecast').show();

        for (city of data) {
            if (city.name === location.val()) {
                let req = {
                    url: `https://judgetests.firebaseio.com/forecast/today/${city.code}.json`,
                    success: getTodayWeather
                };
                $.ajax(req);
                req = {
                    url: `https://judgetests.firebaseio.com/forecast/upcoming/${city.code}.json`,
                    success: getThreeDayForecast
                };
                $.ajax(req);
            }
        }

        function getTodayWeather(data) {
            let todayWeatherData = data.forecast;
            let conditionsData = todayWeatherData.condition;
            todayForecast.append(`<span class="condition symbol">${weatherAndIcon[conditionsData]}</span>`);

            let conditons = $('<span class="condition"></span>')
                .append(`<span class="forecast-data">${data.name}</span>`)
                .append(`<span class="forecast-data">${todayWeatherData.low}${degrees}/${todayWeatherData.high}${degrees}</span>`)
                .append(`<span class="forecast-data">${conditionsData}</span>`);
            todayForecast.append(conditons);
        }

        function getThreeDayForecast(data) {
            let threeDayWeather = data.forecast;

            for (day of threeDayWeather) {
                let upcoming = $('<span class="upcoming"></span>')
                    .append(`<span class="symbol">${weatherAndIcon[day.condition]}</span>`)
                    .append(`<span class="forecast-data">${day.low}${degrees}/${day.high}${degrees}</span>`)
                    .append(`<span class="forecast-data">${day.condition}</span>`);

                threeDayForecast.append(upcoming);
            }
        }
    }
}
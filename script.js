const searchedCity = document.getElementById("searchedCity")
const citySearch = document.getElementById("citysearch")
const submitSearch = document.getElementById("submitSearch")

const formSubmit = (e) => {
    e.preventDefault();
    let cityName = searchedCity.ariaValueMax.trim();
    //getting city data
    if (cityName) {
        queryData(cityName);
        cityName.value = "";
    } else {
        alert("type a city");
        //alert 
    }
    citySearch.requestFullscreen();
}

let seacchHistory = [];
// fetch api
function queryData(cityName) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=cdd74a08c442bae4832f3c6ac7a6cb54")
    .then(response => {
        return response.json();
    })
    .then(cityData => {
        // alert if not found
        if (cityData.message === "not found") {
            alert("check city!");
            return;
        };
        //adding searches to local strage
        savedSearch(cityName);

        //this is for the fetch requests
        const latt = cityData.coord.lat
        const long = cityData.coord.lon
        const weatherPic = cityData.weather[0].icon
        const typePic = document.getElementById("typePicture");

        //data for city searched
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${long}&units=imperial&exclude=minutely,hourly,alerts&appid=cdd74a08c442bae4832f3c6ac7a6cb54")
        .then(weatherData => {
            fiveForcast(weatherData)
            const date = new Date(weatherData.current.dt * 1000);
            const currentDate = Intl.DateTimeFormat("en-US").format(date);

            //UV
            const UVI = Math.round(weatherData.current.uvi);


            //current data
            if (UVI < 3) {
                document.getElementById('UVI').classList.remove("moderateRiskUVI", "moderateHighRiskUVI", "highRiskUVI", "extremeRiskUVI");
                document.getElementById('UVI').classList.add("lowRiskUVI");
            } else if (UVI >=3 && UVI < 5) {
                document.getElementById('UVI').classList.remove("lowRiskUVI", "moderateHighRiskUVI", "highRiskUVI", "extremelRiskUVI");
                document.getElementById('UVI').classList.add("moderateRiskUVI");
            } else if (UVI >=5 && UVI < 7) {
                document.getElementById('UVI').classList.remove("lowRiskUVI", "moderateRiskUVI", "highRiskUVI", "extremelRiskUVI");
                document.getElementById('UVI').classList.add("moderateHighRiskUVI");
            } else if (UVI >=7 && UVI <= 10) {
                document.getElementById('UVI').classList.remove("lowRiskUVI", "moderateRiskUVI", "moderateHighRiskUVI","extremelRiskUVI");
                document.getElementById('UVI').classList.add("highRiskUVI");
            } else {
                document.getElementById('UVI').classList.remove("lowRiskUVI", "moderateRiskUVI", "moderateHighRiskUVI", "highRiskUVI");
                document.getElementById('UVI').classList.add("extremelRiskUVI");
            }

            // current weather data
            document.getElementById('searchedCityName').innerHTML = '' + cityName + currentDate + '';
            document.getElementById('humidityNow').innerHTML = 'Humidity: ' + weatherData.current.humidity + '%';
            document.getElementById('windNow').innerHTML = 'Wind: ' + weatherData.current.wind_speed + ' MPH';
            document.getElementById('tempNow').innerHTML = 'Temperature: ' + Math.round(weatherData.current.temp) + '°F';
            document.getElementById('UVI').innerHTML = 'UV Index: ' + weatherData.current.uvi;


        })
    });
};


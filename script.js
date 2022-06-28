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

            getSearchHistory();
        })
    });
};
//next 5 days
function fiveDayforecast(forecast) {
    // clear 5-day forecast data, if there is any
    $('#fiveDayContainer').empty();
    // remove old data add new
    for (let i = 0; i < 5; i++) {
        displayDailyforecast(forecast.daily[i]);
    }
};

function displayDailyforecast(fiveDayData) {
    // retrieve the data we need from what was returned from the fetch requests
    const date = Intl.DateTimeFormat('en-US').format(new Date(fiveDayData.dt * 1000));
    const typePicture = fiveDayData.weather[0].icon;
    const TEMP = fiveDayData.temp.day;
    const HUMIDITY = fiveDayData.humidity;
    const WIND = fiveDayData.wind_speed;

    // dynamically create cards for each of the next 5 days weather
    const dailyCard = `
        <div class="column col s12 m6">
            <div class="card">
                <ul class="list-group list-group-flush">
                    <h4 class="list-group-item date">${date}</h4>
                    <img class="list-group-item weather-icon" src="https://openweathermap.org/img/wn/${typePicture}@2x.png" alt="Picture of the weather type">
                    <li class="list-group-item temp">Temperature: ${Math.round(TEMP)}°F </li>
                    <li class="list-group-item wind">Wind Speed: ${WIND} </li>
                    <li class="list-group-item humidity">Humidity: ${HUMIDITY}% </li>
                </ul>
            </div>
        </div>
    `;

    // append the card to the parent element
    $('#fiveDayContainer').append(dailyCard);
};

function saveSearchHistory(cityName) {
    searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};

// get search history from localStorage
function getSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // clear SH buttons of any content they have
    $("#searchHistoryBtns").empty();
    // if there is search history in localStorage
    if (searchHistory.length > 0) {
        // take each one
        for(let i = 0; i < searchHistory.length; i++) {
            // create a button element for it
            let historyItem = $('<button>').attr('class', 'btn btn-secondary searchHistoryBtns').text(searchHistory[i]);
            // and append it to the parent element
            $("#searchHistoryBtns").append(historyItem);
        }
    }
};

// load search history from localStorage
getSearchHistory();



// add event listener to search form
citySearch.addEventListener('submit', formSubmit);

$(document).on('click', '.searchHistoryBtns', function(onClick) {
    onClick.preventDefault();
    this.value = '';
    const displayClickedCity = this.textContent;
    queryData(displayClickedCity);
});
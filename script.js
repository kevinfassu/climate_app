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
    })
}
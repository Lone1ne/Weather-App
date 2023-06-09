$(function () {
  //create get weather data function and pass in the city
  var weatherApiKey = "c0c121fba052263fed9243172c4438c8";
  function getWeatherData(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        //grab specific data we want to use
        $("#weather-title").text(`${data.name} - ${data.weather[0].main}`);
        $("#weather-temp").text(`Temperature: ${data.main.temp}°F`);
        $("#weather-humidity").text(`Humidity: ${data.main.humidity}%`);
        $("#weather-wind").text(`Wind Speed: ${data.wind.speed} mph`);
        $("#weather-icon").attr(
          "src",
          `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        );
      },
    });
  }
  function getForecastData(city) {
    $.ajax({
      //get latitude and longitude data using city input and geo api
      url: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;

        //make another call to use lat and lon to get forecast data
        $.ajax({
          url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`,
          type: "GET",
          dataType: "json",
          success: function (data) {
            //clear existing forecast cards
            $("#forecast-container").empty();

            //loop through data list and get forecast for 5 days
            //since our endpoint is 3-hour 5 day, we get back 40 data points. in order to return 5 we need to grab every 8

            for (let i = 0; i < data.list.length; i += 8) {
              var date = data.list[i].dt_txt;
              var forecastDate = date.substring(5, 10);

              var forecastCard = `
                <div class="col-sm-12 col-md-4 col-lg-2 my-2">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">${forecastDate}</h5>
                      <p class="card-text">Temp: ${data.list[
                        i
                      ].main.temp.toFixed(2)}°F</p>
                      <p class="card-text">Humidity: ${
                        data.list[i].main.humidity
                      }%</p>
                      <p class="card-text">Wind Speed: ${
                        data.list[i].wind.speed
                      } mph</p>
                      <img src="http://openweathermap.org/img/wn/${
                        data.list[i].weather[0].icon
                      }.png" alt="Weather Icon" />
                    </div>
                  </div>
                </div>`;

              //append the new forecast card to the container
              $("#forecast-container").append(forecastCard);
            }
          },
        });
      },
    });
  }

  function searchHistory() {
    // get the search history from localStorage
    var history = JSON.parse(localStorage.getItem("history")) || [];

    // clear the existing search history
    $("#history").empty();

    // for each city in the search history
    for (let i = 0; i < history.length; i++) {
      // create a new history item element
      var historyItem = $("<li>").addClass("history-item").text(history[i]);

      // append the history item to the search history container
      $("#history").append(historyItem);
    }
  }
  //event listener on search button
  $("#search-btn").on("click", function () {
    //grab city input value
    var city = $("#city-input").val();

    // get the existing search history
    var history = JSON.parse(localStorage.getItem("history")) || [];

    // if the city does not exist in the search history
    if (!history.includes(city)) {
      // add city to the search history
      history.push(city);
    }
    // save search history to the localStorage
    localStorage.setItem("history", JSON.stringify(history));

    //call the weather data function
    getWeatherData(city);
    getForecastData(city);
    searchHistory();
  });
  //event listener on search history items
  $("#history").on("click", ".history-item", function () {
    // get the name of the city
    var city = $(this).text();

    // display the weather data for the city
    getWeatherData(city);
    getForecastData(city);
  });

  $("#clear-history-btn").on("click", function () {
    // Clear the search history from local storage
    localStorage.removeItem("history");

    // Clear the displayed list
    $("#history").empty();
  });

  //get search history for the local storage
  var history = JSON.parse(localStorage.getItem("history")) || [];
  var lastCity;

  if (history.length > 0) {
    // get the last city from the search history
    lastCity = history[history.length - 1];
  } else {
    // default to Denver if there's no city in local storage
    lastCity = "Denver";
  }

  // display the weather data for the last city or Denver
  getWeatherData(lastCity);
  getForecastData(lastCity);

  // display the search history when the page loads
  searchHistory();
});

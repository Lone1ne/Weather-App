$(function () {
  //create get weather data function and pass in the city
  var weatherApiKey = "c0c121fba052263fed9243172c4438c8";
  function getWeatherData(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        //grab specific data we want to use
        console.log(data);
        console.log(`${data.name}`);
        console.log(`${data.weather[0].main}`);
        //change temp from kelvins to F
        console.log(`${((data.main.temp * 9) / 5 - 459.67).toFixed(2)}`);
        console.log(`${data.weather[0].icon}`);
        console.log(`${data.wind.speed}`);
        console.log(`${data.main.humidity}`);
      },
    });
  }
  function getForecastData(city) {
    $.ajax({
      //get latitude and longitude data using city input and geo api
      url: `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;

        //make another call to use lat and lon to get forecast data
        $.ajax({
          url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`,
          type: "GET",
          dataType: "json",
          success: function (data) {
            console.log(data);
            //loop through data list and get forecast for 5 days
            //since our endpoint is 3-hour 5 day, we get back 40 data points. in order to return 5 we need to grab every 8
            for (let i = 0; i < data.list.length; i += 8) {
              //change temp from kelvins to F
              console.log(
                `${((data.list[i].main.temp * 9) / 5 - 459.67).toFixed(2)}`
              );
              console.log(`${data.list[i].weather[0].icon}`);
              console.log(`${data.list[i].wind.speed}`);
              console.log(`${data.list[i].main.humidity}`);
              console.log(`${data.list[i].dt_txt}`);
            }
          },
        });
      },
    });
  }
  //event listener on search button
  $("#search-btn").on("click", function () {
    //grab city input value
    var city = $("#city-input").val();
    localStorage.setItem("city", city);
    //call the weather data function
    getWeatherData(city);
    getForecastData(city);
  });
});

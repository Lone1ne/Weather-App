$(function () {
  //create get weather data function and pass in the city
  var weatherApiKey = "c0c121fba052263fed9243172c4438c8";
  function getWeatherData(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log(data);
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

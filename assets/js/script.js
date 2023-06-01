$(function () {
  //create get weather data function and pass in the city
  function getWeatherData(city) {
    var weatherApiKey = "c0c121fba052263fed9243172c4438c8";

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log(data);
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
  });
});

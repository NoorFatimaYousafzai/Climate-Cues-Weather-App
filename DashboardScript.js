$(document).ready(function(){

    //Used to display the temperature of the user's current location and populate the charts according to it to.
    if("geolocation" in navigator)
    {
        const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
        const UnitOfTemperature = 'metric';

        navigator.geolocation.getCurrentPosition(CurrentPosition => {

            const Latitude = CurrentPosition.coords.latitude;
            const Longitude = CurrentPosition.coords.longitude;

            $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&appid=${APIKey}&units=${UnitOfTemperature}`, function(data){
                
                $("#SpinnerLoader").hide();

                const CityName = data.city.name;
                console.log("City Name from Current Weather API: " + CityName);
                DisplayWeatherWidget(CityName, APIKey, UnitOfTemperature);
            
            });

            FiveDayWeatherForcastData(Latitude, Longitude, APIKey, UnitOfTemperature);

        })
    }

     //Event handler on seacrh button that is used to display the temperature of the city that the user seacrhed for and populate the charts according to it to.
    $("#SearchButton").click(function(){

        const CityName = $("#CityName").val();
        const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
        const UnitOfTemperature = 'metric';

        DisplayWeatherWidget(CityName, APIKey, UnitOfTemperature);
       
    });

});

//This function is used to display the location, temperature, icon, description, humidity value and speed value in the weather widget.
//This function gets this information from openweathermap using the city name provided by the user.
//The background image of the weather widget is changed according to the weather description.
function DisplayWeatherWidget(CityName, APIKey, UnitOfTemperature)
{
    $.getJSON(`https://api.openweathermap.org/data/2.5/weather?q=${CityName}&appid=${APIKey}&units=${UnitOfTemperature}`).done(function(data){

        $("#SpinnerLoader").hide();
        
        if(data.cod != 200)
        {
            alert("No Such City Found!");
        }
        else
        {
            const City = data.name;
            const WeatherDescription = data.weather[0].description;
            const Icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            const Temperature = data.main.temp;
            const Humidity = data.main.humidity;
            const WindSpeed = data.wind.speed;

            $("#LocationValue").text(City);
            $("#WeatherDescriptionValue").text(WeatherDescription);
            $("#weatherIcon").attr("src", Icon);
            $("#TemperatureValue").text(Temperature);
            $("#HumidityValue").text(Humidity);
            $("#WindSpeedValue").text(WindSpeed);

            FindingLatitudeAndLongitude(City, APIKey, UnitOfTemperature);

            if(WeatherDescription.includes('clear'))
            {
                $("#WeatherWidget").css({
                    "background-image": "url('images/clear.png')"
                });

                $("#Humidity").css({
                    "background-color": "#E6F2F4"
                });

                $("#WindSpeed").css({
                    "background-color": "#E6F2F4"
                });

                $(".fa-droplet, .fa-wind").css({
                    "color": "#00aaff"
                });

                $("#WeatherDescriptionValue, #TemperatureValue, sup, #LocationValue").css({
                    "color": "#FFF0F5"
                });
       
            }
            else if(WeatherDescription.includes('clouds'))
            {
                $("#WeatherWidget").css({
                    "background-image": "url('/images/Cloudy.jpg')"
                });

                $("#Humidity").css({
                    "background-color": "#E6F2F4"
                });

                $("#WindSpeed").css({
                    "background-color": "#E6F2F4"
                });

                $(".fa-droplet, .fa-wind").css({
                    "color": "black"
                });

                $("#WeatherDescriptionValue, #TemperatureValue, sup, #LocationValue").css({
                    "color": "white"
                });
            }
            else if(WeatherDescription.includes('rain'))
            {
                $("#WeatherWidget").css({
                    "background-image": "url('/images/Rain.jpg')"
                });

                $("#Humidity").css({
                    "background-color": "#E6F2F4"
                });

                $("#WindSpeed").css({
                    "background-color": "#E6F2F4"
                });

                $("#WeatherDescriptionValue, #TemperatureValue, sup, #LocationValue").css({
                    "color": "#FFF0F5"
                });

                $(".fa-droplet, .fa-wind").css({
                    "color": "black"
                });
            }
            else if(WeatherDescription.includes('thunder'))
            {
                $("#WeatherWidget").css({
                    "background-image": "url('/images/Thunderstorm.jpg')"
                });

                $("#Humidity").css({
                    "background-color": "#E6F2F4"
                });

                $("#WindSpeed").css({
                    "background-color": "#E6F2F4"
                });

                $("#WeatherDescriptionValue, #TemperatureValue, sup, #LocationValue").css({
                    "color": "white"
                });

                $(".fa-droplet, .fa-wind").css({
                    "color": "black"
                });
            }
            else if(WeatherDescription.includes('snow'))
            {
                $("#WeatherWidget").css({
                    "background-image": "url('/images/Snow.jpg')"
                });

                $("#Humidity").css({
                    "background-color": "#E6F2F4"
                });

                $("#WindSpeed").css({
                    "background-color": "#E6F2F4"
                });

                $("#WeatherDescriptionValue, #LocationValue").css({
                    "color": "black"
                });

                $("#TemperatureValue, sup").css({
                    "color": "black"
                });

                $(".fa-droplet, .fa-wind").css({
                    "color": "black"
                });
            }
            else if(WeatherDescription.includes('mist') || WeatherDescription.includes('fog') || WeatherDescription.includes('haze') ||  WeatherDescription.includes('smoke'))
            {
                $("#WeatherWidget").css({
                    "background-image": "url('/images/MistAndFog.jpg')"
                });

                $("#Humidity").css({
                    "background-color": "#E6F2F4"
                });

                $("#WindSpeed").css({
                    "background-color": "#E6F2F4"
                });

                $("#WeatherDescriptionValue, #LocationValue").css({
                    "color": "black"
                });

                $("#TemperatureValue, sup").css({
                    "color": "black"
                });

                $(".fa-droplet, .fa-wind").css({
                    "color": "black"
                });
            }

        }

    }).fail(function(){
        alert("Error in fetching data");
    })
   
}

//This function uses the openweathermap api to get the corresponding latitude and longitude of the city passed as the parameter.
function FindingLatitudeAndLongitude(CityName, APIKey, UnitOfTemperature)
{
    $.getJSON(`https://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${APIKey}`, function (data) {  

        if(data.length == 0)
        {
            alert("No Such City Found!");
        }
        else
        {
            const Latitude = data[0].lat;
            const Longitude = data[0].lon;
            FiveDayWeatherForcastData(Latitude, Longitude, APIKey, UnitOfTemperature);
        }
    });
}

//This function uses the openweathermap api to get the 5 day weather information using the latitude and longitude of the city.
//This information is then used to populate the bar, doughnut and line graph.
function FiveDayWeatherForcastData(Latitude, Longitude, APIKey, UnitOfTemperature)
{
    $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&appid=${APIKey}&units=${UnitOfTemperature}`, function(data){

        const EntireForcastData = data.list;
        const ListOfTemperaturesFiveDays = [];
        const ListOfDatesFiveDays = [];
        const ListOfWeatherDescription = [];

        for(var i = 0; i < EntireForcastData.length; i+=8)
        {
            const Temperature = EntireForcastData[i].main.temp;
            ListOfTemperaturesFiveDays.push(Temperature);

            const dateObject = new Date(EntireForcastData[i].dt_txt);
            const options = { weekday: 'short' };
            const dayOfWeek = dateObject.toLocaleDateString('en-US', options);
            const dayOfMonth = dateObject.getDate(); 
            const DateCorrectFormat = `${dayOfWeek}, ${dayOfMonth}`; 
            
            ListOfDatesFiveDays.push(DateCorrectFormat);

            const WeatherDescription = EntireForcastData[i].weather[0].main;
            ListOfWeatherDescription.push(WeatherDescription);
        } 
    
        VerticalBarChart(ListOfDatesFiveDays, ListOfTemperaturesFiveDays);
        LineChart(ListOfDatesFiveDays, ListOfTemperaturesFiveDays);
        DoughnutChart(ListOfWeatherDescription);
    });

}

let verticalBarChart, doughnutChart, lineChart;

//This function is used to display the vertical bar chart.
function VerticalBarChart(XAxis, YAxis)
{
    if(verticalBarChart)
    {
        verticalBarChart.destroy();
    }

    var VerticalBarChartColors = ["#FFB5A5", "#7DE4DD", "#9FDEFF", "#C3A0F6", "#FF6EAA"]

    verticalBarChart = new Chart("VerticalBarChart", {
        type: "bar",
        data: {
          labels: XAxis,
          datasets: [{
            backgroundColor: VerticalBarChartColors,
            data: YAxis,
          }]
        },
        options: {
            
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Vertical Bar Chart - Date VS Temperature (°C)"
                }
            }
          },
        animations:{
            delay: 2000
        }
        });
}

//This function is used to display the doughnut chart.
function DoughnutChart(ListOfWeatherDescription)
{
   
    if(doughnutChart)
    {
        doughnutChart.destroy();
    }

    let Clear = 0;
    let Cloudy = 0;
    let Rain = 0;
    let Thunderstorm = 0;
    let Snow = 0;
    let MistAndFog = 0;

    for (var i = 0; i < ListOfWeatherDescription.length; i++) {
        const description = ListOfWeatherDescription[i].toLowerCase();
        if (description.includes('clear')) {
            Clear++;
        } else if (description.includes('clouds')) {
            Cloudy++;
        } else if (description.includes('rain')) {
            Rain++;
        } else if (description.includes('thunder')) {
            Thunderstorm++;
        } else if (description.includes('snow')) {
            Snow++;
        } else if (description.includes('mist') || description.includes('fog') || description.includes('haze')) {
            MistAndFog++;
        }
    }


    const XAxis = [];
    const YAxis = [];

    if(Clear > 0)
    {
        XAxis.push("Clear");
        YAxis.push(Clear);
    }

    if(Cloudy > 0)
    {
        XAxis.push("Cloudy");
        YAxis.push(Cloudy);
    }

    if(Thunderstorm > 0)
    {
        XAxis.push("Thunderstorm");
        YAxis.push(Thunderstorm);
    }

    if(Rain > 0)
    {
        XAxis.push("Rain");
        YAxis.push(Rain);
    }

    if(Snow > 0)
    {
        XAxis.push("Snow");
        YAxis.push(Snow);
    }

    if(MistAndFog > 0)
    {
        XAxis.push("Mist And Fog");
        YAxis.push(MistAndFog);
    }

   
    var DoughnutChartColors = ["#9FDEFF", "#C3A0F6", "#FFB5A5",  "#7DE4DD", "#FF6EAA", "#D0F4DE"];
    doughnutChart = new Chart("DoughnutChart", {
        type: "doughnut",
        data: {
          labels: XAxis,
          datasets: [{
            backgroundColor: DoughnutChartColors,
            data: YAxis,
          }]
        },
        options: {
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: "Doughnut Chart"
                }
            }
          },
        animations:{
            delay: 2000
        }
        });
}

//This function is used to display the line chart.
function LineChart(XAxis, YAxis)
{
    if(lineChart)
    {
        lineChart.destroy();
    }


    var LineChartColors = ["#FFB5A5", "#7DE4DD", "#9FDEFF", "#C3A0F6", "#FF6EAA"];
    lineChart = new Chart("LineChart", {
        type: "line",
        data: {
          labels: XAxis,
          datasets: [{
            backgroundColor: LineChartColors,
            data: YAxis,
            pointBorderColor: '#000',
            pointRadius: 4,
            borderColor: '#A9A9A9',
          }]
        },
        options: {
            
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Line Chart - Date VS Temperature(°C)"
                }
            }
          },
        animations: {
            duration: 2000, 
            easing: 'easeInOutCubic', 
        }
        });
}

$(document).ready(function(){

    //Event handler is added on the Celcius part of the toggle button.
    //When clicked it converts the temperature in to Fahrenheit.
    $("#Cel").click(function(){

        const TemperatureValue = $("#TemperatureValue");
        const TemperatureUnit = $("#TemperatureUnit");
        let Temperature = parseFloat(TemperatureValue.text());

        if(TemperatureUnit.text().includes("°F"))
        {
            const TemperatureInCelcius = (Temperature - 32) * 5/9;
            TemperatureValue.text(TemperatureInCelcius.toFixed(2));
            $("#SuperScriptTemp").text("°C");
        }
       
        $("#Cel").css({"background-color": "#81CEEB"});
        $("#Far").css({"background-color": "#E6F2F4"});
    });

    //Event handler is added on the Fahrenheit part of the toggle button.
    //When clicked it converts the temperature in to Celcius.
    $("#Far").click(function(){

        const TemperatureValue = $("#TemperatureValue");
        const TemperatureUnit = $("#TemperatureUnit");
        let Temperature = parseFloat(TemperatureValue.text());

        if(TemperatureUnit.text().includes("°C"))
        {
            const TemperatureInFahrenheit = (Temperature * 9/5) + 32;
            TemperatureValue.text(TemperatureInFahrenheit.toFixed(2));
            $("#SuperScriptTemp").text("°F");
        }

        $("#Cel").css({"background-color": "#E6F2F4"});
        $("#Far").css({"background-color": "#81CEEB"});
    });
});

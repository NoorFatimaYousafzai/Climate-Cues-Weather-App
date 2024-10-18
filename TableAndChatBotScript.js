$(document).ready(function(){

   //This function fills the table with the 5-day temperature forecast based on the user's current location.
    if("geolocation" in navigator)
    {
        const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
        const UnitOfTemperature = 'metric';

        navigator.geolocation.getCurrentPosition(CurrentPosition => {

            const Latitude = CurrentPosition.coords.latitude;
            const Longitude = CurrentPosition.coords.longitude;

            FiveDayWeatherForcastData(Latitude, Longitude, APIKey, UnitOfTemperature);
            
        })
    }

    //Event handler on seacrh button that is used to populate the table with the 5-day temperature forecast based on the city that the user searched for.
    $("#SearchButton").click(function(){
        const CityName = $("#CityName").val();
        const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
        const UnitOfTemperature = 'metric';
        FindingLatitudeAndLongitude(CityName, APIKey, UnitOfTemperature);       
    });
});

//This function uses the openweathermap api to get the corresponding latitude and longitude of the city passed as the parameter.
function FindingLatitudeAndLongitude(CityName, APIKey, UnitOfTemperature)
{
    $.getJSON(`https://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${APIKey}`, function (data) {  

        $("#SpinnerLoader").hide();
        
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

const ListOfTemperaturesFiveDays = [];
const ListOfDatesFiveDays = [];
const ListOfTime = [];
const ListOfWeatherDescription = [];
const ListOfWeatherIcons = [];

//This function uses the openweathermap api to get the 5 day weather forcast of the city the user searched for using the it's longitude and latiutde.
//It stores the temperatures, dates, time, descriptions, icons in separated arrays.
function FiveDayWeatherForcastData(Latitude, Longitude, APIKey, UnitOfTemperature)
{
    ListOfTemperaturesFiveDays.length = 0;
    ListOfDatesFiveDays.length = 0;
    ListOfTime.length = 0;
    ListOfWeatherDescription.length = 0;
    ListOfWeatherIcons.length = 0;

    $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&appid=${APIKey}&units=${UnitOfTemperature}`, function(data){
       
        $("#SpinnerLoader").hide();

        const EntireForcastData = data.list;
       

        for(var i = 0; i < EntireForcastData.length; i++)
        {
            const Temperature = EntireForcastData[i].main.temp;
            ListOfTemperaturesFiveDays.push(Temperature);

            const dateObject = new Date(EntireForcastData[i].dt_txt);
            const DateCorrectFormat = dateObject.toLocaleDateString();
           
            ListOfDatesFiveDays.push(DateCorrectFormat);

            const time = dateObject.toLocaleTimeString(); 
            ListOfTime.push(time); 

            ListOfWeatherDescription.push(EntireForcastData[i].weather[0].description.replace(/\b\w/g, char => char.toUpperCase()));
            ListOfWeatherIcons.push(EntireForcastData[i].weather[0].icon);
        } 

        console.log(ListOfTemperaturesFiveDays);
        console.log(ListOfDatesFiveDays);
        console.log(ListOfTime);

        TemperatureForcastTablePopulate(ListOfTemperaturesFiveDays,ListOfDatesFiveDays,ListOfTime, ListOfWeatherDescription,ListOfWeatherIcons);
    
    });
}

const NumberOfEnteriesPerPage = 10;
let CurrentPageOfTemperatureTable = 1;
const MaximumPages = 4;

//This function populates the table with the 5 day weather forcast using the arrays passed as the parameter.
function TemperatureForcastTablePopulate(Temperature, Date, Time, Description, Icon)
{
    const TemperatureForcastTable = $("#TemperatureTableBody");
    TemperatureForcastTable.empty();

    const StartingIndex = (CurrentPageOfTemperatureTable - 1) * NumberOfEnteriesPerPage;
    const EndingIndex = StartingIndex + NumberOfEnteriesPerPage;

    for(var i = StartingIndex; i < EndingIndex; i++)
    {
        const TableRow = `<tr><td>${Date[i]}</td><td>${Time[i]}</td><td>${Temperature[i]}</td> <td> ${Description[i]} </td> <td> <img src="http://openweathermap.org/img/wn/${Icon[i]}@2x.png" style="width: 70px;"></td></tr>`;
        TemperatureForcastTable.append(TableRow);
    }

    if(CurrentPageOfTemperatureTable === 1)
    {
        $("#previousPg").prop("disabled", true).css({
            "background-color": "gray"       
        });

        $("#previousPg i").css("color", "white");
    }
    else
    {
        $("#previousPg").prop("disabled", false).css({
            "background-color": "#FFF9C7"       
        });

        $("#previousPg i").css("color", "black");
    }

    if(CurrentPageOfTemperatureTable === MaximumPages)
    {
        $("#nextPg").prop("disabled", true).css({
            "background-color": "gray"          
        });

        $("#nextPg i").css("color", "white");
    }
    else
    {
        $("#nextPg").prop("disabled", false).css({
            "background-color": "#FFF9C7",  
        });

        $("#nextPg i").css("color", "black");
    }
}

$(document).ready(function(){
    
    //This event handler on the nextPg button is used to go to the next page of the table.
    $("#nextPg").click(function(){ 
        
        if(CurrentPageOfTemperatureTable < MaximumPages)
        {
            CurrentPageOfTemperatureTable+=1;
            $("#PageNumber").text(CurrentPageOfTemperatureTable);
            TemperatureForcastTablePopulate(ListOfTemperaturesFiveDays,ListOfDatesFiveDays,ListOfTime, ListOfWeatherDescription,ListOfWeatherIcons);
        }

    });

    //This event handler on the nextPg button is used to go to the next page of the table.
    $("#previousPg").click(function(){ 
        
        if(CurrentPageOfTemperatureTable > 1)
        {
            CurrentPageOfTemperatureTable-=1;
            $("#PageNumber").text(CurrentPageOfTemperatureTable);
            TemperatureForcastTablePopulate(ListOfTemperaturesFiveDays,ListOfDatesFiveDays,ListOfTime, ListOfWeatherDescription,ListOfWeatherIcons);
        }
       
    });
})

$(document).ready(function (){  

    //Current Location Weather Regex.
    const RegexExpression_Today =  /(what|how|tell|give|can|could|is|do).*(weather|forecast|temperature?).*(today|now|current)?/i;
    //Specified City Weather Regex.
    const RegexExpression_City = /(what|how|tell|give|can|could).*(weather|forecast|temp(erature)?).*(in|at)\s([A-Za-z]+)/i;

    
    //This event handler on the SendCB button extracts the input that the user has entered.
    //Matches it with the defined regex pattern and the calls the appropirate functions to answer the question.
    $("#SendCB").click(function(){ 

        const MessageSendUser = $("#chatBotInput").val();

        if(MessageSendUser == "")
        {
            alert("Input Field is Empty!");
        }
        else
        {
            const MessageUserSend_Box = $("<div></div>");
            MessageUserSend_Box.text(MessageSendUser);
            MessageUserSend_Box.addClass("MessageSend");
            $("#ResponsesDiv").append(MessageUserSend_Box);

            if(MessageSendUser.includes("weather") || MessageSendUser.includes("temperature") || MessageSendUser.includes("forecast"))
            { 
                if(RegexExpression_City.test(MessageSendUser))
                {
                   if(MessageSendUser.includes("in"))
                    {
                        let CityName = MessageSendUser.split("in")[1]?.trim();
                        CityName = CityName.replace(/[?.!]/g, "");
                        if(MessageSendUser.includes("Highest") || MessageSendUser.includes("highest"))
                        {
                            HighestTemperatureChatBot(CityName);
                        }
                        else if(MessageSendUser.includes("Lowest") || MessageSendUser.includes("lowest"))
                        {
                            LowestTemperatureChatBot(CityName);
                        }
                        else if(MessageSendUser.includes("Average") || MessageSendUser.includes("average"))
                        {
                            AverageTemperatureChatBot(CityName);
                        }
                        else
                        {
                            WeatherRelatedQuestion(CityName);
                        }
                    }
                    else if(MessageSendUser.includes("at"))
                    {
                        let CityName = MessageSendUser.split("at")[1]?.trim();
                        CityName = CityName.replace(/[?.!]/g, "");
                        if(MessageSendUser.includes("Highest") || MessageSendUser.includes("highest"))
                        {
                            HighestTemperatureChatBot(CityName);
                        }
                        else if(MessageSendUser.includes("Lowest") || MessageSendUser.includes("lowest"))
                        {
                            LowestTemperatureChatBot(CityName);
                        }
                        else if(MessageSendUser.includes("Average") || MessageSendUser.includes("average"))
                        {
                            AverageTemperatureChatBot(CityName);
                        }
                        else
                        {
                            WeatherRelatedQuestion(CityName);
                        }
                       
                    }
                }
                else if(RegexExpression_Today.test(MessageSendUser))
                {
                    
                    
                    if(MessageSendUser.includes("Highest") || MessageSendUser.includes("highest"))
                    {
                        CurrentLocationWeatherRelatedQueries_Today_HighestTemperature()
                    }
                    else if(MessageSendUser.includes("Lowest") || MessageSendUser.includes("lowest"))
                    {
                        CurrentLocationWeatherRelatedQueries_Today_LowestTemperature()
                    }
                    else if(MessageSendUser.includes("Average") || MessageSendUser.includes("average"))
                    {
                        CurrentLocationWeatherRelatedQueries_Today_AverageTemperature()
                    }
                    else
                    {
                        CurrentLocationWeatherRelatedQueries_Today();
                    }
                }

            }
            else
            {
                NonWeatherRelatedQueries(MessageSendUser);
            }
            $("#chatBotInput").val("");
           
        }
    });

});


//This function responds to the user messages requesting the highest temperature in a specific city.
function HighestTemperatureChatBot(CityName)
{
    const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
    const UnitOfTemperature = 'metric';

    $.getJSON(`https://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${APIKey}`, function (data) {  

        if(data.length == 0)
        {
            alert("No Such City Found!");
        }
        else
        {
            const Latitude = data[0].lat;
            const Longitude = data[0].lon;

            $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&appid=${APIKey}&units=${UnitOfTemperature}`, function(data){
       
                $("#SpinnerLoader").hide();
        
                const EntireForcastData = data.list;
                const TemperaturesOfToday = [];
               
        
                for(var i = 0; i < 5; i++)
                {
                    const Temperature = EntireForcastData[i].main.temp;
                    TemperaturesOfToday.push(Temperature);
                } 

                const HighestTemperature = Math.max(...TemperaturesOfToday);
                console.log(TemperaturesOfToday);
                console.log(HighestTemperature);
                const WeatherInformation = `The Highest Temperature in ${CityName} is ${HighestTemperature} °C`;

                const Response_Box = $("<div></div>");
                Response_Box.text(WeatherInformation);
                Response_Box.addClass("Response");
                $("#ResponsesDiv").append(Response_Box);

                $("#ResponsesDiv").scrollTop($("#ResponsesDiv")[0].scrollHeight);

        
            });
            
        }
    });   
}



//This function responds to the user messages requesting the lowest temperature in a specific city.
function LowestTemperatureChatBot(CityName)
{
    const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
    const UnitOfTemperature = 'metric';

    $.getJSON(`https://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${APIKey}`, function (data) {  

        if(data.length == 0)
        {
            alert("No Such City Found!");
        }
        else
        {
            const Latitude = data[0].lat;
            const Longitude = data[0].lon;

            $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&appid=${APIKey}&units=${UnitOfTemperature}`, function(data){
       
                $("#SpinnerLoader").hide();
        
                const EntireForcastData = data.list;
                const TemperaturesOfToday = [];
               
        
                for(var i = 0; i < 5; i++)
                {
                    const Temperature = EntireForcastData[i].main.temp;
                    TemperaturesOfToday.push(Temperature);
                } 

                const LowestTemperature = Math.min(...TemperaturesOfToday);
                console.log(TemperaturesOfToday);
                console.log(LowestTemperature);
                const WeatherInformation = `The Lowest Temperature in ${CityName} is ${LowestTemperature} °C`;

                const Response_Box = $("<div></div>");
                Response_Box.text(WeatherInformation);
                Response_Box.addClass("Response");
                $("#ResponsesDiv").append(Response_Box);

                $("#ResponsesDiv").scrollTop($("#ResponsesDiv")[0].scrollHeight);

        
            });
            
        }
    });   
}


//This function responds to the user messages requesting the average temperature in a specific city.
function AverageTemperatureChatBot(CityName)
{
    const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
    const UnitOfTemperature = 'metric';

    $.getJSON(`https://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${APIKey}`, function (data) {  

        if(data.length == 0)
        {
            alert("No Such City Found!");
        }
        else
        {
            const Latitude = data[0].lat;
            const Longitude = data[0].lon;

            $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&appid=${APIKey}&units=${UnitOfTemperature}`, function(data){
       
                $("#SpinnerLoader").hide();
        
                const EntireForcastData = data.list;
                const TemperaturesOfToday = [];
               
        
                for(var i = 0; i < 5; i++)
                {
                    const Temperature = EntireForcastData[i].main.temp;
                    TemperaturesOfToday.push(Temperature);
                } 

                const AverageTemperature = (TemperaturesOfToday.reduce((sum, number) => sum + number)/ TemperaturesOfToday.length).toFixed(2);
                console.log(TemperaturesOfToday);
                console.log(AverageTemperature);
                const WeatherInformation = `The Average Temperature in ${CityName} is ${AverageTemperature} °C`;

                const Response_Box = $("<div></div>");
                Response_Box.text(WeatherInformation);
                Response_Box.addClass("Response");
                $("#ResponsesDiv").append(Response_Box);

                $("#ResponsesDiv").scrollTop($("#ResponsesDiv")[0].scrollHeight);

            });
            
        }
    });   
}

//This function responds to the user messages requesting the the weather queries about their current location.
function CurrentLocationWeatherRelatedQueries_Today()
{
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
                WeatherRelatedQuestion(CityName);
                
            });

        })
    }
}

//This function responds to the user messages requesting the highest temperature in their current location.
function CurrentLocationWeatherRelatedQueries_Today_HighestTemperature()
{
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
                HighestTemperatureChatBot(CityName);
                
            });

        })
    }
}

//This function responds to the user messages requesting the lowest temperature in their current location.
function CurrentLocationWeatherRelatedQueries_Today_LowestTemperature()
{
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
                LowestTemperatureChatBot(CityName);
                
            });

        })
    }
}

//This function responds to the user messages requesting the average temperature in their current location.
function CurrentLocationWeatherRelatedQueries_Today_AverageTemperature()
{
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
                AverageTemperatureChatBot(CityName);
                
            });

        })
    }
}



//This function responds to the user messages requesting the weather related queries about a specific city.
function WeatherRelatedQuestion(CityName)
{
    const APIKey = '4fff08fac8f8ec2043af413b2b4c4770';
    const UnitOfTemperature = 'metric';

    $.getJSON(`https://api.openweathermap.org/data/2.5/weather?q=${CityName}&appid=${APIKey}&units=${UnitOfTemperature}`).done(function(data){
        
        if(data.cod != 200)
        {
            alert("No Such City Found!");
        }
        else
        {
            const City = data.name;
            const WeatherDescription = data.weather[0].description;
            const Temperature = data.main.temp;

            const WeatherInformation = `The temperature in ${City} is ${Temperature} °C with ${WeatherDescription}.`;

            const Response_Box = $("<div></div>");
            Response_Box.text(WeatherInformation);
            Response_Box.addClass("Response");
            $("#ResponsesDiv").append(Response_Box);
            $("#ResponsesDiv").scrollTop($("#ResponsesDiv")[0].scrollHeight);
            
        }

     }).fail(function(){
        alert("Error in fetching data");
     })
}

//This function use Gemini API to respond to the user messages requesting the non-weather queries.
function NonWeatherRelatedQueries(messageUser)
{
    const APIKey = `AIzaSyD4d_qEvfdv3dRBbDAwKJjFJW6HXpxhGrU`;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${APIKey}`,{

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: messageUser
                        }
                    ]
                }
            ]
        })
    })
    .then(response => {

        if(response.ok)
        {
            return response.json();
        }

    })
    .then(data => {
        console.log(data.response);

        const NonWeatherInformation = data.candidates[0].content.parts[0].text;;

        const Response_Box = $("<div></div>");
        Response_Box.text(NonWeatherInformation);
        Response_Box.addClass("Response");
        $("#ResponsesDiv").append(Response_Box);
        $("#ResponsesDiv").scrollTop($("#ResponsesDiv")[0].scrollHeight);
    })
    .catch(error => {
        console.error('Error in getting a response:', error);
        alert("Error in getting a response!");
    })

}

$(document).ready(function(){

    //This event handler on FilterButton is used to toggle between the FilterShow and FilterHide class.
    //That is it is used to display or hide the filter when clicked upon.
    $("#FilterButton").click(function(){
        $("#FilterDiv").toggleClass("FilterHide FilterShow");
    });

    //This event handler on AscendingOrder is used to sort the temperatures displayed in ascending order.
    $("#AscendingOrder").click(function() {
        TemperatureForcastTablePopulate(ListOfTemperaturesFiveDays,ListOfDatesFiveDays,ListOfTime, ListOfWeatherDescription,ListOfWeatherIcons);
        SortTemperatureAscending();
    });

     //This event handler on DescendingOrder is used to sort the temperatures displayed in descending order.
    $("#DescendingOrder").click(function() {
        TemperatureForcastTablePopulate(ListOfTemperaturesFiveDays,ListOfDatesFiveDays,ListOfTime, ListOfWeatherDescription,ListOfWeatherIcons);
        SortTemperatureDescending();
    });

    //This event handler on WithoutRain is used to display the days without rain.
    $("#WithoutRain").click(function() {
        TemperatureForcastTablePopulate(ListOfTemperaturesFiveDays,ListOfDatesFiveDays,ListOfTime, ListOfWeatherDescription,ListOfWeatherIcons);
        DaysWithoutRain();
    });

    //This event handler on HighestTemperature is used to display the day with the hightest temperature.
    $("#HighestTemperature").click(function() {
        TemperatureForcastTablePopulate(ListOfTemperaturesFiveDays,ListOfDatesFiveDays,ListOfTime, ListOfWeatherDescription,ListOfWeatherIcons);
        HighestTemperature();
    });
});

//This function is used to sort the temperatures displayed in ascending order.
function SortTemperatureAscending() {

    var TableBody =  $("#TemperatureTableBody"); 
    var AllTemperatureTableRows = $("#TemperatureTableBody tr").get();  
    AllTemperatureTableRows.sort((RowA, RowB) => {
        var TempX = parseFloat($(RowA).children("td").eq(2).text()); 
        var TempY = parseFloat($(RowB).children("td").eq(2).text());

        return TempX - TempY; 
    });

    TableBody.empty();
    TableBody.append(AllTemperatureTableRows);
}

//This function is used to sort the temperatures displayed in descending order.
function SortTemperatureDescending() {

    var TableBody =  $("#TemperatureTableBody"); 
    var AllTemperatureTableRows = $("#TemperatureTableBody tr").get();  
    AllTemperatureTableRows.sort((RowA, RowB) => {
        var TempX = parseFloat($(RowA).children("td").eq(2).text()); 
        var TempY = parseFloat($(RowB).children("td").eq(2).text());

        return TempY - TempX; 
    });

    TableBody.empty();
    TableBody.append(AllTemperatureTableRows);
}


//This function is used to display the days without rain.
function DaysWithoutRain()
{
    var TableBody =  $("#TemperatureTableBody"); 
    var AllTemperatureTableRows = $("#TemperatureTableBody tr").get();  

    var DaysWithoutRain = AllTemperatureTableRows.filter((RowsA) => !$(RowsA).children("td").eq(3).text().toLowerCase().includes("rain"));

    console.log(DaysWithoutRain);

    TableBody.empty();
    TableBody.append(DaysWithoutRain);
}

//This function is used to display the day with the highest temperature.
function HighestTemperature()
{
    var TableBody =  $("#TemperatureTableBody"); 
    var AllTemperatureTableRows = $("#TemperatureTableBody tr").get();  

    var HightestTemperatureRow = AllTemperatureTableRows.reduce((accumlator, currentValue) => {

        if(parseFloat($(currentValue).children("td").eq(2).text()) > parseFloat($(accumlator).children("td").eq(2).text()))
        {
            accumlator = currentValue;
        }

        return accumlator;
    });

    TableBody.empty();
    TableBody.append(HightestTemperatureRow);
}
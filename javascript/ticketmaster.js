var city = "";
var queryURL = "";
var concertInfo = {};
var allConcerts = [];
var time = moment.utc().format();
var searchTime = time.substring(0, 19) + "Z";
var rendering = false;

if (localStorage.getItem("city")) {
    city = localStorage.getItem("city");
    $("#city").val(city);
}

var cityClick = function () {
    event.preventDefault();

    allConcerts = [];
    city = String($("#city").val());
    localStorage.setItem("city", city);
    for (var i = 0; i < artistArr.length; i++) {
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&city=" + city + "&sort=date,asc&startDateTime=" + searchTime + "&radius=30&apikey=aEo9tgraRerkwjEgT4qifF3P6rJBXxd7";
        $.ajax({
            url: queryURL,
            type: "GET",
            dataType: "json",
        }).then(function (response) {
            for (k in response._embedded.events) {
                concertInfo = {
                    name: response._embedded.events[k].name,
                    date: response._embedded.events[k].dates.start.localDate,
                    venue: response._embedded.events[k]._embedded.venues[0].name,
                    venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                    url: response._embedded.events[k].url,
                    image: response._embedded.events[k].images[0].url
                }
                
                allConcerts.push(concertInfo);
            }

            renderConcerts();
        });
    };
};

var artistClick = function () {
    if (city === "") {
        event.preventDefault();

        allConcerts = [];
        for (var i = 0; i < artistArr.length; i++) {
            city = String($("#city").val());
            queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&sort=date,asc&startDateTime=" + searchTime + "&apikey=aEo9tgraRerkwjEgT4qifF3P6rJBXxd7";
            $.ajax({
                url: queryURL,
                type: "GET",
                dataType: "json",
            }).then(function (response) {
                for (var k = 0; k < 20; k++) {
                    concertInfo = {
                        name: response._embedded.events[k].name,
                        date: response._embedded.events[k].dates.start.localDate,
                        venue: response._embedded.events[k]._embedded.venues[0].name,
                        venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                        url: response._embedded.events[k].url,
                        image: response._embedded.events[k].images[0].url
                    }
                    
                    allConcerts.push(concertInfo);
                }

                renderConcerts();
            });
        };
    }
    else { cityClick(); }
};

var renderConcerts = function () {
  
          while(rendering){
    }
     if (!rendering) {
        rendering = true;

        allConcerts.sort(function (a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return dateA - dateB;
        });
       $("#concertList").empty();
    for (var j = 0; j < allConcerts.length; j++) {
        var newAnchor = $("<div>");
        newAnchor.addClass("col-md-6");
        newAnchor.addClass("concertDiv");
        var concertPicDiv = $("<div>");
        concertPicDiv.addClass("concertPic");
        concertPicDiv.css("background-image", "url('" + allConcerts[j].image + "')");
        newAnchor.append(concertPicDiv);
        var concertTextDate = $("<p>");
        concertTextDate.addClass("overlayConcertTextDate");
        newAnchor.append($(concertTextDate).text(allConcerts[j].date));
        var concertTextName = $("<p>");
        concertTextName.addClass("overlayConcertTextName");
        newAnchor.append($(concertTextName).text(allConcerts[j].name));
        var concertTextVenue = $("<p>");
        concertTextVenue.addClass("overlayConcertTextVenue");
        newAnchor.append($(concertTextVenue).text(allConcerts[j].venue + ", " + allConcerts[j].venueCity ));
        newAnchor.attr("href", allConcerts[j].url);
        newAnchor.click(function () {
            window.open($(this).attr("href"), '_blank');
          
        rendering = false;
    });
};
}
}

$("#artistList").on("click", artistClick);
$("#citybtn").on("click", cityClick);

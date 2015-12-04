var p = 1,
    currentIndex = 1,
    next = true,
    people = [],
    displayElements = [];
var retrievePeople = function () {
    if (next) {
        swapiModule.getPeople(p, function (data) {
            if (data.next === null) {
                next = false;
            }
            people.push(data.results);
            p++;
            retrievePeople();
        });
    }
};

var filter = function (filter) {
    var i, j, results = [];
    for (i = 0; i < people.length; i++) {
        for (j = 0; j < people[i].length; j++) {
            if (people[i][j].name.indexOf(filter) >= 0) {
                results.push(people[i][j]);
            }
        }
    }
    return results;
};

var appendListElement = function (obj) {
    var htmlObj = '<li class="list-element"><div element-id=""><img class="element-img" src="http://placehold.it/90x90" /><p class="element-name">' + obj.name + '</p><p class="element-2ndliner">' + obj.byear + '</p><a class="element-planet" href="#" onclick="filterByPlanet(' + obj.planetId + ')">' + obj.planet + '</a></div></li>'
    $("#items-list").append(htmlObj);
};

var renderPage = function (page) {
    $("#loader").show();
    $("#items-list").fadeOut();
    $("#items-list").empty();
    var i, planetId;
    for (i = 0; i < people[page - 1].length; i++) {
        (function (k) {
            planetId = people[page - 1][i].homeworld.split("/")[people[page - 1][k].homeworld.split("/").length - 2];
            swapiModule.getPlanet(planetId, function (data) {
                var object = {};
                object.name = people[page - 1][k].name;
                object.byear = people[page - 1][k].birth_year;
                object.planet = data.name;
                object.planetId = planetId;
                appendListElement(object);
                displayElements.push(object);
            });
        })(i);
    }
    $("#pageNo").text("Page " + currentIndex);
};

var renderFilter = function (objects) {

};

var filterByPlanet = function (planet) {

};

var nextPage = function () {
    currentIndex++;
    if (currentIndex > people.length) {
        currentIndex = people.length;
    } else {
        renderPage(currentIndex);
        setTimeout(function () {
            $("#loader").hide();
            $("#items-list").fadeIn();
        }, 3000);
    }
};

var prevPage = function () {
    currentIndex--;
    if (currentIndex < 1) {
        currentIndex = 1;
    } else {
        renderPage(currentIndex);
        setTimeout(function () {
            $("#loader").hide();
            $("#items-list").fadeIn();
        }, 3000);
    }
};

$(function () {
    retrievePeople();
    setTimeout(function () {
        renderPage(currentIndex);
        setTimeout(function () {
            $("#loader").hide();
            $("#items-list").fadeIn();
        }, 3000);
    }, 1000);
});

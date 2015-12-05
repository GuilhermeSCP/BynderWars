var p = 1,
    currentIndex = 1,
    next = true,
    people = [],
    displayElements = [];

/*
    Request all the people from the API and fills an array with that data.
*/
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

/*
    Receives a string and returns the elements whose name matches the filter.
*/
var filter = function (filter) {
    var i, j, results = [];
    for (i = 0; i < people.length; i++) {
        for (j = 0; j < people[i].length; j++) {
            if (people[i][j].name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                results.push(people[i][j]);
            }
        }
    }
    return results;
};

/*
    Receives an object with the element info and appends the result to the
    elements list.
*/
var appendListElement = function (obj) {
    var htmlObj = '<li class="list-element"><div element-id=""><img class="element-img" src="http://placehold.it/90x90" /><p class="element-name">' + obj.name + '</p><p class="element-2ndliner">' + obj.byear + '</p><a class="element-planet" href="#" onclick="filterByPlanet(' + obj.planetId + ')">' + obj.planet + '</a></div></li>'
    $("#items-list").append(htmlObj);
};

/*
    Receives a page number and loops within that page to produce the list elements.
    It also makes a request to the API to get the planet's name for each person.
*/
var renderPage = function (page) {
    $("#loader").show();
    $("#items-list").fadeOut();
    $("#items-list").empty();
    displayElements = [];
    var i, planetId;
    for (i = 0; i < people[page - 1].length; i++) {
        (function (k) {
            planetId = people[page - 1][i].homeworld.split("/")[people[page - 1][k].homeworld.split("/").length - 2];
            swapiModule.getPlanet(planetId, function (data) {
                var object = {};
                object.name = people[page - 1][k].name;
                object.byear = people[page - 1][k].birth_year;
                object.planet = data.name;
                object.planetId = data.url.split("/")[data.url.split("/").length - 2];
                appendListElement(object);
                displayElements.push(object);
            });
        })(i);
    }
    $("#pageNo").text("Page " + currentIndex).show();
};

/*
    Renders the list of the first 10 elements whose name matches the filter.
*/
var renderFilter = function (no) {
    var filterStr = $(".input-field").val();
    if (filterStr.length < 1 || no === 0) {
        renderPage(1);
        $("#loader").hide();
        $("#items-list").fadeIn();
    } else {
        var resultsArray = filter(filterStr).slice(0, 10);
        $("#loader").show();
        $("#items-list").fadeOut();
        $("#items-list").empty();
        displayElements = [];
        var i, planetId;
        for (i = 0; i < resultsArray.length; i++) {
            (function (k) {
                planetId = resultsArray[i].homeworld.split("/")[resultsArray[k].homeworld.split("/").length - 2];
                swapiModule.getPlanet(planetId, function (data) {
                    var object = {};
                    object.name = resultsArray[k].name;
                    object.byear = resultsArray[k].birth_year;
                    object.planet = data.name;
                    object.planetId = planetId;
                    appendListElement(object);
                    displayElements.push(object);
                });
            })(i);
        }
        $("#pageNo").fadeOut();
        $("#loader").hide();
        $("#items-list").fadeIn();
    }
};

/*
    Renders the list of elements whose residence planet matches the given planet id.
*/
var filterByPlanet = function (planetId) {
    $("#loader").show();
    $("#items-list").fadeOut();
    $("#pageNo").fadeOut();
    $("#items-list").empty();
    displayElements = [];
    setTimeout(function () {
        $("#loader").hide();
        $("#items-list").fadeIn();
    }, 2000);
    swapiModule.getPlanet(planetId, function (data) {
        var i, j, k;
        for (i = 0; i < 10 /*data.residents.length*/ ; i++) {
            for (j = 0; j < people.length; j++) {
                for (k = 0; k < people[j].length; k++) {
                    if (people[j][k].url == data.residents[i]) {
                        var obj = {}
                        obj.name = people[j][k].name;
                        obj.byear = people[j][k].birth_year;
                        obj.planet = data.name;
                        obj.planetId = planetId;
                        appendListElement(obj);
                        displayElements.push(obj);
                    }
                }
            }
        }
    });
};
/*
    Sort the current elements in the page by some attribute.
*/
var sort = function (type) {
    switch (type) {
        case "name":
            displayElements.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            $("#items-list").empty();
            var i;
            for (i = 0; i < displayElements.length; i++) {
                appendListElement(displayElements[i]);
            }
            break;
    }
};

/*
    Increases the page number and trigger the rendering of the new page.
*/
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

/*
    Decreases the page number and trigger the rendering of the new page.
*/
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

/*
    This function runs when the document is ready.
*/
$(function () {
    retrievePeople();
    setTimeout(function () {
        renderPage(currentIndex);
        setTimeout(function () {
            $("#loader").hide();
            $("#items-list").fadeIn();
        }, 3000);
    }, 1500);
});

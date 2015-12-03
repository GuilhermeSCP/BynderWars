var p = 1;
var next = true;
var people = [];
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

var renderPage = function (page) {
    var i, objects = [];
    for (i = 0; i < people[page - 1].length; i++) {
        (function (k) {
            swapiModule.getPlanet(people[page - 1][i].homeworld.split("/")[people[page - 1][k].homeworld.split("/").length - 2], function (data) {
                var object = {};
                object.name = people[page - 1][k].name;
                object.byear = people[page - 1][k].birth_year;
                object.planet = data.name;
                objects.push(object);
                console.log(objects);
            });
        })(i);
    }
};

var renderFilter = function (objects) {

};

$(function () {
    retrievePeople();
    console.log(people);

});

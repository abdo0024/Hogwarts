"use strict";
let standings = [];
if (document.deviceready) {
    document.addEventListener('deviceready', 'onDeviceReady');
}
else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}
// main initialization function
function onDeviceReady() {
    console.log("Ready!");
    serverData.getJSON();
}
document.addEventListener("DOMContentLoaded", function () {
    serverData.getJSON();
});
let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/quidditch.php" // quidditch.php 
        
    , httpRequest: "GET"
    , getJSON: function () {
        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();
        // Add a header(s)
        // key value pairs sent to the server
        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        // simply show them in the console
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));
        // Now the best way to get this data all together is to use an options object:
        // Create an options object
        let options = {
            method: serverData.httpRequest
            , mode: "cors"
            , headers: headers
        };
        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        console.log(request);
        fetch(request).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (data) {
            console.log(data); // now we have JS data, let's display it
            // Call a function that uses the data we recieved  
            displayData(data);
        }).catch(function (err) {
            alert("Error: " + err.message);
        });
    }
};
//Help from Tony
function displayData(data) {
    console.log(data);
    localStorage.setItem("scores", JSON.stringify(data));
    console.log(data.teams);
    console.log(data.scores);
    //get our schedule unordered list
    let ul = document.querySelector(".results_list");
    ul.innerHTML = ""; // clear existing list items
    // Help from Tony
    standings = [];
    data.teams.forEach(function (value) {
        let team = {
            id: value.id
            , W: 0
            , L: 0
            , T: 0
        };
        standings.push(team);
    });
    var tbody = document.querySelector("#scoreData tbody");
    tbody.innerHTML = "";
    // create list items for each match in the schedule
    data.scores.forEach(function (value) {
        let li = document.createElement("li");
        li.className = "score";
        let h3 = document.createElement("h3");
        h3.textContent = value.date;
        let homeTeam = null;
        let awayTeam = null;
        //add our new schelue html to unordered list
        ul.appendChild(li);
        ul.appendChild(h3);
        value.games.forEach(function (item) {
            console.log(item.home);
            console.log(item.away);
            homeTeam = getTeamName(data.teams, item.home);
            awayTeam = getTeamName(data.teams, item.away);
            let dg = document.createElement("div");
            let home = document.createElement("div");
            home.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";
            let away = document.createElement("div");
            away.innerHTML = "&nbsp" + awayTeam + " " + "<b>" + item.away_score + "</b>" + "&nbsp";
            dg.appendChild(home);
            dg.appendChild(away);
            ul.appendChild(dg);
            // standings
            if (item.home_score > item.away_score) {
                // home win
                calcStandings(item.home, "W");
                calcStandings(item.away, "L");
            }
            else if (item.away_score > item.home_score) {
                calcStandings(item.away, "W");
                calcStandings(item.home, "L");
            }
            else {
                calcStandings(item.home, "T");
                calcStandings(item.away, "T");
            }
        });
    });
    //Put javascript table code in here
    // Help from Tony
    standings.forEach(function (value) {
        //Tables stuff here:
        var tr = document.createElement("tr");
        var tdn = document.createElement("td");
        tdn.textContent = getTeamName(data.teams, value.id);
        var tdw = document.createElement("td");
        tdw.textContent = value.W;
        var tdl = document.createElement("td");
        tdl.textContent = value.L;
        var tdt = document.createElement("td");
        tdt.textContent = value.T;
        var tdp = document.createElement("td");
        tdp.textContent = value.points;
        tr.appendChild(tdn);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tr.appendChild(tdp);
        tbody.appendChild(tr);
        console.log("hi");
        console.log(tbody);
    });
}

function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "unknown";
}
if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady, false);
}
else {
    document.addEventListener('DOMContentLoaded', onDeviceReady, false);
}
let pages = []; // used to store all our screens/pages
let links = []; // used to store all our navigation links
function onDeviceReady() {
    pages = document.querySelectorAll('.page');
    links = document.querySelectorAll('[data-role="nav"] a');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", navigate);
    }
}

function navigate(ev) {
    ev.preventDefault();
    let link = ev.currentTarget;
    console.log(link);
    // split a string into an array of substrings using # as the seperator
    let id = link.href.split("#")[1]; // get the href page name
    console.log('String');
    console.log(id);
    //update what is shown in the location bar
    history.replaceState({}, "", link.href);
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id == id) {
            pages[i].classList.add("active");
        }
        else {
            pages[i].classList.remove("active");
        }
    }
    console.log(pages);
}
// Help from Tony
function calcStandings(id, result) {
    standings.forEach(function (value) {
        if (id == value.id) {
            switch (result) {
            case "W":
                value.W++;
                break;
            case "L":
                value.L++;
                break;
            case "T":
                value.T++;
                break;
            }
        }
    });
}
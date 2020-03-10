$(document).ready(function() {
// declare global variables
var currentDay = moment().format("MMMM Do, YYYY");
var currentDayDiv = $("#currentDayDiv");
var currentTime = moment().format("MMMM Do, YYYY, h:mm a");
currentDayDiv.html(currentTime);
wrapper = $("#wrapper");

// Function to update the time every second
function printCurrentTime() {
    interval = setInterval(function() {
        currentTime = moment().format("MMMM Do, YYYY, h:mm a");
        currentDayDiv.text(currentTime);
    }, 1000);
}
printCurrentTime();

// Generate the rows bc I didn't wanna write the html lol
function generateTimeBlocks() {
    var hours = ["9","10","11","12","13","14","15","16","17","18"];
    var timeBlockDiv = $("<div>").addClass("row shadow");
    var timeDisplay = $("<div>").addClass("timeDisplay col-lg-1");
    var plansDisplay = $("<div>").addClass("plansDisplay col-lg-10");
    var editorIcon = $("<button>").addClass("editorIcon btn col-lg-1");
    var calIcon = $("<i>").addClass("fas fa-calendar-plus")

    for(i=0; i<hours.length; i++) {
        if (parseInt(hours[i]) < 13) {
            timeDisplay.text(hours[i] + " AM");
            editorIcon.append(calIcon);
            plansDisplay.attr("data-hour" + i);
            timeBlockDiv.append(timeDisplay, plansDisplay, editorIcon);
            wrapper.append(timeBlockDiv);
            console.log("also running");
        } else {
            timeDisplay.text(12 - parseInt(hours[i]) + " PM");
            editorIcon.append(calIcon);
            plansDisplay.attr("data-hour" + i);
            timeBlockDiv.append(timeDisplay, plansDisplay, editorIcon);
            wrapper.append(timeBlockDiv);
            console.log("running");
        }
        
    };
}
generateTimeBlocks();

});
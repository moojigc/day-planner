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

// Generate the rows dynamically and has the option to add a parameter for appending or prepending the blocks
function appendTimeBlocks(newTimeBlocks, appendOrPrepend) {
    var hours = [];
    hours.push(newTimeBlocks); //allows user to add more time blocks if they want
    var timeBlockDiv;
    var hourDisplay;
    var plansDisplay;
    var editorIcon;
    var calIcon;
    
    function createATimeBlock() {
        timeBlockDiv = $("<div>").addClass("row shadow");
        hourDisplay = $("<div>").addClass("hourDisplay col-md-1");
        plansDisplay = $("<div>").addClass("plansDisplay col-md-10");
        editorIcon = $("<button>").addClass("editorIcon btn col-md-1");
        editorIcon.attr("data-toggle", "modal"); editorIcon.attr("data-target", "#plansEditorModal");
        calIcon = $("<i>").addClass("fas fa-calendar-plus");    
    }

    hours.forEach(hour => {
        function isItEarlierOrLater() {
            var currentRealHour = moment("12", "HH"); //Saves current hour (in 24hr format) as an integer
            // var currentRealHour = 12;
            // var currentHour = currentRealHour + beforeAfter;

            if (moment(hour, "HH").isAfter(currentRealHour, "hour")) {
                plansDisplay.attr("style", "background-color: #ff7272");
            } else if (moment(hour, "HH").isBefore(currentRealHour, "hour")) {
                plansDisplay.attr("style", "background-color: #35b9ba");
            }

            // Gradient time!
            // if (currentHour - parseInt(hour) >= 9) {
            //     plansDisplay.attr("style", "background-color: #ffba26");
            // } 
            // else if (currentHour - parseInt(hour) === 8) {
            //     plansDisplay.attr("style", "background-color: #f3ba2f");
            // } 
            // else if (currentHour - parseInt(hour) === 7) {
            //     plansDisplay.attr("style", "background-color: #e7ba38");
            // } 
            // else if (currentHour - parseInt(hour) === 6) {
            //     plansDisplay.attr("style", "background-color: #d1ba48");
            // } 
            // else if (currentHour - parseInt(hour) === 5) {
            //     plansDisplay.attr("style", "background-color: #b4ba5d");
            // } 
            // else if (currentHour - parseInt(hour) === 4) {
            //     plansDisplay.attr("style", "background-color: #82ba82");
            // } 
            // else if (currentHour - parseInt(hour) === 3) {
            //     plansDisplay.attr("style", "background-color: #67b995");
            // } 
            // else if (currentHour - parseInt(hour) === 2) {
            //     plansDisplay.attr("style", "background-color: #4fb9a7");
            // } 
            // else if (currentHour - parseInt(hour) === 1) {
            //     plansDisplay.attr("style", "background-color: #43b9b0");
            // } 
            // else if (currentHour === parseInt(hour)) {
            //     plansDisplay.attr("style", " background: rgb(53,185,186); background: linear-gradient(0deg, rgba(53,185,186,1) 0%, rgba(255,186,38,1) 100%); ");
            // } 
        }
        if (hour < 13) {
            createATimeBlock();

            hourDisplay.text(hour + "AM");
            editorIcon.append(calIcon);
            // For use within the editor modal
            editorIcon.attr("data-hour", moment(hour, "HH"));

            timeBlockDiv.append(hourDisplay, plansDisplay, editorIcon);
            plansDisplay.text(moment(hour, "HH"));

            if (appendOrPrepend == "prepend") {
                wrapper.prepend(timeBlockDiv);
            } else {
                wrapper.append(timeBlockDiv);
            }
            // console.log(hour + " AM");
            isItEarlierOrLater();

        } else {
            createATimeBlock();
        
            hourDisplay.text(parseInt(hour) -12 + "PM");
            editorIcon.append(calIcon);
            // For use within the editor modal
            editorIcon.attr("data-hour", moment(hour, "HH"));

            timeBlockDiv.append(hourDisplay, plansDisplay, editorIcon);
            plansDisplay.text(moment(hour, "HH"));

            if (appendOrPrepend == "prepend") {
                wrapper.prepend(timeBlockDiv);
            } else {
                wrapper.append(timeBlockDiv);
            }
            // console.log(parseInt(hour) - 12 + " PM");
            isItEarlierOrLater();
        }

        console.log(editorIcon.data("hour"));
        editUserPlans();
    });
}
// console.log(timeBlockDiv.data("hour"));

// To edit the plans
function editUserPlans() {
    $('#plansEditorModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var hour = button.data('hour') // Extract info from data-* attributes
        if (button.parent().contents(".plansDisplay")[0].childNodes[0].data === undefined) {
            return;
        } else {
            var thisPlanDisplay = button.parent().contents(".plansDisplay")[0].childNodes[0].data;
        }
        console.log(thisPlanDisplay);
        console.log(hour);
        
        // Editing the modal content
        var modal = $(this);
        if (parseInt(hour)>12) {
        modal.find('.modal-title').text(hour + "PM");
        } else {
            modal.find('.modal-title').text(hour + "AM");
        }
        $("#plansDescription").text(thisPlanDisplay);
    })
}

// Creates the default time blocks
addTimeBlocks(["9","10","11","12","13","14","15","16","17"]);

// Adding timeBlock functions
function addTimeBlocks(newHours) {
    newHours.forEach(hour => {
        appendTimeBlocks(hour);
    })
}

var newTimeBlockAfternoon = 17;
$("#addTimeBlockBtnAfternoon").on("click", function() {
    if (newTimeBlockAfternoon !== null && newTimeBlockAfternoon < 23) {
        newTimeBlockAfternoon++;
        appendTimeBlocks(newTimeBlockAfternoon);
    }
})
var newTimeBlockMorning = 9;
$("#addTimeBlockBtnMorning").on("click", function() {
    if (newTimeBlockMorning !== null && newTimeBlockMorning > 1) {
        newTimeBlockMorning--;
        appendTimeBlocks(newTimeBlockMorning, "prepend");
    }
})


// end of script
});
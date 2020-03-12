$(document).ready(function() {
// declare global variables
var currentDay = moment().format("MMMM Do, YYYY");
var currentDayDiv = $("#currentDayDiv");
var currentTime = {
    formattedTime: moment().format("MMMM Do, YYYY, h:mm a"),
    rawTime: moment(),
}
currentDayDiv.html(currentTime.formattedTime);
wrapper = $("#wrapper");

// Function to update the time every second
function printCurrentTime() {
    interval = setInterval(function() {
        currentTime = {
            formattedTime: moment().format("MMMM Do, YYYY, h:mm a"),
            rawTime: moment(),
        }
        currentDayDiv.text(currentTime.formattedTime);
    }, 1000);
}
printCurrentTime();

// Generate the rows dynamically and has the option to add a parameter for appending or prepending the blocks
function appendTimeBlocks(createOrEdit, newTimeBlocks, appendOrPrepend) {
    var hours = [];
    // if (newTimeBlocks === "add") {
        hours.push(newTimeBlocks); //allows user to add more time blocks if they want
    // }
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
        editorIcon.append(calIcon); 
    }
    if (createOrEdit === "edit") { // Edit plans without creating new blocks
        hours.forEach(hour => {
            editUserPlans(hour);
        })
    } else if (createOrEdit === "create") { // Creates blocks
        hours.forEach(hour => {
            function isItEarlierOrLater() { // When I have more time, I'm going to try adding a gradient instead of just 3 solid colors
                // var transparency; 
                // if (moment(hour, "HH").isAfter(currentTime.rawTime, "hour")) {
                //     transparency = Math.pow(hour, (1/2))
                // }
                // plansDisplay.attr("style", "background-color: rgba(255, 98, 98," + transparency + ");")
                // console.log(transparency);

                // currentTime.rawTime = moment("12", "HH") // for testing colors
                if (moment(hour, "HH").isAfter(currentTime.rawTime, "hour")) {
                    plansDisplay.attr("style", "background-color: #ff7272");
                } else if (moment(hour, "HH").isBefore(currentTime.rawTime, "hour")) {
                    plansDisplay.attr("style", "background-color: #9a9696;");
                }
            }
            
            createATimeBlock();
            // For use within the editor modal
            editorIcon.attr("data-hour", hour);
            timeBlockDiv.append(hourDisplay, plansDisplay, editorIcon);

            var savedPlansForThisHour = localStorage.getItem("UserPlansFor" + hour);
            plansDisplay.text(savedPlansForThisHour);

            // Appends or prepends depending on if parameter is passed in
            if (appendOrPrepend == "prepend") {
                wrapper.prepend(timeBlockDiv);
            } else {
                wrapper.append(timeBlockDiv);
            }
            
            if (hour < 12) {
                hourDisplay.text(hour + " AM");
            } else if (hour === 12) {  
                hourDisplay.text(hour + " PM");
            } else {
                hourDisplay.text(parseInt(hour)-12 + " PM");
            }
            isItEarlierOrLater();

        });
    }   
}
// console.log(timeBlockDiv.data("hour"));



// To edit the plan hour by hour
function editUserPlans(hour) {
    $('#plansEditorModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal

        // Hide and display elements
        console.log("you clicked on" + hour);
        $("#editPlansBtn").attr("class", "btn btn-info");
        $("#closeBtn").text("Close");
        $("#plansEditBox").addClass("display-none"); $("#saveBtn").addClass("display-none");

        var savedPlansForThisHour = localStorage.getItem("UserPlansFor" + hour);
        if (savedPlansForThisHour !== null) { // Grab the text from the current display
            $("#plansDescriptionStatic").text(savedPlansForThisHour);
            button.parent().children(".plansDisplay").text(savedPlansForThisHour);
        }

        // Editing the modal content
        var modal = $(this);
        console.log(modal.find('.modal-title'));
        if (hour > 12) {
            modal.find('.modal-title').text(("Today's agenda for " + (hour-12) + " PM"));
        } else if (hour === 12) {
            modal.find('.modal-title').text(("Today's agenda for " + hour + " PM"));
        }
        else {
            modal.find('.modal-title').text(("Today's agenda for " + hour + " AM"));
        }
        
        $("#saveBtn").on("click", function() {
            var temporaryPlansForThisHour = $("#plansEditBox").val();
            if (temporaryPlansForThisHour !== null) {
                $("#plansDescriptionStatic").text(temporaryPlansForThisHour);
                button.parent().children(".plansDisplay").text(temporaryPlansForThisHour);
            }
        })


        // Save user input
        // need to connect textarea to plansdisplay, then save textarea to localstorage, then display localstorage to plansdisplay & plansdescriptionstatic
    })
}

// eventListener on editplansbtn
function getUserClicks() {
    var thisBlocksHour;
    function getCurrentBlockData() {
        thisBlocksHour = $(this).data("hour");
        console.log(thisBlocksHour);
        // Call editor function and pass it thisBlocksHour
        editUserPlans(thisBlocksHour);
    }
    function saveToStorage() {
        localStorage.setItem("UserPlansFor" + thisBlocksHour, $("#plansEditBox").val())
    }
    $(".editorIcon").on("click", getCurrentBlockData); // Gets the hour from the button you click on
    $("#editPlansBtn").on("click", function() {
        console.log("editPlansBtn returns" + thisBlocksHour);
        $("#plansEditBox").removeClass("display-none");
        $("#editPlansBtn").addClass("display-none");
        $("#saveBtn").removeClass("display-none");
        $("#closeBtn").text("Close");  
        $("#saveBtn").on("click", saveToStorage);     
    })
    $("#plansEditBox").keypress(function() {
        $("#saveBtn").text("Save and close");
        $("#closeBtn").text("Close without saving");  
        $("#saveBtn").on("click", function() {
            $("#closeBtn").click();
        });
    })
}
// Adding timeBlock functions
function addTimeBlocks(newHours) {
    newHours.forEach(newHour => {
        appendTimeBlocks("create", newHour);
    })
}

// Append new afternoon blocks
var newTimeBlockAfternoon = 17;
$("#addTimeBlockBtnAfternoon").on("click", function() {
    if (newTimeBlockAfternoon !== null && newTimeBlockAfternoon < 23) {
        newTimeBlockAfternoon++;
        appendTimeBlocks("create", newTimeBlockAfternoon);
    }
})
// Prepend new morning blocks
var newTimeBlockMorning = 9;
$("#addTimeBlockBtnMorning").on("click", function() {
    if (newTimeBlockMorning !== null && newTimeBlockMorning > 0) {
        newTimeBlockMorning--;
        appendTimeBlocks("create", newTimeBlockMorning, "prepend");
    }
})

// Call functions
addTimeBlocks([9,10,11,12,13,14,15,16,17]); // Creates the default time blocks
getUserClicks();

// end of script
});
const $plansModal = $('#plansEditorModal');
const $modalBody = $('#modalBody');
const $modalTitle = $('#modalTitle');
const $editPlansBtn = $('#editPlansBtn');
const $modalExit = $('.fa-window-close').parent();
const $closeBtn = $('#closeBtn');
const $saveBtn = $('#saveBtn');
const $plansEditBox = $('#plansEditBox');
const $modalPlansDisplay = $('#plansDescriptionStatic');
const currentTime = {
    formattedTimeEN: moment().format('MMMM Do, YYYY, hh:mm a'),
    formattedTimeJA: moment().format("YYYY年MM月DD日, HH:mm"),
    rawTime: moment(),
    lang: function() {
        if ($('html').attr('lang') === 'ja') {
            return this.formattedTimeJA;
        } else {
            return this.formattedTimeEN;
        }
    }
}

$(document).ready(function() {
// declare global variables
const currentDayDiv = $("#currentDayDiv");
currentDayDiv.html(currentTime.lang());
const wrapper = $("#wrapper");

// Function to update the time every second
function printCurrentTime() {
    interval = setInterval(function() {
        currentDayDiv.text(currentTime.lang());
    }, 1000);
}
printCurrentTime();

// Generate the rows dynamically and has the option to add a parameter for appending or prepending the blocks
function appendTimeBlocks(createOrEdit, newTimeBlocks, appendOrPrepend) {
    const hours = [];
    if (createOrEdit === "create") {
        hours.push(newTimeBlocks); //allows user to add more time blocks if they want
    }
    let timeBlockDiv;
    let hourDisplay;
    let plansDisplay;
    let editorIcon;
    let calIcon;
    
    function createATimeBlock() {
        timeBlockDiv = $("<div>").addClass("row shadow");
        hourDisplay = $("<div>").addClass("hourDisplay col-md-1");
        plansDisplay = $("<div>").addClass("plansDisplay col-md-10");
        editorIcon = $("<button>").addClass("editorIcon btn col-md-1");
        calIcon = $("<i>").addClass("fas fa-calendar-plus");   
        editorIcon.append(calIcon); 
    }
    if (createOrEdit === "create") { // Creates blocks
        hours.forEach(hour => {
            function isItEarlierOrLater() { 
                
                // currentTime.rawTime = moment("12", "HH") // for testing colors
                if (moment(hour, "HH").isAfter(currentTime.rawTime, "hour")) {
                    plansDisplay.attr("style", "background: rgba(49, 255, 169, 0.5);");
                    hourDisplay.attr("style", "background: rgba(49, 255, 169, 0.5);");
                    editorIcon.attr("style", "background: rgba(49, 255, 169, 0.5);");
                } else if (moment(hour, "HH").isBefore(currentTime.rawTime, "hour")) {
                    plansDisplay.attr("style", "background: rgba(62, 200, 255, 0.459);");
                    hourDisplay.attr("style", "background: rgba(62, 200, 255, 0.459);");
                    editorIcon.attr("style", "background: rgba(62, 200, 255, 0.459);");
                } else {
                    hourDisplay.text('Now');
                    plansDisplay.attr("style", "background: rgb(62,200,255); background: linear-gradient(180deg, rgba(62,200,255,0.46) 0%, rgba(49,255,169,0.5) 100%);");
                    hourDisplay.attr("style", "background: rgb(62,200,255); background: linear-gradient(180deg, rgba(62,200,255,0.46) 0%, rgba(49,255,169,0.5) 100%);");
                    editorIcon.attr("style", "background: rgb(62,200,255); background: linear-gradient(180deg, rgba(62,200,255,0.46) 0%, rgba(49,255,169,0.5) 100%);");
                }
            }
            
            createATimeBlock();
            // For use within the editor modal
            editorIcon.attr("data-hour", hour);
            timeBlockDiv.append(hourDisplay, plansDisplay, editorIcon);

            const savedPlansForThisHour = localStorage.getItem(hour);
            if (savedPlansForThisHour !== null) {
                if (savedPlansForThisHour.split('').length < 50) {
                    plansDisplay.text(savedPlansForThisHour);
                } else {
                    let short = () => {
                        let arr = savedPlansForThisHour.split('');
                        arr.splice(50);
                        return `${arr.join('')}...`
                    } 
                    plansDisplay.text(short());
                }
            }

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

// Adding timeBlock functions
function addTimeBlocks(newHours) {
    newHours.forEach(newHour => {
        appendTimeBlocks("create", newHour);
    });
}

// Append new afternoon blocks
let newTimeBlockAfternoon = 17;
$("#addTimeBlockBtnAfternoon").on("click", function() {
    if (newTimeBlockAfternoon !== null && newTimeBlockAfternoon < 23) {
        newTimeBlockAfternoon++;
        appendTimeBlocks("create", newTimeBlockAfternoon);
    }
})
// Prepend new morning blocks
let newTimeBlockMorning = 9;
$("#addTimeBlockBtnMorning").on("click", function() {
    if (newTimeBlockMorning !== null && newTimeBlockMorning > 0) {
        newTimeBlockMorning--;
        appendTimeBlocks("create", newTimeBlockMorning, "prepend");
    }
})

// Call functions
addTimeBlocks([9,10,11,12,13,14,15,16,17]); // Creates the default time blocks

// eventListener on editplansbtn
let lastBtnClicked;
$(document).on("click", ".editorIcon", function() {    
    lastBtnClicked = $(this);
    editUserPlans(lastBtnClicked);
});

function save() {
    console.trace('save func');
    let hour = lastBtnClicked.data('hour');
    const temporaryPlansForThisHour = $plansEditBox.val();
    if (temporaryPlansForThisHour !== null) {
        if (temporaryPlansForThisHour.split('').length < 50) {
            $modalPlansDisplay.text(temporaryPlansForThisHour);
            lastBtnClicked.parent().children(".plansDisplay").text(temporaryPlansForThisHour);
        } else {
            let short = () => {
                let arr = temporaryPlansForThisHour.split('');
                arr.splice(50);
                return `${arr.join('')}...`
            } 
            console.log(short());
            lastBtnClicked.parent().children(".plansDisplay").text(short());
        }
        localStorage.setItem(hour, temporaryPlansForThisHour);
    }
}
$(document).on('click', '#saveBtn', function() {
    save();
});

// end of script
});
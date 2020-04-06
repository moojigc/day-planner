// To edit the plan hour by hour
function editUserPlans(button) {
    const hour = button.data('hour');

    const formattedHour = a => {
            if (a > 12) {
                return `${a - 12} PM`
            } else if (a < 12) {
                return `${a} AM`
            } else {
                return `${a} PM`
            }
        }
    console.log(hour);
    $modalTitle.text(formattedHour(hour));
    
    const savedPlansForThisHour = localStorage.getItem(hour);

    if (savedPlansForThisHour !== null) { // Grab the text from the current display
        console.log(savedPlansForThisHour);
        $modalPlansDisplay.text(savedPlansForThisHour);
        $plansEditBox.val(savedPlansForThisHour);
    } else {
        $plansEditBox.val('');
        $modalPlansDisplay.text(`No plans for ${formattedHour(hour)}.`);
    }

    function save() {
        const temporaryPlansForThisHour = $plansEditBox.val();
        if (temporaryPlansForThisHour !== null) {

            console.log(`Saving for ${formattedHour(hour)}.`);            
            if (temporaryPlansForThisHour.split('').length < 50) {
                $modalPlansDisplay.text(temporaryPlansForThisHour);
                button.parent().children(".plansDisplay").text(temporaryPlansForThisHour);
            } else {
                let short = () => {
                    let arr = temporaryPlansForThisHour.split('');
                    arr.splice(50);
                    return `${arr.join('')}...`
                } 
                console.log(short());
                button.parent().children(".plansDisplay").text(short());
            }
        }
    }
    $(document).on('click', '#saveBtn', function() {
        localStorage.setItem(hour, $plansEditBox.val())
        save();
    });

        // This ONLY changes the appearence of the modal upon clicking the EDIT button
    $("#editPlansBtn").on("click", function() {
        $plansEditBox.removeClass("display-none");
        $editPlansBtn.addClass("display-none");
        $saveBtn.removeClass("display-none");
        $modalPlansDisplay.addClass("display-none");
        $closeBtn.addClass("display-none"); 
    })

    $plansEditBox.keypress(function() {
        $saveBtn.on("click", function() {
            $closeBtn.click();
        });
    })

}
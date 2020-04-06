$(document).ready(function() {
    function isItEarlierOrLater(hour) { 
        // currentTime.rawTime = moment("12", "HH") // for testing colors
        if (moment(hour, "HH").isAfter(currentTime.rawTime, "hour")) {
            $modalBody.attr("style", "background: rgb(205, 255, 234);")
        } else if (moment(hour, "HH").isBefore(currentTime.rawTime, "hour")) {
            $modalBody.attr("style", "background: rgb(181, 234, 255);");
        } else {
            console.log('now');
            
            $modalBody.attr("style", "background: rgb(62,200,255); background: linear-gradient(180deg, rgb(62, 200, 255) 0%, rgb(49, 255, 169) 100%)");
        }
    }

    function openModal() {
        $saveBtn.addClass('display-none');
        $closeBtn.removeClass('display-none');
        $plansEditBox.addClass('display-none');
        $plansModal.removeClass('display-none');
        $modalPlansDisplay.removeClass('display-none');
        $editPlansBtn.removeClass('display-none');
    };
    function closeModal() {
        $plansModal.addClass('display-none');
    };

    $(document).on('click', '.editorIcon', function() {
        let hour = $(this).data('hour');
        isItEarlierOrLater(hour);
        openModal();
    });

    const $modalBodyChildren = {
        elements: $modalBody.find('*'),
        isClicked: function(userClick) {
            let target;
            Object.values(this.elements).forEach(element => {
                if (element === userClick && element !== $closeBtn[0] && element !== $modalExit.children()[0]) target = element;
            });
            
            if (target) return true;
            else return false;
        }
    }

    $(document).on('click', '.fa-window-close, #closeBtn, #plansEditorModal', function(event) {
        if ($modalBodyChildren.isClicked(event.target)) return;
        else closeModal();
    });
})
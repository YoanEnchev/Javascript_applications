function getInfo() {
    let stopId = $('#stopId').val();
    let listOfBuses = $('ul#buses');

    let stopName = $('#stopName');

    let req = {
        url: `https://judgetests.firebaseio.com/businfo/${stopId}.json`,
        success: displayStopAndTimetable,
        error: displayError
    };

    $.ajax(req);


    function displayStopAndTimetable(data) {
        stopName.text(data.name);
        for (bus in data.buses) { //object with key bus and value time arrival
            let text = `Bus ${bus} arrives in ${data.buses[bus]} minutes`;
            listOfBuses.append(`<li>${text}</li>`);
        }
    }

    function displayError() {
        stopName.text('Error');
    }
}

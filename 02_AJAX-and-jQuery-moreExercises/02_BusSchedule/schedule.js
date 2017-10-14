function solve() {
let departBtn = $('#depart');
let arriveBtn = $('#arrive');
let info = $('#info span.info');

let nextStop = 'depot';
let arriving = '';

    function depart() {
        departBtn.prop('disabled', true);
        arriveBtn.prop('disabled', false);

        let req = {
           url: `https://judgetests.firebaseio.com/schedule/${nextStop}.json`,
            success: showNextStop,
            error: showError
        };
        $.ajax(req);

        function showNextStop(data)  {
            info.text(`Next stop  ${data.name}`);
            nextStop = data.next;
            arriving = data.name;
        }

        function showError() {
            info.text('Error');
            departBtn.prop('disabled', true);
            arriveBtn.prop('disabled', true);
        }
    }

    function arrive() {
        departBtn.prop('disabled', false);
        arriveBtn.prop('disabled', true);

        let req = {
            url: `https://judgetests.firebaseio.com/schedule/${nextStop}.json`,
            success: showNextArrival,
            error: showError
        };
        $.ajax(req);

        function showNextArrival(data) {
            info.text(`Arriving at ${arriving}`);
        }

        function showError() {
            info.text('Error');
            departBtn.prop('disabled', true);
            arriveBtn.prop('disabled', true);
        }
    }

    return {
        depart,
        arrive
    };
}
let result = solve();
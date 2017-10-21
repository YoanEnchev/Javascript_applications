function attachEvents() {
    //Authorization:
    const username = "guest";
    const password = "pass";
    const base64auth = btoa(username + ":" + password);
    const authHeaders = {"Authorization": "Basic " + base64auth};

    let table = $('table#results');
    let venueData = $('#venue-info');

    let req = {
        url: 'https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues',
        headers: authHeaders,
        success: printData
    };
    $.ajax(req);

    function printData(data) {
        console.log(data);
        for (movie of data) {
            let nameOfMovie = movie.name;
            let priceOfMovie = movie.price;
            let movieId = movie._id;
            let startingHour = movie.startingHour;

            let venue = $('<div>')
                .attr('id', movieId)
                .addClass('venue');

            let name = $('<span>')
                .addClass('venue-name')
                .append($('<input class="info" type="button" value="More info">')
                    .click(showMore))
                .append(`${movie.name}`);

            let details = $('<div>')
                .addClass('venue-details')
                .css('display', 'none');

            let purchaseTable = $('<table>');
            let headingRow = $('<tr>')
                .append('<th>Ticket Price</th>')
                .append('<th>Quantity</th>')
                .append('<th></th>');
            let purchaseRow = $('<tr>')
                .append(`<td class="venue-price">${movie.price}</td>`)
                .append($('<td>')
                    .append($('<select class="quantity">')
                        .append('<option value="1">1</option>')
                        .append('<option value="2">2</option>')
                        .append('<option value="3">3</option>')
                        .append('<option value="4">4</option>')
                        .append('<option value="5">5</option>')));

            let purchaseButton = $('<input class="purchase" type="button" value="Purchase"/>');
            purchaseButton.click(() => purchase(nameOfMovie, priceOfMovie, movieId, startingHour, purchaseRow));

            purchaseTable
                .append(headingRow)
                .append(purchaseRow)
                .append($('<td>')
                    .append(purchaseButton));

            let descriptionHeading = $('<span class="head">Venue description:</span>');
            let description = $(`<p class="description">${movie.description}</p>`);

            details
                .append(purchaseTable)
                .append(descriptionHeading)
                .append(description);

            venue
                .append(name)
                .append(details);
            venueData.append(venue);
        }
    }

    function showMore() {
        let movieBox = $(this).parent().parent();
        let showMoreBox = movieBox.find('div.venue-details');
        showMoreBox.css('display', 'block');
    }

    function purchase(name, ticketPrice, id, startingHour, purchaseRow) {
        let quantity = purchaseRow.find('option:selected').val();
        let totalPrice = quantity * ticketPrice;
        totalPrice = totalPrice.toPrecision(2);

        venueData.empty();
        venueData.append('<span class="head">Confirm Purchase</span>');

        let purchaseInfo = $('<div>')
            .addClass('purchase-info')
            .append(`<span>${name}</span>`)
            .append(`<span>${quantity} x ${ticketPrice}</span>`)
            .append(`<span>Total: ${totalPrice} lv</span>`)
            .append($('<input value="confirm" type="button">')
                .click(printTicket));

        venueData.append(purchaseInfo);

        function printTicket() {
            venueData.empty();
            venueData.append('You may print this page as your ticket');
            let ticket = $('<div>').addClass('ticket');
            let heading = $('<div>')
                .addClass('venue-name')
                .addClass('left')
                .append('<h4>Venuemaster</h4>')
                .append(`<h3>${name}</h3>`);

            let venueCode = $('<div>')
                .addClass('right')
                .append('<h5>Venue code</h5>')
                .append(`<h4>${id}</h4>`);


            ticket.append(heading)
                .append(venueCode)
                .append(`<h3>${startingHour}</h3>`)
                .append(`<span>Admit ${quantity}</span>`)
                .append(`<span class="total">${totalPrice} lv</span>`);
            venueData.append(ticket);
        }
    }
}

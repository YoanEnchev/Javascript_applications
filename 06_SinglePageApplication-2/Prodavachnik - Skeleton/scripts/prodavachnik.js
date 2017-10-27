function startApp() {
    const appKey = 'kid_ryvxl_Ra-';
    const appSecret = '32a84cfa420a44228c4a3f9ef2834701';
    const basicUrl = 'https://baas.kinvey.com';
    const authorization_keys = {"Authorization": "Basic " + btoa(appKey + ':' + appSecret)};
    const authorization_user = {"Authorization": "Basic " + btoa("Nathan" + ':' + "Sharp")};

    //sections:
    let listAds = $('#viewAds');

    $('#menu a').show();
    
    (function attachEventsToNav() {
        $('#linkListAds').click(getAds);
    })();

    function getAds() {
        let req = {
            url: `${basicUrl}/appdata/${appKey}/items`,
            success: loadAds,
            headers: authorization_user
        };
        $.ajax(req);

        function loadAds(data) {
            $('#viewAds').show();

            let headingRow = $('<tr>');
            headingRow.append('<th>Title</th>')
                .append('<th>Description</th>')
                .append('<th>Publisher</th>')
                .append('<th>Data Publisher</th>')
                .append('<th>Price</th>')
                .append('<th>Actions</th>');

            $('#viewAds table').append(headingRow);

            for (add of data) {
                let newRow = $('<tr>');
                newRow.append(`<td>${add.title}</td>`)
                    .append(`<td>${add.description}</td>`)
                    .append(`<td>${add.publisher}</td>`)
                    .append(`<td>${add.dateOfPublishing}</td>`)
                    .append(`<td>${add.price}</td>`);

                $('#viewAds table').append(newRow);
            }
        }
    }
}
//https://baas.kinvey.com/appdata/kid_ryyOPgFab/books
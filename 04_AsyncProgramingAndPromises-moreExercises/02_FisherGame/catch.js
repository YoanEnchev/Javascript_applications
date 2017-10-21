function attachEvents() {
    //DOM elements
    let angler = $('#addForm input.angler');
    let weight = $('#addForm input.weight');
    let species = $('#addForm input.species');
    let location = $('#addForm input.location');
    let bait = $('#addForm input.bait');
    let captureTime = $('#addForm input.captureTime');
    let allCatches = $('#catches');

    //DOM events:
    $('button.add').click(addNewCatch);
    $('button.load').click(getCatches);

    //Authorization:
    const username = "Nathan";
    const password = "Sharp";
    const base64auth = btoa(username + ":" + password);
    const authHeaders = {"Authorization": "Basic " + base64auth};

    getCatches();

    function addNewCatch() {
        let req = {
            method: 'POST',
            url: 'https://baas.kinvey.com/appdata/kid_SkGidrQ6Z/biggestCatches',
            headers: authHeaders,
            success: getCatches, //gets and loads all catches
            data: {
                angler: angler.val(),
                weight: weight.val(),
                species: species.val(),
                location: location.val(),
                bait: bait.val(),
                captureTime: captureTime.val()
            },
        };
        $.ajax(req);
    }

    function getCatches() {
        let req = {
            url: 'https://baas.kinvey.com/appdata/kid_SkGidrQ6Z/biggestCatches',
            headers: authHeaders,
            success: loadCatches
        };
        $.ajax(req);
    }

    function loadCatches(catches) {
        allCatches.empty();

        for (currentCatch of catches) {
            let catchBlock = $(`<div class="catch" id="${currentCatch._id}">`)
                .append('<label>Angler</label>')
                .append($('<input class="angler">').val(`${currentCatch.angler}`))
                .append('<label>Weight</label>')
                .append($('<input class="weight">').val(`${currentCatch.weight}`))
                .append('<label>Species</label>')
                .append($('<input class="species">').val(`${currentCatch.species}`))
                .append('<label>Location</label>')
                .append($('<input class="location">').val(`${currentCatch.location}`))
                .append('<label>Bait</label>')
                .append($('<input class="bait">').val(`${currentCatch.bait}`))
                .append('<label>Capture Time</label>')
                .append($('<input class="captureTime">').val(`${currentCatch.captureTime}`));

            let updateButton = $('<button class="update">Update</button>').click(updateCatch);
            let deleteButton = $('<button class="delete">Delete</button>').click(deleteCatch);

            catchBlock.append(updateButton).append(deleteButton);
            allCatches.append(catchBlock);
        }
    }

    function deleteCatch() {
        let id = $(this).parent().attr('id');

        let req = {
            method: 'DELETE',
            url: `https://baas.kinvey.com/appdata/kid_SkGidrQ6Z/biggestCatches/${id}`,
            headers: authHeaders,
            success: getCatches
        };
        $.ajax(req);
    }

    function updateCatch() {
        let catchAngler = $(this).parent().find('input.angler').val();
        let catchWeight = $(this).parent().find('input.weight').val();
        let catchSpecies = $(this).parent().find('input.species').val();
        let catchLocation = $(this).parent().find('input.location').val();
        let catchBait = $(this).parent().find('input.bait').val();
        let catchTime = $(this).parent().find('input.captureTime').val();

        let id = $(this).parent().attr('id');

        let req = {
            method: 'PUT',
            url: `https://baas.kinvey.com/appdata/kid_SkGidrQ6Z/biggestCatches/${id}`,
            data: {
                angler: catchAngler,
                weight: catchWeight,
                species: catchSpecies,
                location: catchLocation,
                bait: catchBait,
                captureTime: catchTime
            },
            headers: authHeaders,
            success: getCatches
        };
        $.ajax(req);
    }
}
(function loadData() {
    //Authorization:
    const username = "guest";
    const password = "guest";
    const base64auth = btoa(username + ":" + password);
    const authHeaders = {"Authorization": "Basic " + base64auth};

    let table = $('table#results');

    let req = {
        url: 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students',
        headers: authHeaders,
        success: printData
    };
    $.ajax(req);

    function printData(data) {
        for (student of data) {
            let row = $('<tr>')
                .append(`<th>${student._id}</th>`)
                .append(`<th>${student.FirstName}</th>`)
                .append(`<th>${student.LastName}</th>`)
                .append(`<th>${student.FacultyNumber}</th>`)
                .append(`<th>${student.Grade}</th>`);

            table.append(row);
        }
    }
})();

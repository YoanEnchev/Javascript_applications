function attachEvents() {
    let button = $('#btnLoadTowns');
    let towns_input = $('#towns');
    let listOTowns = $('#root');

    let data = {};
    let template_html = $('#towns-template').html();
    let template = Handlebars.compile(template_html);//.compile();

    button.click(printTowns);

    function printTowns() {
        data.towns = towns_input.val().split(', ');
        if(data.towns[0] !== "") {
            let result = template(data);
            listOTowns.html(result);
        }
        else  { //no towns were written
            listOTowns.html('<p>No towns.</p>')
        }
    }
}
$(() => {
    let body = $('body');
    let data =  window.cats;
    renderCatTemplate();

    function renderCatTemplate() {
        let source = $('#cat-template').html();
        let template = Handlebars.compile(source);
        let statusCats = template(data);
        body.append(statusCats);
        $('button.btn').click(showStatusCode);
    }

    function showStatusCode() {
        let description = $(this).next();
        description.show();
    }
})

$(() => {
    const contactList = $('#list div.content');
    const contactDetails = $('#details div.content');
    let contacts = [];

    loadData();
    loadTemplates();

    async function loadData() {
        contacts = await $.get('data.json');
    }

    async function loadTemplates() {
        const contact_source = await $.get('templates/contact.html');
        const details_source = await $.get('templates/details.html');

        const contactBox = Handlebars.compile(contact_source);
        const detailBox = Handlebars.compile(details_source);

        for (let contact of contacts) {
            let filledBox = contactBox(contact);
            contactList.append(filledBox);
            //attach click event to current contact:
            contactList.children().last().click(() => loadDetails(contact));
        }

        function loadDetails(contact) {
            let filledBox = detailBox(contact);
            contactDetails.html(filledBox);
        }
    }
});
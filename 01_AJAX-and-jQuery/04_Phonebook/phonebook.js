(function start() {
    let list = $('ul');
    list.empty();

    $('#btnCreate').click(create);
    $('#btnLoad').click(getContacts);


    function getContacts() {
        let req = {
            url : 'https://phonebook-yoan.firebaseio.com/.json',
            success: displayContacts
        };

        $.ajax(req);
    }

    function displayContacts(data) {
        list.empty();

        for(let contact in data) {
           let nameAndPhone = data[contact];
           let name = nameAndPhone.name;
           let phone = nameAndPhone.phone;

           let listItem = $(`<li>${name}: ${phone} </li>`);
           let deleteLink = $('<a href="#">[Delete]</a>').click(() => deleteItem(contact));

           listItem.append(deleteLink);
           list.append(listItem);
        }
    }
    
    function create() {
        let contact = {
            name: $('#person').val(),
            phone:  $('#phone').val()
        };

        let req = {
            url : 'https://phonebook-yoan.firebaseio.com/.json',
            method: 'POST',
            data: JSON.stringify(contact),
            error: displayError,
            success: getContacts
        };
        $.ajax(req);
    }

    function deleteItem(id) {
        let req = {
            url : `https://phonebook-yoan.firebaseio.com/${id}.json`,
            method: 'DELETE',
            error: displayError,
            success: getContacts
        };

        $.ajax(req);
    }

    function displayError(err) {
        alert(`Error: ${err.statusText}`);
    }
})()
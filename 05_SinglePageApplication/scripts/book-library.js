function startApp() {
    let tableOfBooks = $('#viewBooks table tbody');
    tableOfBooks.css('display', 'block');

    //Authorization:
    const appKey = "kid_ryyOPgFab";
    const appSecret = "0fee2da00c9c42cc9d1053be3bc0b7a8";
    const username = "Nathan";
    const password = "Sharp";
    const base64auth = btoa(username + ":" + password);
    const authHeaders = {"Authorization": "Basic " + base64auth};
    const authForUsesRegister = {
        "Authorization": "Basic " + btoa(appKey + ':' + appSecret),
        //"Content-Type": "application/json"
    };

    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " + btoa(appKey + ":" + appSecret),
    };

    //DOM elements:
    //navigation bar:
    let linkHome = $('#linkHome');
    let linkLogin = $('#linkLogin');
    let linkRegister = $('#linkRegister');
    let listLink = $('#linkListBooks');
    let createLink = $('#linkCreateBook');
    let logoutLink = $('#linkLogout');

    //sections:
    let viewHome = $('#viewHome');
    let viewLogin = $('#viewLogin');
    let viewRegister = $('#viewRegister');
    let viewBooks = $('#viewBooks');
    let viewCreateBook = $('#viewCreateBook');
    let viewEditBook = $('#viewEditBook');

    //boxes:
    let loadingBox = $('#loadingBox');
    let successBox = $('#successBox');
    let errorBox = $('#errorBox');

    (function attachEvents() {
        //navigation
        linkHome.click(showHome);
        createLink.click(showCreateBook);
        linkLogin.click(showLogin);
        linkRegister.click(showRegisterForm);
        listLink.click(getBooks);
        logoutLink.click(logOut);

        //buttons
        let createButton = viewCreateBook.find('input[type="submit"]');
        createButton.click(e => e.preventDefault());
        createButton.click(createNewBook);

        let regiserButton = viewRegister.find('input[type="submit"]');
        regiserButton.click(e => e.preventDefault());
        regiserButton.click(registerUser);

        let loginButton = viewLogin.find('input[type="submit"]');
        loginButton.click(e => e.preventDefault());
        loginButton.click(login);
    })();

    localStorage.clear();
    showHome();

    function showAllNavButtons() {
        $('#menu a').show();
    }

    function showHome() {
        let userLoggedIn = localStorage.getItem('username') !== null;
        hideAllSections();
        viewHome.css('display', 'block');
        if (userLoggedIn) {
            linkRegister.hide();
            linkLogin.hide();
        } else {
            listLink.hide();
            createLink.hide();
            logoutLink.hide();
        }
    }

    function showLogin() {
        hideAllSections();
        viewLogin.css('display', 'block');
    }

    function showRegisterForm() {
        hideAllSections();
        viewRegister.css('display', 'block');
    }

    function showCreateBook() {
        hideAllSections();
        viewCreateBook.css('display', 'block');
    }

    function logOut() {
        hideAllSections();
        viewHome.css('display', 'block');
        localStorage.clear();
        setGreeting();
        successMessage('Logged out.');

        linkRegister.show();
        linkLogin.show();
        listLink.hide();
        createLink.hide();
        logoutLink.hide();
    }

    function showEditBook(id, title, author, description) {
        hideAllSections();
        viewEditBook.css('display', 'block');

        let editTitle = viewEditBook.find('input[name="title"]');
        editTitle.val(title);

        let editAuthor = viewEditBook.find('input[name="author"]');
        editAuthor.val(author);

        let editDescr = viewEditBook.find('textarea');
        editDescr.val(description);

        let editButton = viewEditBook.find('input[type="submit"]');
        editButton.click(e => e.preventDefault());
        editButton.click(editBook);

        function editBook() {
            let req = {
                method: 'PUT',
                url: `https://baas.kinvey.com/appdata/kid_ryyOPgFab/books/${id}`,
                data: {
                    title: editTitle.val(),
                    author: editAuthor.val(),
                    description: editDescr.val()
                },
                headers: authHeaders,
                success: getBooks
            };
            $.ajax(req);
        }

    }

    function getBooks() {
        loadingMessage('Loading books...');

        let req = {
            url: 'https://baas.kinvey.com/appdata/kid_ryyOPgFab/books',
            headers: authHeaders,
            success: loadBooks
        };
        $.ajax(req);

        function loadBooks(data) {
            hideAllSections();
            showAllNavButtons();
            tableOfBooks.empty();
            viewBooks.css('display', 'block');

            linkLogin.hide();
            linkRegister.hide();

            successMessage('Books loaded.');

            let firstRow = $('<tr>');
            firstRow.append('<th>Title</th>')
                .append('<th>Author</th>')
                .append('<th>Description</th>')
                .append('<th>Actions</th>');

            tableOfBooks.append(firstRow);

            for (let book of data) {
                let id = book._id;
                let title = book.title;
                let author = book.author;
                let description = book.description;

                let deleteButton = $('<a href="#">[Delete]</a>').click(() => deleteBook(id));
                let updateButton = $('<a href="#">[Update]</a>').click(() => showEditBook(id, title, author, description));

                let newRow = $('<tr>');
                newRow.append(`<td>${title}</td>`)
                    .append(`<td>${author}</td>`)
                    .append(`<td>${description}</td>`);

                if (book.uploadedBy === localStorage.getItem('username')) {
                    let actions = $('<td>');
                    actions.append(deleteButton);
                    actions.append(updateButton);

                    newRow.append(actions);
                }
                else {
                    newRow.append('<td>');
                }

                tableOfBooks.append(newRow);
            }
        }
    }

    function createNewBook() {
        loadingMessage('Creating book...');

        let title = viewCreateBook.find('input[name="title"]');
        let author = viewCreateBook.find('input[name="author"]');
        let description = viewCreateBook.find('textarea[name="description"]');

        let req = {
            method: "POST",
            url: 'https://baas.kinvey.com/appdata/kid_ryyOPgFab/books',
            headers: authHeaders,
            success: function () {
                loadingMessage('Created book successfully');
                getBooks();
            },
            contentType: 'application/json',
            data: JSON.stringify({
                title: title.val(),
                author: author.val(),
                description: description.val(),
                uploadedBy: localStorage.getItem('username')
            }),
            //error: printError,
        };
        $.ajax(req);
    }

    function hideAllSections() {
        let allSections = $('section');
        allSections.css('display', 'none');
    }

    function registerUser() {
        loadingMessage('Attempting to register...');

        let username = viewRegister.find('input[name="username"]').val();
        let password = viewRegister.find('input[name="passwd"]').val();

        let req = {
            method: "POST",
            url: 'https://baas.kinvey.com/user/kid_ryyOPgFab',
            headers: authForUsesRegister,
            data: {
                username: username,
                password: password
            },
            success: setStorage,
            error: errorMessage
        };
        $.ajax(req);
    }

    function login() {
        loadingMessage('Attempting to login...');

        let username = viewLogin.find('input[name="username"]').val();
        let password = viewLogin.find('input[name="passwd"]').val();

        let req = {
            url: 'https://baas.kinvey.com/user/kid_ryyOPgFab/login',
            method: 'POST',
            headers: authHeaders,
            data: {
                username: username,
                password: password,
            },
            success: setStorage,
            error: errorMessage
        };
        $.ajax(req);
    }

    function setStorage(data) {
        localStorage.setItem('authtoken', data._kmd.authoken);
        localStorage.setItem('username', data.username);
        setGreeting();
        getBooks();
    }

    function setGreeting() {
        let username = localStorage.getItem('username');
        if (username !== null) {
            $('#loggedInUser').text(`Welcome, ${ localStorage.getItem('username')}`);
        }
        else {
            $('#loggedInUser').text('');
        }
    }

    function deleteBook(id) {
        let req = {
            method: 'DELETE',
            url: `https://baas.kinvey.com/appdata/kid_ryyOPgFab/books/${id}`,
            headers: authHeaders,
            success: getBooks
        };
        $.ajax(req);
    }

    function successMessage(message) {
        loadingBox.hide();
        successBox.show();
        successBox.text(message);

        setTimeout(function () {
            successBox.fadeOut();
        }, 3000);
    }

    function loadingMessage(message) {
        loadingBox.text(message);
        loadingBox.show();
    }

    function errorMessage(error) {
        errorBox.show();
        loadingBox.hide();

        errorBox.text(error.responseJSON.description);
        setTimeout(function () {
            errorBox.fadeOut();
        }, 3000);
    }
}
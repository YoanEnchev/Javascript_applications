function startApp() {
    //authorization and keys:
    const key = 'kid_ryvxl_Ra-';
    const secretKey = '32a84cfa420a44228c4a3f9ef2834701';
    const baseUrl = 'https://baas.kinvey.com';
    let authentication_user = {"Authorization": "Basic " + btoa("Nathan" + ":" + "Sharp")};
    let authentication_keys = {"Authorization": "Basic " + btoa(key + ':' + secretKey)};

    //DOM sections and forms
    const homeSection = $('#viewHome');
    const viewAds = $('#viewAds');
    const viewCreateAds = $('#viewCreateAd');
    const registerForm = $('#viewRegister');
    const loginForm = $('#viewLogin');
    const detailsSection = $('#viewDetails');
    const editSection = $('#viewEditAd');

    //DOM navigation bar
    const allNavElements = $('header#menu a');
    const home_nav = $('#linkHome');
    const listAds_nav = $('#linkListAds');
    const createAd_nav = $('#linkCreateAd');
    const register_nav = $('#linkRegister');
    const login_nav = $('#linkLogin');
    const logout_nav = $('#linkLogout');

    //DOM info boxes
    const successBox = $('#infoBox');
    const errorBox = $('#errorBox');
    const loadingBox = $('#loadingBox');
    const infoBoxes = [successBox, errorBox, loadingBox];

    localStorage.clear();
    showHomeSection();

    function showHomeSection() {
        hideAllSections();
        homeSection.show();
        showSpecificNavLinks();
    }

    (function attachEvents() {
        //nav buttons
        home_nav.click(showHomeSection);
        listAds_nav.click(getAds);
        createAd_nav.click(viewCreateSection);
        register_nav.click(viewRegister);
        login_nav.click(viewLoginForm);
        logout_nav.click(logoutUser);
        //form buttons
        $('#buttonLoginUser').click(loginUser);
        $('#buttonRegisterUser').click(registerUser);
        $('#buttonCreateAd').click(createNewAdd);
    })();

    function getAds() {
        showSpecificNavLinks();
        displayBoxWithMessage(loadingBox, 'Loading adds...');

        let req = {
            url: `${baseUrl}/appdata/${key}/smartphones`,
            success: loadAds,
            error: getError,
            headers: authentication_user
        };
        $.ajax(req);

        function loadAds(data) {
            hideAllSections();
            displayBoxWithMessage(successBox, 'Adds loaded.');
            viewAds.show();
            viewAds.empty();
            hideSuccessBox();

            let source = $('#ad-template').html();
            let template = Handlebars.compile(source);
            let allAds = template(data);
            viewAds.html(allAds);
            $('button.viewDetails').click(getAdData);
        }
    }

    function registerUser() {
        showSpecificNavLinks();
        displayBoxWithMessage(loadingBox, 'Registering...');
        let username = registerForm.find('input[name="username"]').val();
        let password = registerForm.find('input[name="passwd"]').val();

        let req = {
            method: "POST",
            url: `${baseUrl}/user/${key}`,
            headers: authentication_keys,
            data: {
                username: username,
                password: password
            },
            success: successfulRegistration,
            error: getError
        };
        $.ajax(req);
    }

    function createNewAdd() {
        displayBoxWithMessage(loadingBox, 'Creating new add...');

        let title = viewCreateAds.find('input[name="title"]').val();
        let description = viewCreateAds.find('textarea[name="description"]').val();
        let image = viewCreateAds.find('input[name="image-link"]').val();
        let price = viewCreateAds.find('input[name="price"]').val();
        let publisher = localStorage.getItem('username');

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0
        let yyyy = today.getFullYear();
        let dateOfPublishing = `${mm}/${dd}/${yyyy}`;

        let req = {
            method: "POST",
            url: `${baseUrl}/appdata/${key}/smartphones`,
            headers: authentication_user,
            data: {title, description, image, price, dateOfPublishing, publisher},
            success: createdAddSuccessfully,
            error: getError
        };
        $.ajax(req);
    }

    function viewCreateSection() {
        hideAllSections();
        $('#viewCreateAd').show();
    }

    function viewEditSection(id, title, price, description, image, publisher, dateOfPublishing) {
        hideAllSections();
        editSection.show();
        editSection.find('input[name="title"]').val(title);
        editSection.find('textarea[name="description"]').val(description);
        editSection.find('input[name="image"]').val(image);
        editSection.find('input[name="price"]').val(price);
        $('#buttonEditAd').click(editAdd);

        function editAdd() {
            displayBoxWithMessage(loadingBox, 'Editing add...');

            title = editSection.find('input[name="title"]').val();
            description = editSection.find('textarea[name="description"]').val();
            image = editSection.find('input[name="image"]').val();
            price = editSection.find('input[name="price"]').val();

            let req = {
                method: 'PUT',
                url: `${baseUrl}/appdata/${key}/smartphones/${id}`,
                data: {title, description, image, price, publisher, dateOfPublishing},
                headers: authentication_user,
                success: editAddSuccess,
                error: getError
            };
            $.ajax(req);
        }
    }

    function viewRegister() {
        hideAllSections();
        registerForm.show();
    }

    function viewLoginForm() {
        hideAllSections();
        loginForm.show();
    }

    function loginUser() {
        displayBoxWithMessage(loadingBox, 'Login...');

        let username = loginForm.find('input[name="username"]').val();
        let password = loginForm.find('input[name="passwd"]').val();

        let req = {
            url: `${baseUrl}/user/${key}/login`,
            method: 'POST',
            headers: authentication_user,
            data: {username, password},
            success: successfulLogin,
            error: getError
        };
        $.ajax(req);
    }

    function logoutUser() {
        localStorage.clear();
        showSpecificNavLinks();
        showHomeSection();
        displayBoxWithMessage(successBox, 'Logged out');
        hideSuccessBox();
    }

    function getAdData() {
        let id = $(this).parent().attr('data-id');

        let req = {
            url: `${baseUrl}/appdata/${key}/smartphones/${id}`,
            headers: authentication_user,
            success: showDetails,
            error: getError
        };
        $.ajax(req);
    }

    function showDetails(data) {
        hideAllSections();
        detailsSection.empty();
        detailsSection.show();

        let source = $('#details-template').html();
        let template = Handlebars.compile(source);
        let addDetails = $(template(data));
        detailsSection.html(addDetails);

        $('#otherAds').click(getAds);

        let editBtn = $('#editBtn');
        editBtn.click(() => viewEditSection
        (data.id, data.title, data.price, data.description, data.image, data.publisher, data.dateOfPublishing));

        let deleteBtn = $('#deleteBtn');
        deleteBtn.click(() => deleteAdd(data.id));

        let username = localStorage.getItem('username');
        let authtoken = localStorage.getItem('authtoken');

        if (username !== data.publisher && username !== 'admin') {
            editBtn.remove();
            deleteBtn.remove();
        }
    }


    function deleteAdd(id) {
        displayBoxWithMessage(loadingBox, 'Deleting add...');

        let req = {
            method: 'DELETE',
            url: `${baseUrl}/appdata/${key}/smartphones/${id}`,
            headers: authentication_user,
            success: deletedAddSuccess,
            error: getError
        };
        $.ajax(req);
    }

    function setStorage(data) {
        localStorage.setItem('authtoken', data._kmd.authtoken);
        localStorage.setItem('username', data.username);
    }

    function successfulLogin(data) {
        showHomeSection();
        displayBoxWithMessage(successBox, 'Login successful.');
        setStorage(data);
        showSpecificNavLinks();
        loginForm.find('input[name="username"]').val('');
        loginForm.find('input[name="passwd"]').val('');
        hideSuccessBox();
    }

    function successfulRegistration(data) {
        setStorage(data);
        showHomeSection();
        displayBoxWithMessage(successBox, 'Registered successfully.');
        showSpecificNavLinks();
        registerForm.find('input[name="username"]').val('');
        registerForm.find('input[name="passwd"]').val('');
        hideSuccessBox();
    }

    function deletedAddSuccess() {
        showHomeSection();
        displayBoxWithMessage(successBox, 'Add deleted.');
        hideSuccessBox();
    }

    function editAddSuccess(data) {
        showDetails(data);
        displayBoxWithMessage(successBox, 'Add edited.');
        editSection.find('input[name="title"]').val('');
        editSection.find('textarea[name="description"]').val('');
        editSection.find('input[name="image"]').val('');
        editSection.find('input[name="price"]').val('');
        hideSuccessBox();
    }

    function createdAddSuccessfully(data) {
        showDetails(data);
        displayBoxWithMessage(successBox, 'Add created.');
        viewCreateAds.find('input[name="title"]').val('');
        viewCreateAds.find('textarea[name="description"]').val('');
        viewCreateAds.find('input[name="image-link"]').val('');
        viewCreateAds.find('input[name="price"]').val('');
        hideSuccessBox();
    }

    function displayBoxWithMessage(box, message) {
        for (let infoBox of infoBoxes) {
            infoBox.hide()
        }

        box.text(message);
        box.show();
    }

    function hideSuccessBox() {
        setTimeout(function () {
            successBox.fadeOut();
        }, 3000);
    }

    function showSpecificNavLinks() {
        hideAllNavButtons();
        let showNavLinks = [];

        if (localStorage.getItem('username') === null) {
            showNavLinks = [home_nav, register_nav, login_nav];
        }
        else {
            showNavLinks = [home_nav, listAds_nav, createAd_nav, logout_nav];
        }

        for (let navBtn of showNavLinks) {
            navBtn.show();
        }
    }

    function getError(error) {
        displayBoxWithMessage(errorBox, error.responseJSON.description);
    }

    function hideAllNavButtons() {
        allNavElements.hide();
    }

    function hideAllSections() {
        $('section').hide();
    }
}
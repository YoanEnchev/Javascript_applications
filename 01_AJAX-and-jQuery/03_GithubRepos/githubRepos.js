function loadRepos() {
    let listRepositories = $('#repos');

    let user = $('#username').val();
    let url = `https://api.github.com/users/${user}/repos`;

    let request = {
        url,
        method: "GET",
        success: display,
        error: onError
    };
    $.ajax(request);

    function onError(err) {
        listRepositories.text('Error: ' + err.statusText);
    }

    function display(repos) {
        for (repo of repos) {
            let listItem = $('<li>');
            let link = $('<a>')
                .attr('href', repo.html_url)
                .text(repo.full_name);
            listItem.append(link);
            listRepositories.append(listItem);
        }
    }
}
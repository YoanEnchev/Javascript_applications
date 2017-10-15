function loadCommits() {
    let username = $('#username').val();
    let repository = $('#repo').val();
    let listOfCommits = $('#commits');

    $.get(`https://api.github.com/repos/${username}/${repository}/commits`)
        .then(displayCommits)
        .catch(displayError);

    function displayCommits(data) {
        listOfCommits.empty();

        for (commit of data) {
           let authorName = commit.commit.author.name;
           let description = commit.commit.message;

            listOfCommits.append(`<li>${authorName}: ${description}</li>`);
        }
    }

    function displayError(error) {
        let statusText = error.statusText;
        let code = error.status;
        listOfCommits.empty();
        listOfCommits.append(`<li>Error: ${code} (${statusText})</li>`);
    }
}
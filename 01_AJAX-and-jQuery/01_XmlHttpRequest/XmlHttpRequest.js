function loadRepos() {
    let req = new XMLHttpRequest();
    req.addEventListener('load', function () {
        let text = (this.responseText);
        document.getElementById('res').textContent = text;
    });

    req.open('GET', "https://api.github.com/users/testnakov/repos", true);
    req.send();
}
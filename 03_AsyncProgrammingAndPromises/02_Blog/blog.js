function attachEvents() {
    let baseURL = 'https://baas.kinvey.com/appdata/kid_B1Gsfpga-/';

    //DOM elements:
    let posts = $('#posts');
    let postBody = $('#post-body');
    let postTitle = $('#post-title');
    let postComments = $('#post-comments');

    //Authorization:
    const username = "Nathan";
    const password = "Sharp";
    const base64auth = btoa(username + ":" + password);
    const authHeaders = {"Authorization": "Basic " + base64auth};

    //Event listeners:
    $('#btnLoadPosts').click(getPosts);
    $('#btnViewPost').click(getSelectedPostDetails);


    function getPosts() {
        let req = {
            url: baseURL + 'articles',
            headers: authHeaders,
            success: loadPosts
        };
        $.ajax(req);

        function loadPosts(data) {
            for (article of data) {
                let id = article._id;
                let title = article.title;
                let newPost = $('<option>')
                    .text(title)
                    .val(id);
                posts.append(newPost);
            }
        }
    }

    function getSelectedPostDetails() { //title, content, comments
        let id = posts.find('option:selected').val();

        let req = {
            url: baseURL + 'articles/' + id,
            headers: authHeaders,
            success: showTitleAndContent
        };
        $.ajax(req);


        req = {
            url: baseURL + 'comments',
            headers: authHeaders,
            success: getComments
        };
        $.ajax(req);

        function showTitleAndContent(data) {
            let title = data.title;
            let body = data.body;

            postTitle.text(title);
            postBody.text(body);
        }

        function getComments(data) {
            for (comment of data) {
                if (comment.postID === id) {
                    postComments.append(`<li>${comment.text}</li>`);
                }
            }
        }
    }
}
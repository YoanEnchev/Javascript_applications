function attachEvents() {
    let messageBox = $('#messages');
    let author = $('#author');
    let content = $('#content');

    let url = 'https://messegner-yoan.firebaseio.com/.json';
    $('#submit').click(addNewMessage);
    $('#refresh').click(getMessages);

    function getMessages() {
        let req = {
            url,
            success: printMessages
        };
        $.ajax(req);

        function printMessages(data) {
            messageBox.text('');

            for (id in data) {
                let message = data[id];
                let text = `${message.author}: ${message.content}\n`;
                messageBox.append(text);
            }
        }
    }

    function addNewMessage() {
        let newMessage = {
            author: author.val(),
            content: content.val(),
            timestamp: Date.now()
        };

        let req = {
            url,
            method: 'POST',
            data: JSON.stringify(newMessage),
            success: getNewMessage //after it's taken from the datebase, it will be added to the messagebox.
        };
        $.ajax(req);

        function getNewMessage(obj) {
            let req = {
                url: `https://messegner-yoan.firebaseio.com/${obj.name}.json`,
                success: printNewMessage //will ad it to the message box
            };
            $.ajax(req);
        }

        function printNewMessage(msg) {
            let text = `${msg.author}: ${msg.content}\n`;
            messageBox.append(text);
        }
    }
}
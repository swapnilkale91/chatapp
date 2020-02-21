const socket = io();

socket.on('sendmessage', (message) => {
    console.log(message);
    $('#messages').append($('<li>').html(message));
})

socket.on('is_online', function (username) {
    $('#messages').append($('<li>').html(username));
});

var username = prompt('Please tell me your name');
username = !username ? 'Anonymous' : username;
socket.emit('username', username);



function submitMessage() {
    let message = document.getElementById("message").value;
    document.getElementById("message").value = "";
    socket.emit('submitmessage', message, (callbackmessage) => {
        console.log(callbackmessage);
    })
}

function sendLocation() {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        let location = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
        console.log('location', location);
        socket.emit('sendlocation', location, (callbackmessage) => {
            console.log(callbackmessage);
        })
    })
}
const socket = io();
let username = '';

socket.on('sendmessage', (message) => {
    $('#messages').append($('<li class="others py-4">').html(message));

    $("html, body").animate({ 
        scrollTop: $( 
          'html, body').get(0).scrollHeight 
    }); 
})

socket.on('is_online', function (username) {
    $('#messages').append($('<li class="py-4">').html(username));
});

socket.on('istyping', function (message) {
  //  $('#typing').text(message)
    $('#typing').text(message);
    setTimeout(function(){
        $('#typing').text('Chat Room');
    }, 200);
});

while(!username){
    username = prompt('Please tell me your name');
};
username = !username ? 'Anonymous' : username;
socket.emit('username', username);

window.onbeforeunload = function() {
    return true;
};

function submitMessage() {
    let message = document.getElementById("message").value;
    if(!message) return;
    document.getElementById("message").value = "";
    socket.emit('submitmessage', message, (callbackmessage) => {
        alert(callbackmessage);
    })

    $("html, body").animate({ 
        scrollTop: $( 
          'html, body').get(0).scrollHeight 
    }); 

    $('#messages').append($('<li class="me py-4">').html(message));
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

function isTyping() {
    socket.emit('istyping', username);
}
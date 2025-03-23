const socket = io();
let username = '';

window.onload = () => {
    const usernameInput = document.getElementById('username');
    usernameInput.addEventListener('change', () => {
        username = usernameInput.value.trim() || 'Stranger';
        console.log('Username set:', username);
        socket.emit('newUser', username);
    });
};


function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message) {
        const payload = {
            username: username || 'Stranger',
            message: message,
            time: new Date().toLocaleTimeString(),
        };
        console.log('Sending message:', payload);
        socket.emit('chatMessage', payload);
        input.value = ''; 
    }
}



function leaveChat() {
    if (username) {
        socket.emit('userLeft', username); 
    }
    socket.disconnect();
    alert('You have left the chat.');
    location.reload(); 
}

socket.on('chatMessage', (msg) => {
    console.log('Received message:', msg);
    displayMessage(msg);
});

socket.on('userJoined', (msg) => {
    console.log('User event:', msg);
    displayMessage({ username: 'System', message: msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
});


function displayMessage({ username, message, time }) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `
                                <strong>${username}</strong> 
                                [${time}]: ${message}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; 
}


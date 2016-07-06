'use strict';
const io = require('socket.io-client');
const sock = io('/game');
const rp = require('right-pad');

const userCountTarget = document.getElementById('userCount');
const randIdTarget = document.getElementById('randId');
const randNumTarget = document.getElementById('rand');
const resetTarget = document.getElementById('resetCount');
const revealButton = document.getElementById('reveal');
const resetButton = document.getElementById('reset');


function sanitizeArray(arr) {
  return arr.map((elem, idx) => `${rp(String(idx), 2, '')}_ ${elem+1}`).join("\r\n");
}

//
sock.on('userCount', userCount => (userCountTarget.innerHTML = userCount));
sock.on('resetCount', resetCount => (resetTarget.innerHTML = resetCount));
sock.on('randId', randId => (randIdTarget.innerHTML = randId));
sock.on('result', result => (randNumTarget.innerHTML = sanitizeArray(result)));
sock.on('hide', () => (randNumTarget.innerHTML = ''));

//
revealButton.addEventListener('click', () => {
  sock.emit('reveal');
});

//
resetButton.addEventListener('click', () => {
  sock.emit('reset');
});

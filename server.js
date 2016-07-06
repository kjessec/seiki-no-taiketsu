'use strict';
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uuid = require('node-uuid').v4;
const room = io.of('/game');

app.use(express.static('./public'));

console.log('server starting...');


// 전역 쓰기 싫지만 그냥 쓴다, 기본값
let USERCOUNT = 0;
let RESETCOUNT = 0;
let NUMBERS = [];
let ID = -1;

console.log('initial vectors::');

// 접속하면 난수 ID 보낸다
room.on('connection', function(socket) {
  // reveal요청 들어오면 난수 보낸다(라는 핸들러 부착)
  socket.on('reveal', function() {
    console.log('reveal request');
    room.emit('result', NUMBERS);
  });

  // reset요청 들어오면 리셋하고, hide하고, 새 ID보냄
  socket.on('reset', function() {
    reset();
    room.emit('hide');
    room.emit('randId', ID);
    room.emit('resetCount', ++RESETCOUNT);
  });

  // 접속해제
  socket.on('disconnect', function() {
    console.log('disconnect');
    room.emit('userCount', --USERCOUNT);
  });

  // 리셋
  reset();

  // 새 사람 들어오면 가려
  room.emit('hide');

  // usercount
  room.emit('userCount', ++USERCOUNT);

  // ID보냄 (난수 매칭 확인용)
  room.emit('randId', ID);
});

// 서버 구동
server.listen(process.env.PORT || 8080);

//////////////////////////////////////////////////////////함수들
// 100개의 100까지의 난수 생성
function createRandomNumbers() {
  const arr = [];
  for(let i=0; i<50; i++) {
    arr.push(~~(Math.random() * 100));
  }
  return arr;
}

function reset() {
  // 만들어서 전역에 저장하고
  NUMBERS = createRandomNumbers();

  // 이 난수에 대한 아이디를 저장한다
  ID = uuid();
}

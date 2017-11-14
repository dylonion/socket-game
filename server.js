const io = require('socket.io')();
const PORT = 8000;

const players={}
io.on('connection', (client) => {
  // if(Object.keys(players).length >= 2){
  //   console.log('player limit reached')
  //   return;
  // }else{
  //   console.log('players.length: ',Object.keys(players).length)
  //   players[client.id] = {}
  // }
  players[client.id] = {}
  client.on('playerMouse', (positions) => {
    players[client.id].playerX = positions.mouseX;
    players[client.id].playerY = positions.mouseY;
    players[client.id].name = positions.name;
    let outArray = [];
    for(item in players){
      if(players[item].hasOwnProperty('name')){
        outArray.push({
          id:players[item].name,
          playerX:players[item].playerX,
          playerY:players[item].playerY
        })
      }
      // else{
      //   delete players[item];
      // }
    }
    io.emit('playerPosition',{
      playerstates: outArray
    })
  })
  client.on('disconnect',() => {
    delete players[client.id]
  })
});

io.listen(PORT)

console.log('listening on port', PORT)

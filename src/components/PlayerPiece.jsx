import React from 'react'

function PlayerPiece(props) {
  let x = props.player.playerX;
  let y = props.player.playerY;
  if(x > 500){
    x = 500;
  }
  if(y > 500){
    y = 500
  }
  return (
    <div style={{
      left : x,
      top : y
    }} className="playerPiece">{props.player.id}</div>
  )
}

export default PlayerPiece

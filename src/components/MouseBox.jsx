import React from 'react'
import PlayerPiece from './PlayerPiece'

function MouseBox(props) {
  if(props.dataLoaded){
    console.log('props.players typeof: ', typeof(props.players))
    console.log(props.players)
    return (
      <div className="bound-box" onMouseMove={props.mouseCheck}>
        {props.players.map(function(el,index){
          if(el.hasOwnProperty('playerX') && el.hasOwnProperty('playerY')){
            return <PlayerPiece key={index} player={el} />
          }
        })}
      </div>
    )
  }else{
    return (
      <div className="bound-box" onMouseMove={props.mouseCheck}></div>
    )
  }
}

export default MouseBox

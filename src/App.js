import React, { Component } from 'react';
import MouseBox from './components/MouseBox'
import './App.css';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      players:{},
      dataLoaded:false,
      playerName: ''
    }
    this.mouseCheck = this.mouseCheck.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
  }
  componentDidMount() {
    socket.on('playerPosition', (players)=> {
     this.setState({
      players: players.playerstates,
      dataLoaded:true
     })
    })
  }
  inputHandler(e) {
    let v = e.target.value;
    this.setState({
      playerName: v
    })
  }
  mouseCheck(event) {
    this.setState({
      mouseX: event.clientX,
      mouseY: event.clientY
    })
    socket.emit('playerMouse',{
      name: this.state.playerName,
      mouseX: this.state.mouseX,
      mouseY: this.state.mouseY
    })
  }

  render() {
    return (
      <div className="App">
        <MouseBox mouseCheck={this.mouseCheck} players={this.state.players} dataLoaded={this.state.dataLoaded} />
        <input type="text" placeholder="name" value={this.state.playerName} onChange={this.inputHandler}/>
      </div>
    );
  }
}

export default App;

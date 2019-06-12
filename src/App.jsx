import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import Nav from './Nav.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCount: 0,
      userColor: '',
      currentUser: {name: ''}, 
      messages: []
    }     
    this.socket = new WebSocket('ws://localhost:3001/');
  }
  
  componentDidMount() {
    this.socket.onopen = function (event) {
      console.log('connected to server')
    }
  }

  updateMessage(inputValue){
    this.setState({messages: inputValue})
  }

  updateName(inputValue){
    this.setState({currentUser: {name: inputValue}})
  }

  updateUserCount(inputValue){
    this.setState({userCount: inputValue})
  }

  updateUserColor(inputValue){
    this.setState({userColor: inputValue})
  }

  render() {
    this.socket.onmessage = (event) => {
      console.log('received message')
      const newMessage = JSON.parse(event.data);
      switch (newMessage.type){
        case 'incomingColor':
          this.updateUserColor(newMessage.color);
          break;
        case 'incomingCount':
          this.updateUserCount(newMessage.count);
          break;
        case 'incomingMessage':
        case 'incomingNotification':
          const messages = this.state.messages.concat(newMessage)
          this.updateMessage(messages);
          break;
      }
    }

    const onMessage = (event) => {
      if(event.key === 'Enter'){
        if (event.target.value.trim()){
          const newMessage = {type: 'postMessage',id: '', color: this.state.userColor ,username: this.state.currentUser.name? this.state.currentUser.name: 'Anonymous', content: event.target.value};  
          this.socket.send(JSON.stringify(newMessage))
        }
          event.target.value = '';        
      }
    }

    const onNameChange = (event) => {
      if (!event.target.value.trim()){
        event.target.value = this.state.currentUser.name
      }
      if (!this.state.currentUser.name){ 
        this.updateName('Anonymous')     
      }

      if (event.target.value.trim() !== this.state.currentUser.name && event.target.value.trim()){
        this.updateName(event.target.value)
        const newMessage = {type: 'postNotification',id: '', content: `${this.state.currentUser.name? this.state.currentUser.name: 'Anonymous'} has changed their name to ${event.target.value}`};  
        this.socket.send(JSON.stringify(newMessage))
      } 
      event.target.value = event.target.value.trim()
    }

    return (<div>
      <Nav userCount = {this.state.userCount}/>
      <MessageList messages = {this.state.messages}/>   
      <ChatBar currentUser = {this.state.currentUser} onMessage = {onMessage} onNameChange = {onNameChange}/>
    </div>
    );
  }
}

export default App;

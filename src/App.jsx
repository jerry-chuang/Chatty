import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: ''}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    }     
    this.socket = new WebSocket('ws://localhost:3001/');
  }

  
  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      

      this.socket.onopen = function (event) {
        console.log('connected to server')
      }

      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
  }

  updateMessage(inputValue){
    this.setState({messages: inputValue})
  }

  updateName(inputValue){
    this.setState({currentUser: {name: inputValue}})
  }

  render() {

    this.socket.onmessage = (event) => {
      console.log('received message')
      const newMessage = JSON.parse(event.data);
      const messages = this.state.messages.concat(newMessage)
      this.updateMessage(messages);
    }

    const onMessage = (event) => {
      if(event.key === 'Enter'){
        const newMessage = {id: (this.state.messages.length + 1), username: this.state.currentUser.name? this.state.currentUser.name: 'Anonymous', content: event.target.value};
       
        this.socket.send(JSON.stringify(newMessage))

        event.target.value = '';
      }
    }

    const onNameChange = (event) => {
      this.updateName(event.target.value)
    }

    return (<div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
      </nav>
      <MessageList messages = {this.state.messages}/>
      <ChatBar currentUser = {this.state.currentUser} onMessage = {onMessage} onNameChange = {onNameChange}/>
    </div>
    );
  }
}
export default App;

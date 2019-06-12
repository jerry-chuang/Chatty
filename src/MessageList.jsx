import React, {Component} from 'react';
import Message from './Message.jsx';
import Notification from './Notification.jsx';


class MessageList extends Component {
  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }
  
  render() {
    const messages = this.props.messages.map(message => {
      if (message.type === 'incomingNotification'){
        return <Notification key = {message.id} {...message}/>
      }  
      if (message.type === 'incomingMessage'){
        return <Message key = {message.id} color = {this.props.color} {...message } />
      }
    })

    return (
      <main className="messages">
       {messages}
       <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </main>
      
    );
  }
}
export default MessageList;


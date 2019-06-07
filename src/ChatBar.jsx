import React, {Component} from 'react';


class ChatBar extends Component {
  render() {
    return (
      <footer className="chatbar">
      <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue = {this.props.currentUser.name} onBlur = {this.props.onNameChange}/>
      <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown = {this.props.onMessage}/>
    </footer>
    );
  }
}
export default ChatBar;
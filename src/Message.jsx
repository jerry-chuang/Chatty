import React from 'react';

const Message = (props) => {
  // Check if this.props.content has http:// or https:// follow by .jpg .png or .gif 
  let content = props.content
  let regExp = /(http:\/\/|https:\/\/).*(.jpg|.png|.gif)/
  let regArray = regExp.exec(props.content)

  if (regArray){
    //getting content before and after image
    let regBefore = /(http:\/\/|https:\/\/).*(.jpg|.png|.gif).*/
    let regAfter = /.*(http:\/\/|https:\/\/).*(.jpg|.png|.gif)/
    let contentBefore = content.replace(regBefore, '')
    let contentAfter = content.replace(regAfter, '')
    return (
      <div className="message">
        <span className="message-username" style= {{color: props.color}}>{props.username}</span>          
        <span className="message-content">
          {contentBefore}<br/>
          <img className ="message-image" src ={regArray[0]} />
          <br/>
          {contentAfter}
        </span>
      </div>   
    );
  }

  //if no match found, return normal message
  if(!regArray){
    return (
        <div className="message">
          <span className="message-username" style= {{color: props.color}}>{props.username}</span>          
          <span className="message-content">{content}</span>
        </div>   
    );
  }
}

export default Message;

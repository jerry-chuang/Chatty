import React from 'react';

const Nav = (props) =>(
  <nav className="navbar">
    <a href="/" className="navbar-brand">Chatty</a>
    <span className ="navbar-count">{props.userCount} users online</span>
  </nav>
)

export default Nav;

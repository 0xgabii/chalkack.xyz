import React from 'react';

const SlideControl = props =>
  <div className={props.class}>
    <ul>
      <li id="left" onClick={props.leftClick}>
        <i className="material-icons">keyboard_arrow_left</i>
      </li>
      <li id="right" onClick={props.rightClick}>
        <i className="material-icons">keyboard_arrow_right</i>
      </li>
    </ul>
  </div>;
export default SlideControl;

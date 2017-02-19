import React from 'react';

const SwitchButton = props =>
  <div className={props.class}>
    <input name="switch" id="grid_double" type="radio" />
    <label
      className="switch_label"
      htmlFor="grid_double"
      data-grid={2}
      onClick={props.onClick}
    >크게</label>
    <input name="switch" id="grid_third" type="radio" />
    <label
      className="switch_label"
      htmlFor="grid_third"
      data-grid={3}
      onClick={props.onClick}
    >중간</label>
    <input name="switch" id="grid_fourth" type="radio" />
    <label
      className="switch_label"
      htmlFor="grid_fourth"
      data-grid={4}
      onClick={props.onClick}
    >작게</label>
    <div className="switch_circle">
      <i className="material-icons">view_module</i>
    </div>
  </div>;
export default SwitchButton;

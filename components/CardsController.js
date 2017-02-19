import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { CardsControlAction } from './Sub';

class CardsController extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      buttonClicked: false,
    };
  }
  // 랜덤 위치 버튼
  componentDidMount() {
    const container = $('.cards_control_conntainer');
    const random = Math.floor(Math.random() * 4) + 1;

    switch (random) {
      case 1:
        container.css({ left: '1%', top: '15%' });
        break;
      case 2:
        container.css({ left: '45%', top: '1%' });
        break;
      case 3:
        container.css({ left: '1%', top: '35%' });
        break;
      case 4:
        container.css({ left: '75%', top: '1%' });
        break;
    }
  }
  mouseDown() {
    this.setState({ buttonClicked: true });
  }
  mouseUp() {
    this.setState({ buttonClicked: false });
  }
  mouseMove(e) {
    const $btn = $('#control_cards_btn');
    const top = e.pageY - ($btn.height() / 2);
    const left = e.pageX - ($btn.width() / 2);

    if (this.state.buttonClicked === false) {
      return;
    }

    $btn.parent().css({
      top: `${top}px`,
      left: `${left}px`,
    });
  }
  toggleBtn(e) {
    const $btn = $(e.target);
    $btn.children('i').toggleClass('rotate');
    $btn.siblings('.control_btn_list').toggleClass('active');
  }
  selectAllOn() {
    const $chkbox = $('.custom_checkbox');
    $chkbox.parents('.card').addClass('selected');
    $chkbox.parents('.checkbox').addClass('active');
    $chkbox.prop('checked', true);

    const checked = CardsControlAction();
    this.props.selectAllOff(checked);
  }
  selectAllOff() {
    const $chkbox = $('.custom_checkbox');
    $chkbox.parents('.card').removeClass('selected');
    $chkbox.parents('.checkbox').removeClass('active');
    $chkbox.prop('checked', false);

    const checked = CardsControlAction();
    this.props.selectAllOff(checked);
  }
  render() {
    return (
      <div className="cards_control">
        <div className="cards_control_conntainer">
          <button
            id="control_cards_btn"
            className="material_btn pink"
            data-number={this.props.selectedCardsNum}
            onClick={this.toggleBtn}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseMove={this.mouseMove}
          ><i className="custom_icon" /></button>
          <div className="control_btn_list">
            <button
              id="select_all_cards"
              onClick={this.selectAllOn}
            ><i className="material-icons">check_box</i></button>
            <button
              id="select_no_cards"
              onClick={this.selectAllOff}
            ><i className="material-icons">check_box_outline_blank</i></button>
            <button
              id="select_cards_delete"
              onClick={this.props.openRemovePhoto}
            ><i className="material-icons">delete_forever</i></button>
            <button
              id="select_cards_move"
              onClick={this.props.openMovePhoto}
            ><i className="material-icons">open_in_browser</i></button>
          </div>
        </div>
      </div>
    );
  }
}
export default CardsController;

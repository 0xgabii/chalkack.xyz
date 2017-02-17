import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import siiimpleToast from 'siiimple-toast';
import { ajax } from '../Sub';

class DeletedPhotos extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      select_all: false
    };
    this.initialState = this.state;
    this.toast = new siiimpleToast();
  }
  select(e) {
    $(e.target).siblings('input').prop('checked', !$(e.target).siblings('input').prop('checked'));
  }
  select_all() {
    this.setState({ select_all: true });
  }
  select_none() {
    this.setState({ select_all: false });
  }
  recover_File(e) {
    const photo_arr = [];

    $('.deleted_photo_checkbox').each(function () {
      if ($(this).prop('checked') == true) {
        photo_arr.push($(this).val());
      }
    });

    if (photo_arr.length === 0)
      return;
    if (confirm(photo_arr.length + "개의 사진을 복원하시겠습니까?") == false)
      return;

    ajax({
      url: '/deleted-photos/' + photo_arr.toString(),
      method: 'PUT',
      _callback: (response) => {
        this.toast.message(response);

        this.props.updateData();
        this.props.closeModal();

        this.setState(this.initialState);
      }
    });
  }
  delete_Forever(e) {
    const photo_arr = [];

    $('.deleted_photo_checkbox').each(function () {
      if ($(this).prop('checked') == true) {
        photo_arr.push($(this).val());
      }
    });

    if (photo_arr.length === 0)
      return;
    if (confirm(photo_arr.length + "개의 사진을 영구적으로 삭제하시겠습니까?") == false)
      return;

    ajax({
      url: '/deleted-photos/' + photo_arr.toString(),
      method: 'DELETE',
      _callback: (response) => {
        this.toast.message(response);

        this.props.updateData();
        this.props.closeModal();

        this.setState(this.initialState);
      }
    });
  }
  render() {
    let deleted_photos = [];

    for (var i = 0; i < this.props.data.length; i++) {
      deleted_photos.push(
        <div key={i} className="deleted_photo" onClick={this.select.bind(this)}>
          <input type="checkbox" className="deleted_photo_checkbox" defaultValue={this.props.data[i].idx} checked={this.state.select_all} />
          <label />
          <img src={this.props.data[i].src} />
        </div>
      );
    }
    return (
      <div id="deleted_photos_Modal" className={this.props.status == true ? 'modal active' : 'modal'}>
        <form className={this.props.status == true ? 'modal-content active' : 'modal-content'}>
          <span className="modal-close" onClick={this.props.closeModal}><i className="material-icons">close</i></span>
          <h2 className="modal-header">삭제된 사진들</h2>
          <div className="switch-button">
            <span style={this.state.select_all == true ? { left: '0%' } : { left: '50%' }} className="active" />
            <button className={this.state.select_all == true ? "switch-button-case left active-case" : "switch-button-case left"} type="button" onClick={this.select_all}>모두 선택</button>
            <button className={this.state.select_all == true ? "switch-button-case right" : "switch-button-case right active-case"} type="button" onClick={this.select_none}>취소</button>
          </div>
          <div className="deleted_photos scroll_y">{deleted_photos}</div>
          <div className="modal-footer_button">
            <button id="delete_forever_btn" className="btn" type="button" onClick={this.delete_Forever}>삭제</button>
            <button id="recover_file_btn" className="btn" type="button" onClick={this.recover_File}>복원</button>
          </div>
        </form>
      </div>
    );
  }
}

export default DeletedPhotos;
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
      select_all: false,
    };
    this.initialState = this.state;
    this.toast = new siiimpleToast();
  }
  select(e) {
    $(e.target).siblings('input').prop('checked', !$(e.target).siblings('input').prop('checked'));
  }
  selectAll() {
    this.setState({ select_all: true });
  }
  selectNone() {
    this.setState({ select_all: false });
  }
  recoverFile(e) {
    const photoArr = [];

    $('.deleted_photo_checkbox').each(function () {
      if ($(this).prop('checked') === true) {
        photoArr.push($(this).val());
      }
    });

    if (photoArr.length === 0 || confirm(`${photoArr.length}개의 사진을 복원하시겠습니까?`) === false) {
      return;
    }

    ajax({
      url: `/deleted-photos/${photoArr.toString()}`,
      method: 'PUT',
      _callback: (response) => {
        this.toast.message(response);
        this.props.updateData();
        this.props.closeModal();
        this.setState(this.initialState);
      },
    });
  }
  deleteForever(e) {
    const photoArr = [];

    $('.deleted_photo_checkbox').each(function () {
      if ($(this).prop('checked') === true) {
        photoArr.push($(this).val());
      }
    });

    if (photoArr.length === 0 || confirm(`${photoArr.length}개의 사진을 영구적으로 삭제하시겠습니까?`) === false) {
      return;
    }

    ajax({
      url: `/deleted-photos/${photoArr.toString()}`,
      method: 'DELETE',
      _callback: (response) => {
        this.toast.message(response);
        this.props.updateData();
        this.props.closeModal();
        this.setState(this.initialState);
      },
    });
  }
  render() {
    return (
      <div id="deleted_photos_Modal" className={this.props.status === true ? 'modal active' : 'modal'}>
        <form className={this.props.status === true ? 'modal-content active' : 'modal-content'}>
          <span
            className="modal-close"
            onClick={this.props.closeModal}
          ><i className="material-icons">close</i></span>
          <h2 className="modal-header">삭제된 사진들</h2>
          <div className="switch-button">
            <span
              className="active"
              style={this.state.select_all === true ? { left: '0%' } : { left: '50%' }}
            />
            <button
              className={this.state.select_all === true ? 'switch-button-case left active-case' : 'switch-button-case left'}
              onClick={this.selectAll}
              type="button"
            >모두 선택</button>
            <button
              className={this.state.select_all === true ? 'switch-button-case right' : 'switch-button-case right active-case'}
              onClick={this.selectNone}
              type="button"
            >취소</button>
          </div>
          <div className="deleted_photos scroll_y">
            {this.props.data.map((data, i) =>
              <div
                key={i}
                className="deleted_photo"
                onClick={this.select.bind(this)}
              >
                <input
                  className="deleted_photo_checkbox"
                  type="checkbox"
                  defaultValue={this.props.data[i].idx}
                  checked={this.state.select_all}
                />
                <label />
                <img src={this.props.data[i].src} alt="deletedPhoto" />
              </div>,
            )}
          </div>
          <div className="modal-footer_button">
            <button
              id="delete_forever_btn"
              className="btn"
              onClick={this.deleteForever}
              type="button">삭제</button>
            <button
              id="recover_file_btn"
              className="btn"
              onClick={this.recoverFile}
              type="button"
            >복원</button>
          </div>
        </form>
      </div>
    );
  }
}
export default DeletedPhotos;

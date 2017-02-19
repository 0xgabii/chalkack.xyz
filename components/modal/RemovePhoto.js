import $ from 'jquery';

import React, { Component } from 'react';
import siiimpleToast from 'siiimple-toast';
import { ajax } from '../Sub';

class RemovePhoto extends Component {
  handleSubmit(e) {
    e.preventDefault();

    const arr = $(e.target).find('input').val();

    if (arr === '') {
      new siiimpleToast().alert('사진이 선택되지 않았습니다');
      return;
    }

    ajax({
      url: `/photos/${arr}`,
      method: 'DELETE',
      _callback: (response) => {
        new siiimpleToast().message(response);
        this.props.closeModal();
        this.props.updateData();
      },
    });
  }
  render() {
    const modalText = '삭제하신 사진은 30일 이내에 복구할 수 있습니다';
    return (
      <div
        id="removePhoto_Modal"
        className={this.props.status === true ? 'modal active' : 'modal'}
      >
        <form
          className={this.props.status === true ? 'modal-content active' : 'modal-content'}
          onSubmit={this.handleSubmit.bind(this)}
        >
          <span
            className="modal-close"
            onClick={this.props.closeModal}
          ><i className="material-icons">close</i></span>
          <h2 className="modal-header">
            {this.props.img ? <img src={this.props.img} alt="removeImage" /> : ''}{this.props.text}
          </h2>
          <input type="hidden" name="photo_arr" value={this.props.input} required />
          <p>{modalText}</p>
          <div className="modal-footer">
            <a href onClick={this.props.closeModal}>취소</a>
            <button type="submit" className="btn black">삭제</button>
          </div>
        </form>
      </div>
    );
  }
}
export default RemovePhoto;

import $ from 'jquery';

import React, { Component } from 'react';
import { ajax } from '../Sub';
import siiimpleToast from 'siiimple-toast';

class CreateAlbum extends Component {

  handleSubmit(e) {
    e.preventDefault();

    let albumname = $(e.target).children('input').val();

    ajax({
      url: '/albums',
      method: 'POST',
      data: { a_name: albumname },
      _callback: (response) => {
        new siiimpleToast().success(response);
        this.props.updateData();
        this.props.closeModal();
      }
    });
  }
  render() {
    return (
      <div id="newAlbum_Modal" className={this.props.status == true ? 'modal active' : 'modal'}>
        <form className={this.props.status == true ? 'modal-content active' : 'modal-content'} onSubmit={this.handleSubmit.bind(this)}>
          <span className="modal-close" onClick={this.props.closeModal}><i className="material-icons">close</i></span>
          <h2 className="modal-header">새로운 앨범</h2>
          <input className="modern" type="text" name="a_name" defaultValue="새 앨범" required />
          <div className="modal-footer">
            <a href onClick={this.props.closeModal}>취소</a>
            <button type="submit" className="btn black">만들기</button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateAlbum;
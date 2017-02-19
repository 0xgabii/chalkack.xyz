import $ from 'jquery';

import React, { Component } from 'react';
import siiimpleToast from 'siiimple-toast';
import { ajax } from '../Sub';

class ModifyAlbum extends Component {
  componentDidUpdate(p, s) {
    $('#modifyAlbum_Modal').find('input').val(this.props.currentAlbumName);
  }
  handleSubmit(e) {
    e.preventDefault();

    const albumname = $(e.target).children('input').val();

    ajax({
      url: `/albums/${window.location.pathname.split('/')[2]}?a_name=${albumname}`,
      method: 'PUT',
      _callback: (response) => {
        new siiimpleToast().message(response);
        this.props.updateData();
        this.props.closeModal();
      },
    });
  }
  render() {
    return (
      <div
        id="modifyAlbum_Modal"
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
          <h2 className="modal-header">앨범 수정</h2>
          <input
            className="modern"
            type="text"
            name="a_name"
            defaultValue={this.props.currentAlbumName}
            required
          />
          <div className="modal-footer">
            <a href onClick={this.props.closeModal}>취소</a>
            <button type="submit" className="btn black">수정</button>
          </div>
        </form>
      </div>
    );
  }
}
export default ModifyAlbum;

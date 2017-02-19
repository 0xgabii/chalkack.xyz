import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import siiimpleToast from 'siiimple-toast';

class AddPhoto extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      data: [],
      CanIappend: true,
      dragDrop: false, // 드래그&드롭을 수행중인지
      upload_btn: '추가',
      uploading: false, //업로드중인지
    };
    this.initialState = this.state;
    this.toast = new siiimpleToast();
  }
  handleSubmit(e) {
    e.preventDefault();

    // 업로드중인 경우
    if (this.state.uploading === true) {
      this.toast.message('현재 사진을 업로드하고 있습니다<br>조금만 더 기다려주세요');
      return;
    }

    this.setState({
      uploading: true,
      upload_btn: '업로드중...',
    });

    const $form = $(e.target);
    const $btn = $form.find('.btn');
    const $file = $form.find('.dropfile');
    const formData = new FormData();

    $.each($file[0].files, (i, file) => {
      formData.append('photo', file);
    });

    // 업로드된 파일 가져오기
    const LoadInterval = setInterval(() => {
      this.props.updateData();
      if (this.state.uploading === false) {
        clearInterval(LoadInterval);
      }
    }, 1000);

    $.ajax({
      xhr: function () {
        const xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener('progress', function (evt) {
          if (evt.lengthComputable) {
            const percentComplete = evt.loaded / evt.total;
            $('.progress').css({ width: `${percentComplete * 100}%` });
            if (percentComplete === 1) {
              $btn.addClass('end');
            }
          }
        }, false);
        return xhr;
      },
      url: '/photos',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'text',
    }).done((data) => {
      this.toast.success(data);

      // 초기화
      this.setState(this.initialState);
      $file.val('');

      this.props.updateData();
      this.props.closeModal();
    }).fail((request, status, error) => {
      this.toast.alert(request.responseText);
      // 초기화
      this.setState(this.initialState);
      $file.val('');
    });
  }
  handleChange(e) {
    const $this = $(e.target);
    const file = e.target.files;

    let totalSize = 0;
    const _this = this;

    this.setState(this.initialState);

    if (file.length < 1) {
      return;
    }

    // preview 생성
    for (let i = 0; i < file.length; i += 1) {
      const extArr = file[i].name.split('.');
      const extension = extArr[extArr.length - 1];

      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'gif' && extension !== 'png') {
        this.toast.alert('이미지 파일만 업로드 가능합니다');
        $this.val('');
        this.setState({ CanIappend: false });
        return;
      } else {
        const reader = new FileReader();
        reader.onload = (function (readFile) {
          return function () {
            let size = '';

            if (readFile.size / 1024 < 1024) {
              size = `${Math.round(readFile.size / 1024)}KB`;
            } else {
              size = readFile.size / 1024;
              size = `${Math.round(size / 1024)}MB`;
            }

            const dataMap = {};
            dataMap.src = this.result;
            dataMap.name = readFile.name;
            dataMap.size = size;

            _this.setState({ data: _this.state.data.concat(dataMap) });
          };
        })(file[i]);
        reader.readAsDataURL(file[i]);
        totalSize += file[i].size;
      }
    }
    // kb
    totalSize /= 1024;
    // 1MB보다 작으면
    if (totalSize < 1024) {
      totalSize = `${Math.round(totalSize)}KB`;
    } else {
      // 100메가가 넘으면
      if (totalSize / 1024 > 100) {
        this.toast.alert('이미지 용량이 너무 큽니다');
        $this.val('');
        this.setState({ CanIappend: false });
        return;
      }
      totalSize = `${Math.round(totalSize / 1024)}KB`;
    }
    this.setState({ upload_btn: `추가 ( ${file.length}개 / ${totalSize} )` });
  }
  onDragEnter(e) {
    this.setState({ dragDrop: true });
  }
  onDragLeave(e) {
    this.setState({ dragDrop: false });
  }
  onDrop(e) {
    this.setState({ dragDrop: false });
  }
  render() {
    return (
      <div id="add_photo_Modal" className={this.props.status === true ? 'modal active' : 'modal'}>
        <form
          className={this.props.status === true ? 'modal-content active' : 'modal-content'}
          onSubmit={this.handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <span
            className="modal-close"
            onClick={this.props.closeModal}
          ><i className="material-icons">close</i></span>
          <h2 className="modal-header">새로운 사진</h2>
          <div className={this.state.dragDrop === true ? 'dropzone focus' : 'dropzone'}>
            <input
              className="dropfile"
              multiple="multiple"
              type="file"
              name="photo"
              accept="image/*"
              onChange={this.handleChange}
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
            />
            <div className="dropzone_text">
              <i className="material-icons">satellite</i>
              <br /> 드래그 &amp; 드롭 또는 클릭
            </div>
          </div>
          <div className="file_container scroll_y">
            {this.state.CanIappend === true ?
              this.state.data.map((data, i) =>
                <div key={i} className="file_item">
                  <img
                    className="file_preview"
                    src={this.state.data[i].src}
                    alt="file_preview"
                  />
                  <div className="file_name">{this.state.data[i].name}</div>
                  <span className="btn">{this.state.data[i].size}
                    <label className="progress" /></span>
                </div>,
              )
              : ''}</div>
          <div className="modal-footer">
            <a href onClick={this.props.closeModal}>취소</a>
            <button
              id="add_all_photo"
              className="btn black"
              type="submit"
            >{this.state.upload_btn}</button>
          </div>
        </form>
      </div>
    );
  }
}
export default AddPhoto;

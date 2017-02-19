import $ from 'jquery';

import React, { Component } from 'react';
import { GetRealImg } from '../Sub';

class ImageModal extends Component {
  componentDidMount() {
    $(document).on('keydown', this.keydownCheck());
  }
  componentDidUpdate(p, s) {
    const $img = $('.image_container').children('img');

    $img.removeClass('active');

    if (this.props.status === true) {
      $img.on('load', () => {
        setTimeout(() => {
          $img.addClass('active');
        }, 100);
      });
    }
  }
  keydownCheck(e) {
    if (this.props.status === false) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        this.props.prev();
        break;
      case 39:
        this.props.next();
        break;
      case 27:
        this.props.close();
        break;
      case 40:
        this.props.downloadImage();
        break;
    }

    e.preventDefault();
  }
  downloadImage() {
    $('#download_image')[0].click();
  }
  render() {
    const src = GetRealImg(this.props.src);
    return (
      <div id="image_modal" className={this.props.status === true ? 'active' : ''}>
        <div className="image_container">
          <img src={src} onClick={this.props.close} />
          <a id="download_image" href={src} download={src} />
        </div>
        <div className="down_fixed_tab">
          <ul>
            <li>
              <button
                className="image_prev"
                onClick={this.props.prev}
              ><i className="material-icons">arrow_back</i></button>
            </li>
            <li>
              <button><i className="material-icons">color_lens</i></button>
            </li>
            <li>
              <button
                className="download_btn"
                onClick={this.downloadImage.bind(this)}
              ><i className="material-icons">file_download</i></button>
            </li>
            <li>
              <button><i className="material-icons">public</i></button>
            </li>
            <li>
              <button
                className="image_next"
                onClick={this.props.next}
              ><i className="material-icons">arrow_forward</i></button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ImageModal;
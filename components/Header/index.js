import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import SwitchButton from './SwitchButton';

class Header extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }
  gridChange(e) {
    const grid = $(e.target).data('grid');
    this.props.gridChange(grid);
  }
  logOut() {
    location.href = '/logout';
  }
  render() {
    return (
      <header id="header">
        <nav>
          <ul className="header-info-nav">
            {this.props.type !== 'main' ?
              <li className="goBack">
                <button onClick={this.props.goToHome}>
                  <i className="material-icons">arrow_back</i>
                </button>
              </li>
              : ''
            }
            {this.props.type === 'main' ?
              <li>
                <span className="header-info-headline">{this.props.title}</span>
                <small>{this.props.albums}개의 앨범, {this.props.photos}개의 사진</small>
              </li> :
              <li>
                <span className="header-info-headline">{this.props.title}</span>
                <small>{this.props.photos}개의 사진</small>
              </li>
            }
          </ul>
          <ul className="header-controls-nav">
            <li>
              <SwitchButton
                class="switch"
                onClick={this.gridChange}
              />
            </li>
            <li>
              <button
                id="show_deleted_photos_btn"
                onClick={this.props.showDeletedPhotos}
              ><i className="material-icons">delete_forever</i>
              </button>
            </li>
            <li>
              {this.props.type === 'main' ?
                <button
                  id="create_album_btn"
                  onClick={this.props.showCreateAlbum}
                ><i className="material-icons">create_new_folder</i>
                </button> :
                <button
                  id="modify_album_btn"
                  onClick={this.props.showModifyAlbum}
                ><i className="material-icons">settings</i>
                </button>
              }
            </li>
            <li>
              <button
                id="add_photo_btn"
                onClick={this.props.showAddPhoto}
              ><i className="material-icons">add_a_photo</i>
              </button>
            </li>
            <li>
              <button
                id="logout_btn"
                onClick={this.logOut}
              ><i className="material-icons">power_settings_new</i>
              </button>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
export default Header;

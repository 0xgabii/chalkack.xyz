import $ from 'jquery';

import React, { Component } from 'react';

class Header extends Component{

	gridChange(e){
		let grid = $(e.target).data('grid');
		this.props.gridChange(grid);  
  	}	
  	logOut(){
		window.location.href="/logout";
  	}
	render(){
		return (
		  <header id="header">
			<nav>
			  <ul className="header-info-nav">
				{this.props.type!="main"
					? <li className="goBack"><button onClick={this.props.goToHome}><i className="material-icons">arrow_back</i></button></li>
					: ""
				}						
				{this.props.type=="main"
					? <li><span className="header-info-headline">{this.props.title}</span><small>{this.props.albums}개의 앨범, {this.props.photos}개의 사진</small></li>   
					: <li><span className="header-info-headline">{this.props.title}</span><small>{this.props.photos}개의 사진</small></li>
				}
			  </ul>
			  <ul className="header-controls-nav">
				<li>
				  <div className="switch">
					<input name="switch" id="grid_double" type="radio" />
					<label htmlFor="grid_double" className="switch_label" data-grid={2} onClick={this.gridChange.bind(this)}>크게</label>
					<input name="switch" id="grid_third" type="radio" />
					<label htmlFor="grid_third" className="switch_label" data-grid={3} onClick={this.gridChange.bind(this)}>중간</label>
					<input name="switch" id="grid_fourth" type="radio" />
					<label htmlFor="grid_fourth" className="switch_label" data-grid={4} onClick={this.gridChange.bind(this)}>작게</label>
					<div className="switch_circle"><i className="material-icons">view_module</i></div>
				  </div>
				</li>					
				<li>
				  <button id="show_deleted_photos_btn" onClick={this.props.show_deletedPhotos}><i className="material-icons">delete_forever</i></button>
				</li>
				<li>
				{this.props.type=="main"
					? <button id="create_album_btn" onClick={this.props.show_createAlbum}><i className="material-icons">create_new_folder</i></button>     
					: <button id="modify_album_btn" onClick={this.props.show_modifyAlbum}><i className="material-icons">settings</i></button>
				}
				</li>
				<li>
				  <button id="add_photo_btn" onClick={this.props.show_addPhoto}><i className="material-icons">add_a_photo</i></button>
				</li>
				<li>
				  <button id="logout_btn" onClick={this.logOut.bind(this)}><i className="material-icons">power_settings_new</i></button>
				</li>
			  </ul>
			</nav>
		 </header>
		);
	}
}

export default Header;
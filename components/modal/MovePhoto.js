import $ from 'jquery';

import React, { Component } from 'react';
import { Toast } from '../Sub';

class MovePhoto extends Component{
	constructor(props){
		super(props);
		this.state = {
			selected_album : 0
		};
	}
	beforeSubmit(e){
	  	let $val = $(e.target).val();
	 	this.setState({selected_album:$val});		  
	}
	handleSubmit(e){
		e.preventDefault();

		let _this = this,
			$arr = $(e.target).find('input').val();

	  	if($arr==''){
			Toast("사진이 선택되지 않았습니다","alert");
			return;
		}

		$.ajax({
			url : '/photos/'+$arr+'?a_idx='+this.state.selected_album,
			type : 'PUT',	
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			dataType: "text",
		}).done(function(data) {			
			Toast(data);	
			
			_this.props.closeModal();
			_this.props.updateData();
			
		}).fail(function(request, status, error){
			Toast(request.responseText, "alert");
	  	});
	}
	render(){
		const album = [];
		
		for (var i=0; i<this.props.data.length; i++){				
			let bgImage = {
				backgroundImage: 'url(' + this.props.data[i].src + ')'
			}
			album.push(
				<div className="modal-scroll-content-album" style={bgImage}>
					<span className="title">{this.props.data[i].album.title}</span>
					<span className="date">{this.props.data[i].album.date}</span>
					<span className="info"><i className="material-icons">camera_alt</i>{this.props.data[i].album.info}</span>
					<div className="move_photo_hover_div">
						<button name="selected" value={this.props.data[i].idx} onClick={this.beforeSubmit.bind(this)} type="submit" className="btn ghost">이 앨범으로 이동</button>
					</div>
				</div>
			);
		}		
		return (
		  <div id="movePhoto_Modal" className={this.props.status==true ? 'modal active' : 'modal'}>
			<form className={this.props.status==true ? 'modal-content active' : 'modal-content'} onSubmit={this.handleSubmit.bind(this)}>
			  <span className="modal-close" onClick={this.props.closeModal}><i className="material-icons">close</i></span>
				<h2 className="modal-header">{this.props.img ? <img src={this.props.img} /> : ""}{this.props.text}</h2>
			  <input type="hidden" name="photo_arr" value={this.props.input} required />
			  <div className="modal-scroll-content scroll_y">
				  {album}
			  </div>
			</form>
		  </div>
		);
	}
}

export default MovePhoto;
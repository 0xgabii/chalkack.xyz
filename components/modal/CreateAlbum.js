import $ from 'jquery';

import React, { Component } from 'react';
import { Toast } from '../Sub';

class CreateAlbum extends Component{

	handleSubmit(e){
		e.preventDefault();

		const $form = $(e.target);			  
		let albumname = $form.children('input').val();			  			  

		let _this = this;

		$.ajax({
			url : '/albums',
			type : 'POST',
			data : {a_name: albumname},
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			dataType : "text",
		}).done(function(data) {			
			Toast(data,"success");

			_this.props.updateData();
			_this.props.closeModal();
			
		}).fail(function(request, status, error){
			Toast(request.responseText, "alert");
			console.log("http code : " + request.status);
			console.log("message : " + request.responseText);
			console.log("error : " + error);
		});
	}
	render(){
		return (
		  <div id="newAlbum_Modal" className={this.props.status==true ? 'modal active' : 'modal'}>
			<form className={this.props.status==true ? 'modal-content active' : 'modal-content'} onSubmit={this.handleSubmit.bind(this)}>
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
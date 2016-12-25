import $ from 'jquery';

import React, { Component } from 'react';
import { Toast } from '../Sub';

class DeletedPhotos extends Component{
	constructor(props){
		super(props);
		this.state = {
			select_all : false
		};
	}
	select(e){
	  $(e.target).siblings('input').prop('checked',!$(e.target).siblings('input').prop('checked'));
	}
	select_all(){
	  this.setState({select_all:true});
	}
	select_none(){
	  this.setState({select_all:false});
	}
	recover_File(e){

		const $form = $(e.target).parents('form');	
		const photo_arr = new Array();

		let _this = this;

		$('.deleted_photo_checkbox').each(function(){
			if($(this).prop('checked')==true){
				photo_arr.push($(this).val());			
			}		
		});

		if(photo_arr.length===0)
		  return;

		if(confirm(photo_arr.length+"개의 사진을 복원하시겠습니까?")==false)
			return;

		$.ajax({
			url : '/deleted-photos/'+photo_arr.toString(),
			type : 'PUT',	
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			dataType: "text",
		}).done(function(data) {			
			Toast(data);

			_this.props.updateData();
			_this.props.closeModal();

			_this.setState(_this.state);

		}).fail(function(request, status, error){
				Toast(request.responseText, "alert");
				console.log("http code : " + request.status);
				console.log("message : " + request.responseText);
				console.log("error : " + error);
		});

	}
	delete_Forever(e){
		const $form =  $(e.target).parents('form');	
		const photo_arr = new Array();

		let _this = this;

		$('.deleted_photo_checkbox').each(function(){
			if($(this).prop('checked')==true){
				photo_arr.push($(this).val());			
			}		
		});

		 if(photo_arr.length===0)
			  return;

		if(confirm(photo_arr.length+"개의 사진을 영구적으로 삭제하시겠습니까?")==false)
			return;

		$.ajax({
			url : '/deleted-photos/'+photo_arr.toString(),
			type : 'DELETE',	
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			dataType: "text",
		}).done(function(data) {			
				Toast(data);

				_this.props.updateData();
				_this.props.closeModal();

				_this.setState(_this.state);
			
		}).fail(function(request, status, error){
				Toast(request.responseText, "alert");
				console.log("http code : " + request.status);
				console.log("message : " + request.responseText);
				console.log("error : " + error);
		});
	}
	render(){
		let deleted_photo = [];  
			
		for(var i=0; i<this.props.data.length; i++){
			deleted_photo.push(
				<div className="deleted_photo" onClick={this.select.bind(this)}>
					<input type="checkbox" className="deleted_photo_checkbox" defaultValue={this.props.data[i].idx} checked={this.state.select_all} />
					<label />
					<img src={this.props.data[i].src} />
				</div>
			); 	
		}
		return (
		  <div id="deleted_photos_Modal" className={this.props.status==true ? 'modal active' : 'modal'}>
			<form className={this.props.status==true ? 'modal-content active' : 'modal-content'}>
			  <span className="modal-close" onClick={this.props.closeModal}><i className="material-icons">close</i></span>
			  <h2 className="modal-header">삭제된 사진들</h2>
			  <div className="switch-button">
				<span style={this.state.select_all==true ? {left: '0%'} : {left: '50%'} } className="active" />
				<button className={this.state.select_all==true ? "switch-button-case left active-case" : "switch-button-case left"} type="button" onClick={this.select_all.bind(this)}>모두 선택</button>
				<button className={this.state.select_all==true ? "switch-button-case right" : "switch-button-case right active-case"} type="button" onClick={this.select_none.bind(this)}>취소</button>
			  </div>
				<div className="deleted_photos scroll_y">{deleted_photo}</div>
			  <div className="modal-footer_button">
				<button id="delete_forever_btn" className="btn" type="button" onClick={this.delete_Forever.bind(this)}>삭제</button>
				<button id="recover_file_btn" className="btn" type="button" onClick={this.recover_File.bind(this)}>복원</button>
			  </div>
			</form>
		  </div>
		);
	}
}

export default DeletedPhotos;
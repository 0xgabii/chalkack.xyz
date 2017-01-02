import $ from 'jquery';

import React, { Component } from 'react';
import { Toast } from '../Sub';

class AddPhoto extends Component{
	constructor(props){
		super(props);
		this.state = {
		  data : [],
		  CanIappend : true, 
		  dragDrop : false, //드래그&드롭을 수행중인지
		  upload_btn : "추가",
		  uploading:false//업로드중인지
		};
		
		this.initialState = this.state;
	}
	handleSubmit(e){
		e.preventDefault();

		//업로드중인 경우
		if(this.state.uploading==true){
			Toast("현재 사진을 업로드하고 있습니다<br>조금만 더 기다려주세요");
			return;
		}

		this.setState({uploading:true,upload_btn:"업로드중......"});

		const $form = $(e.target);			 
		const $btn = $form.find('.btn');
		const $file = $form.find('.dropfile');
		
		let _this = this;

		const formData = new FormData();
		$.each($file[0].files, function (i, file) {
			formData.append('photo', file);
		});			  

		//업로드된 파일 가져오기
		const LoadInterval = setInterval(function(){

			_this.props.updateData();

			if(_this.state.uploading==false)
				clearInterval(LoadInterval);
		},1000);


		$.ajax({
			xhr: function () {
				const xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress",function (evt) {
					if (evt.lengthComputable) {
					let percentComplete = evt.loaded / evt.total;
						$('.progress').css({width: percentComplete * 100 + '%'});
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
			dataType: "text",
		}).done(function(data){
			Toast(data,"success");

			//초기화
			_this.setState(_this.initialState);
			$file.val('');
			
			_this.props.updateData();
			_this.props.closeModal();

		}).fail(function(request, status, error){
			Toast(request.responseText, "alert");
			
			// 초기화
	  		_this.setState(_this.initialState);
			$file.val('');
			
			console.log("http code : " + request.status);
			console.log("message : " + request.responseText);
			console.log("error : " + error);
		});
	}
	handleChange(e){
	  const $this = $(e.target);
	  const file = e.target.files;
	  const file_container = $('.file_container');
	  const upload_all_btn = $('#add_all_photo');
		
	  let _this = this;//filereader 내부
	  let total_size = 0;

	  this.setState(this.initialState);

	  if (file.length < 1) {
		return;
	  }

	  // preview 만들기
	  for (var i = 0; i < file.length; i++) {

		  const extArr = file[i].name.split('.');
		  let extension = extArr[extArr.length - 1];

		  if (extension != "jpg" && extension != "jpeg" && extension != "gif" && extension != "png") {
			Toast("이미지 파일만 업로드 가능합니다", "alert");
			$this.val('');
			this.setState({CanIappend:false});
			return;
		  }else{
			  const reader = new FileReader();
			  let idx = 0;
			  reader.readAsDataURL(file[i]);				  
			  reader.onload = function () {

				let size = '';

				if (file[idx].size / 1024 < 1024) {
					size = Math.round(file[idx].size / 1024) + 'KB';
				} else {
					size = file[idx].size / 1024;
					size = Math.round(size / 1024) + 'MB';
				}

				const dataMap = new Object();					  
				dataMap.src = this.result;
				dataMap.name = file[idx].name;
				dataMap.size = size;

				_this.setState({data : _this.state.data.concat(dataMap)});

				idx += 1;
			  }
			  total_size += file[i].size;  
		  }
	  }

	  //kb
	  total_size = total_size / 1024;

	  //1MB보다 작으면 
	  if (total_size < 1024) {
		  total_size = Math.round(total_size) + 'KB';
	  } else {
		//100메가가 넘으면
		if (total_size / 1024 > 100) {
			Toast("이미지 용량이 너무 큽니다", "alert");
			$this.val('');
			this.setState({CanIappend:false});
			return;
		}
		total_size = Math.round(total_size / 1024) + 'MB';
	  }
		
	  this.setState({upload_btn:'추가 ( ' + file.length + '개 / ' + total_size + ' )'});			  
		
    }
    onDragEnter(e){
	  this.setState({dragDrop:true});
    }
    onDragLeave(e){
	  this.setState({dragDrop:false});
    }
    onDrop(e){
	  this.setState({dragDrop:false});
    }
	render(){			
		let files = [];
			
		for(var i=0; i<this.state.data.length; i++){
			files.push(
				<div className="file_item">
					<img src={this.state.data[i].src} className="file_preview" />
					<div className="file_name">{this.state.data[i].name}</div>
					<span className="btn">{this.state.data[i].size}<label className="progress"></label></span>
				</div>
			);					
		}		
		return (
		  <div id="add_photo_Modal" className={this.props.status==true ? 'modal active' : 'modal'}>
			<form className={this.props.status==true ? 'modal-content active' : 'modal-content'} method="post" encType="multipart/form-data" onSubmit={this.handleSubmit.bind(this)}>
			  <span className="modal-close" onClick={this.props.closeModal}><i className="material-icons">close</i></span>
			  <h2 className="modal-header">새로운 사진</h2>
			  <div className={this.state.dragDrop==true ? 'dropzone focus' : 'dropzone'}>
				<input className="dropfile" multiple="multiple" type="file" name="photo" 
					onChange={this.handleChange.bind(this)}	onDragEnter={this.onDragEnter.bind(this)} onDragLeave={this.onDragLeave.bind(this)} onDrop={this.onDrop.bind(this)} />
				<div className="dropzone_text">
				  <i className="material-icons">satellite</i>
				  <br /> 드래그 &amp; 드롭 또는 클릭
				</div>
			  </div>
			  <div className="file_container scroll_y">{this.state.CanIappend==true ? files : ""}</div>
			  <div className="modal-footer">
				<a href onClick={this.props.closeModal}>취소</a>
				<button type="submit" id="add_all_photo" className="btn black">{this.state.upload_btn}</button>
			  </div>
			</form>
		  </div>
		);
	}
}

export default AddPhoto;
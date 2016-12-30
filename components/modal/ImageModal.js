import $ from 'jquery';

import React, { Component } from 'react';
import { GetRealImg } from '../Sub';

class ImageModal extends Component{
	constructor(props){
		super(props);
	}
	componentDidUpdate(p,s){
		const $img = $('.image_container').children('img');	  

		$img.removeClass('active');
		if(this.props.status==true){
			$img.on('load',function(){
				setTimeout(function(){
					$img.addClass('active');
				},100);			
			});
		}
	}
	componentDidMount(){	
		let _this = this;

		function keydownCheck(e){
		  	if(_this.props.status==false)
				return;		  

			let key = e.keyCode;
			if(key===37)
				_this.props.prev();
			else if(key===39)
				_this.props.next();
			else if(key===27)
				_this.props.close();
			else if(key===40)
				_this.downloadImage();  
			
			e.preventDefault();
		}
		function scrollCheck(e) {
			if(_this.props.status==false)
				return;	

			e = window.event || e;
			let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

			if(delta===1)
				_this.props.prev();
			else
				_this.props.next();
			
			e.preventDefault();		
		}

		$(document).on("keydown",keydownCheck)
		$('#image_modal').on("mousewheel",scrollCheck);
		$('#image_modal').on("mousewheel",scrollCheck);
	}
	downloadImage(){
		$('#download_image')[0].click();
	}
	render(){
		let src = GetRealImg(this.props.src);  	  
		return (
		  <div id="image_modal" className={this.props.status==true ? "active" : ""} >
			<div className="image_container">
				<img src={src} onClick={this.props.close} />
				<a id="download_image" href={src} download={src}></a>
			</div>
			<div className="down_fixed_tab">
			  <ul>
				<li>
				  <button className="image_prev" onClick={this.props.prev}><i className="material-icons">arrow_back</i></button>
				</li>
				<li>
				  <button><i className="material-icons">color_lens</i></button>
				</li>
				<li>
				  <button className="download_btn" onClick={this.downloadImage.bind(this)}><i className="material-icons">file_download</i></button>
				</li>
				<li>
				  <button><i className="material-icons">public</i></button>
				</li>
				<li>
				  <button className="image_next" onClick={this.props.next}><i className="material-icons">arrow_forward</i></button>
				</li>
			  </ul>
			</div>
		  </div>
		);
	}
}

export default ImageModal;
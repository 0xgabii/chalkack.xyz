import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Toast } from './Sub';

class Landing_Page extends Component{
	constructor(props){
		super(props);
		autoBind(this);
		
		this.state = {
			ctaClicked:false,
			slide_form:false,
			frame:0	
		};
		this.initialState = this.state;
	}
	slide_form(){
		this.setState({
			slide_form: !this.state.slide_form
		});  
  	}
  	ctaClicked(){
		this.setState({
			ctaClicked:true,
			slide_form:true
		});  
  	}
  	goLogin(){
		this.setState({
			ctaClicked:true,
			slide_form:false
		});    
	}
  	goHome(){
		this.setState(this.initialState);  
  	}
  	left(){
		let currFrame = this.state.frame;

		currFrame==0 ? currFrame = -75 : currFrame += 25;

		this.setState({frame:currFrame});

		$('.picture_frame>ul').css({
			transform : 'translateY('+currFrame+'%)'
		});
	}
  	right(){
		let currFrame = this.state.frame;

		currFrame==-75 ? currFrame = 0 : currFrame += -25;

		this.setState({frame:currFrame});

		$('.picture_frame>ul').css({
			transform : 'translateY('+currFrame+'%)'
		});
  	}
	handleSubmit_Account(e){
		e.preventDefault();

		let _this = this;

		$.ajax({
			url: '/register',
			type: 'POST',
			data: $(e.target).serialize(),
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			dataType: "text",
		}).done(function(data) {			
			Toast(data, "success");
			
			_this.setState({slide_form:false}); 
			
		}).fail(function(request, status, error){
			Toast(request.responseText, "alert");
		});
  	}
  	handleSubmit_Login(e){
		e.preventDefault();
	  
		let _this = this;

		$.ajax({
			url: '/login',
			type: 'POST',
			data: $(e.target).serialize(),
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
		}).done(function(data){
			Toast(data, "success");					
			
			_this.props.auth(true);		
				
		}).fail(function(request, status, error){
			Toast(request.responseText, "alert");
		});	
  	}
	render(){
		return (
		  <section id="landing_section">
			<span className={this.state.ctaClicked ? "fixed_logo active" : "fixed_logo"}>
				<i className="material-icons">photo_camera</i>
			</span>
			<button className="fixed_btn" onClick={this.state.ctaClicked ? this.goHome : this.goLogin}>
				{this.state.ctaClicked ? "홈으로" : "로그인"}
			</button>	 	
			<div id="landing_wrap" className={this.state.ctaClicked ? "center_wrap" : "center_wrap active"}>
			  <header className="headline">
				<h1>여기, 당신만의 갤러리가 준비되어 있습니다.</h1>
				<h3>보다 쉽고, 간단하고, 아름답게 사진을 관리하세요.</h3>
			  </header>	
			  <div className="picture_wrapper">
				<div className="frame_control">
				  <ul>
					<li id="left"  onClick={this.left}><i className="material-icons">keyboard_arrow_left</i></li>
					<li id="right" onClick={this.right}><i className="material-icons">keyboard_arrow_right</i></li>
				  </ul>
				</div>
				<div className="picture_frame">
				  <ul>
					<li><img src="https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_1.png" /></li>
					<li><img src="https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_2.png" /></li>
					<li><img src="https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_3.png" /></li>
					<li><img src="https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_4.png" /></li>
				  </ul>
				</div>
			  </div>	
			  <button className="cta_btn" onClick={this.ctaClicked}>지금 시작하기</button>
			</div>
			<div id="account_wrap" className={this.state.ctaClicked ? "center_wrap active" : "center_wrap"}>
			  <div className="account_form">
				<nav>
				  <ul onClick={this.slide_form}>
					<li className={this.state.slide_form ? "" : "active"}>로그인</li>
					<li className={this.state.slide_form ? "active" : ""}>회원가입</li>
				  </ul>
				</nav>
				<div className={this.state.slide_form ? "slide_form active" : "slide_form"}>
				  <form action="/login" onSubmit={this.handleSubmit_Login}>
					<label>이메일</label>
					<input type="email" name="email" required />
					<label>비밀번호</label>
					<input type="password" name="pwd" required />
					<button>로그인</button>
				  </form>
				  <form action="/register" onSubmit={this.handleSubmit_Account}>
					<label>이름</label>
					<input type="text" name="name" required />
					<label>이메일</label>
					<input type="email" name="email" required />
					<label>비밀번호</label>
					<input type="password" name="pwd" required />
					<button>계정 생성</button>
				  </form>
				</div>		  		
			  </div>	
			</div>
		  </section>
		);
	}
}

export default Landing_Page;
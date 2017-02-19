import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import siiimpleToast from 'siiimple-toast';
import { ajax } from '../Sub';
import SlideControl from './SlideControl';
import SlideImage from './SlideImage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      ctaClicked: false,
      slideForm: false,
      frame: 0,
    };
    this.initialState = this.state;
    this.toast = new siiimpleToast();
  }
  slideForm() {
    this.setState({
      slideForm: !this.state.slideForm,
    });
  }
  ctaClicked() {
    this.setState({
      ctaClicked: true,
      slideForm: true,
    });
  }
  goLogin() {
    this.setState({
      ctaClicked: true,
      slideForm: false,
    });
  }
  goHome() {
    this.setState(this.initialState);
  }
  left() {
    let currFrame = this.state.frame;

    currFrame === 0 ? currFrame = -75 : currFrame += 25;

    this.setState({ frame: currFrame });

    $('.picture_frame>ul').css({
      transform: `translateY(${currFrame}%)`,
    });
  }
  right() {
    let currFrame = this.state.frame;

    currFrame === -75 ? currFrame = 0 : currFrame += -25;

    this.setState({ frame: currFrame });

    $('.picture_frame>ul').css({
      transform: `translateY(${currFrame}%)`,
    });
  }
  handleSubmitAccount(e) {
    e.preventDefault();

    ajax({
      url: '/register',
      method: 'POST',
      data: $(e.target).serialize(),
      _callback: (response) => {
        this.toast.success(response);
        this.setState({ slideForm: false });
      },
    });
  }
  handleSubmitLogin(e) {
    e.preventDefault();

    ajax({
      url: '/login',
      method: 'POST',
      data: $(e.target).serialize(),
      _callback: (response) => {
        this.toast.success(response);
        this.props.auth(true);
      },
    });
  }
  render() {
    const headLineH1 = '여기, 당신만의 갤러리가 준비되어 있습니다.';
    const headLineH3 = '보다 쉽고, 간단하고, 아름답게 사진을 관리하세요.';
    const images = [
      'https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_1.png',
      'https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_2.png',
      'https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_3.png',
      'https://s3.ap-northeast-2.amazonaws.com/chalkack/index/landing_page_4.png',
    ];
    return (
      <section id="landing_section">
        <span className={this.state.ctaClicked ? 'fixed_logo active' : 'fixed_logo'}>
          <i className="material-icons">photo_camera</i>
        </span>
        <button className="fixed_btn" onClick={this.state.ctaClicked ? this.goHome : this.goLogin}>
          {this.state.ctaClicked ? '홈으로' : '로그인'}
        </button>
        <div id="landing_wrap" className={this.state.ctaClicked ? 'center_wrap' : 'center_wrap active'}>
          <header className="headline">
            <h1>{headLineH1}</h1>
            <h3>{headLineH3}</h3>
          </header>
          <div className="picture_wrapper">
            <SlideControl
              class="frame_control"
              leftClick={this.left}
              rightClick={this.right}
            />
            <SlideImage
              class="picture_frame"
              images={images}
            />
          </div>
          <button className="cta_btn" onClick={this.ctaClicked}>지금 시작하기</button>
        </div>
        <div id="account_wrap" className={this.state.ctaClicked ? 'center_wrap active' : 'center_wrap'}>
          <div className="account_form">
            <nav>
              <ul onClick={this.slideForm}>
                <li className={this.state.slideForm ? '' : 'active'}>로그인</li>
                <li className={this.state.slideForm ? 'active' : ''}>회원가입</li>
              </ul>
            </nav>
            <div className={this.state.slideForm ? 'slide_form active' : 'slide_form'}>
              <LoginForm
                action="/login"
                onSubmit={this.handleSubmitLogin}
              />
              <RegisterForm
                action="/register"
                onSubmit={this.handleSubmitAccount}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default LandingPage;

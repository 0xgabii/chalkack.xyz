import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import siiimpleToast from 'siiimple-toast';

import LandingPage from './LandingPage/index';
import MainPage from './MainPage';
import { ajax } from './Sub';

class App extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      auth: true,
      CardsData: [],
      CardsGrid: 3,
      bgImage: '',
      title: '',
      photos: 0,
      albums: 0,
      type: 'main',
    };
    this.toast = new siiimpleToast();
  }
  componentDidMount() {
    ajax({
      url: '/auth',
      _callback: () => {
        this.setState({ auth: true });

        if (window.location.pathname === '/') {
          window.history.replaceState(null, null, '/home');
        }

        this.updateData();
      },
      _failCallback: () => {
        this.setState({ auth: false });
      },
    });
  }
  gridChange(grid) {
    this.setState({ CardsGrid: grid });
    this.updateData(null, grid);
  }
  auth(bool) {
    this.setState({ auth: bool });
    if (bool) {
      this.goToHome();
    }
  }
  // 다른 앨범으로 이동할 때
  move(e) {
    e.preventDefault();

    const link = $(e.target).parents('a').attr('href');
    window.history.replaceState(null, null, link);
    this.updateData();
  }
  // 홈으로 이동
  goToHome() {
    window.history.replaceState(null, null, '/home');
    this.updateData();
  }
  updateData(link, grid) {
    let gridType = this.state.CardsGrid;
    let url = '';
    const loc = window.location.pathname.split('/');

    if (grid) {
      gridType = grid;
    }

    url = loc.length > 2 ? loc[1] + loc[2] + encodeURIComponent(loc[3]) : window.location.pathname;

    ajax({
      url: `${url}?gridType=${gridType}`,
      dataType: 'json',
      _callback: (response) => {
        const responseData = JSON.parse(JSON.stringify(response));

        if (loc[1] === 'home') {
          this.setState({
            CardsData: responseData.data,
            bgImage: responseData.album.a_cover,
            title: responseData.album.title,
            photos: responseData.album.p_number,
            albums: responseData.album.a_number,
            type: 'main',
          });
          document.title = responseData.album.title;
        } else {
          this.setState({
            CardsData: responseData.data,
            bgImage: responseData.album.a_cover,
            title: responseData.album.title,
            photos: responseData.album.info,
            type: 'none',
          });
          document.title = response.album.title;
        }
      },
    });
  }
  render() {
    const bgStyle = {
      backgroundImage: `url(${this.state.bgImage})`,
    };

    return (
      <div>
        {this.state.auth === true ?
          <MainPage
            title={this.state.title}
            photos={this.state.photos}
            albums={this.state.albums}
            grid={this.state.CardsGrid}
            type={this.state.type}
            style={bgStyle}
            move={this.move}
            goToHome={this.goToHome}
            gridChange={this.gridChange}
            updateData={this.updateData}
            data={this.state.CardsData}
          />
          :
          <LandingPage
            auth={this.auth}
            goToHome={this.goToHome}
          />
        }
      </div>
    );
  }
}
export default App;

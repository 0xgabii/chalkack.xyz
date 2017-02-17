import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';

import Landing_Page from './Landing_Page';
import Main_Page from './Main_Page';
import { ajax } from './Sub';
import siiimpleToast from 'siiimple-toast';

class App extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      auth: true,
      CardsData: [],
      CardsGrid: 3,
      bgImage: "",
      title: "",
      photos: 0,
      albums: 0,
      type: "main"
    }
    this.toast = new siiimpleToast();
  }
  componentDidMount() {
    ajax({
      url: '/auth',
      _callback: () => {
        this.setState({ auth: true });
        if (window.location.pathname == "/")
          window.history.replaceState(null, null, '/home');
        this.updateData();
      },
      _failCallback: () => {
        this.setState({ auth: false });
      }
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
  //다른 앨범으로 이동할 때
  move(e) {
    e.preventDefault();

    let link = $(e.target).parents('a').attr('href');
    window.history.replaceState(null, null, link);
    this.updateData();
  }
  //홈으로 이동 
  goToHome() {
    window.history.replaceState(null, null, '/home');
    this.updateData();
  }
  updateData(link, grid) {

    let gridType = this.state.CardsGrid,
      url = '',
      loc = window.location.pathname.split("/");

    if (grid) {
      gridType = grid;
    }

    url = loc.length > 2 ? loc[1] + loc[2] + encodeURIComponent(loc[3]) : window.location.pathname;

    ajax({
      url: url + "?gridType=" + gridType,
      dataType: "json",
      _callback: (response) => {
        response = JSON.parse(JSON.stringify(response));

        if (loc[1] == "home") {
          this.setState({
            CardsData: response.data,
            bgImage: response.album.a_cover,
            title: response.album.title,
            photos: response.album.p_number,
            albums: response.album.a_number,
            type: "main"
          });

          document.title = response.album.title;
        } else {
          this.setState({
            CardsData: response.data,
            bgImage: response.album.a_cover,
            title: response.album.title,
            photos: response.album.info,
            type: "none"
          });

          document.title = response.album.title;
        }
      }
    });
  }
  render() {

    let bgStyle = {
      backgroundImage: 'url(' + this.state.bgImage + ')'
    };

    return (
      <div>
        {this.state.auth == true ?
          <Main_Page
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
          <Landing_Page
            auth={this.auth}
            goToHome={this.goToHome}
          />
        }
      </div>
    );
  }
}



export default App;
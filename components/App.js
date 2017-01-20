import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';

import Landing_Page from './Landing_Page';
import PictureFrame_Page from './PictureFrame_Page';
import Main_Page from './Main_Page';
import { Toast } from './Sub';

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
  }
  componentDidMount() {

    let _this = this;

    $.ajax({
      url: '/auth',
      type: 'GET',
    }).done(function () {
      _this.setState({ auth: true });

      let loc = window.location.pathname;

      if (loc == "/") {
        window.history.replaceState(null, null, '/home');
      }

      _this.updateData();

    }).fail(function (request, status, error) {
      _this.setState({ auth: false });
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

    let _this = this,
      gridType = this.state.CardsGrid,
      url = '',
      loc = window.location.pathname.split("/");

    if (grid) {
      gridType = grid;
    }

    if (loc.length > 2) {
      url = loc[1] + loc[2] + encodeURIComponent(loc[3]);
    } else {
      url = window.location.pathname;
    }

    $.ajax({
      url: url + "?gridType=" + gridType,
      type: 'GET',
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      dataType: "json",
    }).done(function (data) {
      data = JSON.parse(JSON.stringify(data));

      if (loc[1] == "home") {
        _this.setState({
          CardsData: data.data,
          bgImage: data.album.a_cover,
          title: data.album.title,
          photos: data.album.p_number,
          albums: data.album.a_number,
          type: "main"
        });

        document.title = data.album.title;
      } else {
        _this.setState({
          CardsData: data.data,
          bgImage: data.album.a_cover,
          title: data.album.title,
          photos: data.album.info,
          type: "none"
        });

        document.title = data.album.title;
      }

    }).fail(function (request, status, error) {
      Toast(request.responseText, "alert");
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
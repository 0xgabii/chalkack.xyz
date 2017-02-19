import $ from 'jquery';

import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Resize, CardsControlAction, CardsControlMove, scrollX } from './Sub';

class Cards extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }
  componentDidMount() {
    $(window).on('resize', Resize);

    setInterval(() => {
      $(window).trigger('resize');
    }, 1000);

    // IE9, Chrome, Safari, Opera
    $('.wrapper').on('mousewheel', scrollX);
    // Firefox
    $('.wrapper').on('DOMMouseScroll', scrollX);
  }
  componentDidUpdate() {
    $(window).trigger('resize');
  }
  CardsCheckedLabel(e) {
    CardsControlMove(e);
  }
  CardsChecked() {
    const checked = CardsControlAction();
    this.props.CardsCheckedChange(checked);
  }
  render() {
    const list = [];
    const cards = [];
    let data = [];

    for (let k = 0; k < this.props.grid; k += 1) {
      cards[k] = [];
      data = this.props.data[k];
      let length = 0;
      if (data) {
        length = data.list.length;
        data = data.list;
      }
      for (let i = 0; i < length; i += 1) {
        const src = data[i].src;
        cards[k].push(
          <div key={i} className={data[i].album ? 'card card-album' : 'card'}>
            {data[i].album ?
              '' :
              <div className="checkbox">
                <input
                  className="custom_checkbox"
                  type="checkbox"
                  defaultValue={data[i].idx}
                  onChange={this.CardsChecked}
                />
                <label
                  className="checkbox_control"
                  onClick={this.CardsCheckedLabel}
                />
              </div>
            }
            <img
              src={src}
              data-idx={data[i].idx}
              onClick={this.props.showImageModal}
              alt="cardImage"
            />
            {data[i].album ?
              <a href={`/albums/${data[i].album.idx}/${data[i].album.title}`} onClick={this.props.move}>
                <div className="album">
                  <span className="title">{data[i].album.title}</span>
                  <span className="date">{data[i].album.date}</span>
                  <span className="info">
                    <i className="material-icons">camera_alt</i>
                    {data[i].album.info}
                  </span>
                </div>
              </a>
              : ''
            }
          </div>,
        );
      }
    }
    for (let i = 0; i < this.props.grid; i += 1) {
      list.push(
        <div key={i} className="cards" style={{ height: `${100 / this.props.grid}%` }}>{cards[i]}</div>,
      );
    }
    return (
      <div className="wrapper scroll_x">
        {list}
      </div>
    );
  }
}
export default Cards;

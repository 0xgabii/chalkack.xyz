import $ from 'jquery';

import React, { Component } from 'react';
import { Resize, CardsControl_Action, CardsControl_Move, scrollX } from './Sub';

class Cards extends Component{

	componentDidMount(){			
		$(window).on('resize', Resize);
		
		setInterval(function(){
			$(window).trigger('resize');	
		},1000);				
		
		// IE9, Chrome, Safari, Opera
		$('.wrapper').on("mousewheel",scrollX);
		// Firefox
		$('.wrapper').on("DOMMouseScroll",scrollX);
	}
	componentDidUpdate(){
		$(window).trigger('resize');
	}
	CardsChecked_label(e){
		CardsControl_Move(e);
	}
	CardsChecked(){
		let checked = CardsControl_Action();
		
		this.props.CardsCheckedChange(checked);	
	}			
	render(){
		let list  = [];
		let cards = [];
		let data  = [];
		
		for(var k=0; k<this.props.grid; k++){
			cards[k] = [];
			data = this.props.data[k];		
			let length = 0;
			if(data){	
				length = data.list.length;
				data = data.list;			
			}
			
			for(var i=0; i<length; i++){	
			
				let src = data[i].src;
				
				cards[k].push(
					<div className={data[i].album ? "card album" : "card"}>
						{data[i].album ? 	
							""
							: 
						  <div className="checkbox">
							<input type="checkbox" className="custom_checkbox" defaultValue={data[i].idx} onChange={this.CardsChecked.bind(this)} /> 
							<label className="checkbox_control" onClick={this.CardsChecked_label.bind(this)} />
						  </div>
						}	
					  <img src={src} data-idx={data[i].idx} onClick={this.props.showImageModal} />
					  {data[i].album 
							? <a href={"/albums/"+data[i].album.idx+"/"+data[i].album.title} onClick={this.props.move}>
								<div className="album">
								  <span className="title">{data[i].album.title}</span>
								  <span className="date">{data[i].album.date}</span>							  
								  <span className="info">
									<i className="material-icons">camera_alt</i>
									{data[i].album.info}
								  </span>
								</div>
							  </a> 
							: ""
					  }
					</div>
				);
			}
		}												
		for(var i=0; i<this.props.grid; i++){
			list.push(
				<div className="cards" style={{height:100/this.props.grid+'%'}}>{cards[i]}</div> 
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
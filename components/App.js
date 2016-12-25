import $ from 'jquery';

import React, { Component } from 'react';
import Auth from './Auth';
import Main from './Main';
import { Toast } from './Sub';
 
class App extends Component {
	constructor(props){
        super(props);
        this.state = {
           	auth:false,
			CardsData:[],
			CardsGrid:3,
			bgImage:"",
			title:"",//header
			photos:0,//
			albums:0,//관련
			type:"main"
        }
    }
	componentDidMount(){

		let _this = this;
		
		$.ajax({
			url:'/auth',
			type:'GET',
		}).done(function(){
			_this.setState({auth:true});				

			let loc = window.location.pathname;

			if(loc=="/")
				window.history.replaceState(null,null,'/home');			

			_this.updateData();		
		});		
	}
	gridChange(grid){
		this.setState({CardsGrid:grid});
		this.updateData(null,grid);	
	}
	auth(boolean){
		this.setState({auth:boolean});
		if(boolean==true)
			this.goToHome();
	}
	move(e){
		e.preventDefault();
		
		let link = $(e.target).parents('a').attr('href');

		this.updateData(link);
	}
	goToHome(){		
		
		window.history.replaceState(null,null,'/home');
		
		this.updateData();
	}
	updateData(link,grid){
		
		let _this = this;
		
		let gridType = this.state.CardsGrid;
		
		if(grid)
			gridType = grid;
		
		if(link)
			window.history.replaceState(null,null,link);
		
		let url = "";
		
		let loc = window.location.pathname.split("/");
		
		if(loc.length>2)
			url = loc[1]+loc[2]+encodeURIComponent(loc[3]);
		else
			url = window.location.pathname;
					
		$.ajax({
			url : url+"?gridType="+gridType,
			type : 'GET',
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			dataType : "json",
		}).done(function(data){	
			data = JSON.parse(JSON.stringify(data));

			let currPage = window.location.pathname.split("/")[1];

			if(currPage=="home"){
				_this.setState({
						   CardsData:data.data,
						   bgImage:data.album.a_cover,
						   title:data.album.title,
						   photos:data.album.p_number,
						   albums:data.album.a_number,
						   type:"main"});	

				document.title = data.album.title;
			}else{
				_this.setState({
						   CardsData:data.data,
						   bgImage:data.album.a_cover,
						   title:data.album.title,
						   photos:data.album.info,
						   type:"none"});

				document.title = data.album.title;
			}
		}).fail(function(request, status, error){
			Toast(request.responseText, "alert");
			console.log("http code : " + request.status);
			console.log("message : " + request.responseText);
			console.log("error : " + error);
		});	
	}
    render(){
 		let bgStyle = {
		  backgroundImage: 'url(' + this.state.bgImage + ')'
		};
        return (
            <div>
				{this.state.auth==false ? 
					<Auth auth={this.auth.bind(this)} goToHome={this.goToHome.bind(this)}/> 
					: ""}				
				{this.state.auth==true ? 
					<Main style={bgStyle} move={this.move.bind(this)} goToHome={this.goToHome.bind(this)} gridChange={this.gridChange.bind(this)} updateData={this.updateData.bind(this)} 
					data={this.state.CardsData} grid={this.state.CardsGrid}	title={this.state.title} photos={this.state.photos} albums={this.state.albums} type={this.state.type} /> 
					: ""}
			</div>
        );
    }	
}


 
export default App;
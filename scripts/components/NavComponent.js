'use strict';
var React = require('react');
var Backbone = require('backbone');
require('bootstrap');

module.exports = React.createClass({
	componentWillMount: function() {
			this.props.router.on('route', () => {
				this.forceUpdate();
		});
	},
	componentDidMount: function(){
		$(document).ready(function(){
			$('.dropdown-toggle').dropdown();
		})
	},
	render: function() {
		var currentUser = Parse.User.current();
		var dropDownLinks = [];
		var links = [];
		var currentURL = Backbone.history.getFragment();

		if(Parse.User.current()) {
			dropDownLinks.push(<li key="profileLink"><a href="#profile">Profile</a></li>);
			dropDownLinks.push(<li key="separator1" role="separator" className="divider"></li>);
			dropDownLinks.push(<li key="logoutLink"><a href="#" onClick={this.logout}>Logout</a></li>);
			links.push(<li key="newTrip"><a href="#profile">Create New Trip</a></li>);
		} else {
			dropDownLinks.push(<li key="registerLink"><a href="#register">Register</a></li>);
			dropDownLinks.push(<li key="loginLink"><a href="#login">Login</a></li>);
		}
		// if (currentURL.indexOf('spot') > -1) {
		// 	//need to figure out how to grab ahold of trip id for URL
		// 	links.push(<li key="backToTrip"><a href={tripId} onClick={this.backToTrip}>Back To Trip</a></li>)
		// }
		return (
			<nav className="navbar navbar-default">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="#"><strong>SpotTrip</strong></a>
					</div>
					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">			
					<ul className="nav navbar-nav navbar-right">
						{links}
						<li className="dropdown">
							<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{currentUser ? currentUser.get('firstName')+' '+ currentUser.get('lastName'): 'Start Your Trip'} <span className="caret"></span></a>
							<ul className="dropdown-menu">
								{dropDownLinks}
							</ul>
						</li>
					</ul>
					</div>
				</div>
			</nav>
		)
	},
	logout: function(e) {
		e.preventDefault();
		Parse.User.logOut();
		this.props.router.navigate('', {trigger: true});
		console.log('logout');
	},
	// backToTrip: function(id) {
	// 	this.props.router.navigate('trip/'+id, {trigger: true})
	// }
});
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
window.$ = require('jquery');
window.jQuery = $;
require('bootstrap');

var NavComponent = require('./components/NavComponent');

Parse.initialize('SReTPFlNUeFnSqrBx33yNVHKDqR0jrY6BB2l6E47','XGMgOrJcA5H1O3jc7OwPVyt0n9oo6BXiJsD7Gptm');

var Router = Backbone.Router.extend({
	routes: {
		'': 'home'
		
	},
	home: function() {
		ReactDOM.render(<div>Home</div>,document.getElementById('app'));
	}
})

var r = new Router();
Backbone.history.start();

ReactDOM.render(
		<NavComponent router={r}/>,
		document.getElementById('nav')
	);

// var map;
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},
//     zoom: 8
//   });
// }
// Window.initMap();
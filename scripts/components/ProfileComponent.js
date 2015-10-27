'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
require('bootstrap');
var InfoWindowComponent = require('./InfoWindowComponent');
var TripModel = require('../models/TripModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			markers: []
		}
	},
	componentWillMount: function() {
		var query = new Parse.Query(TripModel);
		query.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
			(markers) => {
				markers.forEach(function(marker){
					console.log(marker.get('marker').latitude);
					console.log(marker.get('marker').longitude);
				})
				this.setState({markers: markers})
			},
			(err) => {
				console.log(err);
			}
		)
	},
	componentDidMount: function() {
		var self = this;
		var austinTX = {lat: 30.2500, lng: -97.7500};
		
		var geocoder = new google.maps.Geocoder();
		this.map = new google.maps.Map(this.refs.map, {
			center: austinTX,
			zoom: 3,
			disableDefaultUI: true,
			zoomControl: true
		});
		document.getElementById('tripSearchButton').addEventListener('click', () => {
			geocodeAddress(geocoder, this.map);
			console.log('btn clicked');
		});

		function geocodeAddress(geocoder, resultsMap) {
			var address = document.getElementById('tripInput').value;
			geocoder.geocode({'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					resultsMap.setCenter(results[0].geometry.location);
					var infoWindow = new google.maps.InfoWindow({
						map: resultsMap,
						position: results[0].geometry.location
					});
					//important
					var infoWindowContainer = document.createElement('div');
					ReactDOM.render(<InfoWindowComponent address={results[0]} onLocationAdded={self.addNewLocation} />, infoWindowContainer);
					infoWindow.setContent(infoWindowContainer);
					//*********
					console.log(results[0].geometry.location.toUrlValue());
					console.log(infoWindow.getContent());
					console.log(results[0].formatted_address);
					console.log(results[0].geometry.location.lat(),results[0].geometry.location.lng());
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
		}
	},
	addNewLocation: function(address,tripTitle,startDate,endDate) {
		console.log('add new location callback');
		console.log(tripTitle,startDate,endDate,address.formatted_address);
		var newTrip = new TripModel({
			userId: Parse.User.current(),
			tripName: tripTitle,
			tripStart: startDate,
			tripEnd: endDate,
			address: address.formatted_address,
			marker: new Parse.GeoPoint(address.geometry.location.lat(),address.geometry.location.lng())
		})
		newTrip.save();
	},
	render: function() {
		var currentUser = Parse.User.current();
		var myMarkers = [];
		var myList = [];
		myMarkers = this.state.markers.map(function(marker){
			return(
				marker.get('marker')
			)
		})
		myList = this.state.markers.map(function(listItem) {
			return(
				<a key={listItem.id} href={'#trip/'+listItem.id} className="list-group-item">{listItem.get('tripName')}</a>
			)
		})
		console.log(this.state.markers[0])
		console.log(myMarkers[0]);
		return(
			<div>
				<h1>Welcome Back {currentUser.get('firstName')}!</h1>
				<div className="panel panel-default col-sm-offset-1 col-sm-6">
					<div className="panel-heading ">
						<h3 className="panel-title">My Trips</h3>
					</div>
					<div className="panel-body">
						<div className="floating-panel">
							<input className="address" id="tripInput" type="textbox" defaultValue="Austin, TX"/>
							<input className="submit" id="tripSearchButton" type="button" value="Find Location"/>
						</div>
						<div ref="map"></div>
					</div>
					<div className="panel-footer">
						<h5>Traveler Rank: Beginner</h5>
						<ul className="list-group">
							<li className="list-group-item">
							<span className="badge">0</span>
								Trips
							</li>
							<li className="list-group-item">
							<span className="badge">0</span>
								Spots
							</li>
							<li className="list-group-item">
							<span className="badge">0</span>
								Blog Entries
							</li>
							<li className="list-group-item">
							<span className="badge">0</span>
								Picture Uploads
							</li>
						</ul>
					</div>
				</div>
				<div id="tripListWell" className="well well-lg col-sm-offset-1 col-sm-3">
					<h2>Trip List</h2>
					<div className="list-group">
						{myList}
					</div>
				</div>
			</div>
		)
	},
	newTrip: function(e) {
		e.prevenDefault();
		console.log('newTrip!');
	}
});
//[trips,spots,blogs,pictures]

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
			trips: [],
			map: [],
			newestTrip: null
		}
	},
	componentWillMount: function() {
		var query = new Parse.Query(TripModel);
		query.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
			(trips) => {
				trips.forEach((marker) => {
					var myLatLng = {lat: marker.get('marker').latitude, lng: marker.get('marker').longitude};
					var tripName = '<h4>'+marker.get('tripName')+'</h4><p>'+marker.get('address')+'<br>'+marker.get('tripStart')+' thru '+marker.get('tripEnd')+'</p><a href=#trip/'+marker.id+'>Edit Trip</a>';
					var marker = new google.maps.Marker({
    					position: myLatLng,
    					map: this.state.map,
    					title: marker.get('tripName')
  					});
  					var infowindow = new google.maps.InfoWindow({
    					content: tripName
  					});
  					marker.addListener('click', () => {
    					infowindow.open(this.state.map, marker);
  					});
				})
				this.setState({trips: trips})
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
		this.setState({map: this.map})
		document.getElementById('tripSearchButton').addEventListener('click', () => {
			geocodeAddress(geocoder, this.map);
			console.log('btn clicked');
		});
		function geocodeAddress(geocoder, resultsMap) {
			var address = document.getElementById('tripInput').value;
			document.getElementById('tripInput').value = '';
			geocoder.geocode({'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					resultsMap.setCenter(results[0].geometry.location);
					var infoWindow = new google.maps.InfoWindow({
						map: resultsMap,
						position: results[0].geometry.location
					});

					//important
					var infoWindowContainer = document.createElement('div');
					ReactDOM.render(<InfoWindowComponent address={results[0]} infoWindow={infoWindow} onLocationAdded={self.addNewLocation} />, infoWindowContainer);
					infoWindow.setContent(infoWindowContainer);
					//*********
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
		newTrip.save().then(
			(trip) => {
				var myLatLng = {lat: trip.get('marker').latitude, lng: trip.get('marker').longitude};
					var tripName = '<h4>'+trip.get('tripName')+'</h4><p>'+trip.get('address')+'<br>'+trip.get('tripStart')+' thru '+trip.get('tripEnd')+'</p><a href=#trip/'+trip.id+'>Edit Trip</a>';
					var marker = new google.maps.Marker({
    					position: myLatLng,
    					map: this.state.map,
    					title: trip.get('tripName')
  					});
  					var infowindow = new google.maps.InfoWindow({
    					content: tripName
  					});
  					marker.addListener('click', () => {
    					infowindow.open(this.state.map, marker);
  					});
  					console.log('newestTrip',trip);
  					this.setState({newTrip: trip});

			},
			(err) => {
				console.log(err);
			}
		);
	},
	render: function() {
		var currentUser = Parse.User.current();
		var myList = [];
		var newTrip = [];
		
		myList = this.state.trips.map(function(listItem) {
			return(
				<a key={listItem.id} href={'#trip/'+listItem.id} className="list-group-item"><strong>{listItem.get('tripName')}</strong><div>{listItem.get('tripStart')} thru {listItem.get('tripEnd')}</div></a>
			)
		})
		console.log(this.state.newTrip);
		if(this.state.newTrip) {
			newTrip = (<a key={this.state.newTrip.id} href={'#trip/'+this.state.newTrip.id} className="list-group-item"><strong>{this.state.newTrip.get('tripName')}</strong><div>{this.state.newTrip.get('tripStart')} thru {this.state.newTrip.get('tripEnd')}</div></a>)
		}
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
						{newTrip}
					</div>
				</div>
			</div>
		)
	}
});
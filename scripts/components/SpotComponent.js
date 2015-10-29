'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var SpotModel = require('../models/SpotModel');
var AddMediaComponent = require('./AddMediaComponent');
var PictureModel = require('../models/PictureModel');
var JournalEntryModel = require('../models/JournalEntryModel');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			spot: null,
			newPic: null
		}
	},
	componentWillMount: function() {
		$('#myModal').on('shown.bs.modal', function () {
			$('#myInput').show();
		})
		var self = this;
		var query = new Parse.Query(SpotModel);
		query.get(this.props.spot).then(
			(spot) => {
				var popUp = {lat: spot.get('spotMarker').latitude, lng: spot.get('spotMarker').longitude};
				var mapCenter = {lat: spot.get('spotMarker').latitude + 4, lng: spot.get('spotMarker').longitude};
		
				this.map = new google.maps.Map(this.refs.map, {
				center:  mapCenter,
				zoom: 6,
				disableDefaultUI: true,
				zoomControl: true
				});
				var infoWindow = new google.maps.InfoWindow({
						map: this.map,
						position: popUp
				});
				var infoWindowContainer = document.createElement('div');
					ReactDOM.render(<AddMediaComponent newPic={this.state.newPic} onPicModalShow={this.onPicModalShow} onModalShow={this.onModalShow} spot={this.props.spot} />, infoWindowContainer);
					infoWindow.setContent(infoWindowContainer);
				this.setState({map: this.map, spot: spot});
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		var newPic = this.state.newPic;
		console.log(newPic);
		return (
			<div>
				<h1>{this.state.spot ? this.state.spot.get('spotName') : ''}</h1>
				<div id="spotMap" ref="map"></div>
				<div ref="myModal"id="myModal" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<h1>Journal Entry</h1>
							<hr/>
							<form>
								<div className="form-group xs-col-6">
									<input type="text" ref="journalTitle" className="form-control" id="blogTitle" placeholder="Title"/>
								</div>
								<div className="form-group">
							    	<textarea ref="entry" className="form-control" rows="6" placeholder="Trip Memories Go Here!"></textarea>
								</div>
							</form>
							 <div className="modal-footer">
        						<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
        						<button onClick={this.addJournalEntry} type="button" className="btn btn-primary">Add Entry</button>
      						</div>
						</div>
					</div>
				</div>
				<div ref="picModal"id="myModal" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<h1>Upload Photos</h1>
							<hr/>
							<form>
								<input type="file" className="fileUpload" ref="addPicture"/>
								<input type="text" ref="title" placeholder="title"/>
								<input type="text" ref="caption" placeholder="caption"/>
							</form>
							<button onClick={this.addPicture}>UploadPicture</button>
						</div>
					</div>
				</div>
			</div>
		);
	},
	onModalShow: function() {
		console.log('modal made it');
		$(this.refs.myModal).modal('show');
	},
	onPicModalShow: function(e) {
		$(this.refs.picModal).modal('show');
	},
	addJournalEntry: function() {
		var newEntry = new JournalEntryModel({
			title: this.refs.journalTitle.value,
			entry: this.refs.entry.value,
			spotId: new SpotModel({objectId:this.props.spot})
		})
		newEntry.save();
		$(this.refs.myModal).modal('hide');
		this.refs.journalTitle.value = '';
		this.refs.entry.value = '';
	},
	addPicture: function() {
		var file = this.refs.addPicture.files[0];
		var picLabel;
		var formatTitle = this.refs.title.value.split(' ').join('');
		console.log(formatTitle)
		formatTitle.length > 0 ? picLabel = formatTitle : picLabel = 'picture';
		var parseFile = new Parse.File(picLabel+'.png',file);
		var pic = new PictureModel({
            spotId: new SpotModel({objectId:this.props.spot}),
            caption: this.refs.title.value,
            title: this.refs.caption.value
        });
        pic.set('picture', parseFile);
        parseFile.save().then(() => {
            pic.save().then((pic) => {
                console.log(pic);
                this.setState({newPic: pic})
            })
        })
        $(this.refs.picModal).modal('hide');
        this.refs.addPicture.value = '';
		this.refs.caption.value = '';
		this.refs.title.value = '';
		// var newTrip = new TripModel({
		// 	userId: Parse.User.current(),
		// 	tripName: tripTitle,
		// 	tripStart: new Date (startDate),
		// 	tripEnd: new Date (endDate),
		// 	address: address.formatted_address,
		// 	marker: new Parse.GeoPoint(address.geometry.location.lat(),address.geometry.location.lng())
		// })
		// newTrip.save().then(
		// 	(trip) => {
		// 		var myLatLng = {lat: trip.get('marker').latitude, lng: trip.get('marker').longitude};
		// 			var tripName = '<h4>'+trip.get('tripName')+'</h4><p>'+trip.get('address')+'<br>'+trip.get('tripStart').toDateString()+' thru '+trip.get('tripEnd').toDateString()+'</p><a href=#trip/'+trip.id+'>Edit Trip</a>';
		// 			var marker = new google.maps.Marker({
		// 				position: myLatLng,
		// 				map: this.state.map,
		// 				title: trip.get('tripName')
		// 			});
		// 			var infowindow = new google.maps.InfoWindow({
		// 				content: tripName
		// 			});
		// 			marker.addListener('click', () => {
		// 				infowindow.open(this.state.map, marker);
		// 			});
		// 			this.setState({newTrip: trip});

		// 	},
		// 	(err) => {
		// 		console.log(err);
		// 	}
		// );
	}
});
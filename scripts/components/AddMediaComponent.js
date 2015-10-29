'use strict';
var React = require('react');
var PictureModel = require('../models/PictureModel');
var JournalEntryModel = require('../models/JournalEntryModel');
var SpotModel = require('../models/SpotModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			pictures: [],
			journalEntries: [],
			newPic: []
		}
	},
	componentWillMount: function() {
		var picQuery = new Parse.Query(PictureModel);
		picQuery.equalTo('spotId', new SpotModel({objectId: this.props.spot})).find().then(
			(pictures) => {
				this.setState({pictures: pictures})
			},
			(err) => {
				console.log(err);
			}
		)
		var journalQuery = new Parse.Query(JournalEntryModel);
		journalQuery.equalTo('spotId', new SpotModel({objectId: this.props.spot})).find().then(
			(entries) => {
				this.setState({journalEntries: entries});
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		var pictures = [];
		var entries = [];
		var newPic = this.state.newPic;
		
		entries = this.state.journalEntries.map(function(entry) {
			return(
				<div key={entry.id}>
					<p className="lead">{entry.get('title')}</p>
					<p>{entry.get('entry')}</p>
				</div>
			)
		});
		pictures = this.state.pictures.map(function(picture) {
			return(
				<div className="row" key={picture.id}>
  					<div className="col-xs-6 col-md-3">
    					<a href="#" className="thumbnail">
      						<img src={picture.get('picture').url()} alt="../images/defaultPic.png"/>
    					</a>
  					</div>
				</div>
			)
		});
		return (
			<div>
				{pictures}
				{newPic}
				{entries}
				<button onClick={this.addBlog} type="button" className="btn btn-primary" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>
				<button onClick={this.addPic} type="button" className="btn btn-primary" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-camera" aria-hidden="true"></span></button>
			</div>
		);
	},
	addPic: function() {
		this.props.onPicModalShow();
	},
	addBlog: function() {
		console.log('clicked');
		this.props.onModalShow();
	}
});
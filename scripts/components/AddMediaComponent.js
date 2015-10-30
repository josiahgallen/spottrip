'use strict';
var React = require('react');
var PictureModel = require('../models/PictureModel');
var JournalEntryModel = require('../models/JournalEntryModel');
var SpotModel = require('../models/SpotModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			pictures: [],
			journalEntries: []
		}
	},
	componentWillMount: function() {
		this.props.dispatcher.on('picAdded', (pic) => {
			this.state.pictures.push(pic);
			this.setState({pictures: this.state.pictures})
		})
		this.props.dispatcher.on('entryAdded', (entry) => {
			this.state.journalEntries.push(entry);
			this.setState({journalEntries: this.state.journalEntries});
		})
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
		entries = this.state.journalEntries.map(function(entry) {
			return(
				<div key={entry.id}>
					<p className="lead">{entry.get('title').toUpperCase()}</p>
					<p>{entry.get('entry')}</p>
				</div>
			)
		});
		pictures = this.state.pictures.map(function(picture) {
			return(
					<div className="col-xs-6 col-md-3" key={picture.id}>
						<a href="#" className="thumbnail">
							<img src={picture.get('picture').url()} alt="../images/defaultPic.png"/>
							<label>{picture.get('caption')}</label>
						</a>
					</div>
			)
		});
		return (
			<div>
				<div>
					<button onClick={this.addBlog} type="button" className="btn btn-primary" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>
					<button onClick={this.addPic} type="button" className="btn btn-primary" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-camera" aria-hidden="true"></span></button>
				</div>
				<div className="row">
					{pictures}
				</div>
				{entries}
			</div>
		);
	},
	addPic: function() {
		this.props.onPicModalShow();
	},
	addBlog: function() {
		this.props.onModalShow();
	}
});
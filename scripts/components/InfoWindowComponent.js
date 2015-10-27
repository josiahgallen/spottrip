'use strict';
var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<form onSubmit={this.addLocation}>
					<input ref="tripTitle" type="text" placeholder="Trip Title"/>
					<label>{this.props.address.formatted_address}</label><br/>
					<input ref="startDate" type="date"/>
					<label>Trip Start </label><br/>
					<input ref="endDate" type="date"/>
					<label> Trip End </label><br/>
					<button>Create Trip</button>
				</form>
			</div>
		);
	},
	addLocation: function(e) {
		e.preventDefault();
		console.log('add location clicked');
		console.log(this.refs.startDate.value);
		this.props.onLocationAdded(this.props.address,this.refs.tripTitle.value,this.refs.startDate.value,this.refs.endDate.value);
	}
});
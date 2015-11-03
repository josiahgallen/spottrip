'use strict';
var React = require('react');
var TripModel = require('../models/TripModel');

module.exports = React.createClass({
	componentWillMount: function() {
		var query = new Parse.Query(TripModel);
		query.descending('createdAt').limit(4).find().then (
			(trips) => {
				console.log(trips);
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		return (
			<div>
				<div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
					//Indicators
					<ol className="carousel-indicators">
						<li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
						<li data-target="#carousel-example-generic" data-slide-to="1"></li>
						<li data-target="#carousel-example-generic" data-slide-to="2"></li>
						<li data-target="#carousel-example-generic" data-slide-to="3"></li>
						<li data-target="#carousel-example-generic" data-slide-to="4"></li>
					</ol>
					//Wrapper for slides
					<div className="carousel-inner" role="listbox">
					<div className="item active">
							<img className="carouselPic" src="../images/DSC_0286.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_0368.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_3050.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_3156.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_2712.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
					</div> 
					<a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
						<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
						<span className="sr-only">Previous</span>
					</a>
					<a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
						<span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
						<span className="sr-only">Next</span>
					</a>
				</div>
				<div className="container-fluid">
					<div className="row">
						<div className="well myWell well-md col-xs-8 col-xs-offset-2" id="pageLead">
							<p>
								You love to travel, you love to take pictures of your trip, but afterwards, when you
								get back to the real world, what happens to those memories?  Most of us
								save them to a laptop somewhere and they are never looked at or thought of again.
								With <strong>SpotTrip</strong> you now have a fun and meaningful way to organize your trip!
							</p>
						</div>
						<a className="col-sm-offset-5"href="#register"><button className="featureButton"><h3>Get Started Here</h3></button></a>
					</div>
				</div>
			</div>

		);
	},
	addLocation: function(e) {
		e.preventDefault();
		this.props.infoWindow.close();
		this.props.onLocationAdded(this.props.address,this.refs.tripTitle.value,this.refs.startDate.value,this.refs.endDate.value);
	}
});
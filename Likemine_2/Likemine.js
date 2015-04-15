Likes = new Mongo.Collection("likes");

if (Meteor.isClient) {

	Meteor.subscribe("likes");
	// Meteor.subscribe("allLikes");

	// Session.setDefault("currentStep", 1);

	Template.body.helpers({
		likes: function () {
			return Likes.find({}, {sort: {createdAt: -1}});
		}
	});

	Template.body.events({
		"submit .new-like": function (event) {

			var text = event.target.text.value;

			Meteor.call("addLike", text);

			event.target.text.value = "";
			return false;
		}

	});


	// 	Template.resultsblock.events({
	// 	"click #button": function() {
	// 		var step = Session.get('currentStep');
	// 		return Session.set('currentStep', step + 1);
	// 		console.log(currentStep);
	// 	}
	// });

	// Template.resultsContainer.helpers({
	// 	isStep: function(n) {
	// 		console.log(n);
	// 		return Session.equals('currentStep', n);
	// 	}
	// });


	Template.like.events({
		"click .delete": function () {
			Meteor.call("deleteLike", this._id);
		}
	});

	Template.like.helpers({
		isOwner: function () {
			return this.owner === Meteor.userId();
		}
	});

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
}


Meteor.methods({
	addLike: function (text) {
		Likes.insert({
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
	},

	deleteLike: function (likeId) {
		Likes.remove(likeId);
	},

});

// if (Meteor.isServer) {

	Meteor.publish("likes", function () {
		return Likes.find({
			$or: [
			{ owner: this.userId }
			]
		});
	});
// }
	// Meteor.publish('allLikes', function publishFunction() {
	// 	return Likes.find({}, {sort: {date: -1}});
	// });


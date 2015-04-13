Likes = new Mongo.Collection("likes");

if (Meteor.isClient) {

	Meteor.subscribe("likes");

	Template.body.helpers({
		likes: function () {
			return Likes.find({}, {sort: {createdAt: -1}});
		}
	});

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
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

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

if (Meteor.isServer) {
	Meteor.publish("likes", function () {
		return Likes.find({
			$or: [
			{ owner: this.userId }
			]
		});
	});
}
Likes = new Mongo.Collection("likes");
Recs = new Mongo.Collection("recommendations")


if (Meteor.isServer) {

	Accounts.removeOldGuests();

	Meteor.publish("recommendations", function() {
		recs = Likes.aggregate([{owner:{$ne:Meteor.userId()}}, {$project: {text: 1}}, { $unwind : "$text" }])
	});

	Meteor.publish("likes", function () {
		return Likes.find(
  // {
  //   $or: [
  //   { owner: this.userId }
  //   ]
  // }
  );
	});
}


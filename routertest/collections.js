Likes = new Mongo.Collection("likes");
AllLikes = new Mongo.Collection("allLikes")

if (Meteor.isServer) {

  Accounts.removeOldGuests();

Meteor.publish("allLikes", function(){
	return AllLikes.find();
});

Meteor.publish("likes", function () {
  return Likes.find(
  );
});
}


Likes = new Mongo.Collection("likes");


if (Meteor.isServer) {

  Accounts.removeOldGuests();

Meteor.publish("likes", function () {
  return Likes.find();
});

}


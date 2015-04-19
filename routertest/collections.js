Articles = new Meteor.Collection('articles');
Likes = new Mongo.Collection("likes");


if (Meteor.isServer) {

    Meteor.publish("likes", function () {
    return Likes.find(
    {
      $or: [
      { owner: this.userId }
      ]
    }
    );
  });
}


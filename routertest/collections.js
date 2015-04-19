Articles = new Meteor.Collection('articles');
Likes = new Mongo.Collection("likes");


if (Meteor.isServer) {

// Meteor.publish("userData", function () {
//   if (this.userId) {
//     return Meteor.users.find({_id: this.userId},
//                              {fields: {'text': 1}});
//   } else {
//     this.ready();
//   }
// });
// }

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


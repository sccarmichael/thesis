if (Meteor.isClient) {

  Meteor.subscribe("likes");
  Meteor.subscribe("recommendations");

  Template.input.helpers({
    likes: function () {
      return Likes.find({owner:Meteor.userId()}, {fields:{"text":1}},{sort: {createdAt: -1}});
    }
  });

//   Template.input.helpers({
//   settings: function() {
//     return {
//       position: "bottom",
//       limit: 10,
//       rules: [
//         {
//           collection: Likes,
//           field: "text",
//           options: '',
//           matchAll: true,
//           filter: { type: "autocomplete" },
//           template: Template.like
//         }
//       ]
//     };
//   }
// });

  Template.input.events({
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

    Template.rec.helpers({
    recs: function () {
      // var pipeline = [
      // {owner:{$ne:Meteor.userId()}},{fields:{"text":1}},{sort: {createdAt: -1}}}
      // ]
      return Recs.find()
        // {owner:{$ne:Meteor.userId()}},{fields:{"text":1}},{sort: {createdAt: -1}});
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

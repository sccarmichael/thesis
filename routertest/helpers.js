if (Meteor.isClient) {

    Meteor.subscribe("likes");
    Meteor.subscribe("userData");

  Template.input.helpers({
    likes: function () {
      return Likes.find({}, {sort: {createdAt: -1}});
    }
  });

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

    Template.results.helpers({
    likes: function () {
      return Likes.find({}, {sort: {createdAt: -1}});
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Meteor.subscribe("tasks");

Template.body.helpers({
    tasks: function () {
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
  });


  Template.body.events({
    "submit .new-task": function (event) {

      var text = event.target.text.value;

      Meteor.call("addTask", text);

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
  }

});

  Template.task.events({
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    }
  });


  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },

});

Meteor.publish("tasks", function () {
  return Tasks.find({
    $or: [
    { owner: this.userId }
    ]
  });
});
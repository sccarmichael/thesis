Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
// Replace the existing Template.body.helpers
Template.body.helpers({
  tasks: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the tasks
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  },
  // Add to Template.body.helpers
incompleteCount: function () {
  return Tasks.find({checked: {$ne: true}}).count();
}
});

// Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.body.events({

    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;
      // replace Tasks.insert( ... ) with:
      Meteor.call("addTask", text);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
      "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
      }
  });
// In the client code, below everything else
Template.task.events({
  "click .toggle-checked": function () {
// replace Tasks.update( ... ) with:
Meteor.call("setChecked", this._id, ! this.checked);
  },
  "click .delete": function () {
// replace Tasks.remove( ... ) with:
Meteor.call("deleteTask", this._id);
  }
});
// At the bottom of the client code
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
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});
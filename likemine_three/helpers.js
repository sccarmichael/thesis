if (Meteor.isClient) {

  Meteor.subscribe("likes");

  Template.input.helpers({
    likes: function () {
      return Likes.find({owner:Meteor.userId()}, {fields:{"text":1}},{sort: {createdAt: -1}});
    }
  });

  Template.input.events({
    "submit .new-like": function (event) {
      var text = event.target.text.value;
      
      var spotify = "https://api.spotify.com/v1/search";
      $.getJSON(spotify, {"q": text, "type": "artist"},function(data){
        var items = data.artists.items;
        if (items.length > 0) {
          console.log(items[0].id);
          console.log(items[0].name);
          Meteor.call("addLike", items[0].name,items[0].id);
          event.target.text.value = "";
        }
        
      });
      $
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
    recs:function(){
      console.log(this);
      return Likes.find();
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

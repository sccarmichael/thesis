// #Security with allow and deny rules -> Adding posts using a method call
Meteor.methods({

    addLike: function (text) {
        Likes.insert({
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },

    deleteLike: function (likeId) {
        Likes.remove(likeId);
    },

    ignoreCurrentUser: function (userId) {
         Likes.find({owner:{$ne:Meteor.userId()}},{fields:{"text":1}},{sort: {createdAt: -1}});
    }

});
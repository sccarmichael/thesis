// #Security with allow and deny rules -> Adding posts using a method call
Meteor.methods({

    addLike: function (name,id) {
        Likes.insert({
            text: name,
            artistId: id,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },

    deleteLike: function (likeId) {
        Likes.remove(likeId);
    },

    


});
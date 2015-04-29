Router.configure({
   layoutTemplate: 'layout'  //can be any template name
 });


Router.map(function () {
  this.route('home', {
    path: '/',
  });

  this.route('input', {
    path:'/my-list',
  //   data: {
  //       myList: function() {return Likes.find({owner:"sccarmichael"})
  //   },
  // }
});

  this.route('results', {
    path:'/results',
    data: function(){
      console.log("routing");
      var myLikes = Likes.find({owner: Meteor.userId()}).fetch();
      var artistIds = [];
      for (var i = 0; i < myLikes.length; i++) {
        artistIds.push(myLikes[i].artistId);
      }

      var sharedLikes = Likes.find({artistId: {$in: artistIds}, owner:{$ne:Meteor.userId()}}).fetch();
      if (sharedLikes.length === 0) {
        return {myLikes: [], rec: []};
      }


      var counts = _.countBy(sharedLikes, function(like) {
        return like.username;
      });

      var pairs = _.pairs(counts);
      var sorted = _.sortBy(pairs, function(pair) { return -pair[1]; }); 
      var username = sorted[0][0];
      var count = sorted[0][1];


      var recommendedLikes = Likes.find({artistId: {$nin: artistIds}, username:username});
            console.log(recommendedLikes);
      // if (sharedLikes.length === 0) {
      //   return {myList: [],        rec: []};
      // }
      
      return {
       rec: recommendedLikes
     }
   },
 });

});

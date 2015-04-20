(function(){
Template.__checkName("home");
Template["home"] = new Template("Template.home", (function() {
  var view = this;
  return HTML.DIV({
    "class": "container"
  }, "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "span",
    style: "padding: 20px"
  }, "    \n        ", HTML.Raw('<div class="textblock">\n          <h1>What do you really love?</h1>\n        </div>'), "\n        ", HTML.Raw('<div class="textblock">\n\n            <img class="icon" src="images/Like.png" style="margin-top:20px">\n            <h2>These days most of the things we "Like" on social media aren\'t actually things that we like in real life. As a result, it can be hard to find new stuff.</h2>\n          </div>'), "\n            ", HTML.Raw('<div class="textblock">\n\n            <img class="icon" src="images/Checks.png" style="float:right; margin-top:20px">\n            <h2 style="text-align:right">LikeMine is a better way to get recommendations. It\'s easy; you list the things that you like, and we\'ll use them to find likeminded people from around the world.</h2> \n          </div>'), "\n          ", HTML.Raw('<div class="textblock">\n            <img class="icon" src="images/Music.png" style="margin-top:20px">\n            <h2>Sign in, then add your favorite musical artists to your Favorites list. When you click "Submit" we\'ll find people who like most of them too and show you some bands that they love but you might not know about.</h2>\n          </div>'), "\n          ", HTML.DIV({
    id: "row"
  }, "\n            ", HTML.A({
    "class": "btn btn-primary",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "input");
    },
    id: "compare"
  }, "Get started"), "\n          "), "\n        "), "\n      "), "\n    ");
}));

Template.__checkName("input");
Template["input"] = new Template("Template.input", (function() {
  var view = this;
  return HTML.DIV({
    "class": "container"
  }, "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "col-sm-6"
  }, "\n        ", HTML.DIV({
    "class": "inputblock"
  }, "\n          ", HTML.Raw("<h4>A band that I love is...</h4>"), "\n          ", HTML.Raw('<form class="new-like">\n            <input type="text" name="text" placeholder="Band name">\n          </form>'), "\n          ", HTML.DIV({
    "class": "results"
  }, "\n            ", HTML.UL("\n\n              ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("likes"));
  }, function() {
    return [ "\n              ", Spacebars.include(view.lookupTemplate("like")), "\n              " ];
  }), "\n\n            "), "\n            ", HTML.A({
    type: "submit",
    "class": "btn btn-default",
    id: "goback",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "home");
    }
  }, "Go back"), "\n            ", HTML.A({
    type: "submit",
    "class": "btn btn-primary",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "results");
    },
    id: "compare"
  }, "Submit all"), "\n          "), "\n        "), "\n      "), "\n    "), "\n  ");
}));

Template.__checkName("results");
Template["results"] = new Template("Template.results", (function() {
  var view = this;
  return HTML.DIV({
    "class": "container"
  }, "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "inputblock"
  }, "\n        ", HTML.Raw("<h4>Recommended for you:</h4>"), "\n        ", HTML.DIV({
    "class": "results"
  }, "\n          ", HTML.UL("\n              ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("recs"));
  }, function() {
    return [ "\n              ", Spacebars.include(view.lookupTemplate("rec")), "\n              " ];
  }), "\n          "), "\n          ", HTML.A({
    type: "submit",
    "class": "btn btn-default",
    id: "goback",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "input");
    }
  }, "Go back"), "\n        "), "\n      "), "\n    "), "\n  ");
}));

Template.__checkName("like");
Template["like"] = new Template("Template.like", (function() {
  var view = this;
  return HTML.LI(HTML.Raw('\n    <button class="delete">&times;</button>\n    '), HTML.H3({
    "class": "text"
  }, " ", Blaze.View("lookup:text", function() {
    return Spacebars.mustache(view.lookup("text"));
  })), "\n  ");
}));

Template.__checkName("rec");
Template["rec"] = new Template("Template.rec", (function() {
  var view = this;
  return HTML.LI("\n    ", HTML.H3({
    "class": "text"
  }, " ", Blaze.View("lookup:text", function() {
    return Spacebars.mustache(view.lookup("text"));
  })), "\n  ");
}));

})();

(function(){
Meteor.startup(function() { $('body').attr({"style":"padding-top:60px"}); });

Template.body.addContent((function() {
  var view = this;
  return [ HTML.NAV({
    "class": "navbar navbar-default navbar-fixed-top"
  }, "\n    ", HTML.DIV({
    "class": "container-fluid"
  }, "\n      ", HTML.DIV({
    "class": "navbar-header"
  }, "\n        ", HTML.Raw('<a class="navbar-brand" href="#">\n          <img class="headerlogo" src="images/Logo.png" alt="551b190215ec9fa344fb9608_Logo.png">\n        </a>'), "\n        ", Blaze._TemplateWith(function() {
    return {
      align: Spacebars.call("right")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("loginButtons"));
  }), "   \n      "), "\n    "), "\n  "), "\n\n  ", HTML.DIV({
    "class": "container-fluid"
  }, "\n    ", HTML.Raw('<div class="row">\n      <div class="image-wrapper">\n        <img src="images/Chicago.jpg" class="scale-image">\n        <h1>\n          The Network for People Like You\n        </h1>\n      </div>\n    </div>'), "\n    ", HTML.Raw('<div class="textblock">\n      <div class="row">\n        <div class="col-xs-4">\n          <img class="icon" src="images/Like.png" alt="Like.png">      \n        </div>\n        <div class="col-xs-8">\n          <div class="copy">\n            <h2 style="text-align:left">These days most of the things we "Like" on social media aren\'t actually things that we like in real life. As a result, it can be hard to find new stuff.</h2>\n          </div>\n        </div>\n      </div>\n    </div>'), "\n    ", HTML.Raw('<div class="textblock">\n      <div class="row">\n        <div class="col-xs-12">\n          <img class="icon" src="images/Checks.png" alt="Checks.png">      \n        </div>\n        <div class="col-xs-12">\n          <h2 style="text-align:center"> \n            So we decided to create a better way to get recommendations. <br> It\'s easy; you list the things that you like, and we use them to find likeminded people from around the world.\n          </h2>\n        </div>\n      </div> \n    </div>'), "\n    ", HTML.Raw('<div class="textblock">\n      <div class="row">\n                <div class="col-xs-8">\n          <h2 style="text-align:right"> \n            Add your Top 10 favorite bands below and we\'ll find people who like most of them too. Then we\'ll show you some bands that they love but you might not know about. Sign in to get started!\n          </h2>\n        </div>\n        <div class="col-xs-4">\n          <img class="icon" src="images/Music.png" alt="Music.png">      \n        </div>\n      </div> \n    </div>'), "\n\n    ", HTML.DIV({
    "class": "resultsblock"
  }, "\n      ", HTML.DIV({
    "class": "row"
  }, "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n        ", HTML.FORM({
      "class": "new-task"
    }, "\n          ", HTML.INPUT({
      "class": "",
      type: "text",
      name: "text",
      placeholder: "A band that I love is..."
    }), "\n        "), "\n        " ];
  }), "\n        ", HTML.DIV({
    "class": "results"
  }, "\n          ", HTML.UL("\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("tasks"));
  }, function() {
    return [ "\n            ", Spacebars.include(view.lookupTemplate("task")), "\n            " ];
  }), "\n          "), "\n        "), "\n      "), "\n    "), "\n  "), HTML.Raw('\n  <div id="wrapper">\n    <div id="footer">\n      <div class="row">\n        <div class="col-xs-9">\n          <div class="copy">\n            <h5 style="padding-left:10px; font-size:12px">LikeMind is an MFA IXD thesis project by Sam Carmichael</h5>\n          </div>\n        </div>\n        <div class="col-xs-3">\n          <div class="copy">\n            <h5 style="text-align:right; padding-right:10px; font-size:12px">© 2015</h5>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>') ];
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("task");
Template["task"] = new Template("Template.task", (function() {
  var view = this;
  return HTML.LI({
    "class": function() {
      return Blaze.If(function() {
        return Spacebars.call(view.lookup("checked"));
      }, function() {
        return "checked";
      });
    }
  }, HTML.Raw('\n    <button class="delete">&times;</button>\n    '), HTML.H3({
    "class": "text"
  }, " ", Blaze.View("lookup:text", function() {
    return Spacebars.mustache(view.lookup("text"));
  })), "\n  ");
}));

})();

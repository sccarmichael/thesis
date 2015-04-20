(function(){
Template.__checkName("layout");
Template["layout"] = new Template("Template.layout", (function() {
  var view = this;
  return [ HTML.HEADER("\n    ", Spacebars.include(view.lookupTemplate("nav")), "\n  "), "\n  ", HTML.DIV({
    id: "wrapper",
    style: "padding-bottom:70px"
  }, "\n    ", Spacebars.include(view.lookupTemplate("yield")), "\n  ") ];
}));

Template.__checkName("nav");
Template["nav"] = new Template("Template.nav", (function() {
  var view = this;
  return HTML.DIV({
    id: "header"
  }, "\n    ", HTML.DIV({
    id: "row"
  }, "\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "home");
    }
  }, "\n        ", HTML.Raw('<img class="headerlogo" src="images/Logo.png" alt="551b190215ec9fa344fb9608_Logo.png">'), "\n      "), "\n      ", Spacebars.include(view.lookupTemplate("navItems")), "\n      ", Blaze._TemplateWith(function() {
    return {
      align: Spacebars.call("right")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("loginButtons"));
  }), "   \n    "), "\n  ");
}));

Template.__checkName("navItems");
Template["navItems"] = new Template("Template.navItems", (function() {
  var view = this;
  return HTML.DIV({
    "class": "btn-group btn-group-xs",
    role: "group",
    "aria-label": "...",
    style: "padding-top:10px"
  }, "\n    ", HTML.A({
    type: "button",
    "class": "btn btn-default",
    a: "",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "home");
    }
  }, "How it works"), "\n    ", HTML.A({
    type: "button",
    "class": "btn btn-default",
    a: "",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "input");
    }
  }, "My list"), "\n    ", HTML.A({
    type: "button",
    "class": "btn btn-default",
    a: "",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "results");
    }
  }, "Recommendations"), "\n  ");
}));

})();

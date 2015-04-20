//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var AccountsGuest;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/artwells:accounts-guest/accounts-guest.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
AccountsGuest = {};                                                                                                    // 1
if (typeof AccountsGuest.forced === "undefined") {                                                                     // 2
	AccountsGuest.forced = true; /*default to making loginVisitor automatic, and on logout*/                              // 3
}                                                                                                                      // 4
if (typeof AccountsGuest.enabled === "undefined") {                                                                    // 5
	AccountsGuest.enabled = true; /* on 'false'  Meteor.loginVisitor() will fail */                                       // 6
}                                                                                                                      // 7
                                                                                                                       // 8
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/artwells:accounts-guest/accounts-guest-client.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*****************                                                                                                     // 1
 * special anonymous behavior so that visitors can                                                                     // 2
 * manipulate their work                                                                                               // 3
 *                                                                                                                     // 4
 */                                                                                                                    // 5
                                                                                                                       // 6
// If our app has a Blaze, override the {{currentUser}} helper to deal guest logins                                    // 7
if (Package.blaze) {                                                                                                   // 8
    /**                                                                                                                // 9
     * @global                                                                                                         // 10
     * @name  currentUser                                                                                              // 11
     * @isHelper true                                                                                                  // 12
     * @summary Calls [Meteor.user()](#meteor_user). Use `{{#if currentUser}}` to check whether the user is logged in. // 13
     * Where "logged in" means: The user has has authenticated (e.g. through providing credentials)                    // 14
     */                                                                                                                // 15
    Package.blaze.Blaze.Template.registerHelper('currentUser', function () {                                           // 16
        var user = Meteor.user();                                                                                      // 17
        if (user &&                                                                                                    // 18
            typeof user.profile !== 'undefined' &&                                                                     // 19
            typeof user.profile.guest !== 'undefined' &&                                                               // 20
            user.profile.guest){                                                                                       // 21
            // a guest login is not a real login where the user is authenticated.                                      // 22
            // This allows the account-base "Sign-in" to still appear                                                  // 23
            return null;                                                                                               // 24
        } else {                                                                                                       // 25
            return Meteor.user();                                                                                      // 26
        }                                                                                                              // 27
    });                                                                                                                // 28
}                                                                                                                      // 29
                                                                                                                       // 30
//no non-logged in users                                                                                               // 31
/* you might need to limit this to avoid flooding the user db */                                                       // 32
Meteor.loginVisitor = function (email, callback) {                                                                     // 33
    AccountsGuest.forced = true;                                                                                       // 34
    if (!Meteor.userId()) {                                                                                            // 35
        Meteor.call('createGuest', email, function (error, result) {                                                   // 36
            if (error) {                                                                                               // 37
                console.log('Error in creating Guest ' + error);                                                       // 38
                return callback && callback(error);                                                                    // 39
            }                                                                                                          // 40
                                                                                                                       // 41
            /* if a simple "true" is returned, we are in a disabled mode */                                            // 42
            if(result === true) return callback && callback();                                                         // 43
                                                                                                                       // 44
            Meteor.loginWithPassword(result.email, result.password, function(error) {                                  // 45
                if(error) {                                                                                            // 46
                    console.log('Error logging in ' + error);                                                          // 47
                    callback && callback(error);                                                                       // 48
                } else {                                                                                               // 49
                    callback && callback();                                                                            // 50
                }                                                                                                      // 51
            });                                                                                                        // 52
        });                                                                                                            // 53
    }                                                                                                                  // 54
}                                                                                                                      // 55
                                                                                                                       // 56
Meteor.startup(function(){                                                                                             // 57
    Deps.autorun(function () {                                                                                         // 58
        if (!Meteor.userId()) {                                                                                        // 59
            if (AccountsGuest.forced === true) {                                                                       // 60
                Meteor.loginVisitor();                                                                                 // 61
            }                                                                                                          // 62
        }                                                                                                              // 63
    });                                                                                                                // 64
});                                                                                                                    // 65
                                                                                                                       // 66
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['artwells:accounts-guest'] = {
  AccountsGuest: AccountsGuest
};

})();

(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var AccountsGuest, res, guestname, guest;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/artwells:accounts-guest/accounts-guest.js                                                   //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
AccountsGuest = {};                                                                                     // 1
if (typeof AccountsGuest.forced === "undefined") {                                                      // 2
	AccountsGuest.forced = true; /*default to making loginVisitor automatic, and on logout*/               // 3
}                                                                                                       // 4
if (typeof AccountsGuest.enabled === "undefined") {                                                     // 5
	AccountsGuest.enabled = true; /* on 'false'  Meteor.loginVisitor() will fail */                        // 6
}                                                                                                       // 7
                                                                                                        // 8
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/artwells:accounts-guest/accounts-guest-server.js                                            //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Accounts.removeOldGuests = function (before) {                                                          // 1
    if (typeof before === 'undefined') {                                                                // 2
        before = new Date();                                                                            // 3
        before.setHours(before.getHours() - 1);                                                         // 4
    }                                                                                                   // 5
    res = Meteor.users.remove({createdAt: {$lte: before}, 'profile.guest': true});                      // 6
    //res = Meteor.users.remove( {'profile.guest': true});                                              // 7
    return res;                                                                                         // 8
};                                                                                                      // 9
                                                                                                        // 10
/* adapted from pull-request https://github.com/dcsan                                                   // 11
* See https://github.com/artwells/meteor-accounts-guest/commit/28cbbf0eca2d80f78925ac619abf53d0769c0d9d // 12
*/                                                                                                      // 13
Meteor.methods({                                                                                        // 14
    createGuest: function (email)                                                                       // 15
    {                                                                                                   // 16
        check(email, Match.OneOf(String, null, undefined));                                             // 17
                                                                                                        // 18
        /* if explicitly disabled, happily do nothing */                                                // 19
        if (AccountsGuest.enabled === false){                                                           // 20
            return true;                                                                                // 21
        }                                                                                               // 22
                                                                                                        // 23
        //    count = Meteor.users.find().count() + 1                                                   // 24
        guestname = "guest-#" + Random.id()                                                             // 25
                                                                                                        // 26
        if (!email) {                                                                                   // 27
            email = guestname + "@example.com";                                                         // 28
        }                                                                                               // 29
                                                                                                        // 30
        guest = {                                                                                       // 31
            username: guestname,                                                                        // 32
            email: email,                                                                               // 33
            profile: {guest: true},                                                                     // 34
            password: Meteor.uuid(),                                                                    // 35
        };                                                                                              // 36
        Accounts.createUser(guest);                                                                     // 37
        //    console.log("createGuest" + guestname);                                                   // 38
        return guest;                                                                                   // 39
    }                                                                                                   // 40
});                                                                                                     // 41
                                                                                                        // 42
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['artwells:accounts-guest'] = {
  AccountsGuest: AccountsGuest
};

})();

//# sourceMappingURL=artwells_accounts-guest.js.map

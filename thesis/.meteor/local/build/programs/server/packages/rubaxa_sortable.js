(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Sortable;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/rubaxa:sortable/meteor/methods.js                                                    //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
'use strict';                                                                                    // 1
                                                                                                 // 2
Meteor.methods({                                                                                 // 3
	/**                                                                                             // 4
	 * Update the orderField of documents with given ids in a collection, incrementing it by incDec // 5
	 * @param {String} collectionName - name of the collection to update                            // 6
	 * @param {String[]} ids - array of document ids                                                // 7
	 * @param {String} orderField - the name of the order field, usually "order"                    // 8
	 * @param {Number} incDec - pass 1 or -1                                                        // 9
	 */                                                                                             // 10
	'rubaxa:sortable/collection-update': function (collectionName, ids, orderField, incDec) {       // 11
		check(collectionName, String);                                                                 // 12
		check(ids, [String]);                                                                          // 13
		check(orderField, String);                                                                     // 14
		check(incDec, Number);                                                                         // 15
		var selector = {_id: {$in: ids}}, modifier = {$inc: {}};                                       // 16
		modifier.$inc[orderField] = incDec;                                                            // 17
		Mongo.Collection.get(collectionName).update(selector, modifier, {multi: true});                // 18
	}                                                                                               // 19
});                                                                                              // 20
                                                                                                 // 21
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rubaxa:sortable'] = {
  Sortable: Sortable
};

})();

//# sourceMappingURL=rubaxa_sortable.js.map

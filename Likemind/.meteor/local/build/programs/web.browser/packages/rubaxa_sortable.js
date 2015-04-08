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
var Template = Package.templating.Template;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Sortable;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rubaxa:sortable/Sortable.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**!                                                                                                                  // 1
 * Sortable                                                                                                           // 2
 * @author	RubaXa   <trash@rubaxa.org>                                                                                // 3
 * @license MIT                                                                                                       // 4
 */                                                                                                                   // 5
                                                                                                                      // 6
                                                                                                                      // 7
(function (factory) {                                                                                                 // 8
	"use strict";                                                                                                        // 9
                                                                                                                      // 10
	if (typeof define === "function" && define.amd) {                                                                    // 11
		define(factory);                                                                                                    // 12
	}                                                                                                                    // 13
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {                                     // 14
		module.exports = factory();                                                                                         // 15
	}                                                                                                                    // 16
	else if (typeof Package !== "undefined") {                                                                           // 17
		Sortable = factory();  // export for Meteor.js                                                                      // 18
	}                                                                                                                    // 19
	else {                                                                                                               // 20
		/* jshint sub:true */                                                                                               // 21
		window["Sortable"] = factory();                                                                                     // 22
	}                                                                                                                    // 23
})(function () {                                                                                                      // 24
	"use strict";                                                                                                        // 25
                                                                                                                      // 26
	var dragEl,                                                                                                          // 27
		ghostEl,                                                                                                            // 28
		cloneEl,                                                                                                            // 29
		rootEl,                                                                                                             // 30
		nextEl,                                                                                                             // 31
                                                                                                                      // 32
		scrollEl,                                                                                                           // 33
		scrollParentEl,                                                                                                     // 34
                                                                                                                      // 35
		lastEl,                                                                                                             // 36
		lastCSS,                                                                                                            // 37
                                                                                                                      // 38
		oldIndex,                                                                                                           // 39
		newIndex,                                                                                                           // 40
                                                                                                                      // 41
		activeGroup,                                                                                                        // 42
		autoScroll = {},                                                                                                    // 43
                                                                                                                      // 44
		tapEvt,                                                                                                             // 45
		touchEvt,                                                                                                           // 46
                                                                                                                      // 47
		expando = 'Sortable' + (new Date).getTime(),                                                                        // 48
                                                                                                                      // 49
		win = window,                                                                                                       // 50
		document = win.document,                                                                                            // 51
		parseInt = win.parseInt,                                                                                            // 52
                                                                                                                      // 53
		supportDraggable = !!('draggable' in document.createElement('div')),                                                // 54
                                                                                                                      // 55
                                                                                                                      // 56
		_silent = false,                                                                                                    // 57
                                                                                                                      // 58
		_dispatchEvent = function (rootEl, name, targetEl, fromEl, startIndex, newIndex) {                                  // 59
			var evt = document.createEvent('Event');                                                                           // 60
                                                                                                                      // 61
			evt.initEvent(name, true, true);                                                                                   // 62
                                                                                                                      // 63
			evt.item = targetEl || rootEl;                                                                                     // 64
			evt.from = fromEl || rootEl;                                                                                       // 65
			evt.clone = cloneEl;                                                                                               // 66
                                                                                                                      // 67
			evt.oldIndex = startIndex;                                                                                         // 68
			evt.newIndex = newIndex;                                                                                           // 69
                                                                                                                      // 70
			rootEl.dispatchEvent(evt);                                                                                         // 71
		},                                                                                                                  // 72
                                                                                                                      // 73
		_customEvents = 'onAdd onUpdate onRemove onStart onEnd onFilter onSort'.split(' '),                                 // 74
                                                                                                                      // 75
		noop = function () {},                                                                                              // 76
                                                                                                                      // 77
		abs = Math.abs,                                                                                                     // 78
		slice = [].slice,                                                                                                   // 79
                                                                                                                      // 80
		touchDragOverListeners = [],                                                                                        // 81
                                                                                                                      // 82
		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {                      // 83
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521                                                        // 84
			if (rootEl && options.scroll) {                                                                                    // 85
				var el,                                                                                                           // 86
					rect,                                                                                                            // 87
					sens = options.scrollSensitivity,                                                                                // 88
					speed = options.scrollSpeed,                                                                                     // 89
                                                                                                                      // 90
					x = evt.clientX,                                                                                                 // 91
					y = evt.clientY,                                                                                                 // 92
                                                                                                                      // 93
					winWidth = window.innerWidth,                                                                                    // 94
					winHeight = window.innerHeight,                                                                                  // 95
                                                                                                                      // 96
					vx,                                                                                                              // 97
					vy                                                                                                               // 98
				;                                                                                                                 // 99
                                                                                                                      // 100
				// Delect scrollEl                                                                                                // 101
				if (scrollParentEl !== rootEl) {                                                                                  // 102
					scrollEl = options.scroll;                                                                                       // 103
					scrollParentEl = rootEl;                                                                                         // 104
                                                                                                                      // 105
					if (scrollEl === true) {                                                                                         // 106
						scrollEl = rootEl;                                                                                              // 107
                                                                                                                      // 108
						do {                                                                                                            // 109
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||                                                           // 110
								(scrollEl.offsetHeight < scrollEl.scrollHeight)                                                               // 111
							) {                                                                                                            // 112
								break;                                                                                                        // 113
							}                                                                                                              // 114
							/* jshint boss:true */                                                                                         // 115
						} while (scrollEl = scrollEl.parentNode);                                                                       // 116
					}                                                                                                                // 117
				}                                                                                                                 // 118
                                                                                                                      // 119
				if (scrollEl) {                                                                                                   // 120
					el = scrollEl;                                                                                                   // 121
					rect = scrollEl.getBoundingClientRect();                                                                         // 122
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);                                               // 123
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);                                               // 124
				}                                                                                                                 // 125
                                                                                                                      // 126
                                                                                                                      // 127
				if (!(vx || vy)) {                                                                                                // 128
					vx = (winWidth - x <= sens) - (x <= sens);                                                                       // 129
					vy = (winHeight - y <= sens) - (y <= sens);                                                                      // 130
                                                                                                                      // 131
					/* jshint expr:true */                                                                                           // 132
					(vx || vy) && (el = win);                                                                                        // 133
				}                                                                                                                 // 134
                                                                                                                      // 135
                                                                                                                      // 136
				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {                                       // 137
					autoScroll.el = el;                                                                                              // 138
					autoScroll.vx = vx;                                                                                              // 139
					autoScroll.vy = vy;                                                                                              // 140
                                                                                                                      // 141
					clearInterval(autoScroll.pid);                                                                                   // 142
                                                                                                                      // 143
					if (el) {                                                                                                        // 144
						autoScroll.pid = setInterval(function () {                                                                      // 145
							if (el === win) {                                                                                              // 146
								win.scrollTo(win.scrollX + vx * speed, win.scrollY + vy * speed);                                             // 147
							} else {                                                                                                       // 148
								vy && (el.scrollTop += vy * speed);                                                                           // 149
								vx && (el.scrollLeft += vx * speed);                                                                          // 150
							}                                                                                                              // 151
						}, 24);                                                                                                         // 152
					}                                                                                                                // 153
				}                                                                                                                 // 154
			}                                                                                                                  // 155
		}, 30)                                                                                                              // 156
	;                                                                                                                    // 157
                                                                                                                      // 158
                                                                                                                      // 159
                                                                                                                      // 160
	/**                                                                                                                  // 161
	 * @class  Sortable                                                                                                  // 162
	 * @param  {HTMLElement}  el                                                                                         // 163
	 * @param  {Object}       [options]                                                                                  // 164
	 */                                                                                                                  // 165
	function Sortable(el, options) {                                                                                     // 166
		this.el = el; // root element                                                                                       // 167
		this.options = options = (options || {});                                                                           // 168
                                                                                                                      // 169
                                                                                                                      // 170
		// Default options                                                                                                  // 171
		var defaults = {                                                                                                    // 172
			group: Math.random(),                                                                                              // 173
			sort: true,                                                                                                        // 174
			disabled: false,                                                                                                   // 175
			store: null,                                                                                                       // 176
			handle: null,                                                                                                      // 177
			scroll: true,                                                                                                      // 178
			scrollSensitivity: 30,                                                                                             // 179
			scrollSpeed: 10,                                                                                                   // 180
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',                                                               // 181
			ghostClass: 'sortable-ghost',                                                                                      // 182
			ignore: 'a, img',                                                                                                  // 183
			filter: null,                                                                                                      // 184
			animation: 0,                                                                                                      // 185
			setData: function (dataTransfer, dragEl) {                                                                         // 186
				dataTransfer.setData('Text', dragEl.textContent);                                                                 // 187
			},                                                                                                                 // 188
			dropBubble: false,                                                                                                 // 189
			dragoverBubble: false                                                                                              // 190
		};                                                                                                                  // 191
                                                                                                                      // 192
                                                                                                                      // 193
		// Set default options                                                                                              // 194
		for (var name in defaults) {                                                                                        // 195
			!(name in options) && (options[name] = defaults[name]);                                                            // 196
		}                                                                                                                   // 197
                                                                                                                      // 198
                                                                                                                      // 199
		var group = options.group;                                                                                          // 200
                                                                                                                      // 201
		if (!group || typeof group != 'object') {                                                                           // 202
			group = options.group = { name: group };                                                                           // 203
		}                                                                                                                   // 204
                                                                                                                      // 205
                                                                                                                      // 206
		['pull', 'put'].forEach(function (key) {                                                                            // 207
			if (!(key in group)) {                                                                                             // 208
				group[key] = true;                                                                                                // 209
			}                                                                                                                  // 210
		});                                                                                                                 // 211
                                                                                                                      // 212
                                                                                                                      // 213
		// Define events                                                                                                    // 214
		_customEvents.forEach(function (name) {                                                                             // 215
			options[name] = _bind(this, options[name] || noop);                                                                // 216
			_on(el, name.substr(2).toLowerCase(), options[name]);                                                              // 217
		}, this);                                                                                                           // 218
                                                                                                                      // 219
                                                                                                                      // 220
		// Export options                                                                                                   // 221
		options.groups = ' ' + group.name + (group.put.join ? ' ' + group.put.join(' ') : '') + ' ';                        // 222
		el[expando] = options;                                                                                              // 223
                                                                                                                      // 224
                                                                                                                      // 225
		// Bind all private methods                                                                                         // 226
		for (var fn in this) {                                                                                              // 227
			if (fn.charAt(0) === '_') {                                                                                        // 228
				this[fn] = _bind(this, this[fn]);                                                                                 // 229
			}                                                                                                                  // 230
		}                                                                                                                   // 231
                                                                                                                      // 232
                                                                                                                      // 233
		// Bind events                                                                                                      // 234
		_on(el, 'mousedown', this._onTapStart);                                                                             // 235
		_on(el, 'touchstart', this._onTapStart);                                                                            // 236
                                                                                                                      // 237
		_on(el, 'dragover', this);                                                                                          // 238
		_on(el, 'dragenter', this);                                                                                         // 239
                                                                                                                      // 240
		touchDragOverListeners.push(this._onDragOver);                                                                      // 241
                                                                                                                      // 242
		// Restore sorting                                                                                                  // 243
		options.store && this.sort(options.store.get(this));                                                                // 244
	}                                                                                                                    // 245
                                                                                                                      // 246
                                                                                                                      // 247
	Sortable.prototype = /** @lends Sortable.prototype */ {                                                              // 248
		constructor: Sortable,                                                                                              // 249
                                                                                                                      // 250
                                                                                                                      // 251
		_dragStarted: function () {                                                                                         // 252
			if (rootEl && dragEl) {                                                                                            // 253
				// Apply effect                                                                                                   // 254
				_toggleClass(dragEl, this.options.ghostClass, true);                                                              // 255
                                                                                                                      // 256
				Sortable.active = this;                                                                                           // 257
                                                                                                                      // 258
				// Drag start event                                                                                               // 259
				_dispatchEvent(rootEl, 'start', dragEl, rootEl, oldIndex);                                                        // 260
			}                                                                                                                  // 261
		},                                                                                                                  // 262
                                                                                                                      // 263
                                                                                                                      // 264
		_onTapStart: function (/**Event|TouchEvent*/evt) {                                                                  // 265
			var type = evt.type,                                                                                               // 266
				touch = evt.touches && evt.touches[0],                                                                            // 267
				target = (touch || evt).target,                                                                                   // 268
				originalTarget = target,                                                                                          // 269
				options =  this.options,                                                                                          // 270
				el = this.el,                                                                                                     // 271
				filter = options.filter;                                                                                          // 272
                                                                                                                      // 273
			if (type === 'mousedown' && evt.button !== 0 || options.disabled) {                                                // 274
				return; // only left button or enabled                                                                            // 275
			}                                                                                                                  // 276
                                                                                                                      // 277
			target = _closest(target, options.draggable, el);                                                                  // 278
                                                                                                                      // 279
			if (!target) {                                                                                                     // 280
				return;                                                                                                           // 281
			}                                                                                                                  // 282
                                                                                                                      // 283
			// get the index of the dragged element within its parent                                                          // 284
			oldIndex = _index(target);                                                                                         // 285
                                                                                                                      // 286
			// Check filter                                                                                                    // 287
			if (typeof filter === 'function') {                                                                                // 288
				if (filter.call(this, evt, target, this)) {                                                                       // 289
					_dispatchEvent(originalTarget, 'filter', target, el, oldIndex);                                                  // 290
					evt.preventDefault();                                                                                            // 291
					return; // cancel dnd                                                                                            // 292
				}                                                                                                                 // 293
			}                                                                                                                  // 294
			else if (filter) {                                                                                                 // 295
				filter = filter.split(',').some(function (criteria) {                                                             // 296
					criteria = _closest(originalTarget, criteria.trim(), el);                                                        // 297
                                                                                                                      // 298
					if (criteria) {                                                                                                  // 299
						_dispatchEvent(criteria, 'filter', target, el, oldIndex);                                                       // 300
						return true;                                                                                                    // 301
					}                                                                                                                // 302
				});                                                                                                               // 303
                                                                                                                      // 304
				if (filter) {                                                                                                     // 305
					evt.preventDefault();                                                                                            // 306
					return; // cancel dnd                                                                                            // 307
				}                                                                                                                 // 308
			}                                                                                                                  // 309
                                                                                                                      // 310
                                                                                                                      // 311
			if (options.handle && !_closest(originalTarget, options.handle, el)) {                                             // 312
				return;                                                                                                           // 313
			}                                                                                                                  // 314
                                                                                                                      // 315
                                                                                                                      // 316
			// Prepare `dragstart`                                                                                             // 317
			if (target && !dragEl && (target.parentNode === el)) {                                                             // 318
				tapEvt = evt;                                                                                                     // 319
                                                                                                                      // 320
				rootEl = this.el;                                                                                                 // 321
				dragEl = target;                                                                                                  // 322
				nextEl = dragEl.nextSibling;                                                                                      // 323
				activeGroup = this.options.group;                                                                                 // 324
                                                                                                                      // 325
				dragEl.draggable = true;                                                                                          // 326
                                                                                                                      // 327
				// Disable "draggable"                                                                                            // 328
				options.ignore.split(',').forEach(function (criteria) {                                                           // 329
					_find(target, criteria.trim(), _disableDraggable);                                                               // 330
				});                                                                                                               // 331
                                                                                                                      // 332
				if (touch) {                                                                                                      // 333
					// Touch device support                                                                                          // 334
					tapEvt = {                                                                                                       // 335
						target: target,                                                                                                 // 336
						clientX: touch.clientX,                                                                                         // 337
						clientY: touch.clientY                                                                                          // 338
					};                                                                                                               // 339
                                                                                                                      // 340
					this._onDragStart(tapEvt, 'touch');                                                                              // 341
					evt.preventDefault();                                                                                            // 342
				}                                                                                                                 // 343
                                                                                                                      // 344
				_on(document, 'mouseup', this._onDrop);                                                                           // 345
				_on(document, 'touchend', this._onDrop);                                                                          // 346
				_on(document, 'touchcancel', this._onDrop);                                                                       // 347
                                                                                                                      // 348
				_on(dragEl, 'dragend', this);                                                                                     // 349
				_on(rootEl, 'dragstart', this._onDragStart);                                                                      // 350
                                                                                                                      // 351
				if (!supportDraggable) {                                                                                          // 352
					this._onDragStart(tapEvt, true);                                                                                 // 353
				}                                                                                                                 // 354
                                                                                                                      // 355
				try {                                                                                                             // 356
					if (document.selection) {                                                                                        // 357
						document.selection.empty();                                                                                     // 358
					} else {                                                                                                         // 359
						window.getSelection().removeAllRanges();                                                                        // 360
					}                                                                                                                // 361
				} catch (err) {                                                                                                   // 362
				}                                                                                                                 // 363
			}                                                                                                                  // 364
		},                                                                                                                  // 365
                                                                                                                      // 366
		_emulateDragOver: function () {                                                                                     // 367
			if (touchEvt) {                                                                                                    // 368
				_css(ghostEl, 'display', 'none');                                                                                 // 369
                                                                                                                      // 370
				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),                                       // 371
					parent = target,                                                                                                 // 372
					groupName = ' ' + this.options.group.name + '',                                                                  // 373
					i = touchDragOverListeners.length;                                                                               // 374
                                                                                                                      // 375
				if (parent) {                                                                                                     // 376
					do {                                                                                                             // 377
						if (parent[expando] && parent[expando].groups.indexOf(groupName) > -1) {                                        // 378
							while (i--) {                                                                                                  // 379
								touchDragOverListeners[i]({                                                                                   // 380
									clientX: touchEvt.clientX,                                                                                   // 381
									clientY: touchEvt.clientY,                                                                                   // 382
									target: target,                                                                                              // 383
									rootEl: parent                                                                                               // 384
								});                                                                                                           // 385
							}                                                                                                              // 386
                                                                                                                      // 387
							break;                                                                                                         // 388
						}                                                                                                               // 389
                                                                                                                      // 390
						target = parent; // store last element                                                                          // 391
					}                                                                                                                // 392
					/* jshint boss:true */                                                                                           // 393
					while (parent = parent.parentNode);                                                                              // 394
				}                                                                                                                 // 395
                                                                                                                      // 396
				_css(ghostEl, 'display', '');                                                                                     // 397
			}                                                                                                                  // 398
		},                                                                                                                  // 399
                                                                                                                      // 400
                                                                                                                      // 401
		_onTouchMove: function (/**TouchEvent*/evt) {                                                                       // 402
			if (tapEvt) {                                                                                                      // 403
				var touch = evt.touches ? evt.touches[0] : evt,                                                                   // 404
					dx = touch.clientX - tapEvt.clientX,                                                                             // 405
					dy = touch.clientY - tapEvt.clientY,                                                                             // 406
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)'; // 407
                                                                                                                      // 408
				touchEvt = touch;                                                                                                 // 409
                                                                                                                      // 410
				_css(ghostEl, 'webkitTransform', translate3d);                                                                    // 411
				_css(ghostEl, 'mozTransform', translate3d);                                                                       // 412
				_css(ghostEl, 'msTransform', translate3d);                                                                        // 413
				_css(ghostEl, 'transform', translate3d);                                                                          // 414
                                                                                                                      // 415
				evt.preventDefault();                                                                                             // 416
			}                                                                                                                  // 417
		},                                                                                                                  // 418
                                                                                                                      // 419
                                                                                                                      // 420
		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {                                                   // 421
			var dataTransfer = evt.dataTransfer,                                                                               // 422
				options = this.options;                                                                                           // 423
                                                                                                                      // 424
			this._offUpEvents();                                                                                               // 425
                                                                                                                      // 426
			if (activeGroup.pull == 'clone') {                                                                                 // 427
				cloneEl = dragEl.cloneNode(true);                                                                                 // 428
				_css(cloneEl, 'display', 'none');                                                                                 // 429
				rootEl.insertBefore(cloneEl, dragEl);                                                                             // 430
			}                                                                                                                  // 431
                                                                                                                      // 432
			if (useFallback) {                                                                                                 // 433
				var rect = dragEl.getBoundingClientRect(),                                                                        // 434
					css = _css(dragEl),                                                                                              // 435
					ghostRect;                                                                                                       // 436
                                                                                                                      // 437
				ghostEl = dragEl.cloneNode(true);                                                                                 // 438
                                                                                                                      // 439
				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));                                                     // 440
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));                                                  // 441
				_css(ghostEl, 'width', rect.width);                                                                               // 442
				_css(ghostEl, 'height', rect.height);                                                                             // 443
				_css(ghostEl, 'opacity', '0.8');                                                                                  // 444
				_css(ghostEl, 'position', 'fixed');                                                                               // 445
				_css(ghostEl, 'zIndex', '100000');                                                                                // 446
                                                                                                                      // 447
				rootEl.appendChild(ghostEl);                                                                                      // 448
                                                                                                                      // 449
				// Fixing dimensions.                                                                                             // 450
				ghostRect = ghostEl.getBoundingClientRect();                                                                      // 451
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);                                                         // 452
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);                                                      // 453
                                                                                                                      // 454
				if (useFallback === 'touch') {                                                                                    // 455
					// Bind touch events                                                                                             // 456
					_on(document, 'touchmove', this._onTouchMove);                                                                   // 457
					_on(document, 'touchend', this._onDrop);                                                                         // 458
					_on(document, 'touchcancel', this._onDrop);                                                                      // 459
				} else {                                                                                                          // 460
					// Old brwoser                                                                                                   // 461
					_on(document, 'mousemove', this._onTouchMove);                                                                   // 462
					_on(document, 'mouseup', this._onDrop);                                                                          // 463
				}                                                                                                                 // 464
                                                                                                                      // 465
				this._loopId = setInterval(this._emulateDragOver, 150);                                                           // 466
			}                                                                                                                  // 467
			else {                                                                                                             // 468
				if (dataTransfer) {                                                                                               // 469
					dataTransfer.effectAllowed = 'move';                                                                             // 470
					options.setData && options.setData.call(this, dataTransfer, dragEl);                                             // 471
				}                                                                                                                 // 472
                                                                                                                      // 473
				_on(document, 'drop', this);                                                                                      // 474
			}                                                                                                                  // 475
                                                                                                                      // 476
			setTimeout(this._dragStarted, 0);                                                                                  // 477
		},                                                                                                                  // 478
                                                                                                                      // 479
		_onDragOver: function (/**Event*/evt) {                                                                             // 480
			var el = this.el,                                                                                                  // 481
				target,                                                                                                           // 482
				dragRect,                                                                                                         // 483
				revert,                                                                                                           // 484
				options = this.options,                                                                                           // 485
				group = options.group,                                                                                            // 486
				groupPut = group.put,                                                                                             // 487
				isOwner = (activeGroup === group),                                                                                // 488
				canSort = options.sort;                                                                                           // 489
                                                                                                                      // 490
			if (!dragEl) {                                                                                                     // 491
				return;                                                                                                           // 492
			}                                                                                                                  // 493
                                                                                                                      // 494
			if (evt.preventDefault !== void 0) {                                                                               // 495
				evt.preventDefault();                                                                                             // 496
				!options.dragoverBubble && evt.stopPropagation();                                                                 // 497
			}                                                                                                                  // 498
                                                                                                                      // 499
			if (activeGroup && !options.disabled &&                                                                            // 500
				(isOwner                                                                                                          // 501
					? canSort || (revert = !rootEl.contains(dragEl))                                                                 // 502
					: activeGroup.pull && groupPut && (                                                                              // 503
						(activeGroup.name === group.name) || // by Name                                                                 // 504
						(groupPut.indexOf && ~groupPut.indexOf(activeGroup.name)) // by Array                                           // 505
					)                                                                                                                // 506
				) &&                                                                                                              // 507
				(evt.rootEl === void 0 || evt.rootEl === this.el)                                                                 // 508
			) {                                                                                                                // 509
				// Smart auto-scrolling                                                                                           // 510
				_autoScroll(evt, options, this.el);                                                                               // 511
                                                                                                                      // 512
				if (_silent) {                                                                                                    // 513
					return;                                                                                                          // 514
				}                                                                                                                 // 515
                                                                                                                      // 516
				target = _closest(evt.target, options.draggable, el);                                                             // 517
				dragRect = dragEl.getBoundingClientRect();                                                                        // 518
                                                                                                                      // 519
                                                                                                                      // 520
				if (revert) {                                                                                                     // 521
					_cloneHide(true);                                                                                                // 522
                                                                                                                      // 523
					if (cloneEl || nextEl) {                                                                                         // 524
						rootEl.insertBefore(dragEl, cloneEl || nextEl);                                                                 // 525
					}                                                                                                                // 526
					else if (!canSort) {                                                                                             // 527
						rootEl.appendChild(dragEl);                                                                                     // 528
					}                                                                                                                // 529
                                                                                                                      // 530
					return;                                                                                                          // 531
				}                                                                                                                 // 532
                                                                                                                      // 533
                                                                                                                      // 534
				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||                                                 // 535
					(el === evt.target) && (target = _ghostInBottom(el, evt))                                                        // 536
				) {                                                                                                               // 537
					if (target) {                                                                                                    // 538
						if (target.animated) {                                                                                          // 539
							return;                                                                                                        // 540
						}                                                                                                               // 541
						targetRect = target.getBoundingClientRect();                                                                    // 542
					}                                                                                                                // 543
                                                                                                                      // 544
					_cloneHide(isOwner);                                                                                             // 545
                                                                                                                      // 546
					el.appendChild(dragEl);                                                                                          // 547
					this._animate(dragRect, dragEl);                                                                                 // 548
					target && this._animate(targetRect, target);                                                                     // 549
				}                                                                                                                 // 550
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {            // 551
					if (lastEl !== target) {                                                                                         // 552
						lastEl = target;                                                                                                // 553
						lastCSS = _css(target);                                                                                         // 554
					}                                                                                                                // 555
                                                                                                                      // 556
                                                                                                                      // 557
					var targetRect = target.getBoundingClientRect(),                                                                 // 558
						width = targetRect.right - targetRect.left,                                                                     // 559
						height = targetRect.bottom - targetRect.top,                                                                    // 560
						floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display),                                        // 561
						isWide = (target.offsetWidth > dragEl.offsetWidth),                                                             // 562
						isLong = (target.offsetHeight > dragEl.offsetHeight),                                                           // 563
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5, // 564
						nextSibling = target.nextElementSibling,                                                                        // 565
						after                                                                                                           // 566
					;                                                                                                                // 567
                                                                                                                      // 568
					_silent = true;                                                                                                  // 569
					setTimeout(_unsilent, 30);                                                                                       // 570
                                                                                                                      // 571
					_cloneHide(isOwner);                                                                                             // 572
                                                                                                                      // 573
					if (floating) {                                                                                                  // 574
						after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;                             // 575
					} else {                                                                                                         // 576
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;                                               // 577
					}                                                                                                                // 578
                                                                                                                      // 579
					if (after && !nextSibling) {                                                                                     // 580
						el.appendChild(dragEl);                                                                                         // 581
					} else {                                                                                                         // 582
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);                                           // 583
					}                                                                                                                // 584
                                                                                                                      // 585
					this._animate(dragRect, dragEl);                                                                                 // 586
					this._animate(targetRect, target);                                                                               // 587
				}                                                                                                                 // 588
			}                                                                                                                  // 589
		},                                                                                                                  // 590
                                                                                                                      // 591
		_animate: function (prevRect, target) {                                                                             // 592
			var ms = this.options.animation;                                                                                   // 593
                                                                                                                      // 594
			if (ms) {                                                                                                          // 595
				var currentRect = target.getBoundingClientRect();                                                                 // 596
                                                                                                                      // 597
				_css(target, 'transition', 'none');                                                                               // 598
				_css(target, 'transform', 'translate3d('                                                                          // 599
					+ (prevRect.left - currentRect.left) + 'px,'                                                                     // 600
					+ (prevRect.top - currentRect.top) + 'px,0)'                                                                     // 601
				);                                                                                                                // 602
                                                                                                                      // 603
				target.offsetWidth; // repaint                                                                                    // 604
                                                                                                                      // 605
				_css(target, 'transition', 'all ' + ms + 'ms');                                                                   // 606
				_css(target, 'transform', 'translate3d(0,0,0)');                                                                  // 607
                                                                                                                      // 608
				clearTimeout(target.animated);                                                                                    // 609
				target.animated = setTimeout(function () {                                                                        // 610
					_css(target, 'transition', '');                                                                                  // 611
					_css(target, 'transform', '');                                                                                   // 612
					target.animated = false;                                                                                         // 613
				}, ms);                                                                                                           // 614
			}                                                                                                                  // 615
		},                                                                                                                  // 616
                                                                                                                      // 617
		_offUpEvents: function () {                                                                                         // 618
			_off(document, 'mouseup', this._onDrop);                                                                           // 619
			_off(document, 'touchmove', this._onTouchMove);                                                                    // 620
			_off(document, 'touchend', this._onDrop);                                                                          // 621
			_off(document, 'touchcancel', this._onDrop);                                                                       // 622
		},                                                                                                                  // 623
                                                                                                                      // 624
		_onDrop: function (/**Event*/evt) {                                                                                 // 625
			var el = this.el,                                                                                                  // 626
				options = this.options;                                                                                           // 627
                                                                                                                      // 628
			clearInterval(this._loopId);                                                                                       // 629
			clearInterval(autoScroll.pid);                                                                                     // 630
                                                                                                                      // 631
			// Unbind events                                                                                                   // 632
			_off(document, 'drop', this);                                                                                      // 633
			_off(document, 'mousemove', this._onTouchMove);                                                                    // 634
			_off(el, 'dragstart', this._onDragStart);                                                                          // 635
                                                                                                                      // 636
			this._offUpEvents();                                                                                               // 637
                                                                                                                      // 638
			if (evt) {                                                                                                         // 639
				evt.preventDefault();                                                                                             // 640
				!options.dropBubble && evt.stopPropagation();                                                                     // 641
                                                                                                                      // 642
				ghostEl && ghostEl.parentNode.removeChild(ghostEl);                                                               // 643
                                                                                                                      // 644
				if (dragEl) {                                                                                                     // 645
					_off(dragEl, 'dragend', this);                                                                                   // 646
                                                                                                                      // 647
					_disableDraggable(dragEl);                                                                                       // 648
					_toggleClass(dragEl, this.options.ghostClass, false);                                                            // 649
                                                                                                                      // 650
					if (rootEl !== dragEl.parentNode) {                                                                              // 651
						newIndex = _index(dragEl);                                                                                      // 652
                                                                                                                      // 653
						// drag from one list and drop into another                                                                     // 654
						_dispatchEvent(dragEl.parentNode, 'sort', dragEl, rootEl, oldIndex, newIndex);                                  // 655
						_dispatchEvent(rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);                                             // 656
                                                                                                                      // 657
						// Add event                                                                                                    // 658
						_dispatchEvent(dragEl, 'add', dragEl, rootEl, oldIndex, newIndex);                                              // 659
                                                                                                                      // 660
						// Remove event                                                                                                 // 661
						_dispatchEvent(rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);                                           // 662
					}                                                                                                                // 663
					else {                                                                                                           // 664
						// Remove clone                                                                                                 // 665
						cloneEl && cloneEl.parentNode.removeChild(cloneEl);                                                             // 666
                                                                                                                      // 667
						if (dragEl.nextSibling !== nextEl) {                                                                            // 668
							// Get the index of the dragged element within its parent                                                      // 669
							newIndex = _index(dragEl);                                                                                     // 670
                                                                                                                      // 671
							// drag & drop within the same list                                                                            // 672
							_dispatchEvent(rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);                                          // 673
							_dispatchEvent(rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);                                            // 674
						}                                                                                                               // 675
					}                                                                                                                // 676
                                                                                                                      // 677
					// Drag end event                                                                                                // 678
					Sortable.active && _dispatchEvent(rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);                            // 679
				}                                                                                                                 // 680
                                                                                                                      // 681
				// Nulling                                                                                                        // 682
				rootEl =                                                                                                          // 683
				dragEl =                                                                                                          // 684
				ghostEl =                                                                                                         // 685
				nextEl =                                                                                                          // 686
				cloneEl =                                                                                                         // 687
                                                                                                                      // 688
				scrollEl =                                                                                                        // 689
				scrollParentEl =                                                                                                  // 690
                                                                                                                      // 691
				tapEvt =                                                                                                          // 692
				touchEvt =                                                                                                        // 693
                                                                                                                      // 694
				lastEl =                                                                                                          // 695
				lastCSS =                                                                                                         // 696
                                                                                                                      // 697
				activeGroup =                                                                                                     // 698
				Sortable.active = null;                                                                                           // 699
                                                                                                                      // 700
				// Save sorting                                                                                                   // 701
				this.save();                                                                                                      // 702
			}                                                                                                                  // 703
		},                                                                                                                  // 704
                                                                                                                      // 705
                                                                                                                      // 706
		handleEvent: function (/**Event*/evt) {                                                                             // 707
			var type = evt.type;                                                                                               // 708
                                                                                                                      // 709
			if (type === 'dragover' || type === 'dragenter') {                                                                 // 710
				this._onDragOver(evt);                                                                                            // 711
				_globalDragOver(evt);                                                                                             // 712
			}                                                                                                                  // 713
			else if (type === 'drop' || type === 'dragend') {                                                                  // 714
				this._onDrop(evt);                                                                                                // 715
			}                                                                                                                  // 716
		},                                                                                                                  // 717
                                                                                                                      // 718
                                                                                                                      // 719
		/**                                                                                                                 // 720
		 * Serializes the item into an array of string.                                                                     // 721
		 * @returns {String[]}                                                                                              // 722
		 */                                                                                                                 // 723
		toArray: function () {                                                                                              // 724
			var order = [],                                                                                                    // 725
				el,                                                                                                               // 726
				children = this.el.children,                                                                                      // 727
				i = 0,                                                                                                            // 728
				n = children.length;                                                                                              // 729
                                                                                                                      // 730
			for (; i < n; i++) {                                                                                               // 731
				el = children[i];                                                                                                 // 732
				if (_closest(el, this.options.draggable, this.el)) {                                                              // 733
					order.push(el.getAttribute('data-id') || _generateId(el));                                                       // 734
				}                                                                                                                 // 735
			}                                                                                                                  // 736
                                                                                                                      // 737
			return order;                                                                                                      // 738
		},                                                                                                                  // 739
                                                                                                                      // 740
                                                                                                                      // 741
		/**                                                                                                                 // 742
		 * Sorts the elements according to the array.                                                                       // 743
		 * @param  {String[]}  order  order of the items                                                                    // 744
		 */                                                                                                                 // 745
		sort: function (order) {                                                                                            // 746
			var items = {}, rootEl = this.el;                                                                                  // 747
                                                                                                                      // 748
			this.toArray().forEach(function (id, i) {                                                                          // 749
				var el = rootEl.children[i];                                                                                      // 750
                                                                                                                      // 751
				if (_closest(el, this.options.draggable, rootEl)) {                                                               // 752
					items[id] = el;                                                                                                  // 753
				}                                                                                                                 // 754
			}, this);                                                                                                          // 755
                                                                                                                      // 756
			order.forEach(function (id) {                                                                                      // 757
				if (items[id]) {                                                                                                  // 758
					rootEl.removeChild(items[id]);                                                                                   // 759
					rootEl.appendChild(items[id]);                                                                                   // 760
				}                                                                                                                 // 761
			});                                                                                                                // 762
		},                                                                                                                  // 763
                                                                                                                      // 764
                                                                                                                      // 765
		/**                                                                                                                 // 766
		 * Save the current sorting                                                                                         // 767
		 */                                                                                                                 // 768
		save: function () {                                                                                                 // 769
			var store = this.options.store;                                                                                    // 770
			store && store.set(this);                                                                                          // 771
		},                                                                                                                  // 772
                                                                                                                      // 773
                                                                                                                      // 774
		/**                                                                                                                 // 775
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el                                                                                       // 777
		 * @param   {String}       [selector]  default: `options.draggable`                                                 // 778
		 * @returns {HTMLElement|null}                                                                                      // 779
		 */                                                                                                                 // 780
		closest: function (el, selector) {                                                                                  // 781
			return _closest(el, selector || this.options.draggable, this.el);                                                  // 782
		},                                                                                                                  // 783
                                                                                                                      // 784
                                                                                                                      // 785
		/**                                                                                                                 // 786
		 * Set/get option                                                                                                   // 787
		 * @param   {string} name                                                                                           // 788
		 * @param   {*}      [value]                                                                                        // 789
		 * @returns {*}                                                                                                     // 790
		 */                                                                                                                 // 791
		option: function (name, value) {                                                                                    // 792
			var options = this.options;                                                                                        // 793
                                                                                                                      // 794
			if (value === void 0) {                                                                                            // 795
				return options[name];                                                                                             // 796
			} else {                                                                                                           // 797
				options[name] = value;                                                                                            // 798
			}                                                                                                                  // 799
		},                                                                                                                  // 800
                                                                                                                      // 801
                                                                                                                      // 802
		/**                                                                                                                 // 803
		 * Destroy                                                                                                          // 804
		 */                                                                                                                 // 805
		destroy: function () {                                                                                              // 806
			var el = this.el, options = this.options;                                                                          // 807
                                                                                                                      // 808
			_customEvents.forEach(function (name) {                                                                            // 809
				_off(el, name.substr(2).toLowerCase(), options[name]);                                                            // 810
			});                                                                                                                // 811
                                                                                                                      // 812
			_off(el, 'mousedown', this._onTapStart);                                                                           // 813
			_off(el, 'touchstart', this._onTapStart);                                                                          // 814
                                                                                                                      // 815
			_off(el, 'dragover', this);                                                                                        // 816
			_off(el, 'dragenter', this);                                                                                       // 817
                                                                                                                      // 818
			//remove draggable attributes                                                                                      // 819
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {                                   // 820
				el.removeAttribute('draggable');                                                                                  // 821
			});                                                                                                                // 822
                                                                                                                      // 823
			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);                                // 824
                                                                                                                      // 825
			this._onDrop();                                                                                                    // 826
                                                                                                                      // 827
			this.el = null;                                                                                                    // 828
		}                                                                                                                   // 829
	};                                                                                                                   // 830
                                                                                                                      // 831
                                                                                                                      // 832
	function _cloneHide(state) {                                                                                         // 833
		if (cloneEl && (cloneEl.state !== state)) {                                                                         // 834
			_css(cloneEl, 'display', state ? 'none' : '');                                                                     // 835
			!state && cloneEl.state && rootEl.insertBefore(cloneEl, dragEl);                                                   // 836
			cloneEl.state = state;                                                                                             // 837
		}                                                                                                                   // 838
	}                                                                                                                    // 839
                                                                                                                      // 840
                                                                                                                      // 841
	function _bind(ctx, fn) {                                                                                            // 842
		var args = slice.call(arguments, 2);                                                                                // 843
		return	fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function () {                                              // 844
			return fn.apply(ctx, args.concat(slice.call(arguments)));                                                          // 845
		};                                                                                                                  // 846
	}                                                                                                                    // 847
                                                                                                                      // 848
                                                                                                                      // 849
	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {                                    // 850
		if (el) {                                                                                                           // 851
			ctx = ctx || document;                                                                                             // 852
			selector = selector.split('.');                                                                                    // 853
                                                                                                                      // 854
			var tag = selector.shift().toUpperCase(),                                                                          // 855
				re = new RegExp('\\s(' + selector.join('|') + ')\\s', 'g');                                                       // 856
                                                                                                                      // 857
			do {                                                                                                               // 858
				if (                                                                                                              // 859
					(tag === '>*' && el.parentNode === ctx) || (                                                                     // 860
						(tag === '' || el.nodeName.toUpperCase() == tag) &&                                                             // 861
						(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)                    // 862
					)                                                                                                                // 863
				) {                                                                                                               // 864
					return el;                                                                                                       // 865
				}                                                                                                                 // 866
			}                                                                                                                  // 867
			while (el !== ctx && (el = el.parentNode));                                                                        // 868
		}                                                                                                                   // 869
                                                                                                                      // 870
		return null;                                                                                                        // 871
	}                                                                                                                    // 872
                                                                                                                      // 873
                                                                                                                      // 874
	function _globalDragOver(/**Event*/evt) {                                                                            // 875
		evt.dataTransfer.dropEffect = 'move';                                                                               // 876
		evt.preventDefault();                                                                                               // 877
	}                                                                                                                    // 878
                                                                                                                      // 879
                                                                                                                      // 880
	function _on(el, event, fn) {                                                                                        // 881
		el.addEventListener(event, fn, false);                                                                              // 882
	}                                                                                                                    // 883
                                                                                                                      // 884
                                                                                                                      // 885
	function _off(el, event, fn) {                                                                                       // 886
		el.removeEventListener(event, fn, false);                                                                           // 887
	}                                                                                                                    // 888
                                                                                                                      // 889
                                                                                                                      // 890
	function _toggleClass(el, name, state) {                                                                             // 891
		if (el) {                                                                                                           // 892
			if (el.classList) {                                                                                                // 893
				el.classList[state ? 'add' : 'remove'](name);                                                                     // 894
			}                                                                                                                  // 895
			else {                                                                                                             // 896
				var className = (' ' + el.className + ' ').replace(/\s+/g, ' ').replace(' ' + name + ' ', '');                    // 897
				el.className = className + (state ? ' ' + name : '');                                                             // 898
			}                                                                                                                  // 899
		}                                                                                                                   // 900
	}                                                                                                                    // 901
                                                                                                                      // 902
                                                                                                                      // 903
	function _css(el, prop, val) {                                                                                       // 904
		var style = el && el.style;                                                                                         // 905
                                                                                                                      // 906
		if (style) {                                                                                                        // 907
			if (val === void 0) {                                                                                              // 908
				if (document.defaultView && document.defaultView.getComputedStyle) {                                              // 909
					val = document.defaultView.getComputedStyle(el, '');                                                             // 910
				}                                                                                                                 // 911
				else if (el.currentStyle) {                                                                                       // 912
					val = el.currentStyle;                                                                                           // 913
				}                                                                                                                 // 914
                                                                                                                      // 915
				return prop === void 0 ? val : val[prop];                                                                         // 916
			}                                                                                                                  // 917
			else {                                                                                                             // 918
				if (!(prop in style)) {                                                                                           // 919
					prop = '-webkit-' + prop;                                                                                        // 920
				}                                                                                                                 // 921
                                                                                                                      // 922
				style[prop] = val + (typeof val === 'string' ? '' : 'px');                                                        // 923
			}                                                                                                                  // 924
		}                                                                                                                   // 925
	}                                                                                                                    // 926
                                                                                                                      // 927
                                                                                                                      // 928
	function _find(ctx, tagName, iterator) {                                                                             // 929
		if (ctx) {                                                                                                          // 930
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;                                              // 931
                                                                                                                      // 932
			if (iterator) {                                                                                                    // 933
				for (; i < n; i++) {                                                                                              // 934
					iterator(list[i], i);                                                                                            // 935
				}                                                                                                                 // 936
			}                                                                                                                  // 937
                                                                                                                      // 938
			return list;                                                                                                       // 939
		}                                                                                                                   // 940
                                                                                                                      // 941
		return [];                                                                                                          // 942
	}                                                                                                                    // 943
                                                                                                                      // 944
                                                                                                                      // 945
	function _disableDraggable(el) {                                                                                     // 946
		el.draggable = false;                                                                                               // 947
	}                                                                                                                    // 948
                                                                                                                      // 949
                                                                                                                      // 950
	function _unsilent() {                                                                                               // 951
		_silent = false;                                                                                                    // 952
	}                                                                                                                    // 953
                                                                                                                      // 954
                                                                                                                      // 955
	/** @returns {HTMLElement|false} */                                                                                  // 956
	function _ghostInBottom(el, evt) {                                                                                   // 957
		var lastEl = el.lastElementChild, rect = lastEl.getBoundingClientRect();                                            // 958
		return (evt.clientY - (rect.top + rect.height) > 5) && lastEl; // min delta                                         // 959
	}                                                                                                                    // 960
                                                                                                                      // 961
                                                                                                                      // 962
	/**                                                                                                                  // 963
	 * Generate id                                                                                                       // 964
	 * @param   {HTMLElement} el                                                                                         // 965
	 * @returns {String}                                                                                                 // 966
	 * @private                                                                                                          // 967
	 */                                                                                                                  // 968
	function _generateId(el) {                                                                                           // 969
		var str = el.tagName + el.className + el.src + el.href + el.textContent,                                            // 970
			i = str.length,                                                                                                    // 971
			sum = 0;                                                                                                           // 972
                                                                                                                      // 973
		while (i--) {                                                                                                       // 974
			sum += str.charCodeAt(i);                                                                                          // 975
		}                                                                                                                   // 976
                                                                                                                      // 977
		return sum.toString(36);                                                                                            // 978
	}                                                                                                                    // 979
                                                                                                                      // 980
	/**                                                                                                                  // 981
	 * Returns the index of an element within its parent                                                                 // 982
	 * @param el                                                                                                         // 983
	 * @returns {number}                                                                                                 // 984
	 * @private                                                                                                          // 985
	 */                                                                                                                  // 986
	function _index(/**HTMLElement*/el) {                                                                                // 987
		var index = 0;                                                                                                      // 988
		while (el && (el = el.previousElementSibling)) {                                                                    // 989
			if (el.nodeName.toUpperCase() !== 'TEMPLATE') {                                                                    // 990
				index++;                                                                                                          // 991
			}                                                                                                                  // 992
		}                                                                                                                   // 993
		return index;                                                                                                       // 994
	}                                                                                                                    // 995
                                                                                                                      // 996
	function _throttle(callback, ms) {                                                                                   // 997
		var args, _this;                                                                                                    // 998
                                                                                                                      // 999
		return function () {                                                                                                // 1000
			if (args === void 0) {                                                                                             // 1001
				args = arguments;                                                                                                 // 1002
				_this = this;                                                                                                     // 1003
                                                                                                                      // 1004
				setTimeout(function () {                                                                                          // 1005
					if (args.length === 1) {                                                                                         // 1006
						callback.call(_this, args[0]);                                                                                  // 1007
					} else {                                                                                                         // 1008
						callback.apply(_this, args);                                                                                    // 1009
					}                                                                                                                // 1010
                                                                                                                      // 1011
					args = void 0;                                                                                                   // 1012
				}, ms);                                                                                                           // 1013
			}                                                                                                                  // 1014
		};                                                                                                                  // 1015
	}                                                                                                                    // 1016
                                                                                                                      // 1017
                                                                                                                      // 1018
	// Export utils                                                                                                      // 1019
	Sortable.utils = {                                                                                                   // 1020
		on: _on,                                                                                                            // 1021
		off: _off,                                                                                                          // 1022
		css: _css,                                                                                                          // 1023
		find: _find,                                                                                                        // 1024
		bind: _bind,                                                                                                        // 1025
		is: function (el, selector) {                                                                                       // 1026
			return !!_closest(el, selector, el);                                                                               // 1027
		},                                                                                                                  // 1028
		throttle: _throttle,                                                                                                // 1029
		closest: _closest,                                                                                                  // 1030
		toggleClass: _toggleClass,                                                                                          // 1031
		dispatchEvent: _dispatchEvent,                                                                                      // 1032
		index: _index                                                                                                       // 1033
	};                                                                                                                   // 1034
                                                                                                                      // 1035
                                                                                                                      // 1036
	Sortable.version = '1.1.1';                                                                                          // 1037
                                                                                                                      // 1038
                                                                                                                      // 1039
	/**                                                                                                                  // 1040
	 * Create sortable instance                                                                                          // 1041
	 * @param {HTMLElement}  el                                                                                          // 1042
	 * @param {Object}      [options]                                                                                    // 1043
	 */                                                                                                                  // 1044
	Sortable.create = function (el, options) {                                                                           // 1045
		return new Sortable(el, options);                                                                                   // 1046
	};                                                                                                                   // 1047
                                                                                                                      // 1048
	// Export                                                                                                            // 1049
	return Sortable;                                                                                                     // 1050
});                                                                                                                   // 1051
                                                                                                                      // 1052
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rubaxa:sortable/meteor/template.template.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("sortable");                                                                                     // 2
Template["sortable"] = new Template("Template.sortable", (function() {                                                // 3
  var view = this;                                                                                                    // 4
  return Blaze.Each(function() {                                                                                      // 5
    return Spacebars.call(view.lookup("items"));                                                                      // 6
  }, function() {                                                                                                     // 7
    return [ "\n		", Blaze._InOuterTemplateScope(view, function() {                                                   // 8
      return Blaze._TemplateWith(function() {                                                                         // 9
        return Spacebars.call(view.lookup("."));                                                                      // 10
      }, function() {                                                                                                 // 11
        return Spacebars.include(function() {                                                                         // 12
          return Spacebars.call(view.templateContentBlock);                                                           // 13
        });                                                                                                           // 14
      });                                                                                                             // 15
    }), "\n	" ];                                                                                                      // 16
  });                                                                                                                 // 17
}));                                                                                                                  // 18
                                                                                                                      // 19
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rubaxa:sortable/meteor/reactivize.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*                                                                                                                    // 1
Make a Sortable reactive by binding it to a Mongo.Collection.                                                         // 2
Calls `rubaxa:sortable/collection-update` on the server to update the sortField or affected records.                  // 3
                                                                                                                      // 4
TODO:                                                                                                                 // 5
  * supply consecutive values if the `order` field doesn't have any                                                   // 6
  * .get(DOMElement) - return the Sortable object of a DOMElement                                                     // 7
  * create a new _id automatically onAdd if the event.from list had pull: 'clone'                                     // 8
  * support arrays                                                                                                    // 9
    * sparse arrays                                                                                                   // 10
  * tests                                                                                                             // 11
    * drop onto existing empty lists                                                                                  // 12
    * insert back into lists emptied by dropping                                                                      // 13
    * performance on dragging into long list at the beginning                                                         // 14
  * handle failures on Collection operations, e.g. add callback to .insert                                            // 15
  * when adding elements, update ranks just for the half closer to the start/end of the list                          // 16
  * revisit http://programmers.stackexchange.com/questions/266451/maintain-ordered-collection-by-updating-as-few-order-fields-as-possible
  * reproduce the insidious bug where the list isn't always sorted (fiddle with dragging #1 over #2, then back, then #N before #1)
                                                                                                                      // 19
 */                                                                                                                   // 20
                                                                                                                      // 21
'use strict';                                                                                                         // 22
                                                                                                                      // 23
Template.sortable.created = function () {                                                                             // 24
	var templateInstance = this;                                                                                         // 25
	// `this` is a template instance that can store properties of our choice - http://docs.meteor.com/#/full/template_inst
	if (templateInstance.setupDone) return;  // paranoid: only run setup once                                            // 27
	// this.data is the data context - http://docs.meteor.com/#/full/template_data                                       // 28
	// normalize all options into templateInstance.options, and remove them from .data                                   // 29
	templateInstance.options = templateInstance.data.options || {};                                                      // 30
	Object.keys(templateInstance.data).forEach(function (key) {                                                          // 31
		if (key === 'options' || key === 'items') return;                                                                   // 32
		templateInstance.options[key] = templateInstance.data[key];                                                         // 33
		delete templateInstance.data[key];                                                                                  // 34
	});                                                                                                                  // 35
	templateInstance.options.sortField = templateInstance.options.sortField || 'order';                                  // 36
	// We can get the collection via the .collection property of the cursor, but changes made that way                   // 37
	// will NOT be sent to the server - https://github.com/meteor/meteor/issues/3271#issuecomment-66656257               // 38
	// Thus we need to use dburles:mongo-collection-instances to get a *real* collection                                 // 39
	if (templateInstance.data.items && templateInstance.data.items.collection) {                                         // 40
		// cursor passed via items=; its .collection works client-only and has a .name property                             // 41
		templateInstance.collectionName = templateInstance.data.items.collection.name;                                      // 42
		templateInstance.collection = Mongo.Collection.get(templateInstance.collectionName);                                // 43
	}	else if (templateInstance.data.items) {                                                                            // 44
		// collection passed via items=; does NOT have a .name property, but _name                                          // 45
		templateInstance.collection = templateInstance.data.items;                                                          // 46
		templateInstance.collectionName = templateInstance.collection._name;                                                // 47
	}	else if (templateInstance.data.collection) {                                                                       // 48
	  // cursor passed directly                                                                                          // 49
		templateInstance.collectionName = templateInstance.data.collection.name;                                            // 50
		templateInstance.collection = Mongo.Collection.get(templateInstance.collectionName);                                // 51
	} else {                                                                                                             // 52
		templateInstance.collection = templateInstance.data;  // collection passed directly                                 // 53
		templateInstance.collectionName = templateInstance.collection._name;                                                // 54
	}                                                                                                                    // 55
                                                                                                                      // 56
	// TODO if (Array.isArray(templateInstance.collection))                                                              // 57
                                                                                                                      // 58
	// What if user filters some of the items in the cursor, instead of ordering the entire collection?                  // 59
	// Use case: reorder by preference movies of a given genre, a filter within all movies.                              // 60
	// A: Modify all intervening items **that are on the client**, to preserve the overall order                         // 61
	// TODO: update *all* orders via a server method that takes not ids, but start & end elements - mild security risk   // 62
	delete templateInstance.data.options;                                                                                // 63
                                                                                                                      // 64
	/**                                                                                                                  // 65
	 * When an element was moved, adjust its orders and possibly the order of                                            // 66
	 * other elements, so as to maintain a consistent and correct order.                                                 // 67
	 *                                                                                                                   // 68
	 * There are three approaches to this:                                                                               // 69
	 * 1) Using arbitrary precision arithmetic and setting only the order of the moved                                   // 70
	 *    element to the average of the orders of the elements around it -                                               // 71
	 *    http://programmers.stackexchange.com/questions/266451/maintain-ordered-collection-by-updating-as-few-order-fields-as-possible
	 *    The downside is that the order field in the DB will increase by one byte every                                 // 73
	 *    time an element is reordered.                                                                                  // 74
	 * 2) Adjust the orders of the intervening items. This keeps the orders sane (integers)                              // 75
	 *    but is slower because we have to modify multiple documents.                                                    // 76
	 *    TODO: we may be able to update fewer records by only altering the                                              // 77
	 *    order of the records between the newIndex/oldIndex and the start/end of the list.                              // 78
	 * 3) Use regular precision arithmetic, but when the difference between the orders of the                            // 79
	 *    moved item and the one before/after it falls below a certain threshold, adjust                                 // 80
	 *    the order of that other item, and cascade doing so up or down the list.                                        // 81
	 *    This will keep the `order` field constant in size, and will only occasionally                                  // 82
	 *    require updating the `order` of other records.                                                                 // 83
	 *                                                                                                                   // 84
	 * For now, we use approach #2.                                                                                      // 85
	 *                                                                                                                   // 86
	 * @param {String} itemId - the _id of the item that was moved                                                       // 87
	 * @param {Number} orderPrevItem - the order of the item before it, or null                                          // 88
	 * @param {Number} orderNextItem - the order of the item after it, or null                                           // 89
	 */                                                                                                                  // 90
	templateInstance.adjustOrders = function adjustOrders(itemId, orderPrevItem, orderNextItem) {                        // 91
		var orderField = templateInstance.options.sortField;                                                                // 92
		var selector = {}, modifier = {$set: {}};                                                                           // 93
		var ids = [];                                                                                                       // 94
		var startOrder = templateInstance.collection.findOne(itemId)[orderField];                                           // 95
		if (orderPrevItem !== null) {                                                                                       // 96
			// Element has a previous sibling, therefore it was moved down in the list.                                        // 97
			// Decrease the order of intervening elements.                                                                     // 98
			selector[orderField] = {$lte: orderPrevItem, $gt: startOrder};                                                     // 99
			ids = _.pluck(templateInstance.collection.find(selector, {fields: {_id: 1}}).fetch(), '_id');                      // 100
			Meteor.call('rubaxa:sortable/collection-update', templateInstance.collectionName, ids, orderField, -1);            // 101
                                                                                                                      // 102
			// Set the order of the dropped element to the order of its predecessor, whose order was decreased                 // 103
			modifier.$set[orderField] = orderPrevItem;                                                                         // 104
		} else {                                                                                                            // 105
			// element moved up the list, increase order of intervening elements                                               // 106
			selector[orderField] = {$gte: orderNextItem, $lt: startOrder};                                                     // 107
			ids = _.pluck(templateInstance.collection.find(selector, {fields: {_id: 1}}).fetch(), '_id');                      // 108
			Meteor.call('rubaxa:sortable/collection-update', templateInstance.collectionName, ids, orderField, 1);             // 109
                                                                                                                      // 110
			// Set the order of the dropped element to the order of its successor, whose order was increased                   // 111
			modifier.$set[orderField] = orderNextItem;                                                                         // 112
		}                                                                                                                   // 113
		templateInstance.collection.update(itemId, modifier);                                                               // 114
	};                                                                                                                   // 115
                                                                                                                      // 116
	templateInstance.setupDone = true;                                                                                   // 117
};                                                                                                                    // 118
                                                                                                                      // 119
                                                                                                                      // 120
Template.sortable.rendered = function () {                                                                            // 121
  var templateInstance = this;                                                                                        // 122
	var orderField = templateInstance.options.sortField;                                                                 // 123
                                                                                                                      // 124
	// sorting was changed within the list                                                                               // 125
	var optionsOnUpdate = templateInstance.options.onUpdate;                                                             // 126
	templateInstance.options.onUpdate = function sortableUpdate(/**Event*/event) {                                       // 127
		var itemEl = event.item;  // dragged HTMLElement                                                                    // 128
		event.data = Blaze.getData(itemEl);                                                                                 // 129
		if (event.newIndex < event.oldIndex) {                                                                              // 130
			// Element moved up in the list. The dropped element has a next sibling for sure.                                  // 131
			var orderNextItem = Blaze.getData(itemEl.nextElementSibling)[orderField];                                          // 132
			templateInstance.adjustOrders(event.data._id, null, orderNextItem);                                                // 133
		} else if (event.newIndex > event.oldIndex) {                                                                       // 134
			// Element moved down in the list. The dropped element has a previous sibling for sure.                            // 135
			var orderPrevItem = Blaze.getData(itemEl.previousElementSibling)[orderField];                                      // 136
			templateInstance.adjustOrders(event.data._id, orderPrevItem, null);                                                // 137
		} else {                                                                                                            // 138
			// do nothing - drag and drop in the same location                                                                 // 139
		}                                                                                                                   // 140
		if (optionsOnUpdate) optionsOnUpdate(event);                                                                        // 141
	};                                                                                                                   // 142
                                                                                                                      // 143
	// element was added from another list                                                                               // 144
	var optionsOnAdd = templateInstance.options.onAdd;                                                                   // 145
	templateInstance.options.onAdd = function sortableAdd(/**Event*/event) {                                             // 146
		var itemEl = event.item;  // dragged HTMLElement                                                                    // 147
		event.data = Blaze.getData(itemEl);                                                                                 // 148
		// let the user decorate the object with additional properties before insertion                                     // 149
		if (optionsOnAdd) optionsOnAdd(event);                                                                              // 150
                                                                                                                      // 151
		// Insert the new element at the end of the list and move it where it was dropped.                                  // 152
		// We could insert it at the beginning, but that would lead to negative orders.                                     // 153
		var sortSpecifier = {}; sortSpecifier[orderField] = -1;                                                             // 154
		event.data.order = templateInstance.collection.findOne({}, { sort: sortSpecifier, limit: 1 }).order + 1;            // 155
		// TODO: this can obviously be optimized by setting the order directly as the arithmetic average, with the caveats described above
		var newElementId = templateInstance.collection.insert(event.data);                                                  // 157
		event.data._id = newElementId;                                                                                      // 158
		if (itemEl.nextElementSibling) {                                                                                    // 159
			var orderNextItem = Blaze.getData(itemEl.nextElementSibling)[orderField];                                          // 160
			templateInstance.adjustOrders(newElementId, null, orderNextItem);                                                  // 161
		} else {                                                                                                            // 162
			// do nothing - inserted after the last element                                                                    // 163
		}                                                                                                                   // 164
		// remove the dropped HTMLElement from the list because we have inserted it in the collection, which will update the template
		itemEl.parentElement.removeChild(itemEl);                                                                           // 166
	};                                                                                                                   // 167
                                                                                                                      // 168
	// element was removed by dragging into another list                                                                 // 169
	var optionsOnRemove = templateInstance.options.onRemove;                                                             // 170
	templateInstance.options.onRemove = function sortableRemove(/**Event*/event) {                                       // 171
		var itemEl = event.item;  // dragged HTMLElement                                                                    // 172
		event.data = Blaze.getData(itemEl);                                                                                 // 173
		// don't remove from the collection if group.pull is clone or false                                                 // 174
		if (typeof templateInstance.options.group === 'undefined'                                                           // 175
				|| typeof templateInstance.options.group.pull === 'undefined'                                                     // 176
				|| templateInstance.options.group.pull === true                                                                   // 177
		) templateInstance.collection.remove(event.data._id);                                                               // 178
		if (optionsOnRemove) optionsOnRemove(event);                                                                        // 179
	};                                                                                                                   // 180
                                                                                                                      // 181
	// just compute the `data` context                                                                                   // 182
	['onStart', 'onEnd', 'onSort', 'onFilter'].forEach(function (eventHandler) {                                         // 183
		if (templateInstance.options[eventHandler]) {                                                                       // 184
			var userEventHandler = templateInstance.options[eventHandler];                                                     // 185
			templateInstance.options[eventHandler] = function (/**Event*/event) {                                              // 186
				var itemEl = event.item;  // dragged HTMLElement                                                                  // 187
				event.data = Blaze.getData(itemEl);                                                                               // 188
				userEventHandler(event);                                                                                          // 189
			};                                                                                                                 // 190
		}                                                                                                                   // 191
	});                                                                                                                  // 192
                                                                                                                      // 193
	templateInstance.sortable = Sortable.create(templateInstance.firstNode.parentElement, templateInstance.options);     // 194
	// TODO make the object accessible, e.g. via Sortable.getSortableById() or some such                                 // 195
};                                                                                                                    // 196
                                                                                                                      // 197
                                                                                                                      // 198
Template.sortable.destroyed = function () {                                                                           // 199
	this.sortable.destroy();                                                                                             // 200
};                                                                                                                    // 201
                                                                                                                      // 202
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rubaxa:sortable/meteor/methods.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
'use strict';                                                                                                         // 1
                                                                                                                      // 2
Meteor.methods({                                                                                                      // 3
	/**                                                                                                                  // 4
	 * Update the orderField of documents with given ids in a collection, incrementing it by incDec                      // 5
	 * @param {String} collectionName - name of the collection to update                                                 // 6
	 * @param {String[]} ids - array of document ids                                                                     // 7
	 * @param {String} orderField - the name of the order field, usually "order"                                         // 8
	 * @param {Number} incDec - pass 1 or -1                                                                             // 9
	 */                                                                                                                  // 10
	'rubaxa:sortable/collection-update': function (collectionName, ids, orderField, incDec) {                            // 11
		check(collectionName, String);                                                                                      // 12
		check(ids, [String]);                                                                                               // 13
		check(orderField, String);                                                                                          // 14
		check(incDec, Number);                                                                                              // 15
		var selector = {_id: {$in: ids}}, modifier = {$inc: {}};                                                            // 16
		modifier.$inc[orderField] = incDec;                                                                                 // 17
		Mongo.Collection.get(collectionName).update(selector, modifier, {multi: true});                                     // 18
	}                                                                                                                    // 19
});                                                                                                                   // 20
                                                                                                                      // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rubaxa:sortable'] = {
  Sortable: Sortable
};

})();

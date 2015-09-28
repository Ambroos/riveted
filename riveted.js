/*!
 * riveted.js | v0.8.0
 * Copyright (c) 2015 Rob Flaherty (@robflaherty)
 * Licensed under the MIT license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["riveted"] = factory();
	else
		root["riveted"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck = __webpack_require__(2)['default'];

	var _interopRequireDefault = __webpack_require__(3)['default'];

	exports.__esModule = true;

	var _lodashFunctionThrottle = __webpack_require__(6);

	var _lodashFunctionThrottle2 = _interopRequireDefault(_lodashFunctionThrottle);

	/*!
	 * @preserve
	 * riveted.js | v0.8.0
	 * Copyright (c) 2015 Rob Flaherty (@robflaherty)
	 * Licensed under the MIT license
	 */

	var Riveted = (function () {
	    function Riveted() {
	        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        _classCallCheck(this, Riveted);

	        this.nonInteraction = true;
	        this.started = false;
	        this.stopped = false;
	        this.turnedOff = false;
	        this.clockTime = 0;
	        this.startTime = new Date();
	        this.clockTimer = null;
	        this.idleTimer = null;
	        this.universalGA = false;
	        this.classicGA = false;
	        this.universalSendCommand = 'send';
	        this.googleTagManager = false;
	        var _opts$reportInterval = opts.reportInterval;
	        var reportInterval = _opts$reportInterval === undefined ? 5 : _opts$reportInterval;
	        var _opts$idleTimeout = opts.idleTimeout;
	        var idleTimeout = _opts$idleTimeout === undefined ? 30 : _opts$idleTimeout;
	        var _opts$gaGlobal = opts.gaGlobal;
	        var gaGlobal = _opts$gaGlobal === undefined ? 'ga' : _opts$gaGlobal;
	        var _opts$nonInteraction = opts.nonInteraction;
	        var nonInteraction = _opts$nonInteraction === undefined ? true : _opts$nonInteraction;
	        var _opts$gaTracker = opts.gaTracker;
	        var gaTracker = _opts$gaTracker === undefined ? false : _opts$gaTracker;
	        var _opts$eventHandler = opts.eventHandler;
	        var eventHandler = _opts$eventHandler === undefined ? false : _opts$eventHandler;
	        var _opts$userTimingHandler = opts.userTimingHandler;
	        var userTimingHandler = _opts$userTimingHandler === undefined ? false : _opts$userTimingHandler;

	        this.reportInterval = parseInt(reportInterval, 10);
	        this.idleTimeout = parseInt(idleTimeout, 10);
	        this.gaGlobal = gaGlobal;

	        /*
	         * Determine which version of GA is being used
	         * 'ga', '_gaq', and 'dataLayer' are the possible globals
	         */

	        if (typeof window[this.gaGlobal] === 'function') {
	            this.universalGA = true;
	        }

	        if (typeof window._gaq !== 'undefined' && typeof window._gaq.push === 'function') {
	            this.classicGA = true;
	        }

	        if (typeof window.dataLayer !== 'undefined' && typeof window.dataLayer.push === 'function') {
	            this.googleTagManager = true;
	        }

	        if (gaTracker && typeof gaTracker === 'string') {
	            this.universalSendCommand = gaTracker + '.send';
	        }

	        if (eventHandler && typeof eventHandler === 'function') {
	            this.sendEvent = eventHandler;
	        }

	        if (userTimingHandler && typeof userTimingHandler === 'function') {
	            this.sendUserTiming = userTimingHandler;
	        }

	        if (nonInteraction === false || nonInteraction === 'false') {
	            this.nonInteraction = false;
	        } else {
	            this.nonInteraction = true;
	        }

	        // Basic activity event listeners
	        this.addListener(document, 'keydown', this.trigger.bind(this));
	        this.addListener(document, 'click', this.trigger.bind(this));
	        this.addListener(window, 'mousemove', _lodashFunctionThrottle2['default'](this.trigger.bind(this, 500)));
	        this.addListener(window, 'scroll', _lodashFunctionThrottle2['default'](this.trigger.bind(this, 500)));

	        // Page visibility listeners
	        this.addListener(document, 'visibilitychange', this.visibilityChange.bind(this));
	        this.addListener(document, 'webkitvisibilitychange', this.visibilityChange.bind(this));
	    }

	    /*
	     * Cross-browser event listening
	     */

	    Riveted.prototype.addListener = function addListener(element, eventName, handler) {
	        if (element.addEventListener) {
	            element.addEventListener(eventName, handler, false);
	        } else if (element.attachEvent) {
	            element.attachEvent('on' + eventName, handler);
	        } else {
	            element['on' + eventName] = handler;
	        }
	    };

	    /*
	     * Function for logging User Timing event on initial interaction
	     */

	    Riveted.prototype.sendUserTiming = function sendUserTiming(timingValue) {
	        if (this.googleTagManager) {
	            window.dataLayer.push({
	                'event': 'RivetedTiming',
	                'eventCategory': 'Riveted',
	                'timingVar': 'First Interaction',
	                'timingValue': timingValue
	            });
	        } else {
	            if (this.universalGA) {
	                window[this.gaGlobal](this.universalSendCommand, 'timing', 'Riveted', 'First Interaction', timingValue);
	            }

	            if (this.classicGA) {
	                window._gaq.push(['_trackTiming', 'Riveted', 'First Interaction', timingValue, null, 100]);
	            }
	        }
	    };

	    /*
	     * Function for logging ping events
	     */

	    Riveted.prototype.sendEvent = function sendEvent(time) {
	        if (this.googleTagManager) {
	            window.dataLayer.push({
	                'event': 'Riveted',
	                'eventCategory': 'Riveted',
	                'eventAction': 'Time Spent',
	                'eventLabel': time,
	                'eventValue': this.reportInterval,
	                'eventNonInteraction': this.nonInteraction });
	        } else {
	            if (this.universalGA) {
	                window[this.gaGlobal](this.universalSendCommand, 'event', 'Riveted', 'Time Spent', time.toString(), this.reportInterval, { 'nonInteraction': this.nonInteraction });
	            }

	            if (this.classicGA) {
	                window._gaq.push(['_trackEvent', 'Riveted', 'Time Spent', time.toString(), this.reportInterval, this.nonInteraction]);
	            }
	        }
	    };

	    Riveted.prototype.setIdle = function setIdle() {
	        clearTimeout(this.idleTimer);
	        this.stopClock();
	    };

	    Riveted.prototype.visibilityChange = function visibilityChange() {
	        if (document.hidden || document.webkitHidden) {
	            this.setIdle();
	        }
	    };

	    Riveted.prototype.clock = function clock() {
	        this.clockTime += 1;
	        if (this.clockTime > 0 && this.clockTime % this.reportInterval === 0) {
	            this.sendEvent(this.clockTime);
	        }
	    };

	    Riveted.prototype.stopClock = function stopClock() {
	        this.stopped = true;
	        clearTimeout(this.clockTimer);
	    };

	    Riveted.prototype.off = function off() {
	        this.setIdle();
	        this.turnedOff = true;
	    };

	    Riveted.prototype.on = function on() {
	        this.turnedOff = false;
	    };

	    Riveted.prototype.restartClock = function restartClock() {
	        this.stopped = false;
	        clearTimeout(this.clockTimer);
	        this.clockTimer = setInterval(this.clock.bind(this), 1000);
	    };

	    Riveted.prototype.startRiveted = function startRiveted() {
	        // Calculate seconds from start to first interaction
	        var currentTime = new Date();
	        var diff = currentTime - this.startTime;

	        // Set global
	        this.started = true;

	        // Send User Timing Event
	        this.sendUserTiming(diff);

	        // Start clock
	        this.clockTimer = setInterval(this.clock.bind(this), 1000);
	    };

	    Riveted.prototype.reset = function reset() {
	        this.startTime = new Date();
	        this.clockTime = 0;
	        this.started = false;
	        this.stopped = false;
	        clearTimeout(this.clockTimer);
	        clearTimeout(this.idleTimer);
	    };

	    Riveted.prototype.trigger = function trigger() {
	        var _this = this;

	        if (this.turnedOff) {
	            return;
	        }

	        if (!this.started) {
	            this.startRiveted();
	        }

	        if (this.stopped) {
	            this.restartClock();
	        }

	        clearTimeout(this.idleTimer);
	        this.idleTimer = setTimeout(function () {
	            return _this.setIdle();
	        }, this.idleTimeout * 1000 + 100);
	    };

	    return Riveted;
	})();

	exports['default'] = Riveted;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(7);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeNow = getNative(Date, 'now');

	/**
	 * Gets the number of milliseconds that have elapsed since the Unix epoch
	 * (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @category Date
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => logs the number of milliseconds it took for the deferred function to be invoked
	 */
	var now = nativeNow || function() {
	  return new Date().getTime();
	};

	module.exports = now;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(1),
	    now = __webpack_require__(4);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed invocations. Provide an options object to indicate that `func`
	 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	 * Subsequent calls to the debounced function return the result of the last
	 * `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	 *  delayed before it's invoked.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // avoid costly calculations while the window size is in flux
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // ensure `batchLog` is invoked once after 1 second of debounced calls
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', _.debounce(batchLog, 250, {
	 *   'maxWait': 1000
	 * }));
	 *
	 * // cancel a debounced call
	 * var todoChanges = _.debounce(batchLog, 1000);
	 * Object.observe(models.todo, todoChanges);
	 *
	 * Object.observe(models, function(changes) {
	 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	 *     todoChanges.cancel();
	 *   }
	 * }, ['delete']);
	 *
	 * // ...at some point `models.todo` is changed
	 * models.todo.completed = true;
	 *
	 * // ...before 1 second has passed `models.todo` is deleted
	 * // which cancels the debounced `todoChanges` call
	 * delete models.todo;
	 */
	function debounce(func, wait, options) {
	  var args,
	      maxTimeoutId,
	      result,
	      stamp,
	      thisArg,
	      timeoutId,
	      trailingCall,
	      lastCalled = 0,
	      maxWait = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = wait < 0 ? 0 : (+wait || 0);
	  if (options === true) {
	    var leading = true;
	    trailing = false;
	  } else if (isObject(options)) {
	    leading = !!options.leading;
	    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function cancel() {
	    if (timeoutId) {
	      clearTimeout(timeoutId);
	    }
	    if (maxTimeoutId) {
	      clearTimeout(maxTimeoutId);
	    }
	    lastCalled = 0;
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	  }

	  function complete(isCalled, id) {
	    if (id) {
	      clearTimeout(id);
	    }
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	    if (isCalled) {
	      lastCalled = now();
	      result = func.apply(thisArg, args);
	      if (!timeoutId && !maxTimeoutId) {
	        args = thisArg = undefined;
	      }
	    }
	  }

	  function delayed() {
	    var remaining = wait - (now() - stamp);
	    if (remaining <= 0 || remaining > wait) {
	      complete(trailingCall, maxTimeoutId);
	    } else {
	      timeoutId = setTimeout(delayed, remaining);
	    }
	  }

	  function maxDelayed() {
	    complete(trailing, timeoutId);
	  }

	  function debounced() {
	    args = arguments;
	    stamp = now();
	    thisArg = this;
	    trailingCall = trailing && (timeoutId || !leading);

	    if (maxWait === false) {
	      var leadingCall = leading && !timeoutId;
	    } else {
	      if (!maxTimeoutId && !leading) {
	        lastCalled = stamp;
	      }
	      var remaining = maxWait - (stamp - lastCalled),
	          isCalled = remaining <= 0 || remaining > maxWait;

	      if (isCalled) {
	        if (maxTimeoutId) {
	          maxTimeoutId = clearTimeout(maxTimeoutId);
	        }
	        lastCalled = stamp;
	        result = func.apply(thisArg, args);
	      }
	      else if (!maxTimeoutId) {
	        maxTimeoutId = setTimeout(maxDelayed, remaining);
	      }
	    }
	    if (isCalled && timeoutId) {
	      timeoutId = clearTimeout(timeoutId);
	    }
	    else if (!timeoutId && wait !== maxWait) {
	      timeoutId = setTimeout(delayed, wait);
	    }
	    if (leadingCall) {
	      isCalled = true;
	      result = func.apply(thisArg, args);
	    }
	    if (isCalled && !timeoutId && !maxTimeoutId) {
	      args = thisArg = undefined;
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  return debounced;
	}

	module.exports = debounce;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(5),
	    isObject = __webpack_require__(1);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed invocations. Provide an options object to indicate
	 * that `func` should be invoked on the leading and/or trailing edge of the
	 * `wait` timeout. Subsequent calls to the throttled function return the
	 * result of the last `func` call.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the the throttled function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.throttle` and `_.debounce`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to throttle.
	 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=true] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new throttled function.
	 * @example
	 *
	 * // avoid excessively updating the position while scrolling
	 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	 *
	 * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
	 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
	 *   'trailing': false
	 * }));
	 *
	 * // cancel a trailing throttled call
	 * jQuery(window).on('popstate', throttled.cancel);
	 */
	function throttle(func, wait, options) {
	  var leading = true,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  if (options === false) {
	    leading = false;
	  } else if (isObject(options)) {
	    leading = 'leading' in options ? !!options.leading : leading;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }
	  return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
	}

	module.exports = throttle;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(10);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(1);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	module.exports = isFunction;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(9),
	    isObjectLike = __webpack_require__(8);

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isNative;


/***/ }
/******/ ])
});
;
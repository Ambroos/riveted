/*!
 * @preserve
 * riveted.js | v0.1
 * Copyright (c) 2014 Rob Flaherty (@robflaherty)
 * Licensed under the MIT license
 */

var riveted = (function() {

    var started = false,
      stopped = false,
      clockTime = 0,
      startTime = new Date(),
      clockTimer = null,
      idleTimer = null,
      reportInterval,
      idleTimeout,
      nonInteraction;

    function init(options) {

      // Set up options and defaults
      options = options || {};
      reportInterval = parseInt(options.reportInterval, 10) || 5;
      idleTimeout = parseInt(options.idleTimeout, 10) || 30;
      nonInteraction = options.nonInteraction || true;

      // Basic activity event listeners
      addListener(document, 'keydown', trigger);
      addListener(document, 'click', trigger);
      addListener(window, 'mousemove', throttle(trigger, 500));
      addListener(window, 'scroll', throttle(trigger, 500));

      // Page visibility listeners
      document.addEventListener('visibilitychange', visibilityChange, false);
      document.addEventListener('webkitvisibilitychange', visibilityChange, false);
    }


    /*
     * Throttle function borrowed from:
     * Underscore.js 1.5.2
     * http://underscorejs.org
     * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * Underscore may be freely distributed under the MIT license.
     */

    function throttle(func, wait) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      var later = function() {
        previous = new Date;
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = new Date;
        if (!previous) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    }

    /*
     * Cross-browser event listening
     */

    function addListener(element, eventName, handler) {
      if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
      }
      else if (element.attachEvent) {
        element.attachEvent('on' + eventName, handler);
      }
      else {
        element['on' + eventName] = handler;
      }
    }

    /*
     * Function for logging User Timing event on initial interaction
     */

    function sendUserTiming(timingValue) {

      if (typeof(ga) !== "undefined") {
        ga('send', 'timing', 'Riveted', 'First Interaction', timingValue);
      }

      if (typeof(_gaq) !== "undefined") {
        _gaq.push(['_trackTiming', 'Riveted', 'First Interaction', timingValue, null, 100]);
      }

      if (typeof(dataLayer) !== "undefined") {
        dataLayer.push({'event':'RivetedTiming', 'eventCategory':'Riveted', 'timingVar': 'First Interaction', 'timingValue': timingValue});
      }

    }

    /*
     * Function for logging ping events
     */

    function sendEvent(time) {

      if (typeof(ga) !== "undefined") {
        ga('send', 'event', 'Riveted', 'Time Spent', time.toString(), reportInterval, {'nonInteraction': nonInteraction});
      }

      if (typeof(_gaq) !== "undefined") {
        _gaq.push(['_trackEvent', 'Riveted', 'Time Spent', time.toString(), reportInterval, nonInteraction]);
      }

      if (typeof(dataLayer) !== "undefined") {
        dataLayer.push({'event':'Riveted', 'eventCategory':'Riveted', 'eventAction': 'Time Spent', 'eventLabel': 'Seconds', 'eventValue': time, 'eventNonInteraction': nonInteraction});
      }

    }

    function setIdle() {
      clearTimeout(idleTimer);
      stopClock();
    }

    function visibilityChange() {
      if (document.hidden || document.webkitHidden) {
        setIdle();
      }
    }

    function clock() {
      clockTime += 1;
      if (clockTime > 0 && (clockTime % reportInterval === 0)) {
        sendEvent(clockTime);
      }

    }

    function stopClock() {
      stopped = true;
      clearTimeout(clockTimer);
    }

    function restartClock() {
      stopped = false;
      clearTimeout(clockTimer);
      clockTimer = setInterval(clock, 1000);
    }

    function startRiveted() {

      // Calculate seconds from start to first interaction
      var currentTime = new Date();
      var diff = currentTime - startTime;

      // Set global
      started = true;

      // Send User Timing Event
      sendUserTiming(diff);

      // Start clock
      clockTimer = setInterval(clock, 1000);

    }

    function trigger() {

      if (!started) {
        startRiveted();
      }

      if (stopped) {
        restartClock();
      }

      clearTimeout(idleTimer);
      idleTimer = setTimeout(setIdle, idleTimeout * 1000 + 100);
    }

    return {
      init: init,
      trigger: trigger,
      setIdle: setIdle,
    }

  })();
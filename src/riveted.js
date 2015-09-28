import throttle from 'lodash/function/throttle';

/*!
 * @preserve
 * riveted.js | v0.8.0
 * Copyright (c) 2015 Rob Flaherty (@robflaherty)
 * Licensed under the MIT license
 */

export default class Riveted {
    gaGlobal;
    reportInterval;
    idleTimeout;

    nonInteraction = true;

    started = false;
    stopped = false;
    turnedOff = false;
    clockTime = 0;
    startTime = new Date();
    clockTimer = null;
    idleTimer = null;

    universalGA = false;
    classicGA = false;
    universalSendCommand = 'send';
    googleTagManager = false;

    constructor(opts = {}) {
        const {
            reportInterval = 5,
            idleTimeout = 30,
            gaGlobal = 'ga',
            nonInteraction = true,
            gaTracker = false,
            eventHandler = false,
            userTimingHandler = false,
        } = opts;

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
        this.addListener(window, 'mousemove', throttle(this.trigger.bind(this, 500)));
        this.addListener(window, 'scroll', throttle(this.trigger.bind(this, 500)));

        // Page visibility listeners
        this.addListener(document, 'visibilitychange', this.visibilityChange.bind(this));
        this.addListener(document, 'webkitvisibilitychange', this.visibilityChange.bind(this));
    }

    /*
     * Cross-browser event listening
     */

    addListener(element, eventName, handler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, handler);
        } else {
            element['on' + eventName] = handler;
        }
    }

    /*
     * Function for logging User Timing event on initial interaction
     */
    sendUserTiming(timingValue) {
        if (this.googleTagManager) {
            window.dataLayer.push({
                'event': 'RivetedTiming',
                'eventCategory':
                'Riveted',
                'timingVar':
                'First Interaction',
                'timingValue': timingValue,
            });
        } else {
            if (this.universalGA) {
                window[this.gaGlobal](this.universalSendCommand, 'timing', 'Riveted', 'First Interaction', timingValue);
            }

            if (this.classicGA) {
                window._gaq.push(['_trackTiming', 'Riveted', 'First Interaction', timingValue, null, 100]);
            }
        }
    }

    /*
     * Function for logging ping events
     */

    sendEvent(time) {
        if (this.googleTagManager) {
            window.dataLayer.push({
                'event': 'Riveted',
                'eventCategory': 'Riveted',
                'eventAction': 'Time Spent',
                'eventLabel': time,
                'eventValue': this.reportInterval,
                'eventNonInteraction': this.nonInteraction});
        } else {
            if (this.universalGA) {
                window[this.gaGlobal](this.universalSendCommand, 'event', 'Riveted', 'Time Spent', time.toString(), this.reportInterval, {'nonInteraction': this.nonInteraction});
            }

            if (this.classicGA) {
                window._gaq.push(['_trackEvent', 'Riveted', 'Time Spent', time.toString(), this.reportInterval, this.nonInteraction]);
            }
        }
    }

    setIdle() {
        clearTimeout(this.idleTimer);
        this.stopClock();
    }

    visibilityChange() {
        if (document.hidden || document.webkitHidden) {
            this.setIdle();
        }
    }

    clock() {
        this.clockTime += 1;
        if (this.clockTime > 0 && (this.clockTime % this.reportInterval === 0)) {
            this.sendEvent(this.clockTime);
        }
    }

    stopClock() {
        this.stopped = true;
        clearTimeout(this.clockTimer);
    }

    off() {
        this.setIdle();
        this.turnedOff = true;
    }

    on() {
        this.turnedOff = false;
    }

    restartClock() {
        this.stopped = false;
        clearTimeout(this.clockTimer);
        this.clockTimer = setInterval(this.clock.bind(this), 1000);
    }

    startRiveted() {
        // Calculate seconds from start to first interaction
        const currentTime = new Date();
        const diff = currentTime - this.startTime;

        // Set global
        this.started = true;

        // Send User Timing Event
        this.sendUserTiming(diff);

        // Start clock
        this.clockTimer = setInterval(this.clock.bind(this), 1000);
    }

    reset() {
        this.startTime = new Date();
        this.clockTime = 0;
        this.started = false;
        this.stopped = false;
        clearTimeout(this.clockTimer);
        clearTimeout(this.idleTimer);
    }

    trigger() {
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
        this.idleTimer = setTimeout(() => this.setIdle(), this.idleTimeout * 1000 + 100);
    }
}

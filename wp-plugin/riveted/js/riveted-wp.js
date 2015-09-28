/*!
 * riveted.js | v0.8.0
 * Copyright (c) 2015 Rob Flaherty (@robflaherty)
 * Licensed under the MIT license
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.riveted=e():t.riveted=e()}(this,function(){return function(t){function e(n){if(i[n])return i[n].exports;var o=i[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){"use strict";var n=i(2).default,o=i(3),r=n(o);window.riveted=new r.default(riveted_options)},function(t,e){function i(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}t.exports=i},function(t,e){"use strict";e.default=function(t){return t&&t.__esModule?t:{default:t}},e.__esModule=!0},function(t,e,i){"use strict";var n=i(4).default,o=i(2).default;e.__esModule=!0;var r=i(7),s=o(r),a=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];n(this,t),this.nonInteraction=!0,this.started=!1,this.stopped=!1,this.turnedOff=!1,this.clockTime=0,this.startTime=new Date,this.clockTimer=null,this.idleTimer=null,this.universalGA=!1,this.classicGA=!1,this.universalSendCommand="send",this.googleTagManager=!1;var i=e.reportInterval,o=void 0===i?5:i,r=e.idleTimeout,a=void 0===r?30:r,c=e.gaGlobal,d=void 0===c?"ga":c,u=e.nonInteraction,l=void 0===u?!0:u,h=e.gaTracker,p=void 0===h?!1:h,f=e.eventHandler,v=void 0===f?!1:f,m=e.userTimingHandler,g=void 0===m?!1:m;this.reportInterval=parseInt(o,10),this.idleTimeout=parseInt(a,10),this.gaGlobal=d,"function"==typeof window[this.gaGlobal]&&(this.universalGA=!0),"undefined"!=typeof window._gaq&&"function"==typeof window._gaq.push&&(this.classicGA=!0),"undefined"!=typeof window.dataLayer&&"function"==typeof window.dataLayer.push&&(this.googleTagManager=!0),p&&"string"==typeof p&&(this.universalSendCommand=p+".send"),v&&"function"==typeof v&&(this.sendEvent=v),g&&"function"==typeof g&&(this.sendUserTiming=g),l===!1||"false"===l?this.nonInteraction=!1:this.nonInteraction=!0,this.addListener(document,"keydown",this.trigger.bind(this)),this.addListener(document,"click",this.trigger.bind(this)),this.addListener(window,"mousemove",s.default(this.trigger.bind(this,500))),this.addListener(window,"scroll",s.default(this.trigger.bind(this,500))),this.addListener(document,"visibilitychange",this.visibilityChange.bind(this)),this.addListener(document,"webkitvisibilitychange",this.visibilityChange.bind(this))}return t.prototype.addListener=function(t,e,i){t.addEventListener?t.addEventListener(e,i,!1):t.attachEvent?t.attachEvent("on"+e,i):t["on"+e]=i},t.prototype.sendUserTiming=function(t){this.googleTagManager?window.dataLayer.push({event:"RivetedTiming",eventCategory:"Riveted",timingVar:"First Interaction",timingValue:t}):(this.universalGA&&window[this.gaGlobal](this.universalSendCommand,"timing","Riveted","First Interaction",t),this.classicGA&&window._gaq.push(["_trackTiming","Riveted","First Interaction",t,null,100]))},t.prototype.sendEvent=function(t){this.googleTagManager?window.dataLayer.push({event:"Riveted",eventCategory:"Riveted",eventAction:"Time Spent",eventLabel:t,eventValue:this.reportInterval,eventNonInteraction:this.nonInteraction}):(this.universalGA&&window[this.gaGlobal](this.universalSendCommand,"event","Riveted","Time Spent",t.toString(),this.reportInterval,{nonInteraction:this.nonInteraction}),this.classicGA&&window._gaq.push(["_trackEvent","Riveted","Time Spent",t.toString(),this.reportInterval,this.nonInteraction]))},t.prototype.setIdle=function(){clearTimeout(this.idleTimer),this.stopClock()},t.prototype.visibilityChange=function(){(document.hidden||document.webkitHidden)&&this.setIdle()},t.prototype.clock=function(){this.clockTime+=1,this.clockTime>0&&this.clockTime%this.reportInterval===0&&this.sendEvent(this.clockTime)},t.prototype.stopClock=function(){this.stopped=!0,clearTimeout(this.clockTimer)},t.prototype.off=function(){this.setIdle(),this.turnedOff=!0},t.prototype.on=function(){this.turnedOff=!1},t.prototype.restartClock=function(){this.stopped=!1,clearTimeout(this.clockTimer),this.clockTimer=setInterval(this.clock.bind(this),1e3)},t.prototype.startRiveted=function(){var t=new Date,e=t-this.startTime;this.started=!0,this.sendUserTiming(e),this.clockTimer=setInterval(this.clock.bind(this),1e3)},t.prototype.reset=function(){this.startTime=new Date,this.clockTime=0,this.started=!1,this.stopped=!1,clearTimeout(this.clockTimer),clearTimeout(this.idleTimer)},t.prototype.trigger=function(){var t=this;this.turnedOff||(this.started||this.startRiveted(),this.stopped&&this.restartClock(),clearTimeout(this.idleTimer),this.idleTimer=setTimeout(function(){return t.setIdle()},1e3*this.idleTimeout+100))},t}();e.default=a,t.exports=e.default},function(t,e){"use strict";e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},e.__esModule=!0},function(t,e,i){var n=i(8),o=n(Date,"now"),r=o||function(){return(new Date).getTime()};t.exports=r},function(t,e,i){function n(t,e,i){function n(){g&&clearTimeout(g),p&&clearTimeout(p),y=0,p=g=T=void 0}function c(e,i){i&&clearTimeout(i),p=g=T=void 0,e&&(y=r(),f=t.apply(m,h),g||p||(h=m=void 0))}function d(){var t=e-(r()-v);0>=t||t>e?c(T,p):g=setTimeout(d,t)}function u(){c(b,g)}function l(){if(h=arguments,v=r(),m=this,T=b&&(g||!k),w===!1)var i=k&&!g;else{p||k||(y=v);var n=w-(v-y),o=0>=n||n>w;o?(p&&(p=clearTimeout(p)),y=v,f=t.apply(m,h)):p||(p=setTimeout(u,n))}return o&&g?g=clearTimeout(g):g||e===w||(g=setTimeout(d,e)),i&&(o=!0,f=t.apply(m,h)),!o||g||p||(h=m=void 0),f}var h,p,f,v,m,g,T,y=0,w=!1,b=!0;if("function"!=typeof t)throw new TypeError(s);if(e=0>e?0:+e||0,i===!0){var k=!0;b=!1}else o(i)&&(k=!!i.leading,w="maxWait"in i&&a(+i.maxWait||0,e),b="trailing"in i?!!i.trailing:b);return l.cancel=n,l}var o=i(1),r=i(5),s="Expected a function",a=Math.max;t.exports=n},function(t,e,i){function n(t,e,i){var n=!0,a=!0;if("function"!=typeof t)throw new TypeError(s);return i===!1?n=!1:r(i)&&(n="leading"in i?!!i.leading:n,a="trailing"in i?!!i.trailing:a),o(t,e,{leading:n,maxWait:+e,trailing:a})}var o=i(6),r=i(1),s="Expected a function";t.exports=n},function(t,e,i){function n(t,e){var i=null==t?void 0:t[e];return o(i)?i:void 0}var o=i(11);t.exports=n},function(t,e){function i(t){return!!t&&"object"==typeof t}t.exports=i},function(t,e,i){function n(t){return o(t)&&a.call(t)==r}var o=i(1),r="[object Function]",s=Object.prototype,a=s.toString;t.exports=n},function(t,e,i){function n(t){return null==t?!1:o(t)?u.test(c.call(t)):r(t)&&s.test(t)}var o=i(10),r=i(9),s=/^\[object .+?Constructor\]$/,a=Object.prototype,c=Function.prototype.toString,d=a.hasOwnProperty,u=RegExp("^"+c.call(d).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=n}])});
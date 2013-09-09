/*
 * mhLog
 *
 * Description: A simple utility to control log output.  You can optionally display
 * an abbreviated call stack to better understand the location of the message.
 *
 * @author mhaungs
 */

	/*jshint globalstrict: true*/
    "use strict";  // EMCAScript 5 pragma to catch more javascript errors

    /*
     ************ Module Variables *************
     */

    // Log level enumeration
    var LEVEL = {
        ALL: 0,
        DEBUG: 1,
        DEVELOPMENT: 2,
        PRODUCTION: 3
    };

    var currentLevel = LEVEL.PRODUCTION;
    var strace = false; // Boolean that toggles displaying a stack trace

    /*
     ************ Initialization methods *************
     */

    /*
     ************ Public methods *************
     */
    function setShowStackTrace(val) {
        if (typeof val === 'boolean') {
            strace = val;
        }
    }

    function setLoggingLevel(level) {
        if (levelValid(level)) {
            currentLevel = level;
        }
    }

    function log(level, msg) {
        if (levelValid(level)) {
            if (level >= currentLevel) {
                if (strace === true)
                    logCallTrace();
                console.log("mhlog: Message: " + msg);
                return msg;
            }
        }
        return null;
    }

    /*
     ************ Private methods *************
     */

    function levelValid(level) {
        return (level <= LEVEL.PRODUCTION && level >= LEVEL.ALL);
    }

    // Works in Safari, Chrome, and FireFox
    function logCallTrace() {
        var stackArray, i = 0, entry, results = [];

        try {
            throw new Error("mhLog");
        }
        catch (e) {
            if (e.stack) {
                stackArray = e.stack.split('\n');
                entry = stackArray.shift(); // get rid of reference to this function (logCallTrace)
                while (stackArray.length > 0 && i < 4) {
                    entry = stackArray.shift();  // get one level of call stack
                    results.push(entry.slice(0, entry.indexOf('@')) // keep everything up to @ symbol (Safari)
                            .replace(/^\s+|\s+$/g, '') // Trim whitespaces (Chrome)
                            .replace(/\(http.*$/g, '')); // Remove http reference (Chrome)
                    i++;
                }
                console.log("mhLog: Call Trace: " + results.join(", "));
            }
        }
    }

    /*
     ************ Exports *************
     */

	/* global exports: true */
    exports.LEVEL = LEVEL;
    exports.setShowStackTrace = setShowStackTrace;
    exports.setLoggingLevel = setLoggingLevel;
    exports.log = log;


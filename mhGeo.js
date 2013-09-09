/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Michael Haungs <mhaungs at calpoly.edu>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
 * mhGeo
 *
 * Description:  Provide an accurate (within a delta) location watchpoint
 *
 * Copyright (c) 2013 Michael Haungs <mhaungs at calpoly.edu>
 * License: MIT
 *
 * @author Michael Haungs <mhaungs at calpoly.edu>
 */

// Begin Module Header
(function(parent) {
// End Module Header

    // Assigning exports like this allows dependency injection
    // (aka var sample = require("./sample.js")(app);)
    parent.exports = function() {

        "use strict";  // EMCAScript 5 pragma

        // External Modules
        var mhLog = require("/src/lib/mhlog.js");
        mhLog.setLoggingLevel(mhLog.LEVEL.DEBUG);

        /*
         ************ Module Variables *************
         */

        // Exported Container and test container
        var mhGeo = {};
        mhGeo.test = {};

        // Static variables
        var geoOptions = {
            timeout: 10000, // Wait up to 10 seconds before failing
            enableHighAccuracy: true,
            maximumAge: 0  // always get a fresh location
        };

        var maxAccuracy = 300;

        // Private variables

        /*
         ************ Initialization methods *************
         */

        /*
         ************ Public methods *************
         * Note:  Must be bound to "this" when calling.  Especially important when
         * passing one of the functions below as a callback.
         */

        mhGeo.startWatch = function(initMap, locationEventHandler) {
            mhLog.log(mhLog.LEVEL.DEBUG, "startWatch: called");
            var wrappedHandler;

            // Set current location immediately and call initMap..then set a watchpoint for future updates
            navigator.geolocation.getCurrentPosition(initMap, displayError, geoOptions);

            // Add current location tracking
            if (this.watchPointId === null)
            {
                mhLog.log(mhLog.LEVEL.DEBUG, "startWatch: watchPosition called." + this.watchPointId);
                this.locationHistory = [];  // start with a fresh history
                wrappedHandler = __locationEventHandler.bind(this, locationEventHandler); // Curry handler and bind "this"
                this.watchPointId = navigator.geolocation.watchPosition(wrappedHandler, displayError, geoOptions);
            } else {
                mhLog.log(mhLog.LEVEL.PRODUCTION, "startWatch Error: watchPosition already called");
            }
        };

        mhGeo.stopWatch = function() {
            mhLog.log(mhLog.LEVEL.DEBUG, "stopWatch: watchPointId: " + this.watchPointId +
                    " geoOptions = " + JSON.stringify(geoOptions));
            if (this.watchPointId)
            {
                mhLog.log(mhLog.LEVEL.DEBUG, "stopWatch: clearWatch");
                navigator.geolocation.clearWatch(this.watchPointId);
                this.watchPointId = null;
            }
        };

        /*
         ************ Private methods *************
         */

        /**
         * __locationEventHandler : geolocation watch handler to track user position
         * @param {position object} position
         * @returns {undefined}
         */
        function __locationEventHandler(userCallback, position)
        {
            mhLog.log(mhLog.LEVEL.DEBUG, "__locationEventHandler: lat = " + position.coords.latitude +
                    " lng = " + position.coords.longitude);

            // if currentLocation accuracy is within a delta {
            /* jshint validthis:true */
            this.locationHistory.push(position);  // "this" is bound using "bind" previously.

            // using history analysis, tweak currentLocation
            // prediction using exponential smoothing?  function that approxs results?
            // look at last 4-8 points.  Is it a shape?  choose center point?

            userCallback(position);
            // } else {
            // message that too inaccurate
            //}
        }

        /*
         * Error Functions
         */

        function displayError(error)
        {
            var errorTypes =
                    {
                        0: "Unknown error",
                        1: "Permission denied by user",
                        2: "Position is not available",
                        3: "Request timed out"
                    };
            var errorMessage = errorTypes[error.code];
            if (error.code === 0 || error.code === 2)
            {
                errorMessage = errorMessage + " " + error.message;
            }

            mhLog.log(mhLog.LEVEL.PRODUCTION, "MAP ERROR:  " + errorMessage);
        }


        /*
         ************ Export Module *************
         */

        return Object.create(mhGeo, {
            watchPointId: {writable: true, enumerable: true, value: null},
            locationHistory: {writable: true, enumerable: true, value: []}
        });
    };

// Begin Module Footer
})(getGlobalContainer());
// End Module Footer

/*
 * If this is in a browser not using inject.s, then need to create/use a
 * global variable to hold module exports.  If this is in Node or a browser
 * using inject.js, use module.exports.
 */

function getGlobalContainer() {
    var container;

    if (typeof module !== 'undefined') {
        // We are using commmonJS (probably in Node or using inject.js)
        container = module;
    } else {
        if (typeof window !== 'undefined') {
            // In a browser, use a global variable
            window.exports = window.exports || {};
            container = window;
        }
    }

    return container;
}


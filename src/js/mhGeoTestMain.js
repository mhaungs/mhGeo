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
 * mhGeoTestMain
 *
 * Description:
 *
 * Copyright (c) 2013 Michael Haungs <mhaungs at calpoly.edu>
 * License: MIT
 *
 * @author Michael Haungs <mhaungs at calpoly.edu>
 */

// Begin Module Header
(function(exports) {
// End Module Header

    "use strict";  // EMCAScript 5 pragma

    // External Modules
    var mhGeo = require("mhGeo.js")();

    // Exported Container and test container
    var mhGeoTestMain = {};
    mhGeoTestMain.test = {};

    // Private variables
    var map;
    var marker;
    var canvasUpdateId;

    /*
     ************ Module Variables *************
     */

    /*
     ************ Initialization methods *************
     */

    mhGeoTestMain.init = function() {
        // Display map and track location
        mhGeo.startWatch(showMap, scrollMapToPosition);

        window.setTimeout(mhGeo.stopWatch.bind(mhGeo), 5000);
    };

    mhGeoTestMain.init(); // Start Initialization

    /*
     ************ Public methods *************
     */

    /*
     ************ Private methods *************
     */

    function showMap(position) {
        var googleLatAndLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            zoom: 15,
            center: googleLatAndLong,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var mapDiv = document.getElementById("mapview");
        map = new google.maps.Map(mapDiv, mapOptions);

        addMarker(map, googleLatAndLong, "Your Location", "Latitude = " + position.coords.latitude +
                ", Longitude = " + position.coords.longitude);

    }

    function addMarker(map, latlong, title, content) {
        var markerOptions = {
            position: latlong,
            map: map,
            title: title,
            clickable: true
        };

        // using global var so can update position in another function
        marker = new google.maps.Marker(markerOptions);

        var infoWindowOptions = {
            content: content,
            position: latlong
        };

        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

        google.maps.event.addListener(marker, "click", function() {
            infoWindow.open(map);
        });
    }

    function scrollMapToPosition(position) {
        console.log("In scrollMapToPosition");
        var latlong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.panTo(latlong);
        marker.setPosition(latlong);
    }

    /*function clearAccuracyProgress() {
     var p = document.getElementById("progress");
     p.innerHTML = "Progress:  ";
     }

     function displayStatus(position) {
     var latitude = position.coords.latitude;
     var longitude = position.coords.longitude;
     var pd = document.getElementById("pointDisplay");
     pd.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;

     var accuracy = position.coords.accuracy;
     var ad = document.getElementById("accuracyDisplay");
     ad.innerHTML = "Presently, accuracy is " + accuracy + " meters";

     avg.count++;
     avg.accSum += accuracy;
     avg.latSum += latitude;
     avg.longSum += longitude;

     scrollMapToPosition(position.coords);

     }*/



// Begin Module Footer
})(getGlobalContainer());
// End Module Footer

/*
 * If this is in a browser, then need to create/use a global variable
 * to hold module exports.  If this is in Node, use module.exports.
 * @returns {}
 */
function getGlobalContainer() {
    var container;

    if (typeof module !== 'undefined') {
        // We are using commmonJS (probably in Node or using inject.js)
        container = module.exports;
    } else {
        if (typeof window !== 'undefined') {
            // In a browser, use a global variable
            window.exports = window.exports || {};
            container = window.exports;
        }
    }

    return container;
}

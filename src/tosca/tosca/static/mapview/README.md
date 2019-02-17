modular facetview client
Initialized 1/9/2013, updated 7/11/2014
Alexander Smith, Alexander.Smith@jpl.nasa.gov

How to launch:
cd ../ (into newProject)
python -m SimpleHTTPServer 8002
Then visit localhost:8002/facetview/ in your browser

---V0.0.1---
-added bower to start trickling in libs
-moved vendor JS to js/vendor
-added requirejs/flightjs frameworks
-added card flip on click of background (for show&tell)
---END V0.0.1---

7/11/2014:
Documentation of important components.

Instantiate locally:

js/main.js::
line 2: var _AppBaseURL: set with the base URL of the host:port/subdir of the elasticsearch app instance (something like //localhost:8000/facetview/)
Line 13-14: tagBaseURL, facetviewBaseURL
Line 34: requirejs config needs baseURL to be the absolute URL path of index.html's folder.

COMPONENTS:
1. js/components/mainAppView.js: Consider this the base of the application. Most methods/mixins will kick off from mainAppView.js
- lines 126 - 544, usually starting with "facets: [" and completing out the rest of the configuration object for jquery facetview plugin. If you should ever want to change the facet ordering/display on the left/default view, this would be the place.

2. js/components/facetViewMenuComponent.js: This is actually a clone of the jquery facetview menu that is launched within mainAppView.js, line 881. ( FacetViewMenu.attachTo(document,{config:config}); )
What happens: Within mainAppView, we launch jquery.facetView. And then we listen for the config attribute (from main.js, find config.menuSelector) to load and then we clone and make our modular facetViewMenuComponent that still has all the native jquery.facetview methods/listeners attached...

3. js/mixins/backMap.js: Anything pertaining to the GIBS/Leaflet map on the back side. Any configuration of the basemaps can be done inside of initMap (line 14).

4. js/canvasCropper.js: This used to be the mixin responsible for cropping out background black colors. It has since been deprecated... However some of the methods from backMap were merged into js/canvasCropper.js so the file may still be necessary...

5. js/thumbView.js: Methods responsible for the thumbs/grid/list views.

Beyond that, let me know if anything comes up: alexsmith_540@yahoo.com
-alex 





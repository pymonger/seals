'use strict';
var _AppBaseURL = 'http://localhost:8002/facetview/'; //this is where you're planning to host this app
//ok set some config variables that get passed into the app kind of like globals but in an app centric fashion.
var _AppConfig = 
{
    config:{
        //object that gets passed in as configuration into components/mixins/and soforth. 
        //basically, set globals here...
        widgetHostUrlBase:_AppBaseURL,
        //facetviewBaseURL:"http://grq.jpl.nasa.gov:8869/query/grq_aria?",
        //facetviewBaseURL:"https://grq.jpl.nasa.gov/search//query/grq_aria?",
        facetviewBaseURL:"http://grq.jpl.nasa.gov:8859/query/grq_ccmods?",
        menuSelector:'#facetview_filters', //selector for the facetview menu,
        css: [
            //any CSS files you want injected into the head go here
            _AppBaseURL+'js/vendor/bootstrap/css/bootstrap.min.css',
            _AppBaseURL+'js/vendor/jquery-ui-1.8.18.custom/jquery-ui-1.8.18.custom.css',
            _AppBaseURL+'css/facetview.css',
            _AppBaseURL+'css/style.css',
            _AppBaseURL+'css/backMap.css',
            _AppBaseURL+'js/vendor/jqzoom_ev-2.3/css/jquery.jqzoom.css',
            _AppBaseURL+'js/vendor/leaflet-1.0.3/leaflet.css',
            _AppBaseURL+'js/vendor/Leaflet.draw/dist/leaflet.draw.css'
        ]
    }
}
var elasticSearchInstanceOne = requirejs.config({
     context:'elasticSearchInstanceOne', //if you've got multiples, you'd better config this...
     baseUrl: '/facetview/',//'//cds.jpl.nasa.gov/widgets/plot/0.8',
     
     paths:{
        jquery:[
            //'js/vendor/jquery/1.7.1/jquery-1.7.1.min'
            'bower_components/jquery/jquery.min'
        ],
        jqueryui:[
            'js/vendor/jquery-ui-1.8.18.custom/jquery-ui-1.8.18.custom.min'
        ],
        base:[
            'js/components/mainAppView'
        ],
        shim:[
            'bower_components/es5-shim/es5-shim.min'
        ],
        jqFacetView:[
            'js/jquery.facetview'
        ],
        bootStrap:[
            'js/vendor/bootstrap/js/bootstrap.min'
        ],
        linkifyLib:[
            'js/vendor/linkify/1.0/jquery.linkify-1.0-min'
        ],
        jqZoom:[
            'js/vendor/jqzoom_ev-2.3/js/jquery.jqzoom-core'
        ],
        leaflet:[
            'js/vendor/leaflet-1.0.3/leaflet'
        ],
        leafletDraw:[
            'js/vendor/Leaflet.draw/dist/leaflet.draw'
        ],
        flightJSComponent:[
            'bower_components/flight/lib/component'
        ],
        flightJSCompose:[
            'bower_components/flight/lib/compose'
        ]
        
     },
     map: {
        /*"*": {
            "jquery": "js/noconflict"
          },
          "noconflict": {
            "jquery": "jquery"
          }*/
        },
     shim:{
        'base':{deps:['jquery','linkifyLib','leaflet','jquery','leafletDraw']},
        'jqueryui':{deps:['jquery']},
        'jqFacetView':{deps:['jquery','jqueryui']},
        'linkifyLib':{deps:['jquery']},
        'jqZoom':{deps:['jquery']},
        'bootStrap':{deps:['jquery']}

     },
     urlArgs: "bust=" +  (new Date()).getTime()
});

elasticSearchInstanceOne(['require'],function(require){
    
    require(
    [
    //'js/testComponent',
    
    'jquery',
    'base',
    'shim'
    /*'shim',
    'jqueryui',
    'jqFacetView',
    'linkifyLib',
    'jqZoom',
    'bootStrap',
    'leaflet'*/

    //scripts
    
    ],

        function(jq,MainView) {
            
                MainView.attachTo(document,_AppConfig);
                //ok we attached the mainView compnent to the document. could be a specific selector with multiple instances etc...
            
            
        }       
    );
});

'use strict';
var _AppBaseURL = "{{ url_for('static', filename='mapview2/') }}"; //this is where you're planning to host this app
//ok set some config variables that get passed into the app kind of like globals but in an app centric fashion.
var _AppConfig = 
{
    config:{
        //object that gets passed in as configuration into components/mixins/and soforth. 
        //basically, set globals here...
        widgetHostUrlBase:_AppBaseURL,
        //tagBaseURL:'https://msas-search.jpl.nasa.gov/',
        //grq:9200
        //facetviewBaseURL:'https://msas-search.jpl.nasa.gov/query/grq_ccmods?',
        tagBaseURL:"{{ url_for('views/main.index') }}",//"https://grq.jpl.nasa.gov/search/",
        facetviewBaseURL:"{{ url_for('services/query.query', dataset=config['ES_INDEX']) }}?",
        //facetviewBaseURL:"https://grq.jpl.nasa.gov/search/query/grq_aria?",
        //facetviewBaseURL:"http://grq.jpl.nasa.gov/search/query/grq_ccmods?",
        menuSelector:'#facetview_filters', //selector for the facetview menu,
        css: [
            //any CSS files you want injected into the head go here
            _AppBaseURL+'js/vendor/bootstrap-2.3.2/css/bootstrap.min.css',
            _AppBaseURL+'js/vendor/bootstrap-2.3.2/css/bootstrap-responsive.min.css',
            _AppBaseURL+'js/vendor/jquery-ui-1.8.18.custom/jquery-ui-1.8.18.custom.css',
            _AppBaseURL+'css/facetview.css',
            _AppBaseURL+'css/style.css',
            _AppBaseURL+'css/backMap.css',
            _AppBaseURL+'js/vendor/jqzoom_ev-2.3/css/jquery.jqzoom.css',
            _AppBaseURL+'js/vendor/leaflet-1.0.3/leaflet.css',
            _AppBaseURL+'js/vendor/Leaflet.draw/dist/leaflet.draw.css',
            _AppBaseURL+'js/vendor/bootstrap-tags/bootstrap-tags.css',
            _AppBaseURL+'js/vendor/tablecloth-1.0.0/assets/css/tablecloth.css',
            _AppBaseURL+'js/vendor/tablecloth-1.0.0/assets/css/prettify.css'
        ]
    }
}
var elasticSearchInstanceOne = requirejs.config({
     context:'elasticSearchInstanceOne', //if you've got multiples, you'd better config this...
     waitSeconds: 0, // disable timeout
     baseUrl: "{{ url_for('static', filename='mapview2/') }}",
     
     paths:{
        jquery:[
            'bower_components/jquery/jquery.min'
        ],
        jquerymigrate:[
            'bower_components/jquery/jquery-migrate.min'
        ],
        jqueryvalidate:[
            'js/vendor/jquery-validation-1.12.0/dist/jquery.validate.min'
        ],
        jqueryvalidateform:[
            'js/vendor/jquery-validation-1.12.0/lib/jquery.form'
        ],
        bootStrap:[
            'js/vendor/bootstrap-2.3.2/js/bootstrap.min'
        ],
        linkifyLib:[
            'js/vendor/linkify/1.0/jquery.linkify-1.0-min'
        ],
        jqueryui:[
            'js/vendor/jquery-ui-1.8.18.custom/jquery-ui-1.8.18.custom.min'
        ],
        jqFacetView:[
            'js/jquery.facetview'
        ],
        jqZoom:[
            'js/vendor/jqzoom_ev-2.3/js/jquery.jqzoom-core'
        ],
        leaflet:[
            //'bower_components/LeafletWMTS/leaflet/leaflet-src'
            'js/vendor/leaflet-1.0.3/leaflet'
        ],
        leafletDraw:[
            'js/vendor/Leaflet.draw/dist/leaflet.draw'
        ],
        jsonLib:[
            'js/vendor/JSON-js/json2'
        ],
        bootStrapTags:[
            'js/vendor/bootstrap-tags/bootstrap-tags'
        ],
        tableclothmetadata:[
            'js/vendor/tablecloth-1.0.0/assets/js/jquery.metadata'
        ],
        tableclothtablesorter:[
            'js/vendor/tablecloth-1.0.0/assets/js/jquery.tablesorter.min'
        ],
        tablecloth:[
            'js/vendor/tablecloth-1.0.0/assets/js/jquery.tablecloth'
        ],
        tagcloud:[
            'js/vendor/jquery-tagcloud-0.5.0/jquery.tagcloud'
        ],
        readmore:[
            'js/vendor/readmore/readmore'
        ],
        imageloader:[
            'js/vendor/jquery-imageloader/jquery.imageloader'
        ],
        base:[
            "{{ url_for('views/js.mainAppView')[0:-3] }}"
        ],
        shim:[
            'bower_components/es5-shim/es5-shim.min'
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
        'jquery':{exports:'$'},
        'jquerymigrate':{deps:['jquery']},
        'jqueryvalidate':{deps:['jquerymigrate']},
        'jqueryvalidateform':{deps:['jqueryvalidate']},
        'bootStrap':{deps:['jqueryvalidateform']},
        'linkifyLib':{deps:['bootStrap']},
        'jqueryui':{deps:['linkifyLib']},
        'jqFacetView':{deps:['jqueryui']},
        'jqZoom':{deps:['jqFacetView']},
        'leaflet':{deps:['jqZoom']},
        'leafletDraw':{deps:['leaflet']},
        'jsonLib':{deps:['leafletDraw']},
        'bootStrapTags':{deps:['jsonLib']},
        'tableclothmetadata':{deps:['bootStrapTags']},
        'tableclothtablesorter':{deps:['tableclothmetadata']},
        'tablecloth':{deps:['tableclothtablesorter']},
        'tagcloud':{deps:['tablecloth']},
        'imageloader':{deps:['tagcloud']},
        'base':{deps:['imageloader']}
     },
     urlArgs: "bust=" +  (new Date()).getTime()
});

elasticSearchInstanceOne(['require'],function(require){
    
    require(
    [
    'jquerymigrate',
    'base',
    'shim'

    //scripts
    
    ],

        function(jq,MainView) {
            
                MainView.attachTo(document,_AppConfig);
                //ok we attached the mainView compnent to the document. could be a specific selector with multiple instances etc...
            
            
        }       
    );
});

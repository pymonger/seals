# Syro-Palestinian Bronze and Iron Age Seals Visualizations
This repository provides 2 web interfaces that allow end users the ability to
visually browse and search through the catalog of seal excavation sites:

- Facet Search
- Kibana

## Data
Previous work had generated a [TSV file](data/KeelCoordinates.tsv) that could 
visualize the seal sites on QGIS (https://www.qgis.org/en/site/), a GIS desktop tool. 
However to use this dataset in modern GIS tools, we transformed the dataset in the
TSV and converted the geolocation coordinates from Palestinian grid to WGS84, a more
general georeference coordinate system recognized by databases with geospatial 
extensions. QGIS does this transformation nicely and also provides an export feature
to GeoJSON. That GeoJSON file located in the repository [here](data/KeelCoordinates-CRS84.geojson)
and serves as input dataset for both the Facet Search and Kibana interfaces. Below is
a snippet of one of the seal site records in the GeoJSON file:

```
        {
            "type": "Feature",
            "properties": {
                "Site": "Tell Abu Farag",
                "X": 198500,
                "Y": 203500,
                "KeelVol": "1",
                "KeelPage": 2,
                "Seals per Site": 1
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    35.51323845069626,
                    32.42511136160683
                ]
            }
        },
```
Note that this record is a GeoJSON Feature and conforms to the [GeoJSON spec](http://geojson.org/).
Also note the `properties` object in the feature which preserves the record's
column fields from the original TSV file. **Any future work to enhance this 
dataset should populate fields in `properties`.** This way any visualization
tool developed from a database (in this case Elasticsearch) will have access
to a rich set of properties for each site.

For example, if in future development work browse images for all the seals at a
given site were catalogued and made public on the web, we could update the 
GeoJSON file with an additional property:
```
        {  
            "type": "Feature",
            "properties": {
                "Site": "Tell Abu Farag",
                "X": 198500,
                "Y": 203500,
                "KeelVol": "1",
                "KeelPage": 2,
                "Seals per Site": 1,
                "seals_browse_image": [
                    "http://some.url.to/a/seal/browse/image.png"
                ]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    35.51323845069626,
                    32.42511136160683
                ]
            }
        },
```
or in the case that more than one seals were found at the site:
```
        {  
            "type": "Feature",
            "properties": {
                "Site": "Tell Abu Farag",
                "X": 198500,
                "Y": 203500,
                "KeelVol": "1",
                "KeelPage": 2,
                "Seals per Site": 2,
                "seals_browse_image": [
                    "http://some.url.to/a/seal/browse/image1.png",
                    "http://some.url.to/a/seal/browse/image2.png"
                ]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    35.51323845069626,
                    32.42511136160683
                ]
            }
        },
```

## Requirements
- docker: https://www.docker.com/products/docker-desktop
- docker-compose: https://docs.docker.com/compose/

## Clone repo
```
git clone https://github.iu.edu/gmanipon/seals.git
cd seals
```

## Facet Search
This visualization interface was adapted from the [HySDS Dataset
FacetView interface](https://github.com/hysds/tosca). Essentially it
is a python [Flask](http://flask.pocoo.org/) app that uses Elasticsearch
as its backend database. The app was adapted to show facets pertaining
to the seal sites metadata (`properties` from the GeoJSON file). Below
is an animated screenshot showing usage of the Facet Search interface:

![Facet Search](/img/facet_search.gif?raw=true "Facet Search")

### Build docker image
```
cd docker
./build.sh latest
```

### Startup 
```
docker-compose up -d
```

### Facet Search Interface
After startup, you can access the Facet Search interface at
https://localhost/search (username/password: seals/seals4iu).
If this is the first time you're running through this, you
won't see any seal sites.

![Empty Facet Search](/img/facet_search-empty.png?raw=true "Empty Facet Search")

### Test ingest of dataset
```
docker-compose exec grq sciflo/bin/python \
  sciflo/ops/hysds/scripts/ingest_dataset.py \
  /data/test/site-tell_abu_hawam-keelvol_1_keelpage_4 \
  sciflo/etc/datasets.json
```
Verify dataset ingest by visiting https://localhost/search.

![Test Site](/img/facet_search-test.png?raw=true "Test Site")

### Generate site datasets
```
cd ../data
./create_site_datasets.py KeelCoordinates-CRS84.geojson
```
All datasets will be generated under `data/test/datasets`.

### Ingest generated site datasets
```
cd ../docker
for i in ../data/test/datasets/*; do
  ds=$(basename $i)
  docker-compose exec grq sciflo/bin/python \
    sciflo/ops/hysds/scripts/ingest_dataset.py \
    -f /data/test/datasets/${ds} \
    sciflo/etc/datasets.json
done
```
This will take some time as it ingests the rest of the 
seal sites into your Elasticsearch database. Once it's 
done ingesting, view all of the seal sites and play around
with the facets on the left panel as well as the leaflet
map interface: https://localhost/search.

![All Sites](/img/facet_search-all_sites.png?raw=true "All Sites")

### Shutdown
```
docker-compose down
```

## Kibana

### Startup 
```
cd docker
docker-compose -f docker-compose.kibana.yml up -d
```

### Kibana Interface
After startup, you can access Kibana at
http://localhost:5601.

### Shutdown
```
cd docker
docker-compose -f docker-compose.kibana.yml down
```

### Generate site datasets
```
cd data
./create_site_datasets-kibana.py KeelCoordinates-CRS84.geojson
```
All datasets will be generated under `test/datasets-kibana`.

### Specify geo_point mapping for location
```
curl -XPUT "localhost:9200/seals" -H 'Content-Type: application/json' -d'{
  "mappings": {
    "site": {
      "properties": {
        "location": {
          "type": "geo_point"
        }
      }
    }
  }
}
'
```

### Ingest generated site datasets
```
for i in test/datasets-kibana/*/*.dataset.json; do
  curl -XPOST "localhost:9200/seals/site/" -H 'Content-Type: application/json' -d @${i}
done
```

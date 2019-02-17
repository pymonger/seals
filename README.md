# Facet Search of Syro-Palestinian Bronze and Iron Age Seals

## Requirements
- docker: https://www.docker.com/products/docker-desktop
- docker-compose: https://docs.docker.com/compose/

## Clone repo
```
git clone https://github.iu.edu/gmanipon/seals.git
cd seals
```

## Build docker image
```
cd docker
./build.sh latest
```

## Startup 
```
cd docker
docker-compose up -d
```

## Facet Search Interface
After startup, you can access the Facet Search interface at
https://localhost/search.

## Shutdown
```
cd docker
docker-compose down
```

## Test ingest of dataset
```
cd docker
docker-compose exec grq sciflo/bin/python \
  sciflo/ops/hysds/scripts/ingest_dataset.py \
  /data/test/site-tell_abu_hawam-keelvol_1_keelpage_4 \
  sciflo/etc/datasets.json
```
Verify dataset ingest by visiting https://localhost/search.

## Generate site datasets
```
cd data
./create_site_datasets.py KeelCoordinates-CRS84.geojson
```
All datasets will be generated under `data/test/datasets`.

## Ingest generated site datasets
```
cd docker
for i in ../data/test/datasets/*; do
  ds=$(basename $i)
  docker-compose exec grq sciflo/bin/python \
    sciflo/ops/hysds/scripts/ingest_dataset.py \
    /data/test/datasets/${ds} \
    sciflo/etc/datasets.json
done
```

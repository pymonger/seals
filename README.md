# seals

## Requirments
- docker: https://www.docker.com/products/docker-desktop
- docker-compose: https://docs.docker.com/compose/

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

## Test ingest of dataset
```
cd docker
docker-compose exec grq sciflo/bin/python \
  sciflo/ops/hysds/scripts/ingest_dataset.py \
  /data/test/AOI_sacramento_valley \
  sciflo/etc/datasets.json
```

## Shutdown
```
cd docker
docker-compose down
```

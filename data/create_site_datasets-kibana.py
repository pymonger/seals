#!/usr/bin/env python
import os
import sys
import json
from glob import glob
import shutil


def main(geojson_file):
    """Main."""

    # read geojson export from QGIS
    with open(geojson_file) as f:
        j = json.load(f)

    # create site datasets
    for feat in j['features']:
        props = feat['properties']
        if feat.get('geometry', None) is None: continue
        id = "site-{}-keelvol_{}-keelpage_{}".format("_".join(props['Site'].lower().split()),
                                                     props['KeelVol'], props['KeelPage'])
        dataset_dir = os.path.join('test', 'datasets-kibana', id)
        if not os.path.isdir(dataset_dir):
            os.makedirs(dataset_dir, 0o755)
        ds_file = os.path.join(dataset_dir, "{}.dataset.json".format(id))
        with open(ds_file, 'w') as f:
            json.dump({
                'version': '0.1',
                'label': props['Site'],
                'location': feat['geometry']['coordinates'],
                'metadata': props,
                }, f, indent=2, sort_keys=True)

if __name__ == "__main__":
    main(sys.argv[1])

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
        loc = {'type': 'point',
               'coordinates': feat['geometry']['coordinates']}
        id = "site-{}-keelvol_{}-keelpage_{}".format("_".join(props['Site'].lower().split()),
                                                     props['KeelVol'], props['KeelPage'])
        dataset_dir = os.path.join('test', 'datasets', id)
        if not os.path.isdir(dataset_dir):
            os.makedirs(dataset_dir, 0o755)
        ds_file = os.path.join(dataset_dir, "{}.dataset.json".format(id))
        with open(ds_file, 'w') as f:
            json.dump({
                'version': '0.1',
                'label': props['Site'],
                'location': loc,
                }, f, indent=2, sort_keys=True)
        met_file = os.path.join(dataset_dir, "{}.met.json".format(id))
        with open(met_file, 'w') as f:
            json.dump(props, f, indent=2, sort_keys=True)

        # add some fake browse images
        # TODO: use actual seal images instead of faking it here for demo purposes
        for png in glob('test/site-tell_abu_hawam-keelvol_1_keelpage_4/*.png'):
            shutil.copy(png, dataset_dir)


if __name__ == "__main__":
    main(sys.argv[1])

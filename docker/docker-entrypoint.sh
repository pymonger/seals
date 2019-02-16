#!/bin/bash
set -e

# wait for redis and ES
/wait-for-it.sh -t 30 grq-elasticsearch:9200

# get group id
GID=$(id -g)

# generate ssh keys
gosu 0:0 ssh-keygen -A 2>/dev/null

# update user and group ids
gosu 0:0 groupmod -g $GID ops 2>/dev/null
gosu 0:0 usermod -u $UID -g $GID ops 2>/dev/null
gosu 0:0 usermod -aG docker ops 2>/dev/null

# update ownership
gosu 0:0 chown -R $UID:$GID /home/ops 2>/dev/null || true
gosu 0:0 chown -R $UID:$GID /var/run/docker.sock 2>/dev/null || true
gosu 0:0 chown -R $UID:$GID /var/log/supervisor 2>/dev/null || true

# source grq virtualenv
if [ -e "/home/ops/sciflo/bin/activate" ]; then
  source /home/ops/sciflo/bin/activate
fi

# ensure db for tosca exists
if [ ! -d "/home/ops/sciflo/ops/tosca/data" ]; then
  mkdir -p /home/ops/sciflo/ops/tosca/data
fi
if [ -e `readlink /home/ops/sciflo/ops/tosca/settings.cfg` ]; then
  /home/ops/sciflo/ops/tosca/db_create.py
fi

# install ES template
/home/ops/sciflo/ops/grq2/scripts/install_es_template.sh || :

if [[ "$#" -eq 1  && "$@" == "supervisord" ]]; then
  set -- supervisord -n
else
  if [ "${1:0:1}" = '-' ]; then
    set -- supervisord "$@"
  fi
fi

exec gosu $UID:$GID "$@"

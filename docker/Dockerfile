FROM hysds/grq:latest

MAINTAINER Gerald Manipon (pymonger) "pymonger@gmail.com"
LABEL description="Seals GRQ image"

# update
RUN set -ex \
 && sudo yum update -y \
 && sudo rm -rf /var/cache/yum

# link configuration files
RUN set -ex \
 && ln -sf /home/ops/sciflo/etc/celeryconfig.py /home/ops/sciflo/ops/hysds/celeryconfig.py \
 && ln -sf /home/ops/sciflo/etc/grq2_settings.cfg /home/ops/sciflo/ops/grq2/settings.cfg \
 && ln -sf /home/ops/sciflo/etc/tosca_settings.cfg /home/ops/sciflo/ops/tosca/settings.cfg

# set entrypoint
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 22 80 443 8878 8879 9001
CMD ["supervisord"]

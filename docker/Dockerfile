FROM hysds/grq:latest

MAINTAINER Gerald Manipon (pymonger) "pymonger@gmail.com"
LABEL description="Seals GRQ image"

# update system, copy and install latest tosca web app,
# and link configuration files
COPY --chown=ops:ops src/tosca $HOME/sciflo/ops/tosca
RUN set -ex \
 && sudo yum update -y \
 && source $HOME/sciflo/bin/activate \
 && cd $HOME/sciflo/ops/tosca \
 && pip install -e . \
 && ln -sf $HOME/sciflo/etc/celeryconfig.py $HOME/sciflo/ops/hysds/celeryconfig.py \
 && ln -sf $HOME/sciflo/etc/grq2_settings.cfg $HOME/sciflo/ops/grq2/settings.cfg \
 && ln -sf $HOME/sciflo/etc/tosca_settings.cfg $HOME/sciflo/ops/tosca/settings.cfg \
 && mkdir $HOME/.aws \
 && chmod 700 $HOME/.aws \
 && ln -sf $HOME/sciflo/etc/aws_config $HOME/.aws/config \
 && ln -sf $HOME/sciflo/etc/aws_credentials $HOME/.aws/credentials \
 && sudo rm -rf /var/cache/yum \
 && rm -rf $HOME/.cache

# set entrypoint
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 22 80 443 8878 8879 9001
CMD ["supervisord"]

FROM hysds/grq:latest

MAINTAINER Gerald Manipon (pymonger) "pymonger@gmail.com"
LABEL description="Seals GRQ image"

# env
ENV OPS_HOME /home/ops

# update system, copy and install latest tosca web app,
# and link configuration files
COPY --chown=ops:ops src/hysds ${OPS_HOME}/sciflo/ops/hysds
COPY --chown=ops:ops src/tosca ${OPS_HOME}/sciflo/ops/tosca
COPY --chown=ops:ops src/grq2 ${OPS_HOME}/sciflo/ops/grq2
RUN set -ex \
 && sudo yum update -y \
 && source ${OPS_HOME}/sciflo/bin/activate \
 && pip install -U awscli \
 && cd ${OPS_HOME}/sciflo/ops/hysds \
 && pip install -e . \
 && cd ${OPS_HOME}/sciflo/ops/tosca \
 && pip install -e . \
 && cd ${OPS_HOME}/sciflo/ops/grq2 \
 && pip install -e . \
 && ln -sf ${OPS_HOME}/sciflo/etc/celeryconfig.py ${OPS_HOME}/sciflo/ops/hysds/celeryconfig.py \
 && ln -sf ${OPS_HOME}/sciflo/etc/grq2_settings.cfg ${OPS_HOME}/sciflo/ops/grq2/settings.cfg \
 && ln -sf ${OPS_HOME}/sciflo/etc/tosca_settings.cfg ${OPS_HOME}/sciflo/ops/tosca/settings.cfg \
 && mkdir ${OPS_HOME}/.aws \
 && chmod 700 ${OPS_HOME}/.aws \
 && ln -sf ${OPS_HOME}/sciflo/etc/aws_config ${OPS_HOME}/.aws/config \
 && ln -sf ${OPS_HOME}/sciflo/etc/aws_credentials ${OPS_HOME}/.aws/credentials \
 && sudo rm -rf /var/cache/yum \
 && rm -rf ${OPS_HOME}/.cache

# set entrypoint
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 22 80 443 8878 8879 9001
CMD ["supervisord"]

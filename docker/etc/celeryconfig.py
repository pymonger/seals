K8S = True
BROKER_URL = "amqp://mozart-rabbitmq:5672//"
CELERY_RESULT_BACKEND = "redis://mozart-redis"

CELERY_TASK_SERIALIZER = "msgpack"
CELERY_RESULT_SERIALIZER = "msgpack"
CELERY_ACCEPT_CONTENT = ["msgpack"]
CELERY_TIMEZONE = "US/Pacific-New"
CELERY_ENABLE_UTC = True

CELERY_ACKS_LATE = True
CELERY_TASK_RESULT_EXPIRES = 86400
CELERYD_PREFETCH_MULTIPLIER = 1

CELERY_EVENT_SERIALIZER = "msgpack"
CELERY_SEND_EVENTS = True
CELERY_SEND_TASK_SENT_EVENT = True
CELERY_TRACK_STARTED = True

CELERY_QUEUE_MAX_PRIORITY = 10

BROKER_HEARTBEAT = 300
BROKER_HEARTBEAT_CHECKRATE = 5

CELERY_IMPORTS = [
    "hysds.task_worker",
    "hysds.job_worker",
    "hysds.orchestrator",
]

CELERY_SEND_TASK_ERROR_EMAILS = False
ADMINS = (
    ('Gerald Manipon', 'pymonger@gmail.com'),
)
SERVER_EMAIL = 'ops@mozart-rabbitmq'

HYSDS_HANDLE_SIGNALS = False
HYSDS_JOB_STATUS_EXPIRES = 86400

BACKOFF_MAX_VALUE = 64
BACKOFF_MAX_TRIES = 10

HARD_TIME_LIMIT_GAP = 300

PYMONITOREDRUNNER_CFG = {
    "rabbitmq": {
        "hostname": "mozart-rabbitmq",
        "port": 5672,
        "queue": "stdouterr"
    },

    "StreamObserverFileWriter": {
        "stdout_filepath": "_stdout.txt",
        "stderr_filepath": "_stderr.txt"
    },

    "StreamObserverMessenger": {
        "send_interval": 1
    }
}

MOZART_URL = "https://mozart/mozart/"
MOZART_REST_URL = "https://mozart/mozart/api/v0.1"
JOBS_ES_URL = "http://mozart-elasticsearch:9200"
JOBS_PROCESSED_QUEUE = "jobs_processed"
USER_RULES_JOB_QUEUE = "user_rules_job"
USER_RULES_JOB_INDEX = "user_rules"
STATUS_ALIAS = "job_status"

TOSCA_URL = "https://grq/search/"
GRQ_URL = "http://grq:8878"
GRQ_REST_URL = "http://grq:8878/api/v0.1"
GRQ_UPDATE_URL = "http://grq:8878/api/v0.1/grq/dataset/index"
GRQ_ES_URL = "http://grq-elasticsearch:9200"
DATASET_PROCESSED_QUEUE = "dataset_processed"
USER_RULES_DATASET_QUEUE = "user_rules_dataset"
USER_RULES_DATASET_INDEX = "user_rules"
DATASET_ALIAS = "grq"

USER_RULES_TRIGGER_QUEUE = "user_rules_trigger"

REDIS_JOB_STATUS_URL = "redis://mozart-redis"
REDIS_JOB_STATUS_KEY = "logstash"
REDIS_JOB_INFO_URL = "redis://metrics-redis"
REDIS_JOB_INFO_KEY = "logstash"
REDIS_INSTANCE_METRICS_URL = "redis://metrics-redis"
REDIS_INSTANCE_METRICS_KEY = "logstash"
REDIS_UNIX_DOMAIN_SOCKET = "redis://mozart-redis"

WORKER_CONTIGUOUS_FAILURE_THRESHOLD = 10
WORKER_CONTIGUOUS_FAILURE_TIME = 5.

ROOT_WORK_DIR = "/data/work"
WEBDAV_URL = None
WEBDAV_PORT = 8085

WORKER_MOUNT_BLACKLIST = [
    "/dev",
    "/etc",
    "/lib",
    "/proc",
    "/usr",
    "/var",
]

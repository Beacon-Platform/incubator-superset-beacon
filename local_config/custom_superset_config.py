"""
Description: Superset config - custom overrides
"""

import os
DATA_DIR = os.environ['SUPERSET_HOME']

# ---------------------------------------------------------
# Superset specific config
# ---------------------------------------------------------

ROW_LIMIT = 100000
VIZ_ROW_LIMIT = 20000
# max rows retrieved by filter select auto complete
FILTER_SELECT_ROW_LIMIT = 10000
SUPERSET_WORKERS = 4  # deprecated
SUPERSET_CELERY_WORKERS = 32  # deprecated

SUPERSET_WEBSERVER_ADDRESS = '0.0.0.0'
SUPERSET_WEBSERVER_PORT = 8088
SUPERSET_WEBSERVER_TIMEOUT = 60  # deprecated
SUPERSET_DASHBOARD_POSITION_DATA_LIMIT = 65535
# ---------------------------------------------------------

# Your App secret key
SECRET_KEY = '\2\1thisismyscretkeyxxx\1\2\e\y\y\h'  # noqa
#SECRET_KEY = '\2\1thisismyscretkeyforbeacon\1\2\e\y\y\h'

# The SQLAlchemy connection string.
# SQLALCHEMY_DATABASE_URI = 'sqlite:////etc/superset/superset.db'

# The limit of queries fetched for query search
QUERY_SEARCH_LIMIT = 1000

# Flask-WTF flag for CSRF
WTF_CSRF_ENABLED = True

# Add endpoints that need to be exempt from CSRF protection
WTF_CSRF_EXEMPT_LIST = []

# Whether to run the web server in debug mode or not
DEBUG = True
FLASK_USE_RELOAD = True

# Whether to show the stacktrace on 500 error
SHOW_STACKTRACE = True

# Extract and use X-Forwarded-For/X-Forwarded-Proto headers?
ENABLE_PROXY_FIX = True

# Fix for url prefix
URL_PREFIX = ""

# Enable REMOTE_USER
REMOTE_USER_ENV = True

# Verbose debug
VERBOSE_DEBUG = True

# Admin login
ADMIN_LOGIN = True

# Guest login domains
GUEST_DOMAINS = ['']

# Guest login user
GUEST_USER = 'guest'

# ------------------------------
# GLOBALS FOR APP Builder
# ------------------------------
# Uncomment to setup Your App name
APP_NAME = "Analytics"

# ---------------------------------------------------
# Roles config
# ---------------------------------------------------
# Grant public role the same set of permissions as for the GAMMA role.
# This is useful if one wants to enable anonymous users to view
# dashboards. Explicit grant on specific datasets is still required.
PUBLIC_ROLE_LIKE_GAMMA = True

# ---------------------------------------------------
# Feature flags
# ---------------------------------------------------
# Feature flags that are on by default go here. Their
# values can be overridden by those in super_config.py
FEATURE_FLAGS = {}

# Cache settings
CACHE_DEFAULT_TIMEOUT = 60 * 60 * 24
TABLE_NAMES_CACHE_CONFIG = {'CACHE_TYPE': 'redis'}
CACHE_CONFIG = {
    'CACHE_TYPE': 'redis',
    'CACHE_DEFAULT_TIMEOUT': CACHE_DEFAULT_TIMEOUT, # 1 day default (in secs)
    'CACHE_KEY_PREFIX': 'superset_results',
    'CACHE_REDIS_URL': 'redis://localhost:6379/0',
}

# Allowed format types for upload on Database view
# TODO: Add processing of other spreadsheet formats (xls, xlsx etc)
ALLOWED_EXTENSIONS = set(['csv'])

# CSV Options: key/value pairs that will be passed as argument to DataFrame.to_csv method
# note: index option should not be overridden
CSV_EXPORT = {
    'encoding': 'utf-8',
}

# Default Table/Pivot table format - d3-format syntax - empty string for no format
DEFAULT_TABLE_FORMAT = '.3s'

# Enable Pivot Grid Controls
PIVOT_GRID_CONTROLS = True

# Console Log Settings

LOG_FORMAT = '%(asctime)s:%(levelname)s:%(name)s:%(message)s'
LOG_LEVEL = 'DEBUG'

# Set this API key to enable Mapbox visualizations
MAPBOX_API_KEY = os.environ.get('MAPBOX_API_KEY', 'pk.eyJ1IjoicHBvdG9ja2kiLCJhIjoiY2o4MGQ2eHlmMjFnNjJ3czBiMDlkeW1kNCJ9.Oa_5B2flJ9c_FfmRgYJQAg')

# Maximum number of rows returned from a database
# in async mode, no more than SQL_MAX_ROW will be returned and stored
# in the results backend. This also becomes the limit when exporting CSVs
SQL_MAX_ROW = 100000

# Default row limit for SQL Lab queries
DEFAULT_SQLLAB_LIMIT = 1000

# Maximum number of tables/views displayed in the dropdown window in SQL Lab.
MAX_TABLE_NAMES = 3000

# If defined, shows this text in an alert-warning box in the navbar
# one example use case may be "STAGING" to make it clear that this is
# not the production version of the site.
WARNING_MSG = "Demo"

# Default celery config is to use SQLA as a broker, in a production setting
# you'll want to use a proper broker as specified here:
# http://docs.celeryproject.org/en/latest/getting-started/brokers/index.html

# check if async mode is enabled
ASYNC_ENABLED = os.environ.get('ASYNC_ENABLED', 0)

REDIS_HOST = '127.0.0.1'
REDIS_PORT = '6379'

class CeleryConfig(object):
    BROKER_URL = 'redis://%s:%s/1' % (REDIS_HOST, REDIS_PORT)
    CELERY_IMPORTS = ('superset.sql_lab', )
    CELERY_RESULT_BACKEND = 'redis://%s:%s/1' % (REDIS_HOST, REDIS_PORT)
    CELERY_ANNOTATIONS = {'tasks.add': {'rate_limit': '10/s'}}
    CELERY_TASK_PROTOCOL = 1
    CELERYD_LOG_LEVEL = 'DEBUG'
    CELERY_ACKS_LATE = True

CELERY_CONFIG = CeleryConfig

SQL_CELERY_DB_FILE_PATH = os.path.join(DATA_DIR, 'celerydb.sqlite')
SQL_CELERY_RESULTS_DB_FILE_PATH = os.path.join(DATA_DIR, 'celery_results.sqlite')

# Timeout duration for SQL Lab synchronous queries
SQLLAB_TIMEOUT = 60

# The MAX duration (in seconds) a query can run for before being killed
# by celery.
SQLLAB_ASYNC_TIME_LIMIT_SEC = 60 * 60 * 6

# An instantiated derivative of werkzeug.contrib.cache.BaseCache
# if enabled, it can be used to store the results of long-running queries
# in SQL Lab by using the "Run Async" button/feature
from werkzeug.contrib.cache import RedisCache
RESULTS_BACKEND = RedisCache(host='%s'%REDIS_HOST, port='%s'%REDIS_PORT, key_prefix='superset_results')

# If a callable is specified, it will be called at app startup while passing
# a reference to the Flask app. This can be used to alter the Flask app
# in whatever way.
# example: FLASK_APP_MUTATOR = lambda x: x.before_request = f
FLASK_APP_MUTATOR = None

if not CACHE_DEFAULT_TIMEOUT:
    CACHE_DEFAULT_TIMEOUT = CACHE_CONFIG.get('CACHE_DEFAULT_TIMEOUT')

# The link to a page containing common errors and their resolutions
# It will be appended at the bottom of sql_lab errors.
TROUBLESHOOTING_LINK = ''

# CSRF token timeout, set to None for a token that never expires
WTF_CSRF_TIME_LIMIT = 60 * 60 * 24 * 7

# This link should lead to a page with instructions on how to gain access to a
# Datasource. It will be placed at the bottom of permissions errors.
PERMISSION_INSTRUCTIONS_LINK = ''

# Integrate external Blueprints to the app by passing them to your
# configuration. These blueprints will get integrated in the app
BLUEPRINTS = []

# Allow for javascript controls components
# this enables programmers to customize certain charts (like the
# geospatial ones) by inputing javascript in controls. This exposes
# an XSS security vulnerability
ENABLE_JAVASCRIPT_CONTROLS = False

# The id of a template dashboard that should be copied to every new user
DASHBOARD_TEMPLATE_ID = None

# When not using gunicorn, (nginx for instance), you may want to disable
# using flask-compress
ENABLE_FLASK_COMPRESS = True


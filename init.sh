#!/bin/sh

ADMIN_USERNAME=admin
ADMIN_FIRST_NAME=admin
ADMIN_LAST_NAME=user
ADMIN_EMAIL=admin@admin.com
ADMIN_PWD=admin100

fabmanager create-admin --app superset \
          --username ${ADMIN_USERNAME} \
       --firstname ${ADMIN_FIRST_NAME} \
         --lastname ${ADMIN_LAST_NAME} \
                --email ${ADMIN_EMAIL} \
                --password ${ADMIN_PWD}

superset/bin/superset db upgrade
superset/bin/superset load_examples
superset/bin/superset init


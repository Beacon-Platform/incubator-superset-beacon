"""
Copyright: Copyright (C) 2021 Beacon Platform Inc. - All Rights Reserved
Product: Core
Description: Superset database config
"""

import logging
import os
import json

CUSTOM_DB_CONFIG = ".db_config.json"


def add_databases_from_config(data_dir, db_config_enabled=False, db=None):
    """Adds custom db config on server startup"""

    logging.info("Data Dir: %s, db: %s", data_dir, db)

    if db_config_enabled:
        db_config_file = os.path.join(data_dir, CUSTOM_DB_CONFIG)
        if os.path.exists(db_config_file):
            logging.info("Adding db_config from: %s", db_config_file)
            import_database(db_config_file, db)


def import_database(f, db):
    """Import database from json file"""
    from superset.utils import dict_import_export
    from pathlib2 import Path

    f = Path(f)
    logging.info('Importing datasources from db config file %s into db: %s', f, db)

    try:
        with f.open() as data_stream:
            dict_import_export.import_from_dict(
                db.session,
                json.load(data_stream),
                sync="")
    except Exception as e:
        logging.error('Error when importing datasources from file %s', f)
        logging.error(e)


def test():
    """Test import api"""
    from superset import db
    print(db )
    f = "/Users/pawelpotocki/projects/superset/data_beacon/.db_config.json"
    print(f)

    import_database(f, db)

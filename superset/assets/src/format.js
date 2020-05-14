/* Default table number format passed from Flask config */

const memoize = require('fast-memoize');

export const default_table_format = '.3s';

function _table_format() {
    var fmt = default_table_format;
    var profileViewContainer = document.getElementById('app');
    var bootstrapData = JSON.parse(profileViewContainer.getAttribute('data-bootstrap'));
    if (bootstrapData.common && bootstrapData.common.table_format) {
        fmt = bootstrapData.common.table_format;
    }
    return fmt;
}

export const table_format = memoize(_table_format);
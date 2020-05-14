/* Control parameters passed from Flask config */

const memoize = require('fast-memoize');

export const default_pivot_grid_controls = false;

function _pivot_grid_controls() {
    var controls = default_pivot_grid_controls;
    var profileViewContainer = document.getElementById('app');
    var bootstrapData = JSON.parse(profileViewContainer.getAttribute('data-bootstrap'));
    if (bootstrapData.common && bootstrapData.common.pivot_grid_controls) {
        controls = bootstrapData.common.pivot_grid_controls;
    }
    return controls;
}

export const pivot_grid_controls = memoize(_pivot_grid_controls);
import { t } from '@superset-ui/translation';
import { pivot_grid_controls } from '../../utils.js';

const pivot_interact = pivot_grid_controls() ? 'pivot_interact' : null;
if (window._debug_) {
    window.console.log('pivot_grid_controls ', pivot_grid_controls(), pivot_interact);
}

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['adhoc_filters'],
        ['groupby'],
        ['columns'],
        ['row_limit', null],
      ],
    },
    {
      label: t('Pivot Options'),
      controlSetRows: [
        ['pivot_aggfunc', 'pivot_renderers'],
        ['pivot_row_order', 'pivot_col_order'],
        ['number_format', 'pivot_totals'],
        ['pivot_colormap', null],
        [pivot_interact, null]
      ],
    },
  ],
  controlOverrides: {
    groupby: { includeTime: true },
    columns: { includeTime: true },
  },
};
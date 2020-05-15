import $ from 'jquery';
import PropTypes from 'prop-types';
import { formatNumber } from '@superset-ui/number-format';
import { fixDataTableBodyHeight } from '../../modules/utils';
import './PivotGrid.css';

import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

import { _formatNumber } from '../../modules/utils';
import { table_format, default_table_format } from '../../format.js';

const propTypes = {
  data: PropTypes.shape({
    raw_data: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ])),
  }),
  height: PropTypes.number,
  columnFormats: PropTypes.objectOf(PropTypes.string),
  numberFormat: PropTypes.string,
  numGroups: PropTypes.number,
  verboseMap: PropTypes.objectOf(PropTypes.string),
  numberAlignment: PropTypes.string,
};

function PivotGrid(element, props) {
  const {
    data,
    height,
    columnFormats,
    numberFormat,
    numGroups,
    verboseMap,
    numberAlignment,
    includeSearch,
    groupby,
    metrics,
  } = props;

  const { raw_data, columns } = data;
  const container = element;
  const $container = $(element);

  const formatNum = numberFormat || table_format();
  const alignment = numberAlignment || 'Right';
  const align_map = {'Right': 'text-right', 'Left': 'text-left', 'Center': 'text-center'};

  const cols = Array.isArray(columns[0])
    ? columns.map(col => col[0])
    : columns;

   if (window._debug_) {
     window.console.log('Pivot ', PivotTableUI);
     window.console.log('Container ', container, $container);
   }
}

PivotGrid.displayName = 'PivotGrid';
PivotGrid.propTypes = propTypes;

export default PivotGrid;

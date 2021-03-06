import dt from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { formatNumber } from '@superset-ui/number-format';
import { fixDataTableBodyHeight } from '../../modules/utils';
import './PivotTable.css';

import { _formatNumber } from '../../modules/utils';
import { table_format, default_table_format } from '../../format.js';

dt(window, $);

const propTypes = {
  data: PropTypes.shape({
    // TODO: replace this with raw data in SIP-6
    html: PropTypes.string,
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
  pivotSortOrder: PropTypes.string,
  pivotFirstColumnWidth: PropTypes.string,
  pivotColumnsWidth: PropTypes.string,
};

function PivotTable(element, props) {
  const {
    data,
    height,
    columnFormats,
    numberFormat,
    numGroups,
    verboseMap,
    numberAlignment,
    includeSearch,
    pivotSortOrder,
    pivotFirstColumnWidth,
    pivotColumnsWidth,
  } = props;

  const { html, columns } = data;
  const container = element;
  const $container = $(element);

  // payload data is a string of html with a single table element
  container.innerHTML = html;

  const formatNum = numberFormat || table_format();
  const alignment = numberAlignment || 'Right';
  const align_map = {'Right': 'text-right', 'Left': 'text-left', 'Center': 'text-center'};
  const sort_order = pivotSortOrder;

  var zero_col_width = pivotFirstColumnWidth;
  var columns_width = pivotColumnsWidth;
  var visible_horizontal_sum = false;

  const cols = Array.isArray(columns[0])
    ? columns.map(col => col[0])
    : columns;

  // jQuery hack to set verbose names in headers
  const replaceCell = function () {
    const s = $(this)[0].textContent;
    $(this)[0].textContent = verboseMap[s] || s;
  };
  $container.find('thead tr:first th').each(replaceCell);
  $container.find('thead tr th:first-child').each(replaceCell);

  // jQuery hack to format number
  $container.find('tbody tr').each(function () {
    $(this).find('td').each(function (i) {
      const metric = cols[i];
      const format = columnFormats[metric] || formatNum;
      const tdText = $(this)[0].textContent;

      if (window._debug_) {
        window.console.log('Val: ', tdText);
      }

      if (!Number.isNaN(tdText) && tdText !== '') {
        $(this)[0].textContent = _formatNumber(format, tdText);
        $(this).attr('data-sort', tdText);
        $(this)[0].className = align_map[alignment];
      }
    });
  });

  var columns_def = [];
  if (zero_col_width !== '') {
    if (!zero_col_width.endsWith("px") || !zero_col_width.endsWith("%")) {
        zero_col_width += "px";
    }
    columns_def.push({"width": zero_col_width, "targets": 0});
  }

  if (columns_width !== '') {
    if (!columns_width.endsWith("px") || !columns_width.endsWith("%")) {
        columns_width += "px";
    }
    columns_def.push({"width": columns_width, "targets": "_all"});
  }

  //window.console.log("Columns Defs: ", columns_def);

  if (numGroups === 1) {
    // When there is only 1 group by column,
    // we use the DataTable plugin to make the header fixed.
    // The plugin takes care of the scrolling so we don't need
    // overflow: 'auto' on the table.
    container.style.overflow = 'hidden';
    const table = $container.find('table').DataTable({
      columnDefs: columns_def,
      paging: false,
      searching: includeSearch,
      bInfo: false,
      scrollY: `${height}px`,
      scrollCollapse: true,
      scrollX: true,
    });

    // table first column fixed width
    //window.console.log('Table: ', table, height);

    // sort table
    if (sort_order.startsWith('rows')) {
        if (sort_order.includes('asc')) {
            table.column('0').order('asc').draw();
        }
        else {
            table.column('0').order('desc').draw();
        }
    }
    else {
        if (sort_order.includes('asc')) {
            table.column('-1').order('asc').draw();
        }
        else {
            table.column('-1').order('desc').draw();
        }
    }
    fixDataTableBodyHeight($container.find('.dataTables_wrapper'), height);
  } else {
    // When there is more than 1 group by column we just render the table, without using
    // the DataTable plugin, so we need to handle the scrolling ourselves.
    // In this case the header is not fixed.
    container.style.overflow = 'auto';
    container.style.height = `${height + 10}px`;
  }
}

PivotTable.displayName = 'PivotTable';
PivotTable.propTypes = propTypes;

export default PivotTable;

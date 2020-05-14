import d3 from 'd3';
import $ from 'jquery';
import PropTypes from 'prop-types';
import dt from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import dompurify from 'dompurify';
import { getNumberFormatter, NumberFormats } from '@superset-ui/number-format';
import { getTimeFormatter } from '@superset-ui/time-format';
import { fixDataTableBodyHeight, _getNumberFormatter, _getD3Format } from '../../modules/utils';
import './Table.css';
import { table_format } from '../../format.js';

var isNumeric = require('fast-isnumeric');
var BigNumber = require('bignumber.js');
var d3format = require('d3-format');

function isBigNumber(x) {
    return BigNumber.isBigNumber(x);
}

function is_number(x) {
    return !isNaN(x);
}

dt(window, $);

const propTypes = {
  // Each object is { field1: value1, field2: value2 }
  data: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.number,
  alignPositiveNegative: PropTypes.bool,
  colorPositiveNegative: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    format: PropTypes.string,
  })),
  filters: PropTypes.object,
  includeSearch: PropTypes.bool,
  metrics: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
  onAddFilter: PropTypes.func,
  onRemoveFilter: PropTypes.func,
  orderDesc: PropTypes.bool,
  pageLength: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  percentMetrics: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
  tableFilter: PropTypes.bool,
  tableTimestampFormat: PropTypes.string,
  timeseriesLimitMetric: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  numberAlignment: PropTypes.string,
  numberFormat: PropTypes.string,
  colorBands: PropTypes.bool,
  time_columns_names: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
  time_columns_labels: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
  unformattedColumns: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
};

const formatValue = _getNumberFormatter(NumberFormats.INTEGER);
const formatPercent = _getNumberFormatter(NumberFormats.PERCENT_3_POINT);
function NOOP() {}

function TableVis(element, props) {
  const {
    data,
    height,
    alignPositiveNegative = false,
    colorPositiveNegative = false,
    columns,
    filters = {},
    includeSearch = false,
    metrics: rawMetrics,
    onAddFilter = NOOP,
    onRemoveFilter = NOOP,
    orderDesc,
    pageLength,
    percentMetrics,
    tableFilter,
    tableTimestampFormat,
    timeseriesLimitMetric,
    numberAlignment,
    numberFormat,
    colorBands,
    time_columns_names,
    time_columns_labels,
    unformattedColumns,
  } = props;

  const $container = $(element);

  const formatNum = numberFormat || table_format();
  const alignment = numberAlignment || 'Right';
  const align_map = {'Right': 'text-right', 'Left': 'text-left', 'Center': 'text-center'};

  //window.console.log('Properties: ', alignment, colorBands, formatNum, numberFormat, table_format());
  //window.console.log('Columns ', columns, ' metrics ', metrics);
  //window.console.log('time_columns_names ', time_columns_names, '; time_columns_labels ', time_columns_labels);
  //window.console.log('unformatted columns ', unformattedColumns);

  const metrics = (rawMetrics || []).map(m => m.label || m)
    // Add percent metrics
    .concat((percentMetrics || []).map(m => '%' + m))
    // Removing metrics (aggregates) that are strings
    .filter(m => (typeof data[0][m]) === 'number');

  function col(c) {
    const arr = [];
    for (let i = 0; i < data.length; i += 1) {
      arr.push(data[i][c]);
    }
    return arr;
  }
  const maxes = {};
  const mins = {};
  for (let i = 0; i < metrics.length; i += 1) {
    if (alignPositiveNegative) {
      maxes[metrics[i]] = d3.max(col(metrics[i]).map(Math.abs));
    } else {
      maxes[metrics[i]] = d3.max(col(metrics[i]));
      mins[metrics[i]] = d3.min(col(metrics[i]));
    }
  }

  const tsFormatter = getTimeFormatter(tableTimestampFormat);

  const div = d3.select(element);
  div.html('');
  const table = div.append('table')
    .classed(
      'dataframe table table-striped table-bordered ' +
      'table-condensed table-hover dataTable no-footer order-column', true)
    .attr('width', '100%');

  table.append('thead').append('tr')
    .selectAll('th')
    .data(columns.map(c => c.label))
    .enter()
    .append('th')
    .text(d => d);

  table.append('tbody')
    .selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
    .selectAll('td')
    .data(row => columns.map(({ key, format }) => {
      const frmt = formatNum || format;
      const val = row[key];
      let html;
      const isMetric = metrics.indexOf(key) >= 0;
      const isUnformattedColumn = unformattedColumns.indexOf(key) >= 0;

      //debug
      //window.console.log('Val: ', isUnformattedColumn, key, val, isMetric, isNumeric(val), isBigNumber(val), is_number(val), typeof(val), tableTimestampFormat);

      if (key === '__timestamp') {
        html = tsFormatter(val);
      }
      else if (typeof(val) === 'string') {
        if (val.length > 0 && is_number(val) && !isUnformattedColumn) {
            html = _getNumberFormatter(frmt)(val);
        }
        else {
            html = `<span class="like-pre">${dompurify.sanitize(val)}</span>`;
        }
      }
      else if (isMetric || isNumeric(val)) {
        if (time_columns_names.includes(key) || time_columns_labels.includes(key)) {
            html = tsFormatter(val);
        }
        else {
            if (!isUnformattedColumn) {
                html = _getNumberFormatter(frmt)(val);
            }
            else {
                html = `<span class="like-pre">${dompurify.sanitize(val)}</span>`;
            }
        }
      }
      else if (isBigNumber(val)) {
        if (!isUnformattedColumn) {
            html = _getD3Format(frmt)(val.toNumber());
        }
        else {
            html = `<span class="like-pre">${dompurify.sanitize(val)}</span>`;
        }
      }
      else if (is_number(val)) {
        if (!isUnformattedColumn) {
            var v = parseFloat(val);
            html = _getNumberFormatter(frmt)(v);
        }
        else {
            html = `<span class="like-pre">${dompurify.sanitize(val)}</span>`;
        }
      }
      else if (key[0] === '%') {
        html = formatPercent(val);
      }
      else {
        html = `<span class="like-pre">${dompurify.sanitize(val)}</span>`;
      }
      return {
        col: key,
        val,
        html,
        isMetric,
      };
    }))
    .enter()
    .append('td')
    .style('background-image', function (d) {
      if (d.isMetric && colorBands) {
        const r = (colorPositiveNegative && d.val < 0) ? 125 : 0;
        const g = (colorPositiveNegative && d.val > 0) ? 125 : 0;
        const direction = d.val > 0 ? 'to right' : 'to left';

        if (alignPositiveNegative) {
          const perc = Math.abs(Math.round((d.val / maxes[d.col]) * 100));

          // The 0.01 to 0.001 is a workaround for what appears to be a
          // CSS rendering bug on flat, transparent colors
          return (
            `linear-gradient(to right, rgba(${r},${g},0,0.2), rgba(${r},${g},0,0.2) ${perc}%, ` +
            `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`
          );
        }
        const posExtent = Math.abs(Math.max(maxes[d.col], 0));
        const negExtent = Math.abs(Math.min(mins[d.col], 0));
        const tot = posExtent + negExtent;
        const perc1 = Math.round((Math.min(negExtent + d.val, negExtent) / tot) * 100);
        const perc2 = Math.round((Math.abs(d.val) / tot) * 100);
        // The 0.01 to 0.001 is a workaround for what appears to be a
        // CSS rendering bug on flat, transparent colors
        return (
          `linear-gradient(to right, rgba(0,0,0,0.01), rgba(0,0,0,0.001) ${perc1}%, ` +
          `rgba(${r},${g},0,0.2) ${perc1}%, rgba(${r},${g},0,0.2) ${perc1 + perc2}%, ` +
          `rgba(0,0,0,0.01) ${perc1 + perc2}%, rgba(0,0,0,0.001) 100%)`
        );
      }
      return null;
    })
    .classed(align_map[alignment], d => d.isMetric || isNumeric(d.val) || isBigNumber(d.val))
    .attr('title', d => (!Number.isNaN(d.val) ? formatValue(d.val) : null))
    .attr('data-sort', d => (d.isMetric) ? d.val : null)
    // Check if the dashboard currently has a filter for each row
    .classed('filtered', d =>
      filters &&
      filters[d.col] &&
      filters[d.col].indexOf(d.val) >= 0,
    )
    .on('click', function (d) {
      if (!d.isMetric && tableFilter) {
        const td = d3.select(this);
        if (td.classed('filtered')) {
          onRemoveFilter(d.col, [d.val]);
          d3.select(this).classed('filtered', false);
        } else {
          d3.select(this).classed('filtered', true);
          onAddFilter(d.col, [d.val]);
        }
      }
    })
    .style('cursor', d => (!d.isMetric) ? 'pointer' : '')
    .html(d => d.html ? d.html : d.val);

  const paging = pageLength && pageLength > 0;

  const datatable = $container.find('.dataTable').DataTable({
    paging,
    pageLength,
    aaSorting: [],
    searching: includeSearch,
    bInfo: false,
    scrollY: `${height}px`,
    scrollCollapse: true,
    scrollX: true,
  });

  fixDataTableBodyHeight($container.find('.dataTables_wrapper'), height);
  // Sorting table by main column
  let sortBy;
  const limitMetric = Array.isArray(timeseriesLimitMetric)
    ? timeseriesLimitMetric[0]
    : timeseriesLimitMetric;
  if (limitMetric) {
    // Sort by as specified
    sortBy = limitMetric.label || limitMetric;
  } else if (metrics.length > 0) {
    // If not specified, use the first metric from the list
    sortBy = metrics[0];
  }
  if (sortBy) {
    const keys = columns.map(c => c.key);
    const index = keys.indexOf(sortBy);
    datatable.column(index).order(orderDesc ? 'desc' : 'asc');
    if (metrics.indexOf(sortBy) < 0) {
      // Hiding the sortBy column if not in the metrics list
      datatable.column(index).visible(false);
    }
  }
  datatable.draw();
}

TableVis.displayName = 'TableVis';
TableVis.propTypes = propTypes;

export default TableVis;

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import { formatNumber } from '@superset-ui/number-format';
import { fixDataTableBodyHeight } from '../../modules/utils';

import PivotTableUI from 'react-pivottable/PivotTableUI';
import PivotTable from 'react-pivottable/PivotTable';
import { aggregatorTemplates } from 'react-pivottable/Utilities.js';
import { aggregators } from 'react-pivottable/Utilities.js';
import { numberFormat } from 'react-pivottable/Utilities.js';

import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

import { _getNumberFormatter } from '../../modules/utils';
import { table_format, default_table_format } from '../../format.js';

import './PivotGrid.css';

var moment = require('moment-timezone');

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);
const align_map = {'Right': 'text-right', 'Left': 'text-left', 'Center': 'text-center'};
const aggregators_map = {'Sum': aggregatorTemplates.sum,
                         'Average': aggregatorTemplates.average,
                         'Count': aggregatorTemplates.count,
                         'Count Unique Values': aggregatorTemplates.countUnique,
                         'List Unique Values': aggregatorTemplates.listUnique,
                         'Median': aggregatorTemplates.median,
                         'Sample Variance': aggregatorTemplates.var,
                         'Sample Standard Deviation': aggregatorTemplates.stdev,
                         'Minimum': aggregatorTemplates.min,
                         'Maximum': aggregatorTemplates.max,
                         'First': aggregatorTemplates.first,
                         'Last': aggregatorTemplates.last,
                         'Sum over Sum: aggregatorTemplates': aggregatorTemplates.sumOverSum};

const propTypes = {
  data: PropTypes.shape({
    raw_data: PropTypes.arrayOf(PropTypes.object),
    all_columns: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ])),
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
  groupby: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ])),
  metrics: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])),
  columns: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ])),
  pivotRenderers: PropTypes.string,
  pivotAggfunc: PropTypes.string,
  pivotRowOrder: PropTypes.string,
  pivotColOrder: PropTypes.string,
  pivotInteract: PropTypes.bool,
  pivotTotals: PropTypes.bool,
  pivotColormap: PropTypes.string,
  time_columns_names: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
  time_columns_labels: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
};

function customColorScaleGenerator(values) {
    const min = Math.min.apply(Math, values);
    const max = Math.max.apply(Math, values);

    // Plotly happens to come with d3 on board
    return Plotly.d3.scale.linear()
        .domain([-35, 0, 35])
        .range(["#77F", "#FFF", "#F77"])
}

function redColorScaleGenerator(values) {
  const min = Math.min.apply(Math, values);
  const max = Math.max.apply(Math, values);
  return x => {
    // eslint-disable-next-line no-magic-numbers
    const nonRed = 255 - Math.round(255 * (x - min) / (max - min));
    return {backgroundColor: `rgb(255,${nonRed},${nonRed})`};
  };
}

function blueColorScaleGenerator(values) {
    const min = Math.min.apply(Math, values);
    const max = Math.max.apply(Math, values);
    return x => {
        // eslint-disable-next-line no-magic-numbers
        const nonRed = 255 - Math.round(255 * (x - min) / (max - min));
        return {backgroundColor: `rgb(${nonRed},${nonRed},255)`};
    };
}

function greenColorScaleGenerator(values) {
    const min = Math.min.apply(Math, values);
    const max = Math.max.apply(Math, values);
    return x => {
        // eslint-disable-next-line no-magic-numbers
        const nonRed = 255 - Math.round(255 * (x - min) / (max - min));
        return {backgroundColor: `rgb(${nonRed},255,${nonRed})`};
    };
}

const color_map = {
    'White-Red': redColorScaleGenerator,
    'White-Green': greenColorScaleGenerator,
    'White-Blue': blueColorScaleGenerator,
};

class PivotGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
      window.console.log('componentDidMount');

      const pivotTotals = this.props.pivotTotals;

      const node = ReactDOM.findDOMNode(this);
      const pvtTotalLabels = node.querySelectorAll('.pvtTotalLabel');
      const pvtGrandTotal = node.querySelector('.pvtGrandTotal');
      const pvtTotals = node.querySelectorAll('.pvtTotal');

      if (!pivotTotals) {
        if (pvtTotalLabels && pvtGrandTotal && pvtTotals) {
            pvtTotalLabels.forEach(function(element) {
                element.style.display = 'none';
            });
            pvtGrandTotal.style.display = 'none';
            pvtTotals.forEach(function(element) {
                element.style.display = 'none';
            });
        }
      }
      else {
        if (pvtTotalLabels && pvtGrandTotal && pvtTotals) {
            pvtTotalLabels.forEach(function(element) {
                element.style.display = '';
            });
            pvtGrandTotal.style.display = '';
            pvtTotals.forEach(function(element) {
                element.style.display = '';
            });
        }
      }
  }

  componentDidUpdate() {
      window.console.log('componentDidUpdate');

      const pivotTotals = this.props.pivotTotals;

      const node = ReactDOM.findDOMNode(this);
      const pvtTotalLabels = node.querySelectorAll('.pvtTotalLabel');
      const pvtGrandTotal = node.querySelector('.pvtGrandTotal');
      const pvtTotals = node.querySelectorAll('.pvtTotal');

      if (!pivotTotals) {
        if (pvtTotalLabels) {
            pvtTotalLabels.forEach(function(element) {
                element.style.display = 'none';
            });
        }
        if (pvtGrandTotal) {
            pvtGrandTotal.style.display = 'none';
        }
        if (pvtTotals) {
            pvtTotals.forEach(function(element) {
                element.style.display = 'none';
            });
        }
      }
      else {
        if (pvtTotalLabels && pvtGrandTotal && pvtTotals) {
            pvtTotalLabels.forEach(function(element) {
                element.style.display = '';
            });
            pvtGrandTotal.style.display = '';
            pvtTotals.forEach(function(element) {
                element.style.display = '';
            });
        }
      }
  }

  componentWillUnmount() {
      window.console.log('componentWillUnmount');
  }

  render() {
      const { raw_data, all_columns, columns } = this.props.data;

      const formatNum = this.props.numberFormat || table_format();
      const alignment = this.props.numberAlignment || 'Right';
      const time_columns_names = this.props.time_columns_names || [];
      const time_columns_labels = this.props.time_columns_labels || [];

      const cols = Array.isArray(columns[0])
        ? columns.map(col => col[0])
        : columns;

      const vals = typeof this.props.metrics[0] === 'string'
        ? this.props.metrics
        : this.props.metrics.map(col => col['label']);

      const datetime_format = 'YYYY-MM-DD HH:mm:SS';
      const date_format = 'YYYY-MM-DD';

      raw_data.forEach(function(r) {
        Object.keys(r).forEach(function(key) {
            if (time_columns_names.includes(key)) {
                console.log('1.. ', r[key]);
                r[key] = moment(new Date(r[key])).tz("UTC").format('YYYY-MM-DD HH:mm:SS');
                console.log('2..  ', r[key]);
            }});
        },
      );

      //window.console.log('Metric ', typeof this.props.metrics[0] === 'string');
      //window.console.log('Raw Data ', raw_data);
      //window.console.log('Props ', this.props);

      //window.console.log('Cols ', cols, columns);
      //window.console.log('Vals ', vals);
      //window.console.log('This ', this);
      //window.console.log('TableRenderers ', TableRenderers);
      //window.console.log('TableRenderers entries ', Object.entries(TableRenderers));

      const pivot_interact = this.props.pivotInteract
      const pivotColormap = this.props.pivotColormap;
      const pivotTotals = this.props.pivotTotals;
      const PivotClass = pivot_interact ? PivotTableUI : PivotTable;
      const vheight = this.props.height + 'px'
      const divStyle = {position: 'relative', overflow: 'auto', overflow_y: 'auto', height: vheight, width: '100%', max_height: '1128px'};

      const colormap_func = color_map[pivotColormap];
      const agg_func = aggregators_map[this.props.pivotAggfunc];
      const new_format = _getNumberFormatter(formatNum);
      const new_agg_func = agg_func(new_format);

      // assign new format
      aggregators[this.props.pivotAggfunc] = new_agg_func;

      return (
            <div className={'pivot_grid'}>
                <div className={'pivot_grid_scroll'} style={divStyle}>
                    <PivotClass
                        data={raw_data}
                        rows={this.props.groupby}
                        cols={this.props.columns}
                        vals={vals}
                        onChange={s => this.setState(s)}
                        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                        aggregators={aggregators}
                        aggregatorName={this.props.pivotAggfunc}
                        rendererName={this.props.pivotRenderers}
                        rowOrder={this.props.pivotRowOrder}
                        colOrder={this.props.pivotColOrder}
                        tableColorScaleGenerator={colormap_func}
                        {...this.state}
                    />
                </div>
            </div>
      );
   }
}

PivotGrid.displayName = 'PivotGrid';
PivotGrid.propTypes = propTypes;

export default PivotGrid;

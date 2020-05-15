import { isTruthy } from '../../utils/common';
import { formatLabel } from './utils';

var BigNumber = require('bignumber.js');

function isBigNumber(x) {
    return BigNumber.isBigNumber(x);
}

export default function transformProps(chartProps) {
  const {
    width,
    height,
    annotationData,
    datasource,
    formData,
    onError,
    onAddFilter,
    payload,
  } = chartProps;

  const {
    annotationLayers,
    barStacked,
    bottomMargin,
    colorPicker,
    colorScheme,
    comparisonType,
    contribution,
    donut,
    entity,
    labelsOutside,
    leftMargin,
    lineInterpolation,
    maxBubbleSize,
    orderBars,
    pieLabelType,
    reduceXTicks,
    richTooltip,
    sendTimeRange,
    showBarValue,
    showBrush,
    showControls,
    showLabels,
    showLegend,
    showMarkers,
    size,
    stackedStyle,
    vizType,
    x,
    xAxisFormat,
    xAxisLabel,
    xAxisShowminmax,
    numberFormat,
    xLogScale,
    xTicksLayout,
    y,
    yAxisFormat,
    yAxis2Format,
    yAxisBounds,
    yAxisLabel,
    yAxisShowminmax,
    yLogScale,
  } = formData;

  const rawData = payload.data || [];
  if (window._debug_) {
    window.console.log('Raw data: ', rawData);
  }

  const data = Array.isArray(rawData)
    ? rawData.map(row => ({
      ...row,
      key: formatLabel(row.key, datasource.verboseMap),
    }))
    : rawData;

  // Temporary fix to convert BigNumber to plain number
  if (Array.isArray(data)) {
      for (var row of data) {
        for (var i in row.values) {
            var val = row.values[i];
            for (var v in val) {
                if (Array.isArray(val[v])) {
                    var m = val[v];
                    val[v] = m.map(r => isBigNumber(r) ? r.toNumber() : r);
                }
                else {
                    var r = val[v];
                    val[v] = isBigNumber(r) ? r.toNumber() : r;
                }
            }
        }
      }
  }

  if (window._debug_) {
    window.console.log('Parsed data: ', data);
  }

  return {
    width,
    height,
    data,
    annotationData,
    annotationLayers,
    areaStackedStyle: stackedStyle,
    baseColor: colorPicker,
    bottomMargin,
    colorScheme,
    comparisonType,
    contribution,
    entity,
    isBarStacked: barStacked,
    isDonut: donut,
    isPieLabelOutside: labelsOutside,
    leftMargin,
    lineInterpolation,
    maxBubbleSize: parseInt(maxBubbleSize, 10),
    numberFormat,
    onBrushEnd: isTruthy(sendTimeRange) ? ((timeRange) => {
      onAddFilter('__time_range', timeRange, false, true);
    }) : undefined,
    onError,
    orderBars,
    pieLabelType,
    reduceXTicks,
    showBarValue,
    showBrush,
    showControls,
    showLabels,
    showLegend,
    showMarkers,
    sizeField: size,
    useRichTooltip: richTooltip,
    vizType,
    xAxisFormat,
    xAxisLabel,
    xAxisShowMinMax: xAxisShowminmax,
    xField: x,
    xIsLogScale: xLogScale,
    xTicksLayout,
    yAxisFormat,
    yAxis2Format,
    yAxisBounds,
    yAxisLabel,
    yAxisShowMinMax: yAxisShowminmax,
    yField: y,
    yIsLogScale: yLogScale,
  };
}

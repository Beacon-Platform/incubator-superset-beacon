export default function transformProps(chartProps) {
  const { height, datasource, formData, payload } = chartProps;
  const {
    columns,
    groupby,
    metrics,
    numberFormat,
    numberAlignment,
    includeSearch,
    pivotRenderers,
    pivotAggfunc,
    pivotRowOrder,
    pivotColOrder,
    pivotInteract,
    pivotTotals,
    pivotColormap,
  } = formData;
  const {
    columnFormats,
    verboseMap,
  } = datasource;

  window.console.log('datasource ', datasource);
  window.console.log('form data ', formData);
  window.console.log('payload: ', payload);

  const time_columns = datasource.columns.filter(c => c.is_dttm);
  const time_columns_names = time_columns.map(c => c.column_name);
  const time_columns_labels = time_columns.map(c => c.verbose_name).filter(c => c);

  window.console.log('Time columns: ', time_columns);

  return {
    height,
    data: payload.data,
    columnFormats,
    numGroups: groupby.length,
    numberFormat,
    verboseMap,
    numberAlignment,
    includeSearch,
    groupby,
    metrics,
    columns,
    pivotRenderers,
    pivotAggfunc,
    pivotRowOrder,
    pivotColOrder,
    pivotInteract,
    pivotTotals,
    pivotColormap,
    time_columns_names,
    time_columns_labels,
  };
}

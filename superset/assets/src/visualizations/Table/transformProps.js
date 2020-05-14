export default function transformProps(chartProps) {
  const {
    height,
    datasource,
    filters,
    formData,
    onAddFilter,
    payload,
  } = chartProps;
  const {
    alignPn,
    colorPn,
    includeSearch,
    metrics,
    orderDesc,
    pageLength,
    percentMetrics,
    tableFilter,
    tableTimestampFormat,
    timeseriesLimitMetric,
    numberAlignment,
    numberFormat,
    colorBands,
    unformattedColumns,
  } = formData;
  const { columnFormats , verboseMap } = datasource;
  const { records, columns } = payload.data;

  //window.console.log('datasource ', datasource);
  //window.console.log('columns ', columns);
  //window.console.log('unformatted columns ', unformattedColumns);

  const time_columns = datasource.columns.filter(c => c.is_dttm);
  const time_columns_names = time_columns.map(c => c.column_name);
  const time_columns_labels = time_columns.map(c => c.verbose_name).filter(c => c);

  //window.console.log('time columns names ', time_columns_names);
  //window.console.log('time columns labels ', time_columns_labels);

  const processedColumns = columns.map((key) => {
    let label = verboseMap[key];
    // Handle verbose names for percents
    if (!label) {
      if (key[0] === '%') {
        const cleanedKey = key.substring(1);
        label = '% ' + (verboseMap[cleanedKey] || cleanedKey);
      } else {
        label = key;
      }
    }
    return {
      key,
      label,
      format: columnFormats && columnFormats[key],
    };
  });

  return {
    height,
    data: records,
    alignPositiveNegative: alignPn,
    colorPositiveNegative: colorPn,
    columns: processedColumns,
    filters,
    includeSearch,
    metrics,
    onAddFilter,
    orderDesc,
    pageLength: pageLength && parseInt(pageLength, 10),
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
  };
}

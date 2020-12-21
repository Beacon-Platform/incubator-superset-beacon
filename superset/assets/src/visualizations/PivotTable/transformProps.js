export default function transformProps(chartProps) {
  const { height, datasource, formData, payload } = chartProps;
  const {
    groupby,
    numberFormat,
    numberAlignment,
    includeSearch,
    pivotSortOrder,
    pivotFirstColumnWidth,
    pivotColumnsWidth,
  } = formData;
  const {
    columnFormats,
    verboseMap,
  } = datasource;

  if (window._debug_) {
      window.console.log('datasource ', datasource);
      window.console.log('form data ', formData);
      window.console.log('payload: ', payload);
  }

  return {
    height,
    data: payload.data,
    columnFormats,
    numGroups: groupby.length,
    numberFormat,
    verboseMap,
    numberAlignment,
    includeSearch,
    pivotSortOrder,
    pivotFirstColumnWidth,
    pivotColumnsWidth,
  };
}

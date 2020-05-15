# Beacon main code changes and additions

This version of Superset is cloned from Apache Superset version 0.30 (branch 0.30)

Main changes added for Beacon

* Automatic login using Beacon credentials

* Fixes to Table ungroupped selection

* Fixes to number formatting in Table and PivotTable

* Fix support for MSSQL 

* Fixes color mapping in Table and PivotTable

* Various css fixes and improvements


* New visualization component **PivotGrid** based on React Plotly PivotTable from [https://github.com/plotly/react-pivottable](https://github.com/plotly/react-pivottable)

    ```
	superset/assets/images/viz_thumbnails/pivot_grid.png
	superset/assets/src/explore/controlPanels/PivotGrid.js
	superset/assets/src/utils.js
	superset/assets/src/visualizations/PivotGrid/PivotGrid.css
	superset/assets/src/visualizations/PivotGrid/PivotGrid.js
	superset/assets/src/visualizations/PivotGrid/PivotGrid.jsx
	superset/assets/src/visualizations/PivotGrid/PivotGridChartPlugin.js
	superset/assets/src/visualizations/PivotGrid/ReactPivotGrid.js
	nsuperset/assets/src/visualizations/PivotGrid/images/thumbnail.png
	superset/assets/src/visualizations/PivotGrid/images/thumbnailLarge.png
	superset/assets/src/visualizations/PivotGrid/transformProps.js
    ```


* Modified files for all Beacon related changes

    ```
	requirements.txt
	superset/assets/images/favicon.png
	superset/assets/images/s.png
	superset/assets/images/superset-logo@2x.png

    # JavaScript
	superset/assets/package.json
	superset/assets/spec/javascripts/components/AlteredSliceTag_spec.jsx
	superset/assets/spec/javascripts/sqllab/QueryTable_spec.jsx
	superset/assets/spec/javascripts/welcome/DashboardTable_spec.jsx
	superset/assets/src/SqlLab/components/QueryTable.jsx
	superset/assets/src/SqlLab/main.less
	superset/assets/src/components/AlteredSliceTag.jsx
	superset/assets/src/components/TableLoader.jsx
	superset/assets/src/explore/components/DisplayQueryButton.jsx
	superset/assets/src/explore/controlPanels/Pie.js
	superset/assets/src/explore/controlPanels/PivotGrid.js
	superset/assets/src/explore/controlPanels/PivotTable.js
	superset/assets/src/explore/controlPanels/Table.js
	superset/assets/src/explore/controlPanels/index.js
	superset/assets/src/explore/controls.jsx
	superset/assets/src/format.js
	superset/assets/src/modules/utils.js
	superset/assets/src/setup/setupColors.js
	superset/assets/src/setup/setupFormatters.js
	superset/assets/src/utils.js
	superset/assets/src/visualizations/BigNumber/transformProps.js
	superset/assets/src/visualizations/CountryMap/CountryMap.js
	superset/assets/src/visualizations/FilterBox/FilterBox.css
	superset/assets/src/visualizations/Heatmap/Heatmap.js
	superset/assets/src/visualizations/PairedTTest/TTestTable.jsx
	superset/assets/src/visualizations/PivotGrid/PivotGrid.js
	superset/assets/src/visualizations/PivotGrid/PivotGrid.jsx
	superset/assets/src/visualizations/PivotGrid/transformProps.js
	superset/assets/src/visualizations/PivotTable/PivotTable.css
	superset/assets/src/visualizations/PivotTable/PivotTable.js
	superset/assets/src/visualizations/PivotTable/transformProps.js
	superset/assets/src/visualizations/Rose/Rose.js
	superset/assets/src/visualizations/Sankey/Sankey.js
	superset/assets/src/visualizations/Sunburst/Sunburst.js
	superset/assets/src/visualizations/Table/Table.css
	superset/assets/src/visualizations/Table/Table.js
	superset/assets/src/visualizations/Table/transformProps.js
	superset/assets/src/visualizations/TimeTable/FormattedNumber.jsx
	superset/assets/src/visualizations/TimeTable/SparklineCell.jsx
	superset/assets/src/visualizations/TimeTable/TimeTable.jsx
	superset/assets/src/visualizations/Treemap/Treemap.js
	superset/assets/src/visualizations/WorldMap/WorldMap.js
	superset/assets/src/visualizations/nvd3/NVD3Vis.js
	superset/assets/src/visualizations/nvd3/transformProps.js
	superset/assets/src/visualizations/nvd3/utils.js
	superset/assets/src/visualizations/presets/CommonChartPreset.js
	superset/assets/src/welcome/DashboardTable.jsx
	superset/assets/stylesheets/less/cosmo/variables.less
	superset/assets/stylesheets/superset.less

    # Python
    superset/__init__.py
	superset/config.py
	superset/connectors/base/models.py
	superset/dataframe.py
	superset/db_engine_specs.py
	superset/sql_lab.py
	superset/templates/appbuilder/navbar.html
	superset/views/base.py
	superset/views/core.py
	superset/viz.py
    ```

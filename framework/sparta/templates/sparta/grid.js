
App.grid = {}

App.grid.def = (field, header, options = {}) => {
    let o = {
        field: field,
        headerName: header,
        ...options
    };

    if (o.min) {
        o.minWidth = o.min;
        o.width = o.min;
        delete o.min;
    }

    if (o.fix) {
        o.minWidth = o.fix;
        o.width = o.fix;
        o.maxWidth = o.fix;
        delete o.fix;
    }

    if (o.style) {
        o.cellClass = o.style;
        delete o.style;
    }

    return o;
}

App.grid.options = {
    getRowId: params => params.data.id,
    defaultColDef: {
        filter: true,
        flex: 1
    },
    pagination: true,
    rowGroupPanelShow: 'always',
    localeText: AG_GRID_LOCALE,
    rowData: [],
    rowSelection: 'single',
}

App.grid.filter = function (grid, field, value = '', filterType = 'number', type = 'equals') {
    console.log('filter: ' + field + ' ' + value + ' ' + filterType + ' ' + type);
    const model = grid.getFilterModel()
    model[field] = {
        type: type,
        filter: value,
        filterType: filterType
    };
    grid.setFilterModel(model);
}


App.grid.fix_width = (w) => ({ minWidth: w, width: w, maxWidth: w });




App.grid.column_detail = {
    field: 'detail',
    headerName: '⛛',
    minWidth: 40,
    width: 40,
    maxWidth: 40,
    filter: false,
    cellRenderer: (params) => (`⛋`)
}

App.grid.cellClassRules = {
    'boolean': {
        'cell-true': (params) => (params.value === true),
        'cell-false': (params) => (params.value === false)
    }
};



App.grid.render = {}
App.grid.render.Data = class {
    eGui;
    params;
    init(params) {
        this.eGui = document.createElement('div');
        if (params.value && Object.keys(params.value).length > 0) {
            //const [p, v] = Object.entries(params.value)[0] || [];  
            this.eGui.innerHTML = `<div class='app-cell'><ion-icon name="triangle-outline" style="margin-right:2px;transform:translateY(1px) rotate(90deg) "> </ion-icon><b>${Object.keys(params.value).length}</b></div>`;
        } else {
            this.eGui.innerHTML = '-'
        }

        this.eGui.addEventListener('click', () => this.onClick());
        this.params = params;

    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false;
    }

    onClick() {
        console.log(this)
        const { node, colDef } = this.params;
        const fieldName = colDef.field; // Get the field name from the column definition
        const currentValue = node.data[fieldName]; // Get the current value of the cell
        App.modal_json(currentValue);

    }
}

App.grid.meta_columns = function (fields) {
    return Object.keys(fields).map(function (key) {
        let field = fields[key]
        let column = {
            field: key,
            headerName: field['label']
        }

        if (field.type == 'boolean') {
            column.type = 'booleanColumn';
            column.cellRenderer = function (params) {
                return params.value ? 'Yes' : 'No';
            }
        } else if (
            field.type == 'JSONField' ||
            field.serializer == 'ListSerializer' ||
            field.serializer == 'CompanyLite' ||
            field.label == 'Final packages'
        ) {
            column.cellRenderer = App.grid.render.Data
        }
        return column;
    });
}













App.grid.all = function (element, columns, data, options = {}) {
    columns.push(App.grid.column_detail);
    let grid = agGrid.createGrid(element, {
        columnDefs: columns,
        onCellClicked: function (event) {
            if (event.colDef.field === 'detail') {
                App.modal_json(event.data);
            }
        },
        //    rowData: data,
        ...Object.assign({}, App.grid.options, { pagination: false }),
        ...options
    });
    grid.setGridOption('rowData', data)
    grid.sizeColumnsToFit()
    return grid;
}


App.grid.infinite = function (element, columns, api, count = undefined, options = {}) {
    columns.push(App.grid.column_detail);
    let grid = agGrid.createGrid(element, {
        columnDefs: columns,
        rowModelType: 'infinite',
        onCellClicked: function (event) {
            if (event.colDef.field === 'detail') {
                App.modal_json(event.data);
            }
        },
        getRowId: params => params.data.id,
        defaultColDef: {
            filter: false,
            sortable: false,
            flex: 1
        },
        rowGroupPanelShow: 'always',
        localeText: AG_GRID_LOCALE,
        rowSelection: 'single',
        ...options
    });
    var cursor = ''; //Yes, we will call again
    grid.setGridOption('datasource', {
        rowCount: count, //-> behave as infinite scroll
        getRows: (params) => {
            App.request(api + (api.includes('?') ? '&' : '?') + 'cursor=' + cursor).then((data) => {
                cursor = data.meta.cursor;
                params.successCallback(data.data, cursor === null ? data.meta.count : -1);
            });
        }
    });
    return grid;
}


App.grid.auto = function (element, api, options = {}) {
    return new Promise((resolve, reject) => {
        App.request(api, { method: 'OPTIONS' }).then(function (data) {
            var columns = App.grid.meta_columns(data.meta.serializer.fields);

            App.request(api).then(function (data) {
                let grid;
                if (data.meta && data.meta.hasOwnProperty('cursor')) {
                    grid = App.grid.infinite(element, columns, api, data.meta.count, options);
                } else {
                    grid = App.grid.all(element, columns, data, options);
                }
                resolve(grid);
            }).catch(reject);
        }).catch(reject);
    });
}
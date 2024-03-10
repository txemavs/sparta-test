
import { AgGrid } from '/app/components/base/ag_grid.js';

App.define('pa-endpoints-grid', class extends AgGrid {

    constructor() {
        super();
        this.api = null;
        this.selected_api = null;
    }

    select_api(endpoint, api, row) {
        this.selected_api = this.getAttribute('base') + endpoint;

        this.dispatchEvent(new CustomEvent('endpoints:selected:api', {
            detail: {
                api: api,
                endpoint: this.selected_api,
                row: row
            },
            bubbles: true,
            composed: true
        }));


    }

    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        const div = document.createElement('div');
        div.classList.add('ag-theme-balham');
        div.style.height = '100%';
        div.style.width = '100%';
        this.style.display = 'block';
        this.appendChild(div);
        let CD = App.grid.def;
        let that = this;

        this.addEventListener('endpoints:path:pk', (e) => {
            // Handle the custom event
            let pk = e.detail.pk;
            let row = e.detail.row;
            if (!row && that.api) {
                row = that.api.getDisplayedRowAtIndex(0);
            }
            row.data['select'] = pk;
            that.api.refreshCells({ force: true });
            grid_paths_update(that.api, pk, row.data.path, row.data.meta.nested.parents);

        });


        let get_route = (e) => {
            let route = '';
            if (e.data.meta.nested.parents) {
                e.data.meta.nested.parents.forEach(parent => {
                    route += parent + '/';
                    if (e.data.selection && e.data.selection.hasOwnProperty(parent)) {
                        route += e.data.selection[parent];
                    }
                    route += '/';
                });
            }
            return route + e.data.path;
        }

        let grid_paths_update = (grid, pk, path, parents) => {
            let branch = [...parents, path];
            grid.forEachNode(function (n) {
                if (n.data.path === path) { return }
                if (n.data.meta.nested.parents && n.data.meta.nested.parents.join(',').startsWith(branch.join(','))) {
                    if (!n.data.selection) n.data.selection = {};
                    n.data.selection[path] = pk; // This will log the data of the rows that start with the same path
                }
            });
            grid.refreshCells({ force: true });
        }


        

        that.api = agGrid.createGrid(div, {
            onCellClicked: function (event) {
                if (event.colDef.field === 'route') {
                    let endpoint = get_route(event);
                    if (endpoint.includes("//")) {
                        console.log("Invalid endpoint. Operation cancelled.");
                        return;
                    }
                    if (event.data.ordering) {
                        endpoint += '?ordering=' + event.data.ordering;
                    }
                    that.select_api(endpoint, event.api, event);
                    event.node.setSelected(true);
                }
                else if (event.colDef.field === 'meta.view.methods.create') [
                    App.modal_create(event.data.meta.serializer)
                ]
                else if (event.colDef.field === 'id') { App.modal_json(event.data); }
                else if (event.colDef.field === 'meta.serializer.fields') { App.modal_json(event.data.meta.serializer.fields); }
                else if (event.colDef.field === 'meta.view.mixins') { App.modal_json(event.data.meta.view.bases); }
            },
            columnDefs: [
                CD('route', '☀ API', {
                    flex: 1,
                    minWidth: 200,
                    maxWidth: 320,
                    width: 240,
                    filter: true,
                    pinned: true,
                    sort: 'asc',
                    'valueGetter': get_route,
                    'cellClassRules': {
                        'cell-bold': function (params) { return !params.value.includes('//') }
                    }
                }),
                CD('select', '🔑', {
                    width: 60, minWidth: 50, maxWidth: 100, style: 'cell-bold', filter: true,
                    //valueGetter: (params) => (''),
                    editable: true, filter: false, sortable: false,
                    onCellValueChanged: function (params) {
                        if (params.newValue !== params.oldValue) {
                            grid_paths_update(params.api, params.newValue, params.data.path, params.data.meta.nested.parents);
                        }
                    }
                }),
                {
                    headerName: '⚡ Actions',
                    children: [
                        CD('meta.view.methods.list', 'GET', { fix: 80 }),
                        CD('meta.view.methods.detail', 'GET ID', {
                            columnGroupShow: 'open', editable: true,
                            onCellValueChanged: function (params) {
                                console.log('Cell value changed from', params.oldValue, 'to', params.newValue);
                            },
                            fix: 80
                        }),
                        CD('meta.view.methods.create', 'POST', {
                            columnGroupShow: 'open',
                            fix: 80,

                        }),
                        CD('meta.view.methods.update', 'PUT', { columnGroupShow: 'open', fix: 80 }),
                        CD('meta.view.methods.partial', 'PATCH', { columnGroupShow: 'open', fix: 80 }),
                        CD('meta.view.methods.destroy', 'DELETE', { columnGroupShow: 'open', fix: 80 }),
                    ]
                },{
                    headerName: '🔶 View',
                    children: [
                        CD('pag', 'Pag', {
                            cellClassRules: App.grid.cellClassRules.boolean,
                            columnGroupShow: 'closed',
                            fix: 50,

                        }),
                        CD('readonly', 'RO', {
                            cellClassRules: App.grid.cellClassRules.boolean,
                            columnGroupShow: 'closed',
                            fix: 50
                        }),
                        CD('ordering', 'Order', {
                            fix: 120,
                            columnGroupShow: 'open',
                            cellRenderer: function (params) {
                                // Create the select element
                                let options = params.data.meta.view.ordering_fields;
                                if (!options || options.length === 0) {
                                    return '';
                                }

                                let select = document.createElement('select');
                                select.style.width = '100%';
                                select.style.border = '0';
                                select.style.background = 'transparent';

                                options.forEach(o => {
                                    let option = document.createElement('option');
                                    option.value = o;
                                    option.text = o;
                                    select.appendChild(option);
                                });

                                select.value = params.value;

                                // Add an event listener for the change event
                                select.addEventListener('change', function () {
                                    // Update the value of the ordering column
                                    params.node.setDataValue('ordering', this.value);
                                });

                                return select;
                            }, onCellValueChanged: function (params) {
                                if (params.newValue !== params.oldValue) {

                                    let endpoint = get_route(params);
                                    if (endpoint.includes("//")) {
                                        console.log("Invalid endpoint. Operation cancelled.");
                                        return;
                                    }

                                    if (params.newValue) {
                                        endpoint += '?ordering=' + params.newValue;
                                    }

                                    that.select_api(endpoint, params.api, params);
                                }
                            }
                        }),
                        CD('meta.view.mixins', '◯', {
                            fix: 40,
                            filter: false,
                            //order: false,
                            columnGroupShow: 'open',
                            cellRenderer: (params) => (`◯`),
                            valueFormatter:  params => params.value
                        }),
                        CD('meta.view.name', 'Class', { columnGroupShow: 'open' }),
                        CD('meta.view.permission', 'Permissions', { columnGroupShow: 'open', valueFormatter:  params => params.value }),

                    ]
                },  {
                    headerName: '🔷 Serializer',
                    children: [
                        CD('meta.serializer.fields', 'Fields', {
                            fix: 100,
                            cellRenderer: (params) => (`📑 ${Object.keys(params.data.meta.serializer.fields).length}`),
                            valueFormatter: params => params.value
                        }),
                        CD('view', 'Help', {
                            fix: 50,
                            editable: true,
                            cellRenderer: (params) => (``)
                        }),
                        CD('meta.serializer.name', 'Class', { minWidth: 120, maxWidth: 240, columnGroupShow: 'open' }),
                    ]
                },
                {
                    headerName: '🧊 Model',
                    children: [
                        CD('meta.model.name', 'Class', { flex: 2, minWidth: 120, maxWidth: 240 }),
                    ]
                }, {
                    headerName: '☀ Nested',
                    flex: 4,
                    children: [
                        CD('level', '⛬', { fix: 40, type: 'numericColumn' }),
                        CD('meta.nested.parents', 'Parents', { columnGroupShow: 'open', flex: 1, min: 100, valueFormatter: params => params.value.join(', ') }),
                        CD('meta.nested.children', 'Endpoints', { flex: 4, filter: true, valueFormatter: params => params.value.join(', ') }),
                        CD('id', '⛛', { fix: 50, type: 'numericColumn', filter: false }),
                    ]
                }
            ]
        });

        App.request(this.getAttribute('base') + 'endpoints').then((data) => {
            that.api.setGridOption('rowData', data);
            that.api.sizeColumnsToFit();
            let first = that.api.getDisplayedRowAtIndex(0);
            if (first) {
                first.setSelected(true);
                that.select_api(first.data.path, that.api, first);
            }
        });

    }
});

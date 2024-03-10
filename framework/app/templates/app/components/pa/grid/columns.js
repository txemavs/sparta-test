//Y COMO LLEGA context columns a este js??

App.define('pa-grid-columns', class extends App.Component {
    connectedCallback() {
        this.style.display = 'block';
        this.style.height = '100%';
        this.classList.add('ag-theme-balham');
        
        let grid = agGrid.createGrid(App.id('{{id}}'), {
            /* TAG {% app_grid_column_defs columns %} */
            ...App.grid.options
            });
            App.request('{{fetch}}').then((data)=> {
                grid.setGridOption('rowData', data)
                grid.sizeColumnsToFit()
            });
    }
});
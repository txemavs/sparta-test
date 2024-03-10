
import { AgGrid } from '/app/components/base/ag_grid.js';

App.define('pa-grid', class extends AgGrid {
    static get mirroredProps() {
        return ['endpoint'];
    }

    constructor() {
        super();
        this.cls='pa-grid'

        this.endpoints_row = null;
        
    }

    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
    }
    


    static observedAttributes = ['endpoint']

    attributeChangedCallback(attr, was, value) {
        
        if (!this.isConnected) return;

        switch (attr) {
            case "endpoint":
                if (!value || was == value) return;
                this.render();
                break;
        }
    }

    async render_grid(element, api) {
        let that = this;
        this.api = await App.grid.auto(element, api, {
            onSelectionChanged: function (e) {
                let selectedRows = e.api.getSelectedRows();
                if (selectedRows.length > 0) { //Primary key selected
                    let pk = selectedRows[0]['id'];
                    that.dispatchEvent(new CustomEvent('endpoint:pk', {
                        detail: {
                            endpoint: that.getAttribute('endpoint'),
                            api: that.api,
                            pk: pk,
                            row: that.endpoints_row
                        },
                        bubbles: true,
                        composed: true
                    }));
                }
            }
        });
    }

    render() {
        this.innerHTML = '';
        const div = document.createElement('div');
        div.classList.add('ag-theme-balham');
        div.style.height = '100%';
        div.style.width = '100%';
        this.appendChild(div);
        this.render_grid(div, this.getAttribute('endpoint'));
    }

});
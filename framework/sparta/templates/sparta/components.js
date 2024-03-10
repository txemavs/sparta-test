//<!-- js/components.js -->
/*
App.pa_observer = new MutationObserver((mutationsList, observer) => {
    console.log('pa_observer');
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for(let node of mutation.addedNodes) {
                if(node.nodeType === Node.ELEMENT_NODE) {
                    console.log('Added', node.localName);
                    // Check if the custom element is defined
                    if(node.localName.startsWith('pa-') && !customElements.get(node.localName)) {
                        // Define the custom element
                        App.define(node.localName);
                    }
                }
            }
        }
    }
});



App.require = function(element) {
    if (customElements.get(element)) return;
    
    let path = element.replace(/-/g, '/');
    App.log('📦 Require ' + path);
    return import('/app/components/' + path + '.js')
}

*/



App.define('pa-centered', class extends App.Component {
    connectedCallback() {
        this.style.display = 'block';
    }
    template() {
        return `
        <ion-grid>
            <ion-row justify-content-center>
                <ion-col>
                </ion-col>
                <ion-col size="auto">
                    <slot></slot>
                </ion-col>
                <ion-col></ion-col>
            </ion-row>
        </ion-grid>
        `;
    }
})



App.define('pa-bar', class extends App.Component {
    connectedCallback() {
        this.style.display = 'block';
    }
    template() {
        return `
        <ion-grid>
            <ion-row>
                <ion-col style='padding:0 10px'>
                    <slot></slot>
                </ion-col>
            </ion-row>
        </ion-grid>
        `;
    }
})



App.define('pa-modal', class extends App.Component {
    connectedCallback() {
        this.style.display = 'block';
        this.style.height = '100%';
        this.innerHTML = `
        <ion-modal>
            <ion-header>
                <ion-toolbar color="dark">
                    <ion-title>${this.getAttribute('title')}</ion-title>
                    <ion-buttons slot="end">
                        <ion-button onclick="App.$('ion-modal').dismiss()" strong>
                            <ion-icon name="close-outline"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content style='font-size: 0.8em;'>
                ${this.innerHTML}
            </ion-content>
        </ion-modal>
        `;
    }
    present() { this.querySelector('ion-modal').present() };
    dismiss() { document.querySelector('ion-modal').dismiss() };
    template() { return false } // no shadow dom
});





App.extend.ForControl = (Component)=>{ return class extends Component {
    constructor() {
        super();
        // reference to the controlled element, if any
        this.control = null;
        // bind the assocation callback to this instance
        this.associate = this.associate.bind(this);
        this.addEventListener("click", () => this.onClick());
    }

    static get observedAttributes() {
        return ["for"]
    }

    attributeChangedCallback(attr, was, value) {
        
        switch (attr) {
            case "for":
                if (was) App.mutation.name.unwatch(was, this.associate);
                this.control = null;
                App.mutation.name.watch(value, this.associate);
                //but will not find later elements!
                console.log("W",attr, was, value)
                break;
        }
    }

    associate(targets) {
        // this callback will receive any matching element for our ID
        targets.forEach(function(target) {
            console.log(target)
        })
        this.control = targets[0];
    }

    onClick() {
        // if we have an association, click the controlled element
        console.log(this.control)
        if (this.control) {
            this.control.click();
        }
    }
}}
App.define('pa-test', App.extend.ForControl(App.Component))
//

App.define('pa-modal2', class extends App.Component {
    connectedCallback() {        
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
    present() {this.querySelector('ion-modal').present()};
    dismiss() {document.querySelector('ion-modal').dismiss()};
    template() {return false} // no shadow dom
});


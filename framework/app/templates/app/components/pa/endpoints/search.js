App.define('pa-endpoints-search', class extends App.part.Searchbar {
    //🔴->main:search
    connectedCallback() {
        const me = super.connectedCallback();
        me.addEventListener('ionChange', function (e) {
            App.id('main').dispatchEvent(new CustomEvent('main:search', {
                detail: {
                    search: this.value
                },
                bubbles: true,
                composed: true
            }));
        });
    }
});
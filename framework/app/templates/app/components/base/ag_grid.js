class AgGrid extends App.Component {
    constructor() {
        super();        
        this.api = null;
        this.resizeTimeout = null;
        this.handleResize = this.handleResize.bind(this);
    }

    connectedCallback() {
        this.style.display = 'block';
        window.addEventListener('resize', this.handleResize);
    }
    
    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize);
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }
    
    handleResize(event) {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            if (this.api) {
                this.api.sizeColumnsToFit();
            }
        }, 200); // delay in milliseconds
    }
}

export { AgGrid };
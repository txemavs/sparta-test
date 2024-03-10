/* {% load sparta %}
Sparta component 404
{{request.path_info}}
*/
App.define('{{element}}', class extends App.Component {
    connectedCallback() {
        this.style.display = 'block';
    }
    template() {return  `
    <style>
        :host {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            background:red
        }
        .overlay {
            position: absolute;
            z-index: 1;
        }
        slot {
            position: relative;
            z-index: 2;
        }
        </style>
        <div class="overlay">Component {{element}} not found</div>
        <slot></slot>
    `}

});
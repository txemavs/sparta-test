/** @type {App} */
window.App = {
    /**
     * Selects the first element within the document that matches the specified selector.
     * @param {string} query - The CSS selector to match one or more elements.
     * @returns {Element} The first matched element or null if no matches are found.
     */
    $: (query) => document.querySelector(query),

    /** Reserved */
    cache: {},

    channels: {}, // PubSub

    component: (element) => customElements.get(element),

    Component: class extends HTMLElement {
        /**
         * Returns the HTML template for the custom element.
         * If overriden to false, no shadow DOM will be created.
         * @returns {string} The HTML template.
         */
        template() { return `<slot></slot>` }

        /** 
         * Initialize custom element. 
         */
        constructor() {
            super();
            this.$ = this.querySelector;
            this.cls = 'app-element';
            var def = new.target;

            if (def.mirroredProps) {
                def.mirroredProps.forEach(f => {
                    Object.defineProperty(this, f, {
                        get() { return this.getAttribute(f); },
                        set(v) { this.setAttribute(f, v); }
                    })
                });
            }

            if (def.boundMethods) {
                for (var f of def.boundMethods) { this[f] = this[f].bind(this); }
            }

            if (this.template) {//static get template() {return `<button as="alertButton">Click me</button>`
                let template = this.template();
                if (template) {
                    this.elements = {};
                    this.attachShadow({ mode: "open" });
                    this.shadowRoot.innerHTML = template;
                    this.shadowRoot.querySelectorAll(`[as]`).forEach(el => {
                        var name = el.getAttribute("as");
                        this.elements[name] = el;
                    });
                } else {
                    console.log('No shadow')
                    //this.innerHTML = this.markup(this.innerHTML);
                }
            }
        }

        /**
         * Dispatches a custom event.
         * @param {string} event - The name of the event.
         * @param {any} detail - The data to pass to the event.
         */
        emit(event, detail) {
            this.dispatchEvent(new CustomEvent(event, {
                detail: detail,
                bubbles: false,
                composed: true
            }));
        }
        /**
         * Defines a new custom element.
         * @param {string} tag - The name of the custom element.
         */
        static define(tag) {
            try {
                window.customElements.define(tag, this);
            } catch (err) {
                console.log(`Unable to (re)define ${tag}`);
            }
        }

    },


    /**
     * Defines a new custom element or imports it if it's not already defined.
     * @param {string} element - The name of the custom element to define.
     * @param {Function} [cls=null] - The HTMLElement subclass. 
     * @returns {Promise<void>} A Promise.
     */
    define: async function (element, cls = null) {

        if (customElements.get(element)) return;

        if (cls) {
            App.defined(element).then(() => {
                App.log('🧊 Defined ' + element);
            });
            customElements.define(element, cls);
        } else {
            let path = element.replace(/-/g, '/');
            App.log('📦 Import ' + path);
            await import('/app/components/' + path + '.js')
        }

    },

    defined: async function (element) {
        return customElements.whenDefined(element);
    },

    /** Mixin utilities */
    extend: {},

    /**
     * Retrieves the value of a specified cookie.
     * @param {string} name - The name of the cookie to retrieve.
     * @returns {string|null} The cookie's value, or null if the cookie does not exist.
     */
    getCookie: function (name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    /**
     * Returns a reference to the first element with the specified ID.
     * @param {string} id - The ID of the element to match.
     * @returns {Element} The matched element or null if no element with the specified ID exists.
     */
    id: (id) => document.getElementById(id),

    /**
     * Updates the current URL without causing a page refresh.
     * @param {string} path - The new path for the current URL.
     */
    locate: function (path) {
        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
        }
    },

    mutation: {
        check: {
            node: (node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the custom element is defined
                    if (node.localName.startsWith('pa-') && !customElements.get(node.localName)) {
                        App.log('🔵 Added ', node.localName);
                        App.define(node.localName);
                    }

                    for (let child of Array.from(node.children)) {
                        App.mutation.check.node(child);
                    }
                }
            },
            id: function (watch) {
                var result = document.getElementById(watch.id);
                watch.callbacks.forEach(function (c) {
                    if (c.previous == result) return;
                    c(result);
                    c.previous = result;
                })
            }
        },
        observer: new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        App.mutation.check.node(node);
                    }
                }
            }
        }),
        name: { //https://thomaswilburn.github.io/wc-book/dp-control.html

            init: function() {
                this.observer(document.body, {
                    subtree: true,
                    childList: true,
                    attributeFilter: ["name"]
                });
            },

            list: new Map(),

            observer: new MutationObserver(function(mutations) {
                App.mutation.name.list.forEach(App.mutation.name.glance);
            }),

            glance: function (watch) {
                var results = document.getElementsByName(watch.name);
                console.log('glance', watch, 'watching', watch.callbacks.length, 'callbacks', results.length, 'results')
                if (results.length === 0) return;
                //results.forEach(function(result) {
                    watch.callbacks.forEach(function (c) {
                        if (c.previous == results) return;
                        c(results);
                        c.previous = results;
                    });
                //});
            },

            glanceid: function (watch) {
                var result = document.getElementById(watch.id);
                watch.callbacks.forEach(function (c) {
                    if (c.previous == result) return;
                    c(result);
                    c.previous = result;
                })
            },

            watch: function (name, callback) {
                var watch = this.list.get(name) || { name, callbacks: [] };
                if (watch.callbacks.includes(callback)) return; // no duplicate callbacks allowed
                watch.callbacks.push(callback);
                try {
                    this.glance(watch);
                    this.list.set(name, watch);
                } catch (err) {
                    console.error(err);
                }
            },

            unwatch: function (name, callback) {
                var watching = this.list.get(name);
                if (!watching) return;
                watching.callbacks = watching.callbacks.filter(c => c != callback);
                if (!watching.callbacks.length) {
                    this.list.delete(name);
                }
            },

            start: function () {
                this.observer.observe(document.body, {
                    subtree: true,
                    childList: true,
                    attributeFilter: ["name"]
                });
            }
        }

    },


    pubsub: function (channel) {
        if (!this.channels.hasOwnProperty(channel)) {
            this.channels[channel] = new rxjs.BehaviorSubject(null);
        }
        return this.channels[channel];
    },

    pub: function (channel, message) {
        if (channel != "log" && typeof message === 'string' && message.includes(':')) App.log("🟣 Pub: " + channel, message);
        this.pubsub(channel).next(message);
    },



    /**
     * Executes a callback function when the DOM is fully loaded.
     * @param {Function} call - The callback function to be executed.
     * @param {string} [name=''] - An optional string parameter used for logging.
     */
    ready: function (call, name = '') {

        if (document.readyState === "loading") {
            // The document is still loading, so DOMContentLoaded is pending
            App.log("⚪ Waiting " + name)
            document.addEventListener('DOMContentLoaded', function (e) {
                App.log("🟡 Ready " + name)
                call();
            });
        } else {
            // The document has already finished loading, so DOMContentLoaded has already fired
            App.log("⚪ Ready " + name)
            htmx.onLoad(function(e) {
                console.log('htmx loaded', e);
                call();
            });
            //call()
        }
    },

    /**
     * Generates request headers, like Django CSRF.
     * @param {Object} [headers={}] - An optional object containing additional headers.
     * @returns {Object} An object containing the 'X-CSRFToken' and 'Content-Type' headers, along with any additional headers provided in the 'headers' parameter.
     */
    request_headers: function (headers = {}) {
        return {
            'X-CSRFToken': App.getCookie('csrftoken'),
            'Content-Type': headers && headers['Content-Type'] ? headers['Content-Type'] : 'application/json'
        }
    },

    /**
     * Sends an HTTP request and returns a Promise that resolves with the response data.
     * @param {string} url - The URL to send the request to.
     * @param {Object} [options={}] - An optional object containing options for the fetch API, such as method, headers, body, etc.
     * @param {boolean} [cache=false] - An optional boolean indicating whether to cache the response data.
     * @returns {Promise<Object>} A Promise that resolves with the response data.
     */
    request: function (url, options = {}, cache = false) {
        return new Promise((resolve, reject) => {
            App.progress.indeterminate();

            App.log("⚫ Request " + (options.method || 'GET') + " " + url);

            fetch(url, {
                method: 'GET',
                ...options,
                headers: App.request_headers(options.headers),

            }).then(async (response) => {
                if (!response.ok) {
                    response.text().then(App.django_error);
                    reject('Error: ' + response.status);
                }
                return response.json();
            }).then((data) => {
                this.pub("log", {
                    message: "🟢 Response " + (options.method || 'GET') + " " + url,
                    detail: data,
                    callback: () => { console.log('CHECK THIS'); }
                });
                App.progress.end();
                if (cache) App.cache[cache] = data;
                resolve(data);
            })
                .catch((error) => {
                    App.pub('log', "🔴 Request error " + error);
                    reject(error);
                })
        });
    },


    stdout: (m) => console.log(m),


    sub: function (channel, callback) {
        if (channel != "log") App.log("🟣 Sub: " + channel);
        return this.pubsub(channel).subscribe({ next: callback });
    },









    /**
     * Selects all elements within the document that match the specified selector.
     * @param {string} query - The CSS selector to match one or more elements.
     * @returns {NodeList} A NodeList representing a list of the document's elements that match the specified group of selectors.
     */
    query: (query) => document.querySelectorAll(query),

}

//<!-- includes -->

//{% include "sparta/grid.js" %}
//{% include "sparta/events.js" %}
//{% include "sparta/ui.js" %}
//{% include "sparta/components.js" %}
//{% include "sparta/boot.js" %}

//<!-- end includes -->


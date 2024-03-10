The Sparta project
******************

Simple Page Asyncronous Resource Transfer Application

This is a experimental repository for the developement of the package 
"django-sparta", a django app that helps to create fluid multi page 
applications quickly using htmx.

You can create your python env, install requirements.txt and run the Django 
development server.

This repository includes a example production container ochestration with 
nginx cofigured to serve the static files and expose the wsgi and asgi 
services using a proxy.
The SSL certificate should be included with nginx to get HTTPS and WSS. 
Five containers:
 - web: sparta-web - Nginx HTTP and WS web server at http://localhost:300
 - db: sparta-postgis - PostgresSQL serves the RDB.
 - wsgi: sparta-django - WSGI server
 - asgi: sparta-django - ASGI asyncronous server
 - redis: sparta-queue - A Redis memory for incoming messages 

You can remove redis and asgi from compose and nginx if you are not using channels.

Run 'docker compose up --build' and the all images are created.

Sparta test will be on http://localhost:300/

Concepts:
---------
The repository folders:
 - server: Contains the django sparta-test project settings.
 - sparta: The future "django-sparta" package, for now you can copy it to your project to use it.
 - app: An example application


Django settings
===============

To install sparta, you need to copy the sparta folder to your project and configure settings:

 - Add 'sparta' to INSTALLED_APPS
 - Add 'sparta.middleware.SpartaMiddleware' to MIDDLEWARE
 - Add 'sparta.context.processor' to TEMPLATES['OPTIONS']['context_processors']

Sparta
======

You need to have 2 templates configured in your settings:
SPARTA = {
    'layout': 'sparta/ui/ionic/layout.html',
    'partial': 'sparta/htmx/partial.html'
}

The 'layout' template contains the fixed landing template thar is served on first request.

The templates to be rendered as view responses now can use this at the first line:
{% extends template %}
So they will be extending:
 - The complete 'layout' template if it the request is a new landing.
 - Only the 'partial' if is htmx

The View doesn't care about this, it responds the same template, and the layout 
may go wrapping it, or may be already requesting this response from the client.

Note:
 - The layout template loads all common static resources and bootstraps the App object.
 - The #main element is the target for partial hypermedia responses 
 - Full page load requests get the layout and the requested content in #main
 - Using {% extends template %} responses can be full or partial.
 - The #main content is replaced in every normal hx-get
 - There are two Out Of Band contents: #header and #footer

 The App object
 --------------
 This is the global object with the client side spartan helpers, for example:
   - App.Component: A base class for custom web elements with shadow root.
   - App.define('pa-custom', [class]): registers a custom component, 
     using the cls if provided, or importing a file at the url 'app/components/pa/custom.js'+

Partial page template:
----------------------
{% extends template %}<!-- render inside layout or partial response  -->
{% load sparta static i18n %}
{% block header %}
    {% header "Title" %}
{% endblock %}

{% block footer %}
    <pa-searchbar ></pa-searchbar>
    <!-- no need to App.define('pa-*'), boot or mutation observer will do this -->
    <!-- custom elements must have closing tag -->
{% endblock %}

{% block page %}
<app-part attribute='value' style="height:100%;"></app-part>
<script>
    //This will be run once, redefining a custom element is not possible 
    App.define('app-part', class extends App.Component {
        connectedCallback() {
            this.style.display = 'block';
            //... 

        }
    });

</script>
{% endblock %}


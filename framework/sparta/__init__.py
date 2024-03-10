'''
Libreria django-sparta

In summary, "Simple Page Asynchronous Resourceful Transitioning Application" describes a web development approach or framework that prioritizes simplicity in page design, utilizes asynchronous operations for non-blocking communication, focuses on efficient transitioning between application states, and is intended for building comprehensive web applications with a responsive user experience.

Utilidades para crear Hypermedia Driven Applications

Funcionalidades:
   - Inyecta la variable de contexto "template", para que al hacer {% extends template %} una plantilla sepa si responder la pagina entera, o solo el contenido:
   - Proporciona templatetags con operaciones comunes	


Ejemplo:

main.html: 
	{% load sparta %} <- NO haria FALTA salvo por templatetags
	<html>
		<nav>
			<span {% render 'page1' %}/>
			<span {% render 'page2' %}/>
		</nav>
		<div id='#main'>{% block hda %}</div>
	</html>

inner.html: 
	{% load sparta %}<!--Partial content-->{% block hda %}

page1.html: 
	{% extends template %}<p>1</p>

page2.html: 
	{% extends template %}<p>2</p>





settings.SPARTA = {
	'template': main.html 
	'partial': inner.html
}
{% load django_htmx sparta static i18n %}

available tags:

{{X}} -> Unique request suffix for node id

{% inner %} -> sets id='#main'
{% state '' %} -> set hx-get

custom content process: selects template for html or htmx



custom Midleware:
  - counts request.number for unique node id generation
 - controls response 

Hypermadia 

-> {}


sparta_vuetify
sparta_ionic
sparta_bs

'''
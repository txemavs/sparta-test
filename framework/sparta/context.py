
from django.conf import settings


def processor(request):
    '''

    HX-Request: “true” for htmx-based requests
    HX-Boosted: “true” if using hx-boost
    HX-Current-URL: of the browser
    HX-History-Restore-Request: “true” if the request is for history restoration after a miss in the local history cache
    HX-Prompt: user response to an hx-prompt
    HX-Target: id of the target element if it exists
    HX-Trigger-Name: name of the triggered element if it exists (curiosamente podriamos saber a que request number corresponde)
    HX-Trigger: id of the triggered element if it exists -> 

    {% extends request.htmx|yesno:"ionic/htmx.html,app/ionic.html" %} -> {% extends template %}
    '''

    #template = 'partial' if request.htmx else 'layout'
    partial = request.headers.get('HX-Request')
    template = 'partial' if partial else 'layout'

    
    X = '_'+ hex(request.number)[1:]

    return {
        'template': settings.SPARTA[template],
        'x': '_x',
        'X': X,
        'hx': {
            'request': partial,
            'boosted': request.headers.get('HX-Boosted'),
            'current_url': request.headers.get('HX-Current-URL'),
            'history_restore_request': request.headers.get('HX-History-Restore-Request'),
            'prompt': request.headers.get('HX-Prompt'),
            'target': request.headers.get('HX-Target'),
            'trigger_name': request.headers.get('HX-Trigger-Name'),
            'trigger': request.headers.get('HX-Trigger'),
        }
    }
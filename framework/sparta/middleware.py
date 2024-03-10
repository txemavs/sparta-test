
from django.urls import resolve

class SpartaMiddleware(object):
    '''
    from django.urls import resolve
    
    Podria hacer aqui la jugada de agregar un template a todas las respuestas? NO, aqui ya response viene cocinada.
    
    Lo que si puedo es generar un hipermedia con los errores 404, 500, etc.

    '''
    number = 0

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        SpartaMiddleware.number += 1
        request.number = SpartaMiddleware.number

        partial = request.headers.get('HX-Request')
        
        
        response = self.get_response(request)

        if response.status_code == 404:
            print('404')


        if '/app/' in request.path_info:
            if "HX-Request" in request.headers: 
                response["Cache-Control"] = "no-store, max-age=0"
                target = request.headers.get('HX-Target')
            else:
                target = ''
            print('-> Sparta',request.method, ('#' if partial else ''), target, request.path_info, request.number, response.status_code, response['Content-Type'])
            

        # Add a template to all responses
            
        #response.content = render(request, 'your_template.html', {'response': response}).content
        #url_name = resolve(request.path_info).url_name
        

        return response
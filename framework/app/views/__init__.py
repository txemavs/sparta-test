from django.views import View
from django.shortcuts import render
from django.template.loader import select_template
from django.http import HttpResponse
from django.template import TemplateDoesNotExist
from django.db.models import Q, Count, Subquery, OuterRef, Min, Max, Avg, Sum
from django.urls import path
    

def page(template):

    kwargs = {}

    if '.js' in template:
        kwargs['content_type']='application/javascript'
        filepath = 'app/js/'+template
    else:
        if template[0]=='/':
            filepath = 'app'+template+'.html'
        else:
            filepath = 'app/ionic/'+template+'.html'
        
    class PageView(View):
        def get(self, request):
            return render(request, filepath, **kwargs)
    return PageView.as_view()

class Chat(View):
    '''Render the chat page.
    '''
    def get(self, request):
        return render(request, 'app/chat.html')


class Component(View):
    def get(self, request, file_path):
        custom = file_path.replace('/', '-').replace('.js', '')
        try:
            template = select_template(['app/components/' + file_path, 'sparta/components/404.js'])
            return HttpResponse(template.render({'element':custom}, request), content_type='application/javascript')
        except TemplateDoesNotExist:
            return HttpResponse("Component does not exist", status=404)


def path_data(name, view, data, id=False):
    '''Generate path and path data for a given path.
    '''
    if id:
        params='/<int:pk>'
        extra='-id'
    else:
        params=extra=''

    return [
            path(name+params+'/', view.as_view(), name=name+extra),
            path(name+params+'/data/', data.as_view(), name=name+extra+'-data')
        ]





#from api2new import serializers
#
#class Form(View):
#    def get(self, request, serializer):
#        '''Return a form for a given serializer.
#        '''
#        cls = getattr(serializers, serializer)
#        return render(request, 'app/html/form.html', {
#            'action': '/api/v2/apps/1/releases',
#            'serializer': cls,
#            #'form': cls().as_form()
#        })
    

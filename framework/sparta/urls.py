
from django.views import View
from django.shortcuts import render
from django.template.loader import select_template
from django.http import HttpResponse
from django.template import TemplateDoesNotExist
from django.urls import path, re_path


class Sparta(View):
    def get(self, request):
        return render(request, 'sparta/main.js', content_type='application/javascript' )


class Component(View):
    def get(self, request, file_path):
        custom = file_path.replace('/', '-').replace('.js', '')
        try:
            template = select_template(['sparta/components/' + file_path, 'sparta/components/404.js'])
            return HttpResponse(template.render({'element':custom}, request), content_type='application/javascript')
        except TemplateDoesNotExist:
            return HttpResponse("Component does not exist", status=404)


app_name = "sparta"

urlpatterns = [    
    path('app.js',  Sparta.as_view(), name="sparta-js"),
    re_path(r'^components/(?P<file_path>.+\.js)$', Component.as_view(), name="components-js"),
]

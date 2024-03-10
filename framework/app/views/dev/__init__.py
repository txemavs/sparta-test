import sys
from django.views import View
from django.shortcuts import render
from django.urls.resolvers import RegexPattern, RoutePattern
from rest_framework.views import APIView
from rest_framework.response import Response



def get_urls(url_patterns, depth=0, root=''):
    '''
    app_name y namespace se fuerzan en include.

    '''
    x=[]
    for entry in url_patterns:
        print (entry.pattern)
        if str(entry.pattern) in ["auto/"]: continue
        if entry.callback is not None:

            view = sys.modules[entry.callback.__module__].__name__+'.'

            if entry.callback.__class__.__name__=='instancemethod':
                view+= entry.callback.im_self.__name__+'.'+entry.callback.__name__
            else:
                view+= entry.callback.__name__
                
            doc=""
            cls=""
            ret=""
            if entry.callback.__doc__ is not None: 
                doc = entry.callback.__doc__.split('\n')[0]

                for line in entry.callback.__doc__.split('\n'):
                    if 'cls:' in line: cls = line.replace('cls:','')
                    if 'ret:' in line: ret = line.replace('ret:','')

            match = str(entry.pattern.__class__)
            if isinstance(entry.pattern, RegexPattern):
                match = entry.pattern._regex
            elif isinstance(entry.pattern, RoutePattern):
                match = entry.pattern._route
                
            print('MATCH'+match)
            x.append({
                'id':match,
                'level':depth, 
                'name':entry.pattern.name,
                'view':view, 
                'help':doc, 
                'cls':cls,
                'ret':ret,
                'root':str(root),
                
                })
            print(x)
        if hasattr(entry, 'url_patterns'):
            x+=get_urls(entry.url_patterns, depth + 1, root+ match)
    return x

class Routes(View):
    def get(self, request):
        return render(request, "app/ionic/dev/routes.html")




def routes_data(urlpatterns):

    class RoutesData(APIView):
        '''Instrospection of all paths.
        '''
        def get(self, request):       
            return Response(get_urls(urlpatterns))
        
    return RoutesData



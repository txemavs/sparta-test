app_name = "app"

from django.urls import path, re_path
from app import views


urlpatterns = [
    path('',                            views.page('/index'), name="home"),
    path('chat/',                       views.Chat.as_view(), name="terminal"),
    path('table/',                            views.page('/tabulator'), name="table"),
    path('tabtree/',                            views.page('/tabtree'), name="tabtree"),


#    path('form/<serializer>',           Form.as_view(), name="drf-forms"),
    
#    path('main.js',                     page('main.js'), name="main-js"),
#    re_path(r'^components/(?P<file_path>.+\.js)$', Component.as_view(), name="components-js"),

#    path('companies/',                  tools.companies.Companies.as_view(), name="companies"),
#    path('companies/data/',             tools.companies.CompaniesData.as_view(), name="companies-data"),
#    path('global-variables/',           tools.variables.Globals.as_view(), name="crypto-codes"),
#    path('inject/',                     page('tools/inject'), name="inject"),    
#    path('map/',                        tools.Map.as_view(), name="map"),
#    path('map/<int:company_id>/data/',  tools.MapCompanyData.as_view(), name="map"),
#    *path_data('apps',                  tools.apps.Apps, tools.apps.AppsData),
#    *path_data('files',                 tools.files.Files, tools.files.FilesData),
#    *path_data('products',              tools.products.Versions, tools.products.VersionsData),
#    *path_data('sites',                 tools.sites.Sites, tools.sites.SitesData),
#    *path_data('sites',                 tools.sites.Sites, tools.sites.SiteData, id='pk'),
#    *path_data('users',                 tools.users.Users, tools.users.UsersData),
]


#Dev only
#from app.views import dev
#urlpatterns += [
#    path('kevin/',                  page('dev/kevin'), name="kevin"),
#    path('endpoints/',              page('dev/endpoints'), name="endpoints"),
#    path('terminal/',               page('dev/terminal'), name="terminal"),
#    path('api/',                        dev.API.as_view(), name="routes"),
#]
    
#from api2new.urls import urlpatterns as new_api 

#urlpatterns += [*path_data('routes', dev.Routes, dev.routes_data(new_api))]



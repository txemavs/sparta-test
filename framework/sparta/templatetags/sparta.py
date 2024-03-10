from django import template
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

register = template.Library()

@register.filter
def jsid(value):
    return value.replace(' ', '_')

@register.simple_tag
def part(path, target='main'):
    return mark_safe(f" hx-swap='innerHTML transition:true' hx-get='{path}' hx-push-url='{path}' hx-eval='true' hx-target='#{target}'")

@register.filter
def _id(value, request):
    print(dir(request.htmx))
    return f"{value}_{id(request.htmx)}"

@register.simple_tag
def identify(request):
    #mark_safe(f"_{id(request)}")
    return request.number

    
@register.simple_tag
def target(request):
    ''' Get htmx target element id.
    '''
    if request.htmx:
        return request.htmx.target
    else:
        return ""
    

@register.simple_tag
def modal(path):
    return mark_safe(f""" onclick='App.modal_path("{path}")' """)



@register.simple_tag
def app_menuitem(icon, text, path):
    ''' Menu item template tag.
    MAIN EMPTY ON BACK!
    '''
    return mark_safe(f'''
    <ion-item hx-swap='innerHTML transition:true' hx-get='{path}' hx-push-url='{path}' hx-eval='true' hx-swap-oob='true'>
        <ion-icon slot='start' name='{icon}'></ion-icon>{_(text)}
    </ion-item>
    ''')

UI = 'sparta/ui/ionic/tag'

@register.inclusion_tag(UI+'/header.html', takes_context=True)
def header(context, title, header=True, actions=None):
    ''' Menu item template tag. '''
    X = context.get('X', 0)
    return {'title': title, 'header': header, 'actions': actions, 'X': X}


@register.inclusion_tag(UI+'/footer.html', takes_context=True)
def footer(context):
    return context


@register.simple_tag
def app_grid_column_defs(columns):
    ''' Grid column definitions template tag.
    '''
    fields = []
    for key, p in columns.items():
        if p:
            if not 'field' in p: p['field'] = key
            if not 'headerName' in p: p['headerName'] = key.title()
            p['headerName'] = _(p['headerName'])
            fields.append(str(p))
        else:
            fields.append(f"{{ field: '{key}', headerName: '{_(key.title())}' }}")
    cr='\n'+' '*8
    return mark_safe('*/'+cr+'columnDefs: ['+cr+(','+cr+' ').join(fields)+cr+'],'+cr+'/* END ')


@register.inclusion_tag('app/ionic/block/grid.html', takes_context=True)
def app_grid(context, name, fetch, columns=None, theme='balham'):
    ''' {% aggrid 'grid-apps' columns '/app/apps/data/' %} '''
    
    default = {'id': {'field': 'id', 'headerName': 'ID'}}
    return {
        'id': name, 
        'theme': context.get('theme', theme), 
        'fetch': fetch, 
        'columns': columns or default, 
        'X': context.get('X', 0)
    }







#Testing

@register.inclusion_tag('app/ionic/block/card.html')
def card(title, subtitle):
    return {'title': title, 'subtitle': subtitle}

@register.tag(name="upper")
def do_upper(parser, token):
    nodelist = parser.parse(('endupper',))
    parser.delete_first_token()
    return UpperNode(nodelist)

class UpperNode(template.Node):
    def __init__(self, nodelist):
        self.nodelist = nodelist
    def render(self, context):
        output = self.nodelist.render(context)
        return output.upper()
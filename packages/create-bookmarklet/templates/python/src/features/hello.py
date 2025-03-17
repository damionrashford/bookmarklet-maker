
from browser import document, html, alert

def create_interface():
    container = html.DIV(style={
        'background': 'white',
        'padding': '20px',
        'border-radius': '8px',
        'box-shadow': '0 2px 10px rgba(0,0,0,0.1)'
    })

    title = html.H1("Python Bookmarklet", style={'margin': '0 0 15px 0'})
    button = html.BUTTON("Click Me", Class="btn-primary")

    def handle_click(ev):
        alert("Hello from Python!")

    button.bind('click', handle_click)

    container <= title
    container <= button

    return container

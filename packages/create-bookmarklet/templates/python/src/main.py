
from browser import document, html, window
from features.hello import create_interface

root = html.DIV(id="brython-root")
document <= root

# Add styles
root.style.cssText = '''
  all: initial;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2147483647;
  font-family: system-ui, sans-serif;
'''

# Create UI
interface = create_interface()
root <= interface

# Handle cleanup
window.addEventListener('beforeunload', lambda e: window._bookmarkletCleanup())

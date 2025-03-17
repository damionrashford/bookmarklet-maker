
import { createHello } from './features/hello';

declare global {
    interface Window {
        _bookmarkletCleanup: () => void;
    }
}

// Initialize bookmarklet UI
const root = document.createElement('div');
root.id = 'ts-root';
Object.assign(root.style, {
    all: 'initial',
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '2147483647',
    fontFamily: 'system-ui, sans-serif'
});

// Create and append content
const helloElement = createHello({
    title: 'TypeScript Bookmarklet',
    buttonText: 'Click Me!',
    onButtonClick: () => alert('Hello from TypeScript!')
});
root.appendChild(helloElement);

document.body.prepend(root);

// Cleanup handler
window._bookmarkletCleanup = () => {
    root.remove();
};


import { createHello } from './features/hello.js';

// Root container setup
const root = document.createElement('div');
root.id = 'js-root';
root.style.cssText = `
    all: initial;
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2147483647;
`;

// Add hello component
root.appendChild(createHello());
document.body.prepend(root);

// Cleanup handler
window._bookmarkletCleanup = () => {
    root.remove();
};


import React from 'react';
import { createRoot } from 'react-dom/client';
import Hello from './features/hello';

const root = document.createElement('div');
root.id = 'react-root';
root.style.cssText = `
  all: initial;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2147483647;
  font-family: system-ui, sans-serif;
`;
document.body.prepend(root);

const reactRoot = createRoot(root);
reactRoot.render(<Hello />);

window._bookmarkletCleanup = () => {
  reactRoot.unmount();
  root.remove();
};

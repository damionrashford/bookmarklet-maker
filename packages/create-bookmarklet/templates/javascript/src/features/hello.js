
export function createHello() {
    const container = document.createElement('div');
    container.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-family: system-ui, sans-serif;
    `;

    const title = document.createElement('h1');
    title.textContent = 'JavaScript Bookmarklet';
    title.style.margin = '0 0 15px 0';

    const button = document.createElement('button');
    button.textContent = 'Click Me';
    button.style.cssText = `
        padding: 8px 16px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    button.addEventListener('click', () => {
        alert('Hello from JavaScript!');
    });

    container.appendChild(title);
    container.appendChild(button);
    return container;
}

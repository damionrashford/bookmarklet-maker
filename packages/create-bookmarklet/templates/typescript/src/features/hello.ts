
interface HelloProps {
    title: string;
    buttonText: string;
    onButtonClick: () => void;
}

export function createHello(props: HelloProps): HTMLElement {
    const container = document.createElement('div');
    Object.assign(container.style, {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    });

    // Title
    const title = document.createElement('h1');
    title.textContent = props.title;
    Object.assign(title.style, {
        margin: '0 0 15px 0',
        fontSize: '1.2rem',
        color: '#333'
    });

    // Button
    const button = document.createElement('button');
    button.textContent = props.buttonText;
    Object.assign(button.style, {
        padding: '8px 16px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });
    button.addEventListener('click', props.onButtonClick);

    // Assembly
    container.appendChild(title);
    container.appendChild(button);

    return container;
}


// Minimal JSX runtime for React bookmarklets
export function jsx(type, props, key) {
    const { children = [], ...rest } = props || {};
    return {
        $$typeof: Symbol.for('react.element'),
        type,
        props: { ...rest, children: Array.isArray(children) ? children : [children] },
        key: key ?? null,
        ref: null,
    };
}

export const jsxs = jsx; // For multiple children
export const Fragment = 'fragment'; // Simple fragment support


import React, { useState } from 'react';

export default function Hello() {
    const [count, setCount] = useState(0);

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <h1 style={{ margin: '0 0 15px 0' }}>React Bookmarklet</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setCount(c => c + 1)}
                    style={buttonStyle}
                >
                    Count: {count}
                </button>
                <button
                    onClick={() => window._bookmarkletCleanup()}
                    style={{ ...buttonStyle, background: '#dc3545' }}
                >
                    Remove
                </button>
            </div>
        </div>
    );
}

const buttonStyle = {
    padding: '8px 16px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':hover': {
        opacity: 0.9
    }
};

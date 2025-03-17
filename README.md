# Bookmarklet Maker

[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://shields.io/)

Bookmarklet Maker is a toolkit for creating and managing bookmarklets. It includes a CLI tool (`create-bookmarklet`) for generating new bookmarklets in various languages (JavaScript, TypeScript, React, Python, Ruby), a shared runtime for common functionality, and a collection of pre-built bookmarklets.

## Features

*   **Multi-Language Support:** Create bookmarklets in JavaScript, TypeScript, React, Python, or Ruby.
*   **`create-bookmarklet` CLI:** Quickly generate new bookmarklet projects with pre-configured build processes.
*   **Shared Runtime:** Includes a minimal JSX runtime for React bookmarklets.
*   **Pre-built Bookmarklets:** Comes with ready-to-use bookmarklets for common tasks.
*   **Easy Build Process:**  `npm run build` handles minification and bundling.
*   **Extensible:** Add support for new languages or features.

## Getting Started

### Prerequisites

*   **Node.js and npm:**  Install from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone:**

    ```bash
    git clone <your-repository-url>
    cd bookmarklet-maker
    ```

2.  **Install:**

    ```bash
    npm install
    ```

### Creating New Bookmarklets (CLI)

1.  **Link the CLI (One-Time):**

    ```bash
    cd packages/create-bookmarklet
    npm link
    ```

2.  **Create:**

    ```bash
    create-bookmarklet
    ```

    Follow the prompts.

3.  **Build:**

    ```bash
    cd <your-project-name>
    npm install
    npm run build
    ```

    Copy the *minified* code from `dist/index.min.js` into a new browser bookmark.

### Using Pre-built Bookmarklets

Pre-built bookmarklets are located in the `packages/bookmarklets/packages` directory.  Each bookmarklet has its own directory containing:

*   `dist/index.min.js`: The minified, ready-to-use bookmarklet code.  Copy this into your browser's bookmark URL.
*   `README.md`:  Specific instructions and details for that bookmarklet.

To build the pre-built bookmarklets:

```bash
cd packages/bookmarklets
npm run build
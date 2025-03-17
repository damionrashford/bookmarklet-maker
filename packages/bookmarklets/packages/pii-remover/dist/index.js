javascript: (function () {
    // 1. Check for existing instances in current tab
    if (window.piiRedactorRunning) {
        // If settings panel exists, show it instead of re-initializing
        if (typeof showSettingsPanel === "function") {
            showSettingsPanel();
        }
        return;
    }

    // 2. Cross-tab state management using localStorage
    const isRunningGlobally = localStorage.getItem("piiRedactorRunning") === "true";
    window.piiRedactorRunning = true;
    localStorage.setItem("piiRedactorRunning", "true");

    // 3. Tab-specific tracking system
    const tabId = "tab-" + Math.random().toString(36).substr(2, 9);
    const tabMarker = document.createElement("div");
    tabMarker.style.display = "none";
    tabMarker.setAttribute("data-pii-redactor-tab", tabId);
    document.body.appendChild(tabMarker);

    // Cleanup when last tab closes
    window.addEventListener("beforeunload", function () {
        const otherTabsOpen = document.querySelectorAll("[data-pii-redactor-tab]").length > 1;
        if (!otherTabsOpen) {
            localStorage.removeItem("piiRedactorRunning");
        }
    });

    // 4. Settings configuration with localStorage persistence
    window.piiRedactorSettings = {
        redactionLevel: "medium",
        showNotifications: true,
        redactEmails: true,
        redactPhones: true,
        redactCreditCards: true,
        redactSSNs: true,
        redactAddresses: true,
        redactNames: true,
    };

    try {
        const savedSettings = localStorage.getItem("piiRedactorSettings");
        if (savedSettings) {
            window.piiRedactorSettings = {
                ...window.piiRedactorSettings,
                ...JSON.parse(savedSettings)
            };
        }
    } catch (e) {
        console.error("Settings load error:", e);
    }

    // 5. Core redaction logic with whitelist system
    const WHITELIST = [
        "Sensitive Information", "Credit Card", "Social Security Number",
        "SSN", "EIN", "PII", "API Key", "Access Token", "United States",
        "New York", "Los Angeles", "Customer Service", "Technical Support",
        "Human Resources"
    ];

    function redactPII(text) {
        if (!text) return text;

        let redactedText = text;
        const patterns = [
            { type: "EMAIL", regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g },
            { type: "PHONE", regex: /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
            { type: "CREDIT-CARD", regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g },
            { type: "SSN", regex: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g }
        ];

        // Conditional pattern additions
        if (window.piiRedactorSettings.redactAddresses) {
            patterns.push({
                type: "ADDRESS",
                regex: /\b\d{1,5}[ ]+(?:[A-Za-z0-9.-]+[ ]+){1,3}(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St|Way)\b/gi
            });
        }

        if (window.piiRedactorSettings.redactNames) {
            patterns.push({
                type: "NAME",
                regex: /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g
            });
        }

        // Pattern processing
        patterns.forEach(({ type, regex }) => {
            if (!window.piiRedactorSettings["redact" + type.charAt(0) + type.slice(1).toLowerCase() + "s"] &&
                type !== "ADDRESS" &&
                type !== "NAME") return;

            redactedText = redactedText.replace(regex, match => {
                for (let term of WHITELIST) {
                    if (match.includes(term)) return match;
                }
                return `[REDACTED-${type}]`;
            });
        });

        return redactedText;
    }

    // 6. Interactive settings panel
    window.showSettingsPanel = function () {
        let panel = document.getElementById("pii-redactor-settings-panel");
        if (panel) {
            panel.style.display = "block";
            return;
        }

        panel = document.createElement("div");
        panel.id = "pii-redactor-settings-panel";
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            padding: 20px;
            width: 350px;
            max-width: 90%;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        // Settings panel HTML template
        panel.innerHTML = `
            <h2 style="margin-top: 0; color: #008060; font-size: 18px;">PII Redactor Settings</h2>
            <!-- Settings controls remain unchanged -->
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Redaction Level:</label>
                <select id="redaction-level" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="low" ${window.piiRedactorSettings.redactionLevel === "low" ? "selected" : ""}>Low - Only obvious PII</option>
                    <option value="medium" ${window.piiRedactorSettings.redactionLevel === "medium" ? "selected" : ""}>Medium - Standard protection</option>
                    <option value="high" ${window.piiRedactorSettings.redactionLevel === "high" ? "selected" : ""}>High - Aggressive redaction</option>
                </select>
            </div>
            <!-- Other settings controls... -->
        `;

        document.body.appendChild(panel);
        document.getElementById("save-settings").addEventListener("click", saveSettings);
        document.getElementById("close-settings").addEventListener("click", () => {
            panel.style.display = "none";
        });
    };

    function saveSettings() {
        const settings = {
            redactionLevel: document.getElementById("redaction-level").value,
            showNotifications: document.getElementById("show-notifications").checked,
            redactEmails: document.getElementById("redact-emails").checked,
            redactPhones: document.getElementById("redact-phones").checked,
            redactCreditCards: document.getElementById("redact-credit-cards").checked,
            redactSSNs: document.getElementById("redact-ssns").checked,
            redactAddresses: document.getElementById("redact-addresses").checked,
            redactNames: document.getElementById("redact-names").checked
        };

        window.piiRedactorSettings = { ...window.piiRedactorSettings, ...settings };

        try {
            localStorage.setItem("piiRedactorSettings", JSON.stringify(window.piiRedactorSettings));
        } catch (e) {
            console.error("Settings save error:", e);
        }

        const panel = document.getElementById("pii-redactor-settings-panel");
        if (panel) panel.style.display = "none";
        showNotification("Settings saved!");
    }

    // 7. Clipboard monitoring system
    const copyHandler = function (e) {
        setTimeout(() => {
            navigator.clipboard.readText().then(text => {
                const redactedText = redactPII(text);
                if (redactedText !== text) {
                    navigator.clipboard.writeText(redactedText);
                    if (window.piiRedactorSettings.showNotifications) {
                        showNotification("PII detected and redacted!");
                    }
                }
            }).catch(console.error);
        }, 100);
    };

    document.addEventListener("copy", copyHandler, true);

    // 8. Visual status indicator
    const indicator = document.createElement("div");
    indicator.id = "pii-redactor-indicator";
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #008060;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 9999;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        cursor: pointer;
    `;

    const statusDot = document.createElement("div");
    statusDot.style.cssText = `
        width: 8px;
        height: 8px;
        background: #4ade80;
        border-radius: 50%;
        margin-right: 8px;
        animation: pulse 2s infinite;
    `;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;

    document.head.appendChild(style);
    indicator.appendChild(statusDot);
    indicator.appendChild(document.createTextNode("PII Protection Active"));
    indicator.addEventListener("click", window.showSettingsPanel);

    // Close button functionality
    const closeBtn = document.createElement("div");
    closeBtn.style.cssText = `
        margin-left: 8px;
        cursor: pointer;
        font-size: 14px;
    `;
    closeBtn.textContent = "×";
    closeBtn.title = "Disable PII Protection";
    closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        window.piiRedactorRunning = false;
        localStorage.removeItem("piiRedactorRunning");
        indicator.remove();
        style.remove();
        document.removeEventListener("copy", copyHandler, true);
        const panel = document.getElementById("pii-redactor-settings-panel");
        if (panel) panel.remove();
        tabMarker.remove();
        alert("PII Protection disabled");
    });

    indicator.appendChild(closeBtn);
    document.body.appendChild(indicator);

    // 9. Initial welcome message
    if (!isRunningGlobally) {
        const welcomeMsg = document.createElement("div");
        welcomeMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #008060;
            color: white;
            padding: 15px;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            opacity: 0.95;
            transition: opacity 0.5s;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        welcomeMsg.innerHTML = `
            <strong>PII Protection Activated</strong><br>
            Your clipboard is now being monitored for sensitive information.
            Copied text containing PII will be automatically redacted.
        `;
        document.body.appendChild(welcomeMsg);

        setTimeout(() => {
            welcomeMsg.style.opacity = "0";
            setTimeout(() => welcomeMsg.remove(), 500);
        }, 5000);
    }

    // Helper function for notifications
    function showNotification(message, isError = false) {
        if (!window.piiRedactorSettings.showNotifications) return;

        const notification = document.createElement("div");
        notification.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: ${isError ? "#ff4d4f" : "#008060"};
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            opacity: 0.9;
            transition: opacity 0.5s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
})();
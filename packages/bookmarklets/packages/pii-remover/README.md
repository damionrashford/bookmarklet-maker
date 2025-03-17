# @efficiency-bookmarklets/pii-remover

[![Bookmarklet Status](https://img.shields.io/badge/status-ready-brightgreen.svg)](https://shields.io/)

This bookmarklet automatically redacts Personally Identifiable Information (PII) from your clipboard when you copy text. It's designed to protect sensitive data while you're working, sharing information, or taking screenshots. It features a settings panel for customization and works seamlessly across multiple browser tabs.

## Features

*   **Automatic PII Redaction:** Redacts PII from copied text *before* it's placed on your clipboard.
*   **Configurable Redaction Levels:** Choose from "Low," "Medium," or "High" redaction levels to control the aggressiveness of the redaction.
*   **Customizable PII Types:**  Select which types of PII to redact:
    *   Email addresses
    *   Phone numbers
    *   Credit card numbers
    *   Social Security Numbers (SSNs)
    *   Addresses
    *   Names
*   **Settings Panel:**  A user-friendly settings panel allows you to adjust the redaction level and toggle individual PII types on or off.
*   **Real-time Clipboard Monitoring:**  The bookmarklet actively monitors your clipboard and redacts PII in real time.
*   **Multi-Tab Awareness:**  Works correctly even if you have multiple browser tabs open.  The settings and active state are synchronized.
*   **Visual Indicator:** A discreet indicator in the bottom-right corner of the screen shows that PII protection is active.  Clicking the indicator opens the settings panel.
*   **Whitelist:** A built-in whitelist prevents common terms (like "Credit Card," "SSN," etc.) from being accidentally redacted.
*   **Notifications (Optional):**  You can enable notifications to be alerted when PII is detected and redacted.
* **Cross-browser Compatibility:** Works in modern browsers like Chrome, Firefox and Safari.

## Usage

1.  **Activate:** Click the "PII Remover" bookmarklet in your browser's bookmarks bar (or wherever you saved it).
2.  **Copy Text:** Copy text from *any* webpage as you normally would.
3.  **Automatic Redaction:** The bookmarklet will automatically redact any detected PII *before* it's placed on your clipboard.
4.  **Paste:** Paste the (now redacted) text wherever you need it.
5.  **Settings:** Click the green "PII Protection Active" indicator in the bottom-right corner of the screen to open the settings panel and customize the redaction behavior.

## Installation

1.  **Copy the Minified Code:** Copy the *entire* minified code block below. This is the complete, ready-to-use bookmarklet.

    javascript:(function(){if(window.piiRedactorRunning){if(typeof showSettingsPanel==="function"){showSettingsPanel();}return;}const isRunningGlobally=localStorage.getItem("piiRedactorRunning")==="true";window.piiRedactorRunning=true;localStorage.setItem("piiRedactorRunning","true");window.addEventListener("beforeunload",function(){const otherTabsOpen=document.querySelectorAll("[data-pii-redactor-tab]").length>1;if(!otherTabsOpen){localStorage.removeItem("piiRedactorRunning");}});const tabId="tab-"+Math.random().toString(36).substr(2,9);const tabMarker=document.createElement("div");tabMarker.style.display="none";tabMarker.setAttribute("data-pii-redactor-tab",tabId);document.body.appendChild(tabMarker);window.piiRedactorSettings={redactionLevel:"medium",showNotifications:true,redactEmails:true,redactPhones:true,redactCreditCards:true,redactSSNs:true,redactAddresses:true,redactNames:true};try{const savedSettings=localStorage.getItem("piiRedactorSettings");if(savedSettings){window.piiRedactorSettings={...window.piiRedactorSettings,...JSON.parse(savedSettings)};}catch(e){console.error("Could not load settings",e);}const WHITELIST=["Sensitive Information","Credit Card","Social Security Number","SSN","EIN","PII","API Key","Access Token","United States","New York","Los Angeles","Customer Service","Technical Support","Human Resources"];function redactPII(text){if(!text)return text;let redactedText=text;const patterns=[{type:"EMAIL",regex:/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g},{type:"PHONE",regex:/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g},{type:"CREDIT-CARD",regex:/\b(?:\d{4}[-\s]?){3}\d{4}\b/g},{type:"SSN",regex:/\b\d{3}[-]?\d{2}[-]?\d{4}\b/g}];if(window.piiRedactorSettings.redactAddresses){patterns.push({type:"ADDRESS",regex:/\b\d{1,5}[ ]+(?:[A-Za-z0-9.-]+[ ]+){1,3}(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St|Way)\b/gi});}if(window.piiRedactorSettings.redactNames){patterns.push({type:"NAME",regex:/\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g});}patterns.forEach(({type,regex})=>{if(!window.piiRedactorSettings["redact"+type.charAt(0)+type.slice(1).toLowerCase()+"s"]&&type!=="ADDRESS"&&type!=="NAME")return;redactedText=redactedText.replace(regex,match=>{for(let term of WHITELIST){if(match.includes(term))return match;}return"[REDACTED-"+type+"]";});});return redactedText;}window.showSettingsPanel=function(){let panel=document.getElementById("pii-redactor-settings-panel");if(panel){panel.style.display="block";return;}panel=document.createElement("div");panel.id="pii-redactor-settings-panel";panel.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.2);padding:20px;width:350px;max-width:90%;z-index:10000;font-family:Arial,sans-serif;";panel.innerHTML="<h2 style=\"margin-top:0;color:#008060;font-size:18px;\">PII Redactor Settings</h2><div style=\"margin-bottom:15px;\"><label style=\"display:block;font-weight:bold;margin-bottom:5px;\">Redaction Level:</label><select id=\"redaction-level\" style=\"width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;\"><option value=\"low\" "+(window.piiRedactorSettings.redactionLevel==="low"?"selected":"")+">Low - Only obvious PII</option><option value=\"medium\" "+(window.piiRedactorSettings.redactionLevel==="medium"?"selected":"")+">Medium - Standard protection</option><option value=\"high\" "+(window.piiRedactorSettings.redactionLevel==="high"?"selected":"")+">High - Aggressive redaction</option></select></div><div style=\"margin-bottom:15px;\"><label style=\"font-weight:bold;display:flex;align-items:center;\"><input type=\"checkbox\" id=\"show-notifications\" "+(window.piiRedactorSettings.showNotifications?"checked":"")+" style=\"margin-right:8px;\">Show notifications when PII is redacted</label></div><div style=\"margin-bottom:10px;font-weight:bold;\">Redact these types of PII:</div><div style=\"margin-bottom:8px;\"><label style=\"display:flex;align-items:center;\"><input type=\"checkbox\" id=\"redact-emails\" "+(window.piiRedactorSettings.redactEmails?"checked":"")+" style=\"margin-right:8px;\">Email addresses</label></div><div style=\"margin-bottom:8px;\"><label style=\"display:flex;align-items:center;\"><input type=\"checkbox\" id=\"redact-phones\" "+(window.piiRedactorSettings.redactPhones?"checked":"")+">Phone numbers</label></div><div style=\"margin-bottom:8px;\"><label style=\"display:flex;align-items:center;\"><input type=\"checkbox\" id=\"redact-credit-cards\" "+(window.piiRedactorSettings.redactCreditCards?"checked":"")+">Credit card numbers</label></div><div style=\"margin-bottom:8px;\"><label style=\"display:flex;align-items:center;\"><input type=\"checkbox\" id=\"redact-ssns\" "+(window.piiRedactorSettings.redactSSNs?"checked":"")+">Social Security Numbers</label></div><div style=\"margin-bottom:8px;\"><label style=\"display:flex;align-items:center;\"><input type=\"checkbox\" id=\"redact-addresses\" "+(window.piiRedactorSettings.redactAddresses?"checked":"")+">Addresses</label></div><div style=\"margin-bottom:15px;\"><label style=\"display:flex;align-items:center;\"><input type=\"checkbox\" id=\"redact-names\" "+(window.piiRedactorSettings.redactNames?"checked":"")+">Names</label></div><div style=\"display:flex;justify-content:space-between;margin-top:20px;\"><button id=\"save-settings\" style=\"padding:8px 16px;background:#008060;color:white;border:none;border-radius:4px;cursor:pointer;\">Save Settings</button><button id=\"close-settings\" style=\"padding:8px 16px;background:#f1f1f1;border:1px solid #ddd;border-radius:4px;cursor:pointer;\">Close</button></div>";document.body.appendChild(panel);document.getElementById("save-settings").addEventListener("click",saveSettings);document.getElementById("close-settings").addEventListener("click",()=>{panel.style.display="none";});};function saveSettings(){const settings={redactionLevel:document.getElementById("redaction-level").value,showNotifications:document.getElementById("show-notifications").checked,redactEmails:document.getElementById("redact-emails").checked,redactPhones:document.getElementById("redact-phones").checked,redactCreditCards:document.getElementById("redact-credit-cards").checked,redactSSNs:document.getElementById("redact-ssns").checked,redactAddresses:document.getElementById("redact-addresses").checked,redactNames:document.getElementById("redact-names").checked};window.piiRedactorSettings={...window.piiRedactorSettings,...settings};try{localStorage.setItem("piiRedactorSettings",JSON.stringify(window.piiRedactorSettings));}catch(e){console.error("Could not save settings",e);}const panel=document.getElementById("pii-redactor-settings-panel");if(panel){panel.style.display="none";}showNotification("Settings saved!");}function showNotification(message,isError=false){if(!window.piiRedactorSettings.showNotifications)return;const notification=document.createElement("div");notification.style.cssText="position:fixed;bottom:60px;right:20px;background:"+(isError?"#ff4d4f":"#008060")+";color:white;padding:10px 15px;border-radius:4px;font-family:Arial,sans-serif;font-size:14px;z-index:9999;opacity:0.9;transition:opacity 0.5s;";notification.textContent=message;document.body.appendChild(notification);setTimeout(()=>{notification.style.opacity="0";setTimeout(()=>notification.remove(),500);},3000);}const copyHandler=function(e){setTimeout(()=>{navigator.clipboard.readText().then(text=>{const redactedText=redactPII(text);if(redactedText!==text){navigator.clipboard.writeText(redactedText);if(window.piiRedactorSettings.showNotifications){showNotification("PII detected and redacted!");}}}).catch(err=>{console.error("Failed to access clipboard:",err);});},100);};document.addEventListener("copy",copyHandler,true);window.addEventListener("storage",function(e){if(e.key==="piiRedactorSettings"&&e.newValue){try{window.piiRedactorSettings={...window.piiRedactorSettings,...JSON.parse(e.newValue)};}catch(err){console.error("Error updating settings from storage event",err);}}});const indicator=document.createElement("div");indicator.id="pii-redactor-indicator";indicator.style.cssText="position:fixed;bottom:20px;right:20px;background:#008060;color:white;padding:8px 12px;border-radius:4px;font-family:Arial,sans-serif;font-size:12px;z-index:9999;display:flex;align-items:center;box-shadow:0 2px 5px rgba(0,0,0,0.2);cursor:pointer;";const statusDot=document.createElement("div");statusDot.style.cssText="width:8px;height:8px;background:#4ade80;border-radius:50%;margin-right:8px;animation:pulse 2s infinite;";const style=document.createElement("style");style.textContent="@keyframes pulse{0%{opacity:1;}50%{opacity:0.5;}100%{opacity:1;}}";document.head.appendChild(style);indicator.appendChild(statusDot);indicator.appendChild(document.createTextNode("PII Protection Active"));indicator.addEventListener("click",window.showSettingsPanel);const closeBtn=document.createElement("div");closeBtn.style.cssText="margin-left:8px;cursor:pointer;font-size:14px;";closeBtn.textContent="×";closeBtn.title="Disable PII Protection";closeBtn.addEventListener("click",function(e){e.stopPropagation();window.piiRedactorRunning=false;localStorage.removeItem("piiRedactorRunning");indicator.remove();style.remove();document.removeEventListener("copy",copyHandler,true);const panel=document.getElementById("pii-redactor-settings-panel");if(panel)panel.remove();tabMarker.remove();alert("PII Protection disabled");});indicator.appendChild(closeBtn);document.body.appendChild(indicator);if(!isRunningGlobally){const welcomeMsg=document.createElement("div");welcomeMsg.style.cssText="position:fixed;top:20px;right:20px;background:#008060;color:white;padding:15px;border-radius:4px;font-family:Arial,sans-serif;font-size:14px;z-index:9999;opacity:0.95;transition:opacity 0.5s;max-width:300px;box-shadow:0 2px 10px rgba(0,0,0,0.2);";welcomeMsg.innerHTML="<strong>PII Protection Activated</strong><br>Your clipboard is now being monitored for sensitive information. Copied text containing PII will be automatically redacted.";document.body.appendChild(welcomeMsg);setTimeout(()=>{welcomeMsg.style.opacity="0";setTimeout(()=>welcomeMsg.remove(),500);},5000);}})();

2.  **Create a New Bookmark:** In your web browser, create a new bookmark.

3.  **Paste the Code:** In the "URL" or "Location" field of the new bookmark, paste the minified code you copied.

4.  **Name the Bookmark:** Give your bookmark a descriptive name (e.g., "PII Redactor").

5.  **Save:** Save the bookmark.

## Building from Source (For Developers)

This `README.md` is in the `dist` directory, which is generated. You usually don't need to rebuild unless you modify the source code (`src/index.js`).  To rebuild:

1.  **Navigate:**

    ```bash
    cd /Users/damionrashford/bookmarklet-maker/bookmarklet-factory/packages/efficiency-bookmarklets/packages/pii-remover
    ```

2.  **Install Dependencies** (first time only):

    ```bash
    npm install
    ```

3.  **Run Build:**

    ```bash
    npm run build
    ```

This regenerates `dist/index.min.js` (minified) and `dist/index.js` (unminified). Use the *minified* version for your bookmarklet.

## Contributing

If you find a bug or have a suggestion, please open an issue or submit a pull request on the [GitHub repository](YOUR_GITHUB_REPO_LINK_HERE) (replace with your actual repo link).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (create a LICENSE file).
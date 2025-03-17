javascript: (function () {
    // 1. Search priority 1: DOM elements with request-id/error-details
    var id;
    var elements = document.querySelectorAll(
        '[class*="request-id"],[id*="request-id"],' +
        '[class*="error-details"],[id*="error-details"]'
    );

    // Check element text content for request ID pattern
    Array.from(elements).some(function (el) {
        var text = el.textContent;
        var match = text.match(/Request[\s-]*ID:?[\s:]*([a-f0-9-]+)/i);
        if (match) {
            id = match[1];
            return true; // Stop searching if found
        }
        return false;
    });

    // 2. Search priority 2: Meta tags
    if (!id) {
        var meta = document.querySelector(
            'meta[name="request-id"],meta[name="RequestId"]'
        );
        if (meta) {
            id = meta.getAttribute('content');
        }
    }

    // 3. Search priority 3: Full page text
    if (!id) {
        var bodyText = document.body.innerText;
        var match = bodyText.match(/Request[\s-]*ID:?[\s:]*([a-f0-9-]+)/i);
        if (match) {
            id = match[1];
        }
    }

    // 4. Handle results
    if (id) {
        // Open Observe investigation with found ID
        var observeUrl = 'https://observe.shopify.io/a/observe/investigate/requests?any_id=' + id;
        window.open(observeUrl, '_blank');
    } else {
        alert('No Request ID found');
    }
})();
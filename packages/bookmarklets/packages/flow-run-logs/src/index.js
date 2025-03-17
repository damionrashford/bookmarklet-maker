javascript: (function () {
    // Extract the current URL path
    const path = window.location.pathname;

    // Regular expression to match Flow activity page format
    const m = path.match(/\/apps\/flow\/activity\/([^\/\?]+)/);

    // Check if we're on a valid Flow activity page
    if (!m) {
        alert('Not a Flow activity page');
        return;
    }

    // Extract the run ID from URL match
    const run_id = m[1];

    // Base URL for Flow run logs
    const base_url = 'https://flow.shopifycloud.com/internal/support/workflow_run_logs';

    // Prepare query parameters
    const params = new URLSearchParams();
    params.set('workflow_run_logs[run_id]', run_id);
    params.set('operation', 'View');

    // Construct final URL and open in new tab
    const new_url = base_url + '?' + params.toString();
    window.open(new_url, '_blank');
})();
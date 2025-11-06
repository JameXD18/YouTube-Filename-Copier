// Function to check if the new URL is a YouTube Studio video editing page
function isStudioVideoEditPage(url) {
    return url && url.startsWith('https://studio.youtube.com/') && url.includes('/video/') && url.includes('/edit');
}

console.log('[Background] Service Worker is now relying on "all_frames" injection.');

// **********************************************
// ******* NEW: Listener for Content Script Status ******
// **********************************************
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.status) {
        // Log the status in the persistent Service Worker Console
        console.log(`[Content Status] ${message.status}`);
    }
});

console.log('[Background] Service Worker started.');


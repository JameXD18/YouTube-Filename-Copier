document.getElementById('copyButton').addEventListener('click', () => {
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tab = tabs[0];
        const tabUrl = tab.url;

        // 1. Check if we are on a valid YouTube Studio video edit page
        if (!tabUrl.startsWith('https://studio.youtube.com/video/') || !tabUrl.includes('/edit')) {
            alert("This button only works on a YouTube Studio video edit page.");
            return;
        }

        // 2. FORCE INJECTION: Execute content.js before sending the message.
        // This ensures the message listener is active.
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }, () => {
            // 3. Send the message to the now-active content script
            chrome.tabs.sendMessage(tab.id, { action: "MANUAL_COPY" }, function(response) {
                
                // Handle potential error if content script didn't respond
                if (chrome.runtime.lastError) {
                    // This error often means the tab was closed or the script was blocked
                    alert("Error: Could not communicate with the YouTube page. Please try refreshing the tab.");
                    return;
                }

                if (response && response.status === "success") {
                    alert(`Title successfully updated/checked.`);
                } else if (response && response.status === "failure") {
                     alert(`Update failed: ${response.message}`);
                } else {
                     // Fallback for silent success/fail
                     alert("Title update sent. Please check the video title field.");
                }
            });
        });
    });
});
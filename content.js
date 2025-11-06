// Function that performs the core action of cleaning and writing the title
function copyFilenameToTitle(isManualTrigger = false) { 
    
    // Safety check for iframes
    // if (window.self !== window.top) {
    //     if (isManualTrigger) {
    //         return { status: "failure", message: "Not the main frame." };
    //     }
    //     return false;
    // }
    
    const filenameElement = document.getElementById('original-filename');
    const titleInput = document.querySelector('#textbox'); 

    if (!filenameElement || !titleInput) {
        // In polling mode, return false to continue checking
        return false;
    }
    
    // --- EXECUTION LOGIC ---
    let rawFilename = filenameElement.textContent;
    let cleanFilename = rawFilename
        .trim()
        .replace(/\.[^/.]+$/, ""); // Only removes the file extension

    // *** CRITICAL CHANGE: Removed the conditional check here. ***
    // The script will now always overwrite the title if the elements are found.

    // Simulate user interaction
    titleInput.focus();
    titleInput.textContent = cleanFilename;
    titleInput.blur(); 
    
    // Dispatch an input event
    titleInput.dispatchEvent(new Event('input', { bubbles: true }));

    console.log(`[Filename Copier SUCCESS] Filename copied: ${cleanFilename}`);
    return { status: "success", newTitle: cleanFilename }; 
}

// ----------------------------------------------------------------------
// AUTOMATIC MODE: Polling for New Video Uploads
// ----------------------------------------------------------------------

let checkCount = 0;
const maxChecks = 25; // 25 seconds max wait
const intervalTime = 1000; 

const intervalId = setInterval(() => {
    
    const isEditPage = window.location.href.startsWith('https://studio.youtube.com/video/');

    if (checkCount === 0 && !isEditPage) {
        console.log('[Filename Copier] Automatic Polling started.');
    }
    
    // If we detect we are on an existing edit page, stop the automatic polling
    if (isEditPage && checkCount > 0) {
        clearInterval(intervalId);
        return;
    }
    
    // Call copyFilenameToTitle with isManualTrigger = false
    const result = copyFilenameToTitle(false);
    
    if (result && result.status === 'success' || checkCount >= maxChecks) {
        clearInterval(intervalId);
        if (checkCount >= maxChecks) {
             console.error('[Filename Copier ERROR] Timed out. Automatic update failed.');
        }
    }

    checkCount++;
    
}, intervalTime);


// ----------------------------------------------------------------------
// MANUAL MODE: Listener for button press
// ----------------------------------------------------------------------
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "MANUAL_COPY") {
            // Run copyFilenameToTitle with isManualTrigger = true
            const result = copyFilenameToTitle(true); 
            sendResponse(result); 
        }
        return true; 
    }
);
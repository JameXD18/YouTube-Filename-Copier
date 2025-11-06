// Function to clean the filename and insert it into the title field
function copyFilenameToTitle() {
    
    // Check if we are running in the top-level window (to prevent running multiple times in iframes)
    if (window.self !== window.top) {
        return false;
    }
    
    const filenameElement = document.getElementById('original-filename');
    const titleInput = document.querySelector('#textbox'); 

    if (filenameElement && titleInput) {
        
        // Check for common placeholders to prevent overwriting user input
        if (titleInput.textContent.trim().length > 100) {
             console.log('[Filename Copier SKIP] Title already has a long value.');
             return true;
        }
        
        // --- EXECUTION LOGIC ---
        let rawFilename = filenameElement.textContent;

        // **MODIFIED:** ONLY remove the file extension.
        let cleanFilename = rawFilename
            .trim()
            .replace(/\.[^/.]+$/, ""); // Removes .mp4, .mov, etc.

        // Simulate user interaction before writing
        titleInput.focus();
        
        // Insert the clean filename
        titleInput.textContent = cleanFilename;

        // Trigger a blur event to finalize the input
        titleInput.blur(); 
        
        // CRUCIAL: Dispatch an input event
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));

        console.log(`[Filename Copier SUCCESS] Filename copied: ${cleanFilename}`);
        return true; 
    }
    
    return false;
}

// --- Polling Logic ---
let checkCount = 0;
const maxChecks = 25; // 25 seconds max wait
const intervalTime = 1000; 

const intervalId = setInterval(() => {
    
    if (checkCount === 0) {
        console.log('[Filename Copier] Content Script is running. Polling started.');
    }
    
    const success = copyFilenameToTitle();
    
    if (success || checkCount >= maxChecks) {
        clearInterval(intervalId);
        if (!success) {
            console.error('[Filename Copier ERROR] Timed out. Elements not found.');
        }
    }

    checkCount++;
    
}, intervalTime);
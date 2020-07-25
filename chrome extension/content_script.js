window.addEventListener('mouseup',() => {
    // returns the selected string
    let selectedText = window.getSelection().toString().trim();
    if(selectedText.length > 0) {
        let msg = {
            txt: selectedText
        };
        // sends message to background script 
        chrome.runtime.sendMessage(msg);
    }
});
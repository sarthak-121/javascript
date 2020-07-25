// global variable
window.word = "word";

// recieves the message from content script
chrome.runtime.onMessage.addListener((request, sender, sendRespose) => {
    console.log(request);
    word = request.txt;
});

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Highlighter extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getHighlights') {
    chrome.storage.local.get([request.url], (result) => {
      sendResponse(result[request.url] || []);
    });
    return true;
  }
});

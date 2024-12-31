// Get the current tab's highlights
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  const url = tabs[0].url;
  chrome.storage.local.get([url], (result) => {
    const highlights = result[url] || [];
    document.querySelector('.highlight-count').textContent = 
      `Highlights on this page: ${highlights.length}`;
  });
});

// Clear highlights button
document.getElementById('clearHighlights').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    chrome.storage.local.remove([url], () => {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    });
  });
});

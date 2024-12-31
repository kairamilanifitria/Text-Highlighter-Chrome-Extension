// Store highlights for the current page
let highlights = [];

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadHighlights();
});

// Load saved highlights from storage
function loadHighlights() {
  const url = window.location.href;
  chrome.storage.local.get([url], (result) => {
    if (result[url]) {
      highlights = result[url];
      applyHighlights();
    }
  });
}

// Apply highlights to the page
function applyHighlights() {
  highlights.forEach(highlight => {
    const range = document.createRange();
    const start = findTextPosition(document.body, highlight.startOffset);
    const end = findTextPosition(document.body, highlight.endOffset);
    
    if (start && end) {
      range.setStart(start.node, start.offset);
      range.setEnd(end.node, end.offset);
      
      const span = document.createElement('span');
      span.className = 'web-highlighter-highlight';
      span.dataset.highlightId = highlight.id;
      range.surroundContents(span);
    }
  });
}

// Find text position in DOM
function findTextPosition(node, targetOffset) {
  let currentOffset = 0;
  
  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (currentOffset + node.length >= targetOffset) {
        return {
          node: node,
          offset: targetOffset - currentOffset
        };
      }
      currentOffset += node.length;
    } else {
      for (let child of node.childNodes) {
        const result = traverse(child);
        if (result) return result;
      }
    }
    return null;
  }
  
  return traverse(node);
}

// Listen for mouseup events to create new highlights
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (!selection.toString().trim()) return;
  
  const range = selection.getRangeAt(0);
  const startOffset = getTextOffset(document.body, range.startContainer, range.startOffset);
  const endOffset = getTextOffset(document.body, range.endContainer, range.endOffset);
  
  const highlight = {
    id: Date.now().toString(),
    startOffset,
    endOffset,
    text: selection.toString()
  };
  
  highlights.push(highlight);
  saveHighlights();
  
  const span = document.createElement('span');
  span.className = 'web-highlighter-highlight';
  span.dataset.highlightId = highlight.id;
  range.surroundContents(span);
});

// Get text offset from the start of the document
function getTextOffset(root, node, offset) {
  let currentOffset = 0;
  
  function traverse(node) {
    if (node === arguments[1]) {
      return currentOffset + offset;
    }
    
    if (node.nodeType === Node.TEXT_NODE) {
      currentOffset += node.length;
    } else {
      for (let child of node.childNodes) {
        const result = traverse(child);
        if (result !== undefined) return result;
      }
    }
  }
  
  return traverse(root);
}

// Save highlights to storage
function saveHighlights() {
  const url = window.location.href;
  chrome.storage.local.set({
    [url]: highlights
  });
}

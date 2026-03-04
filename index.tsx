import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Global error handling with visual feedback
const showErrorOverlay = (error: any) => {
  const errorId = `err-${Date.now()}`;
  
  // Create error overlay element
  const overlay = document.createElement('div');
  overlay.id = errorId;
  overlay.style.position = 'fixed';
  overlay.style.top = '20px';
  overlay.style.right = '20px';
  overlay.style.zIndex = '9999';
  overlay.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
  overlay.style.color = 'white';
  overlay.style.padding = '16px 24px';
  overlay.style.borderRadius = '8px';
  overlay.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  overlay.style.fontFamily = 'sans-serif';
  overlay.style.fontSize = '14px';
  overlay.style.maxWidth = '400px';
  overlay.style.cursor = 'pointer';
  
  const title = document.createElement('div');
  title.style.fontWeight = '600';
  title.style.marginBottom = '8px';
  title.textContent = '⚠️ Application Error';
  
  const message = document.createElement('div');
  message.style.marginBottom = '12px';
  message.style.whiteSpace = 'pre-wrap';
  message.style.fontSize = '13px';
  message.textContent = error.message || 'Unknown error occurred';
  
  const details = document.createElement('div');
  details.style.fontSize = '12px';
  details.style.opacity = '0.8';
  details.textContent = 'Click to dismiss';
  
  overlay.appendChild(title);
  overlay.appendChild(message);
  overlay.appendChild(details);
  
  // Add to body
  document.body.appendChild(overlay);
  
  // Auto-dismiss after 10 seconds or on click
  const dismiss = () => {
    const existingOverlay = document.getElementById(errorId);
    if (existingOverlay) {
      existingOverlay.style.transition = 'opacity 0.3s, transform 0.3s';
      existingOverlay.style.opacity = '0';
      existingOverlay.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (existingOverlay.parentNode) {
          existingOverlay.parentNode.removeChild(existingOverlay);
        }
      }, 300);
    }
  };
  
  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 10000);
};

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  showErrorOverlay(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  showErrorOverlay(event.reason);
});

// Detect frozen UI
let lastActivity = Date.now();
const checkActivity = () => {
  const now = Date.now();
  if (now - lastActivity > 30000) { // 30 seconds of inactivity
    console.warn('UI may be frozen - last activity:', new Date(lastActivity).toISOString());
  }
  lastActivity = now;
};

// Check activity every 5 seconds
const activityInterval = setInterval(checkActivity, 5000);

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  clearInterval(activityInterval);
});

const root = ReactDOM.createRoot(rootElement);
root.render(
    <App />
);
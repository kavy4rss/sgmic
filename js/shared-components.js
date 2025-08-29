/**
 * Shared Components JS
 * This file contains reusable components and functionality for the SGMIC website
 */

// Email App Detection and Redirection Function
function openEmailApp(emailAddress) {
    // Try to detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // For mobile devices, try different email apps in order of preference
        const emailApps = [
            // Gmail
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`,
            // Outlook
            `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(emailAddress)}`,
            // Yahoo Mail
            `https://compose.mail.yahoo.com/?to=${encodeURIComponent(emailAddress)}`,
            // Default mailto fallback
            `mailto:${emailAddress}`
        ];
        
        // Try to open Gmail first
        const gmailWindow = window.open(emailApps[0], '_blank');
        
        // If Gmail doesn't open, try other apps
        setTimeout(() => {
            if (!gmailWindow || gmailWindow.closed) {
                // Try Outlook
                const outlookWindow = window.open(emailApps[1], '_blank');
                setTimeout(() => {
                    if (!outlookWindow || outlookWindow.closed) {
                        // Try Yahoo
                        const yahooWindow = window.open(emailApps[2], '_blank');
                        setTimeout(() => {
                            if (!yahooWindow || yahooWindow.closed) {
                                // Fallback to default mailto
                                window.location.href = emailApps[3];
                            }
                        }, 1000);
                    }
                }, 1000);
            }
        }, 1000);
        
    } else {
        // For desktop, try to detect installed email clients
        const emailClients = [
            // Gmail (web)
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`,
            // Outlook (web)
            `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(emailAddress)}`,
            // Yahoo Mail (web)
            `https://compose.mail.yahoo.com/?to=${encodeURIComponent(emailAddress)}`,
            // Default mailto
            `mailto:${emailAddress}`
        ];
        
        // Show a popup with options
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            min-width: 300px;
        `;
        
        popup.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">Choose Email App</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="window.open('${emailClients[0]}', '_blank'); this.parentElement.parentElement.remove();" 
                        style="padding: 10px; background: #4285f4; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    📧 Gmail
                </button>
                <button onclick="window.open('${emailClients[1]}', '_blank'); this.parentElement.parentElement.remove();" 
                        style="padding: 10px; background: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    📧 Outlook
                </button>
                <button onclick="window.open('${emailClients[2]}', '_blank'); this.parentElement.parentElement.remove();" 
                        style="padding: 10px; background: #720e9e; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    📧 Yahoo Mail
                </button>
                <button onclick="window.location.href='${emailClients[3]}'; this.parentElement.parentElement.remove();" 
                        style="padding: 10px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    📧 Default Email App
                </button>
                <button onclick="this.parentElement.parentElement.remove();" 
                        style="padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ❌ Cancel
                </button>
            </div>
        `;
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        overlay.onclick = () => {
            overlay.remove();
            popup.remove();
        };
        
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
    }
}

// Back to Top Button Functionality
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Add Back to Top Button to page
function addBackToTopButton(color = '#126e82') {
    // Check if button already exists
    if (document.querySelector('.back-to-top')) {
        return;
    }
    
    // Create the button element
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: ${color};
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
    `;
    
    // Add elements to the page
    document.head.appendChild(style);
    document.body.appendChild(backToTopButton);
    
    // Initialize functionality
    initBackToTop();
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components if they exist on the page
    initBackToTop();
}); 
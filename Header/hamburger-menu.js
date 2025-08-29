// Hamburger Menu Toggle Script - Completely Rewritten
// This script handles the opening and closing of a mobile navigation menu.

// Include shared components for email functionality
(function loadSharedComponents() {
    const script = document.createElement('script');
    script.src = '../js/shared-components.js';
    script.onload = function() {
        console.log('Shared components loaded successfully in hamburger menu');
    };
    script.onerror = function() {
        console.log('Shared components not found in hamburger menu, email function may not work');
    };
    document.head.appendChild(script);
})();

// EMERGENCY FIX FOR HAMBURGER MENU
console.log("EMERGENCY HAMBURGER MENU FIX LOADED");

// Direct toggle function with inline styles - this is the ONLY function we need
function emergencyToggleMenu(button) {
    console.log("EMERGENCY TOGGLE FUNCTION CALLED");
    
    // Get menu element directly - try multiple selectors to ensure we find it
    var menu = document.getElementById('mobileNavMenu') || 
               document.querySelector('.nav-menu') || 
               document.querySelector('ul.nav-menu') ||
               document.querySelector('.mobile-header ul');
    
    // No need for overlay since we're removing it
    var overlay = document.querySelector('.menu-overlay');
    
    if (!menu) {
        console.log("Menu not found on first attempt, trying alternative selectors");
        // Try harder to find the menu with a delay
        setTimeout(function() {
            menu = document.getElementById('mobileNavMenu') || 
                   document.querySelector('.nav-menu') || 
                   document.querySelector('ul.nav-menu') ||
                   document.querySelector('.mobile-header ul');
            
            if (!menu) {
                console.log("Still no menu found. Creating one as a last resort.");
                // Create a menu as a last resort if none exists
                var mobileHeader = document.querySelector('.mobile-header');
                if (mobileHeader) {
                    menu = document.createElement('ul');
                    menu.id = 'mobileNavMenu';
                    menu.className = 'nav-menu';
                    menu.style.right = '-100%';
                    menu.style.position = 'fixed';
                    menu.style.top = '65px';
                    menu.style.width = '80%';
                    menu.style.maxWidth = '300px';
                    menu.style.height = 'calc(100vh - 65px)';
                    menu.style.background = '#fff';
                    menu.style.display = 'flex';
                    menu.style.flexDirection = 'column';
                    menu.style.zIndex = '9998';
                    menu.style.boxShadow = '-5px 0 15px rgba(0,0,0,0.1)';
                    menu.style.overflowY = 'auto';
                    menu.style.padding = '20px 0';
                    menu.innerHTML = '<li><a href="index.html">Home</a></li>';
                    mobileHeader.appendChild(menu);
                }
            }
            
            toggleMenuState(button, menu, overlay);
            // Initialize dropdowns after creating menu
            initializeDropdowns();
        }, 100);
        return false;
    }
    
    return toggleMenuState(button, menu, overlay);
}

// Separate function to toggle menu state
function toggleMenuState(button, menu, overlay) {
    if (!menu) {
        console.log("Menu element still not found - cannot toggle");
        return false;
    }
    
    console.log("Menu found, toggling state");
    
    // Check if menu is open (by checking the right style property)
    var isOpen = menu.style.right === "0px" || menu.style.right === "0%" || menu.classList.contains('open');
    
    if (isOpen) {
        // Close menu
        menu.style.right = "-100%";
        menu.classList.remove("open");
        button.classList.remove("active");
        document.body.classList.remove("menu-open");
        document.body.style.overflow = "";
        button.setAttribute('aria-expanded', 'false');
        
        // No need to handle overlay since we're removing it
    } else {
        // Open menu
        menu.style.right = "0";
        menu.classList.add("open");
        button.classList.add("active");
        document.body.classList.add("menu-open");
        document.body.style.overflow = "hidden";
        button.setAttribute('aria-expanded', 'true');
        
        // No need to handle overlay since we're removing it
        
        // Initialize dropdowns when menu opens
        initializeDropdowns();
    }
    
    console.log("Menu state toggled to: " + (!isOpen ? "open" : "closed"));
    return false; // Prevent default
}

// Function to initialize dropdown menus
function initializeDropdowns() {
    console.log("Initializing dropdown menus");
    
    // Find all dropdown items
    var dropdownItems = document.querySelectorAll('.has-dropdown');
    
    if (dropdownItems && dropdownItems.length > 0) {
        console.log("Found " + dropdownItems.length + " dropdown items");
        
        // Remove any existing click handlers by cloning
        dropdownItems.forEach(function(item) {
            var link = item.querySelector('a');
            if (link) {
                var newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                // Add click handler to the new link
                newLink.addEventListener('click', function(e) {
                    console.log("Dropdown link clicked: " + this.textContent);
                    
                    // Always prevent default for dropdown parent links
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle active class on parent
                    item.classList.toggle('active');
                    
                    // Show/hide dropdown menu with direct style manipulation
                    var dropdownMenu = item.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        if (item.classList.contains('active')) {
                            dropdownMenu.style.display = 'block';
                        } else {
                            dropdownMenu.style.display = 'none';
                        }
                    }
                    
                    return false;
                });
            }
        });
    } else {
        console.log("No dropdown items found");
    }
}

// Make sure the function is globally available
window.emergencyToggleMenu = emergencyToggleMenu;
window.initializeDropdowns = initializeDropdowns;

// Apply this fix immediately
(function() {
    console.log("Applying emergency hamburger menu fix");
    
    // Find the button - try multiple methods
    var hamburgerButton = document.getElementById('hamburgerToggle') || 
                          document.querySelector('.nav-toggle') ||
                          document.querySelector('button.nav-toggle') ||
                          document.querySelector('.mobile-header button');
    
    if (hamburgerButton) {
        console.log("Found hamburger button, attaching direct click handler");
        
        // Remove any existing click handlers by cloning the node
        var newButton = hamburgerButton.cloneNode(true);
        hamburgerButton.parentNode.replaceChild(newButton, hamburgerButton);
        
        // Add our direct click handler
        newButton.onclick = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return emergencyToggleMenu(this);
        };
    } else {
        console.log("Could not find hamburger button on first attempt, will try again");
        // Try again after a delay
        setTimeout(function() {
            var button = document.getElementById('hamburgerToggle') || 
                         document.querySelector('.nav-toggle') ||
                         document.querySelector('button.nav-toggle') ||
                         document.querySelector('.mobile-header button');
                         
            if (button) {
                console.log("Found hamburger button on second attempt");
                var newBtn = button.cloneNode(true);
                button.parentNode.replaceChild(newBtn, button);
                newBtn.onclick = function(e) {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return emergencyToggleMenu(this);
                };
            } else {
                console.log("Still couldn't find button, adding global click handler");
            }
        }, 500);
    }
    
    // Also try again after a delay
    setTimeout(function() {
        var button = document.getElementById('hamburgerToggle') || 
                     document.querySelector('.nav-toggle') ||
                     document.querySelector('button.nav-toggle') ||
                     document.querySelector('.mobile-header button');
        if (button) {
            button.onclick = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return emergencyToggleMenu(this);
            };
        }
        
        // Initialize dropdowns after a delay
        initializeDropdowns();
    }, 1000);
})();

// Also add a global click handler to catch any clicks on elements with nav-toggle class
document.addEventListener('click', function(e) {
    var target = e.target;
    
    // Check if the clicked element or any of its parents has the nav-toggle class
    while (target) {
        if (target.classList && (target.classList.contains('nav-toggle') || target.id === 'hamburgerToggle')) {
            console.log("Caught click on hamburger button through global handler");
            e.preventDefault();
            e.stopPropagation();
            return emergencyToggleMenu(target);
        }
        
        // Check if it's a dropdown toggle
        if (target.parentElement && target.parentElement.classList && target.parentElement.classList.contains('has-dropdown')) {
            if (target.tagName === 'A') {
                console.log("Caught click on dropdown toggle through global handler");
                e.preventDefault();
                e.stopPropagation();
                
                var dropdownItem = target.parentElement;
                dropdownItem.classList.toggle('active');
                
                // Show/hide dropdown menu with direct style manipulation
                var dropdownMenu = dropdownItem.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    if (dropdownItem.classList.contains('active')) {
                        dropdownMenu.style.display = 'block';
                    } else {
                        dropdownMenu.style.display = 'none';
                    }
                }
                
                return false;
            }
        }
        
        target = target.parentElement;
    }
}, true);

// Initialize dropdown menus when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdowns
    initializeDropdowns();
    
    // Also try after a delay to ensure everything is loaded
    setTimeout(initializeDropdowns, 500);
    setTimeout(initializeDropdowns, 1000);
});

// Handle dropdown menus
document.addEventListener('DOMContentLoaded', function() {
    var dropdownItems = document.querySelectorAll('.has-dropdown');
    
    if (dropdownItems && dropdownItems.length > 0) {
        dropdownItems.forEach(function(item) {
            var link = item.querySelector('a');
            
            if (link) {
                link.addEventListener('click', function(e) {
                    // Only prevent default if it's a # link
                    if (link.getAttribute('href') === '#') {
                        e.preventDefault();
                    }
                    
                    e.stopPropagation(); // Prevent menu from closing
                    
                    // Toggle current dropdown
                    item.classList.toggle('active');
                });
            }
        });
    }
});

// Immediately execute this function to initialize the hamburger menu
(function() {
    console.log("Hamburger menu script loaded");
    
    // Function to initialize the hamburger menu
    function initHamburgerMenu() {
        console.log("Initializing hamburger menu...");
        
        // Select all required elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
        const menuOverlay = document.querySelector('.menu-overlay');
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        
        // Check if elements exist to prevent errors
        if (!navToggle) {
            console.error('Hamburger toggle button not found');
            return;
        }
        
        if (!navMenu) {
            console.error('Navigation menu not found');
            return;
        }
        
        console.log("Hamburger elements found, setting up click handlers");

    // Function to toggle the menu
    function toggleMenu() {
            console.log("Toggle menu called");
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
            
            // Toggle overlay if it exists
            if (menuOverlay) {
                menuOverlay.classList.toggle('active');
            }
    }

    // Add click event to the hamburger icon
        navToggle.addEventListener('click', function(e) {
            console.log("Hamburger clicked");
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Handle dropdown menus
        if (dropdownItems && dropdownItems.length > 0) {
            dropdownItems.forEach(item => {
                const link = item.querySelector('a');
                
                if (link) {
                    link.addEventListener('click', function(e) {
                        // Only prevent default if it's a # link
                        if (link.getAttribute('href') === '#') {
                            e.preventDefault();
                        }
                        
                        e.stopPropagation(); // Prevent menu from closing
                        
                        // Close other open dropdowns
                        dropdownItems.forEach(otherItem => {
                            if (otherItem !== item && otherItem.classList.contains('active')) {
                                otherItem.classList.remove('active');
                            }
                        });
                        
                        // Toggle current dropdown
                        item.classList.toggle('active');
                    });
                }
            });
        }
        
        // Close menu when a link (that's not a dropdown parent) is clicked
        const regularLinks = navMenu.querySelectorAll('li:not(.has-dropdown) > a, .dropdown-menu a');
        if (regularLinks && regularLinks.length > 0) {
            regularLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Don't prevent default here to allow navigation
                    toggleMenu();
    });
            });
        }

    // Close menu on window resize if width is greater than 900px
        window.addEventListener('resize', function() {
            if (window.innerWidth > 900) {
                if (navMenu.classList.contains('open')) {
                    toggleMenu();
                }
                
                // Reset any open dropdowns
                if (dropdownItems && dropdownItems.length > 0) {
                    dropdownItems.forEach(item => {
                        item.classList.remove('active');
                    });
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu || !navToggle) return;
            
            const isClickInsideMenu = navMenu.contains(e.target);
            const isClickOnToggle = navToggle.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
        
        // Add click event to overlay if it exists
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                if (navMenu.classList.contains('open')) {
            toggleMenu();
        }
    });
        }
    }
    
    // Try to initialize immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // Document already ready, initialize now
        initHamburgerMenu();
    } else {
        // Wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', initHamburgerMenu);
    }
    
    // As a fallback, also try after window load
    window.addEventListener('load', function() {
        // Add a small delay to ensure all elements are properly rendered
        setTimeout(initHamburgerMenu, 100);
        
        // Extra safety check - try to manually add click handler to hamburger button
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            console.log("Adding extra click handler to hamburger button after window load");
            navToggle.onclick = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                console.log("Extra hamburger button click handler triggered");
                const navMenu = document.querySelector('.nav-menu');
                const menuOverlay = document.querySelector('.menu-overlay');
                
                if (navMenu) {
                    navMenu.classList.toggle('open');
                    this.classList.toggle('active');
                    document.body.classList.toggle('menu-open');
                    
                    if (menuOverlay) {
                        menuOverlay.classList.toggle('active');
                    }
                }
            };
        } else {
            console.error("Could not find hamburger button after window load");
        }
    });
    
    // Add a direct click handler to any hamburger toggle that exists or will exist
    document.addEventListener('click', function(e) {
        // Check if the clicked element or any of its parents is a hamburger toggle
        let target = e.target;
        while (target) {
            if (target.classList && target.classList.contains('nav-toggle')) {
                console.log("Direct hamburger click detected");
                e.preventDefault();
                e.stopPropagation();
                
                // Find the related menu
                const navMenu = document.querySelector('.nav-menu');
                const menuOverlay = document.querySelector('.menu-overlay');
                
                if (navMenu) {
                    navMenu.classList.toggle('open');
                    target.classList.toggle('active');
                    document.body.classList.toggle('menu-open');
                    
                    if (menuOverlay) {
                        menuOverlay.classList.toggle('active');
                    }
                }
                
                break;
            }
            target = target.parentElement;
        }
    }, true);
    
    // Global function to toggle the hamburger menu (can be called from inline onclick handlers)
    window.toggleHamburgerMenu = function(event) {
        console.log("Global toggleHamburgerMenu function called");
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const menuOverlay = document.querySelector('.menu-overlay');
        
        if (navToggle && navMenu) {
            console.log("Toggling menu from global function");
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            if (menuOverlay) {
                menuOverlay.classList.toggle('active');
            }
        } else {
            console.error("Could not find hamburger menu elements in global function");
        }
    };
    
    // Add MutationObserver to detect if the hamburger button is added dynamically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // Only process Element nodes
                        const hamburgerButton = node.classList && node.classList.contains('nav-toggle') ? 
                            node : node.querySelector('.nav-toggle');
                        
                        if (hamburgerButton) {
                            console.log("Hamburger button dynamically added, adding click handler");
                            hamburgerButton.addEventListener('click', function(e) {
                                console.log("Dynamically added hamburger button clicked");
                                e.preventDefault();
                                e.stopPropagation();
                                
                                const navMenu = document.querySelector('.nav-menu');
                                const menuOverlay = document.querySelector('.menu-overlay');
                                
                                if (navMenu) {
                                    navMenu.classList.toggle('open');
                                    this.classList.toggle('active');
                                    document.body.classList.toggle('menu-open');
                                    
                                    if (menuOverlay) {
                                        menuOverlay.classList.toggle('active');
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log("Hamburger menu initialization complete");
})(); 
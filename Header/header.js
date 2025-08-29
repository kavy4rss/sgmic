// Header JavaScript Functionality

// Include shared components for email functionality
(function loadSharedComponents() {
    const script = document.createElement('script');
    script.src = '../js/shared-components.js';
    script.onload = function() {
        console.log('Shared components loaded successfully');
    };
    script.onerror = function() {
        console.log('Shared components not found, email function may not work');
    };
    document.head.appendChild(script);
})();

let backgroundMusic; // Global variable for background music

// Initialize background music immediately
(function initBackgroundMusic() {
    // Create audio element
    backgroundMusic = new Audio('Media/BackgroundMusic.mp3');
    backgroundMusic.loop = true; // Enable looping
    backgroundMusic.volume = 0.3; // Set to 30% volume
    
    // Check if this is a page reload or first visit vs navigation between pages
    const lastUrl = sessionStorage.getItem('lastPageUrl');
    const currentUrl = window.location.href;
    
    // If the lastUrl doesn't match current URL, it's a navigation or first visit
    // If the lastUrl matches current URL, it's likely a page reload
    if (lastUrl === currentUrl) {
        // Page reload - restart music from beginning
        backgroundMusic.currentTime = 0;
    } else {
        // Page navigation or first visit
        const musicPosition = sessionStorage.getItem('musicPosition');
        if (musicPosition) {
            // Continue from where we left off
            backgroundMusic.currentTime = parseFloat(musicPosition);
        }
    }
    
    // Update last page URL for future checks
    sessionStorage.setItem('lastPageUrl', currentUrl);
    
    // Try to play music immediately
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay prevented by browser:', error);
            
            // Try playing on user interaction (needed for some browsers)
            const playOnInteraction = () => {
                backgroundMusic.play();
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
            document.addEventListener('keydown', playOnInteraction, { once: true });
        });
    }
    
    // Save current position periodically
    setInterval(() => {
        if (!backgroundMusic.paused) {
            sessionStorage.setItem('musicPosition', backgroundMusic.currentTime.toString());
        }
    }, 1000);
    
    // Also save position when leaving the page
    window.addEventListener('beforeunload', () => {
        if (!backgroundMusic.paused) {
            sessionStorage.setItem('musicPosition', backgroundMusic.currentTime.toString());
        }
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const header = document.querySelector('.main-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    const overlay = document.querySelector('.overlay');
    const dropdownItems = document.querySelectorAll('.nav-links .has-dropdown');
    const body = document.body;

    // Ensure logo is visible and properly sized
    function fixLogo() {
        const logo = document.querySelector('.school-logo');
        if (logo) {
            logo.style.height = '60px';
            logo.style.display = 'block';
            logo.style.maxWidth = '100%';
        }
        
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.style.display = 'flex';
            logoContainer.style.alignItems = 'center';
            logoContainer.style.justifyContent = 'center';
        }
    }
    
    // Call this immediately
    fixLogo();

    // Shrink header on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
            
            // Keep logo size constant
            const logo = document.querySelector('.school-logo');
            if (logo) {
                logo.style.height = '60px';
                logo.style.transform = 'none';
                logo.style.animation = 'none';
            }
            
        } else {
            header.classList.remove('shrink');
            
            // Keep logo size constant even when not scrolled
            const logo = document.querySelector('.school-logo');
            if (logo) {
                logo.style.height = '60px';
                logo.style.transform = 'none';
                logo.style.animation = 'none';
            }
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        navContainer.classList.toggle('open');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
        navToggle.classList.toggle('active');
        
        // Toggle icon between hamburger and close
        if (navToggle.classList.contains('active')) {
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Close mobile menu when clicking outside
    function closeOnOutsideClick(e) {
        if (
            navContainer.classList.contains('open') && 
            !navContainer.contains(e.target) && 
            !navToggle.contains(e.target)
        ) {
            toggleMobileMenu();
        }
    }

    // Toggle dropdown menus on mobile
    function handleDropdownToggle(e) {
        // Determine if we're on mobile view
        const isMobile = window.innerWidth <= 992;
        
        // If it's a top-level dropdown item
        if (this.classList.contains('has-dropdown')) {
            // For mobile: prevent default and toggle dropdown
            if (isMobile) {
                e.preventDefault();
                
                const parentLi = this;
                const isCurrentlyOpen = parentLi.classList.contains('open');
                
                // Close all other open dropdowns first
                dropdownItems.forEach(item => {
                    if (item !== parentLi) {
                        item.classList.remove('open');
                    }
                });
                
                // Toggle current dropdown
                parentLi.classList.toggle('open');
                
                // If we just opened a dropdown, scroll it into view
                if (!isCurrentlyOpen) {
                    setTimeout(() => {
                        parentLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 300);
                }
            }
        }
    }

    // Set active link based on current page
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Check if the current path matches the link's href
            if (
                (currentPath === '/' && linkPath === 'index.html') || 
                currentPath.includes(linkPath) && linkPath !== 'index.html'
            ) {
                link.classList.add('active');
                
                // If in dropdown, also add active class to parent
                const parentLi = link.closest('li.has-dropdown');
                if (parentLi) {
                    const parentLink = parentLi.querySelector('a');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Top bar notifications ticker (if needed)
    function initNotificationTicker() {
        const ticker = document.querySelector('.top-bar-ticker');
        if (ticker) {
            const messages = [
                "Welcome to Saraswati Gyan Mandir Inter College!",
                "Admissions open for academic year 2024-25",
                "Upcoming events: Annual Function on December 15",
                "Click here to view our latest achievements"
            ];
            
            let currentIndex = 0;
            ticker.textContent = messages[currentIndex];
            
            setInterval(() => {
                currentIndex = (currentIndex + 1) % messages.length;
                ticker.style.opacity = 0;
                
                setTimeout(() => {
                    ticker.textContent = messages[currentIndex];
                    ticker.style.opacity = 1;
                }, 500);
            }, 5000);
        }
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (navContainer.classList.contains('open')) {
                        toggleMobileMenu();
                    }
                    
                    // Calculate header height for offset
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize all event listeners
    function initEventListeners() {
        // Scroll events
        window.addEventListener('scroll', handleScroll);
        
        // Mobile menu events
        navToggle.addEventListener('click', toggleMobileMenu);
        overlay.addEventListener('click', toggleMobileMenu);
        document.addEventListener('click', closeOnOutsideClick);
        
        // Dropdown events
        dropdownItems.forEach(item => {
            item.addEventListener('click', handleDropdownToggle);
        });
        
        // Window resize events
        window.addEventListener('resize', function() {
            // Close mobile menu on window resize to desktop
            if (window.innerWidth > 992 && navContainer.classList.contains('open')) {
                toggleMobileMenu();
            }
            
            // Fix logo position on resize
            fixLogo();
        });
        
        // Call once on load
        handleScroll();
        setActiveLink();
        initSmoothScroll();
        initNotificationTicker();
    }

    // Call the initialization function
    initEventListeners();
    
    // Add window load event to ensure logo is fixed after all assets load
    window.addEventListener('load', fixLogo);
    
    // Setup background music controls
    setupBackgroundMusic();
});

function setupBackgroundMusic() {
    // Add music controls to the page if they don't exist
    if (!document.querySelector('.music-controls')) {
        addMusicControls();
    }
}

function addMusicControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'music-controls';
    controlsContainer.innerHTML = `
        <button id="toggleMusic" title="Toggle Background Music">
            <i class="fas fa-music"></i>
        </button>
    `;
    
    document.body.appendChild(controlsContainer);
    
    // Style the controls
    const style = document.createElement('style');
    style.textContent = `
        .music-controls {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .music-controls button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(245, 166, 35, 0.8);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        .music-controls button:hover {
            background: rgba(245, 166, 35, 1);
            transform: translateY(-2px);
        }
        
        .music-controls button.muted i {
            color: #ccc;
        }
    `;
    document.head.appendChild(style);
    
    // Add event listeners
    const toggleButton = document.getElementById('toggleMusic');
    toggleButton.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            this.classList.remove('muted');
        } else {
            backgroundMusic.pause();
            this.classList.add('muted');
        }
    });
    
    // Set initial state
    if (backgroundMusic && backgroundMusic.paused) {
        toggleButton.classList.add('muted');
    }
} 
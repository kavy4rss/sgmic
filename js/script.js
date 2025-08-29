// Declare these variables globally
let currentSlide = 0;
let slides;
let dots;
let testimonialIndex = 0; // Global access for testimonials

document.addEventListener('DOMContentLoaded', function() {
    // Ensure universal header loader is present on all pages
    (function injectHeaderLoader(){
        if (!document.getElementById('header-loader-js')) {
            const sc = document.createElement('script');
            sc.id = 'header-loader-js';
            sc.src = (/\/pages\//.test(window.location.pathname) ? '../' : '') + 'js/header-loader.js';
            document.head.appendChild(sc);
        }
    })();
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    // Add null checks for navigation elements
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Show popup when page loads
    const popup = document.getElementById('welcomePopup');
    if (popup) {
        popup.style.display = 'flex';
    }

    // Initialize slider elements
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');

    // Initialize first slide if elements exist
    if (slides && slides.length > 0 && dots && dots.length > 0) {
        showSlide(0);
        
        // Auto advance slides
        setInterval(nextSlide, 5000);
    }

    // Founders Slider
    const foundersSlider = document.querySelector('.founders-slider');
    const founderCards = document.querySelectorAll('.founder-card');
    const prevFounder = document.querySelector('.founders-slider .prev');
    const nextFounder = document.querySelector('.founders-slider .next');
    let currentFounder = 0;
    let isAnimating = false;

    // Check if founders slider elements exist
    if (foundersSlider && founderCards.length > 0) {
        // Initialize first founder card
        founderCards[0].classList.add('active');

        function slideFounders(direction) {
            if (isAnimating) return;
            isAnimating = true;

            if (direction === 'next') {
                currentFounder = (currentFounder + 1) % founderCards.length;
            } else {
                currentFounder = (currentFounder - 1 + founderCards.length) % founderCards.length;
            }
            
            // Remove active class from all cards
            founderCards.forEach(card => card.classList.remove('active'));
            // Add active class to current card
            founderCards[currentFounder].classList.add('active');

            // Reset animation lock after transition
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }

        // Add touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let isDragging = false;
        
        foundersSlider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            isDragging = true;
        });
        
        foundersSlider.addEventListener('touchend', e => {
            if (!isDragging) return;
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                slideFounders('next');
            } else if (touchEndX - touchStartX > 50) {
                slideFounders('prev');
            }
            isDragging = false;
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                slideFounders('prev');
            } else if (e.key === 'ArrowRight') {
                slideFounders('next');
            }
        });

        if (prevFounder) {
            prevFounder.addEventListener('click', () => slideFounders('prev'));
        }
        
        if (nextFounder) {
            nextFounder.addEventListener('click', () => slideFounders('next'));
        }
    }

    // Testimonials Slider
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentPosition = 0;
    
    // Check if elements exist to prevent errors
    if (track && prevBtn && nextBtn) {
        const testimonialPairs = track.querySelectorAll('.testimonial-pair');
        if (testimonialPairs && testimonialPairs.length > 1) {
            function updateSliderPosition() {
                track.style.transform = `translateX(${currentPosition}px)`;
            }
            
            function moveSlider(direction) {
                const pairWidth = testimonialPairs[0].offsetWidth;
                const maxPosition = -(pairWidth * (testimonialPairs.length - 1));
                
                if (direction === 'next') {
                    currentPosition = Math.max(currentPosition - pairWidth, maxPosition);
                } else {
                    currentPosition = Math.min(currentPosition + pairWidth, 0);
                }
                
                updateSliderPosition();
            }
            
            // Event listeners
            prevBtn.addEventListener('click', () => moveSlider('prev'));
            nextBtn.addEventListener('click', () => moveSlider('next'));
            
            // Auto advance every 5 seconds
            const autoAdvance = setInterval(() => moveSlider('next'), 5000);
            
            // Pause auto-advance when hovering over testimonials
            track.addEventListener('mouseenter', () => clearInterval(autoAdvance));
            
            // Resume auto-advance when mouse leaves
            track.addEventListener('mouseleave', () => {
                setInterval(() => moveSlider('next'), 5000);
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                // Reset position to current slide on resize
                const pairWidth = testimonialPairs[0].offsetWidth;
                const currentIndex = Math.abs(currentPosition) / pairWidth;
                currentPosition = -(currentIndex * pairWidth);
                updateSliderPosition();
            });
        }
    }

    // Lightbox functionality for testimonial images - fixed version
    // Get all testimonial author images
    const testimonialImages = document.querySelectorAll('.testimonial-author img');
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (testimonialImages.length > 0 && lightbox && lightboxImage) {
        // Add click event to each testimonial image
        testimonialImages.forEach(image => {
            image.addEventListener('click', function() {
                console.log('Image clicked'); // Debug log
                
                // Get the image source and author name
                const imgSrc = this.src;
                const authorNameElement = this.closest('.testimonial-author').querySelector('span');
                const authorName = authorNameElement ? authorNameElement.textContent : '';
                
                // Set the lightbox image source
                lightboxImage.src = imgSrc;
                
                // Show the lightbox
                lightbox.classList.add('active');
                
                // Prevent scrolling on the body
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox when clicking on it or the close button
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === lightboxClose) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close lightbox with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        console.log('Lightbox initialized with', testimonialImages.length, 'images');
    } else {
        console.log('Some lightbox elements not found, skipping initialization');
    }

    // Close popup when close button is clicked
    const closeButton = document.querySelector('.popup-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closePopup();
        });
    }

    // Add this function to initialize the hamburger menu on any page
    initializeHamburgerMenu();
});

// Slider functions - now globally accessible
function showSlide(index) {
    // Get the slides and dots again in case they weren't defined
    if (!slides || !dots) {
        slides = document.querySelectorAll('.slide');
        dots = document.querySelectorAll('.dot');
    }

    if (!slides.length || !dots.length) return;

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

function goToSlide(index) {
    showSlide(index);
}

// Popup functions
function showPopup() {
    const popup = document.getElementById('welcomePopup');
    if (popup) {
        popup.style.display = 'flex';
    }
}

function closePopup() {
    const popup = document.getElementById('welcomePopup');
    if (popup) {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
            popup.style.opacity = '1';
        }, 300);
        
        // Ensure background music is playing
        if (typeof window.backgroundMusic !== 'undefined' && window.backgroundMusic && window.backgroundMusic.paused) {
            window.backgroundMusic.play().catch(e => console.log('Unable to play audio:', e));
        }
    }
}

// Add global testimonial functions
function showTestimonialPair(index) {
    const testimonialPairs = document.querySelectorAll('.testimonial-pair');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    
    if (index >= testimonialPairs.length) index = 0;
    if (index < 0) index = testimonialPairs.length - 1;
    
    testimonialPairs.forEach(pair => pair.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialPairs[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    testimonialIndex = index;
}

function moveTestimonial(direction) {
    showTestimonialPair(testimonialIndex + direction);
}

// Add this function to initialize the hamburger menu on any page
function initializeHamburgerMenu() {
    console.log("Initializing hamburger menu from script.js");
    
    // Skip initialization if we're on desktop view
    if (window.innerWidth > 900) {
        console.log("Desktop view detected, skipping hamburger menu initialization");
        return;
    }
    
    // Wait a bit to ensure the hamburger-menu.js has had time to load and run
    setTimeout(function() {
        // Check if the global emergencyToggleMenu function exists from hamburger-menu.js
        if (typeof window.emergencyToggleMenu === 'function') {
            console.log("Found emergencyToggleMenu function, using that instead");
            return; // If it exists, that script is handling the menu
        }
        
        // Get references to the elements using getElementById
        const hamburgerButton = document.getElementById('hamburgerToggle');
        const navMenu = document.getElementById('mobileNavMenu');
        
        // If elements don't exist yet, try using querySelector as fallback
        const hamburgerToggle = hamburgerButton || document.querySelector('.nav-toggle');
        const mobileMenu = navMenu || document.querySelector('.nav-menu');
        
        // Check if elements exist
        if (!hamburgerToggle || !mobileMenu) {
            console.log("Could not find hamburger menu elements, but this is expected if we're on desktop view");
            return;
        }
        
        console.log("Found hamburger menu elements, setting up click handlers");
        
        // Add click event listener to hamburger button
        hamburgerToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log("Hamburger button clicked from script.js handler");
            
            // Toggle classes for menu visibility
            mobileMenu.classList.toggle('open');
            hamburgerToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Update ARIA attributes for accessibility
            const isExpanded = mobileMenu.classList.contains('open');
            hamburgerToggle.setAttribute('aria-expanded', isExpanded);
        });
    }, 500); // Wait 500ms to ensure hamburger-menu.js has loaded
}

// Also try after window load as a fallback
window.addEventListener('load', function() {
    // Skip initialization if we're on desktop view
    if (window.innerWidth > 900) {
        return;
    }
    
    // Add a small delay to ensure all elements are properly rendered
    setTimeout(initializeHamburgerMenu, 100);
    
    // Fix 404 errors by checking for missing files and providing fallbacks
    fixMissingFiles();
});

// Function to fix missing files
function fixMissingFiles() {
    // Fix missing school-banner.jpg
    var elements = document.querySelectorAll('[style*="school-banner.jpg"]');
    elements.forEach(function(el) {
        var style = el.getAttribute('style');
        if (style && style.includes('school-banner.jpg')) {
            // Replace with a solid color background
            el.style.backgroundImage = 'none';
            el.style.backgroundColor = '#f0f0f0';
        }
    });
    
    // Fix missing pattern.svg
    elements = document.querySelectorAll('[style*="pattern.svg"]');
    elements.forEach(function(el) {
        var style = el.getAttribute('style');
        if (style && style.includes('pattern.svg')) {
            // Replace with a solid color background
            el.style.backgroundImage = 'none';
            el.style.backgroundColor = '#f8f8f8';
        }
    });
    
    // Check for CSS files with 404s and create fallbacks
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && (href.includes('school-banner.jpg') || href.includes('pattern.svg'))) {
            // Create a new style element with fallback styles
            var style = document.createElement('style');
            style.textContent = `
                .banner-background { 
                    background-image: none !important; 
                    background-color: #f0f0f0 !important; 
                }
                .pattern-background { 
                    background-image: none !important; 
                    background-color: #f8f8f8 !important; 
                }
            `;
            document.head.appendChild(style);
        }
    });
    
    // Fix missing header.html 404 error
    var headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        // Check if header content is empty (indicating failed fetch)
        if (!headerContainer.innerHTML.trim()) {
            console.log("Header container is empty, providing fallback content");
            
            // Create a simple header as fallback
            var fallbackHeader = `
                <div class="desktop-header">
                    <div class="top-bar">
                        <div class="container">
                            <div class="contact-info">
                                <span><i class="fas fa-phone"></i> +91 9839148124</span>
                                <span><i class="fas fa-envelope"></i> sgmazadnagarkanpur@rediffmail.com</span>
                            </div>
                        </div>
                    </div>
                    <div class="main-header">
                        <div class="container">
                            <div class="logo">
                                <a href="index.html">
                                    <img src="image/Logo/Header_Logo.png" alt="School Logo">
                                </a>
                            </div>
                            <nav class="main-nav">
                                <ul>
                                    <li><a href="index.html">Home</a></li>
                                    <li><a href="about.html">About</a></li>
                                    <li><a href="academics.html">Academics</a></li>
                                    <li><a href="gallery.html">Gallery</a></li>
                                    <li><a href="admission.html">Admission</a></li>
                                    <li><a href="contact.html">Contact</a></li>
                                    <li><a href="payment.html" class="highlight">Fee Payment</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            `;
            
            headerContainer.innerHTML = fallbackHeader;
        }
    }
    
    // Also check for fetch errors in the console and fix them
    var originalFetch = window.fetch;
    window.fetch = function(url, options) {
        return originalFetch(url, options)
            .catch(function(error) {
                console.log("Fetch error for: " + url);
                
                // If it's a header file that failed to load
                if (url && typeof url === 'string' && url.includes('header.html')) {
                    console.log("Header fetch failed, providing fallback");
                    
                    // Return a mock response
                    return new Response('', {
                        status: 200,
                        headers: { 'Content-type': 'text/html' }
                    });
                }
                
                // Re-throw the error for other cases
                throw error;
            });
    };
} 
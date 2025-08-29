// Gallery JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-spinner">
            <svg viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="#f5a623" stroke-width="5"></circle>
            </svg>
        </div>
        <p>Loading Gallery...</p>
    `;
    document.body.appendChild(preloader);

    // Add preloader styles
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.98);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.6s ease, visibility 0.6s ease;
        }
        .preloader-spinner {
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
            animation: rotate 2s linear infinite;
        }
        .preloader-spinner svg {
            width: 100%;
            height: 100%;
        }
        .preloader-spinner svg circle {
            stroke-dasharray: 150;
            stroke-dashoffset: 100;
            animation: dash 1.5s ease-in-out infinite;
        }
        .preloader p {
            font-family: 'Poppins', sans-serif;
            color: #333;
            font-size: 16px;
            margin: 0;
        }
        @keyframes rotate {
            100% { transform: rotate(360deg); }
        }
        @keyframes dash {
            0% {
                stroke-dashoffset: 130;
            }
            50% {
                stroke-dashoffset: 50;
            }
            100% {
                stroke-dashoffset: 130;
            }
        }
    `;
    document.head.appendChild(style);

    // Remove preloader when page is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(function() {
                preloader.remove();
            }, 600);
        }, 800);
    });

    // Initialize variables
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentIndex = 0;
    let filteredItems = [...galleryItems];

    // Create lightbox if it doesn't exist
    if (!lightbox) {
        const lightboxDiv = document.createElement('div');
        lightboxDiv.className = 'lightbox';
        lightboxDiv.innerHTML = `
            <div class="lightbox-close">&times;</div>
            <div class="lightbox-navigation">
                <button class="lightbox-nav-btn lightbox-prev">&laquo;</button>
                <button class="lightbox-nav-btn lightbox-next">&raquo;</button>
            </div>
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-caption"></div>
        `;
        document.body.appendChild(lightboxDiv);
    }

    // Re-get elements if they were just created
    const updatedLightbox = document.querySelector('.lightbox');
    const updatedLightboxImage = document.querySelector('.lightbox-image');
    const updatedLightboxCaption = document.querySelector('.lightbox-caption');
    const updatedLightboxClose = document.querySelector('.lightbox-close');
    const updatedPrevBtn = document.querySelector('.lightbox-prev');
    const updatedNextBtn = document.querySelector('.lightbox-next');

    // Apply animation to gallery items
    function animateGalleryItems() {
        galleryItems.forEach((item, index) => {
            // Set item index for staggered animation
            item.style.setProperty('--item-index', index + 1);
        });
    }

    // Initialize smooth scrolling
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Open lightbox
    function openLightbox(index) {
        if (filteredItems.length === 0) return;
        
        currentIndex = index;
        const item = filteredItems[currentIndex];
        // Use data-src attribute first, fall back to src if data-src isn't available
        const imgSrc = item.querySelector('img').getAttribute('data-src') || item.querySelector('img').getAttribute('src');
            
        // Set the image source directly 
        updatedLightboxImage.src = imgSrc;
        updatedLightboxCaption.textContent = item.querySelector('.gallery-overlay h3')?.textContent || '';
            updatedLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        updatedLightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        openLightbox(currentIndex);
    }

    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % filteredItems.length;
        openLightbox(currentIndex);
    }

    // Add lazy loading to images
    function setupLazyLoading() {
        const lazyLoadImages = document.querySelectorAll('.gallery-item img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const parent = img.closest('.gallery-item');
                        
                        parent.classList.add('loading');
                        img.src = img.dataset.src;
                        
                        img.onload = function() {
                            parent.classList.remove('loading');
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        };
                    }
                });
            });
            
            lazyLoadImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            lazyLoadImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // Initialize parallax effect
    function initParallax() {
        const banner = document.querySelector('.page-banner');
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            if (banner) {
                banner.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
            }
        });
    }

    // Initialize scroll animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.section-title, .intro-text, .gallery-item');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            });
            
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            animatedElements.forEach(element => {
                element.classList.add('animate');
            });
        }
    }

    // Add scroll to top button
    function addScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top-btn';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(scrollBtn);
        
        // Add styles
        const scrollBtnStyle = document.createElement('style');
        scrollBtnStyle.textContent = `
            .scroll-top-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: var(--primary-color, #f5a623);
                color: white;
                border: none;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 99;
            }
            
            .scroll-top-btn.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .scroll-top-btn:hover {
                background-color: var(--primary-dark, #e09213);
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 768px) {
                .scroll-top-btn {
                    width: 40px;
                    height: 40px;
                    bottom: 20px;
                    right: 20px;
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(scrollBtnStyle);
        
        // Toggle visibility based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add scroll progress indicator
    function addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        // Add styles
        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 4px;
                background: linear-gradient(to right, var(--primary-color, #f5a623), var(--primary-dark, #e09213));
                z-index: 9998;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(progressStyle);
        
        // Update progress based on scroll position
        window.addEventListener('scroll', function() {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }

    // Add animated particles to banner
    function addParticles() {
        const banner = document.querySelector('.page-banner');
        
        if (!banner) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        banner.appendChild(particlesContainer);
        
        // Add styles
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            .particles-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 1;
            }
            
            .particle {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.3);
                pointer-events: none;
                z-index: 1;
            }
            
            @keyframes float-up {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                20% {
                    opacity: 0.5;
                }
                80% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyle);
        
        // Create particles
        function createParticles() {
            // Clear existing particles
            particlesContainer.innerHTML = '';
            
            const particleCount = Math.floor(window.innerWidth / 20); // Responsive particle count
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random size between 3 and 8px
                const size = Math.random() * 5 + 3;
                
                // Random position
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                
                // Random animation duration between 10 and 20 seconds
                const duration = Math.random() * 10 + 10;
                
                // Random delay
                const delay = Math.random() * 5;
                
                // Set styles
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.animation = `float-up ${duration}s linear ${delay}s infinite`;
                
                particlesContainer.appendChild(particle);
            }
        }
        
        // Create particles initially and on window resize
        createParticles();
        window.addEventListener('resize', createParticles);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Lightbox open event for gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                openLightbox(index);
            });
        });
        
        // Lightbox close events
        if (updatedLightboxClose) {
            updatedLightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (updatedLightbox) {
            updatedLightbox.addEventListener('click', function(e) {
                if (e.target === updatedLightbox) {
                    closeLightbox();
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (!updatedLightbox.classList.contains('active')) return;
                
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                } else if (e.key === 'ArrowRight') {
                    nextImage();
                }
            });
        }
        
        // Navigation buttons
        if (updatedPrevBtn) {
            updatedPrevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                prevImage();
            });
        }
        
        if (updatedNextBtn) {
            updatedNextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                nextImage();
            });
        }
    }

    // Initialize gallery
    function initGallery() {
        // Add animation classes to gallery items
        animateGalleryItems();
        
        // Init lazy loading
        setupLazyLoading();
        
        // Init smooth scrolling
        initSmoothScrolling();
        
        // Init parallax effects
        initParallax();
        
        // Init scroll animations
        initScrollAnimations();
        
        // Add scroll-to-top button
        addScrollToTopButton();
        
        // Add scroll progress indicator
        addScrollProgress();
        
        // Add particles to banner
        addParticles();
        
        // Setup event listeners
        setupEventListeners();
    }

    // Initialize the gallery
    initGallery();
}); 
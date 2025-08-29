/**
 * Footer functionality for Saraswati Gyan Mandir Inter College website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set the current year for copyright
    updateCopyrightYear();
    
    // Initialize scroll to top functionality
    initScrollToTop();
    
    // Create and animate footer particles
    createFooterParticles();
    
    // Initialize footer animations
    initFooterAnimations();
    
    // Add wave animation element
    addWaveAnimation();
});

/**
 * Updates the copyright year in the footer to the current year
 */
function updateCopyrightYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
}

/**
 * Initializes the scroll to top button functionality
 */
function initScrollToTop() {
    const scrollTopButton = document.getElementById('scroll-top');
    
    if (scrollTopButton) {
        // Show or hide scroll button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Create footer particles animation
function createFooterParticles() {
    const particlesContainer = document.getElementById('footer-particles');
    
    if (!particlesContainer) return;
    
    // Clear any existing particles
    particlesContainer.innerHTML = '';
    
    // Configuration for particles
    const config = {
        particleCount: 30,
        colors: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'rgba(255,140,66,0.2)'],
        minSize: 3,
        maxSize: 8,
        minSpeed: 0.5,
        maxSpeed: 2,
        minOpacity: 0.1,
        maxOpacity: 0.5
    };
    
    // Create particles
    for (let i = 0; i < config.particleCount; i++) {
        createParticle(particlesContainer, config);
    }
}

// Create a single particle
function createParticle(container, config) {
    const particle = document.createElement('div');
    
    // Random particle properties
    const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const left = Math.random() * 100; // position horizontally
    const top = Math.random() * 100; // position vertically
    const opacity = Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity;
    
    // Set particle style
    particle.className = 'footer-particle';
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        left: ${left}%;
        top: ${top}%;
        opacity: ${opacity};
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px ${color};
        z-index: 1;
        transform: translate(-50%, -50%);
    `;
    
    // Add animation to particle
    const duration = Math.random() * (15 - 5) + 5; // animation duration between 5-15s
    const delay = Math.random() * 5; // delay up to 5s
    const movementX = Math.random() * 40 - 20; // move +/- 20px horizontally
    const movementY = Math.random() * 40 - 20; // move +/- 20px vertically
    
    // Apply animation
    particle.animate([
        { transform: 'translate(-50%, -50%) translate(0, 0)' },
        { transform: `translate(-50%, -50%) translate(${movementX}px, ${movementY}px)` },
        { transform: 'translate(-50%, -50%) translate(0, 0)' }
    ], {
        duration: duration * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });
    
    // Add particle to container
    container.appendChild(particle);
}

// Initialize animations for footer elements
function initFooterAnimations() {
    // Social icons hover effect
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(360deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Animate links on hover
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(3px)';
                icon.style.color = 'var(--footer-accent)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = '';
                icon.style.color = '';
            }
        });
    });
    
    // Newsletter form animation
    const newsletterButton = document.querySelector('.newsletter-form button');
    if (newsletterButton) {
        newsletterButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission for demo
            
            const input = this.closest('.form-group').querySelector('input');
            if (input.value.trim() !== '') {
                // Show success message
                const form = this.closest('.newsletter-form');
                const formGroup = this.closest('.form-group');
                
                // Create success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
                successMsg.style.cssText = `
                    color: #fff;
                    background: rgba(46, 204, 113, 0.2);
                    border-radius: 50px;
                    padding: 10px 20px;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                `;
                
                // Replace form group with success message
                form.appendChild(successMsg);
                
                // Animate success message
                setTimeout(() => {
                    successMsg.style.opacity = '1';
                    successMsg.style.transform = 'translateY(0)';
                }, 100);
                
                // Clear input
                input.value = '';
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    successMsg.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        successMsg.remove();
                    }, 300);
                }, 3000);
            }
        });
    }
    
    // Parallax effect on footer when scrolling
    window.addEventListener('scroll', function() {
        const footer = document.querySelector('.site-footer');
        if (!footer) return;
        
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (footerTop < windowHeight) {
            const scrollPercentage = (windowHeight - footerTop) / windowHeight;
            const particles = document.querySelectorAll('.footer-particle');
            
            particles.forEach(particle => {
                const translateY = scrollPercentage * -20; // Move particles up by 20px maximum
                particle.style.transform = `translate(-50%, -50%) translateY(${translateY}px)`;
            });
        }
    });
}

// Add wave animation to footer
function addWaveAnimation() {
    const footer = document.querySelector('.site-footer');
    
    if (!footer) return;
    
    // Create wave element
    const waveElement = document.createElement('div');
    waveElement.className = 'wave-animation';
    waveElement.innerHTML = `
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
        </svg>
    `;
    
    // Insert at the beginning of the footer
    footer.insertBefore(waveElement, footer.firstChild);
}
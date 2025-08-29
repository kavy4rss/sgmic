// Admission Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(preloader);
    
    // Fade out preloader when page is fully loaded
    window.addEventListener('load', function() {
        preloader.classList.add('fade-out');
        setTimeout(function() {
            preloader.remove();
        }, 500);
    });

    // Scroll animations
    const scrollElements = document.querySelectorAll('.section-title, .intro-text, .timeline-item, .faq-item, .contact-card');
    
    const elementInView = (el, scrollOffset = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) - scrollOffset);
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 150)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check for elements in view
    handleScrollAnimation();

    // FAQ Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isActive = question.parentElement.classList.contains('active');
            
            // Close all FAQs
            faqQuestions.forEach(q => {
                q.parentElement.classList.remove('active');
            });
            
            // If the clicked question wasn't active, open it
            if (!isActive) {
                question.parentElement.classList.add('active');
            }
        });
    });

    // Animation for timeline items on hover
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            const number = item.querySelector('.timeline-number');
            number.style.animationPlayState = 'paused';
            number.style.transform = 'scale(1.2)';
            number.style.background = '#e09213';
        });
        
        item.addEventListener('mouseleave', () => {
            const number = item.querySelector('.timeline-number');
            number.style.animationPlayState = 'running';
            number.style.transform = '';
            number.style.background = '';
        });
    });

    // Smooth scroll for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Schedule table row highlight
    const scheduleRows = document.querySelectorAll('.schedule-table tbody tr');
    
    scheduleRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'rgba(245, 166, 35, 0.08)';
            row.style.transform = 'translateX(5px)';
            row.style.transition = 'all 0.3s ease';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
            row.style.transform = '';
        });
    });

    // Add animated background particles
    const admissionIntro = document.querySelector('.admission-intro');
    
    if (admissionIntro) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        admissionIntro.appendChild(particlesContainer);
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position, size and animation delay
            const size = Math.random() * 15 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = Math.random() * 20 + 10 + 's';
            
            particlesContainer.appendChild(particle);
        }
    }

    // Add CSS for new dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.98);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .preloader.fade-out {
            opacity: 0;
            pointer-events: none;
        }
        
        .loader {
            width: 60px;
            height: 60px;
            border: 4px solid #f5f5f5;
            border-top: 4px solid #f5a623;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .particles-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }
        
        .particle {
            position: absolute;
            background: rgba(245, 166, 35, 0.15);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.5;
            animation: float 15s infinite linear;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0.2;
            }
            25% {
                opacity: 0.5;
            }
            50% {
                transform: translateY(-150px) translateX(100px) rotate(180deg);
                opacity: 0.3;
            }
            75% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(0) translateX(0) rotate(360deg);
                opacity: 0.2;
            }
        }
        
        .scrolled {
            visibility: visible !important;
        }
    `;
    document.head.appendChild(style);

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Add CSS for scroll progress
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #f5a623, #e09213);
            z-index: 9999;
            transition: width 0.2s ease;
        }
    `;
    document.head.appendChild(progressStyle);
    
    // Update progress bar on scroll
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    // Add back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    // Add CSS for back to top button
    const backToTopStyle = document.createElement('style');
    backToTopStyle.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #f5a623;
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 100;
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background: #e09213;
            transform: translateY(-5px);
        }
    `;
    document.head.appendChild(backToTopStyle);
    
    // Show/hide back to top button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 
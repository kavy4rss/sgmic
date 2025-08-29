// Loading functionality
document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader after page loads
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);

        // Animate sections on scroll
        const sections = document.querySelectorAll('.page-banner, .section-content, .info-section, .gallery-section, .contact-section, .about-section, .academics-section, .fees-section, .syllabus-section, .streams-section, .achievements-section, .press-section, .video-section');
        const cards = document.querySelectorAll('.card, .gallery-item, .team-member, .achievement-card, .press-card, .video-card');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // If the section contains cards, animate them with delay
                    if (entry.target.querySelector('.card, .gallery-item, .team-member, .achievement-card, .press-card, .video-card')) {
                        const sectionCards = entry.target.querySelectorAll('.card, .gallery-item, .team-member, .achievement-card, .press-card, .video-card');
                        sectionCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('visible');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    });
}); 
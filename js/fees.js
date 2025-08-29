// Fees Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Force disable any animations on logo
    const schoolLogo = document.querySelector('.school-logo');
    const logoContainer = document.querySelector('.logo-container');
    
    if (schoolLogo) {
        schoolLogo.style.animation = 'none';
        schoolLogo.style.transform = 'none';
        schoolLogo.style.transition = 'none';
    }
    
    if (logoContainer) {
        logoContainer.style.animation = 'none';
        logoContainer.style.transform = 'none';
        logoContainer.style.transition = 'none';
    }
    
    // Preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-spinner">
            <svg viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="#f5a623" stroke-width="5"></circle>
            </svg>
        </div>
        <p>Loading Fees Information...</p>
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
    const faqItems = document.querySelectorAll('.faq-item');
    const feeCards = document.querySelectorAll('.fee-card');
    const infoCards = document.querySelectorAll('.info-card');

    // FAQ toggle functionality
    function initFaq() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon i');

            question.addEventListener('click', function() {
                answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
                icon.classList.toggle('fa-chevron-right');
                icon.classList.toggle('fa-chevron-down');
            });
        });
    }

    // Animate fee cards on hover
    function initFeeCards() {
        feeCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = 'var(--shadow-md)';
            });
        });
    }

    // Scroll animations
    function initScrollAnimations() {
        const animated = document.querySelectorAll('.section-title, .intro-text, .fee-card, .info-card, .method-card, .faq-item');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            animated.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            animated.forEach(element => {
                element.classList.add('animated');
            });
        }
    }

    // Add scroll to top button
    function addScrollToTopButton() {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollTopBtn);
        
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
                background-color: var(--primary-color);
                color: white;
                border: none;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 99;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .scroll-top-btn.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .scroll-top-btn:hover {
                background-color: var(--primary-dark);
                transform: translateY(-5px);
            }
            @media (max-width: 767px) {
                .scroll-top-btn {
                    width: 40px;
                    height: 40px;
                    bottom: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(scrollBtnStyle);
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
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
                width: 0;
                height: 4px;
                background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
                z-index: 9999;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(progressStyle);
        
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Add particle background effect to banner
    function addBannerParticles() {
        const banner = document.querySelector('.page-banner');
        if (!banner) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        banner.appendChild(particlesContainer);
        
        // Add styles
        const particlesStyle = document.createElement('style');
        particlesStyle.textContent = `
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
                background-color: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
            }
        `;
        document.head.appendChild(particlesStyle);
        
        // Create particles with no animation
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size
            const size = Math.random() * 5 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random position
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            particlesContainer.appendChild(particle);
        }
    }

    // Smooth scroll to section when clicking on navigation links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

    // Add fee calculator functionality
    function initFeeCalculator() {
        const calculator = document.querySelector('.fee-calculator');
        if (!calculator) return;
        
        const classSelect = calculator.querySelector('#classSelect');
        const boardingSelect = calculator.querySelector('#boardingSelect');
        const calculateBtn = calculator.querySelector('#calculateBtn');
        const resultDiv = calculator.querySelector('.calculator-result');
        
        calculateBtn.addEventListener('click', function() {
            const selectedClass = classSelect.value;
            const isBoarder = boardingSelect.value === 'yes';
            
            let tuitionFee = 0;
            let otherFees = 0;
            
            // Calculate fees based on class
            switch (selectedClass) {
                case 'lkg-ukg':
                    tuitionFee = 2500;
                    otherFees = 5000;
                    break;
                case '1-5':
                    tuitionFee = 3000;
                    otherFees = 5500;
                    break;
                case '6-8':
                    tuitionFee = 3500;
                    otherFees = 6000;
                    break;
                case '9-10':
                    tuitionFee = 4000;
                    otherFees = 7000;
                    break;
                case '11-12':
                    tuitionFee = 5000;
                    otherFees = 8000;
                    break;
            }
            
            // Add boarding fees if applicable
            const boardingFee = isBoarder ? 8000 : 0;
            
            // Calculate total
            const totalFee = tuitionFee + otherFees + boardingFee;
            
            // Display result
            resultDiv.innerHTML = `
                <div class="result-card">
                    <h3>Fee Estimate</h3>
                    <div class="result-item">
                        <span>Tuition Fee:</span>
                        <span>₹${tuitionFee.toLocaleString()}</span>
                    </div>
                    <div class="result-item">
                        <span>Other Fees:</span>
                        <span>₹${otherFees.toLocaleString()}</span>
                    </div>
                    ${isBoarder ? `
                    <div class="result-item">
                        <span>Boarding Fee:</span>
                        <span>₹${boardingFee.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    <div class="result-total">
                        <span>Total (per quarter):</span>
                        <span>₹${totalFee.toLocaleString()}</span>
                    </div>
                    <div class="result-annual">
                        <span>Annual Total:</span>
                        <span>₹${(totalFee * 4).toLocaleString()}</span>
                    </div>
                    <p class="result-note">*This is an estimate. Please contact the school office for exact fee details.</p>
                </div>
            `;
            
            resultDiv.style.display = 'block';
        });
    }

    // Initialize page functions
    function initFeesPage() {
        initFaq();
        initFeeCards();
        initScrollAnimations();
        addScrollToTopButton();
        addScrollProgress();
        addBannerParticles();
        initSmoothScrolling();
        initFeeCalculator();
    }

    // Initialize when document is loaded
    window.addEventListener('load', initFeesPage);

    // Fee Calculator
    const calculateBtn = document.getElementById('calculateBtn');
    const calculatorResult = document.querySelector('.calculator-result');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const classValue = document.getElementById('classSelect').value;
            const boarding = document.getElementById('boardingSelect').value;
            
            if (!classValue) {
                alert('Please select a class.');
                return;
            }
            
            const fees = calculateFees(classValue, boarding);
            displayFeeResult(fees);
        });
    }
    
    // Function to calculate fees based on class and boarding option
    function calculateFees(classValue, boarding) {
        let tuitionFee = 0;
        let otherFees = 0;
        let admissionFee = 0;
        let boardingFee = 0;
        
        // Annual fees for different classes
        switch(classValue) {
            case 'pg':
                tuitionFee = 2200 * 12; // Annual tuition
                otherFees = 500 + 800 + 1000; // Computer + Activity + Development
                admissionFee = 3000;
                break;
            case 'nursery':
                tuitionFee = 2400 * 12;
                otherFees = 600 + 800 + 1200;
                admissionFee = 3500;
                break;
            case 'kg':
                tuitionFee = 2600 * 12;
                otherFees = 700 + 800 + 1400;
                admissionFee = 4000;
                break;
            case 'class1':
                tuitionFee = 2800 * 12;
                otherFees = 800 + 500 + 700 + 1500;
                admissionFee = 4500;
                break;
            case 'class2':
                tuitionFee = 3000 * 12;
                otherFees = 800 + 500 + 700 + 1500;
                admissionFee = 4500;
                break;
            case 'class3':
                tuitionFee = 3200 * 12;
                otherFees = 800 + 500 + 700 + 1500;
                admissionFee = 4500;
                break;
            case 'class4':
                tuitionFee = 3400 * 12;
                otherFees = 800 + 500 + 700 + 1500;
                admissionFee = 4500;
                break;
            case 'class5':
                tuitionFee = 3600 * 12;
                otherFees = 800 + 500 + 700 + 1500;
                admissionFee = 4500;
                break;
            case 'class6-8':
                tuitionFee = 3800 * 12;
                otherFees = 1000 + 700 + 800 + 2000;
                admissionFee = 6000;
                break;
            case 'class9-12':
                tuitionFee = 4500 * 12;
                otherFees = 1200 + 1500 + 800 + 1000 + 2500;
                admissionFee = 8000;
                break;
            default:
                tuitionFee = 0;
                otherFees = 0;
                admissionFee = 0;
        }
        
        // Add boarding fee if selected
        if (boarding === 'yes') {
            boardingFee = 60000; // Annual boarding fee
        }
        
        return {
            tuitionFee,
            otherFees,
            admissionFee,
            boardingFee,
            totalAnnualFee: tuitionFee + otherFees,
            totalWithAdmission: tuitionFee + otherFees + admissionFee,
            totalWithBoarding: tuitionFee + otherFees + boardingFee,
            totalAll: tuitionFee + otherFees + admissionFee + boardingFee
        };
    }
    
    // Function to display calculated fees
    function displayFeeResult(fees) {
        const calculatorResult = document.querySelector('.calculator-result');
        
        if (!calculatorResult) return;
        
        let resultHTML = `
            <div class="result-card">
                <h3>Fee Details</h3>
                <div class="result-item">
                    <span class="result-label">Annual Tuition Fee:</span>
                    <span class="result-value">₹${fees.tuitionFee.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Other Annual Fees:</span>
                    <span class="result-value">₹${fees.otherFees.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item highlight">
                    <span class="result-label">Total Annual Fee:</span>
                    <span class="result-value">₹${fees.totalAnnualFee.toLocaleString('en-IN')}</span>
                </div>`;
        
        // Add admission fee for new students
        resultHTML += `
                <div class="result-divider"></div>
                <div class="result-item">
                    <span class="result-label">One-time Admission Fee (New Students):</span>
                    <span class="result-value">₹${fees.admissionFee.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item highlight">
                    <span class="result-label">Total with Admission Fee:</span>
                    <span class="result-value">₹${fees.totalWithAdmission.toLocaleString('en-IN')}</span>
                </div>`;
        
        // Add boarding fees if applicable
        if (fees.boardingFee > 0) {
            resultHTML += `
                <div class="result-divider"></div>
                <div class="result-item">
                    <span class="result-label">Annual Boarding Fee:</span>
                    <span class="result-value">₹${fees.boardingFee.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item highlight">
                    <span class="result-label">Total with Boarding Fee:</span>
                    <span class="result-value">₹${fees.totalWithBoarding.toLocaleString('en-IN')}</span>
                </div>
                <div class="result-item grand-total">
                    <span class="result-label">Grand Total (with Admission & Boarding):</span>
                    <span class="result-value">₹${fees.totalAll.toLocaleString('en-IN')}</span>
                </div>`;
        }
        
        resultHTML += `
                <div class="result-note">
                    <p>* This is an estimate. Please contact the school office for exact fee details.</p>
                    <p>* 5% discount on annual tuition fee payment.</p>
                </div>
            </div>`;
        
        calculatorResult.innerHTML = resultHTML;
        calculatorResult.style.display = 'block';
    }
    
    // Update current year in the footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}); 
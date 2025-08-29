document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Animated counters
    const counters = document.querySelectorAll('.count');
    const speed = 200;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / speed;
                    
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counter.innerText = '0';
        observer.observe(counter);
    });
    
    // Fetch skills content if needed
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        fetch('https://sgmic.in/school-skills.php')
            .then(response => response.text())
            .then(html => {
                // Extract only the content you need
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.querySelector('.skills-content'); // Adjust selector as needed
                
                if (content) {
                    skillsContainer.innerHTML = content.innerHTML;
                }
            })
            .catch(error => {
                console.error('Error fetching skills content:', error);
                skillsContainer.innerHTML = '<p>Failed to load skills content. Please visit <a href="https://sgmic.in/school-skills.php" target="_blank">our skills page</a>.</p>';
            });
    }

    // Timeline animation - only run if timeline items exist
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Achievement counters animation
    const achievementCounters = document.querySelectorAll('.achievement-stats .count');
    if (achievementCounters.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    let count = 0;
                    
                    const updateCount = () => {
                        const increment = target / 100;
                        
                        if (count < target) {
                            count += increment;
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        achievementCounters.forEach(counter => {
            counter.innerText = '0';
            observer.observe(counter);
        });
    }
}); 
// Basic gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentIndex = 0;

    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        const item = galleryItems[currentIndex];
        // Use data-src attribute first, fall back to src if data-src isn't available
        const imgSrc = item.querySelector('img').getAttribute('data-src') || item.querySelector('img').getAttribute('src');
        
        console.log("Opening lightbox with image:", imgSrc);
        
        // Set the image source directly 
        lightboxImage.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentIndex);
    }

    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openLightbox(currentIndex);
    }

    // Add event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Close button
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Click outside image to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Previous button
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        prevImage();
    });
    
    // Next button
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        nextImage();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
}); 
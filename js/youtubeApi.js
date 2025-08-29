// YouTube API Configuration
const YOUTUBE_API_KEYS = [
    'AIzaSyBH6rwUrwR8tr0V-yK1uSJTDKtPtQmHR94', // Primary YouTube API key
    'AIzaSyC9XcEU4cYx_2WaaxXes_hSV-lpG9qC5jw', // Secondary YouTube API key
    'AIzaSyCSp-PzSfHKwTPW6klr717HW1AzZlNKwMY'  // Third YouTube API key
];
let currentApiKeyIndex = 0; // Track which API key we're currently using
const CHANNEL_ID = 'UC2ZqqW2cctZs0avk2-C9Z1Q'; // YouTube channel ID
const MAX_RESULTS_PER_PAGE = 6; // Number of videos to fetch initially
const MAX_VIDEOS_TOTAL = 30; // Maximum total videos to load with "load more"

// Global variables for pagination
let nextPageToken = '';
let videosLoaded = 0;
let allVideos = [];

// Function to load YouTube videos
function loadYouTubeVideos(loadMore = false) {
    // Show loading indicator
    const videoGrid = document.getElementById('youtube-video-grid');
    const loadMoreContainer = document.getElementById('load-more-container');
    
    if (!videoGrid) return;
    
    if (!loadMore) {
        videoGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading latest videos...</div>';
    } else {
        // Add loading indicator at the bottom
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-spinner';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more videos...';
        loadingIndicator.id = 'load-more-spinner';
        videoGrid.appendChild(loadingIndicator);
    }
    
    // Fetch videos from YouTube API
    fetchVideosFromYouTube(loadMore)
        .then(videos => {
            if (videos && videos.length > 0) {
                // Store videos for pagination
                if (!loadMore) {
                    allVideos = videos;
                    videosLoaded = videos.length;
                } else {
                    // Remove loading indicator if load more
                    const spinner = document.getElementById('load-more-spinner');
                    if (spinner) spinner.remove();
                    
                    // Add new videos to the array
                    allVideos = [...allVideos, ...videos];
                    videosLoaded += videos.length;
                }
                
                // Clear grid if not loading more
                if (!loadMore) {
                    videoGrid.innerHTML = '';
                }
                
                // Display videos
                videos.forEach(video => {
                    const videoCard = createVideoCard(video);
                    videoGrid.appendChild(videoCard);
                });
                
                // Show load more button if there are more videos to load
                if (nextPageToken && videosLoaded < MAX_VIDEOS_TOTAL) {
                    loadMoreContainer.style.display = 'block';
                } else {
                    loadMoreContainer.style.display = 'none';
                }
            } else {
                if (!loadMore) {
                    videoGrid.innerHTML = '<div class="error-message">No videos found. Please check back later.</div>';
                } else {
                    // Remove loading indicator if load more
                    const spinner = document.getElementById('load-more-spinner');
                    if (spinner) spinner.remove();
                    
                    loadMoreContainer.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('Error loading YouTube videos:', error);
            if (!loadMore) {
                videoGrid.innerHTML = '<div class="error-message">Error loading videos. Please try again later.</div>';
            } else {
                // Remove loading indicator if load more
                const spinner = document.getElementById('load-more-spinner');
                if (spinner) spinner.remove();
            }
        });
}

// Fetch videos from YouTube API
async function fetchVideosFromYouTube(loadMore = false) {
    // Start with current API key index
    let startingKeyIndex = currentApiKeyIndex;
    let attempts = 0;
    
    // Try each API key until one works or we've tried them all
    while (attempts < YOUTUBE_API_KEYS.length) {
        try {
            // Get the current API key
            const apiKey = YOUTUBE_API_KEYS[currentApiKeyIndex];
            
            // For production: Use this URL with your actual API key
            let apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS_PER_PAGE}&type=video`;
            
            // Add page token if loading more
            if (loadMore && nextPageToken) {
                apiUrl += `&pageToken=${nextPageToken}`;
            }
            
            // For development/testing: Use local fallback data
            // Uncomment the line below and comment out the fetch call for testing without API key
            // return getFallbackVideos(loadMore);
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.error) {
                console.error('YouTube API Error with key index ' + currentApiKeyIndex + ':', data.error);
                
                // Try the next API key
                currentApiKeyIndex = (currentApiKeyIndex + 1) % YOUTUBE_API_KEYS.length;
                attempts++;
                
                // If we've tried all keys and returned to the starting key, use fallback
                if (currentApiKeyIndex === startingKeyIndex || attempts >= YOUTUBE_API_KEYS.length) {
                    console.log('All API keys exhausted, using fallback data');
                    return getFallbackVideos(loadMore);
                }
                
                // Try again with the next key
                continue;
            }
            
            // Store next page token for pagination
            nextPageToken = data.nextPageToken || '';
            
            return data.items.map(item => {
                return {
                    id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnailUrl: item.snippet.thumbnails.high.url,
                    publishedAt: new Date(item.snippet.publishedAt)
                };
            });
        } catch (error) {
            console.error('Error fetching YouTube videos with key index ' + currentApiKeyIndex + ':', error);
            
            // Try the next API key
            currentApiKeyIndex = (currentApiKeyIndex + 1) % YOUTUBE_API_KEYS.length;
            attempts++;
            
            // If we've tried all keys and returned to the starting key, use fallback
            if (currentApiKeyIndex === startingKeyIndex || attempts >= YOUTUBE_API_KEYS.length) {
                console.log('All API keys exhausted, using fallback data');
                return getFallbackVideos(loadMore);
            }
        }
    }
    
    // If all attempts fail, use fallback
    return getFallbackVideos(loadMore);
}

// Create video card element
function createVideoCard(video) {
    const videoDate = formatDate(video.publishedAt);
    
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    
    videoCard.innerHTML = `
        <div class="video-container">
            <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" class="youtube-thumbnail">
                <img src="${video.thumbnailUrl}" alt="${video.title}" />
                <div class="play-button">
                    <i class="fab fa-youtube"></i>
                </div>
            </a>
        </div>
        <div class="video-content">
            <div class="video-date">
                <i class="fas fa-calendar-alt"></i> ${videoDate}
            </div>
            <h3 class="video-title">${video.title}</h3>
            <p class="video-description">${truncateText(video.description, 150)}</p>
        </div>
    `;
    
    return videoCard;
}

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Fallback videos for testing or when API fails
function getFallbackVideos(loadMore = false) {
    const allFallbackVideos = [
        {
            id: "jA3S2YOPYdk",
            title: "School Annual Day Celebration",
            description: "Highlights from our school's annual day celebration featuring cultural performances, prize distribution, and speeches by distinguished guests.",
            publishedAt: new Date('2024-03-20')
        },
        {
            id: "bHQqvYy5KYo",
            title: "Cultural Dance Performance",
            description: "Students showcase traditional dances representing the cultural diversity of India during the Basant Panchami celebration.",
            publishedAt: new Date('2024-02-15')
        },
        {
            id: "9ZI1hLFfFhQ",
            title: "Science Exhibition",
            description: "Innovative science projects presented by our students during the annual science exhibition demonstrating practical applications of scientific concepts.",
            publishedAt: new Date('2024-01-25')
        },
        {
            id: "nPpLLWvLuSQ",
            title: "Annual Sports Day",
            description: "Highlights from our annual sports day featuring track and field events, team sports competitions, and the award ceremony.",
            publishedAt: new Date('2023-12-10')
        },
        {
            id: "X9QjFGP0n1Y",
            title: "Independence Day Celebration",
            description: "Flag hoisting ceremony, patriotic performances, and speeches commemorating India's independence at our school campus.",
            publishedAt: new Date('2023-08-15')
        },
        {
            id: "dFpnfxEPb0U",
            title: "Music Concert",
            description: "Students demonstrate their musical talents through vocal and instrumental performances during the school's music concert.",
            publishedAt: new Date('2023-11-05')
        },
        {
            id: "SQCfOjhguO0",
            title: "Mathematics Competition",
            description: "Our students participating in the district-level mathematics competition and winning top honors.",
            publishedAt: new Date('2023-10-20')
        },
        {
            id: "Y2kX_lh_TNs",
            title: "Cricket Tournament Final",
            description: "Exciting moments from the final match of our inter-school cricket tournament.",
            publishedAt: new Date('2023-09-30')
        },
        {
            id: "dxHuHMlYD9I",
            title: "Teacher's Day Special",
            description: "Students organize special performances and activities to honor their teachers on Teacher's Day.",
            publishedAt: new Date('2023-09-05')
        },
        {
            id: "K7JxB9Ognco",
            title: "Folk Dance Competition",
            description: "Our talented students performing traditional folk dances in the state-level competition.",
            publishedAt: new Date('2023-07-25')
        }
    ];
    
    // For first page
    if (!loadMore) {
        nextPageToken = 'dummy-token'; // Set dummy token for pagination simulation
        return allFallbackVideos.slice(0, MAX_RESULTS_PER_PAGE);
    } 
    // For second page
    else if (loadMore && nextPageToken === 'dummy-token') {
        nextPageToken = ''; // No more pages after this
        return allFallbackVideos.slice(MAX_RESULTS_PER_PAGE);
    }
    
    // No more videos
    return [];
}

// Load videos when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the video gallery page
    if (document.getElementById('youtube-video-grid')) {
        loadYouTubeVideos();
        
        // Initialize load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                loadYouTubeVideos(true); // Load more videos
            });
        }
    }
}); 
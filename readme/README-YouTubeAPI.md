# YouTube API Integration for Video Gallery

This document explains how to set up the YouTube API integration for the Saraswati Gyan Mandir Inter College website's video gallery feature.

## Overview

The video gallery page automatically fetches and displays the latest videos from the school's YouTube channel using the YouTube Data API v3. This requires obtaining an API key from Google and setting up your YouTube channel properly.

## Setup Instructions

### 1. Create a Google API Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable the YouTube Data API v3 for your project:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and enable it

### 2. Get an API Key

1. In your Google Cloud Console project, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "API key"
3. Copy the generated API key
4. (Optional but recommended) Restrict the API key to only the YouTube Data API v3 and your website domain

### 3. Update the Website Code

1. Open the file `SGMIC Website/js/youtubeApi.js`
2. The file now supports multiple API keys for redundancy. Replace the placeholder API keys with your actual keys:
   ```javascript
   const YOUTUBE_API_KEYS = [
       'YOUR_PRIMARY_API_KEY_HERE',
       'YOUR_SECONDARY_API_KEY_HERE',
       'YOUR_THIRD_API_KEY_HERE'
   ];
   ```

3. Replace `YOUR_CHANNEL_ID` with your YouTube channel ID:
   ```javascript
   const CHANNEL_ID = 'YOUR_ACTUAL_CHANNEL_ID_HERE';
   ```

4. Also update the YouTube subscribe button link in `video-gallery.html`:
   ```html
   <a href="https://www.youtube.com/channel/YOUR_CHANNEL_ID" target="_blank" class="subscribe-btn">
   ```

### 4. Find Your YouTube Channel ID

If you don't know your YouTube channel ID:

1. Go to your YouTube channel page
2. The URL will be something like: `https://www.youtube.com/channel/UC...`
3. The part after `/channel/` is your channel ID

Alternatively:
1. Go to your YouTube Studio
2. Click on "Settings" (gear icon) in the bottom left
3. Click on "Channel" > "Advanced settings"
4. Your channel ID will be displayed there

## Using Multiple API Keys

The video gallery now supports multiple YouTube API keys to handle quota limits. When one key reaches its quota limit, the system will automatically try the next key.

### Benefits of Multiple API Keys

1. **Higher Quota Limits**: Each API key has its own daily quota. Using multiple keys gives you more requests per day.
2. **Redundancy**: If one key has issues or reaches its quota, others can take over.
3. **Continuous Service**: Your video gallery will continue to work even if one API key is exhausted.

### How to Create Multiple API Keys

1. You can create multiple API keys from the same Google Cloud project:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Click "Create Credentials" > "API key" for each new key you need
   
2. Alternatively, create separate projects:
   - Create a new Google Cloud project
   - Enable the YouTube Data API v3
   - Create an API key for that project
   - Repeat for each API key needed

## Testing

During development and testing, you can use the fallback videos functionality:

1. Open the file `SGMIC Website/js/youtubeApi.js`
2. Uncomment the line:
   ```javascript
   // return getFallbackVideos(loadMore);
   ```
3. Comment out the fetch call to the YouTube API

This will display sample videos without using your API quota.

## API Quota Limits

The YouTube Data API has quota limits:
- Free tier: 10,000 units per day
- Each search request costs 100 units

To optimize quota usage:
1. Consider setting `MAX_RESULTS_PER_PAGE` to a smaller number (e.g., 6 or 8)
2. Implement caching on the server-side if possible
3. Only reload videos when necessary
4. Use multiple API keys as described above

## Troubleshooting

If videos don't load:

1. Check browser console for errors
2. Verify your API keys are correct and have YouTube Data API access
3. Ensure your channel ID is correct
4. Check if you've reached your API quota limits on all keys
5. Try using the fallback videos to verify the rest of the code works

## Support

For Google API specific issues, refer to:
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3/docs/)
- [Google Cloud Console Support](https://console.cloud.google.com/support) 
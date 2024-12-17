// src/utils/memeParser.js

/**
 * @typedef {Object} MemeUsage
 * @property {Date} date
 * @property {number} captions
 */

/**
 * @typedef {Object} Meme
 * @property {string} url
 * @property {string} title
 * @property {string} image_url
 * @property {MemeUsage[]|null} usage_history
 */

/**
 * @typedef {Object} Metadata
 * @property {number} total_memes
 * @property {number} successful
 * @property {number} failed
 * @property {Date} last_updated
 * @property {number} pages_scraped
 */

/**
 * Generate rotating mock logs for TikTok and YouTube
 * @returns {{tiktok: string[], youtube: string[]}}
 */
const generateMockLogs = () => {
    const tiktokTemplates = [
      "Scraping TikTok hashtag #{} - Found {} new memes",
      "Processing TikTok trend {} - {} matches",
      "Analyzing TikTok user @{} content - {} relevant posts",
      "TikTok API rate limit at {}% - Cooling down"
    ];
  
    const youtubeTemplates = [
      "Scanning YouTube channel {} - {} meme references found",
      "YouTube trending analysis - {} potential memes",
      "Processing YouTube comments from {} videos",
      "YouTube search API quota: {}% remaining"
    ];
  
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  
    const formatTemplate = (template) => {
      const hashtags = ["memes2024", "memetime", "viral", "trending"];
      const channels = ["MemeReview", "DankCompilations", "TrendingNow"];
      
      return template
        .replace("{}", randomChoice(hashtags) || randomChoice(channels))
        .replace("{}", randomNumber(10, 500));
    };
  
    return {
      tiktok: Array(5).fill(null).map(() => formatTemplate(randomChoice(tiktokTemplates))),
      youtube: Array(5).fill(null).map(() => formatTemplate(randomChoice(youtubeTemplates)))
    };
  };
  
  /**
   * Parse usage history data for a meme
   * @param {Array|null} history
   * @returns {MemeUsage[]|null}
   */
  const parseUsageHistory = (history) => {
    if (!history) return null;
  
    return history.map(entry => ({
      date: new Date(entry.date),
      captions: Number(entry.captions)
    }));
  };
  
  /**
   * Validate and parse meme data
   * @param {Object} data 
   * @throws {Error}
   * @returns {Object}
   */
  const parseMemeData = (data) => {
    try {
      // Validate and parse metadata
      const metadata = {
        total_memes: Number(data.metadata.total_memes),
        successful: Number(data.metadata.successful),
        failed: Number(data.metadata.failed),
        last_updated: new Date(data.metadata.last_updated),
        pages_scraped: Number(data.metadata.pages_scraped)
      };
  
      // Validate numbers
      Object.entries(metadata).forEach(([key, value]) => {
        if (key !== 'last_updated' && (!Number.isFinite(value) || value < 0)) {
          throw new Error(`Invalid ${key} value: ${value}`);
        }
      });
  
      // Parse memes
      const memes = data.memes.map(meme => ({
        url: String(meme.url),
        title: String(meme.title),
        image_url: String(meme.image_url),
        usage_history: parseUsageHistory(meme.usage_history)
      }));
  
      return { metadata, memes };
    } catch (error) {
      throw new Error(`Invalid meme data structure: ${error.message}`);
    }
  };
  
  /**
   * Prepare data for frontend consumption
   * @param {Object} parsedData 
   * @returns {Object}
   */

 const prepareFrontendData = (parsedData) => {
   const frontendData = {
     metadata: {
       total_memes: parsedData.metadata.total_memes,
       successful: parsedData.metadata.successful,
       failed: parsedData.metadata.failed,
       last_updated: parsedData.metadata.last_updated.toISOString(),
       pages_scraped: parsedData.metadata.pages_scraped
     },
     memes: parsedData.memes.map(meme => ({
       title: meme.title,
       url: meme.url,
       image_url: meme.image_url,
       usage_data: meme.usage_history ? {
         dates: meme.usage_history.map(usage => usage.date.toISOString().split('T')[0]),
         captions: meme.usage_history.map(usage => usage.captions)
       } : null
     })),
     currentMemeIndex: 0,
     logs: generateMockLogs(parsedData.memes[0]?.title || '')
   };
 
   return frontendData;
 };
  /**
   * Process meme data and prepare it for frontend use
   * @param {Object|string} data 
   * @returns {Object}
   */
  export const processMemeData = (data) => {
    try {
      const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
      const parsedData = parseMemeData(jsonData);
      return prepareFrontendData(parsedData);
    } catch (error) {
      throw new Error(`Error processing meme data: ${error.message}`);
    }
  };
  
  /**
   * Get fresh logs for rotation
   * @returns {Object}
   */
  export const getRotatingLogs = () => {
    return generateMockLogs();
  };
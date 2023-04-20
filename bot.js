const TelegramBot = require('node-telegram-bot-api');
const TikTokScraper = require('tiktok-scraper');
const tiktok = require('tiktok-scraper-without-watermark');
// replace the value below with the Telegram token you receive from @BotFather
const token = '6232376947:AAED5amYASDDRf61Xsdy0a560N9ws0IuqS0';
const fs = require('fs');
const ytdl = require('ytdl-core');
const youtubedl = require('youtube-dl-exec');
const tiktokscraper = require("tiktok-scraper-ts");
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const textToSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-')
}

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
async function downloadYT(url) {
  let videoInfo = await ytdl.getBasicInfo(url);
  console.log(videoInfo);
  let videoTitle = videoInfo.videoDetails.title;
  let videoId = videoInfo.videoDetails.videoId;
  let videoUrl = videoInfo.videoDetails.video_url;
  let videoDuration = videoInfo.videoDetails.lengthSeconds;
  let videoThumbnail = videoInfo.videoDetails.thumbnail.thumbnails[0].url;
  console.log(videoTitle, videoId, videoUrl, videoDuration, videoThumbnail);
}

 bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  let url = msg.text;
  // await downloadYT(url);
  if(ytdl.validateURL(url)){
    let mp4file = ytdl.getURLVideoID(url) + ".mp4";
		bot.sendMessage(chatId, "Downloading File...");
    ytdl(url, { filter: 'audioandvideo' })
    .pipe(fs.createWriteStream(mp4file))
    .on('finish', () => {
      bot.sendVideo(chatId, mp4file)
      .then(() => {
        fs.unlink(mp4file, (err) => {
          if (err) throw err;
          
        });
      })
    });
	}else{
		bot.sendMessage(chatId, "Invalid URL");
	}
  // send a message to the chat acknowledging receipt of their message
 
});
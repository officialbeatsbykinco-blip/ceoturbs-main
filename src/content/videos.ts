// CEO Turbo's YouTube videos (titles, dates and lengths from YouTube). Embedded with a click-to-load
// facade (YouTubeLite) so they never slow the page, and listed in video-sitemap.xml + VideoObject schema.
export type YouTubeVideo = {
  id: string;
  title: string;
  /** Plain-language summary for captions, schema and AI answers. */
  summary: string;
  uploadDate: string;
  /** Seconds. */
  seconds: number;
  topic: "reviews" | "websites" | "ads" | "restaurants";
  /** Short (vertical, under a minute). */
  short?: boolean;
};

export const VIDEOS: YouTubeVideo[] = [
  { id: "GawK2AZjx2U", title: "How We Got This Appliance Company 55+ Customers for $357", summary: "A real Meta and Google ads campaign for Appliance King in Macon, GA: 55+ customers from $357 in ad spend, and exactly how the ads, landing page and follow-up were set up.", uploadDate: "2026-10-23T16:42:53-07:00", seconds: 270, topic: "ads" },
  { id: "-RUSUHhkzy0", title: "We Ran Google Ads for This Company and It Went Amazing", summary: "A walk through a local Google Ads campaign we ran: the search terms, the cost per conversion and what made the phone ring.", uploadDate: "2026-11-05T15:47:08-08:00", seconds: 392, topic: "ads" },
  { id: "9Z-ytdG9MxI", title: "He Had $43 in the Bank. Then He Got a Website", summary: "Why a local business needs a website: Marcus, a car detailer with $43 in the bank, and how a simple website plus Google turned searches into booked jobs.", uploadDate: "2026-11-14T11:16:44-08:00", seconds: 483, topic: "websites" },
  { id: "EUg98hFYrHE", title: "Her Food Was Better. So Why Was Their Restaurant Packed?", summary: "Why the restaurant with worse food gets more customers: Google reviews, the map pack and how one tap card on every table changes it.", uploadDate: "2026-11-14T17:14:01-08:00", seconds: 560, topic: "restaurants" },
  { id: "6HY1g0yiBPE", title: "He Tried to Get 5 Stars. He Should Have Stayed a 3.2", summary: "What happens when a business chases a perfect rating the wrong way, and the honest way to get more Google reviews that also follows Google's rules.", uploadDate: "2026-11-05T09:29:55-08:00", seconds: 465, topic: "reviews" },
  { id: "H5lVnNJNFM8", title: "I Stopped Asking for Google Reviews. I Started Handing Them This", summary: "Customers say yes to “leave us a review” and almost never do it. The 10-second in-person ask with a tap card that gets the review before they leave.", uploadDate: "2026-11-05T17:01:12-08:00", seconds: 266, topic: "reviews" },
  { id: "frU4xpu7u2k", title: "Websites + Ads That Make the Phone Ring", summary: "When someone searches “plumber near me” they call whoever shows up first. CEO Turbo builds the website, the Google profile and the ads that put you there.", uploadDate: "2026-11-13T12:36:45-08:00", seconds: 42, topic: "websites", short: true },
  { id: "mF1pkMsQxec", title: "Nice Website… Zero Calls? Here's the Fix", summary: "A nice website doesn't help if nobody calls. We build the site, then run the ads that bring people to it.", uploadDate: "2026-11-14T10:06:19-08:00", seconds: 20, topic: "websites", short: true },
];

export const videosFor = (topic: YouTubeVideo["topic"]) => VIDEOS.filter((v) => v.topic === topic);
export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const isoDuration = (s: number) => `PT${Math.floor(s / 60)}M${s % 60}S`;

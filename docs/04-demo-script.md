# TrendLens: 2-minute demo script

**For the person recording.** Thank you for helping! This video is graded, so it needs to show the **AI feature working on the live app**. Read the **Say** lines more or less word for word (about 280 words, an easy pace for 2 minutes), and do the **Do** steps at the same time. Total length: **2:00 or less**.

- Live app: **https://trendlens-neon.vercel.app**
- GitHub Actions: **https://github.com/Marc-VGC/trendlens/actions**

---

## Before you record (10 minutes)

1. **Computer**
   - Turn on **Do Not Disturb** (no notifications in the video).
   - Close other apps and browser tabs.
   - Use Chrome or Safari. Make the window about **1280 × 800** and set the browser zoom to **110%** so text is readable.
2. **Sign in once**
   - Open the live app, click **Sign in**, then **Sign up** (email or Google). Use any account; the small "Development mode" label on the form is normal.
   - **Do a practice run:** click **Ask**, paste the demo question below, click **Build report**, and note how long it takes (usually 15–30 seconds).
3. **Set up the tabs** in a normal (signed-in) window, in this order:
   - Tab 1: https://trendlens-neon.vercel.app (the home page, signed in)
   - Tab 2: https://github.com/Marc-VGC/trendlens/actions
4. **Open a private window** (Chrome: ⌘⇧N, Safari: ⌘⇧N), leave it empty, and keep it ready behind the main window.
5. **Copy the demo question** to the clipboard so you can paste it instead of typing:

   > Compare inflation in New Zealand, Australia and the United States over the last 15 years

6. **Start recording**
   - QuickTime: **File → New Screen Recording**, choose your microphone in **Options**, then record the browser window.
   - Or use Loom: **Screen + Cam** or **Screen only**.
   - Do a 5-second sound check first.

---

## The script

| Time | Do | Say |
|---|---|---|
| **0:00–0:12** | Tab 1, the home page. Don't click yet; slowly move the mouse over the headline. | "Students and analysts need country comparisons they can actually cite. Chatbots are fast, but they can invent numbers. TrendLens answers with real World Bank data, and checks every number the AI writes." |
| **0:12–0:20** | Click **Ask** in the top bar. Click in **Your question**, paste the question (⌘V), and click **Build report**. | "Let's ask: compare inflation in New Zealand, Australia and the United States over the last 15 years." |
| **0:20–0:45** | Wait. The progress messages change: *Planning the query… → Fetching World Bank data… → Computing statistics… → Writing and verifying insights…* Keep talking while they show. | "First, Claude turns my question into a query plan: the countries, the right World Bank indicator, and the years. That plan is checked in code against a catalog of 32 real indicators. Then the app fetches the actual data from the World Bank, and tested code, not the AI, computes the growth rates and rankings." |
| **0:45–1:05** | The report appears. Point the mouse at the **headline**, then at the **✓ verified** badges next to the insights, then at the **"…% of numbers verified against the data"** label. | "Claude writes the insights only from those computed statistics. Then a verifier checks every single number in the text against the data. Each insight gets a verified badge, and the report shows the overall verification rate. If the AI ever writes a number that isn't in the data, it's flagged in amber." |
| **1:05–1:18** | Scroll down slowly. Hover over a line in the **chart** to show a tooltip. Pause on the **stats table**, then on the **Source: World Bank… Retrieved…** line under it. | "Below are the chart and the statistics table: first and latest values, change, and annual growth. Every chart cites its World Bank source and the date the data was retrieved, so it's ready for a paper." |
| **1:18–1:35** | Scroll back up and click **Copy share link** (it changes to *Link copied ✓*). Switch to the **private window**, paste the link into the address bar and press Enter. When the report loads, click **Download CSV**. | "I can share the report by link. Here it is in a private window, with no account. Anyone can view it, and download the data as a CSV." |
| **1:35–1:50** | Still in the private window, click **Explore** in the top bar. In **Add a country or region…**, type **Japan** and pick it. Open **Indicator** and choose **Population ages 65 and above (% of total)**. | "Explore lets anyone chart any of 32 indicators for more than 200 economies, instantly, with no AI cost. Here's Japan's ageing population next to New Zealand, the Philippines and the world." |
| **1:50–2:00** | Switch back to the main window and click **Tab 2** (GitHub Actions) to show the green ✓ runs. | "TrendLens is built with Next.js, Claude, Supabase and Clerk, deployed on Vercel, and every push runs lint, type checks, unit tests and a build in GitHub Actions. Thanks for watching." |

---

## If something goes wrong

| Problem | What to do |
|---|---|
| The report takes longer than 30 seconds | Keep going: repeat the last sentence slowly, or say *"It's fetching live data from the World Bank."* You can trim the wait when editing. |
| You see an amber **unverified** badge | That's fine, and it shows the feature working. Point at it and say: *"Here the verifier flagged a number it couldn't find in the data."* |
| An error message appears instead of a report | Stop recording and send Marc a screenshot of the message. Don't record a broken flow. |
| You stumble over a line | Pause for 2 seconds and say the sentence again. Cut the mistake when editing. |
| The video runs over 2:00 | Shorten the waiting time in step 0:20–0:45 first; the narration can continue over a jump cut. |

---

## After recording

1. Trim the start and end. Check the final video is **2:00 or less** and the sound is clear.
2. Upload it as one of:
   - **YouTube**, with visibility set to **Unlisted** (not Private)
   - **Loom**, with the share setting "Anyone with the link"
   - **Google Drive**, shared as "Anyone with the link can view"
3. Open the link in a private window to check it plays without signing in.
4. Send the link to Marc.

---

## Checklist: the video must show

- [ ] The live URL (trendlens-neon.vercel.app) visible in the address bar
- [ ] A real question being asked and the report generated by AI
- [ ] ✓ verified badges and the verification rate
- [ ] The chart, the stats table and the source line
- [ ] The share link opening in a private window (no sign-in)
- [ ] Explore working without an account
- [ ] Green GitHub Actions runs

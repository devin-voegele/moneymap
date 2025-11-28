# 🤖 n8n Marketing Automation Setup Guide

## 📋 Overview

This n8n workflow automates your entire marketing process:
- ✅ **Auto-generates** content with AI
- ✅ **Posts to 6 platforms** (Twitter, Instagram, LinkedIn, TikTok, Product Hunt, Reddit)
- ✅ **Tracks analytics** in Google Sheets
- ✅ **Sends reports** via email & Slack
- ✅ **A/B tests** content variations
- ✅ **Runs 3x daily** (9AM, 3PM, 9PM)

---

## 🚀 Quick Start

### 1. Install n8n

**Option A: Cloud (Easiest)**
```bash
# Sign up at n8n.io
# Import the workflow JSON
# Configure credentials
```

**Option B: Self-Hosted (Docker)**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Option C: npm**
```bash
npm install n8n -g
n8n start
```

Access at: `http://localhost:5678`

---

## 🔑 Required API Keys & Credentials

### 1. OpenAI (For AI Content Generation)
- Go to: https://platform.openai.com/api-keys
- Create new key
- Add to n8n: Credentials → OpenAI API
- Cost: ~$0.01 per post

### 2. Twitter/X API
- Go to: https://developer.twitter.com/
- Create app → Get API keys
- Add to n8n: Credentials → Twitter OAuth1
- Need: API Key, API Secret, Access Token, Access Secret

### 3. Instagram API
- Go to: https://developers.facebook.com/
- Create app → Instagram Basic Display
- Add to n8n: Credentials → Instagram API
- Need: Access Token

### 4. LinkedIn API
- Go to: https://www.linkedin.com/developers/
- Create app → Request access to Marketing API
- Add to n8n: Credentials → LinkedIn OAuth2
- Need: Client ID, Client Secret

### 5. TikTok API
- Go to: https://developers.tiktok.com/
- Apply for API access (takes 1-2 weeks)
- Add to n8n: Credentials → HTTP Header Auth
- Need: Access Token

### 6. Google Sheets API
- Go to: https://console.cloud.google.com/
- Enable Google Sheets API
- Create OAuth2 credentials
- Add to n8n: Credentials → Google Sheets OAuth2
- Need: Client ID, Client Secret

### 7. Slack API
- Go to: https://api.slack.com/apps
- Create app → Add Bot Token Scopes
- Add to n8n: Credentials → Slack API
- Need: Bot Token

### 8. Email (SMTP)
- Use your email provider's SMTP settings
- Gmail: smtp.gmail.com:587
- Add to n8n: Credentials → SMTP
- Need: Host, Port, Username, Password

### 9. Product Hunt API (Optional)
- Go to: https://api.producthunt.com/
- Create app → Get API key
- Add to n8n: Credentials → HTTP Header Auth
- Need: API Key

### 10. Reddit API (Optional)
- Go to: https://www.reddit.com/prefs/apps
- Create app → Get credentials
- Add to n8n: Credentials → HTTP Header Auth
- Need: Client ID, Client Secret

---

## 📥 Import Workflow

1. Open n8n dashboard
2. Click **"Import from File"**
3. Select `n8n-marketing-workflow.json`
4. Click **"Import"**

---

## ⚙️ Configuration

### Step 1: Update Schedule
```
Default: 9AM, 3PM, 9PM daily
Cron: 0 9,15,21 * * *

To change:
1. Click "Schedule Trigger" node
2. Edit "Cron Expression"
3. Save
```

### Step 2: Configure Google Sheets
```
1. Create new Google Sheet
2. Name it "Marketing Analytics"
3. Create sheet called "Analytics"
4. Add headers: Timestamp, Platform, Content, Type, Status
5. Copy Sheet ID from URL
6. Update "Log to Google Sheets" node
```

### Step 3: Update Slack Channel
```
1. Open "Notify Slack" node
2. Change channel: #marketing (or your channel)
3. Save
```

### Step 4: Update Email Recipients
```
1. Open "Send Daily Report" node
2. Change "to" field to your email
3. Save
```

### Step 5: Customize Content Templates
```
1. Open "Content Template Engine" node
2. Edit templates array
3. Add your own content ideas
4. Save
```

---

## 🎯 How It Works

### Flow Overview:
```
Schedule Trigger (3x daily)
    ↓
Platform Router (determines platforms)
    ↓
Content Template Engine (generates base content)
    ↓
AI Content Generator (enhances with GPT-4)
    ↓
Platform Filter (routes to correct platform)
    ↓
Post to Platform (Twitter, IG, LinkedIn, TikTok)
    ↓
Log to Google Sheets (analytics)
    ↓
Notify Slack (team notification)
    ↓
Analytics Aggregator (daily metrics)
    ↓
Send Daily Report (9PM email)
```

### Content Types by Time:
- **9AM**: Budgeting tips (morning motivation)
- **3PM**: App features (afternoon engagement)
- **9PM**: Testimonials (evening social proof)

### Platform-Specific Formatting:
- **Twitter**: 280 chars + link
- **Instagram**: Long form + hashtags
- **LinkedIn**: Professional tone + company info
- **TikTok**: Short caption + video

---

## 📊 Analytics & Reporting

### Google Sheets Tracking:
- Every post logged automatically
- Columns: Timestamp, Platform, Content, Type, Status
- Use for: Performance analysis, content audit

### Daily Email Report (9PM):
- Total reach across all platforms
- Total engagement (likes + comments + shares)
- Platform breakdown
- Engagement rates

### Slack Notifications:
- Real-time post confirmations
- Includes: Platform, content preview, timestamp
- Channel: #marketing (customizable)

---

## 🧪 A/B Testing

The workflow includes A/B testing:

**Variant A:**
- Emotional hooks
- Soft CTAs
- High emoji usage

**Variant B:**
- Data-driven hooks
- Direct CTAs
- Low emoji usage

**Tracking:**
- Each post gets unique test ID
- Logged in Google Sheets
- Compare performance after 1 week

---

## 🎨 Content Templates

### Built-in Templates:

1. **Budgeting Tips**
   - Quick money hacks
   - Student-focused advice
   - Actionable tips

2. **Subscription Hacks**
   - Cost awareness
   - Cancellation prompts
   - Yearly cost reveals

3. **Savings Goals**
   - Goal breakdowns
   - Success stories
   - Monthly plans

4. **Student Money**
   - Budget reality checks
   - Income/expense examples
   - Relatable scenarios

5. **App Features**
   - AI coach highlights
   - Chart visualizations
   - Goal tracking

6. **User Testimonials**
   - Real user quotes
   - Success metrics
   - Social proof

7. **Money Mistakes**
   - Common errors
   - Solutions
   - Before/after

8. **Financial Clarity**
   - Simple formulas
   - No-jargon explanations
   - Value propositions

---

## 🔧 Customization

### Add New Platform:

1. Add HTTP Request node
2. Configure API endpoint
3. Connect to Platform Filter
4. Add credentials
5. Test & activate

### Change Posting Frequency:

```javascript
// In Schedule Trigger node
// Current: 0 9,15,21 * * * (3x daily)

// 2x daily (9AM, 9PM):
0 9,21 * * *

// Hourly (9AM-9PM):
0 9-21 * * *

// Weekdays only:
0 9,15,21 * * 1-5
```

### Add Custom Content Type:

```javascript
// In Content Template Engine node
const templates = {
  your_new_type: [
    "Template 1: {variable}",
    "Template 2: {variable}",
    "Template 3: {variable}"
  ]
};
```

---

## 🚨 Troubleshooting

### Posts Not Publishing:
1. Check API credentials
2. Verify rate limits
3. Check error logs in n8n
4. Test individual nodes

### AI Content Not Generating:
1. Verify OpenAI API key
2. Check API quota
3. Reduce temperature if too random
4. Increase maxTokens if too short

### Google Sheets Not Logging:
1. Check Sheet ID
2. Verify OAuth2 credentials
3. Check sheet permissions
4. Ensure correct range

### Slack Not Notifying:
1. Verify Bot Token
2. Check channel name (include #)
3. Ensure bot is in channel
4. Check bot permissions

### Email Not Sending:
1. Verify SMTP credentials
2. Check spam folder
3. Enable "Less secure apps" (Gmail)
4. Use app-specific password

---

## 💰 Cost Estimate

**Monthly Costs:**

| Service | Cost | Notes |
|---------|------|-------|
| n8n Cloud | $20/mo | Or self-host for free |
| OpenAI API | $3-5/mo | ~300 posts/month |
| Twitter API | Free | Basic tier |
| Instagram API | Free | Basic Display |
| LinkedIn API | Free | Standard access |
| TikTok API | Free | Standard access |
| Google Sheets | Free | Within limits |
| Slack | Free | Standard plan |
| **Total** | **$23-25/mo** | Or $3-5 if self-hosted |

---

## 📈 Expected Results

**After 1 Month:**
- 270 posts (3x daily × 30 days × 3 platforms)
- 10K-50K total reach
- 500-2K engagements
- 50-200 website clicks
- 10-50 signups

**After 3 Months:**
- 810 posts
- 50K-200K total reach
- 2K-10K engagements
- 200-1K website clicks
- 50-200 signups

**After 6 Months:**
- 1,620 posts
- 200K-500K total reach
- 10K-50K engagements
- 1K-5K website clicks
- 200-1K signups

---

## 🎯 Best Practices

### Content:
- ✅ Be authentic and relatable
- ✅ Focus on value, not selling
- ✅ Use emojis strategically
- ✅ Keep it conversational
- ✅ Include clear CTAs

### Timing:
- ✅ Post during peak hours
- ✅ Test different times
- ✅ Adjust based on analytics
- ✅ Consider time zones

### Engagement:
- ✅ Respond to comments
- ✅ Like user mentions
- ✅ Repost user content
- ✅ Join conversations

### Analytics:
- ✅ Review weekly
- ✅ Track what works
- ✅ Double down on winners
- ✅ Cut what doesn't work

---

## 🔐 Security

### Protect Your Keys:
- ✅ Never commit credentials to Git
- ✅ Use environment variables
- ✅ Rotate keys quarterly
- ✅ Limit API permissions
- ✅ Enable 2FA everywhere

### n8n Security:
- ✅ Use strong password
- ✅ Enable HTTPS
- ✅ Restrict IP access
- ✅ Regular backups
- ✅ Update n8n regularly

---

## 📚 Resources

**n8n Documentation:**
- https://docs.n8n.io/

**API Documentation:**
- Twitter: https://developer.twitter.com/
- Instagram: https://developers.facebook.com/docs/instagram-api
- LinkedIn: https://docs.microsoft.com/en-us/linkedin/
- TikTok: https://developers.tiktok.com/
- OpenAI: https://platform.openai.com/docs

**Community:**
- n8n Forum: https://community.n8n.io/
- Discord: https://discord.gg/n8n

---

## 🎉 Next Steps

1. **Week 1**: Set up workflow, test on one platform
2. **Week 2**: Add all platforms, monitor results
3. **Week 3**: Optimize content based on analytics
4. **Week 4**: Scale up posting frequency

---

## 💡 Pro Tips

1. **Start Small**: Test with 1-2 platforms first
2. **Monitor Closely**: Check results daily for first week
3. **Iterate Fast**: Adjust content based on what works
4. **Engage Manually**: Automation posts, but engage personally
5. **Track Conversions**: Use UTM parameters in links
6. **Build Library**: Save high-performing content
7. **Stay Compliant**: Follow each platform's automation rules
8. **Be Human**: Don't sound like a bot
9. **Test Everything**: A/B test continuously
10. **Have Fun**: Experiment and be creative!

---

## 🚀 Ready to Launch?

1. Import workflow ✅
2. Add credentials ✅
3. Test each node ✅
4. Activate workflow ✅
5. Monitor results ✅

**Your marketing is now on autopilot!** 🎉

Questions? Check the n8n community or DM me!

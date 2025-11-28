# 🤖 n8n Marketing Automation Setup Guide

## 📋 Overview

This n8n workflow automates your social media posting:
- ✅ **Auto-generates** content from templates
- ✅ **Posts to 3 platforms** (Twitter, Instagram, TikTok)
- ✅ **Runs 3x daily** (9AM, 3PM, 9PM)
- ✅ **No reporting** - just posting
- ✅ **Simple & clean** - easy to manage

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

### 1. Twitter/X API
- Go to: https://developer.twitter.com/
- Create app → Get API keys
- Add to n8n: Credentials → Twitter OAuth1
- Need: API Key, API Secret, Access Token, Access Secret

### 2. Instagram API
- Go to: https://developers.facebook.com/
- Create app → Instagram Basic Display
- Add to n8n: Credentials → Instagram API
- Need: Access Token

### 3. TikTok API
- Go to: https://developers.tiktok.com/
- Apply for API access (takes 1-2 weeks)
- Add to n8n: Credentials → TikTok OAuth2
- Need: Client Key, Client Secret

**That's it!** Only 3 credentials needed.

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

### Step 2: Customize Content Templates (Optional)
```
1. Open "Content Generator" node
2. Edit templates object
3. Add your own content ideas
4. Save
```

**That's it!** You're ready to go.

---

## 🎯 How It Works

### Flow Overview:
```
Schedule Trigger (3x daily)
    ↓
Platform Router (creates 3 targets: Twitter, Instagram, TikTok)
    ↓
Content Generator (picks random template based on time)
    ↓
Platform Filters (routes to correct platform)
    ↓
Post to Platform (Twitter, Instagram, TikTok)
    ↓
Done! ✅
```

### Content Types by Time:
- **9AM**: Budgeting tips (morning motivation)
- **3PM**: App features (afternoon engagement)
- **9PM**: Testimonials (evening social proof)

### Platform-Specific Formatting:
- **Twitter**: 280 chars + link
- **Instagram**: Long form + 8 hashtags
- **TikTok**: Short caption + 5 hashtags (no link)

---

## 🎨 Content Templates

### Built-in Templates (5 per type):

1. **Budgeting Tips** - Quick money hacks for students
2. **Subscription Hacks** - Cost awareness & cancellation prompts
3. **Savings Goals** - Goal breakdowns & success stories
4. **Student Money** - Budget reality checks
5. **App Features** - AI coach & feature highlights
6. **User Testimonials** - Real user quotes & social proof

**Total: 30 unique posts** that rotate randomly!

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
| n8n Cloud | $20/mo | Or self-host for FREE |
| Twitter API | Free | Basic tier |
| Instagram API | Free | Basic Display |
| TikTok API | Free | Standard access |
| **Total** | **$20/mo** | Or **$0** if self-hosted! |

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

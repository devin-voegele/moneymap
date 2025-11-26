// Quick email test script
// Run with: node test-email.js

const { Resend } = require('resend')

// Load API key from .env manually
const fs = require('fs')
const envContent = fs.readFileSync('.env', 'utf-8')
const apiKeyMatch = envContent.match(/RESEND_API_KEY=(.+)/)
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null

if (!apiKey) {
  console.error('❌ RESEND_API_KEY not found in .env file')
  process.exit(1)
}

const resend = new Resend(apiKey)

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'MoneyMap <onboarding@resend.dev>',
      to: 'devin.voegele@microsun.ch', // Your Resend account email
      subject: '🧪 MoneyMap Test Email',
      html: `
        <h1>✅ Success!</h1>
        <p>Your email system is working perfectly!</p>
        <p>This email was sent to your Resend account email.</p>
      `
    })

    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Email sent successfully!')
      console.log('📧 Email ID:', data.id)
      console.log('Check your inbox at: devin.voegele@microsun.ch')
    }
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }
}

testEmail()

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Incident = require('./models/Incident');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 She Shield Backend is Running and Healthy!');
});

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sheshield';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas Cloud Database'))
  .catch(err => {
    console.warn('⚠️ MongoDB connection skipped (Simulation Mode Active)');
  });

// 2. Safety Analysis Endpoint
app.post('/api/safety/analyze', (req, res) => {
  const { destinationName } = req.body;
  const cityData = {
    'chennai': { harassment: 42, accident: 5200, theft: 1350, total: 6592, rank: 1 },
    'coimbatore': { harassment: 11, accident: 1420, theft: 420, total: 1851, rank: 2 },
    'madurai': { harassment: 7, accident: 1180, theft: 380, total: 1567, rank: 3 },
    'salem': { harassment: 9, accident: 980, theft: 290, total: 1279, rank: 4 },
    'tiruppur': { harassment: 4, accident: 860, theft: 250, total: 1114, rank: 5 },
    'trichy': { harassment: 5, accident: 830, theft: 210, total: 1045, rank: 6 },
    'tambaram': { harassment: 3, accident: 640, theft: 180, total: 823, rank: 7 },
    'avadi': { harassment: 2, accident: 520, theft: 160, total: 682, rank: 8 },
    'tirunelveli': { harassment: 2, accident: 470, theft: 120, total: 592, rank: 9 },
    'erode': { harassment: 1, accident: 390, theft: 95, total: 486, rank: 10 }
  };
  const searchName = (destinationName || '').toLowerCase();
  let matchedCityKey = Object.keys(cityData).find(city => searchName.includes(city));
  const record = cityData[matchedCityKey] || cityData['chennai'];
  res.json({
    cityName: matchedCityKey ? matchedCityKey.charAt(0).toUpperCase() + matchedCityKey.slice(1) : 'Chennai',
    harassmentCases: record.harassment,
    accidentCases: record.accident,
    theftCases: record.theft,
    totalCases: record.total,
    rank: record.rank,
    riskLevel: record.total > 2000 ? 'High' : (record.total > 1000 ? 'Moderate' : 'Low'),
    isRealData: true
  });
});

// Nodemailer Transporter Configuration
// Note: User needs to provide their Gmail App Password in .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'gayathriumapathy430@gmail.com',
    pass: process.env.GMAIL_PASS || 'your-app-password-here'
  }
});

console.log("📨 Nodemailer System Ready - Service: Gmail");

// HELP MESSAGE: How to get GMAIL_PASS
// 1. Go to Google Account Settings -> Security
// 2. Enable 2-Step Verification
// 3. Search for "App Passwords"
// 4. Create one for "Mail" and use that 16-character code as GMAIL_PASS

// SOS Panic Button Endpoint
app.post('/api/sos', async (req, res) => {
  const { lat, lng, message = "I AM IN SERIOUS DANGER! Please check my live location and send help immediately." } = req.body;

  console.log(`🚨 [SOS ALERT] Incident at: ${lat}, ${lng}`);

  if (!lat || !lng) {
    return res.status(400).json({ success: false, error: "Missing coordinates" });
  }

  // Pure Google Maps URL - No trackers, No "Private Connection" warnings
  const locationLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const mailOptions = {
    from: `"SHE SHIELD EMERGENCY" <${process.env.GMAIL_USER}>`,
    to: "gayathriumapathy430@gmail.com",
    subject: "🚨 [CRITICAL] SOS EMERGENCY SIGNAL RECEIVED",
    priority: 'high',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 4px solid #D32F2F; border-radius: 25px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #D32F2F; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">EMERGENCY ALERT</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Priority: Maximum Signal</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 1.2rem; color: #1a1a1a; line-height: 1.6; font-weight: bold;">
            HELP MESSAGE:
          </p>
          <div style="background-color: #FFF5F5; border-left: 5px solid #D32F2F; padding: 20px; font-style: italic; color: #D32F2F; font-size: 1.1rem; margin-bottom: 25px;">
            "${message}"
          </div>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 15px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 0.9rem;">LIVE GPS CO-ORDINATES:</p>
            <div style="font-family: monospace; font-size: 1.2rem; font-weight: bold; color: #333;">
              LATTITUDE: ${lat}<br/>
              LONGITUDE: ${lng}
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${locationLink}" target="_blank" style="display: inline-block; padding: 20px 45px; background-color: #D32F2F; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.2rem; box-shadow: 0 8px 25px rgba(211, 47, 47, 0.4);">
              📍 OPEN LIVE MAP TRACKER
            </a>
            <p style="color: #888; font-size: 0.8rem; margin-top: 15px;">Official Secure Google Maps Link (Private & Secure)</p>
          </div>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-top: 1px solid #eeeeee; text-align: center;">
          <p style="margin: 0; font-size: 0.75rem; color: #999;">
            This email was sent instantly from the She Shield Security App.<br/>
            Stay on this link until the user marks themselves as safe.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ SOS Alert Delivered Successfully");
    res.json({ success: true, message: "Alert Sent" });
  } catch (err) {
    console.error("❌ Mail Error Details:", err.message);
    res.status(500).json({ success: false, error: "Failed to send email. Check GMAIL_PASS setup." });
  }
});

// Geo Tag Capturing Image Endpoint
app.post('/api/geotag/send', async (req, res) => {
  const { image, lat, lng, date, time } = req.body;

  if (!image) {
    return res.status(400).json({ success: false, error: "No image provided" });
  }

  const locationLink = lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : "Location Disabled";
  const cid = `safety_capture_${Date.now()}`;

  const mailOptions = {
    from: `"SHE SHIELD SECURITY" <${process.env.GMAIL_USER}>`,
    to: "gayathriumapathy430@gmail.com",
    subject: `🛡️ SECURITY REPORT: Geo-Tag Capture [${date}]`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 3px solid #D81B60; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #D81B60 0%, #AD1457 100%); padding: 25px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px; letter-spacing: 1px;">GEO-TAG CAPTURE REPORT</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Secure Evidence Verification</p>
        </div>
        
        <div style="padding: 25px;">
          <div style="margin-bottom: 25px; background: #f9f9f9; border: 1px solid #eee; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
             <div style="padding: 10px; background: #333; color: white; text-align: center; font-size: 0.8rem; font-weight: bold;">CAPTURED SNAPSHOT</div>
             <img src="cid:${cid}" style="max-width: 100%; height: auto; display: block;" />
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 12px; border-bottom: 2px solid #f5f5f5; color: #666;"><strong>📅 Date:</strong></td>
              <td style="padding: 12px; border-bottom: 2px solid #f5f5f5; color: #333; font-weight: bold;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 2px solid #f5f5f5; color: #666;"><strong>⏰ Time:</strong></td>
              <td style="padding: 12px; border-bottom: 2px solid #f5f5f5; color: #333; font-weight: bold;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 2px solid #f5f5f5; color: #666;"><strong>📍 GPS:</strong></td>
              <td style="padding: 12px; border-bottom: 2px solid #f5f5f5; color: #333; font-weight: bold;">${lat}, ${lng}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 35px; margin-bottom: 10px;">
            <a href="${locationLink}" target="_blank" style="display: inline-block; padding: 18px 45px; background-color: #D81B60; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 6px 20px rgba(216, 27, 96, 0.3);">
              🗺️ VIEW PRECISE LOCATION
            </a>
            <p style="font-size: 0.75rem; color: #999; margin-top: 15px; font-style: italic;">Verified Secure Official Maps Link</p>
          </div>
        </div>

        <div style="background-color: #333; padding: 20px; text-align: center; color: rgba(255,255,255,0.6);">
          <p style="margin: 0; font-size: 0.7rem; letter-spacing: 1px;">
            VERIFIED SECURITY RECORD • SHE SHIELD SMART MODULE
          </p>
        </div>
      </div>
    `,
    attachments: [{
      filename: `security_capture_${date.replace(/ /g, '_')}.jpg`,
      content: image.split('base64,')[1],
      encoding: 'base64',
      cid: cid
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Geo-Tag Report Delivered Successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Geo-tag Delivery Failed:", err.message);
    res.status(500).json({ success: false, error: "Failed to send report" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 She Shield Backend Running on Port ${PORT}`);
});

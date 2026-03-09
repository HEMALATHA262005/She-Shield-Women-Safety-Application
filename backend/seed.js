const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Incident = require('./models/Incident');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sheshield';

const sampleIncidents = [
    // User Provided Data - Theft/Robbery
    { type: 'Theft', location: { type: 'Point', coordinates: [80.2707, 13.0827] }, reportedBy: 'TN Govt Portal (5200+ Cases)' }, // Chennai
    { type: 'Theft', location: { type: 'Point', coordinates: [76.9616, 11.0168] }, reportedBy: 'TN Govt Portal (1100+ Cases)' }, // Coimbatore
    { type: 'Theft', location: { type: 'Point', coordinates: [78.1198, 9.9252] }, reportedBy: 'TN Govt Portal (950+ Cases)' }, // Madurai
    { type: 'Theft', location: { type: 'Point', coordinates: [78.1460, 11.6643] }, reportedBy: 'TN Govt Portal (780+ Cases)' }, // Salem
    { type: 'Theft', location: { type: 'Point', coordinates: [77.3411, 11.1085] }, reportedBy: 'TN Govt Portal (620+ Cases)' }, // Tiruppur
    { type: 'Theft', location: { type: 'Point', coordinates: [78.7047, 10.7905] }, reportedBy: 'TN Govt Portal (600+ Cases)' }, // Trichy

    // User Provided Data - Sexual Harassment
    { type: 'Harassment', location: { type: 'Point', coordinates: [80.2337, 13.0406] }, reportedBy: '42 Cases Reported' }, // Chennai Central
    { type: 'Harassment', location: { type: 'Point', coordinates: [80.1917, 12.9249] }, reportedBy: '3 Cases Reported' }, // Tambaram

    // Mixed data for better route analysis
    { type: 'Accidents', location: { type: 'Point', coordinates: [80.2450, 13.0650] }, reportedBy: 'Part of 67,213 TN Total' },
    { type: 'Accidents', location: { type: 'Point', coordinates: [78.1200, 9.9300] }, reportedBy: 'Madurai Road Hazard' },
    { type: 'Chain Snatching', location: { type: 'Point', coordinates: [78.1150, 9.9200] }, reportedBy: 'Madurai Snatching Zone' }
];

async function seedData() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        await Incident.deleteMany({});
        console.log('Cleared existing incidents.');

        await Incident.insertMany(sampleIncidents);
        console.log('Successfully seeded safety data!');

        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
}

seedData();

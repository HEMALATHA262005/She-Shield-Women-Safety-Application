const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Chain Snatching', 'Harassment', 'Missing Persons', 'Accidents', 'Theft']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    reportedBy: {
        type: String,
        default: 'TN Govt Portal'
    }
});

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);

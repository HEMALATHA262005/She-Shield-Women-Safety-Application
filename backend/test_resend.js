const { Resend } = require('resend');
require('dotenv').config();

const YOUR_KEY = "re_Bz4ycurx_Hz5c13Q52mAVT9cC3t753Sob";
const resend = new Resend(YOUR_KEY);

async function test() {
    console.log("Using API Key:", YOUR_KEY);
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "gayathriumapathy430@gmail.com",
            subject: "Test SOS",
            html: "<h1>Test SOS</h1>"
        });

        if (error) {
            console.error("Resend Error:", error);
        } else {
            console.log("Success! Email sent. ID:", data.id);
        }
    } catch (e) {
        console.error("Crash:", e.message);
    }
}

test();

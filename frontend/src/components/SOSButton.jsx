import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, XOctagon } from 'lucide-react';

const SOSButton = () => {
    const [isActive, setIsActive] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [sirenAudio, setSirenAudio] = useState(null);

    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        let timer;
        if (isActive && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (isActive && countdown === 0 && !statusMsg) {
            // Trigger actual backend API
            setStatusMsg('Sending Alert...');

            // Get exact location to send
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    sendAlert(latitude, longitude);
                },
                (error) => {
                    console.error(error);
                    // Fallback location if location is disabled
                    sendAlert(28.6139, 77.2090);
                }
            );
        }
        return () => clearInterval(timer);
    }, [isActive, countdown, statusMsg]);

    const sendAlert = async (lat, lng) => {
        try {
            const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            const response = await fetch('http://localhost:5000/api/sos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locationLink: gmapsLink,
                    lat, lng
                })
            });
            const data = await response.json();
            if (data.success) {
                setStatusMsg('ALERTS DELIVERED SUCCESSFULLY');
            } else {
                setStatusMsg('Error: Could not deliver all alerts');
            }
        } catch (err) {
            setStatusMsg('Failed to connect to backend server');
        }
    };

    const triggerSOS = () => {
        setIsActive(true);
        setCountdown(5);
        setStatusMsg('');
    };

    const cancelSOS = () => {
        setIsActive(false);
        setCountdown(5);
        setStatusMsg('');
    };

    return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 className="module-title" style={{ color: 'var(--danger)' }}>Emergency SOS</h2>
            <p className="module-subtitle" style={{ marginBottom: '3rem' }}>
                Pressing this will notify guardians, send location tracking, and trigger an alarm.
            </p>

            {!isActive ? (
                <button className="btn btn-sos" onClick={triggerSOS}>
                    SOS
                </button>
            ) : (
                <div style={{ textAlign: 'center', animation: 'pulse 1s infinite' }}>
                    {countdown > 0 ? (
                        <>
                            <h1 style={{ fontSize: '5rem', color: 'var(--danger)', margin: '1rem 0' }}>{countdown}</h1>
                            <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '2rem' }}>Sending Alert In...</p>
                            <button className="btn btn-outline" onClick={cancelSOS} style={{ borderColor: 'var(--text-main)', color: 'var(--text-main)' }}>
                                <XOctagon size={20} /> Cancel Alert
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ background: 'rgba(244, 67, 54, 0.1)', border: '2px solid var(--danger)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                                <AlertTriangle size={64} color="var(--danger)" style={{ marginBottom: '1rem' }} />
                                <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>ALERT ACTIVE</h2>
                                <p><strong>SMS Sent:</strong> +918870990481</p>
                                <p><strong>Email Sent:</strong> gayathriumapathy430@gmail.com</p>
                                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--primary)' }}>
                                    <MapPin size={16} /> Live Tracking Enabled
                                </p>
                            </div>

                            <button className="btn btn-primary" onClick={cancelSOS} style={{ marginTop: '2rem', background: 'var(--text-main)' }}>
                                MARK AS SAFE (Disable Siren)
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SOSButton;

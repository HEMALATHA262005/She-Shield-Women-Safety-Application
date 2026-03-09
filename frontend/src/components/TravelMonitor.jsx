import React, { useState, useRef } from 'react';
import { Camera, Send, RefreshCw, CheckCircle2, AlertCircle, Clock, Calendar, MapPin } from 'lucide-react';

const TravelMonitor = () => {
    const [capturedData, setCapturedData] = useState({
        image: null,
        lat: null,
        lng: null,
        date: '',
        time: ''
    });
    const [isCamOpen, setIsCamOpen] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = async () => {
        setIsCamOpen(true);
        setCapturedData({ image: null, lat: null, lng: null, date: '', time: '' });
        setIsSuccess(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setIsCamOpen(false);
        }
    };

    const captureImageWithMeta = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            setIsCapturing(true);
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Stop camera
            const stream = video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            setIsCamOpen(false);

            // Get Location
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCapturedData({
                        image: dataUrl,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        date: dateStr,
                        time: timeStr
                    });
                    setIsCapturing(false);
                },
                (err) => {
                    console.warn("Location capture failed:", err);
                    setCapturedData({
                        image: dataUrl,
                        lat: 0,
                        lng: 0,
                        date: dateStr,
                        time: timeStr
                    });
                    setIsCapturing(false);
                },
                { enableHighAccuracy: true }
            );
        }
    };

    const handleSendToGuardian = async () => {
        if (!capturedData.image) return;
        setIsSending(true);
        try {
            const response = await fetch('http://localhost:5000/api/geotag/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(capturedData)
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setIsSuccess(true);
            } else {
                const errMsg = result.error || response.statusText;
                console.error("Server Side Error:", errMsg);
                alert(`Server Error (${response.status}): ${errMsg}`);
            }
        } catch (err) {
            console.error("Network Error:", err);
            alert("Network Connection Error: Please make sure the backend is running on port 5000 and has CORS enabled.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div className="module-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="module-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <Camera size={36} color="var(--primary)" /> Geo Tag Capturing Image
                </h2>
                <p className="module-subtitle">Snap Protection: Location & Time-Stamped Security Evidence</p>
            </div>

            {!isSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', border: '1px dashed var(--primary-light)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📸 Capture Surroundings & Personal Snapshot
                        </h4>

                        {!isCamOpen && !capturedData.image && !isCapturing && (
                            <button onClick={startCamera} className="btn btn-primary" style={{ width: '100%', padding: '1.8rem', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(216, 27, 96, 0.3)' }}>
                                <Camera size={24} /> Open Secure Safety Camera
                            </button>
                        )}

                        {isCapturing && (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <RefreshCw className="spin" size={48} color="var(--primary)" />
                                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Securing Geo-Tag Metadata...</p>
                            </div>
                        )}

                        {isCamOpen && !isCapturing && (
                            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', boxShadow: 'var(--shadow-lg)' }}>
                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block' }} />
                                <div style={{ position: 'absolute', bottom: '30px', left: '0', right: '0', textAlign: 'center' }}>
                                    <button onClick={captureImageWithMeta} className="btn-sos" style={{ width: '90px', height: '90px', fontSize: '1.1rem', background: '#fff', color: 'var(--primary)', border: '5px solid var(--primary)' }}>
                                        CAPTURE
                                    </button>
                                </div>
                            </div>
                        )}

                        {capturedData.image && !isCapturing && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    <img src={capturedData.image} alt="Captured Safety Evidence" style={{ width: '100%', display: 'block' }} />
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <CheckCircle2 size={14} color="#4CAF50" /> Image Secured
                                    </div>
                                </div>

                                <div className="glass-panel" style={{ background: '#fdfdfd', padding: '1.5rem', border: '1px solid #eee' }}>
                                    <h5 style={{ color: 'var(--primary)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                        <MapPin size={18} /> Safety Metadata (Geo-Tag)
                                    </h5>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Calendar size={20} color="#888" />
                                            <div>
                                                <small style={{ color: '#888', display: 'block' }}>Date</small>
                                                <strong>{capturedData.date}</strong>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Clock size={20} color="#888" />
                                            <div>
                                                <small style={{ color: '#888', display: 'block' }}>Time</small>
                                                <strong>{capturedData.time}</strong>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MapPin size={20} color="#888" />
                                            <div>
                                                <small style={{ color: '#888', display: 'block' }}>Latitude</small>
                                                <strong>{capturedData.lat?.toFixed(6) || 'Pending...'}</strong>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MapPin size={20} color="#888" />
                                            <div>
                                                <small style={{ color: '#888', display: 'block' }}>Longitude</small>
                                                <strong>{capturedData.lng?.toFixed(6) || 'Pending...'}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1.5rem', background: 'rgba(216, 27, 96, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(216, 27, 96, 0.1)' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <AlertCircle size={16} /> Everything above will be sent to your guardian for live tracking.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={startCamera} className="btn btn-outline" style={{ flex: 1, padding: '1rem' }}>
                                        <RefreshCw size={18} /> Retake Snapshot
                                    </button>
                                    <button
                                        onClick={handleSendToGuardian}
                                        className="btn btn-primary"
                                        style={{ flex: 2, padding: '1rem', background: '#2E7D32', borderColor: '#2E7D32', fontSize: '1.1rem' }}
                                        disabled={isSending}
                                    >
                                        <Send size={18} /> {isSending ? 'Transmitting Data...' : 'Send Snapshot to Guardian'}
                                    </button>
                                </div>
                            </div>
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div className="pulse-success" style={{
                        width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(76, 175, 80, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', border: '4px solid var(--success)'
                    }}>
                        <CheckCircle2 size={72} color="var(--success)" />
                    </div>
                    <h2 style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '2.2rem' }}>SENT SUCCESSFULLY</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
                        Your safety snapshot, live GPS location, and exact time-stamps have been securely delivered to <b>gayathriumapathy430@gmail.com</b>.
                    </p>
                    <button className="btn btn-primary" onClick={() => setIsSuccess(false)} style={{ width: '100%', padding: '1.2rem' }}>
                        Perform Another Geo-Tag Capture
                    </button>
                </div>
            )}
        </div>
    );
};

export default TravelMonitor;

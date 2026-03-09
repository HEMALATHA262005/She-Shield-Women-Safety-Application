import React, { useState, useEffect, useRef } from 'react';
import { Bluetooth, Radio, MapPin, Battery, Navigation, Trash2, History, Play, Square, Heart, Car, ArrowRight } from 'lucide-react';

const BearFace = ({ size = 48, color = "var(--primary)", rotate = 0 }) => (
    <div style={{
        position: 'relative',
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        transition: 'all 0.5s linear'
    }}>
        <div style={{ position: 'absolute', top: '-5%', left: '0', width: '35%', height: '35%', background: color, borderRadius: '50%', border: '2px solid white' }}>
            <div style={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }}></div>
        </div>
        <div style={{ position: 'absolute', top: '-5%', right: '0', width: '35%', height: '35%', background: color, borderRadius: '50%', border: '2px solid white' }}>
            <div style={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }}></div>
        </div>
        <div style={{
            position: 'absolute', top: '15%', left: '5%', width: '90%', height: '85%',
            background: color, borderRadius: '45% 45% 50% 50%',
            border: '2px solid white',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ display: 'flex', gap: '25%', width: '60%', marginBottom: '5%', marginTop: '-10%' }}>
                <div style={{ width: '8px', height: '8px', background: '#333', borderRadius: '50%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15%', left: '15%', width: '3px', height: '3px', background: 'white', borderRadius: '50%' }}></div>
                </div>
                <div style={{ width: '8px', height: '8px', background: '#333', borderRadius: '50%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15%', left: '15%', width: '3px', height: '3px', background: 'white', borderRadius: '50%' }}></div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '85%', position: 'absolute', top: '45%' }}>
                <div style={{ width: '12px', height: '8px', background: 'rgba(255,182,193,0.8)', borderRadius: '50%', filter: 'blur(1px)' }}></div>
                <div style={{ width: '12px', height: '8px', background: 'rgba(255,182,193,0.8)', borderRadius: '50%', filter: 'blur(1px)' }}></div>
            </div>
            <div style={{ width: '35%', height: '25%', background: 'white', borderRadius: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '6px', height: '4px', background: '#333', borderRadius: '3px', marginBottom: '2px' }}></div>
                <div style={{ width: '8px', height: '4px', borderBottom: '1.5px solid #333', borderRadius: '50%' }}></div>
            </div>
            <div style={{ position: 'absolute', top: '5%', right: '15%' }}>
                <Heart size={10} fill="white" color="white" />
            </div>
        </div>
    </div>
);

// STRICT LINEAR PATH ALONG MUMBAI HIGHWAY (NH48) NEAR SVCE
const LINEAR_WAYPOINTS = [
    { lat: 12.9885, lng: 79.9600, label: "Highway Mile 0 (West)" },
    { lat: 12.9885, lng: 79.9700, label: "SVCE Junction Entry" },
    { lat: 12.9885, lng: 79.9800, label: "SVCE Main Gateway" },
    { lat: 12.9885, lng: 79.9900, label: "Industrial Link Road" },
    { lat: 12.9885, lng: 80.0000, label: "Toll Approach" },
    { lat: 12.9885, lng: 80.0100, label: "Highway Milestone (East)" }
];

const KeychainTracker = () => {
    const [deviceConnected, setDeviceConnected] = useState(false);
    const [currentPos, setCurrentPos] = useState(LINEAR_WAYPOINTS[0]);
    const [mapCenter, setMapCenter] = useState(LINEAR_WAYPOINTS[0]);
    const [path, setPath] = useState([]);
    const [speed, setSpeed] = useState(0);
    const [isReturning, setIsReturning] = useState(false);

    const waypointIndex = useRef(0);
    const autoMoveTimer = useRef(null);

    const toggleConnection = () => {
        if (!deviceConnected) {
            setDeviceConnected(true);
            setPath([{ ...LINEAR_WAYPOINTS[0], time: new Date().toLocaleTimeString(), mode: "LINEAR" }]);
            waypointIndex.current = 0;
            setIsReturning(false);
        } else {
            setDeviceConnected(false);
            setSpeed(0);
            if (autoMoveTimer.current) clearInterval(autoMoveTimer.current);
        }
    };

    useEffect(() => {
        if (deviceConnected) {
            autoMoveTimer.current = setInterval(() => {
                let nextIdx;

                // Linear back-and-forth logic
                if (!isReturning) {
                    nextIdx = waypointIndex.current + 1;
                    if (nextIdx >= LINEAR_WAYPOINTS.length) {
                        nextIdx = LINEAR_WAYPOINTS.length - 2;
                        setIsReturning(true);
                    }
                } else {
                    nextIdx = waypointIndex.current - 1;
                    if (nextIdx < 0) {
                        nextIdx = 1;
                        setIsReturning(false);
                    }
                }

                waypointIndex.current = nextIdx;
                const nextPoint = LINEAR_WAYPOINTS[waypointIndex.current];

                setCurrentPos(nextPoint);
                setMapCenter(nextPoint);
                setSpeed(80 + Math.floor(Math.random() * 20));

                const newEntry = {
                    ...nextPoint,
                    time: new Date().toLocaleTimeString(),
                    mode: isReturning ? "WESTBOUND" : "EASTBOUND"
                };
                setPath(currentPath => [newEntry, ...currentPath].slice(0, 30));

            }, 2000); // Fast 2s updates
        } else {
            clearInterval(autoMoveTimer.current);
        }
        return () => clearInterval(autoMoveTimer.current);
    }, [deviceConnected, isReturning]);

    const getMapUrl = () => {
        return `https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=17&output=embed`;
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', width: '100%' }}>
            <div className="module-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                    <BearFace size={60} color="var(--primary)" rotate={isReturning ? 270 : 90} />
                    <div style={{ textAlign: 'left', borderLeft: '4px solid var(--primary)', paddingLeft: '20px' }}>
                        <h2 className="module-title" style={{ margin: 0 }}>Tracker</h2>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                {/* STABLE LINEAR MAP */}
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '5px solid white', position: 'relative' }}>
                    <div style={{ height: '550px', background: '#ece9e4', position: 'relative' }}>
                        {deviceConnected ? (
                            <>
                                <iframe
                                    title="Linear Map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    src={getMapUrl()}
                                ></iframe>

                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 100,
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{
                                        animation: 'linear-run 0.5s infinite alternate',
                                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
                                    }}>
                                        <BearFace size={70} color="var(--primary)" rotate={isReturning ? 270 : 90} />
                                    </div>
                                    <div style={{ borderBottom: '3px dashed rgba(255,255,255,0.8)', width: '100px', position: 'absolute', top: '50%', left: isReturning ? '100%' : '-100%', zIndex: -1 }}></div>
                                </div>

                                <div style={{ position: 'absolute', top: '25px', left: '25px', padding: '12px 20px', background: 'var(--primary)', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                                    <ArrowRight size={20} style={{ transform: isReturning ? 'rotate(180deg)' : 'none', transition: '0.5s' }} />
                                    LINEAR PATROL ACTIVE
                                </div>
                            </>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Car size={80} color="#ddd" strokeWidth={1.5} />
                                <p style={{ marginTop: '1rem', color: '#999', letterSpacing: '2px' }}>AWAITING DEPLOYMENT</p>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'white', padding: '20px', borderTop: '1px solid #eee' }}>
                        <div style={{ textAlign: 'center' }}><small style={{ color: '#888' }}>POINT</small><div style={{ fontWeight: '800' }}>{currentPos.label}</div></div>
                        <div style={{ textAlign: 'center' }}><small style={{ color: '#888' }}>COORD</small><div style={{ fontWeight: '800' }}>{currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}</div></div>
                        <div style={{ textAlign: 'center' }}><small style={{ color: '#888' }}>SPEED</small><div style={{ fontWeight: '800', color: 'var(--primary)' }}>{speed} km/h</div></div>
                    </div>
                </div>

                {/* LINEAR LOGS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <button
                            className={`btn ${deviceConnected ? 'btn-sos' : 'btn-primary'}`}
                            style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem', fontWeight: '900', borderRadius: '20px' }}
                            onClick={toggleConnection}
                        >
                            {deviceConnected ? 'HALT LINEAR TRACKING' : 'START LINEAR PATROL'}
                        </button>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--primary)' }}>
                            <History size={20} /> Linear Step Log
                        </h4>
                        <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '400px' }}>
                            {path.map((step, idx) => (
                                <div key={idx} style={{
                                    padding: '12px', marginBottom: '8px',
                                    background: idx === 0 ? 'rgba(216, 27, 96, 0.05)' : '#fff',
                                    borderRadius: '12px', border: '1px solid #f0f0f0',
                                    display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>{step.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{step.lng.toFixed(4)} LONG</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)' }}>{step.mode}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#bbb' }}>{step.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes linear-run {
                    from { transform: translate(-50%, -50%) skewX(-5deg); }
                    to { transform: translate(-50%, -50%) skewX(5deg); }
                }
            `}</style>
        </div>
    );
};

export default KeychainTracker;

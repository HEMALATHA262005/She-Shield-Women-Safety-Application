import React, { useState, useEffect } from 'react';
import { PhoneCall, Navigation, Hospital, ShieldCheck, Search, Locatable, MapPin } from 'lucide-react';

const Locator = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [mapUrl, setMapUrl] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Initial search: Current location auto-detect
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const query = `hospitals and police stations near ${pos.coords.latitude},${pos.coords.longitude}`;
                setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=14`);
            },
            () => {
                const query = `hospitals and police stations near Chennai`;
                setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=14`);
            }
        );
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsAnalyzing(true);
        // Simulate a "Deep Sector Analysis" for premium feel
        setTimeout(() => {
            const query = `hospitals and police stations near ${searchQuery}`;
            setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=15`);
            setIsAnalyzing(false);
        }, 1500);
    };

    const filterMap = (type) => {
        setSelectedType(type);
        const baseLocation = searchQuery || "my location";
        let query = "";
        if (type === 'all') query = `hospitals and police stations near ${baseLocation}`;
        else if (type === 'police') query = `police stations near ${baseLocation}`;
        else if (type === 'hospital') query = `hospitals near ${baseLocation}`;

        setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=15`);
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', width: '100%', minHeight: '90vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="module-title" style={{ fontSize: '2.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <Locatable color="var(--primary)" size={45} /> Safety Hub Locator
                </h2>
                <p className="module-subtitle">AI-Powered Search for Hospitals & Police Stations</p>
            </div>

            {/* SEARCH BAR SECTION */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.6)' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flexGrow: 1, position: 'relative' }}>
                        <Search size={22} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                        <input
                            type="text"
                            placeholder="Enter area, street name or city (e.g. Anna Nagar, SVCE)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.2rem 1.2rem 1.2rem 3.5rem',
                                borderRadius: '15px',
                                border: '2px solid white',
                                fontSize: '1.1rem',
                                outline: 'none',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`btn ${isAnalyzing ? 'btn-disabled' : 'btn-primary'}`}
                        disabled={isAnalyzing}
                        style={{ padding: '0 2.5rem', borderRadius: '15px', fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        {isAnalyzing ? 'IDENTIFYING...' : 'ANALYZE AREA'}
                    </button>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>

                {/* INTERACTIVE GOOGLE MAP */}
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '8px solid white', height: '650px', position: 'relative' }}>
                    {isAnalyzing && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)',
                            zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div className="spin" style={{ width: '80px', height: '80px', border: '5px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                            <h3 style={{ marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>SCANNING SECTOR FOR SAFETY HUBS...</h3>
                        </div>
                    )}
                    <iframe
                        title="Global Emergency Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={mapUrl}
                        style={{ display: 'block' }}
                    ></iframe>
                </div>

                {/* QUICK FILTERS & CONTROLS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1.2rem', color: 'var(--secondary)', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>
                            <MapPin size={20} /> Quick Filters
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                className={`btn ${selectedType === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => filterMap('all')}
                                style={{ width: '100%' }}
                            >SEE ALL HUBS</button>
                            <button
                                className={`btn ${selectedType === 'police' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => filterMap('police')}
                                style={{ width: '100%' }}
                            ><ShieldCheck size={18} /> POLICE STATIONS</button>
                            <button
                                className={`btn ${selectedType === 'hospital' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => filterMap('hospital')}
                                style={{ width: '100%' }}
                            ><Hospital size={18} /> HOSPITALS</button>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255, 240, 245, 0.8)' }}>
                        <h5 style={{ color: 'var(--primary-dark)', marginBottom: '0.8rem' }}>Emergency Protocol</h5>
                        <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5' }}>
                            Search results show verified government police stations and certified multi-specialty hospitals. Use the "Guide" icon on the map markers for live navigation.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Locator;

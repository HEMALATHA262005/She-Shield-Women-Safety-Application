import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: 'var(--radius-lg)'
};

const center = {
    lat: 13.0827,
    lng: 80.2707 // Chennai, Tamil Nadu
};

const RouteMap = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        // Needs to be empty string or a specifically formatted fake string to trigger Dev Mode instead of failing silently on new versions
        googleMapsApiKey: ''
    });

    const [directions, setDirections] = useState(null);
    const [startPoint, setStartPoint] = useState('');
    const [destination, setDestination] = useState('');
    const [routeStats, setRouteStats] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [safetyMarkers, setSafetyMarkers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState(center);

    // Fetch All Incidents for markers on load
    React.useEffect(() => {
        fetch('http://localhost:5000/api/safety/incidents')
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(inc => ({
                    id: inc._id,
                    lat: inc.location.coordinates[1],
                    lng: inc.location.coordinates[0],
                    type: inc.type,
                    risk: inc.type === 'Accidents' ? 'moderate' : 'high'
                }));
                setSafetyMarkers(formatted);
            })
            .catch(err => console.error('Error fetching incidents:', err));
    }, []);

    const calculateRoute = async () => {
        if (startPoint === '' || destination === '') return;
        setIsLoading(true);
        setErrorMsg('');

        const google = window.google;
        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: startPoint,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            async (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                    const leg = result.routes[0].legs[0];
                    setMapCenter({ lat: leg.end_location.lat(), lng: leg.end_location.lng() });

                    try {
                        const response = await fetch('http://localhost:5000/api/safety/analyze', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ destinationName: destination })
                        });
                        const data = await response.json();
                        setRouteStats(data);
                    } catch (err) {
                        console.error('Safety analysis failed');
                        setErrorMsg('Safety records currently unavailable.');
                    }
                } else {
                    // Fallback simulation for demonstration
                    const simulatedPath = [
                        { lat: 13.0827, lng: 80.2707 },
                        { lat: 12.9229, lng: 80.1271 }
                    ];
                    setDirections({ simulated: true, path: simulatedPath });
                    setMapCenter(simulatedPath[1]);

                    try {
                        const response = await fetch('http://localhost:5000/api/safety/analyze', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ destinationName: destination })
                        });
                        const data = await response.json();
                        setRouteStats(data);
                    } catch (err) {
                        setErrorMsg('System offline.');
                    }
                }
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="module-title">Smart Safety Route Intelligence</h2>
            <p className="module-subtitle">Analyzed against live Cloud Database records.</p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Starting Point (e.g. Marina Beach, Chennai)"
                    className="input-field"
                    style={{ flex: 1, minWidth: '200px' }}
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Destination (e.g. Adyar, Chennai)"
                    className="input-field"
                    style={{ flex: 1, minWidth: '200px' }}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <button
                    onClick={calculateRoute}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Route'}
                </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                💡 Tip: If route is not found, try adding <b>", Chennai, TN"</b> to your locations.
            </p>

            {errorMsg && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{errorMsg}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: '2', minWidth: '300px' }}>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={mapCenter}
                            zoom={12}
                            options={{ disableDefaultUI: true, zoomControl: true }}
                        />
                    ) : (
                        <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-lg)' }}>
                            <p>Loading Map...</p>
                        </div>
                    )}
                </div>

                {/* Destination Statistics Panel */}
                <div style={{ flex: '1', minWidth: '250px' }}>
                    {routeStats ? (
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.95)' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem', color: 'var(--primary-dark)' }}>
                                📍 {routeStats.cityName} Safety Profile
                            </h3>

                            <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: routeStats.riskLevel === 'High' ? 'rgba(244, 67, 54, 0.1)' : (routeStats.riskLevel === 'Moderate' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)'), border: `1px solid ${routeStats.riskLevel === 'High' ? 'var(--danger)' : (routeStats.riskLevel === 'Moderate' ? 'var(--warning)' : 'var(--success)')}` }}>
                                <p style={{ color: routeStats.riskLevel === 'High' ? 'var(--danger)' : (routeStats.riskLevel === 'Moderate' ? 'var(--warning)' : 'var(--success)'), fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
                                    {routeStats.riskLevel.toUpperCase()} RISK ZONE
                                </p>
                                <p style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '5px' }}>Rank #{routeStats.rank} in Safety Index</p>
                            </div>

                            <h4 style={{ color: 'var(--secondary)', marginBottom: '0.8rem' }}>Historical Crime History</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                    <span>⚠️ Sexual Harassment</span>
                                    <strong style={{ color: 'var(--danger)' }}>{routeStats.harassmentCases} cases</strong>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                    <span>⛓️ Chain Snatching / Theft</span>
                                    <strong style={{ color: 'var(--text-main)' }}>{routeStats.theftCases.toLocaleString()}</strong>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
                                    <span>🚗 Road Accidents</span>
                                    <strong style={{ color: 'var(--text-light)' }}>{routeStats.accidentCases.toLocaleString()}</strong>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', borderTop: '2px solid var(--accent-light)', marginTop: '0.8rem' }}>
                                    <span>📊 TOTAL REPORTED CASES</span>
                                    <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{routeStats.totalCases.toLocaleString()}</strong>
                                </li>
                            </ul>

                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '2rem', fontStyle: 'italic', textAlign: 'center' }}>
                                Official Destination Safety Records • She Shield Intelligence
                            </p>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ color: 'var(--text-light)' }}>Enter a Starting Point and Destination in Tamil Nadu to analyze the route safety statistics.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteMap;

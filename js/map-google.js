// Google Maps Implementation for WELLCORE Platform
class WellMapGoogle {
    constructor(elementId) {
        this.elementId = elementId;
        this.map = null;
        this.markers = [];
        this.currentMapType = 'roadmap'; // 'roadmap', 'satellite', 'hybrid', 'terrain'
        this.init();
    }

    init() {
        // Initialize Google Map centered on Algeria/desert region
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            const el = document.getElementById(this.elementId);
            if (el) el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#aad;background:#1a2634;flex-direction:column;gap:10px;"><i class="fa-solid fa-cloud-slash fa-2x"></i><span>Map Offline</span></div>';
            return;
        }
        const mapOptions = {
            center: { lat: 31.5, lng: 5.5 },
            zoom: 8,
            mapTypeId: 'roadmap', // Default to street view
            styles: this.getDarkMapStyle(), // Custom dark theme
            mapTypeControl: false, // We'll use custom buttons
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: 'greedy'
        };

        this.map = new google.maps.Map(
            document.getElementById(this.elementId),
            mapOptions
        );

        this.renderMarkers();
    }

    getDarkMapStyle() {
        // Custom dark theme for Google Maps to match platform aesthetic
        return [
            { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
            {
                featureType: "administrative.country",
                elementType: "geometry.stroke",
                stylers: [{ color: "#4b6878" }]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#64779e" }]
            },
            {
                featureType: "administrative.province",
                elementType: "geometry.stroke",
                stylers: [{ color: "#4b6878" }]
            },
            {
                featureType: "landscape.man_made",
                elementType: "geometry.stroke",
                stylers: [{ color: "#334e87" }]
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{ color: "#023e58" }]
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#283d6a" }]
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6f9ba5" }]
            },
            {
                featureType: "poi",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1d2c4d" }]
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{ color: "#023e58" }]
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#3C7680" }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#304a7d" }]
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#98a5be" }]
            },
            {
                featureType: "road",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1d2c4d" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#2c6675" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#255763" }]
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#b0d5ce" }]
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#023e58" }]
            },
            {
                featureType: "transit",
                elementType: "labels.text.fill",
                stylers: [{ color: "#98a5be" }]
            },
            {
                featureType: "transit",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1d2c4d" }]
            },
            {
                featureType: "transit.line",
                elementType: "geometry.fill",
                stylers: [{ color: "#283d6a" }]
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#3a4762" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0e1626" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#4e6d70" }]
            }
        ];
    }

    renderMarkers(searchTerm = "") {
        // Clear existing markers
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];

        const term = searchTerm.toLowerCase();
        const filteredRigs = mockData.rigs.filter(rig => {
            return (
                rig.id.toLowerCase().includes(term) ||
                rig.name.toLowerCase().includes(term) ||
                (rig.country && rig.country.toLowerCase().includes(term)) ||
                (rig.state && rig.state.toLowerCase().includes(term)) ||
                (rig.district && rig.district.toLowerCase().includes(term)) ||
                rig.location.toLowerCase().includes(term)
            );
        });

        // Create custom marker icons for different statuses
        filteredRigs.forEach(rig => {
            let markerColor = '#00d4ff'; // operational
            if (rig.status === 'maintenance') markerColor = '#ffbf00';
            if (rig.status === 'offline') markerColor = '#ff4444';

            // Create custom marker icon using SVG
            const markerIcon = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: markerColor,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8,
                labelOrigin: new google.maps.Point(0, -2)
            };

            const marker = new google.maps.Marker({
                position: { lat: rig.lat, lng: rig.lng },
                map: this.map,
                icon: markerIcon,
                title: rig.name,
                label: {
                    text: rig.id.replace('Ain Djasser ', '').replace('Merouana ', '').replace('Batna ', ''),
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "600",
                    className: "map-marker-label"
                },
                animation: google.maps.Animation.DROP
            });

            // Create info window content
            const statusColor = markerColor;

            const infoContent = `
                <div style="font-family: 'Outfit', sans-serif; padding: 12px; min-width: 240px; background: #1a2634; color: #fff; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                        <i class="fa-solid fa-droplet" style="color: ${statusColor};"></i>
                        <h4 style="margin: 0; color: #fff; font-size: 15px; font-weight: 700;">${rig.name}</h4>
                    </div>
                    <div style="font-size: 13px; line-height: 1.6; color: #b0d5ce;">
                        <div style="margin-bottom: 4px;"><strong>ID:</strong> <span style="color: #fff;">${rig.id}</span></div>
                        <div style="margin-bottom: 4px;"><strong>Location:</strong> <span style="color: #fff;">${rig.state || 'N/A'}, ${rig.district || 'N/A'}</span></div>
                        <div style="margin-bottom: 4px;"><strong>Type:</strong> <span style="color: #fff;">${rig.wellType || 'N/A'}</span></div>
                        <div style="margin-bottom: 4px;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: 800;">${rig.status.toUpperCase()}</span></div>
                        <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                            <button onclick="viewWellDetails('${rig.id}')" style="background: ${statusColor}; color: #000; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 12px; font-family: 'Outfit'; transition: 0.2s;">
                                <i class="fa-solid fa-eye" style="margin-right: 5px;"></i> VIEW PROFILE
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: infoContent
            });

            marker.addListener('click', () => {
                // Close all other info windows
                this.markers.forEach(m => {
                    if (m.infoWindow) m.infoWindow.close();
                });

                infoWindow.open(this.map, marker);

                // Smooth pan to marker
                this.map.panTo(marker.getPosition());
                this.map.setZoom(13);
            });

            marker.infoWindow = infoWindow;
            this.markers.push(marker);
        });
    }

    highlightRig(rigId) {
        const rig = mockData.rigs.find(r => r.id === rigId);
        if (!rig) return;

        const marker = this.markers.find(m =>
            m.getPosition().lat() === rig.lat &&
            m.getPosition().lng() === rig.lng
        );

        if (marker) {
            // Animate marker
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 2000);

            // Pan and zoom to marker
            this.map.panTo(marker.getPosition());
            this.map.setZoom(12);

            // Open info window
            if (marker.infoWindow) {
                this.markers.forEach(m => {
                    if (m.infoWindow) m.infoWindow.close();
                });
                marker.infoWindow.open(this.map, marker);
            }
        }
    }

    changeMapType(type) {
        // type can be: 'street-map', 'satellite', 'hybrid', 'terrain'
        let googleMapType = 'roadmap';

        if (type === 'street-map') {
            googleMapType = 'roadmap';
        } else if (type === 'satellite') {
            googleMapType = 'satellite';
        } else if (type === 'hybrid') {
            googleMapType = 'hybrid';
        } else if (type === 'terrain') {
            googleMapType = 'terrain';
        }

        this.currentMapType = googleMapType;
        this.map.setMapTypeId(googleMapType);

        // Remove dark style for satellite view
        if (type === 'satellite' || type === 'hybrid') {
            this.map.setOptions({ styles: [] });
        } else {
            this.map.setOptions({ styles: this.getDarkMapStyle() });
        }
    }

    addGenericLayer(geojson, name) {
        // Initialize visibility tracker
        if (!this.layerVisibility) this.layerVisibility = {};
        this.layerVisibility[name] = true;

        // Add features
        const features = this.map.data.addGeoJson(geojson);

        // Tag features with layer name for later filtering
        features.forEach(f => f.setProperty('_layerName', name));

        // Apply styles
        this.applyLayerStyles();

        console.log(`Layer ${name} added.`);
    }

    toggleGenericLayer(name, isVisible) {
        if (!this.layerVisibility) this.layerVisibility = {};
        this.layerVisibility[name] = isVisible;
        this.applyLayerStyles();
    }

    applyLayerStyles() {
        this.map.data.setStyle((feature) => {
            const layerName = feature.getProperty('_layerName');

            // Check visibility
            if (layerName && this.layerVisibility && this.layerVisibility[layerName] === false) {
                return { visible: false };
            }

            // Default Style
            let style = {
                strokeColor: '#2ed573',
                strokeWeight: 2,
                fillColor: '#2ed573',
                fillOpacity: 0.3,
                visible: true
            };

            // Custom coloring based on layer name
            if (layerName) {
                if (layerName.toLowerCase().includes('water')) {
                    style.strokeColor = '#00d4ff';
                    style.fillColor = '#00d4ff';
                } else if (layerName.toLowerCase().includes('pipe')) {
                    style.strokeColor = '#ffa502';
                    style.strokeWeight = 4;
                }
            }

            return style;
        });
    }
}

// Global instance
window.mainMap = null;
let googleMapsLoaded = false;

// Initialize map when Google Maps API is loaded
function initGoogleMap() {
    googleMapsLoaded = true;
    if (document.getElementById('map')) {
        window.mainMap = new WellMapGoogle('map');
    }
}

// Function to change basemap (called from HTML buttons)
function changeBasemap(type) {
    if (!mainMap) return;

    mainMap.changeMapType(type);

    // Update active button state
    document.querySelectorAll('.card-actions .sm-btn').forEach(btn => btn.classList.remove('active'));
    if (type === 'street-map') {
        const btn = document.getElementById('btnMapStreets');
        if (btn) btn.classList.add('active');
    } else if (type === 'satellite') {
        const btn = document.getElementById('btnMapSatellite');
        if (btn) btn.classList.add('active');
    }
}

// Full screen map instance
let fullMapInstance = null;

function initFullScreenGoogleMap() {
    if (!fullMapInstance && document.getElementById('map-full')) {
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            document.getElementById('map-full').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#aad;background:#1a2634;flex-direction:column;gap:10px;"><i class="fa-solid fa-cloud-slash fa-2x"></i><span>Map Service Unavailable (No Internet)</span></div>';
            return;
        }
        const mapOptions = {
            center: { lat: 31.5, lng: 5.5 },
            zoom: 7,
            mapTypeId: 'satellite',
            streetViewControl: true,
            fullscreenControl: true,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            }
        };

        fullMapInstance = new google.maps.Map(
            document.getElementById('map-full'),
            mapOptions
        );

        // Add markers
        mockData.rigs.forEach(rig => {
            let markerColor = '#00d4ff';
            if (rig.status === 'maintenance') markerColor = '#ffbf00';
            if (rig.status === 'offline') markerColor = '#ff4444';

            const marker = new google.maps.Marker({
                position: { lat: rig.lat, lng: rig.lng },
                map: fullMapInstance,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: markerColor,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 8,
                    labelOrigin: new google.maps.Point(0, -2)
                },
                title: rig.name,
                label: {
                    text: rig.id.replace('Ain Djasser ', '').replace('Merouana ', '').replace('Batna ', ''),
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "600",
                    className: "map-marker-label"
                }
            });

            const infoContent = `
                <div style="font-family: 'Outfit', sans-serif; padding: 12px; min-width: 240px; background: #1a2634; color: #fff; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                        <i class="fa-solid fa-droplet" style="color: ${markerColor};"></i>
                        <h4 style="margin: 0; color: #fff; font-size: 15px; font-weight: 700;">${rig.name}</h4>
                    </div>
                    <div style="font-size: 13px; line-height: 1.6; color: #b0d5ce;">
                        <div style="margin-bottom: 4px;"><strong>ID:</strong> <span style="color: #fff;">${rig.id}</span></div>
                        <div style="margin-bottom: 4px;"><strong>Location:</strong> <span style="color: #fff;">${rig.state || 'N/A'}, ${rig.district || 'N/A'}</span></div>
                        <div style="margin-bottom: 4px;"><strong>Type:</strong> <span style="color: #fff;">${rig.wellType || 'N/A'}</span></div>
                        <div style="margin-bottom: 4px;"><strong>Status:</strong> <span style="color: ${markerColor}; font-weight: 800;">${rig.status.toUpperCase()}</span></div>
                        <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                            <button onclick="viewWellDetails('${rig.id}')" style="background: ${markerColor}; color: #000; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 12px; font-family: 'Outfit'; transition: 0.2s;">
                                <i class="fa-solid fa-eye" style="margin-right: 5px;"></i> VIEW PROFILE
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: infoContent
            });

            marker.addListener('click', () => {
                infoWindow.open(fullMapInstance, marker);
                fullMapInstance.panTo(marker.getPosition());
            });
        });
    }
}
// AI Analysis Handler
function runAIAnalysis() {
    const btn = document.getElementById('btnRunAI');
    const container = document.getElementById('aiAnalysisResult');
    const loadingHtml = `<div style="text-align:center; padding: 2rem; color: var(--accent-primary);"><i class="fa-solid fa-circle-notch fa-spin fa-2x"></i><br><br>AI Neural Network Processing...</div>`;

    // Show loading
    container.style.display = 'block';
    container.innerHTML = loadingHtml;
    btn.disabled = true;

    // Simulate Processing Delay
    setTimeout(() => {
        // Get current well ID from the details view
        // Note: We need to store successful "current well" somewhere globally or grab it from DOM
        // For now, let's grab it from the ID span
        const wellId = document.getElementById('detailWellId').textContent;
        const well = mockData.rigs.find(r => r.id === wellId);

        if (well && typeof wellAnalyst !== 'undefined') {
            const report = wellAnalyst.analyze(well);
            renderAIReport(report, container);
        } else {
            container.innerHTML = `<div class="alert-box danger">Error: Could not retrieve well data for analysis.</div>`;
        }
        btn.disabled = false;
    }, 1500);
}

function renderAIReport(report, container) {
    const scoreClass = report.score >= 80 ? 'good' : (report.score >= 50 ? 'average' : 'poor');

    let alertsHtml = '';
    report.alerts.forEach(alert => {
        alertsHtml += `
            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid ${alert.type === 'critical' ? '#ff4444' : '#ffbf00'}; display:flex; gap:10px; align-items:center;">
                <i class="fa-solid ${alert.icon}" style="color: ${alert.type === 'critical' ? '#ff4444' : '#ffbf00'};"></i>
                <span style="font-size:0.9em;">${alert.message}</span>
            </div>
        `;
    });

    let recsHtml = '';
    if (report.recommendations.length > 0) {
        recsHtml = `<div class="ai-recommendations"><h5 style="color:#fff; margin-bottom:10px;">Recommended Actions:</h5>`;
        report.recommendations.forEach(rec => {
            recsHtml += `<div class="ai-rec-item"><i class="fa-solid fa-check-circle"></i> <span>${rec}</span></div>`;
        });
        recsHtml += `</div>`;
    }

    const html = `
        <div class="ai-result-container">
            <div class="ai-header">
                <div class="ai-title"><i class="fa-solid fa-robot"></i> System Diagnosis</div>
                <div class="ai-score ${scoreClass}">${report.score}% Health</div>
            </div>
            <div class="ai-summary">
                ${report.summary}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <h5 style="color: var(--text-muted); margin-bottom: 0.8rem;">Detected Issues</h5>
                    ${alertsHtml || '<div style="color: var(--accent-success); font-style: italic;"><i class="fa-solid fa-check"></i> No issues detected.</div>'}
                </div>
                <div>
                    ${recsHtml}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Geowell Asset Innovation Hub
 * Handles 3D Digital Twin, GIS Tracking, ROI Analytics, and Smart Logistics
 */

// Initialize Smart Components on Load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initSmartHub, 500);
});

function initSmartHub() {
    const intel = window.mockData.assetIntelligence;
    if (!intel) return;

    Object.keys(intel).forEach(key => {
        const data = intel[key];
        const tagContainer = document.getElementById(`tags-${key}`);
        if (!tagContainer) return;

        tagContainer.innerHTML = ''; // Clear

        // 1. Hours/Days Logic (Maintenance Priority)
        const lastServiceDate = new Date(data.lastService);
        const daysSinceService = Math.floor((new Date() - lastServiceDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceService > 180 || data.battery < 20 || data.quality < 50) {
            tagContainer.innerHTML += `<span class="smart-tag tag-maintenance"><i class="fa-solid fa-screwdriver-wrench"></i> Maintenance Priority</span>`;
        }

        // 2. Power Logic
        if (data.battery > 80) {
            tagContainer.innerHTML += `<span class="smart-tag tag-power"><i class="fa-solid fa-battery-full"></i> Optimized Power</span>`;
        } else if (data.battery < 30) {
            tagContainer.innerHTML += `<span class="smart-tag tag-power" style="color:#e74c3c;"><i class="fa-solid fa-battery-quarter"></i> Power Saving</span>`;
        }

        // 3. Quality Logic
        if (data.quality > 90) {
            tagContainer.innerHTML += `<span class="smart-tag tag-quality"><i class="fa-solid fa-certificate"></i> Premium Precision</span>`;
        }

        // Update Battery HUD
        const batFill = document.getElementById(`bat-${key}`);
        const batVal = document.getElementById(`bat-val-${key}`);
        if (batFill) batFill.style.width = `${data.battery}%`;
        if (batVal) batVal.textContent = `${data.battery}%`;
    });
}

window.showSmartBooking = function(assetKey) {
    const intel = window.mockData.assetIntelligence[assetKey];
    if (!intel) return;

    const modal = document.getElementById('modal-smart-booking');
    const alertBox = document.getElementById('booking-alert-box');
    
    document.getElementById('book-origin').textContent = assetKey === 'gps' ? 'Sector 01' : 'Main Warehouse';
    document.getElementById('book-time').textContent = assetKey === 'drone' ? '1.5 Hours (Air)' : '4 Hours (Road)';
    document.getElementById('book-cost').textContent = intel.operationalCost;
    document.getElementById('book-status').textContent = intel.battery > 20 ? 'Operational' : 'Low Power';

    alertBox.innerHTML = `
        <div style="background:rgba(0,212,255,0.1); border:1px solid var(--accent-primary); padding:10px; border-radius:8px; font-size:0.8rem;">
            <i class="fa-solid fa-truck-fast"></i> <strong>Logistics Update:</strong> 
            This asset will be transferred from ${document.getElementById('book-origin').textContent} to your current GIS coordinates.
            Estimated arrival: <strong>${document.getElementById('book-time').textContent}</strong>.
        </div>
    `;

    modal.classList.add('active');
};

window.confirmSmartBooking = function() {
    const isPriority = document.getElementById('priority-check').checked;
    showToast(isPriority ? 'PRIORITY Transfer Initialized. Logistics team notified.' : 'Transfer Initialized successfully.', 'success');
    closeInnovationModal('modal-smart-booking');
};

window.viewSupport = function(assetKey) {
    const intel = window.mockData.assetIntelligence[assetKey];
    if (!intel) return;

    const content = `
        <div style="text-align:left;">
            <strong style="color:var(--accent-primary)">Smart Support Guide</strong><br>
            <p style="font-size:0.8rem; margin:5px 0;">${intel.suitability}</p>
            <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:8px 0;">
            <a href="#" style="color:var(--accent-success); font-size:0.75rem; text-decoration:none;"><i class="fa-solid fa-play-circle"></i> Watch Calibration Video</a><br>
            <a href="#" style="color:var(--accent-success); font-size:0.75rem; text-decoration:none;"><i class="fa-solid fa-file-pdf"></i> Download Field Manual</a>
        </div>
    `;
    
    showToast(content, 'info');
};

// --- Re-using and Refining Existing Functions ---

const internalAssetData = {
    drone: { name: "Survey Drone SAR", model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", location: [35.85, 6.02], path: [[35.84, 6.01], [35.85, 6.02], [35.86, 6.01]] },
    gps: { name: "GPS RTK Rover", model: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb", location: [36.75, 3.05], path: [[36.74, 3.04], [36.75, 3.05]] },
    gpr: { name: "Mala GPR System", model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", location: [35.88, 5.96], path: [[35.87, 5.95], [35.88, 5.96]] },
    magnetometer: { name: "Geometrics Magnetometer", model: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb", location: [36.70, 3.10], path: [[36.69, 3.09], [36.70, 3.10]], faulty:true }
};

let trackMap = null;

window.viewAsset3D = function(assetKey) {
    if (typeof checkActionPermission === 'function' && !checkActionPermission('ENGINEER')) return;
    
    const asset = internalAssetData[assetKey];
    if (!asset) return;
    const modal = document.getElementById('modal-3d-viewer');
    const viewer = document.getElementById('asset-model');
    document.getElementById('tw-title').innerHTML = `<i class="fa-solid fa-cube"></i> Digital Twin: ${asset.name}`;
    viewer.src = asset.model;
    const hotspot = viewer.querySelector('[slot="hotspot-sensor"]');
    hotspot.style.display = asset.faulty ? 'block' : 'none';
    modal.classList.add('active');
};

window.trackAsset = function(assetKey) {
    if (typeof checkActionPermission === 'function' && !checkActionPermission('ENGINEER')) return;
    
    const asset = internalAssetData[assetKey];
    if (!asset) return;
    const modal = document.getElementById('modal-asset-track');
    document.getElementById('track-title').innerHTML = `<i class="fa-solid fa-route"></i> Live Tracking: ${asset.name}`;
    modal.classList.add('active');
    setTimeout(() => {
        if (!trackMap) {
            trackMap = L.map('track-map', { zoomControl: false, attributionControl: false }).setView(asset.location, 13);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(trackMap);
        } else {
            trackMap.setView(asset.location, 13);
            trackMap.eachLayer(layer => { if (layer instanceof L.Polyline || layer instanceof L.Marker) trackMap.removeLayer(layer); });
        }
        const path = L.polyline(asset.path, { color: '#00d4ff', weight: 3, dashArray: '5, 10' }).addTo(trackMap);
        const icon = L.divIcon({ className: 'custom-div-icon', html: `<div style="background-color:#00ff9d; width:12px; height:12px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 10px #00ff9d;" class="status-pulse"></div>`, iconSize: [12, 12], iconAnchor: [6, 6] });
        L.marker(asset.location, { icon }).addTo(trackMap);
        trackMap.fitBounds(path.getBounds(), { padding: [50, 50] });
    }, 300);
};

window.viewAssetROI = function(assetKey) {
    const intel = window.mockData.assetIntelligence[assetKey];
    showToast(`<strong>ROI Intelligence</strong><br>Efficiency Score: ${intel.quality}%<br>Operational Cost: ${intel.operationalCost}`, 'info');
};

window.closeInnovationModal = function(id) {
    document.getElementById(id).classList.remove('active');
};

// Weather Simulation
setInterval(() => {
    const droneWeather = document.getElementById('weather-drone');
    if (droneWeather) {
        const wind = Math.floor(Math.random() * 30);
        droneWeather.innerHTML = wind > 20 
            ? `<i class="fa-solid fa-wind" style="color:var(--accent-danger)"></i> ${wind}km/h | WARNING`
            : `<i class="fa-solid fa-cloud-sun"></i> 24°C | Low Wind`;
    }
}, 8000);

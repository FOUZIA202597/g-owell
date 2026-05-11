document.addEventListener('DOMContentLoaded', () => {
    // Inject Layout Fixes for Full Map
    const style = document.createElement('style');
    style.innerHTML = `
    .well-label {
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid var(--accent-primary);
        color: #fff;
        font-weight: bold;
        font-size: 10px;
        padding: 1px 4px;
        border-radius: 4px;
        box-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
    }
    .leaflet-tooltip-top:before { border-top-color: var(--accent-primary); }
        #view-map.active { display: flex !important; flex: 1 !important; height: calc(100vh - 70px) !important; flex-direction: column !important; overflow: hidden !important; }
        .full-map-container { flex: 1 !important; display: flex !important; height: 100% !important; min-height: 0 !important; width: 100% !important; }
        #map-full { flex: 1 !important; width: 100% !important; height: 100% !important; min-height: 500px !important; }
    `;
    document.head.appendChild(style);

    // Initialize Dashboard
    initDashboard();

    // Global Refresh Map Hack (Just in case)
    window.fixMyMap = function() {
        if (window.fullMap && window.fullMap.map) {
            window.fullMap.map.invalidateSize();
            console.log("Map resized manually.");
        }
    };

    // Update Date
    updateDate();
    setInterval(updateDate, 60000);

    // Start Live Simulation
    simulateLiveUpdates();
});

// --- ROBUST ERROR HANDLER ---
window.onerror = function(msg, url, line, col, error) {
    // Ignore harmless resize errors or known library issues
    if (msg.includes('ResizeObserver') || msg.includes('Script error')) return;
    
    console.error("Global Error:", error);
    // Only show critical errors in development/debug mode
    // const box = document.createElement('div');
    // ... (disabled for user experience unless critical)
};

function initDashboard() {
    console.log("Initializing Dashboard...");

    // 1. Ensure Map is ready
    if (typeof wellMap !== 'undefined') {
        const container = document.getElementById('map');
        if (container && !window.mainMap) {
            try {
                window.mainMap = new wellMap('map');
            } catch (e) {
                console.error("Map Init Warning:", e);
            }
        } else if (window.mainMap && window.mainMap.map) {
            setTimeout(() => window.mainMap.map.invalidateSize(), 100);
        }
    }

    renderKPIs();
    renderRigStatus();
    renderAlerts();
    setupEventListeners();
    setupNavigation();

    // 2. PRIORITY: Load saved well data from localStorage FIRST
    //    This ensures user-added well data persists across sessions
    if (typeof loadFromLocalStorage === 'function') {
        loadFromLocalStorage();
    }

    initWellsManager();
    initLibrary();

    // 3. Display whatever data is currently available (mock or saved)
    loadLocalData();

    // 4. Try to sync with live backend in background (non-blocking)
    setTimeout(() => {
        fetchWellsData();
        fetchLayersData();
    }, 1000);
}

// Global Toast Notification System
window.showToast = function(message, type = 'success') {
    // Remove old toast if exists
    const old = document.getElementById('geoToast');
    if (old) old.remove();

    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
    const colors = { success: '#00ff9d', error: '#ff4757', info: '#00d4ff', warning: '#ffbf00' };
    const color = colors[type] || colors.success;
    const icon = icons[type] || icons.success;

    const toast = document.createElement('div');
    toast.id = 'geoToast';
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 99999;
        background: rgba(19, 27, 38, 0.97);
        border: 1px solid ${color};
        border-left: 4px solid ${color};
        color: #fff;
        padding: 14px 20px;
        border-radius: 12px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}22;
        animation: slideInToast 0.3s ease;
        max-width: 360px;
    `;
    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color:${color}; font-size:1.2rem; flex-shrink:0;"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#666;cursor:pointer;margin-left:auto;font-size:1.1rem;padding:0;">&times;</button>
    `;

    // Add animation keyframe if not already present
    if (!document.getElementById('toastStyle')) {
        const s = document.createElement('style');
        s.id = 'toastStyle';
        s.innerHTML = '@keyframes slideInToast { from { opacity:0; transform: translateX(30px); } to { opacity:1; transform: translateX(0); } }';
        document.head.appendChild(s);
    }

    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
};

function loadLocalData() {
    console.log("Loading Local/Mock Data...");
    if (window.mockData && window.mockData.rigs) {
        // Mock Data Update
        const liveWells = window.mockData.rigs;
        const activeCount = liveWells.filter(w => w.status === 'Active' || w.status === 'operational').length;
        window.mockData.overview.totalWells = liveWells.length;
        window.mockData.overview.activeWells = activeCount;
        window.mockData.overview.efficiency = Math.round((activeCount / liveWells.length) * 100) || 0;

        renderKPIs();
        renderRigStatus();
        if (typeof initWellsManager === 'function') initWellsManager();
        
        // Map Markers
        if (window.mainMap) {
             window.mainMap.renderMarkers(); 
             // Only auto-fit if we haven't done it yet
             // initFullMap(); 
        }
    }
    
    // Load Mock GIS Layers
    if (typeof loadMockGISLayers === 'function') {
        loadMockGISLayers();
    }
}

async function fetchWellsData() {
    try {
        console.log("Attempting to connect to PostGIS Backend...");
        const response = await fetch('http://localhost:3000/api/wells');

        if (!response.ok) throw new Error('Network response was not ok');

        const geojson = await response.json();
        
        if (geojson.features && geojson.features.length > 0) {
            console.log(`Loaded ${geojson.features.length} live wells from Backend.`);
            const liveWells = geojson.features.map(f => ({
                id: f.properties.id,
                name: f.properties.name,
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                status: f.properties.status || 'Active',
                type: f.properties.type,
                depth: f.properties.depth,
                hydraulics: {
                    staticLevel: f.properties.static_lvl,
                    dynamicLevel: f.properties.dynamic_lvl,
                    discharge: f.properties.discharge,
                    piezometricLevel: f.properties.piezometric
                },
                physical: {
                    temp: f.properties.temp,
                    ph: f.properties.ph,
                    tds: f.properties.tds,
                    conductivity: f.properties.conduct
                },
                chemical: {
                    cations: { Na: f.properties.na, K: f.properties.k, Ca: f.properties.ca, Mg: f.properties.mg },
                    anions: { Cl: f.properties.cl, SO4: f.properties.so4, HCO3: f.properties.hco3, NO3: f.properties.no3 }
                },
                state: f.properties.state || "Batna",
                district: f.properties.district || "Batna",
                location: f.properties.location || `Lat: ${f.geometry.coordinates[1].toFixed(4)}, Lng: ${f.geometry.coordinates[0].toFixed(4)}`
            }));

            mockData.rigs = liveWells;
            loadLocalData(); // Refresh everything with new data
        }
    } catch (error) {
        console.warn("PostGIS Backend offline. Staying with local mock data.");
    }
}
async function fetchLayersData() {
     try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://localhost:3000/api/layers', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) return;

        const layers = await response.json();
        const listContainer = document.getElementById('layerList');
        const controlPanel = document.getElementById('layerControl');

        if (layers.length > 0 && controlPanel) {
            controlPanel.style.display = 'block';
            listContainer.innerHTML = '';
        }

        for (const layer of layers) {
             const res = await fetch(`http://localhost:3000/api/layer/${layer.name}`);
             const geojson = await res.json();
             if (window.mainMap) window.mainMap.addGenericLayer(geojson, layer.name);
        }

    } catch (e) {
        // Fallback to mock layers if not already loaded
        console.warn("GIS Backend offline. Using internal mock layers.");
        if (typeof loadMockGISLayers === 'function') loadMockGISLayers();
    }
}

window.toggleLayer = function (layerName, isVisible) {
    if (window.mainMap && window.mainMap.toggleGenericLayer) {
        window.mainMap.toggleGenericLayer(layerName, isVisible);
    }
}

let currentLibrary = [];

window.initLibrary = async function() {
    await fetchLibrary();
    renderLibrary('all');
}

window.fetchLibrary = async function() {
    try {
        const res = await fetch('http://localhost:3000/api/library/list');
        if (!res.ok) throw new Error("Server response not OK");
        currentLibrary = await res.json();
    } catch (e) {
        console.warn("Real library sync failed, checking localStorage or mock:", e);
        const saved = localStorage.getItem('geo_library');
        if (saved) {
            currentLibrary = JSON.parse(saved);
        } else if (window.mockData) {
            currentLibrary = window.mockData.documents;
        }
    }
}

window.saveLibraryToLocal = function() {
    localStorage.setItem('geo_library', JSON.stringify(currentLibrary));
}

window.openLibraryModal = function() {
    const modal = document.getElementById('libraryUploadModal');
    if (modal) {
        modal.classList.add('active'); // CSS handles display and opacity
    }
}

window.closeLibraryModal = function() {
    const modal = document.getElementById('libraryUploadModal');
    if (modal) {
        modal.classList.remove('active');
    }
    const form = document.getElementById('libraryUploadForm');
    if (form) form.reset();
    const fileNameDisplay = document.getElementById('libFileName');
    if (fileNameDisplay) fileNameDisplay.textContent = (typeof getText === 'function') ? getText('lib_no_file') : 'No file chosen';
}

// Intercept the form submisson when dom loads
document.addEventListener('DOMContentLoaded', () => {
    const libForm = document.getElementById('libraryUploadForm');
    if (libForm) {
        libForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLibraryUpload();
        });
    }
});

window.handleLibraryUpload = async function() {
    const input = document.getElementById('libActualFile');
    if (!input || !input.files || !input.files[0]) {
        alert(getText ? getText('lib_no_file') : "Please select a file.");
        return;
    }
    
    const file = input.files[0];
    const title = document.getElementById('libTitle').value || file.name;
    const type = document.getElementById('libType').value || 'reports';
    const author = document.getElementById('libAuthor').value || 'System';
    const year = document.getElementById('libYear').value || new Date().getFullYear();
    const description = document.getElementById('libDesc').value || '';
    
    // UI Feedback
    const submitBtn = document.querySelector('#libraryUploadForm button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
        submitBtn.disabled = true;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64File = e.target.result; // This includes "data:mime/type;base64,..."
        const extension = file.name.split('.').pop().toLowerCase();
        
        const docData = {
            id: 'doc_' + Date.now(),
            file: base64File,
            name: title,
            fileName: file.name,
            category: type, 
            type: extension,
            date: year + ' - ' + author,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            description: description
        };

        try {
            // Attempt real backend first
            const res = await fetch('http://localhost:3000/api/library/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(docData)
            });
            if (res.ok) {
                await fetchLibrary();
            } else {
                throw new Error("Backend offline");
            }
        } catch (err) {
            console.warn("Saving locally (Offline Mode)");
            currentLibrary.unshift(docData);
            saveLibraryToLocal();
        }

        if (typeof addAiLog === 'function') addAiLog(`[LIBRARY] ${title} saved.`, "success");
        if (typeof showToast === 'function') showToast(`📄 Document "${title}" uploaded successfully!`, 'success');
        renderLibrary(typeof activeLibraryCategory !== 'undefined' ? activeLibraryCategory : 'all');
        closeLibraryModal();
        
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    };
    reader.readAsDataURL(file);
}

window.downloadFile = function(id) {
    const doc = currentLibrary.find(d => String(d.id) === String(id));
    if (!doc) return;

    if (doc.url && doc.url !== '#') {
        window.open(`http://localhost:3000${doc.url}`, '_blank');
        return;
    }

    // Demo / Mock Fallback: If no file data, generate a realistic demo document
    let fileContent = doc.file;
    let fileName = doc.fileName || doc.name;
    
    if (!fileContent) {
        console.warn("File data not found, providing demo content.");
        const demoContent = `[DEMO DOCUMENT]
Name: ${doc.name}
Category: ${doc.category}
Date: ${doc.date}
Size: ${doc.size}
---------------------------------
This is a generated placeholder for the demo. 
In a production environment, this would contain the actual ${doc.type.toUpperCase()} binary data.`;
        fileContent = 'data:text/plain;charset=utf-8,' + encodeURIComponent(demoContent);
        if (!fileName.includes('.')) fileName += '.txt';
    }

    try {
        if (fileContent.startsWith('data:text/plain')) {
            // Simple download for text fallbacks
            const a = document.createElement('a');
            a.href = fileContent;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return;
        }

        const parts = fileContent.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    } catch (e) {
        console.error("Download failed:", e);
        alert("Download failed. The file data might be corrupted.");
    }
}

window.handleLibraryDelete = async function(id) {
    if (!confirm("Delete this document?")) return;
    
    try {
        const res = await fetch(`http://localhost:3000/api/library/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await fetchLibrary();
        } else { throw new Error(); }
    } catch (err) {
        currentLibrary = currentLibrary.filter(d => String(d.id) !== String(id));
        saveLibraryToLocal();
    }
    renderLibrary(activeLibraryCategory);
}

window.handleLibraryEdit = async function(id) {
    const doc = currentLibrary.find(d => String(d.id) === String(id));
    if (!doc) return;

    const newName = prompt("New name:", doc.name);
    if (!newName) return;

    try {
        const res = await fetch('http://localhost:3000/api/library/edit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name: newName })
        });
        if (res.ok) {
            await fetchLibrary();
        } else { throw new Error(); }
    } catch (err) {
        const docObj = currentLibrary.find(d => String(d.id) === String(id));
        if (docObj) docObj.name = newName;
        saveLibraryToLocal();
    }
    renderLibrary(activeLibraryCategory);
}

window.renderLibrary = function(category = 'all', searchQuery = '') {
    const container = document.getElementById('libraryContainer');
    if (!container) return;
    container.innerHTML = '';

    // Safety: Ensure search input doesn't crash if called manually
    const searchVal = searchQuery || (document.getElementById('librarySearchInput') ? document.getElementById('librarySearchInput').value : '');

    let docs = (typeof currentLibrary !== 'undefined') ? currentLibrary : [];

    // Filter by Category
    if (category !== 'all') {
        docs = docs.filter(d => d.category === category);
    }
    
    // Filter by Search Query
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        docs = docs.filter(d => 
            d.name.toLowerCase().includes(q) || 
            (d.date && d.date.toLowerCase().includes(q)) || 
            (d.category && d.category.toLowerCase().includes(q))
        );
    }

    if (docs.length === 0) {
        container.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);"><i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 1rem;"></i><br>No documents found</td></tr>`;
        return;
    }

    docs.forEach(doc => {
        let iconClass = 'fa-file';
        let color = '#fff';
        let bgGlow = 'rgba(255,255,255,0.1)';
        
        if (doc.type === 'pdf') { iconClass = 'fa-file-pdf'; color = '#ff4757'; bgGlow='rgba(255,71,87,0.1)'; }
        if (['xls', 'csv', 'xlsx'].includes(doc.type)) { iconClass = 'fa-file-excel'; color = '#2ed573'; bgGlow='rgba(46,213,115,0.1)'; }
        if (['doc', 'docx'].includes(doc.type)) { iconClass = 'fa-file-word'; color = '#3742fa'; bgGlow='rgba(55,66,250,0.1)'; }

        const base64Data = doc.file ? doc.file : 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock Document Content for Presentation.');
        const downloadUrl = (doc.url && doc.url !== '#') ? `http://localhost:3000${doc.url}` : base64Data;
        const displayCategory = doc.category.toUpperCase();

        const tr = document.createElement('tr');
        tr.style.cssText = `transition: background 0.2s; cursor: default;`;
        
        tr.innerHTML = `
            <td style="text-align: center;">
                <div style="width: 40px; height: 40px; border-radius: 8px; background: ${bgGlow}; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                    <i class="fa-solid ${iconClass}" style="color: ${color}; font-size: 1.5rem;"></i>
                </div>
            </td>
            <td>
                <div style="font-weight: 600; color: #fff; font-size: 1rem;">${doc.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">ID: ${doc.id}</div>
            </td>
            <td>
                <span class="status-badge" style="background: rgba(0,212,255,0.1); color: var(--accent-primary); border: 1px solid rgba(0,212,255,0.2); font-size: 0.8rem;">
                    ${displayCategory}
                </span>
            </td>
            <td>
                <div style="color: #cbd5e1; font-weight: 500; font-size: 0.9rem;"><i class="fa-solid fa-user-pen" style="color:var(--text-muted); font-size:0.8rem; margin-right:4px;"></i> ${doc.date}</div>
            </td>
            <td style="color: var(--text-muted); font-size: 0.9rem;">
                ${doc.size}
            </td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick="handleLibraryEdit('${doc.id}')" title="Edit" style="background: rgba(255,255,255,0.05); color: #cbd5e1; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,212,255,0.2)'; this.style.color='#00d4ff';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.color='#cbd5e1';">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="handleLibraryDelete('${doc.id}')" title="Delete" style="background: rgba(255,255,255,0.05); color: #cbd5e1; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,71,87,0.2)'; this.style.color='#ff4757';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.color='#cbd5e1';">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button onclick="downloadFile('${doc.id}')" title="Download" style="background: rgba(46,213,115,0.1); color: #2ed573; border: 1px solid rgba(46,213,115,0.3); width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='rgba(46,213,115,0.2)';" onmouseout="this.style.background='rgba(46,213,115,0.1)';">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
            </td>
        `;

        tr.onmouseover = () => tr.style.background = 'rgba(255,255,255,0.02)';
        tr.onmouseout  = () => tr.style.background = 'transparent';

        container.appendChild(tr);
    });
}

// Global variable to track active category for search combination
let activeLibraryCategory = 'all';

window.filterLibrary = function(cat) {
    activeLibraryCategory = cat;
    const buttons = document.querySelectorAll('#view-library .card-actions .sm-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target && event.target.tagName === 'BUTTON') {
        event.target.classList.add('active');
    }
    const searchVal = document.getElementById('librarySearchInput') ? document.getElementById('librarySearchInput').value : '';
    renderLibrary(activeLibraryCategory, searchVal);
}

window.searchLibrary = function(query) {
    renderLibrary(activeLibraryCategory, query);
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('currentDate').innerText = now.toLocaleDateString('en-US', options);
}

function renderKPIs() {
    const container = document.querySelector('.kpi-row');
    container.innerHTML = '';

    // Animate numbers
    const kpis = [
        {
            id: 'kpi-wells',
            label: getText("total_wells"),
            value: mockData.overview.totalWells,
            change: "+2 new",
            isPositive: true,
            icon: "fa-bore-hole"
        },
        {
            id: 'kpi-active',
            label: getText("active_production"),
            value: mockData.overview.activeWells,
            change: "98% Online",
            isPositive: true,
            icon: "fa-fire-flame-curved"
        },
        {
            id: 'kpi-production',
            label: getText("daily_output"),
            value: mockData.overview.dailyProduction.toLocaleString(),
            change: "+5.4%",
            isPositive: true,
            icon: "fa-droplet"
        },
        {
            id: 'kpi-efficiency',
            label: getText("system_efficiency"),
            value: mockData.overview.efficiency + "%",
            change: "-1.2%",
            isPositive: false,
            icon: "fa-gauge-high"
        }
    ];

    kpis.forEach(kpi => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.id = kpi.id;
        card.innerHTML = `
            <div class="kpi-label"><i class="fa-solid ${kpi.icon}"></i> ${kpi.label}</div>
            <div class="kpi-value">${kpi.value}</div>
            <div class="kpi-change ${kpi.isPositive ? 'positive' : 'negative'}">
                <i class="fa-solid ${kpi.isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
                ${kpi.change}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderRigStatus() {
    const container = document.getElementById('rigStatusList');
    container.innerHTML = '';

    mockData.rigs.forEach(rig => {
        const item = document.createElement('div');
        item.className = 'status-item';
        item.style.cursor = 'pointer';
        item.onclick = () => {
            if (mainMap) mainMap.highlightRig(rig.id);
        };

        item.innerHTML = `
            <div class="rig-info">
                <span class="rig-name">${rig.name}</span>
                <span class="rig-location">${rig.location}</span>
            </div>
            <div class="status-badge ${rig.status}">
                ${rig.status}
            </div>
        `;
        container.appendChild(item);
    });
}

function renderAlerts() {
    const listSidebar = document.getElementById('alertsList');
    const listMain = document.getElementById('fullAlertsList');
    
    if (listSidebar) listSidebar.innerHTML = '';
    if (listMain) listMain.innerHTML = '';

    if (!mockData.alerts || mockData.alerts.length === 0) {
        const noAlertsHtml = '<div style="padding:1.5rem; text-align:center; color:#64748b;"><i class="fa-solid fa-shield-check" style="font-size: 2rem; margin-bottom: 0.5rem; color: #2ed573;"></i><br>System is stable. No active alerts.</div>';
        if (listSidebar) listSidebar.innerHTML = noAlertsHtml;
        if (listMain) listMain.innerHTML = noAlertsHtml;
        return;
    }

    mockData.alerts.forEach(alert => {
        // Colors & Icons based on Severity
        let iconColor = '#00d4ff'; // Info default
        let bgColor = 'rgba(0, 212, 255, 0.05)';
        let faIcon = 'fa-circle-info';

        if (alert.severity === 'warning') {
            iconColor = '#ffbf00';
            bgColor = 'rgba(255, 191, 0, 0.08)';
            faIcon = 'fa-triangle-exclamation';
        } else if (alert.severity === 'critical') {
            iconColor = '#ff4757';
            bgColor = 'rgba(255, 71, 87, 0.08)';
            faIcon = 'fa-bolt';
        } else if (alert.severity === 'maintenance') {
            iconColor = '#a29bfe';
            bgColor = 'rgba(162, 155, 254, 0.08)';
            faIcon = 'fa-wrench';
        }

        // HTML for Sidebar (Compact)
        if (listSidebar) {
            const sideItem = document.createElement('div');
            sideItem.className = 'status-item';
            sideItem.style.borderLeft = `3px solid ${iconColor}`;
            sideItem.style.backgroundColor = bgColor;
            sideItem.style.marginBottom = '8px';
            sideItem.style.padding = '0.75rem';
            sideItem.style.display = 'flex';
            sideItem.style.alignItems = 'flex-start';
            sideItem.style.gap = '10px';
            sideItem.style.cursor = 'pointer';

            sideItem.innerHTML = `
                <div style="color: ${iconColor}; font-size: 1.1rem; padding-top: 2px;">
                    <i class="fa-solid ${faIcon}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #e0e6ed; font-size: 0.85rem; margin-bottom: 3px;">
                        ${alert.wellName}
                    </div>
                    <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.3;" data-i18n="${alert.messageKey}">
                        ${alert.messageKey} <!-- Will be translated -->
                    </div>
                </div>
                <div style="font-size: 0.7rem; color: #64748b; white-space: nowrap;">
                    <i class="fa-regular fa-clock"></i> <span data-i18n="${alert.timeKey}">${alert.timeKey}</span>
                </div>
            `;
            listSidebar.appendChild(sideItem);
        }

        // HTML for Main View (Detailed)
        if (listMain) {
            const mainItem = document.createElement('div');
            mainItem.className = 'status-item';
            mainItem.style.borderLeft = `4px solid ${iconColor}`;
            mainItem.style.backgroundColor = 'var(--bg-card)';
            mainItem.style.marginBottom = '12px';
            mainItem.style.padding = '1.2rem';
            mainItem.style.display = 'flex';
            mainItem.style.alignItems = 'center';
            mainItem.style.gap = '15px';
            mainItem.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            
            mainItem.innerHTML = `
                <div style="color: ${iconColor}; font-size: 1.5rem; background: ${bgColor}; width: 45px; height: 45px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid ${faIcon}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: 700; color: #e0e6ed; font-size: 1.05rem;"><i class="fa-solid fa-location-dot" style="color:#64748b; font-size: 0.8em;"></i> ${alert.wellName}</span>
                        <span style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;"><i class="fa-regular fa-clock"></i> <span data-i18n="${alert.timeKey}">${alert.timeKey}</span></span>
                    </div>
                    <div style="font-size: 0.95rem; color: #cbd5e1;" data-i18n="${alert.messageKey}">
                        ${alert.messageKey} 
                    </div>
                </div>
                <div>
                     <button class="action-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem; background: rgba(255,255,255,0.05);">Acknowledge</button>
                </div>
            `;
            listMain.appendChild(mainItem);
        }
    });

    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }
}

function setupEventListeners() {
    // Map toggles - only add listeners if elements exist
    const btnMapHybrid = document.getElementById('btnMapHybrid');
    const btnMapTerrain = document.getElementById('btnMapTerrain');

    if (btnMapHybrid) {
        btnMapHybrid.addEventListener('click', (e) => {
            toggleMapLayer(e.target, 'hybrid');
        });
    }

    if (btnMapTerrain) {
        btnMapTerrain.addEventListener('click', (e) => {
            toggleMapLayer(e.target, 'terrain');
        });
    }

    // Global Search Handler
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const term = e.target.value;
            // 1. Update Wells Table if visible
            if (typeof renderWellsTable === 'function') {
                renderWellsTable(term);
            }
            // 2. Filter Map Markers if visible
            if (mainMap && typeof mainMap.renderMarkers === 'function') {
                // We'll update the renderMarkers to accept a filter in a moment
                mainMap.renderMarkers(term);
            }
        });
    }
}

function toggleMapLayer(btn, type) {
    document.querySelectorAll('.sm-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // In a real app, this would switch Leaflet tile layers
    console.log("Switched map to " + type);
}

// SIMULATION LOGIC
function simulateLiveUpdates() {
    // Update Production Number
    setInterval(() => {
        const productionKpi = document.querySelector('#kpi-production .kpi-value');
        if (productionKpi) {
            let current = parseInt(mockData.overview.dailyProduction);
            const fluctuation = Math.floor(Math.random() * 200) - 100; // -100 to +100
            current += fluctuation;
            productionKpi.innerText = current.toLocaleString();

            // Update Charts
            if (mainCharts) {
                mainCharts.updateChart(current);
            }
        }
    }, 3000); // Every 3 seconds

    // Realistic Multilingual Alert Generator
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 12 seconds
            // 1. Pick a random well from realistic data
            const randomWellOffset = Math.floor(Math.random() * Math.min(mockData.rigs.length, 25));
            const targetedWell = mockData.rigs[randomWellOffset];

            // 2. Define possible realistic alerts that match translation keys
            const possibleAlerts = [
                { key: 'alert_critical_level', sev: 'critical'},
                { key: 'alert_high_salinity', sev: 'warning'},
                { key: 'alert_pump_vibration', sev: 'warning'},
                { key: 'alert_pressure_drop', sev: 'critical'},
                { key: 'alert_flow_issue', sev: 'warning'},
                { key: 'alert_maintenance', sev: 'maintenance'}
            ];
            
            const selectedAlert = possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)];

            // Shift existing alerts' time text context
            mockData.alerts.forEach((alert, idx) => {
                if (idx > 0) alert.timeKey = 'hours_ago';
                else alert.timeKey = 'mins_ago';
            });

            const newAlert = {
                id: Date.now(),
                severity: selectedAlert.sev,
                messageKey: selectedAlert.key,
                wellName: targetedWell ? targetedWell.name : 'Unknown Well',
                timeKey: 'just_now' 
            };
            
            mockData.alerts.unshift(newAlert);
            if (mockData.alerts.length > 8) mockData.alerts.pop(); // Keep array small
            
            renderAlerts();

            // Notification indicator
            const indicator = document.querySelector('.indicator');
            if (indicator) indicator.style.display = 'block';
        }
    }, 12000); // Check every 12 seconds
}

// NAVIGATION
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = item.getAttribute('data-view');
            switchView(viewId);
        });
    });
}

function switchView(viewId) {
    console.log("Switching view to:", viewId);
    // 1. Update Sidebar
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`.nav-item[data-view="${viewId}"]`).forEach(el => el.classList.add('active'));

    // 2. Switch Section
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    const activeSection = document.getElementById(`view-${viewId}`);
    if (activeSection) {
        activeSection.classList.add('active');
    } else {
        console.warn("View section not found: view-" + viewId);
    }

    // 3. Handle Special Cases (Map Resize / Analytics Refresh)
    if (viewId === 'map') {
        initFullMap();
    }
    if (viewId === 'dashboard') {
        if (window.mainMap && window.mainMap.map) {
            setTimeout(() => {
                window.mainMap.map.invalidateSize();
                window.mainMap.renderMarkers();
            }, 100);
        }
    }
    if (viewId === 'qgis') {
        // Initialize the new Export Map if needed
        if (typeof checkBridgeServer === 'function') checkBridgeServer();
        setTimeout(() => {
            if (!window.exportMap) {
                console.log("Initializing Export Map...");
                window.exportMap = L.map('map-export', { editable: true }).setView([31.5, 5.5], 6);
                L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: 'Google Satellite'
                }).addTo(window.exportMap);
                
                // Add wells as Red Circles (As in logical reference)
                if (window.mockData && window.mockData.rigs) {
                    window.exportWellsLayer = L.layerGroup().addTo(window.exportMap);
                    window.mockData.rigs.forEach(rig => {
                        L.circleMarker([rig.lat, rig.lng], {
                            radius: 5,
                            fillColor: "#ff4757",
                            color: "#fff",
                            weight: 1.5,
                            opacity: 1,
                            fillOpacity: 0.9
                        }).bindTooltip(rig.name, { direction: 'top', offset: [0, -5] })
                          .addTo(window.exportWellsLayer);
                    });
                    
                    const group = L.featureGroup(window.exportWellsLayer.getLayers());
                    if (group.getBounds().isValid()) window.exportMap.fitBounds(group.getBounds(), {padding: [50,50]});
                }
            } else {
                window.exportMap.invalidateSize();
            }
        }, 100);
    }
    if (viewId === 'analytics') {
        if (typeof updateAnalyticsDairas === 'function') updateAnalyticsDairas('all');
        if (typeof refreshAnalytics === 'function') refreshAnalytics();
    }
}

window.exportPolygon = null;

window.startDrawExportArea = function() {
    const map = window.exportMap;
    if (!map) return;

    // Toggle logic: If already drawing/drawn, clear it
    if (window.exportPolygon) {
        map.removeLayer(window.exportPolygon);
        window.exportPolygon = null;
        document.getElementById('drawStatus').style.display = 'none';
        document.querySelector('#btnDrawArea span').innerText = "Draw Export Area / تحديد المنطقة";
        document.getElementById('btnDrawArea').style.background = 'rgba(255, 255, 255, 0.1)';
        document.getElementById('btnDrawArea').style.borderColor = 'rgba(255, 255, 255, 0.2)';
        
        // Cleanup UI cues if any
        const mapExport = document.getElementById('map-export');
        if(mapExport) mapExport.style.outline = "";
        const guide = document.getElementById('drawGuideOverlay');
        if(guide) guide.remove();
        if(window.drawToast) { try { document.body.removeChild(window.drawToast); } catch(e){} window.drawToast = null; }
        
        return; 
    }

    const btn = document.getElementById('btnDrawArea');
    btn.innerHTML = '<i class="fa-solid fa-pencil fa-beat"></i> Click points... (Double-click to finish)';
    btn.style.background = 'rgba(255, 193, 7, 0.2)';

    // Add visual cue to the map container itself
    const mapExport = document.getElementById('map-export');
    if (mapExport) {
        mapExport.style.outline = "6px solid var(--accent-warning)";
        mapExport.style.outlineOffset = "-10px";
        mapExport.style.cursor = "crosshair"; // Change cursor to crosshair
        
        const guide = document.createElement('div');
        guide.id = "drawGuideOverlay";
        guide.style.cssText = "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,184,148,0.9); color:#fff; padding:20px 40px; border-radius:12px; z-index:2000; border:2px solid #fff; font-weight:bold; pointer-events:none; box-shadow:0 0 50px rgba(0,0,0,0.8); text-align:center; animation: pulse 1.5s infinite;";
        guide.innerHTML = '<i class="fa-solid fa-pencil" style="font-size:2rem; display:block; margin-bottom:10px;"></i> DRAW STUDY AREA HERE <br> (Inside this Map) <br> ارسم منطقة الدراسة هـنـا <br> <small>(انقر لبدء الرسم)</small>';
        mapExport.appendChild(guide);
    }

    // Clear instruction toast
    if(window.drawToast) { try { document.body.removeChild(window.drawToast); } catch(e){} }
    window.drawToast = document.createElement('div');
    window.drawToast.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:var(--accent-primary); color:#000; padding:10px 20px; border-radius:30px; font-weight:bold; z-index:9999; box-shadow:0 10px 30px rgba(0,0,0,0.5);";
    window.drawToast.innerHTML = '<i class="fa-solid fa-info-circle"></i> 1. Click on Map to add points. 2. Double-click to finish drawing.';
    document.body.appendChild(window.drawToast);

    // Professional Polygon Drawing using Leaflet.Editable
    if (map.editTools) {
        window.exportPolygon = map.editTools.startPolygon();
        map.once('editable:drawing:commit', () => {
            btn.innerHTML = '<i class="fa-solid fa-trash"></i> Clear Area / مسح التحديد';
            btn.style.background = 'rgba(255, 0, 0, 0.2)';
            document.getElementById('drawStatus').style.display = 'block';
            if(window.drawToast) { try { document.body.removeChild(window.drawToast); } catch(e){} window.drawToast = null; }
            if(mapExport) {
                mapExport.style.outline = "";
                const guide = document.getElementById('drawGuideOverlay');
                if(guide) mapExport.removeChild(guide);
            }

            // NEW: Show "Next Step" Prompt & Preview Contours
            showToast('<b>Next Step:</b> Generating logical preview... <br> <b> الخطوة التالية:</b> جاري توليد معاينة منطقية...', 'info');
            
            if (typeof updateExportMapPreview === 'function') updateExportMapPreview();
            
            // Highlight the export cards briefly
            document.querySelectorAll('.export-card').forEach(card => {
                card.style.animation = "pulse 1s 3";
                card.style.border = "2px solid var(--accent-primary)";
            });
        });
    } else {
        // Fallback for demo: Rectangle with bounds
        console.warn("Leaflet.Editable not active, falling back to simple bounds");
        const onMapClick = (e) => {
             // ... existing simple bounds logic ...
        };
    }
};

window.updateExportMapPreview = function() {
    if (!window.exportMap || !window.exportPolygon) return;
    
    // Clear old contours preview
    if (window.exportContoursPreview) {
        window.exportMap.removeLayer(window.exportContoursPreview);
    }

    try {
        const bounds = window.exportPolygon.getBounds();
        const contoursJson = generateMockContours(bounds, 15);
        
        window.exportContoursPreview = L.geoJSON(contoursJson, {
            style: (feature) => {
                return {
                    color: "#f39c12", // Gold
                    weight: 2,
                    opacity: 0.9,
                    dashArray: '4, 4'
                };
            },
            onEachFeature: (f, layer) => {
                layer.bindTooltip(`Level: ${f.properties.piezo}m`, { sticky: true });
            }
        }).addTo(window.exportMap);
        
        console.log("Live logical preview updated with improved fidelity.");
    } catch (e) {
        console.warn("Live preview failed:", e);
    }
};

window.toggleGeologicalOverlay = function() {
    if (!window.exportMap) return;
    
    if (window.geologicalOverlay) {
        window.exportMap.removeLayer(window.geologicalOverlay);
        window.geologicalOverlay = null;
        showToast("Geological Overlay Removed", "info");
    } else {
        const imageUrl = 'assets/geological_map.png';
        // Precise Georeferenced Bounds for Batna Area (Study Area)
        const imageBounds = [[35.81, 5.92], [35.93, 6.08]]; 
        window.geologicalOverlay = L.imageOverlay(imageUrl, imageBounds, { 
            opacity: 0.8,
            interactive: true
        }).addTo(window.exportMap);
        
        window.exportMap.fitBounds(imageBounds);
        showToast("Professional Geological Context Loaded", "success");
    }
};

window.restoreGeoreference = function() {
    if (!window.exportMap) return;
    const studyBounds = [[35.81, 5.92], [35.93, 6.08]];
    window.exportMap.flyToBounds(studyBounds, { padding: [20, 20], duration: 1.5 });
    showToast("View Restored to Georeferenced Area", "info");
};

// --- IMPROVED PIEZOMETRIC CONTOUR GENERATOR (SMOOTH & LOGICAL) ---
function generateMockContours(bounds, numLines = 10) {
    const minLat = bounds.getSouth();
    const maxLat = bounds.getNorth();
    const minLng = bounds.getWest();
    const maxLng = bounds.getEast();
    
    // Directional flow: NW to SE (Logical Batna Regional Flow)
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    const calculateElevation = (lat, lng) => {
        const slope = (lat - minLat) * 80 + (lng - minLng) * 40;
        const distToCenter = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2));
        const cone = Math.exp(-distToCenter * 40) * -35; 
        return Math.round(320 + slope + cone);
    };

    // COARSE GRID FOR SMOOTHNESS (Avoids "black mesh" bug)
    const points = [];
    const gridSize = 8; // 8x8 sampling is enough for smooth contours
    for (let x = 0; x <= gridSize; x++) {
        for (let y = 0; y <= gridSize; y++) {
            const lat = minLat + (maxLat - minLat) * (y / gridSize);
            const lng = minLng + (maxLng - minLng) * (x / gridSize);
            points.push(turf.point([lng, lat], { piezo: calculateElevation(lat, lng) }));
        }
    }
    
    // Interpolate with COARSE resolution (0.015 degrees)
    const grid = turf.interpolate(turf.featureCollection(points), 0.015, {
        gridType: 'point', property: 'piezo', units: 'degrees', bbox: [minLng, minLat, maxLng, maxLat]
    });

    const values = points.map(p => p.properties.piezo);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const breaks = [];
    const interval = 5; // Logical 5m intervals
    for (let i = Math.floor(minVal/interval)*interval; i <= Math.ceil(maxVal/interval)*interval; i += interval) {
        breaks.push(i);
    }

    const isolines = turf.isolines(grid, breaks, {zProperty: 'piezo'});
    return isolines;
}

// Global exposure
 window.switchView = switchView;
 
 window.checkBridgeServer = function() {
    fetch('http://localhost:3000/api/layers')
        .then(res => {
            const status = document.getElementById('bridgeStatus');
            if (status) {
                status.innerHTML = '<span style="color: #00ff88;"><i class="fa-solid fa-link"></i> BRIDGE ACTIVE</span>';
                status.style.animation = "pulse 2s infinite";
            }
        })
        .catch(e => {
            const status = document.getElementById('bridgeStatus');
            if (status) {
                status.innerHTML = '<span style="color: #ff4757;"><i class="fa-solid fa-link-slash"></i> SERVER OFFLINE</span>';
                status.style.animation = "none";
            }
        });
};

window.launchQGIS = function(btn) {
    console.log("🚀 Power-Launching Innovative Hub...");
    
    const card = document.querySelector('.qgis-launch-card');
    if (card) {
        card.style.borderColor = '#2ed573';
        card.style.boxShadow = '0 0 50px rgba(46, 213, 115, 0.4)';
        card.style.transform = 'scale(0.98)';
        
        const textElement = card.querySelector('p');
        const originalStatus = textElement.innerHTML;
        textElement.innerHTML = '<i class="fa-solid fa-satellite-dish fa-beat"></i> HUB CONNECTING...';
        textElement.style.color = '#2ed573';

        setTimeout(() => {
            card.style.borderColor = '#00d4ff';
            card.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.15)';
            card.style.transform = '';
            textElement.innerHTML = originalStatus;
            textElement.style.color = '';
        }, 6000);
    }

    // METHOD A: Direct Protocol (Innovative Way)
    window.location.href = 'qgis-bridge://open';

    // METHOD B: Server Fallback (Background)
    fetch('http://localhost:3000/api/launch').catch(() => {
        console.warn("Silent bridge server not active. Using direct protocol.");
    });
};

// Clean up old bridge logic
window.showBridgeDiagnostic = null;
window.checkBridgeServer = null;

window.exportToGIS = function (type, btn) {
    console.log("Generating GIS Data: " + type);
    const originalText = btn ? btn.innerHTML : 'EXPORT';

    // 1. Get User Selection
    const selectedWilaya = document.getElementById('gisWilaya')?.value || 'all';
    const selectedDaira = document.getElementById('gisDaira')?.value || 'all';
    
    // 2. Filter Data
    let filteredWells = window.mockData.rigs;
    if (selectedWilaya !== 'all') {
        filteredWells = filteredWells.filter(w => w.state === selectedWilaya);
    }
    if (selectedDaira !== 'all') {
        filteredWells = filteredWells.filter(w => w.district === selectedDaira);
    }

    // 3. Spatial Filtering (Custom Area)
    if (window.exportPolygon) {
        const polyGeoJSON = window.exportPolygon.toGeoJSON();
        filteredWells = filteredWells.filter(w => {
            const pt = turf.point([w.lng, w.lat]);
            return turf.booleanPointInPolygon(pt, polyGeoJSON);
        });
        console.log("Filtered by custom polygon. Remaining wells: " + filteredWells.length);
    }

    if (filteredWells.length === 0) {
        alert("⚠️ No wells found in the selected area/region. Please expand your selection.");
        return;
    }
    
    // 3. Simple UI Feedback
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GENERATING...';
    btn.style.background = 'linear-gradient(90deg, #445, #556)';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = ''; 
        
        // 4. Generate GeoJSON or Contours
        let geojson;
        
        if (type === 'piezo' && typeof turf !== 'undefined') {
            try {
                // Prepare points for Turf
                const points = turf.featureCollection(
                    filteredWells.map(w => turf.point([w.lng, w.lat], { 
                        piezo: w.hydraulics ? w.hydraulics.piezometricLevel : 0 
                    }))
                );

                // Determine Grid BBox
                let bbox;
                if (window.exportBounds) {
                    bbox = [
                        window.exportBounds.getWest(), 
                        window.exportBounds.getSouth(), 
                        window.exportBounds.getEast(), 
                        window.exportBounds.getNorth()
                    ];
                } else if (window.exportPolygon) {
                    const polyBounds = window.exportPolygon.getBounds();
                    bbox = [
                        polyBounds.getWest(), 
                        polyBounds.getSouth(), 
                        polyBounds.getEast(), 
                        polyBounds.getNorth()
                    ];
                } else {
                    // Auto-calculated from points + buffer
                    bbox = turf.bbox(points);
                    bbox = [bbox[0]-0.05, bbox[1]-0.05, bbox[2]+0.05, bbox[3]+0.05];
                }
                
                // Interpolate (IDW)
                const grid = turf.interpolate(points, 0.005, {
                    gridType: 'point', 
                    property: 'piezo',
                    units: 'degrees',
                    weight: 3,
                    bbox: bbox // Pass explicit bbox
                });

                // Generate Isolines with logical intervals
                const values = filteredWells.map(w => w.hydraulics ? w.hydraulics.piezometricLevel : 0);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const breaks = [];
                const interval = 5; // Logical 5m intervals
                const startBreak = Math.floor(min / interval) * interval;
                const endBreak = Math.ceil(max / interval) * interval;
                
                for (let i = startBreak; i <= endBreak; i += interval) {
                    breaks.push(i);
                }

                const isolines = turf.isolines(grid, breaks, {zProperty: 'piezo'});
                
                // Add properties & Style
                isolines.features.forEach(f => {
                    // Add smoother styling properties for aesthetics
                    f.properties.stroke = "#00d4ff";
                    f.properties["stroke-width"] = 2;
                    f.properties["stroke-opacity"] = 0.8;
                    f.properties.level = f.properties.piezo;
                });

                if (!isolines.features || isolines.features.length === 0) {
                     throw new Error("No isolines generated (data range too small or grid failed)");
                }

                geojson = isolines;
                geojson.name = `GeoWell_Contours_${selectedDaira}`;
                
            } catch (err) {
                console.error("Contour generation failed:", err);
                alert("⚠️ Error generating contours: " + err.message + "\n\nExporting data points instead.");
                // Fallback to points
                geojson = {
                    "type": "FeatureCollection",
                    "features": filteredWells.map(well => ({
                        "type": "Feature",
                        "properties": { id: well.id, piezo: well.hydraulics?.piezometricLevel },
                        "geometry": { "type": "Point", "coordinates": [well.lng, well.lat] }
                    }))
                };
            }
        } else {
            // Standard Point Export
            geojson = {
                "type": "FeatureCollection",
                "name": `GeoWell_${type}_Export`,
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": filteredWells.map(well => ({
                    "type": "Feature",
                    "properties": {
                        "id": well.id,
                        "name": well.name,
                        "state": well.state,
                        "district": well.district,
                        "elevation": Math.floor(Math.random() * 100) + 500,
                        "static_lvl": well.hydraulics ? well.hydraulics.staticLevel : null,
                        "piezo_lvl": well.hydraulics ? well.hydraulics.piezometricLevel : null,
                        "cond": well.physical ? well.physical.conductivity : null
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [well.lng, well.lat]
                    }
                }))
            };
        }

        // 5. Download Trigger
        const dataStr = JSON.stringify(geojson, null, 2);
        const blob = new Blob([dataStr], { type: 'application/geo+json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `geowell_${selectedDaira}_${type}.geojson`; 
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);

        // 7. Add to History
        addToExportHistory(anchor.download, geojson.features.length, dataStr);

        // 8. Success Message
        const toast = document.createElement('div');
        toast.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: #2ed573; color: white; padding: 1rem 2rem; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideIn 0.5s ease-out forwards;";
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Exported ${filteredWells.length} wells to GeoJSON`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
        
    }, 1000);
};

// Helper: Add to History UI
function addToExportHistory(filename, count, dataStr) {
    const section = document.getElementById('exportHistorySection');
    const list = document.getElementById('exportHistoryList');
    if (!section || !list) return;

    section.style.display = 'block';

    const div = document.createElement('div');
    div.className = 'history-item';
    const date = new Date().toLocaleTimeString();
    
    // Blob reconstruction for re-download
    const blob = new Blob([dataStr], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);

    div.innerHTML = `
        <div class="history-info">
            <span class="history-name">${filename}</span>
            <span class="history-meta">${count} wells • ${date}</span>
        </div>
        <a href="${url}" download="${filename}" class="btn-redownload" title="Download Again">
            <i class="fa-solid fa-download"></i>
        </a>
    `;
    
    list.prepend(div);
}

window.populateGISFilters = function() {
    const wilayaSelect = document.getElementById('gisWilaya');
    if (!wilayaSelect) return;
    
    // Clear existing (except first)
    while (wilayaSelect.options.length > 1) {
        wilayaSelect.remove(1);
    }

    if (window.geographicData && window.geographicData.states && window.geographicData.states.Algeria) {
        window.geographicData.states.Algeria.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya;
            option.textContent = wilaya; 
            wilayaSelect.appendChild(option);
        });
    }
};

window.updateGISDairas = function (wilaya) {
    const dairaSelect = document.getElementById('gisDaira');
    if (!dairaSelect) return;

    // Clear existing
    dairaSelect.innerHTML = '<option value="all">All Districts</option>';

    if (wilaya !== 'all' && window.geographicData && window.geographicData.districts && window.geographicData.districts[wilaya]) {
        window.geographicData.districts[wilaya].forEach(daira => {
            const option = document.createElement('option');
            option.value = daira;
            option.textContent = daira;
            dairaSelect.appendChild(option);
        });
    }
};

function initFullMap() {
    // Leaflet Resize - required when container becomes visible
    if (window.fullMap && window.fullMap.map) {
        setTimeout(() => window.fullMap.map.invalidateSize(), 50);
        setTimeout(() => window.fullMap.map.invalidateSize(), 200);
    }
}

// Auto-run on load
document.addEventListener('DOMContentLoaded', () => {
   if(typeof window.populateGISFilters === 'function') window.populateGISFilters();
});

window.switchView = switchView;

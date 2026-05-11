// Wells Management & Enhanced Profile Logic (Geo well)

function initWellsManager() {
    renderWellsTable();
    populateSelectionLists();

    // Form Submit Handlers
    document.getElementById('wellForm').addEventListener('submit', handleWellSubmit);
    document.getElementById('logForm').addEventListener('submit', handleLogSubmit);
}

// --- UI HELPERS: ACCORDION & DROPDOWNS ---

function toggleFormSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(s => {
        if (s.id === `section-${sectionId}`) {
            s.classList.toggle('active');
        } else {
            // Optional: Close others (accordion style)
            // s.classList.remove('active');
        }
    });
}

function populateSelectionLists() {
    // Populate Countries
    const countrySel = document.getElementById('wellCountry');
    if (countrySel) {
        countrySel.innerHTML = '<option value="">Select Country</option>';
        selectionData.countries.forEach(c => countrySel.innerHTML += `<option value="${c}">${c}</option>`);
    }

    // Populate Well Types, Pump Types, Usages, Statuses
    fillSelect('wellType', selectionData.wellTypes);
    fillSelect('pumpType', selectionData.pumpTypes);
    fillSelect('wellUsage', selectionData.usages);

    const statusSel = document.getElementById('wellStatus');
    if (statusSel) {
        statusSel.innerHTML = '';
        selectionData.statuses.forEach(s => statusSel.innerHTML += `<option value="${s.id}">${s.label}</option>`);
    }

    // Populate Log Date Dropdowns
    fillSelect('logYear', selectionData.years);
    fillSelect('logMonth', selectionData.months);
    fillSelect('logDay', selectionData.days);

    // Initial Geography
    updateStates("");

    // Populate Chemical Grid Inputs
    const catGrid = document.getElementById('cation-inputs-grid');
    const aniGrid = document.getElementById('anion-inputs-grid');
    if (catGrid && aniGrid) {
        catGrid.innerHTML = ''; aniGrid.innerHTML = '';
        selectionData.chemicals.cations.forEach(ion => {
            catGrid.innerHTML += `
                <div class="ion-input-item">
                    <span>${ion}</span>
                    <input type="number" step="0.01" class="cation-input" data-ion="${ion}" placeholder="0.00">
                </div>`;
        });
        selectionData.chemicals.anions.forEach(ion => {
            aniGrid.innerHTML += `
                <div class="ion-input-item">
                    <span>${ion}</span>
                    <input type="number" step="0.01" class="anion-input" data-ion="${ion}" placeholder="0.00">
                </div>`;
        });
    }
}

function fillSelect(id, list) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = list[0].id ? '' : `<option value="">Choose...</option>`;
    list.forEach(item => {
        const val = item.id || item;
        const label = item.label || item;
        el.innerHTML += `<option value="${val}">${label}</option>`;
    });
}

// --- GEOGRAPHIC SELECTION LOGIC ---
function updateStates(country) {
    const stateSelect = document.getElementById('wellState');
    const districtSelect = document.getElementById('wellDistrict');
    if (!stateSelect) return;

    stateSelect.innerHTML = '<option value="">Select State</option>';
    districtSelect.innerHTML = '<option value="">Select District</option>';

    if (country && geographicData.states[country]) {
        geographicData.states[country].forEach(state => {
            stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
        });
    }
}

function updateDistricts(state) {
    const districtSelect = document.getElementById('wellDistrict');
    if (!districtSelect) return;
    districtSelect.innerHTML = '<option value="">Select District</option>';

    if (state && geographicData.districts[state]) {
        geographicData.districts[state].forEach(district => {
            districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    }
}

// --- TABLE RENDERING ---
function renderWellsTable(searchTerm = "") {
    const tbody = document.getElementById('wellsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const term = searchTerm.toLowerCase();
    const filteredWells = mockData.rigs.filter(well => {
        return (
            well.id.toLowerCase().includes(term) ||
            well.name.toLowerCase().includes(term) ||
            (well.state && well.state.toLowerCase().includes(term)) ||
            (well.district && well.district.toLowerCase().includes(term))
        );
    });
    filteredWells.forEach(well => {
        const status = (well.status || 'operational').toLowerCase();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="id-badge">${well.id}</span></td>
            <td><strong>${well.name}</strong></td>
            <td>${well.country || 'Algeria'}</td>
            <td>${well.state || 'N/A'}</td>
            <td>${well.district || 'N/A'}</td>
            <td>${well.location || 'N/A'}</td>
            <td><span class="status-badge ${status}">${status.toUpperCase()}</span></td>
            <td>${well.production ? well.production.toLocaleString() : 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn sm" onclick="viewWellDetails('${well.id}')" title="View Profile"><i class="fa-solid fa-eye"></i></button>
                    <button class="icon-btn sm" onclick="editWell('${well.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn sm danger" onclick="deleteWell('${well.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- MODAL ACTIONS ---
function openWellModal(mode = 'create', wellId = null) {
    const modal = document.getElementById('wellModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('wellForm');
    modal.classList.add('active');

    // Reset sections
    document.querySelectorAll('.form-section').forEach((s, idx) => {
        if (idx === 0) s.classList.add('active');
        else s.classList.remove('active');
    });

    if (mode === 'create') {
        title.innerText = "Add New Well (Geo well)";
        form.reset();
        document.getElementById('wellId').value = '';
        document.getElementById('wellDisplayId').value = "R-" + Math.floor(100 + Math.random() * 900);
        updateStates("");
        // Clear Chem Inputs
        document.querySelectorAll('.cation-input, .anion-input').forEach(i => i.value = '');
    } else {
        title.innerText = "Edit Well: " + wellId;
        const well = mockData.rigs.find(w => w.id === wellId);
        if (well) {
            document.getElementById('wellId').value = well.id;
            document.getElementById('wellDisplayId').value = well.id;
            document.getElementById('wellName').value = well.name;
            document.getElementById('wellCountry').value = well.country || 'Algeria';

            updateStates(well.country || 'Algeria');
            document.getElementById('wellState').value = well.state || '';
            updateDistricts(well.state || '');
            document.getElementById('wellDistrict').value = well.district || '';

            document.getElementById('wellLocation').value = well.location || '';
            document.getElementById('wellLat').value = well.lat || '';
            document.getElementById('wellLng').value = well.lng || '';

            document.getElementById('wellType').value = well.wellType || '';
            document.getElementById('pumpType').value = well.pumpType || '';
            document.getElementById('wellUsage').value = well.usage || '';
            document.getElementById('wellDepth').value = well.depth || '';
            document.getElementById('wellProduction').value = well.production || 0;
            document.getElementById('wellStatus').value = well.status || 'operational';

            if (well.hydraulics) {
                document.getElementById('staticLevel').value = well.hydraulics.staticLevel || '';
                document.getElementById('dynamicLevel').value = well.hydraulics.dynamicLevel || '';
                document.getElementById('piezoLevel').value = well.hydraulics.piezometricLevel || '';
                document.getElementById('discharge').value = well.hydraulics.discharge || '';
                document.getElementById('distance').value = well.hydraulics.distance || '';
            }
            if (well.physical) {
                document.getElementById('qualityTemp').value = well.physical.temp || '';
                document.getElementById('qualityPh').value = well.physical.ph || '';
                document.getElementById('qualityTds').value = well.physical.tds || '';
                document.getElementById('qualityCond').value = well.physical.conductivity || '';
            }
            // Fill Chem Grids
            if (well.chemical) {
                document.querySelectorAll('.cation-input').forEach(input => {
                    const ion = input.getAttribute('data-ion');
                    input.value = well.chemical.cations[ion] || '';
                });
                document.querySelectorAll('.anion-input').forEach(input => {
                    const ion = input.getAttribute('data-ion');
                    input.value = well.chemical.anions[ion] || '';
                });
            }
        }
    }
}

function handleWellSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('wellId').value;
    const wellIdToSave = document.getElementById('wellId').value || document.getElementById('wellDisplayId').value;

    // Collect Chem Data
    const cations = {};
    document.querySelectorAll('.cation-input').forEach(i => {
        if (i.value) cations[i.getAttribute('data-ion')] = parseFloat(i.value);
    });
    const anions = {};
    document.querySelectorAll('.anion-input').forEach(i => {
        if (i.value) anions[i.getAttribute('data-ion')] = parseFloat(i.value);
    });

    const wellData = {
        id: wellIdToSave,
        name: document.getElementById('wellName').value,
        country: document.getElementById('wellCountry').value,
        state: document.getElementById('wellState').value,
        district: document.getElementById('wellDistrict').value,
        location: document.getElementById('wellLocation').value,
        lat: parseFloat(document.getElementById('wellLat').value),
        lng: parseFloat(document.getElementById('wellLng').value),
        wellType: document.getElementById('wellType').value,
        pumpType: document.getElementById('pumpType').value,
        usage: document.getElementById('wellUsage').value,
        depth: parseInt(document.getElementById('wellDepth').value),
        production: parseInt(document.getElementById('wellProduction').value),
        status: document.getElementById('wellStatus').value,
        hydraulics: {
            staticLevel: parseFloat(document.getElementById('staticLevel').value),
            dynamicLevel: parseFloat(document.getElementById('dynamicLevel').value),
            piezometricLevel: parseFloat(document.getElementById('piezoLevel').value),
            discharge: parseFloat(document.getElementById('discharge').value),
            distance: parseFloat(document.getElementById('distance').value)
        },
        physical: {
            temp: parseFloat(document.getElementById('qualityTemp').value),
            ph: parseFloat(document.getElementById('qualityPh').value),
            tds: parseFloat(document.getElementById('qualityTds').value),
            conductivity: parseFloat(document.getElementById('qualityCond').value)
        },
        chemical: { cations, anions }
    };

    if (id) {
        const idx = mockData.rigs.findIndex(w => w.id === id);
        if (idx > -1) mockData.rigs[idx] = { ...mockData.rigs[idx], ...wellData };
    } else {
        mockData.rigs.push({ ...wellData, logs: [] });
        mockData.overview.totalWells++;
    }

    closeWellModal();
    renderWellsTable();
    if (window.mainMap) window.mainMap.renderMarkers();
    if (window.fullMap) window.fullMap.renderMarkers();
    saveToLocalStorage();
    if (typeof showToast === 'function') showToast(
        id ? `✅ Well "${wellData.name}" updated successfully.` : `✅ New well "${wellData.name}" added!`,
        'success'
    );
}

function editWell(id) { openWellModal('edit', id); }

function deleteWell(id) {
    if (confirm(`Are you sure you want to delete Well ${id}?`)) {
        const well = mockData.rigs.find(w => w.id === id);
        const name = well ? well.name : id;
        mockData.rigs = mockData.rigs.filter(w => w.id !== id);
        mockData.overview.totalWells--;
        renderWellsTable();
        if (window.mainMap) window.mainMap.renderMarkers();
        if (window.fullMap) window.fullMap.renderMarkers();
        saveToLocalStorage();
        if (typeof showToast === 'function') showToast(`🗑️ Well "${name}" deleted.`, 'warning');
    }
}

// --- WELL PROFILE (DETAILS) ---
let miniMapInstance = null;

function viewWellDetails(id) {
    const well = mockData.rigs.find(w => w.id === id);
    if (!well) {
        console.error("Well not found:", id);
        return;
    }

    // Switch to profile view
    if (typeof switchView === 'function') switchView('well-details');
    
    console.log("Populating well details for ID:", id);

    // Populate profile fields
    const detailIds = {
        'detailWellName': well.name,
        'detailWellId': well.id,
        'detailWellCountry': well.country || 'Algeria',
        'detailWellState': well.state || 'N/A',
        'detailWellDistrict': well.district || 'N/A',
        'detailWellType': well.wellType || 'N/A'
    };

    for (const [id, value] of Object.entries(detailIds)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    // Handle multiple image placeholders
    const images = document.querySelectorAll('#detailWellImage, #detailWellImageLarge');
    images.forEach(img => {
        img.src = well.image || "https://dummyimage.com/600x400/1a1a1a/00d4ff&text=Well+Site";
    });

    const statusBadge = document.getElementById('detailWellStatus');
    if (statusBadge) {
        statusBadge.className = `status-badge ${well.status}`;
        statusBadge.innerText = well.status.toUpperCase();
    }

    // Technical & Hydraulic Stats
    if (well.hydraulics) {
        if (document.getElementById('valStatic')) document.getElementById('valStatic').innerText = well.hydraulics.staticLevel || '0';
        if (document.getElementById('valDynamic')) document.getElementById('valDynamic').innerText = well.hydraulics.dynamicLevel || '0';
        if (document.getElementById('valPiezo')) document.getElementById('valPiezo').innerText = well.hydraulics.piezometricLevel || '0';
        if (document.getElementById('valDischarge')) document.getElementById('valDischarge').innerText = well.hydraulics.discharge || '0';
        if (document.getElementById('valDist')) document.getElementById('valDist').innerText = well.hydraulics.distance || '0';
    }

    if (document.getElementById('valDepthDetail')) {
        document.getElementById('valDepthDetail').innerText = well.depth || (well.hydraulics ? well.hydraulics.wellDepth : '0');
    }
    if (document.getElementById('valPump')) document.getElementById('valPump').innerText = well.pumpType || 'N/A';
    if (document.getElementById('valProd')) document.getElementById('valProd').innerText = well.production || '0';
    if (document.getElementById('valCoords')) document.getElementById('valCoords').innerText = `${well.lat.toFixed(4)}, ${well.lng.toFixed(4)}`;

    // Physical
    if (well.physical) {
        if (document.getElementById('valTempDetail')) document.getElementById('valTempDetail').innerText = well.physical.temp || '0';
        if (document.getElementById('valPHDetail')) document.getElementById('valPHDetail').innerText = well.physical.ph || '0';
        if (document.getElementById('valTDS')) document.getElementById('valTDS').innerText = well.physical.tds || '0';
        if (document.getElementById('valCond')) document.getElementById('valCond').innerText = well.physical.conductivity || '0';
    }

    // Ions & Logs
    renderIons(well);
    renderLogsTable(well);

    // Switch View first, then render charts after DOM is ready
    if (typeof switchView === 'function') {
        switchView('well-details');
    } else if (window.switchView) {
        window.switchView('well-details');
    }


    // Initialize Mini Map
    setTimeout(() => initMiniMap(well.lat, well.lng), 100);
}

// Ensure global accessibility
window.viewWellDetails = viewWellDetails;

function initMiniMap(lat, lng) {
    const mapEl = document.getElementById('miniMap');
    if (!mapEl || !lat || !lng) return;

    // Remove placeholder text
    mapEl.innerHTML = '';

    // Destroy previous instance if exists
    if (miniMapInstance) {
        miniMapInstance.remove();
        miniMapInstance = null;
    }

    try {
        miniMapInstance = L.map('miniMap', {
            center: [lat, lng],
            zoom: 13,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            opacity: 0.8
        }).addTo(miniMapInstance);

        // Custom marker icon
        const wellIcon = L.divIcon({
            className: '',
            html: `<div style="
                width: 18px; height: 18px;
                background: #00d4ff;
                border: 3px solid #fff;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(0,212,255,0.8);
            "></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });

        L.marker([lat, lng], { icon: wellIcon })
            .addTo(miniMapInstance)
            .bindPopup(`<b>Well Location</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`)
            .openPopup();

        // Force size recalculation after DOM is ready
        setTimeout(() => miniMapInstance.invalidateSize(), 200);
    } catch (e) {
        console.error('Mini-map init error:', e);
        mapEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;flex-direction:column;gap:8px;">
            <i class="fa-solid fa-map-location-dot" style="font-size:2rem;color:#00d4ff;"></i>
            <span>${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
        </div>`;
    }
}

function renderIons(well) {
    const catList = document.getElementById('cationsList');
    const aniList = document.getElementById('anionsList');
    catList.innerHTML = ''; aniList.innerHTML = '';

    if (well.chemical) {
        if (well.chemical.cations) {
            Object.entries(well.chemical.cations).forEach(([k, v]) => {
                catList.innerHTML += `<div class="ion-item"><strong>${k}:</strong> ${v} mg/L</div>`;
            });
        }
        if (well.chemical.anions) {
            Object.entries(well.chemical.anions).forEach(([k, v]) => {
                aniList.innerHTML += `<div class="ion-item"><strong>${k}:</strong> ${v} mg/L</div>`;
            });
        }
    }
    if (catList.innerHTML === '') catList.innerHTML = '<span style="color:#666">No cation data</span>';
    if (aniList.innerHTML === '') aniList.innerHTML = '<span style="color:#666">No anion data</span>';
}

function renderLogsTable(well) {
    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = '';

    if (well.logs && well.logs.length > 0) {
        const sorted = [...well.logs].sort((a, b) => b.year - a.year || b.month - a.month || b.day - a.day);
        sorted.forEach((log, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${log.year}-${log.month}-${log.day}</td>
                <td style="color: var(--accent-primary); font-weight: bold;">${log.staticLevel} m</td>
                <td>${log.dynamicLevel} m</td>
                <td><span class="status-badge operational" style="background:#444;">${log.ph}</span></td>
                <td>${log.tds || 'N/A'}</td>
                <td>${log.cond || 'N/A'}</td>
                <td>${log.temp || 'N/A'} °C</td>
                <td>${log.piezo || 'N/A'} m</td>
                <td style="color: var(--accent-success);">${log.discharge} m3/h</td>
                <td>
                    <button class="icon-btn sm danger" onclick="deleteLog('${well.id}', ${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 2rem; color: #666;">No historical measurements found.</td></tr>';
    }
}

// --- LOG HANDLERS ---
function openLogModal() {
    const wellId = document.getElementById('detailWellId').innerText;
    document.getElementById('logWellId').value = wellId;
    document.getElementById('logForm').reset();

    // Set default date (current)
    const now = new Date();
    document.getElementById('logYear').value = now.getFullYear();
    document.getElementById('logMonth').value = now.getMonth() + 1;
    document.getElementById('logDay').value = now.getDate();

    document.getElementById('logModal').classList.add('active');
}

function closeLogModal() { document.getElementById('logModal').classList.remove('active'); }

function handleLogSubmit(e) {
    e.preventDefault();
    const wellId = document.getElementById('logWellId').value;

    const logEntry = {
        year: parseInt(document.getElementById('logYear').value),
        month: parseInt(document.getElementById('logMonth').value),
        day: parseInt(document.getElementById('logDay').value),
        staticLevel: parseFloat(document.getElementById('logStatic').value) || 0,
        dynamicLevel: parseFloat(document.getElementById('logDynamic').value) || 0,
        ph: parseFloat(document.getElementById('logPH').value) || 0,
        temp: parseFloat(document.getElementById('logTemp').value) || 0,
        tds: parseFloat(document.getElementById('logTDS').value) || 0,
        cond: parseFloat(document.getElementById('logCond').value) || 0,
        piezo: parseFloat(document.getElementById('logPiezo').value) || 0,
        discharge: parseFloat(document.getElementById('logDischarge').value) || 0,
        notes: document.getElementById('logNotes').value
    };

    const well = mockData.rigs.find(w => w.id === wellId);
    if (well) {
        if (!well.logs) well.logs = [];
        well.logs.push(logEntry);
        saveToLocalStorage();
        renderLogsTable(well);
        closeLogModal();
        if (typeof showToast === 'function') showToast('📋 Measurement log saved successfully!', 'success');
    }
}

function deleteLog(wellId, index) {
    const well = mockData.rigs.find(w => w.id === wellId);
    if (well && confirm("Delete this measurement?")) {
        well.logs.splice(index, 1);
        saveToLocalStorage();
        renderLogsTable(well);
    }
}

function exportLogsToCSV() {
    const wellId = document.getElementById('detailWellId').innerText;
    const well = mockData.rigs.find(w => w.id === wellId);

    if (!well || !well.logs || well.logs.length === 0) {
        alert("No historical data available to export.");
        return;
    }

    let csv = "WellID,Year,Month,Day,Static_m,Dynamic_m,pH,TDS_mgL,Cond_uS,Temp_C,Piezo_m,Discharge_m3h,Notes\n";
    well.logs.forEach(l => {
        csv += `${well.id},${l.year},${l.month},${l.day},${l.staticLevel},${l.dynamicLevel},${l.ph},${l.tds || 0},${l.cond || 0},${l.temp || 0},${l.piezo || 0},${l.discharge},"${l.notes || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `GeoWell_${well.id}_History.csv`);
    a.click();
}

// Export to window for map/table accessibility
window.viewWellDetails = viewWellDetails;
window.editWell = editWell;
window.deleteWell = deleteWell;
window.openWellModal = openWellModal;
window.openLogModal = openLogModal;
window.handleLogSubmit = handleLogSubmit;
window.exportLogsToCSV = exportLogsToCSV;
window.renderWellsTable = renderWellsTable;

function closeWellDetails() { switchView('wells'); }
function closeWellModal() { document.getElementById('wellModal').classList.remove('active'); }
window.openMeasurementFromMap = function(id) {
    const well = mockData.rigs.find(w => w.id === id);
    if (!well) return;
    
    // Reset form first
    document.getElementById('logForm').reset();

    // Then set the target Well ID
    const hiddenIdField = document.getElementById('logWellId');
    if (hiddenIdField) hiddenIdField.value = id;
    
    // Set default date
    const now = new Date();
    if(document.getElementById('logYear')) document.getElementById('logYear').value = now.getFullYear();
    if(document.getElementById('logMonth')) document.getElementById('logMonth').value = now.getMonth() + 1;
    if(document.getElementById('logDay')) document.getElementById('logDay').value = now.getDate();
    
    document.getElementById('logModal').classList.add('active');
};

// --- PERSISTENCE HELPERS ---
function saveToLocalStorage() {
    localStorage.setItem('geoWell_rigs', JSON.stringify(mockData.rigs));
    console.log("[Storage] Well data saved to localStorage.");
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('geoWell_rigs');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data && Array.isArray(data)) {
                mockData.rigs = data;
                console.log("[Storage] Loaded well data from localStorage.");
            }
        } catch (e) {
            console.error("[Storage] Failed to load data:", e);
        }
    }
}

// Initialize on load
(function initStorage() {
    loadFromLocalStorage();
    // Re-render table in case data changed
    renderWellsTable();
})();

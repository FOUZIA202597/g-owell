/**
 * GeoWell AI Neural Insights Hub
 * Handles Predictive Heatmaps and AI Analysis Logs
 */

let isNeuralActive = false;
let logInterval = null;

window.toggleNeuralHeatmap = function() {
    // RBAC CHECK
    if (typeof checkActionPermission === 'function' && !checkActionPermission('ENGINEER')) return;

    isNeuralActive = !isNeuralActive;
    const btn = document.getElementById('btnNeuralMap');
    const sidebar = document.getElementById('ai-insight-sidebar');
    const mapInstance = window.mainMap || window.fullMap;

    if (isNeuralActive) {
        btn.classList.add('active');
        sidebar.classList.add('active');
        if (mapInstance) mapInstance.toggleHeatmap(true);
        startAILogAnalysis();
        showToast("Neural Analysis Engine Initialized", "info");
    } else {
        btn.classList.remove('active');
        sidebar.classList.remove('active');
        if (mapInstance) mapInstance.toggleHeatmap(false);
        stopAILogAnalysis();
    }
};

function startAILogAnalysis() {
    const feed = document.getElementById('ai-log-feed');
    feed.innerHTML = ''; // Reset

    const logs = [
        "> Syncing with Aquifer Depth Sensors...",
        "> Analyzing Tectonic Fault Permeability...",
        "> Cluster Found: Sector 04 - Biskra South.",
        "> Predicted Flow: 85m³/h (± 5%).",
        "> Recommendation: Vertical Drilling at 145m.",
        "> Scanning Hydro-Thermal Gradient...",
        "> Salinity Match: Low (Potable Range).",
        "> Neural Synthesis Complete. Map Updated."
    ];

    let i = 0;
    logInterval = setInterval(() => {
        if (i < logs.length) {
            const entry = document.createElement('div');
            entry.className = 'ai-log-entry';
            entry.textContent = logs[i];
            feed.appendChild(entry);
            feed.scrollTop = feed.scrollHeight;
            i++;
        } else {
            clearInterval(logInterval);
        }
    }, 1200);
}

function stopAILogAnalysis() {
    if (logInterval) clearInterval(logInterval);
}

window.exportAIReport = function() {
    showToast("Generating Hydro-Analysis Report...", "info");
    setTimeout(() => {
        window.print();
    }, 1000);
};

// Simulation: Auto-trigger insight on specific wells
window.triggerDeepAnalysis = function(wellName) {
    if (!isNeuralActive) window.toggleNeuralHeatmap();
    setTimeout(() => {
        const feed = document.getElementById('ai-log-feed');
        const entry = document.createElement('div');
        entry.className = 'ai-log-entry';
        entry.style.color = '#00d4ff';
        entry.textContent = `> Deep Analysis: ${wellName} matched to Carboniferous Aquifer.`;
        feed.appendChild(entry);
    }, 2000);
};

// ===============================================
// REAL QGIS BRIDGE - Live Data Connection
// ===============================================
// يقرأ البيانات مباشرة من ملف qgis_live_data.js

function loadLiveQGISData() {
    console.log("🔗 Loading QGIS Live Data...");

    // قراءة البيانات من المتغير العام
    const geojson = window.qgisLiveData;

    if (!geojson || !geojson.features) {
        console.warn("⚠️ لا توجد بيانات QGIS. استخدام البيانات التجريبية...");
        if (typeof loadMockGISLayers === 'function') {
            loadMockGISLayers();
        }
        return;
    }

    console.log("✅ Loaded QGIS Live Data:", geojson);

    const layerControl = document.getElementById('layerControl');
    const layerList = document.getElementById('layerList');

    // Global retry counter
    if (typeof window.qgisRetryCount === 'undefined') window.qgisRetryCount = 0;

    if (!layerControl || !layerList) {
        if (window.qgisRetryCount < 10) {
            console.warn(`Controls not ready. Retrying (${window.qgisRetryCount}/10)...`);
            window.qgisRetryCount++;
            setTimeout(() => loadLiveQGISData(), 1000);
        } else {
            console.error("❌ Failed to load QGIS controls after 10 attempts.");
        }
        return;
    }

    if (!window.mainMap && !window.fullMap) {
        if (window.qgisRetryCount < 10) {
            console.warn(`Map not initialized. Retrying (${window.qgisRetryCount}/10)...`);
            window.qgisRetryCount++;
            setTimeout(() => loadLiveQGISData(), 1000);
        } else {
             console.error("❌ Failed to find map instance after 10 attempts.");
        }
        return;
    }
    
    // Reset retry count on successful controls check
    window.qgisRetryCount = 0;


    // تنظيف القائمة
    layerList.innerHTML = '';

    // تجميع البيانات حسب اسم الطبقة من QGIS
    const layersMap = {};

    if (geojson.features && geojson.features.length > 0) {
        layerControl.style.display = 'block';

        // Process in background to prevent UI freeze
        setTimeout(() => {
            try {
                geojson.features.forEach(feature => {
                    const layerName = feature.properties.layer_name || 'QGIS Layer';
                    if (!layersMap[layerName]) {
                        layersMap[layerName] = { type: "FeatureCollection", features: [] };
                    }
                    layersMap[layerName].features.push(feature);
                });

                // Add to map
                const allFeaturesGroup = L.featureGroup();
                const colors = ['#2ed573', '#1e90ff', '#ff6b6b', '#ffa502', '#70a1ff', '#eccc68', '#ff4757'];
                
                Object.keys(layersMap).forEach((name, index) => {
                    const data = layersMap[name];
                    const color = colors[index % colors.length];

                    if (window.mainMap) window.mainMap.addGenericLayer(data, name);
                    if (window.fullMap) window.fullMap.addGenericLayer(data, name);
                    
                    addLayerCheckbox(name, `📍 ${name}`, color, layerList);
                    
                    if (window.mainMap && window.mainMap.genericLayers[name]) {
                        allFeaturesGroup.addLayer(window.mainMap.genericLayers[name]);
                    } else if (window.fullMap && window.fullMap.genericLayers[name]) {
                        allFeaturesGroup.addLayer(window.fullMap.genericLayers[name]);
                    }
                });
                
                showToast(`✅ Loaded ${geojson.features.length} QGIS features`, 'success');
            } catch (err) {
                console.error("Error processing QGIS features:", err);
            }
        }, 100); // 100ms delay to let UI breathe

    } else {
        console.log("⚠️ الملف فارغ. أضف بيانات في QGIS.");
        loadMockGISLayers(); // fallback
    }
}

// دالة مساعدة لإضافة Checkbox
function addLayerCheckbox(layerName, displayName, color, container) {
    const item = document.createElement('div');
    item.innerHTML = `
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #b0d5ce; font-size: 0.85rem;">
            <input type="checkbox" checked onchange="toggleLayer('${layerName}', this.checked)" style="accent-color: ${color};">
            ${displayName}
        </label>
    `;
    container.appendChild(item);
}

// دالة Toast للإشعارات
window.showToast = function(message, type = 'info') {
    const colors = {
        success: '#00b894',
        info: '#0984e3',
        warning: '#fdcb6e',
        error: '#d63031'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; 
        bottom: 80px; 
        right: 20px; 
        background: ${colors[type]}; 
        color: white; 
        padding: 0.8rem 1.2rem; 
        border-radius: 8px; 
        z-index: 9999; 
        font-size: 0.9rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// وظيفة Toggle (global)
window.toggleLayer = function (layerName, isVisible) {
    if (window.mainMap && window.mainMap.toggleGenericLayer) {
        window.mainMap.toggleGenericLayer(layerName, isVisible);
    }
    if (window.fullMap && window.fullMap.map && window.fullMap.toggleGenericLayer) {
        window.fullMap.toggleGenericLayer(layerName, isVisible);
        // Ensure map is visible/resized if a layer is toggled
        window.fullMap.map.invalidateSize();
    }
    console.log(`🔄 Layer "${layerName}" visibility: ${isVisible}`);
};

// AUTO-RELOAD (Innovation Mode)
let lastDataLength = 0;

function startLiveWatch() {
    console.log("👀 Watching for QGIS updates...");
    
    const checkUpdate = () => {
        // Remove old script to help GC
        const oldScript = document.getElementById('qgis-data-script');
        if (oldScript) {
            oldScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'qgis-data-script';
        script.src = `data/qgis_live_data.js?t=${new Date().getTime()}`;
        
        script.onload = () => {
            if (window.qgisLiveData && window.qgisLiveData.features) {
                const newLength = JSON.stringify(window.qgisLiveData).length;
                if (newLength !== lastDataLength) {
                    console.log("✨ Change detected! Updating map...");
                    lastDataLength = newLength;
                    loadLiveQGISData(); 
                    
                    // Show subtle indicator
                    const indicator = document.getElementById('live-indicator');
                    if (!indicator) {
                        const div = document.createElement('div');
                        div.id = 'live-indicator';
                        div.style.cssText = "position:fixed; top:10px; right:10px; background:#2ed573; color:white; padding:5px 10px; border-radius:20px; font-size:12px; z-index:9999; box-shadow:0 0 10px #2ed573;";
                        div.innerHTML = "<i class='fa-solid fa-satellite-dish'></i> Live Sync";
                        document.body.appendChild(div);
                    }
                }
            }
            // Schedule next check ONLY after completion
            setTimeout(checkUpdate, 10000);
        };

        script.onerror = () => {
            console.warn("Error loading QGIS data, retrying...");
            setTimeout(checkUpdate, 5000); // Wait longer on error
        };
        
        document.body.appendChild(script);
    };

    // Start the loop
    setTimeout(checkUpdate, 3000);
}


// Start watching after initial load
// setTimeout(startLiveWatch, 3000); // DISABLED TO PREVENT FREEZE

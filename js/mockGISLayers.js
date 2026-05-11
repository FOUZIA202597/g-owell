// ===============================================
// MOCK GIS LAYERS - للعمل بدون PostgreSQL
// ===============================================
// هذه البيانات الوهمية ستظهر على الخريطة مباشرة
// لإثبات كيفية عمل النظام دون الحاجة لقاعدة بيانات

const mockGISLayers = {
    // طبقة الآبار (Wells)
    wells: {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": 1,
                    "name": "Well F3",
                    "state": "Batna",
                    "district": "Ain Djasser",
                    "status": "operational"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [5.5667, 35.5833]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 2,
                    "name": "Well F7",
                    "state": "Batna",
                    "district": "Batna",
                    "status": "operational"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [6.1743, 35.5559]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 3,
                    "name": "Well A2",
                    "state": "Batna",
                    "district": "Barika",
                    "status": "maintenance"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [5.3686, 35.3842]
                }
            }
        ]
    },

    // طبقة الأنابيب (Pipelines)
    pipelines: {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": 1,
                    "name": "Main Pipeline - North",
                    "status": "Active"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [5.5667, 35.5833],
                        [5.7000, 35.6500],
                        [5.9000, 35.7000]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 2,
                    "name": "Secondary Pipeline - East",
                    "status": "Active"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [6.1743, 35.5559],
                        [6.3000, 35.6000],
                        [6.4500, 35.6500]
                    ]
                }
            }
        ]
    },

    // طبقة المناطق المحظورة (Restricted Zones)
    restricted_zones: {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": 1,
                    "zone_type": "Protected Area",
                    "description": "منطقة محمية - حديقة طبيعية"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [5.4000, 35.4000],
                        [5.4000, 35.5000],
                        [5.5000, 35.5000],
                        [5.5000, 35.4000],
                        [5.4000, 35.4000]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 2,
                    "zone_type": "Military Zone",
                    "description": "منطقة عسكرية - ممنوع الحفر"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [6.0000, 35.3000],
                        [6.0000, 35.4500],
                        [6.2000, 35.4500],
                        [6.2000, 35.3000],
                        [6.0000, 35.3000]
                    ]]
                }
            }
        ]
    }
};

// دالة تحميل الطبقات تلقائياً (بدون الحاجة للسيرفر)
function loadMockGISLayers() {
    console.log("🚀 Loading Mock GIS Layers (No Database Required)");

    const layerControl = document.getElementById('layerControl');
    const layerList = document.getElementById('layerList');

    if (!layerControl || !layerList || !window.mainMap) {
        console.warn("Layer Control or Map not ready yet");
        return;
    }

    // إظهار لوحة التحكم
    layerControl.style.display = 'block';
    layerList.innerHTML = '';

    // تحميل كل طبقة
    const layers = [
        { name: 'wells', displayName: '🟢 Wells (آبار)', color: '#2ed573' },
        { name: 'pipelines', displayName: '🔵 Pipelines (أنابيب)', color: '#1e90ff' },
        { name: 'restricted_zones', displayName: '🔴 Restricted Zones (مناطق محظورة)', color: '#ff6b6b' }
    ];

    layers.forEach(layer => {
        const geojson = mockGISLayers[layer.name];

        if (geojson && geojson.features.length > 0) {
            // إضافة الطبقة للخريطة
            window.mainMap.addGenericLayer(geojson, layer.name);

            // إضافة Checkbox للتحكم
            const item = document.createElement('div');
            item.innerHTML = `
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #b0d5ce; font-size: 0.85rem;">
                    <input type="checkbox" checked onchange="toggleLayer('${layer.name}', this.checked)" style="accent-color: ${layer.color};">
                    ${layer.displayName}
                </label>
            `;
            layerList.appendChild(item);

            console.log(`✅ Loaded: ${layer.displayName} (${geojson.features.length} features)`);
        }
    });

    console.log("✅ All GIS Layers Loaded Successfully!");
}

// دالة Toggle Layer (يجب أن تكون عامة ليمكن النداء عليها من HTML)
window.toggleLayer = function (layerName, isVisible) {
    if (window.mainMap && window.mainMap.toggleGenericLayer) {
        window.mainMap.toggleGenericLayer(layerName, isVisible);
        console.log(`🔄 Layer "${layerName}" visibility: ${isVisible}`);
    }
};

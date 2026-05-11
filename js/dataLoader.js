/**
 * dataLoader.js
 * Handles loading of external QGIS data (JSON format) and merging it with the platform's mock data.
 */

const DataLoader = {
    qgisDataPath: 'data/qgis_export.json',

    async init() {
        console.log('DataLoader: Initializing...');
        try {
            // Check for global QGIS data variable
            const liveData = typeof qgisLiveData !== 'undefined' ? qgisLiveData : (typeof qgisExportData !== 'undefined' ? qgisExportData : null);

            if (liveData) {
                this.mergeData(liveData.features);
                console.log('DataLoader: QGIS data merged successfully from JS object.');
                this.showSourceIndicator(true);
            } else {
                // Fallback to fetch if variable not found
                const qgisData = await this.fetchQGISData();
                if (qgisData && qgisData.features) {
                    this.mergeData(qgisData.features);
                    this.showSourceIndicator(true);
                } else {
                    this.showSourceIndicator(false);
                }
            }
        } catch (error) {
            console.error('DataLoader: Error loading QGIS data:', error);
            this.showSourceIndicator(false);
        }
    },

    async fetchQGISData() {
        try {
            const response = await fetch(this.qgisDataPath);
            if (!response.ok) return null;
            return await response.json();
        } catch (e) {
            console.warn('DataLoader: Fetch failed, likely due to local file restrictions.');
            return null;
        }
    },

    mergeData(features) {
        const formattedWells = features.map((feature, index) => {
            const props = feature.properties || {};
            const coords = feature.geometry ? feature.geometry.coordinates : [0, 0];

            return {
                id: props.id || `QGIS-${index + 1}`,
                name: props.name || `Imported Well ${index + 1}`,
                country: props.country || "Algeria",
                state: props.state || "Unknown",
                district: props.district || "Unknown",
                location: props.location || "Imported Coordinates",
                status: (props.status || "operational").toLowerCase(),
                lat: coords[1],
                lng: coords[0],
                wellType: props.type || "Production",
                depth: props.depth || 0,
                pumpType: props.pump_type || "Submersible",
                usage: props.usage || "Agriculture",
                hydraulics: {
                    staticLevel: props.static_lvl || 20,
                    dynamicLevel: props.dynamic_lvl || 40,
                    piezometricLevel: props.piezo || 30,
                    discharge: props.discharge || 10,
                    distance: 0
                },
                physical: {
                    temp: props.temp || 25,
                    ph: props.ph || 7.5,
                    tds: props.tds || 1000,
                    conductivity: props.cond || 2000
                },
                chemical: {
                    cations: { Na: props.na || 0, Ca: props.ca || 0, Mg: props.mg || 0, K: props.k || 0 },
                    anions: { Cl: props.cl || 0, SO4: props.so4 || 0, HCO3: props.hco3 || 0, NO3: props.no3 || 0 }
                },
                logs: [],
                isExternal: true
            };
        });

        if (typeof mockData !== 'undefined') {
            mockData.rigs = [...formattedWells, ...mockData.rigs];
            mockData.overview.totalWells = mockData.rigs.length;
            mockData.overview.activeWells = mockData.rigs.filter(r => r.status === 'operational').length;
        }
    },

    showSourceIndicator(isLive) {
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const indicator = document.createElement('div');
            indicator.style.display = 'flex';
            indicator.style.alignItems = 'center';
            indicator.style.gap = '6px';
            indicator.style.marginRight = '15px';
            indicator.style.fontSize = '0.75rem';

            if (isLive) {
                indicator.innerHTML = '<span style="width: 8px; height: 8px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 5px #00ff88;"></span> <span style="color: #00ff88;">QGIS Live</span>';
            } else {
                indicator.innerHTML = '<span style="width: 8px; height: 8px; background: #888; border-radius: 50%;"></span> <span style="color: #aaa;">Demo Data</span>';
            }

            headerActions.insertBefore(indicator, headerActions.firstChild);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof mockData !== 'undefined') DataLoader.init();
    }, 500);
});

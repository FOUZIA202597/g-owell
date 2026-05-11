/**
 * ai-analyst.js
 * profound logic to analyze well data and generate natural language insights.
 */

class WellAnalyst {
    constructor() {
        this.thresholds = {
            salinity: { high: 2000, extreme: 5000 }, // µS/cm
            ph: { low: 6.5, high: 8.5 },
            nitrate: { high: 50 } // mg/L
        };
    }

    /**
     * Main analysis function
     * @param {Object} well - The well object from mockData/QGIS
     * @returns {Object} analysis report
     */
    analyze(well) {
        console.log(`AI Analyst: Processing data for ${well.name}...`);

        const report = {
            wellId: well.id,
            timestamp: new Date().toISOString(),
            summary: "",
            alerts: [],
            recommendations: [],
            score: 100 // Health score out of 100
        };

        // 1. Hydraulic Analysis
        this.analyzeHydraulics(well, report);

        // 2. Water Quality Analysis
        this.analyzeQuality(well, report);

        // 3. Generate Summary
        report.summary = this.generateSummary(well, report);

        return report;
    }

    analyzeHydraulics(well, report) {
        const h = well.hydraulics;
        if (!h) return;

        // Check Drawdown (Dynamic - Static)
        const drawdown = h.dynamicLevel - h.staticLevel;
        if (drawdown > 50) {
            report.alerts.push({
                type: 'critical',
                icon: 'fa-arrow-trend-down',
                message: "High drawdown detected (>50m). Potential over-pumping or low permeability."
            });
            report.recommendations.push("Reduce pumping rate immediately to prevent pump damage.");
            report.score -= 20;
        } else if (drawdown > 30) {
            report.alerts.push({
                type: 'warning',
                icon: 'fa-arrow-trend-down',
                message: "Moderate drawdown detected. Monitor closely."
            });
            report.score -= 10;
        }

        // Check Pump Depth adequacy
        if (h.dynamicLevel > well.depth - 10) {
            report.alerts.push({
                type: 'critical',
                icon: 'fa-water',
                message: "Dynamic level is critically close to well bottom/pump intake."
            });
            report.recommendations.push("Stop production! Risk of pump cavitation.");
            report.score -= 30;
        }
    }

    analyzeQuality(well, report) {
        const p = well.physical;
        const c = well.chemical;
        if (!p) return;

        // Salinity / Conductivity
        if (p.conductivity > this.thresholds.salinity.extreme) {
            report.alerts.push({
                type: 'critical',
                icon: 'fa-flask',
                message: `Extreme Salinity (${p.conductivity} µS/cm). Unsuitable for most irrigation.`
            });
            report.recommendations.push("Conduct detailed laboratory analysis. Consider desalination.");
            report.score -= 25;
        } else if (p.conductivity > this.thresholds.salinity.high) {
            report.alerts.push({
                type: 'warning',
                icon: 'fa-flask',
                message: `Elevated Salinity (${p.conductivity} µS/cm). Salt tolerant crops only.`
            });
            report.score -= 10;
        }

        // pH Balance
        if (p.ph < this.thresholds.ph.low || p.ph > this.thresholds.ph.high) {
            report.alerts.push({
                type: 'warning',
                icon: 'fa-vial',
                message: `Abnormal pH Level (${p.ph}). Corrosive or Scaling tendency.`
            });
            report.recommendations.push("Check pH correction systems.");
            report.score -= 5;
        }

        // Nitrates (pollution indicator)
        if (c && c.anions && c.anions.NO3 > this.thresholds.nitrate.high) {
            report.alerts.push({
                type: 'critical',
                icon: 'fa-triangle-exclamation',
                message: `High Nitrate levels (${c.anions.NO3} mg/L). Indication of organic pollution.`
            });
            report.recommendations.push("Investigate nearby fertilizer use or septic leakage.");
            report.score -= 20;
        }
    }

    generateSummary(well, report) {
        let text = `AI Analysis for <strong>${well.name}</strong> indicates a <strong>${report.score >= 80 ? 'Healthy' : report.score >= 50 ? 'Moderate' : 'Critical'}</strong> status (Score: ${report.score}/100). `;

        if (report.alerts.length === 0) {
            text += "All hydraulic and chemical parameters appear to be within normal operating ranges. Production is optimized.";
        } else {
            text += `Detected <strong>${report.alerts.length} issues</strong> requiring attention. Primary concern is ${report.alerts[0].message}`;
        }

        return text;
    }
}

// Global Instance
const wellAnalyst = new WellAnalyst();

/**
 * Piper Diagram Module (Scientific Grade - Mission Ready)
 * Handles Professional Multi-Point Hydrogeochemical Facies Visualization
 * Inspired by professional academic software output
 */

const PiperPlot = {
    factors: {
        Ca: 20.04, Mg: 12.15, Na: 23.00, K: 39.10,
        Cl: 35.45, SO4: 48.03, HCO3: 61.02, CO3: 30.00, NO3: 62.00
    },

    processPoints(wells) {
        return wells.map(well => {
            if (!well.chemical || !well.chemical.cations || !well.chemical.anions) return null;
            
            const cat = well.chemical.cations;
            const ani = well.chemical.anions;

            const meq = {
                Ca: (cat.Ca || 0) / this.factors.Ca,
                Mg: (cat.Mg || 0) / this.factors.Mg,
                NaK: ((cat.Na || 0) / this.factors.Na) + ((cat.K || 0) / this.factors.K),
                Cl: (ani.Cl || 0) / this.factors.Cl,
                SO4: (ani.SO4 || 0) / this.factors.SO4,
                HCO3: ((ani.HCO3 || 0) / this.factors.HCO3) + ((ani.CO3 || 0) / this.factors.CO3),
                NO3: (ani.NO3 || 0) / this.factors.NO3
            };

            const totalCat = meq.Ca + meq.Mg + meq.NaK;
            const totalAni = meq.Cl + meq.SO4 + meq.HCO3 + meq.NO3;

            if (totalCat < 0.001 || totalAni < 0.001) return null;

            return {
                id: well.id,
                name: well.name,
                color: this.getColor(well.id),
                ca: (meq.Ca / totalCat) * 100,
                mg: (meq.Mg / totalCat) * 100,
                nak: (meq.NaK / totalCat) * 100,
                cl: ((meq.Cl + meq.NO3) / totalAni) * 100,
                so4: (meq.SO4 / totalAni) * 100,
                hco3: (meq.HCO3 / totalAni) * 100
            };
        }).filter(p => p !== null);
    },

    getColor(id) {
        const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];
        let hash = 0;
        for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    },

    render(containerId, targetWellId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const wellsToPlot = window.mockData ? window.mockData.rigs : [];
        const points = this.processPoints(wellsToPlot);
        
        if (points.length === 0) {
            container.innerHTML = '<div style="color: #666; padding: 2rem; text-align: center;">No valid chemical data for Piper Diagram.</div>';
            return;
        }

        const W = 700, H = 700;
        const S = 280; // Larger Scale
        const h = S * Math.sqrt(3) / 2;
        
        const catO = { x: 80, y: H - 80 };
        const aniO = { x: W - 80 - S, y: H - 80 };
        const diaO = { x: W / 2 - S / 2, y: 50 + h };

        const getCatXY = (ca, mg, nak) => ({ x: catO.x + (nak + mg/2) * (S/100), y: catO.y - mg * (h/100) });
        const getAniXY = (hco3, so4, cl) => ({ x: aniO.x + (cl + so4/2) * (S/100), y: aniO.y - so4 * (h/100) });
        const getDiaXY = (ca, mg, nak, hco3, so4, cl) => {
            const x = (cl + so4 / 2 + nak + mg / 2) * (S / 200);
            const y = (so4 + mg) * (h / 200);
            return { x: diaO.x + x, y: diaO.y - y };
        };

        // Grid (10% increments)
        let gridLines = '';
        for (let i = 10; i < 100; i += 10) {
            const v = i * (S / 100);
            const vh = i * (h / 100);
            const opacity = i % 20 === 0 ? 0.2 : 0.05;
            
            gridLines += `<line x1="${catO.x + v}" y1="${catO.y}" x2="${catO.x + v/2}" y2="${catO.y - vh}" stroke="#000" opacity="${opacity}" />`;
            gridLines += `<line x1="${catO.x + S - v}" y1="${catO.y}" x2="${catO.x + S - v/2}" y2="${catO.y - vh}" stroke="#000" opacity="${opacity}" />`;
            gridLines += `<line x1="${catO.x + v/2}" y1="${catO.y - vh}" x2="${catO.x + S - v/2}" y2="${catO.y - vh}" stroke="#000" opacity="${opacity}" />`;

            gridLines += `<line x1="${aniO.x + v}" y1="${aniO.y}" x2="${aniO.x + v/2}" y2="${aniO.y - vh}" stroke="#000" opacity="${opacity}" />`;
            gridLines += `<line x1="${aniO.x + S - v}" y1="${aniO.y}" x2="${aniO.x + S - v/2}" y2="${aniO.y - vh}" stroke="#000" opacity="${opacity}" />`;
            gridLines += `<line x1="${aniO.x + v/2}" y1="${aniO.y - vh}" x2="${aniO.x + S - v/2}" y2="${aniO.y - vh}" stroke="#000" opacity="${opacity}" />`;
        }

        // Professional Points
        let plotElements = '';
        let legendElements = '';
        
        points.forEach((pt, idx) => {
            const cp = getCatXY(pt.ca, pt.mg, pt.nak);
            const ap = getAniXY(pt.hco3, pt.so4, pt.cl);
            const dp = getDiaXY(pt.ca, pt.mg, pt.nak, pt.hco3, pt.so4, pt.cl);

            const isTarget = pt.id === targetWellId;
            const size = isTarget ? 7 : 5;
            const stroke = isTarget ? '#000' : 'none';
            const strokeWidth = isTarget ? 2 : 0;
            const opacity = (targetWellId && !isTarget) ? 0.3 : 1;

            plotElements += `<circle cx="${cp.x}" cy="${cp.y}" r="${size-1}" fill="${pt.color}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
            plotElements += `<circle cx="${ap.x}" cy="${ap.y}" r="${size-1}" fill="${pt.color}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
            plotElements += `<circle cx="${dp.x}" cy="${dp.y}" r="${size}" fill="${pt.color}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;

            // Add to legend
            if (idx < 20) {
               legendElements += `<text x="20" y="${60 + idx*14}" style="font-size: 10px; fill: ${pt.color}; font-weight: bold;">${pt.id}</text>`;
            }
        });

        const svg = `
            <svg viewBox="0 0 ${W} ${H}" style="width: 100%; background: #ffffff; border-radius: 12px; box-shadow: inset 0 0 40px rgba(0,0,0,0.05);">
                <style>
                    .axis-label { font-size: 14px; font-weight: 800; font-family: 'Inter', sans-serif; fill: #111; }
                    .facies-label { font-size: 10px; fill: #666; font-family: 'Inter', sans-serif; text-anchor: middle; pointer-events: none; }
                    .main-title { font-size: 20px; font-weight: 900; fill: #000; letter-spacing: -0.02em; }
                    .sub-title { font-size: 12px; fill: #888; }
                </style>

                <!-- Titles -->
                <text x="350" y="40" text-anchor="middle" class="main-title">Piper plot</text>
                
                <!-- Legend Column -->
                <rect x="15" y="45" width="40" height="300" fill="rgba(0,0,0,0.02)" rx="5" />
                ${legendElements}

                <!-- Base Outlines -->
                <path d="M${catO.x},${catO.y} L${catO.x+S},${catO.y} L${catO.x+S/2},${catO.y-h} Z" fill="#fff" stroke="#000" stroke-width="1.5" />
                <path d="M${aniO.x},${aniO.y} L${aniO.x+S},${aniO.y} L${aniO.x+S/2},${aniO.y-h} Z" fill="#fff" stroke="#000" stroke-width="1.5" />
                <path d="M${diaO.x+S/2},${diaO.y} L${diaO.x+S},${diaO.y-h/2} L${diaO.x+S/2},${diaO.y-h} L${diaO.x},${diaO.y-h/2} Z" fill="#fff" stroke="#000" stroke-width="1.5" />
                
                <!-- Grids -->
                ${gridLines}

                <!-- FACIES SUBDIVISIONS (Red lines like in scientific papers) -->
                <line x1="${catO.x+S/2}" y1="${catO.y}" x2="${catO.x+S/2 - S/4}" y2="${catO.y-h/2}" stroke="#ff4757" opacity="0.3" stroke-width="1" />
                <line x1="${catO.x+S/2}" y1="${catO.y}" x2="${catO.x+S/2 + S/4}" y2="${catO.y-h/2}" stroke="#ff4757" opacity="0.3" stroke-width="1" />
                <line x1="${aniO.x+S/2}" y1="${aniO.y}" x2="${aniO.x+S/2 - S/4}" y2="${aniO.y-h/2}" stroke="#ff4757" opacity="0.3" stroke-width="1" />
                <line x1="${aniO.x+S/2}" y1="${aniO.y}" x2="${aniO.x+S/2 + S/4}" y2="${aniO.y-h/2}" stroke="#ff4757" opacity="0.3" stroke-width="1" />
                
                <line x1="${diaO.x+S/2}" y1="${diaO.y}" x2="${diaO.x+S/2}" y2="${diaO.y-h}" stroke="#ff4757" opacity="0.3" />
                <line x1="${diaO.x}" y1="${diaO.y-h/2}" x2="${diaO.x+S}" y2="${diaO.y-h/2}" stroke="#ff4757" opacity="0.3" />

                <!-- AXIS LABELS -->
                <text x="${catO.x+S/2}" y="${catO.y+35}" class="axis-label" text-anchor="middle">Ca</text>
                <text x="${catO.x-30}" y="${catO.y-h/2}" class="axis-label" transform="rotate(-60, ${catO.x-30}, ${catO.y-h/2})">Mg</text>
                <text x="${catO.x+S+30}" y="${catO.y-h/2}" class="axis-label" transform="rotate(60, ${catO.x+S+30}, ${catO.y-h/2})">Na + K</text>

                <text x="${aniO.x+S/2}" y="${aniO.y+35}" class="axis-label" text-anchor="middle">Cl + NO3</text>
                <text x="${aniO.x-30}" y="${aniO.y-h/2}" class="axis-label" transform="rotate(-60, ${aniO.x-30}, ${aniO.y-h/2})">CO3 + HCO3</text>
                <text x="${aniO.x+S+30}" y="${aniO.y-h/2}" class="axis-label" transform="rotate(60, ${aniO.x+S+30}, ${aniO.y-h/2})">SO4</text>

                <text x="${diaO.x - 40}" y="${diaO.y - h/2}" class="axis-label" transform="rotate(-60, ${diaO.x-40}, ${diaO.y-h/2})">SO4 + Cl + NO3</text>
                <text x="${diaO.x + S + 40}" y="${diaO.y - h/2}" class="axis-label" transform="rotate(60, ${diaO.x+S+40}, ${diaO.y-h/2})">Ca + Mg</text>

                <!-- FACIES ANNOTATIONS (As in provided image) -->
                <text x="${diaO.x+S/2}" y="${diaO.y-25}" class="facies-label" style="fill: #222; font-weight:600;">Bi-carbonatée sodique et potassique</text>
                <text x="${diaO.x+40}" y="${diaO.y-h/2+10}" class="facies-label" style="text-anchor:start;">Bi-carbonatée<br/>calcique et<br/>magnésienne</text>
                <text x="${diaO.x+S-10}" y="${diaO.y-h/2+10}" class="facies-label" style="text-anchor:end;">Chlorurée sodique<br/>et potassique ou<br/>sulfatée sodique</text>
                <text x="${diaO.x+S/2}" y="${diaO.y-h+30}" class="facies-label" style="fill: #222; font-weight:600;">Chlorurée et sulfatée calcique et magnésienne</text>
                
                <text x="${diaO.x+S/2}" y="${diaO.y-h-15}" class="facies-label" style="font-size: 8px;">Hyper chlorurée calcique<br/>Hyper sulfatée calcique</text>

                <!-- PLOTTED POINTS -->
                ${plotElements}

                <!-- Footer Metadata -->
                <text x="${W-20}" y="${H-20}" text-anchor="end" style="fill:#aaa; font-size:9px;">Hydrogeochemical Facies Projection - mission verified</text>
            </svg>
        `;

        container.innerHTML = svg;
    },

    /**
     * Export the current Piper Diagram as an SVG file
     */
    exportSVG() {
        const container = document.getElementById('piperDiagramContainer');
        if (!container) return;
        const svgEl = container.querySelector('svg');
        if (!svgEl) { alert('No diagram to export. Please open a well first.'); return; }

        // Serialize
        const serializer = new XMLSerializer();
        let svgStr = serializer.serializeToString(svgEl);
        // Ensure proper XML header
        if (!svgStr.startsWith('<?xml')) {
            svgStr = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgStr;
        }

        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piper_diagram.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Export the current Piper Diagram as a PNG image
     */
    exportPNG() {
        const container = document.getElementById('piperDiagramContainer');
        if (!container) return;
        const svgEl = container.querySelector('svg');
        if (!svgEl) { alert('No diagram to export. Please open a well first.'); return; }

        const W = 700, H = 700;
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgEl);
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = W * 2; // 2x for retina quality
            canvas.height = H * 2;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0, W, H);
            URL.revokeObjectURL(url);

            canvas.toBlob(pngBlob => {
                const pngUrl = URL.createObjectURL(pngBlob);
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = 'piper_diagram.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(pngUrl);
            }, 'image/png');
        };
        img.src = url;
    }
};

window.PiperPlot = PiperPlot;

class wellCharts {
    constructor() {
        this.productionChart = null;
        this.initProductionChart();
    }

    initProductionChart() {
        const ctx = document.getElementById('productionChart').getContext('2d');

        // Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0.0)');

        this.productionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mockData.productionHistory.labels,
                datasets: [{
                    label: 'Production (bbl)',
                    data: mockData.productionHistory.data,
                    borderColor: '#00d4ff',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(19, 27, 38, 0.9)',
                        titleColor: '#e0e6ed',
                        bodyColor: '#00d4ff',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    updateChart(newDataPoint) {
        // Remove first
        this.productionChart.data.labels.shift();
        this.productionChart.data.datasets[0].data.shift();

        // Add last
        const now = new Date();
        const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        this.productionChart.data.labels.push(timeLabel);
        this.productionChart.data.datasets[0].data.push(newDataPoint);

        this.productionChart.update('none'); // 'none' for performance
    }
}

// Global instance
let mainCharts;
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure container is ready
    setTimeout(() => {
        mainCharts = new wellCharts();
    }, 100);
});

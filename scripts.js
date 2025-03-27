// Dark mode handling
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setDarkMode(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    }
    updateCharts();
}

// Initialize theme
if (localStorage.theme === 'dark' || (!localStorage.theme && prefersDark.matches)) {
    setDarkMode(true);
}

themeToggle.addEventListener('click', () => {
    setDarkMode(!document.documentElement.classList.contains('dark'));
});

// Chart configurations
const launch24Data = {
    labels: ['Oct 23', 'Nov 23', 'Dec 23', 'Jan 24', 'Feb 24', 'Mar 24'],
    visitors: [1200, 2800, 3500, 5200, 7800, 9500]
};

const chartConfig = (label, data = null, isDark = false) => {
    const defaultData = Array.from({length: 6}, () => Math.floor(Math.random() * 10000) + 1000);
    const chartData = data || defaultData;
    
    return {
        type: 'line',
        data: {
            labels: data ? launch24Data.labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Visitors',
                data: chartData,
                borderColor: isDark ? '#60A5FA' : '#3B82F6',
                backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: isDark ? '#60A5FA' : '#3B82F6'
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
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    titleColor: isDark ? '#FFFFFF' : '#1F2937',
                    bodyColor: isDark ? '#FFFFFF' : '#1F2937',
                    borderColor: isDark ? '#4B5563' : '#E5E7EB',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `Visitors: ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: isDark ? '#374151' : '#E5E7EB'
                    },
                    ticks: {
                        color: isDark ? '#9CA3AF' : '#4B5563'
                    }
                },
                y: {
                    grid: {
                        color: isDark ? '#374151' : '#E5E7EB'
                    },
                    ticks: {
                        color: isDark ? '#9CA3AF' : '#4B5563',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    };
};

// Initialize charts
const charts = {
    launch24: new Chart(
        document.getElementById('launch24-chart'), 
        chartConfig('Launch24.eu', launch24Data.visitors)
    ),
    alpha: new Chart(
        document.getElementById('alpha-chart'), 
        chartConfig('Project Alpha')
    ),
    beta: new Chart(
        document.getElementById('beta-chart'), 
        chartConfig('Project Beta')
    )
};

// Update charts when theme changes
function updateCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    Object.entries(charts).forEach(([key, chart]) => {
        const data = key === 'launch24' ? launch24Data.visitors : null;
        const newConfig = chartConfig(chart.data.datasets[0].label, data, isDark);
        chart.data = newConfig.data;
        chart.options = newConfig.options;
        chart.update();
    });
} 
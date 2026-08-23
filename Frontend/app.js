const API_BASE = 'http://localhost:8000/api/v1';

function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(viewName)) {
            btn.classList.add('active');
        }
    });

    if (viewName === 'map-view') initMap();
    if (viewName === 'cartel') loadCartelData();
    if (viewName === 'admin-dashboard') initCharts();
    if (viewName === 'risk-queue') loadProjectsQueue();
}

async function checkBackendHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`);
        const data = await res.json();
        document.getElementById('backend-status').innerText = 'Online (FastAPI)';
    } catch (err) {
        document.getElementById('backend-status').innerText = 'Offline (Local Mode)';
    }
}

async function loadProjectsQueue() {
    try {
        const res = await fetch(`${API_BASE}/analytics/projects`);
        const projects = await res.json();
        const tbody = document.getElementById('risk-table-body');
        tbody.innerHTML = '';

        for (const p of projects) {
            const riskRes = await fetch(`${API_BASE}/analytics/score-project/${p.project_id}`);
            const risk = await riskRes.json();

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-800/40 transition';
            tr.innerHTML = `
                <td class="p-3.5 font-bold text-sky-400">${p.project_id}</td>
                <td class="p-3.5 font-medium text-white">${p.title}</td>
                <td class="p-3.5 text-slate-300">${p.district} (${p.state})</td>
                <td class="p-3.5 font-semibold text-slate-200">₹${(p.sanctioned_amount/100000).toFixed(1)} Lakh</td>
                <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold ${risk.overall_risk_score > 60 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}">
                        ${risk.overall_risk_score}/100 (${risk.risk_level})
                    </span>
                </td>
                <td class="p-3.5 text-slate-400">${risk.explainable_flags[0] || 'Nominal Parameter Sync'}</td>
                <td class="p-3.5">
                    <button onclick="alert('Project: ${p.project_id}\nRisk Score: ${risk.overall_risk_score}/100\nAction: ${risk.recommended_action}')" class="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded text-[11px] font-semibold">Audit</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    } catch (e) {
        console.error('Error loading projects:', e);
    }
}

let trendChart, categoryChart;
function initCharts() {
    if (trendChart) return;

    const ctxTrend = document.getElementById('anomalyTrendChart').getContext('2d');
    trendChart = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [
                {
                    label: 'Financial Drift Anomalies',
                    data: [12, 19, 15, 28, 22, 35, 41, 38],
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Duplicate Image Flags',
                    data: [4, 6, 9, 14, 18, 24, 31, 29],
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
                x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
            }
        }
    });

    const ctxCat = document.getElementById('anomalyCategoryChart').getContext('2d');
    categoryChart = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: ['Financial Drift', 'Duplicate Images', 'Timeline Lag', 'Cartel Monopoly'],
            datasets: [{
                data: [42, 28, 18, 12],
                backgroundColor: ['#38bdf8', '#f87171', '#fbbf24', '#a855f7'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } }
        }
    });
}

let map;
function initMap() {
    if (map) return;
    map = L.map('indiaMap').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    const locations = [
        { name: 'Nandurbar (Maharashtra)', coords: [21.3851, 74.9023], risk: 'CRITICAL', score: '68.9', color: '#ef4444' },
        { name: 'Gaya (Bihar)', coords: [24.7914, 85.0002], risk: 'LOW', score: '18.4', color: '#10b981' },
        { name: 'Barmer (Rajasthan)', coords: [25.7521, 71.3967], risk: 'CRITICAL', score: '82.1', color: '#ef4444' },
        { name: 'Cuddalore (Tamil Nadu)', coords: [11.7480, 79.7714], risk: 'MEDIUM', score: '44.5', color: '#f59e0b' }
    ];

    locations.forEach(loc => {
        const circle = L.circleMarker(loc.coords, {
            radius: 9,
            fillColor: loc.color,
            color: '#fff',
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.85
        }).addTo(map);

        circle.bindPopup(`
            <div style="color: #000; font-family: sans-serif;">
                <b>${loc.name}</b><br/>
                Risk Level: <b>${loc.risk} (${loc.score}/100)</b>
            </div>
        `);
    });
}

let network;
async function loadCartelData() {
    const district = document.getElementById('cartel-district-select').value;
    try {
        const res = await fetch(`${API_BASE}/cartel/matrix?district=${district}`);
        const data = await res.json();

        const container = document.getElementById('cartelNetwork');
        const nodes = new vis.DataSet(data.nodes.map(n => ({
            id: n.id,
            label: n.label,
            shape: n.type === 'vendor' ? 'hexagon' : 'dot',
            color: n.risk_level === 'CRITICAL' ? '#ef4444' : (n.type === 'vendor' ? '#38bdf8' : '#10b981'),
            size: n.type === 'vendor' ? 24 : 14,
            font: { color: '#ffffff', size: 12 }
        })));

        const edges = new vis.DataSet(data.edges.map(e => ({
            from: e.source,
            to: e.target,
            color: { color: '#64748b' },
            width: 2
        })));

        network = new vis.Network(container, { nodes, edges }, {
            physics: { stabilization: true },
            interaction: { hover: true }
        });

        const monoList = document.getElementById('monopoly-list');
        monoList.innerHTML = '';
        if (data.monopoly_vendors.length === 0) {
            monoList.innerHTML = '<p class="text-xs text-slate-400">No monopoly bidding anomalies detected in this district.</p>';
        } else {
            data.monopoly_vendors.forEach(m => {
                monoList.innerHTML += `
                    <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg space-y-1">
                        <h4 class="text-xs font-bold text-red-400">${m.vendor_name}</h4>
                        <p class="text-[11px] text-slate-300">District Tender Share: <b class="text-red-400">${m.district_tender_share_pct}%</b></p>
                        <p class="text-[11px] text-slate-400">${m.alert}</p>
                    </div>
                `;
            });
        }
    } catch (e) {
        console.error('Error loading cartel graph:', e);
    }
}

function runForensicsDemo() {
    alert('AI Forensic Audit Executed!\n\n• Perceptual Hash match: 96.4% duplicate certainty.\n• Matched with historical project #MPLAD-25-7789 in repository.\n• Verdict: Disallow fund claim and flag contractor for inspection.');
}

function handleCitizenSubmit(e) {
    e.preventDefault();
    alert('Thank you! Your geo-tagged evidence has been recorded and queued for AI verification.');
}

function openLoginModal() {
    alert('MoSPI DigiGov Authentication Gateway\n\nChoose Persona:\n1. MoSPI Central Admin\n2. District Officer (Nandurbar)\n3. Public Citizen Auditor');
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    checkBackendHealth();
});

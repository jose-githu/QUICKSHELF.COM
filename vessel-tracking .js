// ================================================
// VESSEL TRACKING JavaScript
// ================================================

// State Management
let vessels = [];
let realTimeUpdates = {};
let ws = null;
let selectedVessel = null;

// Mock WebSocket Connection (replace with real WebSocket in production)
function connectWebSocket() {
    // In production: ws = new WebSocket('wss://your-api.com/vessels');

    // Mock WebSocket simulator for demo
    setInterval(() => {
        if (vessels.length > 0) {
            const randomVessel = vessels[Math.floor(Math.random() * vessels.length)];
            const mockUpdate = {
                vessel_id: randomVessel.id,
                latitude: randomVessel.latitude + (Math.random() - 0.5) * 0.1,
                longitude: randomVessel.longitude + (Math.random() - 0.5) * 0.1,
                speed: (Math.random() * 15 + 5).toFixed(1),
                status: ['In Transit',
                    'At Port',
                    'Anchored'][Math.floor(Math.random() * 3)],
                timestamp: new Date().toISOString()
            };

            handleRealtimeUpdate(mockUpdate);
        }
    },
        5000);
}

// Handle real-time updates from WebSocket
function handleRealtimeUpdate(update) {
    realTimeUpdates[update.vessel_id] = update;

    // Update vessel in array
    const vesselIndex = vessels.findIndex(v => v.id === update.vessel_id);
    if (vesselIndex !== -1) {
        vessels[vesselIndex] = {
            ...vessels[vesselIndex],
            ...update,
            lastUpdate: update.timestamp
        };

        // Re-render the specific vessel card
        renderVesselCard(vessels[vesselIndex]);
        updateStats();

        // Update detail modal if it's open for this vessel
        if (selectedVessel && selectedVessel.id === update.vessel_id) {
            selectedVessel = vessels[vesselIndex];
            updateDetailModal();
        }
    }
}

// Mock API Functions
const API = {
    fetchVessels: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([{
                    id: 1,
                    name: 'Ocean Pioneer',
                    imo: '9876543',
                    mmsi: '123456789',
                    status: 'In Transit',
                    latitude: 40.7128,
                    longitude: -74.0060,
                    speed: 12.5,
                    heading: 45,
                    eta: '2025-12-15T14:30:00Z',
                    lastUpdate: new Date().toISOString()
                },
                    {
                        id: 2,
                        name: 'Atlantic Trader',
                        imo: '9876544',
                        mmsi: '123456790',
                        status: 'At Port',
                        latitude: 40.6892,
                        longitude: -74.0445,
                        speed: 0,
                        heading: 180,
                        eta: '2025-12-10T09:00:00Z',
                        lastUpdate: new Date().toISOString()
                    }]);
            }, 500);
        });
    },

    addVessel: async (vesselData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve( {
                    id: Date.now(),
                    ...vesselData,
                    status: 'In Transit',
                    latitude: 40.7589,
                    longitude: -73.9851,
                    speed: 10.0,
                    heading: 90,
                    lastUpdate: new Date().toISOString()
                });
            }, 800);
        });
    },

    deleteVessel: async (vesselId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve( {
                    success: true, vesselId
                });
            }, 500);
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeVesselTracking();
});

async function initializeVesselTracking() {
    showLoading();

    try {
        vessels = await API.fetchVessels();
        renderVessels();
        updateStats();
        connectWebSocket();
    } catch (error) {
        console.error('Error loading vessels:', error);
        showError();
    }
}

// Render Functions
function showLoading() {
    const grid = document.getElementById('vesselGrid');
    grid.innerHTML = `
    <div class="loading-state">
    <div class="spinner"></div>
    <p>Loading vessels...</p>
    </div>
    `;
}

function showError() {
    const grid = document.getElementById('vesselGrid');
    grid.innerHTML = `
    <div class="empty-state">
    <i class="fas fa-exclamation-triangle empty-icon"></i>
    <h3>Error Loading Vessels</h3>
    <p>Please try again later</p>
    </div>
    `;
}

function renderVessels() {
    const grid = document.getElementById('vesselGrid');

    if (vessels.length === 0) {
        grid.innerHTML = `
        <div class="empty-state" id="emptyState">
        <i class="fas fa-ship empty-icon"></i>
        <h3>No Vessels Found</h3>
        <p>Start by adding your first vessel</p>
        <button class="btn btn-primary" onclick="openAddModal()">
        <i class="fas fa-plus"></i> Add Your First Vessel
        </button>
        </div>
        `;
        return;
    }

    grid.innerHTML = vessels.map(vessel => createVesselCardHTML(vessel)).join('');
}

function renderVesselCard(vessel) {
    const card = document.querySelector(`[data-vessel-id="${vessel.id}"]`);
    if (card) {
        card.outerHTML = createVesselCardHTML(vessel);
    }
}

function createVesselCardHTML(vessel) {
    const update = realTimeUpdates[vessel.id] || vessel;
    const statusClass = update.status.toLowerCase().replace(' ', '-');

    return `
    <div class="vessel-card" data-vessel-id="${vessel.id}">
    <div class="vessel-card-header">
    <div class="vessel-card-header-content">
    <div class="vessel-card-left">
    <div class="vessel-card-icon">
    <i class="fas fa-ship"></i>
    </div>
    <div>
    <h3 class="vessel-card-name">${vessel.name}</h3>
    <p class="vessel-card-imo">IMO: ${vessel.imo}</p>
    </div>
    </div>
    <button class="vessel-delete-btn" onclick="deleteVessel(${vessel.id})" title="Remove vessel">
    <i class="fas fa-times"></i>
    </button>
    </div>
    </div>
    <div class="vessel-card-body">
    <div class="vessel-status-row">
    <div class="vessel-status">
    <div class="status-dot ${statusClass}"></div>
    <span>${update.status}</span>
    </div>
    <div class="vessel-speed">
    <i class="fas fa-tachometer-alt"></i>
    <span>${update.speed} kn</span>
    </div>
    </div>

    <div class="vessel-info-grid">
    <div class="vessel-info-item">
    <i class="fas fa-map-marker-alt"></i>
    <div>
    <p class="vessel-info-label">Position</p>
    <p class="vessel-info-value">
    ${update.latitude.toFixed(4)}°N<br>
    ${update.longitude.toFixed(4)}°W
    </p>
    </div>
    </div>
    <div class="vessel-info-item">
    <i class="fas fa-clock"></i>
    <div>
    <p class="vessel-info-label">ETA</p>
    <p class="vessel-info-value">
    ${formatETA(vessel.eta)}
    </p>
    </div>
    </div>
    </div>

    <div class="vessel-card-actions">
    <button class="vessel-view-btn" onclick="viewVesselDetails(${vessel.id})">
    <i class="fas fa-eye"></i>
    View Details
    </button>
    </div>

    <p class="vessel-update-time">
    Updated: ${new Date(update.lastUpdate).toLocaleTimeString()}
    </p>
    </div>
    </div>
    `;
}

function updateStats() {
    document.getElementById('totalVessels').textContent = vessels.length;
    document.getElementById('inTransit').textContent = vessels.filter(v => v.status === 'In Transit').length;
    document.getElementById('atPort').textContent = vessels.filter(v => v.status === 'At Port').length;
}

// Helper Functions
function formatETA(eta) {
    if (!eta) return 'N/A';
    const date = new Date(eta);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusColor(status) {
    const colors = {
        'In Transit': '#3B82F6',
        'At Port': '#10B981',
        'Anchored': '#F59E0B',
        'Delayed': '#EF4444'
    };
    return colors[status] || '#6B7280';
}

// Modal Functions
function openAddModal() {
    document.getElementById('addVesselModal').classList.add('active');
}

function closeAddModal() {
    document.getElementById('addVesselModal').classList.remove('active');
    clearAddForm();
}

function clearAddForm() {
    document.getElementById('vesselName').value = '';
    document.getElementById('vesselIMO').value = '';
    document.getElementById('vesselMMSI').value = '';
    document.getElementById('vesselETA').value = '';
}

function viewVesselDetails(vesselId) {
    selectedVessel = vessels.find(v => v.id === vesselId);
    if (!selectedVessel) return;

    const update = realTimeUpdates[vesselId] || selectedVessel;
    const modal = document.getElementById('detailModal');

    // Update modal content
    document.getElementById('detailVesselName').textContent = selectedVessel.name;
    document.getElementById('detailIMO').textContent = `IMO: ${selectedVessel.imo}`;
    document.getElementById('detailMMSI').textContent = `MMSI: ${selectedVessel.mmsi}`;

    const statusIndicator = document.getElementById('statusIndicator');
    statusIndicator.style.backgroundColor = getStatusColor(update.status);

    document.getElementById('detailStatus').textContent = update.status;
    document.getElementById('detailSpeed').textContent = `${update.speed} kn`;
    document.getElementById('detailPosition').textContent =
    `Lat: ${update.latitude.toFixed(6)}°\nLon: ${update.longitude.toFixed(6)}°`;
    document.getElementById('detailHeading').textContent = `${update.heading}°`;
    document.getElementById('detailETA').textContent =
    selectedVessel.eta ? new Date(selectedVessel.eta).toLocaleString(): 'Not set';
    document.getElementById('mapPosition').textContent =
    `Real-time vessel location: ${update.latitude.toFixed(4)}°N, ${update.longitude.toFixed(4)}°W`;

    // Update activity log
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = `
    <div class="activity-item success">
    <h4>Position Updated</h4>
    <p>${new Date(update.lastUpdate).toLocaleString()}</p>
    </div>
    <div class="activity-item">
    <h4>Status: ${update.status}</h4>
    <p>Speed: ${update.speed} knots</p>
    </div>
    `;

    modal.classList.add('active');
}

function updateDetailModal() {
    if (!selectedVessel) return;

    const update = realTimeUpdates[selectedVessel.id] || selectedVessel;

    const statusIndicator = document.getElementById('statusIndicator');
    statusIndicator.style.backgroundColor = getStatusColor(update.status);

    document.getElementById('detailStatus').textContent = update.status;
    document.getElementById('detailSpeed').textContent = `${update.speed} kn`;
    document.getElementById('detailPosition').textContent =
    `Lat: ${update.latitude.toFixed(6)}°\nLon: ${update.longitude.toFixed(6)}°`;
    document.getElementById('mapPosition').textContent =
    `Real-time vessel location: ${update.latitude.toFixed(4)}°N, ${update.longitude.toFixed(4)}°W`;

    // Update activity log with new entry
    const activityList = document.getElementById('activityList');
    const firstActivity = activityList.querySelector('.activity-item');
    if (firstActivity) {
        firstActivity.querySelector('p').textContent = new Date(update.lastUpdate).toLocaleString();
    }
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
    selectedVessel = null;
}

// CRUD Operations
async function addVessel() {
    const name = document.getElementById('vesselName').value.trim();
    const imo = document.getElementById('vesselIMO').value.trim();
    const mmsi = document.getElementById('vesselMMSI').value.trim();
    const eta = document.getElementById('vesselETA').value;

    if (!name || !imo || !mmsi) {
        alert('Please fill in all required fields');
        return;
    }

    if (imo.length !== 7 || !/^\d+$/.test(imo)) {
        alert('IMO must be exactly 7 digits');
        return;
    }

    if (mmsi.length !== 9 || !/^\d+$/.test(mmsi)) {
        alert('MMSI must be exactly 9 digits');
        return;
    }

    const submitBtn = document.getElementById('submitVessel');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const vesselData = {
            name,
            imo,
            mmsi,
            eta: eta || null
        };
        const newVessel = await API.addVessel(vesselData);

        vessels.push(newVessel);
        renderVessels();
        updateStats();
        closeAddModal();
    } catch (error) {
        console.error('Error adding vessel:', error);
        alert('Failed to add vessel. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Vessel';
    }
}

async function deleteVessel(vesselId) {
    if (!confirm('Are you sure you want to remove this vessel from tracking?')) {
        return;
    }

    try {
        await API.deleteVessel(vesselId);
        vessels = vessels.filter(v => v.id !== vesselId);
        delete realTimeUpdates[vesselId];
        renderVessels();
        updateStats();
    } catch (error) {
        console.error('Error deleting vessel:', error);
        alert('Failed to delete vessel. Please try again.');
    }
}

// Search Functionality
document.getElementById('vesselSearchInput')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.vessel-card');

    cards.forEach(card => {
        const vesselId = parseInt(card.dataset.vesselId);
        const vessel = vessels.find(v => v.id === vesselId);

        if (!vessel) return;

        const matchesSearch =
        vessel.name.toLowerCase().includes(searchTerm) ||
        vessel.imo.includes(searchTerm) ||
        vessel.mmsi.includes(searchTerm);

        card.style.display = matchesSearch ? 'block': 'none';
    });
});

// Event Listeners
document.getElementById('addVesselBtn')?.addEventListener('click', openAddModal);
document.getElementById('submitVessel')?.addEventListener('click', addVessel);

// Close modals on outside click
document.getElementById('addVesselModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'addVesselModal') {
        closeAddModal();
    }
});

document.getElementById('detailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') {
        closeDetailModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('addVesselModal').classList.contains('active')) {
            closeAddModal();
        }
        if (document.getElementById('detailModal').classList.contains('active')) {
            closeDetailModal();
        }
    }
});
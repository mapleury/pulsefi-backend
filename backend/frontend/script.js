const API_URL = window.PULSEFI_API_URL || `${window.location.origin}/api`;
let currentUser = null;
let transactionChart = null; // Holds the Chart.js instance

// ==========================================
// 1. UTILS & FORMATTING
// ==========================================
const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
};

// ==========================================
// 2. AUTHENTICATION (Hackathon Style)
// ==========================================
async function login(username) {
    if (!username) return alert("Enter a name to vibe code!");
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: username })
        });
        const data = await res.json();
        currentUser = data.user;
        
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        document.getElementById('user-greeting').innerText = `Welcome, ${currentUser.name}`;
        
        initializeApp();
    } catch (error) {
        console.error("Login failed:", error);
    }
}

// ==========================================
// 3. PROFILE, PULSE & IDENTITY
// ==========================================
async function updateIdentity() {
    try {
        const res = await fetch(`${API_URL}/profile/pulse`);
        const data = await res.json();
        
        // Update DOM
        document.getElementById('identity-name').innerText = data.identity;
        document.getElementById('pulse-score').innerText = `${data.pulseScore}/100`;
        
        // Progress bar for Pulse
        const pulseBar = document.getElementById('pulse-bar');
        if (pulseBar) pulseBar.style.width = `${data.pulseScore}%`;

    } catch (error) {
        console.error("Failed to load identity", error);
    }
}

// ==========================================
// 4. STREAK SYSTEM (Ga Boros & Nabung)
// ==========================================
async function updateStreak() {
    try {
        const res = await fetch(`${API_URL}/streaks`);
        const data = await res.json();
        
        document.getElementById('streak-count').innerText = `${data.currentStreak} Days`;
        const streakMsg = document.getElementById('streak-message');
        
        if (data.onFire) {
            streakMsg.innerText = "🔥 You're on fire! Keep it up!";
            streakMsg.style.color = "var(--success-color)";
        } else if (!data.canSaveToday) {
            streakMsg.innerText = "⚠️ Streak broken today. Bounce back tomorrow.";
            streakMsg.style.color = "var(--warning-color)";
        }
    } catch (error) {
        console.error("Failed to load streak", error);
    }
}

// ==========================================
// 5. TRANSACTIONS & GRAFIK (Charts)
// ==========================================
async function addTransaction() {
    const amountInput = document.getElementById('amount');
    const rawValue = amountInput.value.replace(/[.,]/g, "");
    const cleanAmount = parseInt(rawValue, 10);

    if (isNaN(cleanAmount)) return alert("Invalid amount. Stay sharp.");
    
    const payload = {
        amount: cleanAmount,
        category: document.getElementById('category').value,
        type: document.getElementById('type').value,
        description: document.getElementById('desc').value || 'Web Entry'
    };

    try {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            amountInput.value = ""; 
            document.getElementById('desc').value = "";
            
            // Refresh everything so the DOM mirrors the DB perfectly
            await Promise.all([loadHistory(), updateIdentity(), updateStreak(), loadChart()]);
        }
    } catch (error) {
        console.error("Transaction error:", error);
    }
}

async function loadHistory() {
    try {
        const res = await fetch(`${API_URL}/transactions`);
        const data = await res.json();
        const list = document.getElementById('transaction-list');
        list.innerHTML = ""; 

        data.forEach(t => {
            const isIncome = t.type === 'income';
            const sign = isIncome ? '+' : '-';
            const color = isIncome ? '#4CAF50' : '#F44336'; // Assuming inline for now

            list.innerHTML += `
                <li class="t-item">
                    <div class="t-info">
                        <span class="t-category">${t.category}</span>
                        <small>${t.description}</small>
                    </div>
                    <span class="t-amount" style="color: ${color};">${sign} ${formatIDR(t.amount)}</span>
                </li>
            `;
        });
    } catch (error) {
        console.error("Failed to load history", error);
    }
}

// Requires Chart.js CDN in your HTML: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
async function loadChart() {
    try {
        const res = await fetch(`${API_URL}/transactions/stats`); // Assuming your backend groups by category
        const data = await res.json();
        
        const ctx = document.getElementById('expenseChart');
        if (!ctx) return; // Skip if canvas isn't in HTML yet

        if (transactionChart) transactionChart.destroy(); // Prevent overlapping charts

        transactionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.categories, // e.g., ['Food', 'Transport']
                datasets: [{
                    data: data.amounts,
                    backgroundColor: ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'] // Indigo/Blue/Purple aesthetic
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    } catch (error) {
        console.log("Chart data not ready yet.");
    }
}

// ==========================================
// 6. GOALS & MOMENTUM TRACKER
// ==========================================
async function loadGoals() {
    try {
        const res = await fetch(`${API_URL}/goals`);
        const goals = await res.json();
        const container = document.getElementById('goal-container');
        container.innerHTML = '';

        goals.forEach(goal => {
            const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100).toFixed(1);

            container.innerHTML += `
                <div class="goal-item">
                    <div class="goal-info">
                        <h4>${goal.name}</h4>
                        <span>${formatIDR(goal.current_amount)} / ${formatIDR(goal.target_amount)}</span>
                    </div>
                    <div class="progress-container" style="background: #333; border-radius: 8px; width: 100%; height: 10px; margin: 10px 0;">
                        <div class="progress-bar" style="width:${percent}%; background: linear-gradient(90deg, #6366F1, #8B5CF6); height: 100%; border-radius: 8px;"></div>
                    </div>
                    <div class="goal-actions">
                        <button onclick="addProgress(${goal.id}, ${goal.current_amount})">+ Save</button>
                        <button class="btn-danger" onclick="deleteGoal(${goal.id})">Drop</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Failed to load goals", err);
    }
}

async function createGoal() {
    const name = document.getElementById('goal-name').value;
    const target = document.getElementById('goal-target').value;

    if (!name || !target) return alert("Goals require actual targets.");

    await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, target_amount: parseInt(target) })
    });
    loadGoals();
}

async function addProgress(id, currentAmount) {
    const amount = prompt("How much are you throwing at this goal today?");
    if (!amount || isNaN(amount)) return;

    const newAmount = currentAmount + parseInt(amount);

    await fetch(`${API_URL}/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_amount: newAmount })
    });
    
    // Check if this action triggered a "Painful Goal Notification" or Success
    pollNotifications(); 
    loadGoals();
}

async function deleteGoal(id) {
    if(confirm("Dropping this goal? Quitting already?")) {
        await fetch(`${API_URL}/goals/${id}`, { method: 'DELETE' });
        loadGoals();
    }
}

// ==========================================
// 7. THE NERVOUS SYSTEM: NOTIFICATIONS & REGRET
// ==========================================
let isModalOpen = false;

async function pollNotifications() {
    if (isModalOpen) return; // Don't spam modals if one is already open

    try {
        const res = await fetch(`${API_URL}/notifications`);
        const alerts = await res.json();

        if (alerts.length > 0) {
            const alert = alerts[0]; // Process oldest unread first
            showNotificationModal(alert);
        }
    } catch (error) {
        // Silently fail, it's just a polling mechanism
    }
}

function showNotificationModal(alertData) {
    isModalOpen = true;
    const modal = document.getElementById('alert-modal');
    const title = document.getElementById('alert-title');
    const msg = document.getElementById('alert-message');
    const bg = document.getElementById('alert-content');

    msg.innerText = alertData.message;

    // Vibe Code Styling based on Type
    if (alertData.type === 'regret') {
        title.innerText = "💀 Financial Regret Replay";
        bg.style.border = "2px solid #EC4899"; // Pinkish Red
    } else if (alertData.type === 'warning') {
        title.innerText = "🧠 Smart Warning";
        bg.style.border = "2px solid #F59E0B"; // Amber
    } else {
        title.innerText = "🎯 Painful Goal Reminder";
        bg.style.border = "2px solid #3B82F6"; // Blue
    }

    modal.style.display = 'flex';

    // Acknowledge logic
    document.getElementById('btn-acknowledge').onclick = async () => {
        await fetch(`${API_URL}/notifications/${alertData.id}/read`, { method: 'PUT' });
        modal.style.display = 'none';
        isModalOpen = false;
    };
}

// ==========================================
// 8. BOOTSTRAP
// ==========================================
function initializeApp() {
    updateIdentity();
    updateStreak();
    loadHistory();
    loadGoals();
    loadChart();
    
    // The "Pulse" - Checks for bad decisions every 15 seconds
    setInterval(pollNotifications, 15000); 
}

// Initial Listeners
document.getElementById('btn-login').addEventListener('click', () => {
    login(document.getElementById('login-name').value);
});
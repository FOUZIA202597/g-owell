/**
 * GeoWell User Hub & Innovation Features
 * Handles RBAC, Pricing, BaridiMob, and Digital Passports
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial UI check
    updateUserUI();
    applyRolePermissions();
});

function updateUserUI() {
    const user = window.mockData.activeUser;
    if (!user) return;

    // Update Sidebar (With Null Checks to prevent Auth-Crash)
    const nameEl = document.getElementById('user-display-name');
    const instEl = document.getElementById('user-institution');
    const avatarEl = document.getElementById('user-avatar');
    
    if (nameEl) nameEl.textContent = user.name;
    if (instEl) instEl.textContent = user.institution;
    if (avatarEl) avatarEl.src = user.avatar;

    // Accounts / Subscription Counters (Matching modal-ac IDs)
    const daysEl = document.getElementById('sub-days') || document.getElementById('modal-ac-days');
    const creditsEl = document.getElementById('user-credits') || document.getElementById('modal-ac-credits');
    
    if (daysEl) daysEl.textContent = user.daysLeft;
    if (creditsEl) creditsEl.textContent = user.credits;

    // Update Badge Class
    const badge = document.getElementById('user-role-badge');
    badge.textContent = user.tier;
    badge.className = 'role-badge ' + getRoleBadgeClass(user.role);
}

function getRoleBadgeClass(role) {
    switch (role) {
        case 'ADMIN': return 'role-superior';
        case 'ENGINEER': return 'role-premium';
        case 'STUDENT': return 'role-academic';
        case 'FARMER': return 'role-field';
        default: return 'role-academic';
    }
}

window.openPricingModal = function() {
    document.getElementById('modal-pricing').classList.add('active');
};

window.closeInnovationModal = function(id) {
    document.getElementById(id).classList.remove('active');
};

window.simulateRoleChange = function(newRole) {
    const plans = window.mockData.subscriptionPlans;
    const plan = plans.find(p => p.role === newRole);
    
    if (plan) {
        window.mockData.activeUser.role = plan.role;
        window.mockData.activeUser.tier = plan.name;
        window.mockData.activeUser.credits = (newRole === 'ADMIN' || newRole === 'ENGINEER') ? 99 : 5;
        
        updateUserUI();
        applyRolePermissions();
        closeInnovationModal('modal-pricing');
        
        showToast(`Role switched to ${plan.name} for demo purposes.`, 'info');
    }
};

window.switchAuthMode = function(mode) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form-view').forEach(v => v.classList.remove('active'));

    if (mode === 'login') {
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
        document.getElementById('auth-view-login').classList.add('active');
    } else {
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('auth-view-signup').classList.add('active');
    }

    // Re-trigger Translation to catch newly visible form fields
    if (typeof window.i18nInit === 'function') {
        window.i18nInit(window.currentLang);
    }
};

window.handleAuthAction = function(e, isSignup) {
    const btn = e.currentTarget; // Using currentTarget for reliable delegation
    const originalText = btn.innerHTML;
    
    // Validate Inputs
    const name = isSignup ? document.getElementById('signup-name').value : "Houra Fouzia";
    const email = isSignup ? document.getElementById('signup-email').value : document.getElementById('login-email').value;
    const inst = isSignup ? document.getElementById('signup-inst').value : "DRE Batna - Gov";
    const role = isSignup ? document.getElementById('signup-role').value : "ADMIN";

    if (!email) {
        showToast("Please enter a valid email address.", "error");
        return;
    }

    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> SECURING SESSION...';
    btn.disabled = true;

    // Simulate Network Latency
    setTimeout(() => {
        // Dynamic User Synchronization
        window.mockData.activeUser.name = name;
        window.mockData.activeUser.role = role;
        window.mockData.activeUser.institution = inst;
        window.mockData.activeUser.tier = getTierName(role);
        
        applyRolePermissions();
        
        document.getElementById('auth-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('auth-overlay').style.visibility = 'hidden';
            showToast(`Authentication Successful. Welcome ${name}.`, "success");
        }, 500);
    }, 1800);
};

function getTierName(role) {
    const tiers = { 'ADMIN': 'Superior', 'ENGINEER': 'Premium', 'STUDENT': 'Academic', 'FARMER': 'Field' };
    return tiers[role] || 'Academic';
}

window.handleLogin = function() {
    // Legacy support for older triggers
    handleAuthAction(false);
};

window.openUserAccount = function() {
    const user = window.mockData.activeUser;
    
    // Populate Modal
    document.getElementById('modal-ac-credits').textContent = user.credits;
    document.getElementById('modal-ac-days').textContent = user.daysLeft;
    document.getElementById('modal-ac-role').textContent = user.tier;
    document.getElementById('modal-ac-inst').textContent = user.institution;
    
    document.getElementById('modal-user-account').classList.add('active');
};

window.setLang = function(lang) {
    // Update active button state in the Auth Screen
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.remove('active');
        if (b.innerText.trim().toLowerCase() === lang.toLowerCase()) {
            b.classList.add('active');
        }
    });

    // Initialize/Update Translation Engine
    if (typeof window.i18nInit === 'function') {
        window.i18nInit(lang);
    }

    // Success Feedback
    const toastMsg = window.getText('lng_toast') || "Language Updated";
    showToast(toastMsg, "success");

    // Persist and Sync Global Dashboard (If logged in)
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }
};

window.applyRolePermissions = function() {
    const user = window.mockData.activeUser;
    const role = user.role;

    // Update ALL Profile instances
    updateUserUI();

    // 1. Lock GIS Export for Students/Farmers
    const exportBtn = document.querySelector('.btn-export-gis');
    if (exportBtn) {
        if (role === 'STUDENT' || role === 'FARMER') {
            exportBtn.closest('.card-action-bar')?.classList.add('feature-locked');
        } else {
            exportBtn.closest('.card-action-bar')?.classList.remove('feature-locked');
        }
    }

    // 2. Lock Neural Analysis for Students
    const neuralBtn = document.getElementById('btnNeuralMap');
    if (neuralBtn && (role === 'STUDENT' || role === 'FARMER')) {
        neuralBtn.style.opacity = '0.5';
        neuralBtn.title = "Upgrade to Premium for Neural Analysis";
    } else if (neuralBtn) {
        neuralBtn.style.opacity = '1';
    }

    // 3. Simplified Arabic UI for Farmers
    toggleFarmerUI(role === 'FARMER');
};

function toggleFarmerUI(isFarmer) {
    const mainView = document.getElementById('view-map');
    if (isFarmer) {
        // Simple mock of language and UI simplification
        showToast("Switching to Field Mode (Simplified Arabic UI)", "warning");
        // In a real app, we'd trigger i18n here
    }
}

window.openBaridiMob = function() {
    closeInnovationModal('modal-pricing');
    document.getElementById('modal-baridimob').classList.add('active');
};

window.processPayment = function() {
    const btn = document.querySelector('.baridi-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRAITEMENT...';
    btn.disabled = true;

    setTimeout(() => {
        showToast("Paiement BaridiMob réussi ! Bienvenue dans GeoWell Premium.", "success");
        simulateRoleChange('ENGINEER');
        closeInnovationModal('modal-baridimob');
        btn.innerHTML = 'PAYER MAINTENANT';
        btn.disabled = false;
    }, 2500);
};

window.openWellPassport = function(wellId) {
    // Fill passport with mock data based on ID
    document.getElementById('p-id').textContent = wellId || 'W-00987-B';
    document.getElementById('modal-well-passport').classList.add('active');
};

// Global Check Permission helper
window.checkActionPermission = function(requiredRole) {
    const current = window.mockData.activeUser.role;
    const hierarchy = { 'STUDENT': 1, 'FARMER': 2, 'ENGINEER': 3, 'ADMIN': 4 };
    
    if (hierarchy[current] < hierarchy[requiredRole]) {
        showToast(`This feature requires ${requiredRole} access. Please upgrade.`, 'error');
        openPricingModal();
        return false;
    }
    return true;
};

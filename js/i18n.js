/**
 * GeoWell Super-Multilingual Engine (MutationObserver Edition)
 * Provides 100% Guaranteed Asset & UI Translation Logic
 */

const translations = {
    'en': {
        'brand': 'GEOWELL',
        'tagline': 'Intelligence Water Management Platform',
        'sign_in': 'SIGN IN',
        'create_account': 'CREATE ACCOUNT',
        'email_label': 'EMAIL ADDRESS',
        'pass_label': 'PASSWORD',
        'name_label': 'FULL NAME',
        'inst_label': 'INSTITUTION / COMPANY',
        'role_label': 'ROLE CATEGORY',
        'btn_login': 'LOG IN TO DASHBOARD',
        'btn_signup': 'CREATE & LAUNCH HUB',
        'role_admin': 'Superior (Government/DRE)',
        'role_engineer': 'Premium (GIS Engineer)',
        'role_student': 'Academic (Student)',
        'role_farmer': 'Field User (Farmer)',
        'nav_dashboard': 'Dashboard',
        'nav_map': 'Map View',
        'nav_layers': 'GIS Layers',
        'nav_analytics': 'Analytics Hub',
        'nav_alerts': 'Alerts',
        'nav_wells': 'Wells Manager',
        'nav_assets': 'Asset Inventory',
        'nav_library': 'Knowledge Hub',
        'nav_qgis': 'QGIS Live',
        'search_placeholder': 'Search Name, ID...',
        'neural_btn': 'Neural Analysis',
        'total_wells': 'TOTAL WELLS',
        'active_prod': 'ACTIVE PRODUCTION',
        'daily_output': 'DAILY OUTPUT',
        'efficiency': 'SYSTEM EFFICIENCY',
        'recent_activity': 'Recent Activity',
        'well_passport': 'Well Passport',
        'lng_toast': 'Language set to English',
        'social_google': 'Google',
        'social_microsoft': 'Microsoft',
        'btn_committee': 'COMMITTEE / GUEST ACCESS',
        'wqi_report': 'WQI Report',
        'methodology': 'Methodology',
        'refresh': 'Refresh',
        'well': 'Well',
        'wqi_score': 'WQI Score',
        'status': 'Status',
        'trend': 'Trend (12M)',
        'ai_insight': 'AI Insight',
        'select_wells': 'Select Wells:',
        'analytics_wilaya': 'Wilaya',
        'analytics_daira': 'Daira',
        'global_filter': 'Global Filters',
        'analyze': 'Analyze Dashboard'
    },
    'fr': {
        'brand': 'GEOWELL',
        'tagline': 'Plateforme Intelligente de Gestion de l\'Eau',
        'sign_in': 'SE CONNECTER',
        'create_account': 'CRÉER UN COMPTE',
        'email_label': 'ADRESSE E-MAIL',
        'pass_label': 'MOT DE PASSE',
        'name_label': 'NOM COMPLET',
        'inst_label': 'INSTITUTION / ENTREPRISE',
        'role_label': 'CATÉGORIE DE RÔLE',
        'btn_login': 'ACCÉDER AU TABLEAU DE BORD',
        'btn_signup': 'CRÉER ET LANCER LE HUB',
        'role_admin': 'Supérieur (Gouvernement/DRE)',
        'role_engineer': 'Premium (Ingénieur SIG)',
        'role_student': 'Académique (Étudiant)',
        'role_farmer': 'Utilisateur de terrain (Agriculteur)',
        'nav_dashboard': 'Tableau de Bord',
        'nav_map': 'Vue Carte',
        'nav_layers': 'Couches SIG',
        'nav_analytics': 'Hub d\'Analyses',
        'nav_alerts': 'Alertes',
        'nav_wells': 'Gestion des Puits',
        'nav_assets': 'Inventaire Équipements',
        'nav_library': 'Bibliothèque',
        'nav_qgis': 'Plateforme QGIS',
        'search_placeholder': 'Rechercher Nom, ID...',
        'neural_btn': 'Analyse Neuronale',
        'total_wells': 'PUITS TOTAUX',
        'active_prod': 'PRODUCTION ACTIVE',
        'daily_output': 'DÉBIT QUOTIDIEN',
        'efficiency': 'EFFICACITÉ',
        'recent_activity': 'Activité Récente',
        'well_passport': 'Passeport du Puits',
        'lng_toast': 'Langue: Français',
        'social_google': 'Google',
        'social_microsoft': 'Microsoft',
        'btn_committee': 'ACCÈS COMITÉ / INVITÉ',
        'wqi_report': 'Rapport WQI',
        'methodology': 'Méthodologie',
        'refresh': 'Actualiser',
        'well': 'Puits',
        'wqi_score': 'Score WQI',
        'status': 'Statut',
        'trend': 'Tendance (12M)',
        'ai_insight': 'Aperçu AI',
        'select_wells': 'Sélectionner Puits:',
        'analytics_wilaya': 'Wilaya',
        'analytics_daira': 'Daïra',
        'global_filter': 'Filtres Globaux',
        'analyze': 'Analyser'
    },
    'ar': {
        'brand': 'جيوبئر | GEOWELL',
        'tagline': 'المنصة الذكية لإدارة الموارد المائية',
        'sign_in': 'تسجيل الدخول',
        'create_account': 'إنشاء حساب',
        'email_label': 'البريد الإلكتروني',
        'pass_label': 'كلمة المرور',
        'name_label': 'الاسم الكامل',
        'inst_label': 'المؤسسة / الشركة',
        'role_label': 'فئة الدور',
        'btn_login': 'الدخول للمنصة',
        'btn_signup': 'تشغيل منصة الابتكار',
        'role_admin': 'مسؤول (إدارة/وزارة)',
        'role_engineer': 'خبير (مهندس جيولوجي)',
        'role_student': 'أكاديمي (طالب)',
        'role_farmer': 'مستخدم ميداني (فلاح)',
        'nav_dashboard': 'لوحة التحكم',
        'nav_map': 'عرض الخارطة',
        'nav_layers': 'طبقات البيانات',
        'nav_analytics': 'مركز التحليلات',
        'nav_alerts': 'التنبيهات',
        'nav_wells': 'إدارة الآبار',
        'nav_assets': 'المعدات والأصول',
        'nav_library': 'المكتبة العلمية',
        'nav_qgis': 'بث QGIS المباشر',
        'search_placeholder': 'البحث بالاسم، المعرف...',
        'neural_btn': 'التحليل العصبي المباشر',
        'total_wells': 'إجمالي الآبار',
        'active_prod': 'الإنتاج النشط',
        'daily_output': 'الإنتاج اليومي',
        'efficiency': 'كفاءة النظام',
        'recent_activity': 'آخر النشاطات',
        'well_passport': 'بطاقة هوية البئر',
        'lng_toast': 'تم تغيير اللغة للعربية',
        'social_google': 'جـوجـل',
        'social_microsoft': 'مايكروسوفت',
        'btn_committee': 'دخول اللجنة / زائر',
        'wqi_report': 'تقرير مؤشر الجودة (WQI)',
        'methodology': 'المنهجية العلمية',
        'refresh': 'تحديث البيانات',
        'well': 'البئر',
        'wqi_score': 'مؤشر الجودة',
        'status': 'الحالة',
        'trend': 'الاتجاه (12 شهر)',
        'ai_insight': 'تحليل الذكاء الاصطناعي',
        'select_wells': 'اختر الآبار:',
        'analytics_wilaya': 'الولاية',
        'analytics_daira': 'الدائرة',
        'global_filter': 'التصفية العامة',
        'analyze': 'تحليل البيانات'
    }
};

window.currentLang = localStorage.getItem('geo_lang') || 'en';

window.applyTranslationToElement = function(el) {
    const key = el.getAttribute('data-i18n');
    const dict = translations[window.currentLang];
    if (!dict || !dict[key]) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
    } else if (el.tagName === 'OPTION') {
        el.text = dict[key];
    } else {
        // Logic to preserve Icons while translating text
        const icon = el.querySelector('i');
        if (icon) {
            const iconHtml = icon.outerHTML;
            el.innerHTML = iconHtml + ' ' + `<span class="i18n-text">${dict[key]}</span>`;
        } else {
            el.innerText = dict[key];
        }
    }
};

window.i18nInit = function(lang) {
    const selectedLang = lang || window.currentLang;
    window.currentLang = selectedLang;
    localStorage.setItem('geo_lang', selectedLang);

    // Global Initial Pass
    document.querySelectorAll('[data-i18n]').forEach(el => {
        window.applyTranslationToElement(el);
    });

    // Handle RTL and Fonts
    const html = document.documentElement;
    if (selectedLang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.classList.add('rtl-mode');
        html.style.fontFamily = "'Cairo', 'Outfit', sans-serif";
    } else {
        html.setAttribute('dir', 'ltr');
        html.classList.remove('rtl-mode');
        html.style.fontFamily = "'Outfit', sans-serif";
    }

    console.log(`[i18n Global] Lang synced: ${selectedLang}`);
};

/**
 * THE OBSERVER: The "Secret Weapon" for perfect UI sync
 * This watches for ANY element with data-i18n being added to the DOM
 */
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element
                    if (node.hasAttribute('data-i18n')) window.applyTranslationToElement(node);
                    node.querySelectorAll('[data-i18n]').forEach(el => window.applyTranslationToElement(el));
                }
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

/**
 * Compatibility Aliases
 */
window.getText = (key) => (translations[window.currentLang] || translations['en'])[key] || key;
window.applyTranslations = () => window.i18nInit(window.currentLang);

// Run on boot
document.addEventListener('DOMContentLoaded', () => {
    window.i18nInit(window.currentLang);
});

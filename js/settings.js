// Settings & Localization

const translations = {
    en: {
        dashboard: "Dashboard",
        map_view: "Map View",
        analytics: "Analytics",
        alerts: "Alerts",
        assets: "Assets",
        settings: "Settings",
        wells_manager: "Wells Manager",
        total_wells: "Total Wells",
        active_production: "Active Production",
        daily_output: "Daily Output (bbl)",
        system_efficiency: "System Efficiency",
        rig_status: "Rig Status",
        production_history: "Production History",
        live_alerts: "Live Alerts",
        geospatial_map: "Geospatial Production Map",
        general: "General",
        appearance: "Appearance",
        notifications: "Notifications",
        language: "Language",
        theme: "Theme Mode",
        system_alerts: "System High Priority Alerts",
        prod_updates: "Daily Production Reports",
        // New Keys
        search_placeholder: "Search wells, rig ID, or coordinates...",
        hybrid: "Hybrid",
        terrain: "Terrain",
        view_all: "View All",
        detailed_analytics: "Detailed Analytics",
        analytics_loading: "Advanced Analytics Module Loading...",
        system_alerts_log: "System Alerts Log",
        asset_management: "Asset Management",
        wells_database: "Wells Database",
        add_new_well: "Add New Well",
        edit_well: "Edit Well",
        
        // --- Alerts ---
        alert_critical_level: "Critical static level drop detected",
        alert_high_salinity: "Salinity (TDS) exceeded safety threshold",
        alert_pump_vibration: "Abnormal submersible pump vibration",
        alert_pressure_drop: "Significant pressure drop at wellhead",
        alert_flow_issue: "Flow rate anomaly detected",
        alert_maintenance: "Scheduled maintenance required soon",
        just_now: "Just now",
        mins_ago: "mins ago",
        hours_ago: "hours ago",
        // --------------
        well_id: "ID",
        well_name: "Name",
        well_location: "Location",
        well_status: "Status",
        well_production: "Production (bbl)",
        well_pressure: "Pressure (psi)",
        actions: "Actions",
        save_changes: "Save Changes",
        cancel: "Cancel",
        latitude: "Latitude",
        longitude: "Longitude",
        production_capacity: "Production Capacity",
        confirm_delete: "Are you sure you want to delete this well?",
        status_operational: "Operational",
        status_maintenance: "Maintenance",
        status_offline: "Offline",
        // Well Details Keys
        hydraulics: "Hydraulic Data",
        physical: "Physical Parameters",
        chemical: "Chemical Analysis",
        flow_rate: "Flow Rate (bpd)",
        wellhead_pressure: "Wellhead Pressure (psi)",
        choke_size: "Choke Size (mm)",
        depth: "Depth (ft)",
        temperature: "Temperature (°F)",
        reservoir: "Reservoir Type",
        ph_level: "pH Level",
        h2s_content: "H2S Content (ppm)",
        oil_gravity: "Oil Gravity (API)",
        salinity: "Salinity (ppm)",
        back_to_wells: "Back to Wells",
        // Periodic Logs
        periodic_logs: "Periodic Data Logs",
        log_date: "Date",
        log_notes: "Notes",
        add_log: "Add Log Entry",
        add_log: "Add Log Entry",
        save_log: "Save Log",
        add_log: "Add Log Entry",
        save_log: "Save Log",
        export_csv: "Export CSV",
        google_maps: "Google Maps",
        google_earth: "Google Earth",
        // Library
        digital_library: "Digital Library",
        cat_all: "All Documents",
        cat_reports: "Reports",
        cat_standards: "Standards",
        cat_manuals: "Manuals",
        download: "Download",
        upload_new_doc: "Upload Document",
        
        // --- Library Form ---
        lib_title: "* Title",
        lib_type: "Type",
        lib_type_article: "Article",
        lib_type_report: "Report",
        lib_type_manual: "Manual",
        lib_specialty: "Specialty",
        lib_spec_geo: "Geology",
        lib_spec_hydro: "Hydraulics",
        lib_spec_prod: "Production",
        lib_author: "* Author",
        lib_year: "Year",
        lib_desc: "Description",
        lib_choose_file: "Choose a file",
        lib_no_file: "No file chosen",
        lib_save: "Save Resource",
        lib_cancel: "Cancel",
        table_doc_name: "Document Name",
        table_specialty: "Category / Specialty",
        table_author: "Author & Year",
        table_size: "Size",
        lib_search_placeholder: "Search documents...",
        // --------------------
        analytics_wilaya: "Wilaya / State",
        analytics_daira: "Daira / District",
        analytics_wells: "Wells Selection",
        analyze: "Analyze",
        reset: "Reset",
        precipitation: "Precipitation (mm)",
        static_level: "Static Level (m)",
        global_filter: "Global Filter",
        select_wells: "Wells:",
        chart_temporal: "Static Level vs Precipitation",
        piper_placeholder: "Select wells and click Analyze...",
        all_wilayas: "All Wilayas",
        all_dairas: "All Dairas",
        community_hub: "COMMUNITY HUB",
        community_intelligence: "Batna Sector Intelligence Hub"
    },
    fr: {
        dashboard: "Tableau de Bord",
        map_view: "Carte",
        analytics: "Analytique",
        alerts: "Alertes",
        assets: "Actifs",
        settings: "Paramètres",
        wells_manager: "Gestion des Puits",
        total_wells: "Total Puits",
        active_production: "Production Active",
        daily_output: "Production (bbl)",
        system_efficiency: "Efficacité Système",
        rig_status: "État des Rigs",
        production_history: "Historique Production",
        live_alerts: "Alertes en Direct",
        geospatial_map: "Carte Géospatiale",
        general: "Général",
        appearance: "Apparence",
        notifications: "Notifications",
        language: "Langue",
        theme: "Thème",
        system_alerts: "Alertes Système Prioritaires",
        prod_updates: "Rapports Production",
        // New Keys
        search_placeholder: "Rechercher puits, ID, ou coordonnées...",
        hybrid: "Hybride",
        terrain: "Terrain",
        view_all: "Voir Tout",
        detailed_analytics: "Analytique Détaillée",
        analytics_loading: "Module Analytique en Chargement...",
        system_alerts_log: "Journal des Alertes",
        asset_management: "Gestion des Actifs",
        wells_database: "Base de Données Puits",
        add_new_well: "Ajouter Nouveau Puits",
        edit_well: "Modifier Puits",
        
        // --- Alerts ---
        alert_critical_level: "Baisse critique du niveau statique détectée",
        alert_high_salinity: "Salinité (TDS) supérieure au seuil de sécurité",
        alert_pump_vibration: "Vibration anormale de la pompe immergée",
        alert_pressure_drop: "Chute de pression significative en tête de puits",
        alert_flow_issue: "Anomalie de débit détectée",
        alert_maintenance: "Maintenance préventive requise prochainement",
        just_now: "À l'instant",
        mins_ago: "min",
        hours_ago: "heures",
        // --------------
        well_id: "ID",
        well_name: "Nom",
        well_location: "Emplacement",
        well_status: "Statut",
        well_production: "Production (bbl)",
        well_pressure: "Pression (psi)",
        actions: "Actions",
        save_changes: "Enregistrer",
        cancel: "Annuler",
        latitude: "Latitude",
        longitude: "Longitude",
        production_capacity: "Capacité Production",
        confirm_delete: "Êtes-vous sûr de vouloir supprimer ce puits ?",
        status_operational: "Opérationnel",
        status_maintenance: "Maintenance",
        status_offline: "Hors Ligne",
        // Well Details Keys
        hydraulics: "Données Hydrauliques",
        physical: "Paramètres Physiques",
        chemical: "Analyse Chimique",
        flow_rate: "Débit (bpd)",
        wellhead_pressure: "Pression Tête de Puits",
        choke_size: "Taille de la Duse",
        depth: "Profondeur (ft)",
        temperature: "Température (°F)",
        reservoir: "Type de Réservoir",
        ph_level: "Niveau pH",
        h2s_content: "Teneur H2S (ppm)",
        oil_gravity: "Gravité l'Huile (API)",
        salinity: "Salinité (ppm)",
        back_to_wells: "Retour aux Puits",
        // Periodic Logs
        periodic_logs: "Journaux de Données Périodiques",
        log_date: "Date",
        log_notes: "Remarques",
        add_log: "Ajouter le Journal",
        add_log: "Ajouter le Journal",
        save_log: "Enregistrer",
        add_log: "Ajouter le Journal",
        save_log: "Enregistrer",
        export_csv: "Exporter CSV",
        google_maps: "Google Maps",
        google_earth: "Google Earth",
        // Library
        digital_library: "Bibliothèque Numérique",
        cat_all: "Tous les Documents",
        cat_reports: "Rapports",
        cat_standards: "Normes",
        cat_manuals: "Manuels",
        download: "Télécharger",
        upload_new_doc: "Ajouter Document",
        
        // --- Library Form ---
        lib_title: "* Titre",
        lib_type: "Type",
        lib_type_article: "Article",
        lib_type_report: "Rapport",
        lib_type_manual: "Manuel",
        lib_specialty: "Spécialité",
        lib_spec_geo: "Géologie",
        lib_spec_hydro: "Hydraulique",
        lib_spec_prod: "Production",
        lib_author: "* Auteur",
        lib_year: "Année",
        lib_desc: "Description",
        lib_choose_file: "Choisir un fichier",
        lib_no_file: "Aucun fichier choisi",
        lib_save: "Sauvegarder",
        lib_cancel: "Annuler",
        table_doc_name: "Nom du Document",
        table_specialty: "Catégorie / Spécialité",
        table_author: "Auteur & Année",
        table_size: "Taille",
        lib_search_placeholder: "Rechercher des documents...",
        // --------------------
        analytics_wilaya: "Wilaya / État",
        analytics_daira: "Daira / District",
        analytics_wells: "Sélection des Puits",
        analyze: "Analyser",
        reset: "Réinitialiser",
        precipitation: "Précipitations (mm)",
        static_level: "Niveau Statique (m)",
        global_filter: "Filtre Global",
        select_wells: "Puits :",
        chart_temporal: "Niveau Statique vs Précipitations",
        piper_placeholder: "Sélectionnez des puits et cliquez sur Analyser...",
        all_wilayas: "Toutes les Wilayas",
        all_dairas: "Toutes les Daïras",
        community_hub: "CENTRE COMMUNAUTAIRE",
        community_intelligence: "Centre d'Intelligence : Secteur Batna"
    },
    ar: {
        dashboard: "لوحة القيادة",
        map_view: "الخريطة",
        analytics: "التحليلات",
        alerts: "تنبيهات",
        assets: "أصول ومعدات",
        settings: "الإعدادات",
        wells_manager: "إدارة الآبار",
        total_wells: "إجمالي الآبار",
        active_production: "آبار منتجة",
        daily_output: "الإنتاج اليومي (برميل)",
        system_efficiency: "كفاءة النظام",
        rig_status: "حالة الحفارات",
        production_history: "سجل الإنتاج",
        live_alerts: "تنبيهات حية",
        geospatial_map: "الخريطة الجيومكانية",
        general: "عام",
        appearance: "المظهر",
        notifications: "الإشعارات",
        language: "اللغة",
        theme: "نمط العرض",
        system_alerts: "تنبيهات النظام الهامة",
        prod_updates: "تقارير الإنتاج اليومي",
        // New Keys
        search_placeholder: "ابحث عن بئر، معرف، أو إحداثيات...",
        hybrid: "هجين",
        terrain: "تضاريس",
        view_all: "عرض الكل",
        detailed_analytics: "تحليلات مفصلة",
        analytics_loading: "جاري تحميل وحدة التحليلات...",
        system_alerts_log: "سجل تنبيهات النظام",
        asset_management: "إدارة الأصول",
        wells_database: "قاعدة بيانات الآبار",
        add_new_well: "إضافة بئر جديد",
        edit_well: "تعديل بئر",
        
        // --- Alerts ---
        alert_critical_level: "انخفاض حرج في المستوى الديناميكي للمياه",
        alert_high_salinity: "تجاوزت الملوحة (TDS) حد الأمان المسموح به",
        alert_pump_vibration: "اهتزاز غير طبيعي في المضخة الغاطسة",
        alert_pressure_drop: "انخفاض ملحوظ في الضغط عند رأس البئر",
        alert_flow_issue: "اكتشاف تذبذب غير اعتيادي في معدل التدفق",
        alert_maintenance: "صيانة وقائية مطلوبة قريباً",
        just_now: "الآن",
        mins_ago: "دقيقة مضت",
        hours_ago: "ساعات مضت",
        // --------------
        well_id: "معرف",
        well_name: "الاسم",
        well_location: "الموقع",
        well_status: "الحالة",
        well_production: "الإنتاج (برميل)",
        well_pressure: "الضغط (psi)",
        actions: "إجراءات",
        save_changes: "حفظ التغييرات",
        cancel: "إلغاء",
        latitude: "خط العرض",
        longitude: "خط الطول",
        production_capacity: "القدرة الإنتاجية",
        confirm_delete: "هل أنت متأكد من حذف هذا البئر؟",
        status_operational: "يعمل",
        status_maintenance: "صيانة",
        status_offline: "متوقف",
        // Well Details Keys
        hydraulics: "البيانات الهيدروليكية",
        physical: "المعايير الفيزيائية",
        chemical: "التحليل الكيميائي",
        flow_rate: "معدل التدفق (bpd)",
        wellhead_pressure: "ضغط رأس البئر",
        choke_size: "حجم الخانق",
        depth: "العمق (قدم)",
        temperature: "درجة الحرارة (فهرنهايت)",
        reservoir: "نوع الخزان",
        ph_level: "مستوى الحموضة (pH)",
        h2s_content: "محتوى H2S",
        oil_gravity: "كثافة الزيت (API)",
        salinity: "الملوحة (ppm)",
        back_to_wells: "عودة للقائمة",
        // Periodic Logs
        periodic_logs: "سجل البيانات الدورية",
        log_date: "التاريخ",
        log_notes: "ملاحظات",
        add_log: "إضافة سجل",
        save_log: "حفظ السجل",
        export_csv: "تصدير (Excel)",
        google_maps: "خرائط جوجل",
        google_earth: "جوجل إيرث",
        // Library
        digital_library: "المكتبة الرقمية",
        cat_all: "كل الملفات",
        cat_reports: "تقارير",
        cat_standards: "معايير",
        cat_manuals: "كتيبات",
        download: "تحميل",
        upload_new_doc: "إضافة مورد جديد",
        
        // --- Library Form ---
        lib_title: "* العنوان",
        lib_type: "النوع",
        lib_type_article: "مقال",
        lib_type_report: "تقرير",
        lib_type_manual: "دليل / كتيب",
        lib_specialty: "التخصص",
        lib_spec_geo: "جيولوجيا",
        lib_spec_hydro: "هيدروليكا",
        lib_spec_prod: "إنتاج",
        lib_author: "* المؤلف",
        lib_year: "السنة",
        lib_desc: "الوصف",
        lib_choose_file: "رفع ملف",
        lib_no_file: "لم يتم اختيار أي ملف",
        lib_save: "حفظ المورد",
        lib_cancel: "إلغاء",
        table_doc_name: "اسم المستند",
        table_specialty: "الفئة / التخصص",
        table_author: "المؤلف والسنة",
        table_size: "الحجم",
        lib_search_placeholder: "ابحث عن وثيقة، مؤلف، أو تخصص...",
        // --------------------
        analytics_wilaya: "الولاية",
        analytics_daira: "الدائرة",
        analytics_wells: "اختيار الآبار",
        analyze: "تحليل البيانات",
        reset: "إعادة تعيين",
        precipitation: "التساقط (ملم)",
        static_level: "المستوى الاستاتيكي (م)",
        global_filter: "فلتر عام",
        select_wells: "الآبار:",
        chart_temporal: "المستوى الساكن مقابل التساقط",
        piper_placeholder: "اختر الآبار ثم اضغط تحليل...",
        all_wilayas: "كل الولايات",
        all_dairas: "كل الدوائر",
        community_hub: "مركز المجتمع والخبرات",
        community_intelligence: "مركز ذكاء قطاع باتنة"
    }
};

let currentLang = 'en';

function getText(key) {
    return translations[currentLang][key] || key;
}

function changeLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // RTL Handling
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
    }

    // Update Static Text
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Update Placeholders
    const inputs = document.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update Sidebar
    updateSidebarText(lang);

    // Sync with Community Hub Translation Engine (New)
    if (typeof setCommunityLanguage === 'function') {
        setCommunityLanguage(lang);
    }

    // Refresh Dynamic JS Content
    refreshDynamicContent();
}

function refreshDynamicContent() {
    if (typeof renderKPIs === 'function') renderKPIs();
    if (typeof renderWellsTable === 'function') renderWellsTable();
    // Re-render chart title if needed
}


function updateSidebarText(lang) {
    const navItems = document.querySelectorAll('.nav-item');
    const setNav = (view, textKey) => {
        const item = document.querySelector(`.nav-item[data-view="${view}"] span`);
        if (item && translations[lang][textKey]) item.innerText = translations[lang][textKey];
    };

    setNav('dashboard', 'dashboard');
    setNav('map', 'map_view');
    setNav('analytics', 'analytics');
    setNav('alerts', 'alerts');
    setNav('assets', 'assets');
    setNav('wells', 'wells_manager');
    setNav('settings', 'settings');
}

// Appearance & Theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('geo-well-theme', theme);

    // Update buttons
    const btnDark = document.getElementById('btnThemeDark');
    const btnLight = document.getElementById('btnThemeLight');

    if (btnDark && btnLight) {
        if (theme === 'dark') {
            btnDark.classList.add('active');
            btnLight.classList.remove('active');
        } else {
            btnDark.classList.remove('active');
            btnLight.classList.add('active');
        }
    }
}

// Notifications
function toggleNotifications(type, enabled) {
    const settings = JSON.parse(localStorage.getItem('geo-well-notifications') || '{"alerts": true, "updates": true}');
    settings[type] = enabled;
    localStorage.setItem('geo-well-notifications', JSON.stringify(settings));
    console.log(`Notifications for ${type}: ${enabled}`);
}

// Initialize Settings on Load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('geo-well-theme') || 'dark';
    setTheme(savedTheme);

    const savedLang = document.getElementById('langSelect')?.value || 'en';
    // We don't auto-change language here to avoid issues with initial load, 
    // but the UI should match the default.
});

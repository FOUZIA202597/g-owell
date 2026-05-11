// Selection Data for Smart Dropdowns
const selectionData = {
    countries: ["Algeria"],
    wellTypes: ["Production", "Exploration", "Irrigation", "Drinking Water", "Industrial", "Monitoring"],
    pumpTypes: ["Submersible", "Centrifugal", "Horizontal Multi-stage", "Vertical Turbine", "Reciprocating", "None"],
    usages: ["Oil/Gas Extraction", "Agricultural Irrigation", "Public Supply", "Industrial Use", "Livestock", "Geothermal"],
    statuses: [
        { id: "operational", label: "Operational" },
        { id: "maintenance", label: "In Maintenance" },
        { id: "offline", label: "Offline" },
        { id: "planned", label: "Planned/New" }
    ],
    years: Array.from({ length: 11 }, (_, i) => 2020 + i),
    months: Array.from({ length: 12 }, (_, i) => i + 1),
    days: Array.from({ length: 31 }, (_, i) => i + 1),
    chemicals: {
        cations: ["Na", "Ca", "Mg", "K", "Fe", "Mn"],
        anions: ["Cl", "SO4", "HCO3", "NO3", "CO3", "PO4"]
    }
};

const geographicData = {
    states: {
        "Algeria": ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"]
    },
    districts: {
        "Adrar": ["Adrar", "Fenoughil", "Aoulef", "Reggane", "T'Sabit", "Zaouiet Kounta"],
        "Chlef": ["Chlef", "Ténès", "Ouled Farès", "Boukadir", "Oued Fodda", "Abou El Hassan", "El Karimia", "El Marsa", "Taougrit", "Aïn Merane", "Moussadik", "Beni Haoua", "Oued Sly"],
        "Laghouat": ["Laghouat", "Ksar El Hirane", "Sidi Makhlouf", "Hassi R'Mel", "Ain Madhi", "Tadjemout", "El Ghicha", "Brida", "Gueltat Sidi Saad", "Aflou"],
        "Oum El Bouaghi": ["Oum El Bouaghi", "Ain Beida", "Ain M'lila", "Ain Babouche", "Ain Kercha", "Dhalaa", "F'Kirina", "Meskiana", "Souk Naamane"],
        "Batna": ["Ain Djasser", "Ain Touta", "Arris", "Barika", "Batna", "Bouzina", "Chemora", "Djezzar", "El Madher", "Ichmoul", "Menaa", "Merouana", "N'Gaous", "Ouled Si Slimane", "Ras El Aioun", "Seggana", "Seriana", "Tazoult", "Theniet El Abed", "Timgad", "T'kout"],
        "Béjaïa": ["Béjaïa", "Adekar", "Akbou", "Amizour", "Aokas", "Barbacha", "Chemini", "Darguina", "El Kseur", "Ighil Ali", "Kherrata", "Oued Amizour", "Seddouk", "Sidi Aïch", "Souk El Ténine", "Tazmalt", "Tichy", "Timezrit"],
        "Biskra": ["Biskra", "El Kantara", "El Outaya", "Foughala", "M'Chouneche", "Ourlal", "Sidi Okba", "Tolga", "Zeribet El Oued"],
        "Béchar": ["Béchar", "Abadla", "Kenadsa", "Lahmar", "Taghit"],
        "Blida": ["Blida", "Boufarik", "Bougara", "Bouinan", "El Affroun", "Larbaa", "Meftah", "Mouzaïa", "Ouled Yaïch"],
        "Bouira": ["Bouira", "Ain Bessem", "Bechloul", "Bir Ghbalou", "Bordj Okhriss", "Haizer", "Kadiria", "Lakhdaria", "M'Chedallah", "Souk El Khemis", "Sour El Ghozlane"],
        "Tamanrasset": ["Tamanrasset", "Abelssa"],
        "Tébessa": ["Tébessa", "Bir El Ater", "Cheria", "El Kouif", "El Ogla", "Morsott", "Negrine", "Ouenza", "Umm Ali"],
        "Tlemcen": ["Tlemcen", "Ain Tallout", "Bab El Assa", "Beni Boussaid", "Beni Snous", "Bensekrane", "Chetouane", "Fellaoucene", "Ghazaouet", "Hennaya", "Hounaïne", "Maghnia", "Mansourah", "Marsa Ben M'Hidi", "Nedroma", "Ouled Mimoun", "Remchi", "Sabra", "Sebdou", "Sidi Djillali"],
        "Tiaret": ["Tiaret", "Ain Deheb", "Ain Kermes", "Dahmouni", "Frenda", "Hamadia", "Ksar Chellala", "Mahdia", "Mechraa Safa", "Medroussa", "Meghila", "Oued Lili", "Rahouia", "Sougueur"],
        "Tizi Ouzou": ["Tizi Ouzou", "Ain El Hammam", "Azazga", "Azeffoun", "Beni Douala", "Beni Yenni", "Boghni", "Bouzguen", "Draa Ben Khedda", "Draa El Mizan", "Iferhounene", "Larbaâ Nath Irathen", "Maatkas", "Makouda", "Mekla", "Ouacif", "Ouadhias", "Ouaguenoun", "Tigzirt", "Tizi Gheniff"],
        "Alger": ["Alger Centre", "Bab El Oued", "Baraki", "Bir Mourad Raïs", "Birtouta", "Bouzareah", "Chéraga", "Dar El Beïda", "Draria", "El Harrach", "Hussein Dey", "Rouïba", "Sidi M'Hamed", "Zeralda"],
        "Djelfa": ["Djelfa", "Ain El Ibel", "Ain Oussera", "Birine", "Charef", "Dar Chioukh", "El Idrissia", "Faidh El Botma", "Had Sahary", "Hassi Bahbah", "Messaad", "Sidi Laadjel"],
        "Jijel": ["Jijel", "Chekfa", "El Ancer", "El Aouana", "El Milia", "Djimla", "Settara", "Taher", "Texenna", "Ziama Mansouriah"],
        "Sétif": ["Sétif", "Ain Arnat", "Ain Azel", "Ain El Kebira", "Ain Oulmene", "Amoucha", "Babors", "Beni Aziz", "Beni Ouartilane", "Bir El Arch", "Bouandas", "Bougaa", "Djemila", "El Eulma", "Guenzet", "Hammam Guergour", "Hammam Souhna", "Maoklane", "Salah Bey"],
        "Saïda": ["Saïda", "Ain El Hadjar", "El Hassasna", "Ouled Brahim", "Sidi Boubekeur", "Youb"],
        "Skikda": ["Skikda", "Ain Kechra", "Azzaba", "Ben Azzouz", "Collo", "El Hadaiek", "El Harrouch", "Ouled Attia", "Oued Zhour", "Ramdane Djamel", "Sidi Mezghiche", "Tamalous", "Zitouna"],
        "Sidi Bel Abbès": ["Sidi Bel Abbès", "Ain El Berd", "Ben Badis", "Marhoum", "Merine", "Moulay Slissen", "Mostefa Ben Brahim", "Ras El Ma", "Sfisef", "Sidi Ali Ben Youb", "Sidi Ali Boussidi", "Sidi Lahcene", "Telagh", "Tenira", "Tessala"],
        "Annaba": ["Annaba", "Berrahal", "El Hadjar", "El Bouni", "Chetaïbi"],
        "Guelma": ["Guelma", "Ain Makhlouf", "Bouchegouf", "Guelaat Bou Sbaâ", "Hammam Debagh", "Hammam N'Bail", "Heliopolis", "Houari Boumediene", "Oued Zenati"],
        "Constantine": ["Constantine", "Ain Abid", "El Khroub", "Hamma Bouziane", "Ibn Ziad", "Zighoud Youcef"],
        "Médéa": ["Médéa", "Aziz", "Beni Slimane", "Berrouaghia", "Chahbounia", "Chellalat El Adhaoura", "El Azizia", "El Omaria", "Guelb El Kebir", "Ksar Boukhari", "Ouamri", "Ouzera", "Seghouane", "Si Mahdjoub", "Sidi Naamane", "Souagui", "Tablat"],
        "Mostaganem": ["Mostaganem", "Achacha", "Ain Nouïssy", "Ain Tédelès", "Bouguirat", "Hassiane E'Toual", "Kheïreddine", "Mesra", "Sidi Ali", "Sidi Lakhdar"],
        "M'Sila": ["M'Sila", "Ain El Hadjel", "Ben Srour", "Bou Saada", "Chellal", "Djebel M'saad", "Hammam Dalâa", "Khoubana", "Magra", "Medjedel", "Ouled Derradj", "Ouled Sidi Brahim", "Sidi Aïssa", "Tamer"],
        "Mascara": ["Mascara", "Ain Fekan", "Ain Farès", "Bou Hanifia", "El Bordj", "Ghriss", "Hachem", "Mohammadia", "Oued El Abtal", "Oued Taria", "Sig", "Tighennif", "Tizi", "Zahana"],
        "Ouargla": ["Ouargla", "El Borma", "Hassi Messaoud", "N'Goussa", "Sidi Khouiled"],
        "Oran": ["Oran", "Ain El Turk", "Arzew", "Bethioua", "Bir El Djir", "Es Senia", "Gdyel", "Oued Tlelat", "Boutlélis"],
        "El Bayadh": ["El Bayadh", "Bougtob", "Boussemghoun", "Brezina", "Chellala", "El Abiodh Sidi Cheikh", "Rogassa"],
        "Illizi": ["Illizi", "In Amenas"],
        "Bordj Bou Arréridj": ["Bordj Bou Arréridj", "Ain Taghrout", "Bir Kasdali", "Bordj Ghedir", "Bordj Zemoura", "El M'hir", "Mansoura", "Medjana", "Ras El Oued"],
        "Boumerdès": ["Boumerdès", "Baghlia", "Bordj Menaiel", "Boudouaou", "Dellys", "Isser", "Khemis El Khechna", "Naciria", "Thénia"],
        "El Tarf": ["El Tarf", "Ben M'Hidi", "Besbes", "Bouhadjar", "Bouteldja", "El Kala"],
        "Tindouf": ["Tindouf"],
        "Tissemsilt": ["Tissemsilt", "Ammari", "Bordj Bou Naama", "Bordj El Emir Abdelkader", "Khemisti", "Lardjem", "Lazharia", "Theniet El Had"],
        "El Oued": ["El Oued", "Bayadha", "Debila", "Guemar", "Magrane", "Mih Ouensa", "Reguiba"],
        "Khenchela": ["Khenchela", "Ain Touila", "Babar", "Bouhmama", "Chechar", "El Hamma", "Kais", "Ouled Rechache"],
        "Souk Ahras": ["Souk Ahras", "Bir Bou Haouch", "Haddada", "M'daourouch", "Mechroha", "Merahna", "Ouled Driss", "Sedrata", "Taoura"],
        "Tipaza": ["Tipaza", "Ahmer El Ain", "Bouismail", "Cherchell", "Damous", "Fouka", "Hadjout", "Koléa", "Menaceur", "Sidi Amar"],
        "Mila": ["Mila", "Ain Beida Harriche", "Chelghoum Laid", "Ferdjioua", "Grarem Gouga", "Oued Endja", "Rouached", "Sidi Merouane", "Tadjenanet", "Telerghma", "Terraia"],
        "Aïn Defla": ["Ain Defla", "Ain Lechiakh", "Bathia", "Bordj El Emir Khaled", "Boumedfaâ", "Djendel", "Djelida", "El Abadia", "El Amra", "El Attaf", "Hammam Righa", "Khemis Miliana", "Miliana", "Rouina"],
        "Naâma": ["Naâma", "Ain Sefra", "Asla", "Mecheria", "Moghrar", "Makman Ben Amer"],
        "Aïn Témouchent": ["Ain Témouchent", "Ain Kihal", "Ain Larbaâ", "Beni Saf", "El Amria", "El Maleh", "Hammam Bou Hadjar", "Oulhaça Gheraba"],
        "Ghardaïa": ["Ghardaïa", "Berriane", "El Guerrara", "Metlili", "Zelfana"],
        "Relizane": ["Relizane", "Ain Tarik", "Ammi Moussa", "Djidiouia", "El Hamadna", "El Matmar", "Mazouna", "Mendes", "Oued Rhiou", "Ramka", "Sidi M'Hamed Ben Ali", "Yellel", "Zemmora"],
        "Timimoun": ["Timimoun", "Aougrout", "Charouine"],
        "Bordj Badji Mokhtar": ["Bordj Badji Mokhtar"],
        "Ouled Djellal": ["Ouled Djellal", "Sidi Khaled"],
        "Béni Abbès": ["Béni Abbès", "Kerzaz", "El Ouata", "Tabelbala", "Ouled Khodeir", "Igli"],
        "In Salah": ["In Salah", "In Ghar"],
        "In Guezzam": ["In Guezzam", "Tin Zaouatine"],
        "Touggourt": ["Touggourt", "Temacine", "Megarine", "Taibet"],
        "Djanet": ["Djanet", "Bordj El Haouas"],
        "El M'Ghair": ["El M'Ghair", "Djamaa"],
        "El Meniaa": ["El Meniaa", "Mansoura"]
    }
};

// Mock Data for Geo Well Platform (Demo)
window.mockData = {
    overview: {
        totalWells: 145,
        activeWells: 112,
        dailyProduction: 58400,
        efficiency: 96
    },
    rigs: [
        // --- AIN DJASSER DENSE NETWORK (For Contour Generation) ---
        { id: "AD-01", name: "Ain Djasser N1", state: "Batna", district: "Ain Djasser", location: "North Zone", status: "operational", lat: 35.880, lng: 5.960, hydraulics: { piezometricLevel: 350 }, chemical: { cations: { Ca: 96, Mg: 22, Na: 18, K: 3 }, anions: { HCO3: 280, SO4: 145, Cl: 42, NO3: 8 } } },
        { id: "AD-02", name: "Ain Djasser N2", state: "Batna", district: "Ain Djasser", location: "North Zone", status: "operational", lat: 35.885, lng: 5.970, hydraulics: { piezometricLevel: 345 }, chemical: { cations: { Ca: 42, Mg: 18, Na: 124, K: 9 }, anions: { HCO3: 128, SO4: 88, Cl: 196, NO3: 4 } } },
        { id: "AD-03", name: "Ain Djasser N3", state: "Batna", district: "Ain Djasser", location: "North Zone", status: "operational", lat: 35.890, lng: 5.980, hydraulics: { piezometricLevel: 340 }, chemical: { cations: { Ca: 110, Mg: 38, Na: 14, K: 2 }, anions: { HCO3: 320, SO4: 195, Cl: 22, NO3: 5 } } },
        { id: "AD-04", name: "Ain Djasser N4", state: "Batna", district: "Ain Djasser", location: "North Zone", status: "operational", lat: 35.895, lng: 5.990, hydraulics: { piezometricLevel: 338 }, chemical: { cations: { Ca: 78, Mg: 30, Na: 55, K: 5 }, anions: { HCO3: 220, SO4: 210, Cl: 66, NO3: 12 } } },
        { id: "AD-05", name: "Ain Djasser N5", state: "Batna", district: "Ain Djasser", location: "North Zone", status: "operational", lat: 35.875, lng: 6.000, hydraulics: { piezometricLevel: 335 }, chemical: { cations: { Ca: 52, Mg: 14, Na: 88, K: 7 }, anions: { HCO3: 164, SO4: 72, Cl: 142, NO3: 3 } } },
        { id: "AD-06", name: "Ain Djasser E1", state: "Batna", district: "Ain Djasser", location: "East Zone", status: "operational", lat: 35.870, lng: 6.010, hydraulics: { piezometricLevel: 330 }, chemical: { cations: { Ca: 120, Mg: 45, Na: 22, K: 4 }, anions: { HCO3: 290, SO4: 280, Cl: 35, NO3: 6 } } },
        { id: "AD-07", name: "Ain Djasser E2", state: "Batna", district: "Ain Djasser", location: "East Zone", status: "operational", lat: 35.865, lng: 6.020, hydraulics: { piezometricLevel: 325 }, chemical: { cations: { Ca: 30, Mg: 12, Na: 148, K: 11 }, anions: { HCO3: 95, SO4: 55, Cl: 230, NO3: 2 } } },
        { id: "AD-08", name: "Ain Djasser E3", state: "Batna", district: "Ain Djasser", location: "East Zone", status: "operational", lat: 35.860, lng: 6.030, hydraulics: { piezometricLevel: 320 }, chemical: { cations: { Ca: 88, Mg: 28, Na: 48, K: 6 }, anions: { HCO3: 240, SO4: 168, Cl: 58, NO3: 10 } } },
        { id: "AD-09", name: "Ain Djasser S1", state: "Batna", district: "Ain Djasser", location: "South Zone", status: "operational", lat: 35.850, lng: 5.990, hydraulics: { piezometricLevel: 328 }, chemical: { cations: { Ca: 105, Mg: 35, Na: 28, K: 3 }, anions: { HCO3: 350, SO4: 125, Cl: 28, NO3: 7 } } },
        { id: "AD-10", name: "Ain Djasser S2", state: "Batna", district: "Ain Djasser", location: "South Zone", status: "operational", lat: 35.845, lng: 5.980, hydraulics: { piezometricLevel: 332 } },
        { id: "AD-11", name: "Ain Djasser S3", state: "Batna", district: "Ain Djasser", location: "South Zone", status: "operational", lat: 35.840, lng: 5.970, hydraulics: { piezometricLevel: 336 } },
        { id: "AD-12", name: "Ain Djasser W1", state: "Batna", district: "Ain Djasser", location: "West Zone", status: "operational", lat: 35.855, lng: 5.950, hydraulics: { piezometricLevel: 342 } },
        { id: "AD-13", name: "Ain Djasser W2", state: "Batna", district: "Ain Djasser", location: "West Zone", status: "operational", lat: 35.865, lng: 5.940, hydraulics: { piezometricLevel: 348 } },
        { id: "AD-14", name: "Ain Djasser W3", state: "Batna", district: "Ain Djasser", location: "West Zone", status: "operational", lat: 35.875, lng: 5.930, hydraulics: { piezometricLevel: 355 } },
        { id: "AD-15", name: "Ain Djasser C1", state: "Batna", district: "Ain Djasser", location: "Central Zone", status: "operational", lat: 35.870, lng: 5.975, hydraulics: { piezometricLevel: 340 } },
        { id: "AD-16", name: "Ain Djasser C2", state: "Batna", district: "Ain Djasser", location: "Central Zone", status: "operational", lat: 35.860, lng: 5.985, hydraulics: { piezometricLevel: 330 } },
        { id: "AD-17", name: "Ain Djasser C3", state: "Batna", district: "Ain Djasser", location: "Central Zone", status: "operational", lat: 35.880, lng: 5.995, hydraulics: { piezometricLevel: 335 } },
        { id: "AD-18", name: "Ain Djasser Hill", state: "Batna", district: "Ain Djasser", location: "Highland", status: "operational", lat: 35.900, lng: 5.950, hydraulics: { piezometricLevel: 360 } },
        { id: "AD-19", name: "Ain Djasser Low", state: "Batna", district: "Ain Djasser", location: "Lowland", status: "operational", lat: 35.830, lng: 6.040, hydraulics: { piezometricLevel: 310 } },
        { id: "AD-20", name: "Ain Djasser Deep", state: "Batna", district: "Ain Djasser", location: "Deep Basin", status: "maintenance", lat: 35.890, lng: 6.010, hydraulics: { piezometricLevel: 337 } },
        {
            id: "F-7",
            name: "Ain Djasser F7",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Jebel Roknia North", status: "operational",
            lat: 35.855073, lng: 5.955746,
            wellType: "Production", depth: 54, pumpType: "Centrifugal", usage: "Agricultural",
            hydraulics: { staticLevel: 18, dynamicLevel: 35, piezometricLevel: 25, discharge: 60, distance: 0.8 },
            physical: { temp: 21, ph: 7.56, tds: 675, conductivity: 1350 },
            chemical: {
                cations: { Na: 464, Ca: 122, Mg: 57, K: 10 },
                anions: { Cl: 319, SO4: 365, HCO3: 299, NO3: 82 }
            },
            logs: []
        },
        {
            id: "F-09",
            name: "Ain Djasser F09",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Aghmroual West", status: "maintenance",
            lat: 35.844194, lng: 5.963331,
            wellType: "Exploration", depth: 40, pumpType: "None", usage: "Monitoring",
            hydraulics: { staticLevel: 12, dynamicLevel: 12, piezometricLevel: 10, discharge: 0, distance: 2.5 },
            physical: { temp: 20, ph: 7.35, tds: 980, conductivity: 1960 },
            chemical: {
                cations: { Na: 170, Ca: 78, Mg: 48, K: 11 },
                anions: { Cl: 53, SO4: 199, HCO3: 342, NO3: 125 }
            },
            logs: []
        },
        {
            id: "F-02",
            name: "Ain Djasser F02",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "North Plain", status: "operational",
            lat: 35.901, lng: 5.982,
            wellType: "Production", depth: 154, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 25, dynamicLevel: 42, piezometricLevel: 28, discharge: 40, distance: 1.1 },
            physical: { temp: 22, ph: 7.2, tds: 1100, conductivity: 2100 },
            chemical: {
                cations: { Na: 320, Ca: 180, Mg: 95, K: 12 },
                anions: { Cl: 410, SO4: 380, HCO3: 310, NO3: 45 }
            },
            logs: []
        },
        {
            id: "F-05",
            name: "Ain Djasser F05",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Central Aquifer", status: "operational",
            lat: 35.862, lng: 5.975,
            wellType: "Production", depth: 120, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 30, dynamicLevel: 55, piezometricLevel: 35, discharge: 50, distance: 0.9 },
            physical: { temp: 23, ph: 7.8, tds: 850, conductivity: 1700 },
            chemical: {
                cations: { Na: 210, Ca: 140, Mg: 65, K: 8 },
                anions: { Cl: 250, SO4: 290, HCO3: 360, NO3: 22 }
            },
            logs: []
        },
        {
            id: "F-14",
            name: "Ain Djasser F14",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Southern Boundary", status: "operational",
            lat: 35.821, lng: 5.952,
            wellType: "Production", depth: 210, pumpType: "Submersible", usage: "Industrial",
            hydraulics: { staticLevel: 50, dynamicLevel: 75, piezometricLevel: 55, discharge: 70, distance: 2.1 },
            physical: { temp: 24, ph: 7.4, tds: 1400, conductivity: 2800 },
            chemical: {
                cations: { Na: 540, Ca: 210, Mg: 110, K: 15 },
                anions: { Cl: 680, SO4: 520, HCO3: 290, NO3: 38 }
            },
            logs: []
        },
        // --- P SERIES (From Table 2) ---
        {
            id: "P-1",
            name: "Ain Djasser P1",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Sector P-Alpha", status: "operational",
            lat: 35.8763, lng: 6.009,
            wellType: "Production", depth: 923, pumpType: "Submersible", usage: "Industrial",
            hydraulics: { staticLevel: 22, dynamicLevel: 20, piezometricLevel: 78, discharge: 196, distance: 0.5 },
            physical: { temp: 25, ph: 8.0, tds: 980, conductivity: 1960 },
            chemical: {
                cations: { Na: 150, Ca: 296, Mg: 140, K: 9 },
                anions: { Cl: 930, SO4: 465, HCO3: 287, NO3: 33 }
            },
            logs: []
        },
        {
            id: "P-2",
            name: "Ain Djasser P2",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Sector P-Bravo", status: "operational",
            lat: 35.8794, lng: 6.0072,
            wellType: "Production", depth: 884, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 22, dynamicLevel: 25, piezometricLevel: 130, discharge: 190, distance: 0.6 },
            physical: { temp: 24, ph: 8.2, tds: 980, conductivity: 1900 },
            chemical: { cations: { Na: 180 }, anions: { Cl: 300 } },
            logs: []
        },
        {
            id: "P-6",
            name: "Ain Djasser P6",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Sector P-Echo", status: "operational",
            lat: 35.855, lng: 5.978,
            wellType: "Irrigation", depth: 865, pumpType: "Centrifugal", usage: "Agricultural",
            hydraulics: { staticLevel: 28, dynamicLevel: 24, piezometricLevel: 40, discharge: 156, distance: 1.1 },
            physical: { temp: 23, ph: 8.1, tds: 820, conductivity: 1560 },
            chemical: { cations: { Na: 210 }, anions: { Cl: 250 } },
            logs: []
        },
        {
            id: "P-13",
            name: "Ain Djasser P13",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "South Sector", status: "operational",
            lat: 35.8488, lng: 6.003,
            wellType: "Production", depth: 907, pumpType: "Submersible", usage: "Industrial",
            hydraulics: { staticLevel: 37, dynamicLevel: 40, piezometricLevel: 38, discharge: 139, distance: 1.5 },
            physical: { temp: 24, ph: 7.36, tds: 695, conductivity: 1390 },
            chemical: {
                cations: { Na: 452, Ca: 244, Mg: 82, K: 12 },
                anions: { Cl: 1005, SO4: 621, HCO3: 287, NO3: 76 }
            },
            logs: []
        },
        {
            id: "F-4",
            name: "Ain Djasser Sud",
            country: "Algeria",
            state: "Batna",
            district: "Ain Djasser",
            lat: 35.8600,
            lng: 6.0100,
            status: "operational",
            wellType: "Irrigation",
            depth: 380,
            hydraulics: { staticLevel: 90, dynamicLevel: 120, discharge: 35, piezometricLevel: 290 },
            chemical: { cations: { Na: 140, Ca: 90 }, anions: { Cl: 200, SO4: 230 } },
            physical: { temp: 27.0, ph: 7.6 }
        },
        {
            id: "F-5",
            name: "Ain Djasser Nord",
            country: "Algeria",
            state: "Batna",
            district: "Ain Djasser",
            lat: 35.9100,
            lng: 6.0300,
            status: "maintenance",
            wellType: "Drinking Water",
            depth: 500,
            hydraulics: { staticLevel: 80, dynamicLevel: 105, discharge: 50, piezometricLevel: 420 },
            chemical: { cations: { Na: 100, Ca: 80 }, anions: { Cl: 150, SO4: 190 } },
            physical: { temp: 29.0, ph: 7.2 }
        },
        // --- LEGAL PERMITS SERIES (From Municipal Registry) ---
        {
            id: "L-870",
            name: "Boudjenah Issa",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Mechta L'adjedjna", status: "operational",
            lat: 35.8900, lng: 5.9800,
            wellType: "Production", depth: 200, pumpType: "Submersible", usage: "Agricultural",
            legal: { permitNo: "870", date: "21/08/2000", depthAuth: 200, dischargeAuth: null },
            notes: "Permit updated 03/03/2021 (Deepening from 30m to 200m)"
        },
        {
            id: "L-2160",
            name: "EAC Bouchareb Youssef 03",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Douar Bouazzal", status: "operational",
            lat: 35.8950, lng: 5.9900,
            wellType: "Production", depth: 150, pumpType: "Submersible", usage: "Agricultural",
            legal: { permitNo: "2160", date: "08/02/2004", depthAuth: 150, dischargeAuth: 2 },
            notes: "Deepening permit No. 169 (20/01/2021)"
        },
        {
            id: "L-1709",
            name: "Bouqueroula Mahfoud",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Bled Ben Terraf", status: "operational",
            lat: 35.8600, lng: 6.0337, // Converted from 35°51'36"N 6°2'1"E
            wellType: "Production", depth: 180, pumpType: "Submersible", usage: "Agricultural",
            legal: { permitNo: "1709", date: "20/09/2006", depthAuth: 180, dischargeAuth: null }
        },
        {
            id: "L-2131",
            name: "Ben Ali Ahmed",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Mechta Ouled Sebaa", status: "operational",
            lat: 35.8450, lng: 6.0150,
            wellType: "Production", depth: 180, pumpType: "Submersible", usage: "Agricultural",
            legal: { permitNo: "2131", date: "15/09/2008", depthAuth: 180, dischargeAuth: null },
            notes: "Deepened from 150m to 180m (25/04/2019)"
        },
        {
            id: "L-2397",
            name: "Kemouach Farid",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Draa Ben Terraf", status: "operational",
            lat: 35.8650, lng: 6.0250,
            wellType: "Production", depth: 120, pumpType: "Submersible", usage: "Agricultural",
            legal: { permitNo: "2397", date: "15/10/2009", depthAuth: 120, dischargeAuth: null }
        },
        {
            id: "L-1418",
            name: "Shatouh Hussein",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Echaba Zone", status: "operational",
            lat: 35.8580, lng: 5.9980,
            wellType: "Production", depth: 200, pumpType: "Submersible", usage: "Agricultural",
            legal: { permitNo: "1418", date: "16/10/2007", depthAuth: 200, dischargeAuth: null },
            notes: "Last deepening 13/09/2022 to 200m"
        },
        {
            id: "L-1281",
            name: "Heirs of Nizar Ali",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Bou-Touil", status: "operational",
            lat: 35.8720, lng: 5.9650,
            wellType: "Traditional", depth: 30, pumpType: "Manual", usage: "Domestic",
            legal: { permitNo: "1281", date: "24/11/1999", depthAuth: 30, dischargeAuth: 3 },
            notes: "Traditional Well Registry"
        },
        {
            id: "L-991",
            name: "Bannour Saed",
            country: "Algeria", state: "Batna", district: "Ain Djasser",
            location: "Chouf Gherab", status: "operational",
            lat: 35.8820, lng: 5.9850,
            wellType: "Production", depth: 100, pumpType: "Submersible", usage: "Agricultural",
            legal: { permitNo: "991", date: "11/05/2008", depthAuth: 100, dischargeAuth: null }
        },
        // --- M SERIES (Merouana Basin) ---
        {
            id: "M-F1",
            name: "Merouana F1",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "North Basin Sector", status: "operational",
            lat: 35.68375, lng: 5.86955556,
            wellType: "Production", depth: 884, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 97, piezometricLevel: 787, wellDepth: 884 }
        },
        {
            id: "M-F2",
            name: "Merouana F2",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "West Basin Sector", status: "operational",
            lat: 35.65716722, lng: 5.80356917,
            wellType: "Production", depth: 877, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 31.4, piezometricLevel: 845.6, wellDepth: 877 }
        },
        {
            id: "M-F3",
            name: "Merouana F3",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "Central Basin Sector", status: "operational",
            lat: 35.66207778, lng: 5.80460556,
            wellType: "Production", depth: 872, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 70, piezometricLevel: 802, wellDepth: 872 }
        },
        {
            id: "M-F4",
            name: "Merouana F4",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "North-East Sector", status: "operational",
            lat: 35.68866056, lng: 5.89790722,
            wellType: "Production", depth: 897, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 64, piezometricLevel: 833, wellDepth: 897 }
        },
        {
            id: "M-F5",
            name: "Merouana F5",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "North-East Sector", status: "operational",
            lat: 35.69535861, lng: 5.89554361,
            wellType: "Production", depth: 897, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 62, piezometricLevel: 835, wellDepth: 897 }
        },
        {
            id: "M-F6",
            name: "Merouana F6",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "North-Central Sector", status: "operational",
            lat: 35.70124722, lng: 5.89108417,
            wellType: "Production", depth: 895, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 56, piezometricLevel: 839, wellDepth: 895 }
        },
        {
            id: "M-F7",
            name: "Merouana F7",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "North-Central Sector", status: "operational",
            lat: 35.70788167, lng: 5.88720694,
            wellType: "Production", depth: 896, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 78, piezometricLevel: 818, wellDepth: 896 }
        },
        {
            id: "M-F8F",
            name: "Merouana F8f",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "North Sector", status: "operational",
            lat: 35.70921139, lng: 5.87726639,
            wellType: "Production", depth: 893, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 91, piezometricLevel: 802, wellDepth: 893 }
        },
        {
            id: "M-F9",
            name: "Merouana F9",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "North-East Sector", status: "operational",
            lat: 35.68700389, lng: 5.89315361,
            wellType: "Production", depth: 897, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 60, piezometricLevel: 837, wellDepth: 897 }
        },
        {
            id: "M-F10",
            name: "Merouana F10",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "East Sector", status: "operational",
            lat: 35.68972222, lng: 5.89666667,
            wellType: "Production", depth: 896, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 68, piezometricLevel: 828, wellDepth: 896 }
        },
        {
            id: "M-F11",
            name: "Merouana F11",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "East Sector", status: "operational",
            lat: 35.69192944, lng: 5.94066556,
            wellType: "Production", depth: 959, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 70.4, piezometricLevel: 888.6, wellDepth: 959 }
        },
        {
            id: "M-F12",
            name: "Merouana F12",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "Mountain Sector", status: "operational",
            lat: 35.70502778, lng: 5.97255556,
            wellType: "Exploration", depth: 1062, pumpType: "None", usage: "Monitoring",
            hydraulics: { staticLevel: 82.66, piezometricLevel: 979.34, wellDepth: 1062 }
        },
        {
            id: "M-F13",
            name: "Merouana F13",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "Central-East Sector", status: "operational",
            lat: 35.68788889, lng: 5.93894444,
            wellType: "Production", depth: 941, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 47.6, piezometricLevel: 893.4, wellDepth: 941 }
        },
        {
            id: "M-F14",
            name: "Merouana F14",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "Central Sector", status: "operational",
            lat: 35.70580556, lng: 5.89236111,
            wellType: "Production", depth: 937, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 50.5, piezometricLevel: 886.5, wellDepth: 937 }
        },
        {
            id: "M-F15",
            name: "Merouana F15",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "Highland Sector", status: "operational",
            lat: 35.70338889, lng: 5.87947667,
            wellType: "Production", depth: 953, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 53.4, piezometricLevel: 899.6, wellDepth: 953 }
        },
        {
            id: "M-F16",
            name: "Merouana F16",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "Central Sector", status: "operational",
            lat: 35.677, lng: 5.88816667,
            wellType: "Production", depth: 929, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 45.6, piezometricLevel: 883.4, wellDepth: 929 }
        },
        {
            id: "M-F17",
            name: "Merouana F17",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "Highland Sector", status: "operational",
            lat: 35.68352778, lng: 5.97973889,
            wellType: "Production", depth: 953, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 84, piezometricLevel: 869, wellDepth: 953 }
        },
        {
            id: "M-F18",
            name: "Merouana F18",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "West Sector", status: "operational",
            lat: 35.68106944, lng: 5.85487222,
            wellType: "Production", depth: 886, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 63, piezometricLevel: 823, wellDepth: 886 }
        },
        {
            id: "M-F19",
            name: "Merouana F19",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "South-West Sector", status: "operational",
            lat: 35.65831111, lng: 5.82106389,
            wellType: "Production", depth: 884, pumpType: "Submersible", usage: "Agriculture",
            hydraulics: { staticLevel: 92, piezometricLevel: 792, wellDepth: 884 }
        },
        {
            id: "M-F20",
            name: "Merouana F20",
            country: "Algeria", state: "Batna", district: "Merouana",
            location: "South-East Sector", status: "operational",
            lat: 35.68083889, lng: 5.87483333,
            wellType: "Production", depth: 933, pumpType: "Submersible", usage: "Supply",
            hydraulics: { staticLevel: 76, piezometricLevel: 857, wellDepth: 933 }
        }
    ],
    alerts: [
        { id: 1, severity: "warning", messageKey: "alert_high_salinity", wellName: "F-02", timeKey: "mins_ago" },
        { id: 2, severity: "critical", messageKey: "alert_critical_level", wellName: "M-F18", timeKey: "hours_ago" }
    ],
    productionHistory: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        data: [42000, 43500, 41000, 45200, 44800, 46000, 45500]
    },
    documents: [
        { id: 1, name: "Ain Djasser Geological Study.pdf", type: "pdf", date: "2024-01-15", size: "2.4 MB", category: "reports" },
        { id: 2, name: "Water Quality Standards 2024.pdf", type: "pdf", date: "2024-01-10", size: "1.1 MB", category: "standards" },
        { id: 3, name: "Pump Maintenance Manual V2.docx", type: "doc", date: "2023-12-05", size: "4.5 MB", category: "manuals" },
        { id: 4, name: "Q1 Production Report.xlsx", type: "xls", date: "2024-03-01", size: "850 KB", category: "reports" },
        { id: 5, name: "Safety Protocols - Drilling.pdf", type: "pdf", date: "2023-11-20", size: "3.2 MB", category: "standards" },
        { id: 6, name: "Well F-3 Logs.xlsx", type: "xls", date: "2024-02-14", size: "420 KB", category: "reports" },
        { id: 7, name: "Rig Operation Guide.docx", type: "doc", date: "2023-10-30", size: "12.MB", category: "manuals" }
    ],
    // Precipitation Data (Monthly avg in mm)
    precipitation: [
        { month: 'Jan', value: 45 }, { month: 'Feb', value: 38 }, { month: 'Mar', value: 52 },
        { month: 'Apr', value: 30 }, { month: 'May', value: 20 }, { month: 'Jun', value: 5 },
        { month: 'Jul', value: 2 }, { month: 'Aug', value: 8 }, { month: 'Sep', value: 25 },
        { month: 'Oct', value: 40 }, { month: 'Nov', value: 55 }, { month: 'Dec', value: 60 }
    ],
    // Historical Logs for Comparisons (Static Level Variation)
    temporalLogs: {
        "F-02": [25.2, 25.0, 24.8, 25.5, 26.2, 27.0, 27.5, 27.8, 26.5, 25.8, 25.2, 24.5],
        "F-05": [30.1, 29.8, 29.5, 30.2, 31.0, 32.5, 33.2, 33.5, 32.0, 31.2, 30.5, 29.8],
        "F-09": [12.5, 12.2, 12.0, 12.8, 13.5, 14.2, 14.8, 15.1, 14.0, 13.5, 12.8, 12.2],
        "F-14": [50.8, 50.5, 50.2, 51.0, 52.5, 54.0, 55.2, 55.8, 54.5, 53.2, 52.1, 51.0]
    },
    // --- SMART ASSET INTELLIGENCE ---
    assetIntelligence: {
        drone: {
            operationalCost: "3500 DZD/hr",
            availability: "Available in 12h",
            battery: 88,
            quality: 94,
            lastService: "2024-03-10",
            suitability: "Ideal for Slope Monitoring & Thermal Surveys",
            lastUser: "M. Kerrou"
        },
        gps: {
            operationalCost: "1500 DZD/hr",
            availability: "In Stock - Sector 01",
            battery: 95,
            quality: 98,
            lastService: "2024-01-05",
            suitability: "Centimetric Precision for Topographic Girding",
            lastUser: "T. Drias"
        },
        gpr: {
            operationalCost: "2500 DZD/hr",
            availability: "Reserved for Batna Project",
            battery: 65,
            quality: 82,
            lastService: "2023-11-20", // Over 180 days ago
            suitability: "Non-destructive Shallow Aquifer Detection",
            lastUser: "H. Dinar"
        },
        magnetometer: {
            operationalCost: "1800 DZD/hr",
            availability: "Under Maintenance",
            battery: 12, // Critical Battery
            quality: 45, // Critical Quality
            lastService: "2023-08-15",
            suitability: "Deep Magnetic Anomaly Mapping",
            lastUser: "A. Slimani"
        }
    },
    // --- AUTH & ROLES (Innovation Hub Upgrade) ---
    activeUser: {
        id: "USR-001",
        name: "Houra Fouzia (حورة فوزية)",
        role: "ADMIN", // superior
        tier: "Superior",
        institution: "DRE Batna - Gov",
        credits: 99,
        daysLeft: 365,
        avatar: "https://i.pravatar.cc/150?u=houra"
    },
    subscriptionPlans: [
        { id: "superior", name: "Superior", role: "ADMIN", color: "#00d4ff", price: "Contrat État", features: ["Full GIS Control", "User Management", "Gov Reports"] },
        { id: "premium", name: "Premium", role: "ENGINEER", color: "#0077ff", price: "12,000 DZD/yr", features: ["GeoTIFF Export", "3D Modeling", "Pro Analytics"] },
        { id: "academic", name: "Academic", role: "STUDENT", color: "#00ff9d", price: "Gratuit", features: ["Map Views", "Library Access", "Basic Stats"] },
        { id: "field", name: "Field User", role: "FARMER", color: "#ffbf00", price: "2,500 DZD/yr", features: ["Simple Maps", "Weather Alerts", "Low-Res Data"] }
    ]
};

window.geographicData = geographicData;

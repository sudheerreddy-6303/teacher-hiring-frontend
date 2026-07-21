// ── Location data for signup dropdowns (ADDED — new file, nothing replaced) ──
// Countries list, Indian states/UTs, and cities grouped by state.
// "Other" is always available so users can still type a custom value.

export const COUNTRIES = [
  "India","Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cambodia","Cameroon","Canada","Chad","Chile","China","Colombia","Comoros","Costa Rica","Croatia","Cuba",
  "Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia",
  "Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hungary","Iceland",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
  "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania",
  "Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico",
  "Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands",
  "New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan",
  "Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan",
  "Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo",
  "Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe","Other"
];

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry","Other"
];

export const CITIES_BY_STATE = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Kakinada","Tirupati","Anantapur","Kadapa","Eluru","Ongole","Tadepalligudem","Bhimavaram","Machilipatnam","Chittoor","Srikakulam","Vizianagaram","Tenali","Proddatur","Hindupur","Narasaraopet","Tadipatri","Mangalagiri","Amaravati","Nandyal","Madanapalle","Guntakal","Dharmavaram","Gudivada","Palakollu","Narsapuram","Tanuku","Amalapuram","Chilakaluripet"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat","Tawang","Ziro","Bomdila","Tezu","Roing"],
  "Assam": ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Karimganj","Sivasagar","Goalpara","Barpeta","Dhubri","Diphu"],
  "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif","Arrah","Begusarai","Katihar","Munger","Chhapra","Danapur","Saharsa","Hajipur","Sasaram","Dehri","Siwan","Motihari","Nawada","Bagaha","Buxar","Kishanganj","Sitamarhi","Jamalpur","Jehanabad","Aurangabad (Bihar)"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Raigarh","Ambikapur","Mahasamund","Dhamtari","Chirmiri"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Cuncolim"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Gandhidham","Anand","Navsari","Morbi","Nadiad","Surendranagar","Bharuch","Mehsana","Bhuj","Porbandar","Palanpur","Valsad","Vapi","Gondal","Veraval","Godhra","Patan","Kalol","Dahod","Botad","Amreli","Deesa"],
  "Haryana": ["Faridabad","Gurugram","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula","Bhiwani","Sirsa","Bahadurgarh","Jind","Thanesar","Kaithal","Rewari","Palwal","Hansi","Narnaul","Fatehabad"],
  "Himachal Pradesh": ["Shimla","Mandi","Solan","Dharamshala","Baddi","Nahan","Paonta Sahib","Sundarnagar","Chamba","Una","Kullu","Hamirpur (HP)","Bilaspur (HP)","Palampur","Manali"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro Steel City","Deoghar","Phusro","Hazaribagh","Giridih","Ramgarh","Medininagar","Chirkunda","Dumka","Chaibasa"],
  "Karnataka": ["Bengaluru","Mysuru","Hubballi","Mangaluru","Belagavi","Kalaburagi","Davanagere","Ballari","Vijayapura","Shivamogga","Tumakuru","Raichur","Bidar","Udupi","Hosapete","Gadag","Hassan","Mandya","Chitradurga","Kolar","Bagalkot","Chikkamagaluru","Bhadravati","Robertsonpet","Ranebennuru"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Kollam","Thrissur","Alappuzha","Palakkad","Kannur","Kottayam","Malappuram","Manjeri","Thalassery","Ponnani","Vatakara","Kanhangad","Payyanur","Koyilandy","Parappanangadi","Kalamassery","Neyyattinkara","Kayamkulam","Nedumangad","Perinthalmanna","Attingal"],
  "Madhya Pradesh": ["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Murwara","Singrauli","Burhanpur","Khandwa","Bhind","Chhindwara","Guna","Shivpuri","Vidisha","Chhatarpur","Damoh","Mandsaur","Khargone","Neemuch","Pithampur","Hoshangabad","Itarsi","Sehore","Betul","Morena"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Thane","Nashik","Kalyan-Dombivli","Vasai-Virar","Aurangabad (Maharashtra)","Navi Mumbai","Solapur","Mira-Bhayandar","Bhiwandi","Amravati","Nanded","Kolhapur","Ulhasnagar","Sangli","Malegaon","Jalgaon","Akola","Latur","Dhule","Ahmednagar","Chandrapur","Parbhani","Ichalkaranji","Jalna","Ambarnath","Bhusawal","Panvel","Badlapur","Beed","Gondia","Satara","Barshi","Yavatmal","Achalpur","Osmanabad","Nandurbar","Wardha","Udgir","Hinganghat"],
  "Manipur": ["Imphal","Thoubal","Bishnupur","Churachandpur","Kakching","Ukhrul","Senapati"],
  "Meghalaya": ["Shillong","Tura","Jowai","Nongstoin","Baghmara","Williamnagar"],
  "Mizoram": ["Aizawl","Lunglei","Champhai","Serchhip","Kolasib","Saiha"],
  "Nagaland": ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Mon"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jharsuguda","Jeypore","Angul","Dhenkanal","Barbil","Kendujhar","Rayagada","Bolangir","Paradip"],
  "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Hoshiarpur","Batala","Pathankot","Moga","Abohar","Malerkotla","Khanna","Phagwara","Muktsar","Barnala","Rajpura","Firozpur","Kapurthala","Zirakpur","Sangrur","Fazilka","Gurdaspur","Kharar"],
  "Rajasthan": ["Jaipur","Jodhpur","Kota","Bikaner","Ajmer","Udaipur","Bhilwara","Alwar","Bharatpur","Sikar","Pali","Sri Ganganagar","Kishangarh","Baran","Dhaulpur","Tonk","Beawar","Hanumangarh","Gangapur City","Sawai Madhopur","Churu","Jhunjhunu","Banswara","Nagaur","Makrana","Sujangarh","Bundi","Chittorgarh"],
  "Sikkim": ["Gangtok","Namchi","Gyalshing","Mangan","Rangpo","Singtam"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Tiruppur","Vellore","Erode","Thoothukudi","Dindigul","Thanjavur","Ranipet","Sivakasi","Karur","Udhagamandalam","Hosur","Nagercoil","Kanchipuram","Kumbakonam","Cuddalore","Rajapalayam","Pudukkottai","Pollachi","Neyveli","Nagapattinam","Viluppuram","Tiruvannamalai","Gudiyatham","Vaniyambadi","Ambur","Karaikudi","Avadi","Tambaram"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar","Ramagundam","Khammam","Mahbubnagar","Nalgonda","Adilabad","Suryapet","Siddipet","Miryalaguda","Jagtial","Mancherial","Nirmal","Kothagudem","Bodhan","Sangareddy","Secunderabad","Medak","Kamareddy","Wanaparthy","Vikarabad","Jangaon","Bhongir","Gadwal","Zaheerabad"],
  "Tripura": ["Agartala","Udaipur (Tripura)","Dharmanagar","Kailashahar","Belonia","Khowai","Ambassa"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Ghaziabad","Agra","Varanasi","Meerut","Prayagraj","Bareilly","Aligarh","Moradabad","Saharanpur","Gorakhpur","Noida","Firozabad","Jhansi","Muzaffarnagar","Mathura","Rampur","Shahjahanpur","Farrukhabad","Ayodhya","Maunath Bhanjan","Hapur","Etawah","Mirzapur","Bulandshahr","Sambhal","Amroha","Hardoi","Fatehpur","Raebareli","Orai","Sitapur","Bahraich","Modinagar","Unnao","Jaunpur","Lakhimpur","Hathras","Banda","Pilibhit","Barabanki","Khurja","Gonda","Mainpuri","Lalitpur","Etah","Deoria","Ujhani","Ghazipur","Sultanpur","Azamgarh","Bijnor","Sahaswan","Basti","Chandausi","Akbarpur","Ballia","Tanda","Greater Noida","Shikohabad","Shamli","Awagarh","Kasganj"],
  "Uttarakhand": ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Kotdwar","Ramnagar","Pithoragarh","Nainital","Mussoorie","Almora"],
  "West Bengal": ["Kolkata","Howrah","Asansol","Siliguri","Durgapur","Bardhaman","Malda","Baharampur","Habra","Kharagpur","Shantipur","Dankuni","Dhulian","Ranaghat","Haldia","Raiganj","Krishnanagar","Nabadwip","Medinipur","Jalpaiguri","Balurghat","Basirhat","Bankura","Chakdaha","Darjeeling","Alipurduar","Purulia","Jangipur","Bangaon","Cooch Behar"],
  "Andaman and Nicobar Islands": ["Port Blair","Garacharma","Bambooflat"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman","Diu","Silvassa"],
  "Delhi": ["New Delhi","Delhi","Dwarka","Rohini","Pitampura","Janakpuri","Saket","Karol Bagh","Lajpat Nagar","Vasant Kunj","Mayur Vihar","Preet Vihar","Shahdara","Narela","Najafgarh"],
  "Jammu and Kashmir": ["Srinagar","Jammu","Anantnag","Baramulla","Sopore","Kathua","Udhampur","Punch","Rajouri"],
  "Ladakh": ["Leh","Kargil"],
  "Lakshadweep": ["Kavaratti","Agatti","Amini","Andrott","Minicoy"],
  "Puducherry": ["Puducherry","Karaikal","Yanam","Mahe","Ozhukarai"],
};

// Flat list of all cities (for when no state is chosen) — always ends with "Other"
export const ALL_CITIES = [
  ...new Set(Object.values(CITIES_BY_STATE).flat())
].sort((a, b) => a.localeCompare(b)).concat(["Other"]);

// Cities for a given state (falls back to the full list) — always ends with "Other"
export function citiesForState(state) {
  const list = CITIES_BY_STATE[state];
  if (list && list.length) return [...list].sort((a, b) => a.localeCompare(b)).concat(["Other"]);
  return ALL_CITIES;
}

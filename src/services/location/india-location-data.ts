export interface IndiaState {
  name: string;
  cities: string[];
}

export const INDIA_STATES: IndiaState[] = [
  {
    name: 'Andhra Pradesh',
    cities: [
      'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry',
      'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Vizianagaram', 'Eluru',
      'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur',
      'Hindupur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram',
      'Gudivada', 'Srikakulam', 'Narasaraopet', 'Rajam', 'Tadpatri',
    ],
  },
  {
    name: 'Arunachal Pradesh',
    cities: [
      'Itanagar', 'Naharlagun', 'Pasighat', 'Namsai', 'Bomdila', 'Tezu',
      'Ziro', 'Along', 'Khonsa', 'Roing', 'Tawang', 'Aalo',
    ],
  },
  {
    name: 'Assam',
    cities: [
      'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia',
      'Tezpur', 'Bongaigaon', 'Dhubri', 'Diphu', 'Goalpara', 'Karimganj',
      'Sivasagar', 'Golaghat', 'Barpeta', 'Lakhimpur', 'Hojai', 'Haflong',
      'Nalbari', 'Kokrajhar',
    ],
  },
  {
    name: 'Bihar',
    cities: [
      'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga',
      'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra',
      'Danapur', 'Saharsa', 'Sasaram', 'Hajipur', 'Dehri', 'Siwan',
      'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi',
      'Jamalpur', 'Jehanabad', 'Aurangabad', 'Bettiah', 'Supaul',
    ],
  },
  {
    name: 'Chhattisgarh',
    cities: [
      'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon',
      'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari',
      'Chirmiri', 'Naila Janjgir', 'Tilda Newra', 'Bhatapara', 'Dongargarh',
      'Kanker', 'Kondagaon', 'Kawardha', 'Balod',
    ],
  },
  {
    name: 'Goa',
    cities: [
      'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim',
      'Curchorem', 'Sanquelim', 'Canacona', 'Pernem', 'Quepem', 'Sanguem',
      'Calangute', 'Candolim', 'Anjuna', 'Colva',
    ],
  },
  {
    name: 'Gujarat',
    cities: [
      'Vadodara', 'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banas Kantha',
      'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dangs',
      'Devbhumi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh',
      'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari',
      'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabar Kantha', 'Surat',
      'Surendranagar', 'Tapi', 'Valsad',
    ],
  },
  {
    name: 'Haryana',
    cities: [
      'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak',
      'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa',
      'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal',
      'Mahendragarh', 'Fatehabad', 'Mewat', 'Jhajjar', 'Narnaul',
      'Pehowa', 'Hansi', 'Hodal', 'Shahabad', 'Charkhi Dadri',
    ],
  },
  {
    name: 'Himachal Pradesh',
    cities: [
      'Shimla', 'Dharamsala', 'Solan', 'Mandi', 'Palampur', 'Baddi',
      'Nahan', 'Kullu', 'Manali', 'Chamba', 'Una', 'Bilaspur',
      'Hamirpur', 'Sundarnagar', 'Nurpur', 'Kangra', 'Rohru', 'Rampur',
      'Sarkaghat', 'Nalagarh',
    ],
  },
  {
    name: 'Jharkhand',
    cities: [
      'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar',
      'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar',
      'Chirkunda', 'Chaibasa', 'Dumka', 'Gumia', 'Jamtara',
      'Sahibganj', 'Lohardaga', 'Pakur', 'Godda', 'Simdega',
    ],
  },
  {
    name: 'Karnataka',
    cities: [
      'Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi',
      'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Davanagere',
      'Bidar', 'Udupi', 'Raichur', 'Dharwad', 'Hospet', 'Gadag',
      'Chitradurga', 'Hassan', 'Mandya', 'Chikkamagaluru', 'Robertsonpet',
      'Bagalkot', 'Bhadravati', 'Ramanagara', 'Kolar', 'Chikballapur',
      'Yadgir', 'Koppal', 'Sirsi', 'Madikeri',
    ],
  },
  {
    name: 'Kerala',
    cities: [
      'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam',
      'Alappuzha', 'Kannur', 'Palakkad', 'Kottayam', 'Malappuram',
      'Kasaragod', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Manjeri',
      'Thalassery', 'Changanacherry', 'Tirur', 'Vatakara', 'Ponnani',
      'Perinthalmanna', 'Kayamkulam', 'Punalur', 'Adoor', 'Nedumangad',
      'Neyyattinkara', 'Attingal', 'Ottapalam', 'Shoranur', 'Kodungallur',
    ],
  },
  {
    name: 'Madhya Pradesh',
    cities: [
      'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar',
      'Ratlam', 'Satna', 'Dewas', 'Murwara', 'Chhindwara', 'Rewa',
      'Bhopal', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind', 'Morena',
      'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur',
      'Khargone', 'Neemuch', 'Pithampur', 'Hoshangabad', 'Itarsi',
      'Sehore', 'Tikamgarh', 'Datia', 'Seoni', 'Balaghat',
    ],
  },
  {
    name: 'Maharashtra',
    cities: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad',
      'Solapur', 'Amravati', 'Kolhapur', 'Navi Mumbai', 'Sangli',
      'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur',
      'Parbhani', 'Ichalkaranji', 'Jalna', 'Ambarnath', 'Bhiwandi',
      'Shirdi', 'Badlapur', 'Beed', 'Gondia', 'Satara', 'Bhandara',
      'Yavatmal', 'Nanded', 'Ulhasnagar', 'Malegaon', 'Nandurbar',
      'Wardha', 'Osmanabad', 'Hingoli', 'Washim', 'Raigad', 'Ratnagiri',
      'Sindhudurg', 'Buldhana', 'Kalyan', 'Dombivli', 'Vasai', 'Virar',
      'Panvel', 'Mira-Bhayandar', 'Palghar',
    ],
  },
  {
    name: 'Manipur',
    cities: [
      'Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati',
      'Ukhrul', 'Chandel', 'Tamenglong', 'Jiribam', 'Kakching',
    ],
  },
  {
    name: 'Meghalaya',
    cities: [
      'Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara', 'Williamnagar',
      'Resubelpara', 'Ampati', 'Mairang', 'Nongpoh',
    ],
  },
  {
    name: 'Mizoram',
    cities: [
      'Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip',
      'Lawngtlai', 'Mamit', 'Hnahthial', 'Saitual', 'Khawzawl',
    ],
  },
  {
    name: 'Nagaland',
    cities: [
      'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto',
      'Phek', 'Mon', 'Longleng', 'Kiphire', 'Peren',
    ],
  },
  {
    name: 'Odisha',
    cities: [
      'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur',
      'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda',
      'Jeypore', 'Rayagada', 'Bargarh', 'Paradip', 'Bhawanipatna',
      'Dhenkanal', 'Kendujhar', 'Sundargarh', 'Koraput', 'Nabarangpur',
      'Malkangiri', 'Nuapada', 'Sonepur', 'Phulbani', 'Angul', 'Boudh',
    ],
  },
  {
    name: 'Punjab',
    cities: [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
      'Mohali', 'Hoshiarpur', 'Batala', 'Gurdaspur', 'Pathankot',
      'Moga', 'Firozpur', 'Muktsar', 'Barnala', 'Rajpura',
      'Kapurthala', 'Sangrur', 'Faridkot', 'Ropar', 'Phagwara',
      'Khanna', 'Fazilka', 'Abohar', 'Zirakpur', 'Nawanshahr',
    ],
  },
  {
    name: 'Rajasthan',
    cities: [
      'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur',
      'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar',
      'Tonk', 'Kishangarh', 'Baran', 'Dhaulpur', 'Chittorgarh',
      'Nagaur', 'Jhalawar', 'Banswara', 'Beawar', 'Hanumangarh',
      'Churu', 'Jaisalmer', 'Barmer', 'Sawai Madhopur', 'Dungarpur',
      'Jhunjhunu', 'Karauli', 'Bundi', 'Sirohi', 'Dausa',
      'Rajsamand', 'Pratapgarh', 'Jalore',
    ],
  },
  {
    name: 'Sikkim',
    cities: [
      'Gangtok', 'Namchi', 'Mangan', 'Gyalshing', 'Jorethang', 'Rangpo',
      'Singtam', 'Ravangla', 'Pelling',
    ],
  },
  {
    name: 'Tamil Nadu',
    cities: [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
      'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi',
      'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur',
      'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarapalayam',
      'Kumbakonam', 'Ambattur', 'Avadi', 'Tiruvottiyur', 'Tambaram',
      'Cuddalore', 'Nagapattinam', 'Villupuram', 'Ariyalur', 'Perambalur',
      'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Virudhunagar', 'Ramanathapuram',
      'Pudukottai', 'Sivaganga', 'Nilgiris',
    ],
  },
  {
    name: 'Telangana',
    cities: [
      'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam',
      'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet',
      'Miryalaguda', 'Mancherial', 'Jagtial', 'Peddapalli', 'Siddipet',
      'Bhadradri Kothagudem', 'Mulugu', 'Nagarkurnool', 'Wanaparthy',
      'Gadwal', 'Sangareddy', 'Medak', 'Kamareddy', 'Vikarabad',
      'Narayanpet', 'Jogulamba Gadwal', 'Mahabubabad', 'Jayashankar',
      'Secunderabad', 'Bhongir', 'Tandur',
    ],
  },
  {
    name: 'Tripura',
    cities: [
      'Agartala', 'Dharmanagar', 'Udaipur', 'Ambassa', 'Khowai',
      'Belonia', 'Kailasahar', 'Bishalgarh', 'Sabroom', 'Kumarghat',
    ],
  },
  {
    name: 'Uttar Pradesh',
    cities: [
      'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi',
      'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur',
      'Gorakhpur', 'Noida', 'Firozabad', 'Loni', 'Jhansi', 'Muzaffarnagar',
      'Mathura', 'Shahjahanpur', 'Rampur', 'Farrukhabad', 'Ayodhya',
      'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha',
      'Hardoi', 'Unnao', 'Sitapur', 'Bahraich', 'Modinagar', 'Gonda',
      'Raebareli', 'Bijnor', 'Badaun', 'Sultanpur', 'Mau', 'Barabanki',
      'Azamgarh', 'Ballia', 'Deoria', 'Basti', 'Orai', 'Hathras',
      'Jaunpur', 'Lakhimpur', 'Fatehpur', 'Rae Bareli',
    ],
  },
  {
    name: 'Uttarakhand',
    cities: [
      'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur',
      'Kashipur', 'Rishikesh', 'Kotdwar', 'Nainital', 'Mussoorie',
      'Pithoragarh', 'Almora', 'Champawat', 'Bageshwar', 'Chamoli',
      'Tehri', 'Uttarkashi', 'Rudraprayag', 'Pauri', 'Lansdowne',
    ],
  },
  {
    name: 'West Bengal',
    cities: [
      'Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman',
      'Malda', 'Barasat', 'Krishnanagar', 'Medinipur', 'Kharagpur',
      'Howrah', 'Haldia', 'Raiganj', 'Jalpaiguri', 'Cooch Behar',
      'Darjeeling', 'Bankura', 'Purulia', 'Balurghat', 'Habra',
      'Ranaghat', 'Berhampore', 'Barrakpur', 'Alipurduar', 'Uluberia',
      'Serampore', 'Naihati', 'Titagarh', 'Birnagar', 'Chakdaha',
    ],
  },
  {
    name: 'Andaman and Nicobar Islands',
    cities: [
      'Port Blair', 'Diglipur', 'Rangat', 'Mayabunder', 'Car Nicobar',
    ],
  },
  {
    name: 'Chandigarh',
    cities: ['Chandigarh'],
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    cities: ['Silvassa', 'Daman', 'Diu', 'Amli', 'Naroli'],
  },
  {
    name: 'Delhi',
    cities: [
      'New Delhi', 'Delhi', 'Dwarka', 'Rohini', 'Shahdara',
      'Saket', 'Janakpuri', 'Pitampura', 'Vasant Kunj', 'Lajpat Nagar',
      'Karol Bagh', 'Connaught Place', 'Mayur Vihar', 'Preet Vihar',
      'Rajouri Garden', 'Uttam Nagar', 'Vikaspuri', 'Narela', 'Bawana',
    ],
  },
  {
    name: 'Jammu and Kashmir',
    cities: [
      'Srinagar', 'Jammu', 'Anantnag', 'Sopore', 'Udhampur', 'Baramulla',
      'Kathua', 'Punch', 'Rajouri', 'Bandipore', 'Ganderbal',
      'Kulgam', 'Pulwama', 'Budgam', 'Ramban', 'Kishtwar', 'Doda',
      'Reasi', 'Samba', 'Shopian',
    ],
  },
  {
    name: 'Ladakh',
    cities: ['Leh', 'Kargil', 'Nubra', 'Zanskar'],
  },
  {
    name: 'Lakshadweep',
    cities: ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy'],
  },
  {
    name: 'Puducherry',
    cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai'],
  },
];

export const INDIA_STATE_NAMES = INDIA_STATES.map((s) => s.name);

export function getCitiesForState(stateName: string): string[] {
  return INDIA_STATES.find((s) => s.name === stateName)?.cities ?? [];
}

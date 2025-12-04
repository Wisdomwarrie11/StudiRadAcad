
export type Difficulty = 'Basic' | 'Intermediate' | 'Advanced';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
  category: string;
}

export const quizQuestions: Question[] = [
  // --- BASIC LEVEL (Advanced Basic) ---
  {
    id: 1,
    difficulty: 'Basic',
    category: 'Physics',
    question: "When increasing beam filtration, what happens to the average energy of the X-ray beam?",
    options: ["It decreases", "It increases", "It remains the same", "It becomes zero"],
    answer: "It increases",
    explanation: "Filtration removes low-energy photons, thereby 'hardening' the beam and increasing its average energy."
  },
  {
    id: 2,
    difficulty: 'Basic',
    category: 'Anatomy',
    question: "The mastoid process is a landmark on which cranial bone?",
    options: ["Temporal", "Parietal", "Occipital", "Sphenoid"],
    answer: "Temporal",
    explanation: "The mastoid process is a conical prominence on the temporal bone, located just behind the ear."
  },
  {
    id: 3,
    difficulty: 'Basic',
    category: 'Physics',
    question: "Which X-ray interaction with matter is primarily responsible for patient dose?",
    options: ["Coherent Scatter", "Compton Scatter", "Photoelectric Effect", "Pair Production"],
    answer: "Photoelectric Effect",
    explanation: "The Photoelectric Effect involves complete absorption of the X-ray photon, contributing significantly to patient dose and image contrast."
  },
  {
    id: 4,
    difficulty: 'Basic',
    category: 'Positioning',
    question: "For a PA chest projection, why are the shoulders rolled forward?",
    options: ["To lower the clavicles", "To raise the diaphragm", "To move scapulae out of lung fields", "To reduce magnification"],
    answer: "To move scapulae out of lung fields",
    explanation: "Rolling shoulders forward moves the scapulae laterally, ensuring they do not superimpose the lung fields."
  },
  {
    id: 5,
    difficulty: 'Basic',
    category: 'Physics',
    question: "If you double the distance from the source (SID), the intensity of the beam becomes:",
    options: ["Double", "Half", "One-fourth", "Four times"],
    answer: "One-fourth",
    explanation: "According to the Inverse Square Law, intensity is inversely proportional to the square of the distance (1/2² = 1/4)."
  },
  {
    id: 6,
    difficulty: 'Basic',
    category: 'Patient Care',
    question: "A patient with a BP of 150/95 mmHg is considered to be:",
    options: ["Hypotensive", "Normotensive", "Hypertensive", "In shock"],
    answer: "Hypertensive",
    explanation: "Normal blood pressure is around 120/80. Values consistently above 130-140 systolic or 80-90 diastolic indicate hypertension."
  },
  {
    id: 7,
    difficulty: 'Basic',
    category: 'Anatomy',
    question: "The acetabulum is formed by the fusion of which three bones?",
    options: ["Ilium, Ischium, Pubis", "Ilium, Sacrum, Coccyx", "Femur, Tibia, Fibula", "Ischium, Pubis, Sacrum"],
    answer: "Ilium, Ischium, Pubis",
    explanation: "The acetabulum (hip socket) is the point where the ilium, ischium, and pubis meet and fuse."
  },
  {
    id: 8,
    difficulty: 'Basic',
    category: 'Physics',
    question: "What is the primary function of the focusing cup in the X-ray tube?",
    options: ["Rotate the anode", "Focus electrons toward the anode", "Filter the beam", "Absorb heat"],
    answer: "Focus electrons toward the anode",
    explanation: "The negatively charged focusing cup repels electrons, narrowing the stream and focusing them onto the focal spot of the anode."
  },
  {
    id: 9,
    difficulty: 'Basic',
    category: 'Positioning',
    question: "Which projection is utilized to demonstrate the carpal scaphoid?",
    options: ["PA Wrist", "PA Wrist with Ulnar Deviation", "PA Wrist with Radial Deviation", "Lateral Wrist"],
    answer: "PA Wrist with Ulnar Deviation",
    explanation: "Ulnar deviation opens the spaces between the carpal bones on the lateral side, specifically isolating the scaphoid."
  },
  {
    id: 10,
    difficulty: 'Basic',
    category: 'Radiation Protection',
    question: "The unit 'Gray' (Gy) measures:",
    options: ["Effective Dose", "Absorbed Dose", "Exposure in Air", "Radioactivity"],
    answer: "Absorbed Dose",
    explanation: "Gray measures the energy deposited in matter (Absorbed Dose). Sievert measures Effective Dose."
  },
  {
    id: 11,
    difficulty: 'Basic',
    category: 'CT',
    question: "What determines the slice thickness in a single-detector CT scanner?",
    options: ["Table speed", "Gantry rotation speed", "Collimation of the beam", "Computer algorithm"],
    answer: "Collimation of the beam",
    explanation: "In single-slice CT, pre-patient collimation determines the width of the beam and thus the slice thickness."
  },
  {
    id: 12,
    difficulty: 'Basic',
    category: 'Anatomy',
    question: "Which of the following is a retroperitoneal structure?",
    options: ["Stomach", "Spleen", "Kidney", "Transverse Colon"],
    answer: "Kidney",
    explanation: "The kidneys are located behind the peritoneum (retroperitoneal), along with the ureters and pancreas."
  },
  {
    id: 13,
    difficulty: 'Basic',
    category: 'Physics',
    question: "Thermionic emission occurs at the:",
    options: ["Tungsten filament", "Rotating anode", "Glass envelope", "Input phosphor"],
    answer: "Tungsten filament",
    explanation: "Heating the tungsten filament causes electrons to boil off, a process known as thermionic emission."
  },
  {
    id: 14,
    difficulty: 'Basic',
    category: 'MRI',
    question: "Which atom is most commonly imaged in clinical MRI?",
    options: ["Carbon", "Hydrogen", "Oxygen", "Calcium"],
    answer: "Hydrogen",
    explanation: "Hydrogen is used because it is abundant in the body (water/fat) and has a strong magnetic moment."
  },
  {
    id: 15,
    difficulty: 'Basic',
    category: 'Positioning',
    question: "A Lordotic view of the chest is used specifically to visualize:",
    options: ["Fluid levels", "Rib fractures", "Lung apices", "Heart size"],
    answer: "Lung apices",
    explanation: "The Apical Lordotic view projects the clavicles above the lung apices, allowing visualization of pathology in that area."
  },
  {
    id: 16,
    difficulty: 'Basic',
    category: 'Physics',
    question: "The anode heel effect is defined as:",
    options: ["Increased intensity on the cathode side", "Increased intensity on the anode side", "Uniform intensity", "Decreased intensity on cathode side"],
    answer: "Increased intensity on the cathode side",
    explanation: "X-rays emitted toward the anode side are absorbed by the heel of the anode, making the beam more intense on the cathode side."
  },
  {
    id: 17,
    difficulty: 'Basic',
    category: 'Patient Care',
    question: "The medical term for a collapsed lung is:",
    options: ["Pneumonia", "Atelectasis", "Emphysema", "Pleurisy"],
    answer: "Atelectasis",
    explanation: "Atelectasis refers to the incomplete expansion or collapse of part or all of a lung."
  },
  {
    id: 18,
    difficulty: 'Basic',
    category: 'Radiation Protection',
    question: "Which shielding device is best for a sterile field in fluoroscopy?",
    options: ["Flat contact shield", "Shadow shield", "Lead apron", "Gonadal cup"],
    answer: "Shadow shield",
    explanation: "Shadow shields cast a shadow over the patient without touching them, making them ideal for sterile fields."
  },
  {
    id: 19,
    difficulty: 'Basic',
    category: 'Anatomy',
    question: "The xiphoid process is the distal portion of the:",
    options: ["Sternum", "Clavicle", "Scapula", "Humerus"],
    answer: "Sternum",
    explanation: "The sternum consists of the manubrium, body, and xiphoid process (distal tip)."
  },
  {
    id: 20,
    difficulty: 'Basic',
    category: 'Modalities',
    question: "Which modality does NOT use ionizing radiation?",
    options: ["Mammography", "Computed Tomography", "Ultrasonography", "Fluoroscopy"],
    answer: "Ultrasonography",
    explanation: "Ultrasound uses high-frequency sound waves, not ionizing radiation."
  },

  // --- INTERMEDIATE LEVEL ---
  {
    id: 21,
    difficulty: 'Intermediate',
    category: 'Positioning',
    question: "Which bone is best visualized using an oblique hand X-ray?",
    options: ["Scaphoid", "Radius", "Ulna", "Metacarpals"],
    answer: "Metacarpals",
    explanation: "An oblique hand is excellent for separating the metacarpals. The scaphoid is best seen on a specific scaphoid (ulnar deviation) view."
  },
  {
    id: 22,
    difficulty: 'Intermediate',
    category: 'MRI',
    question: "In MRI, T1-weighted imaging typically makes fluid appear:",
    options: ["Bright (White)", "Dark (Black)", "Grey", "Invisible"],
    answer: "Dark (Black)",
    explanation: "In T1-weighted images, fluid (like CSF) is dark. Fat is bright. In T2, fluid is bright."
  },
  {
    id: 23,
    difficulty: 'Intermediate',
    category: 'Positioning',
    question: "Which radiographic position is best for visualizing the intervertebral foramina of the C-Spine?",
    options: ["AP view", "Lateral view", "Oblique view", "Open mouth"],
    answer: "Oblique view",
    explanation: "Oblique projections (LPO/RPO or LAO/RAO) are required to open and visualize the cervical intervertebral foramina."
  },
  {
    id: 24,
    difficulty: 'Intermediate',
    category: 'MRI',
    question: "What is the primary safety concern with MRI?",
    options: ["Ionizing radiation", "Ferromagnetic projectiles", "Heat burns", "Claustrophobia"],
    answer: "Ferromagnetic projectiles",
    explanation: "The powerful static magnetic field can turn ferromagnetic objects into dangerous projectiles. Radiation is not used in MRI."
  },
  {
    id: 25,
    difficulty: 'Intermediate',
    category: 'Physics',
    question: "The Heel Effect is most pronounced when using:",
    options: ["Large SID, Small film", "Small SID, Large film", "High kVp", "Low mAs"],
    answer: "Small SID, Large film",
    explanation: "The Anode Heel Effect (intensity variation) is most noticeable at short SIDs and with large field sizes."
  },
  {
    id: 26,
    difficulty: 'Intermediate',
    category: 'Ultrasound',
    question: "Which frequency transducer is best for superficial structures?",
    options: ["High frequency (e.g., 10-15 MHz)", "Low frequency (e.g., 2-5 MHz)", "Medium frequency", "Frequency does not matter"],
    answer: "High frequency (e.g., 10-15 MHz)",
    explanation: "High frequency offers better resolution but less penetration, making it ideal for superficial structures like thyroid or breast."
  },
  {
    id: 27,
    difficulty: 'Intermediate',
    category: 'Physics',
    question: "Photoelectric absorption is more likely to occur in tissues with:",
    options: ["Low atomic number", "High atomic number", "High water content", "Low density"],
    answer: "High atomic number",
    explanation: "Photoelectric interactions increase with the cube of the atomic number (Z), which is why bone (Calcium) absorbs more than soft tissue."
  },
  {
    id: 28,
    difficulty: 'Intermediate',
    category: 'CT',
    question: "CT Hounsfield Unit (HU) for water is approximately:",
    options: ["-1000", "0", "+1000", "+50"],
    answer: "0",
    explanation: "The Hounsfield scale is calibrated such that distilled water is 0 HU and air is -1000 HU."
  },
  {
    id: 29,
    difficulty: 'Intermediate',
    category: 'Positioning',
    question: "To demonstrate a pleural effusion in a patient who cannot stand, which decubitus position is used?",
    options: ["Affected side down", "Affected side up", "Supine", "Prone"],
    answer: "Affected side down",
    explanation: "Fluid sinks. To visualize a pleural effusion on a lateral decubitus, the affected side must be down so the fluid layers out against the chest wall."
  },
  {
    id: 30,
    difficulty: 'Intermediate',
    category: 'Radiation Protection',
    question: "The annual effective dose limit for occupational workers is typically:",
    options: ["5 mSv", "20 mSv (averaged over 5 years)", "50 mSv", "1 mSv"],
    answer: "20 mSv (averaged over 5 years)",
    explanation: "ICRP recommends 20 mSv/year averaged over 5 years, with no single year exceeding 50 mSv. (US regs allow 50 mSv/year, but 20 is the global best practice standard)."
  },
  {
    id: 31,
    difficulty: 'Intermediate',
    category: 'Physics',
    question: "Which interaction is responsible for the majority of occupational exposure?",
    options: ["Photoelectric effect", "Compton scatter", "Coherent scatter", "Pair production"],
    answer: "Compton scatter",
    explanation: "Compton scatter is the interaction where the photon changes direction and leaves the patient, potentially striking the radiographer."
  },
  {
    id: 32,
    difficulty: 'Intermediate',
    category: 'Patient Care',
    question: "Which lab value is most critical to check before administering IV contrast?",
    options: ["Hemoglobin", "Creatinine/eGFR", "White Blood Cell Count", "Platelets"],
    answer: "Creatinine/eGFR",
    explanation: "Creatinine and eGFR assess kidney function. Poor kidney function increases the risk of Contrast-Induced Nephropathy (CIN)."
  },
  {
    id: 33,
    difficulty: 'Intermediate',
    category: 'Modalities',
    question: "A DEXA scan is primarily used to evaluate:",
    options: ["Brain activity", "Bone mineral density", "Lung capacity", "Liver function"],
    answer: "Bone mineral density",
    explanation: "Dual-Energy X-ray Absorptiometry (DEXA) is the gold standard for diagnosing osteoporosis."
  },
  {
    id: 34,
    difficulty: 'Intermediate',
    category: 'Positioning',
    question: "The 'Y-view' of the shoulder is used to diagnose:",
    options: ["Fracture of the clavicle", "Dislocation", "Rotator cuff tear", "Arthritis"],
    answer: "Dislocation",
    explanation: "The Scapular Y view helps determine if the humeral head is anteriorly or posteriorly dislocated relative to the glenoid."
  },
  {
    id: 35,
    difficulty: 'Intermediate',
    category: 'Physics',
    question: "Grid cutoff is most likely caused by:",
    options: ["Using a high kVp", "Increasing mAs", "Angling the tube against the grid lines", "Decreasing SID"],
    answer: "Angling the tube against the grid lines",
    explanation: "Angling the X-ray beam across (perpendicular to) the lead strips of a grid causes severe grid cutoff (absorption of primary beam)."
  },
  {
    id: 201, difficulty: 'Intermediate', category: 'Anatomy',
    question: "The olecranon process is part of which bone?",
    options: ["Radius", "Humerus", "Ulna", "Scapula"],
    answer: "Ulna", explanation: "The olecranon is the proximal end of the ulna, forming the 'point' of the elbow."
  },
  {
    id: 202, difficulty: 'Intermediate', category: 'Physics',
    question: "Digital Tomosynthesis is best described as:",
    options: ["3D Mammography", "Standard 2D X-ray", "MRI of breast", "Ultrasound"],
    answer: "3D Mammography", explanation: "Tomosynthesis takes multiple low-dose projections to create a 3D volume reconstruction."
  },
  {
    id: 203, difficulty: 'Intermediate', category: 'Positioning',
    question: "For a lateral skull, the Interpupillary Line (IPL) must be:",
    options: ["Parallel to IR", "Perpendicular to IR", "Angled 15 degrees", "Angled 45 degrees"],
    answer: "Perpendicular to IR", explanation: "For a true lateral skull, the IPL is perpendicular to the image receptor to prevent tilt."
  },
  {
    id: 204, difficulty: 'Intermediate', category: 'Radiation Protection',
    question: "What is the weighting factor (Wr) for X-rays?",
    options: ["1", "5", "10", "20"],
    answer: "1", explanation: "X-rays and gamma rays have a radiation weighting factor of 1. Alpha particles have 20."
  },
  {
    id: 205, difficulty: 'Intermediate', category: 'CT',
    question: "Window Width in CT controls:",
    options: ["Image Brightness", "Image Contrast", "Spatial Resolution", "Patient Dose"],
    answer: "Image Contrast", explanation: "Window Width determines the range of Hounsfield units displayed, affecting contrast. Window Level controls brightness."
  },
  {
    id: 206, difficulty: 'Intermediate', category: 'MRI',
    question: "The 'quench' button in MRI should be used:",
    options: ["To shut down at night", "Only in life-threatening emergencies", "To restart the computer", "If the image is blurry"],
    answer: "Only in life-threatening emergencies", explanation: "Quenching boils off the liquid helium, destroying the magnetic field. It is dangerous and costly."
  },
  {
    id: 207, difficulty: 'Intermediate', category: 'Positioning',
    question: "Which position demonstrates the left colic (splenic) flexure open?",
    options: ["RPO", "LPO", "RAO", "LAO"],
    answer: "RPO", explanation: "The RPO (Right Posterior Oblique) or LAO position opens the left colic flexure."
  },
  {
    id: 208, difficulty: 'Intermediate', category: 'Physics',
    question: "Bremsstrahlung interactions occur when an electron:",
    options: ["Knocks out an inner shell electron", "Slows down near the nucleus", "Hits a neutron", "Absorbs a photon"],
    answer: "Slows down near the nucleus", explanation: "Bremsstrahlung ('Braking radiation') happens when an electron is deflected by the nuclear field."
  },
  {
    id: 209, difficulty: 'Intermediate', category: 'Patient Care',
    question: "Which shock type is caused by severe allergic reaction?",
    options: ["Hypovolemic", "Septic", "Anaphylactic", "Cardiogenic"],
    answer: "Anaphylactic", explanation: "Anaphylaxis is a severe systemic hypersensitivity reaction."
  },
  {
    id: 210, difficulty: 'Intermediate', category: 'Modalities',
    question: "Fluoroscopy provides:",
    options: ["Static images", "Dynamic real-time imaging", "Cross-sectional images", "Nuclear uptake images"],
    answer: "Dynamic real-time imaging", explanation: "Fluoroscopy allows viewing of moving structures in real-time."
  },
  {
    id: 211, difficulty: 'Intermediate', category: 'Physics',
    question: "High LET (Linear Energy Transfer) radiation includes:",
    options: ["X-rays", "Alpha particles", "Gamma rays", "Microwaves"],
    answer: "Alpha particles", explanation: "Alpha particles are heavy and deposit energy rapidly over a short distance (High LET)."
  },
  {
    id: 212, difficulty: 'Intermediate', category: 'Positioning',
    question: "The Stenvers method is used for:",
    options: ["Temporal bone/Petrous ridges", "Knee", "Shoulder", "Sacrum"],
    answer: "Temporal bone/Petrous ridges", explanation: "Stenvers is an oblique projection for the petrous portion of the temporal bone."
  },
  {
    id: 213, difficulty: 'Intermediate', category: 'Anatomy',
    question: "The common bile duct is formed by the union of:",
    options: ["Cystic and Common Hepatic ducts", "Pancreatic and Cystic ducts", "Right and Left Hepatic ducts", "None of above"],
    answer: "Cystic and Common Hepatic ducts", explanation: "The cystic duct (from gall bladder) joins the common hepatic duct (from liver) to form the CBD."
  },
  {
    id: 214, difficulty: 'Intermediate', category: 'Physics',
    question: "DICOM stands for:",
    options: ["Digital Imaging and Communications in Medicine", "Direct Image Computer Output Method", "Diagnostic Imaging Center of Medicine", "Digital Input Computer Output Module"],
    answer: "Digital Imaging and Communications in Medicine", explanation: "DICOM is the standard for transmitting and storing medical imaging information."
  },
  {
    id: 215, difficulty: 'Intermediate', category: 'Positioning',
    question: "Where is the CR centered for a PA hand?",
    options: ["First MCP joint", "Third MCP joint", "Wrist joint", "Mid-palm"],
    answer: "Third MCP joint", explanation: "The Central Ray is directed to the third metacarpophalangeal joint."
  },

  // --- ADVANCED LEVEL ---
  {
    id: 50,
    difficulty: 'Advanced',
    category: 'MRI',
    question: "Which MRI artifact is caused by the difference in resonant frequencies of fat and water protons?",
    options: ["Aliasing", "Chemical Shift", "Susceptibility", "Zipper artifact"],
    answer: "Chemical Shift",
    explanation: "Chemical shift artifact occurs at fat-water interfaces because fat and water protons precess at slightly different frequencies."
  },
  {
    id: 51,
    difficulty: 'Advanced',
    category: 'Physics',
    question: "What is the minimum lead equivalence for a lead apron used in fluoroscopy (at 100kVp)?",
    options: ["0.25 mm Pb", "0.5 mm Pb", "1.0 mm Pb", "0.1 mm Pb"],
    answer: "0.5 mm Pb",
    explanation: "For fluoroscopic procedures where kVp exceeds 100, a minimum of 0.5mm lead equivalence is standard recommendation."
  },
  {
    id: 52,
    difficulty: 'Advanced',
    category: 'CT',
    question: "Which generation of CT scanners introduced the 'rotate-rotate' movement with a slip ring?",
    options: ["First generation", "Second generation", "Third generation", "Fourth generation"],
    answer: "Third generation",
    explanation: "Third-generation scanners use a wide fan beam and a rotating tube/detector array. Slip rings allowed for continuous helical scanning."
  },
  {
    id: 53,
    difficulty: 'Advanced',
    category: 'Positioning',
    question: "The Judet views of the pelvis are used to visualize:",
    options: ["Sacroiliac joints", "Acetabulum", "Symphysis pubis", "Iliac crests"],
    answer: "Acetabulum",
    explanation: "Judet views (internal and external oblique pelvis) are specific for assessing acetabular fractures."
  },
  {
    id: 54,
    difficulty: 'Advanced',
    category: 'Physics',
    question: "Which of the following describes the 'Line Focus Principle'?",
    options: ["Actual focal spot > Effective focal spot", "Effective focal spot > Actual focal spot", "Actual = Effective", "Using a grid improves focus"],
    answer: "Actual focal spot > Effective focal spot",
    explanation: "By angling the anode target, the effective focal spot (projected toward patient) is smaller than the actual focal spot, improving resolution while maintaining heat capacity."
  },
  {
    id: 55,
    difficulty: 'Advanced',
    category: 'Radiobiology',
    question: "The Linear Non-Threshold (LNT) model assumes:",
    options: ["Risk is zero below a certain dose", "Any dose, no matter how small, carries some risk", "Radiation is beneficial at low doses", "Risk decreases with high dose"],
    answer: "Any dose, no matter how small, carries some risk",
    explanation: "LNT assumes there is no safe level of radiation and risk is directly proportional to dose, used for setting protection standards."
  },
  {
    id: 56,
    difficulty: 'Advanced',
    category: 'Ultrasound',
    question: "Acoustic shadowing in ultrasound is commonly seen behind:",
    options: ["Fluid-filled cysts", "Gallstones or bones", "Liver parenchyma", "Blood vessels"],
    answer: "Gallstones or bones",
    explanation: "Highly attenuating structures like stones or bone reflect/absorb sound, creating a dark shadow behind them."
  },
  {
    id: 57,
    difficulty: 'Advanced',
    category: 'CT',
    question: "Pitch in helical CT is defined as:",
    options: ["Table feed per rotation / Beam width", "kVp / mAs", "Slice thickness / Time", "Gantry tilt / Table height"],
    answer: "Table feed per rotation / Beam width",
    explanation: "Pitch is the ratio of table movement per rotation to the beam collimation width. Pitch > 1 implies gaps/faster scan; Pitch < 1 implies overlap/higher dose."
  },
  {
    id: 58,
    difficulty: 'Advanced',
    category: 'Positioning',
    question: "For a lateral projection of the knee, how much should the tube be angled to prevent joint space obscuration?",
    options: ["0 degrees", "5-7 degrees cephalad", "5-7 degrees caudad", "15 degrees cephalad"],
    answer: "5-7 degrees cephalad",
    explanation: "Because the medial condyle is larger and extends lower, a 5-7 degree cephalad angle superimposes the condyles."
  },
  {
    id: 59,
    difficulty: 'Advanced',
    category: 'Physics',
    question: "The primary purpose of filtration (inherent + added) is to:",
    options: ["Increase contrast", "Reduce patient skin dose", "Reduce scatter", "Increase density"],
    answer: "Reduce patient skin dose",
    explanation: "Filtration 'hardens' the beam by removing low-energy photons that would otherwise be absorbed by the patient's skin without contributing to the image."
  },
  {
    id: 60,
    difficulty: 'Advanced',
    category: 'Digital Imaging',
    question: "In DR, what is the 'fill factor' of a detector element (del)?",
    options: ["Percentage of del sensitive to X-rays", "Amount of storage space", "Speed of image transfer", "Number of pixels"],
    answer: "Percentage of del sensitive to X-rays",
    explanation: "Fill factor is the ratio of the sensing area of the pixel to the total area of the pixel. Higher fill factor = higher efficiency."
  },
  {
    id: 301, difficulty: 'Advanced', category: 'Physics',
    question: "Which logic gate is NOT used in digital circuits?",
    options: ["AND", "OR", "FLUX", "NAND"],
    answer: "FLUX", explanation: "Flux is a concept of flow, not a logic gate. AND, OR, NAND are standard digital logic gates."
  },
  {
    id: 302, difficulty: 'Advanced', category: 'MRI',
    question: "SAR (Specific Absorption Rate) limits are primarily imposed to prevent:",
    options: ["Tissue heating", "Nerve stimulation", "Hearing loss", "Magnet quench"],
    answer: "Tissue heating", explanation: "SAR measures the rate of RF energy absorption by the body, which causes tissue heating."
  },
  {
    id: 303, difficulty: 'Advanced', category: 'CT',
    question: "Streak artifacts in CT are often caused by:",
    options: ["Patient motion or metal", "Tube cooling", "Low kVp", "Thick slices"],
    answer: "Patient motion or metal", explanation: "High density objects (metal) or motion cause severe streak artifacts due to beam hardening or misregistration."
  },
  {
    id: 304, difficulty: 'Advanced', category: 'Radiobiology',
    question: "What is the LD 50/60 for humans (approximate)?",
    options: ["1-2 Gy", "3-4 Gy", "8-10 Gy", "0.5 Gy"],
    answer: "3-4 Gy", explanation: "The lethal dose to kill 50% of the population in 60 days is approximately 3-4 Gray without medical intervention."
  },
  {
    id: 305, difficulty: 'Advanced', category: 'Positioning',
    question: "The Holmblad method visualizes the:",
    options: ["Intercondylar fossa", "Patella", "Tibial tuberosity", "Femoral neck"],
    answer: "Intercondylar fossa", explanation: "The Holmblad (PA Axial) 'tunnel view' demonstrates the intercondylar fossa of the knee."
  },
  {
    id: 306, difficulty: 'Advanced', category: 'Physics',
    question: "In fluoroscopy, Automatic Brightness Control (ABC) maintains brightness by:",
    options: ["Adjusting kVp and mA", "Moving the patient", "Changing the monitor", "Filtering the beam"],
    answer: "Adjusting kVp and mA", explanation: "ABC automatically adjusts technical factors to maintain consistent image brightness despite varying patient thickness."
  },
  {
    id: 307, difficulty: 'Advanced', category: 'MRI',
    question: "K-space data in MRI represents:",
    options: ["Spatial frequencies", "Image pixels", "Time domain", "Sound waves"],
    answer: "Spatial frequencies", explanation: "K-space is the raw data matrix of spatial frequencies, which is Fourier Transformed into the image."
  },
  {
    id: 308, difficulty: 'Advanced', category: 'Anatomy',
    question: "The Circle of Willis supplies blood to the:",
    options: ["Heart", "Brain", "Liver", "Lungs"],
    answer: "Brain", explanation: "The Circle of Willis is the anastomotic ring of arteries supplying the brain."
  },
  {
    id: 309, difficulty: 'Advanced', category: 'Physics',
    question: "DQE (Detective Quantum Efficiency) measures:",
    options: ["System efficiency in converting input signal to output image", "Speed of X-rays", "Tube heat capacity", "Grid ratio"],
    answer: "System efficiency in converting input signal to output image", explanation: "Higher DQE means the system is more efficient, allowing for lower patient dose for the same image quality."
  },
  {
    id: 310, difficulty: 'Advanced', category: 'Modalities',
    question: "PET scanning relies on the detection of:",
    options: ["Annihilation photons", "Protons", "Neutrons", "Sound waves"],
    answer: "Annihilation photons", explanation: "Positron Emission Tomography detects pairs of gamma rays (photons) emitted during positron-electron annihilation."
  },
  {
    id: 311, difficulty: 'Advanced', category: 'CT',
    question: "Iterative Reconstruction in CT allows for:",
    options: ["Higher dose, better speed", "Lower dose, maintained image quality", "Faster rotation", "Larger FOV"],
    answer: "Lower dose, maintained image quality", explanation: "Iterative reconstruction algorithms process data in loops to reduce noise, allowing for significant dose reduction."
  },
  {
    id: 312, difficulty: 'Advanced', category: 'Positioning',
    question: "Which projection demonstrates the articular facets (zygapophyseal joints) of the L-spine?",
    options: ["Oblique", "Lateral", "AP", "Spot view"],
    answer: "Oblique", explanation: "Oblique projections (the 'Scotty Dog' view) demonstrate the zygapophyseal joints of the lumbar spine."
  },
  // --- NEW CLINICAL / CASE STUDY QUESTIONS (Advanced) ---
  {
    id: 400, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: A 30-year-old female presents with severe right upper quadrant pain. Ultrasound shows a hyperechoic structure with acoustic shadowing in the gallbladder. The wall thickness is 5mm. What is the most likely diagnosis?",
    options: ["Acute Cholecystitis", "Liver Hemangioma", "Pancreatitis", "Renal Calculus"],
    answer: "Acute Cholecystitis", explanation: "Gallstones (hyperechoic + shadowing) plus thickened gallbladder wall (>3mm) typically indicates Acute Cholecystitis."
  },
  {
    id: 401, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: Trauma patient arrives in C-Collar. Lateral C-Spine shows a bilateral fracture of the C2 pars interarticularis. What is this fracture called?",
    options: ["Jefferson Fracture", "Hangman's Fracture", "Clay-Shoveler's Fracture", "Chance Fracture"],
    answer: "Hangman's Fracture", explanation: "A Hangman's fracture involves the pars interarticularis of C2 (Axis), often caused by hyperextension."
  },
  {
    id: 402, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: A patient undergoing an IVU complains of a metallic taste and a warm sensation spreading through their body immediately after injection. What is the appropriate action?",
    options: ["Call code blue immediately", "Administer epinephrine", "Stop procedure and reassure patient", "Administer antihistamines"],
    answer: "Stop procedure and reassure patient", explanation: "Metallic taste and warmth are common, mild, non-allergic physiological side effects of contrast media. Reassurance is key."
  },
  {
    id: 403, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: A chest X-ray reveals a 'Deep Sulcus Sign' on a supine trauma patient. What pathology does this suggest?",
    options: ["Pneumothorax", "Pleural Effusion", "Pneumonia", "Aortic Dissection"],
    answer: "Pneumothorax", explanation: "In a supine patient, air collects anteriorly and inferiorly in the costophrenic angle, creating a deep, lucent costophrenic sulcus known as the Deep Sulcus Sign."
  },
  {
    id: 404, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: MRI Brain shows restricted diffusion (bright on DWI, dark on ADC) in the MCA territory. This indicates:",
    options: ["Acute Ischemic Stroke", "Multiple Sclerosis Plaque", "Glioblastoma", "Chronic Infarct"],
    answer: "Acute Ischemic Stroke", explanation: "Restricted diffusion is the hallmark of cytotoxic edema found in acute ischemic stroke, visible within minutes of onset."
  },
  {
    id: 405, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: Pediatric patient presents with a 'steeple sign' on AP neck soft tissue X-ray. What is the diagnosis?",
    options: ["Epiglottitis", "Croup (Laryngotracheobronchitis)", "Retropharyngeal Abscess", "Foreign Body"],
    answer: "Croup (Laryngotracheobronchitis)", explanation: "The 'Steeple Sign' is narrowing of the subglottic trachea, characteristic of Croup. Epiglottitis shows a 'Thumb Sign' on lateral."
  },
  {
    id: 406, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: During a barium enema, you observe the 'Apple Core' sign in the sigmoid colon. This is highly suggestive of:",
    options: ["Diverticulitis", "Colorectal Carcinoma", "Ulcerative Colitis", "Volvulus"],
    answer: "Colorectal Carcinoma", explanation: "The 'Apple Core' lesion is a classic appearance of an annular constricting carcinoma of the colon."
  },
  {
    id: 407, difficulty: 'Advanced', category: 'Case Study',
    question: "CASE: Patient with history of smoking presents with hemoptysis. CT shows a 'spiculated' lung mass. This morphology is most concerning for:",
    options: ["Malignancy", "Hamartoma", "Abscess", "TB Granuloma"],
    answer: "Malignancy", explanation: "Spiculated margins (sunburst appearance) are highly suspicious for malignant lung nodules due to infiltrative growth."
  }
];

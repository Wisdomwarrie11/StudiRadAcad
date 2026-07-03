import { ChallengeLevel, ChallengeTopic } from '../types';
import { expandTo30Questions } from './questionGenerator';

const BASE_BASIC_TECHNIQUE = [
  {
    text: "What is the standard SID for a PA chest radiograph?",
    options: ["180 cm (72 inches)", "100 cm (40 inches)", "120 cm (48 inches)", "150 cm (60 inches)"],
    correctIndex: 0,
    explanation: "PA chest radiographs are taken at 180 cm (72 inches) to minimize heart magnification.",
    referenceLink: ""
  },
  {
    text: "Which of the following lines should be perpendicular to the IR for a lateral skull?",
    options: ["Interpupillary line", "Omeatal line", "Glabellomeatal line", "Acanthiomeatal line"],
    correctIndex: 0,
    explanation: "The interpupillary line must be perpendicular to the IR to ensure a true lateral skull without tilt.",
    referenceLink: ""
  },
  {
    text: "Which breathing phase is required for an abdominal radiograph?",
    options: ["Suspended expiration", "Suspended inspiration", "Shallow breathing", "Continuous breathing"],
    correctIndex: 0,
    explanation: "Suspended expiration raises the diaphragm, allowing better visualization of abdominal organs.",
    referenceLink: ""
  },
  {
    text: "For a dorsoplantar projection of the foot, the central ray is directed:",
    options: ["10 degrees posteriorly", "15 degrees anteriorly", "Directly perpendicular", "20 degrees laterally"],
    correctIndex: 0,
    explanation: "An angle of 10 degrees posteriorly toward the heel aligns the ray perpendicular to the metatarsals.",
    referenceLink: ""
  },
  {
    text: "Which projection best demonstrates the fluid levels in a pleural effusion?",
    options: ["Lateral decubitus", "AP recumbent", "PA upright", "Left oblique"],
    correctIndex: 0,
    explanation: "A lateral decubitus chest projection with the affected side down allows fluid to accumulate and be visualized.",
    referenceLink: ""
  }
];
export const BASIC_TECHNIQUE = expandTo30Questions(BASE_BASIC_TECHNIQUE, ChallengeTopic.TECHNIQUE, ChallengeLevel.BASIC);

const BASE_BASIC_SPECIAL_PROCEDURES = [
  {
    text: "What is the primary contrast agent used for a standard barium swallow?",
    options: ["Barium sulfate suspension", "Water-soluble iodinated dye", "Air and carbon dioxide", "Diluted oily contrast"],
    correctIndex: 0,
    explanation: "Barium sulfate is an inert, radiopaque compound ideal for coating the gastrointestinal tract.",
    referenceLink: ""
  },
  {
    text: "Which timing is most critical for starting the first film of an IVU?",
    options: ["3 minutes post-injection", "10 minutes post-injection", "15 minutes post-injection", "30 minutes post-injection"],
    correctIndex: 0,
    explanation: "The nephrogram phase is best captured around 3 minutes after contrast injection.",
    referenceLink: ""
  },
  {
    text: "Hysterosalpingography (HSG) is primarily performed to evaluate:",
    options: ["Uterine cavity and tubes", "Ovarian follicle volume", "Cervical length changes", "Pelvic lymph node chain"],
    correctIndex: 0,
    explanation: "HSG uses contrast to visualize the inner uterine cavity and test the patency of the fallopian tubes.",
    referenceLink: ""
  },
  {
    text: "During a double-contrast barium enema, what is used to distend the colon?",
    options: ["Insufflated room air", "Physiological saline", "Water-soluble contrast", "Warm tap water"],
    correctIndex: 0,
    explanation: "Room air or carbon dioxide is introduced to distend the bowel and reveal mucosal details.",
    referenceLink: ""
  },
  {
    text: "Which of the following is a contraindication for using barium sulfate?",
    options: ["Suspected perforation", "Chronic constipation", "Irritable bowel syndrome", "Mild gastroesophageal reflux"],
    correctIndex: 0,
    explanation: "If a perforation is suspected, water-soluble contrast should be used to prevent barium peritonitis.",
    referenceLink: ""
  }
];
export const BASIC_SPECIAL_PROCEDURES = expandTo30Questions(BASE_BASIC_SPECIAL_PROCEDURES, ChallengeTopic.SPECIAL_PROCEDURES, ChallengeLevel.BASIC);

const BASE_BASIC_MRI = [
  {
    text: "Which physical element in the human body is primarily imaged in MRI?",
    options: ["Hydrogen nucleus (proton)", "Carbon-12 isotope", "Calcium bone crystals", "Free molecular oxygen"],
    correctIndex: 0,
    explanation: "Hydrogen protons are highly abundant in the body and possess a strong magnetic moment.",
    referenceLink: ""
  },
  {
    text: "What is the unit used to measure clinical magnetic field strength?",
    options: ["Tesla (T)", "Hertz (Hz)", "Sievert (Sv)", "Roentgen (R)"],
    correctIndex: 0,
    explanation: "Clinical MRI scanners typically operate at magnetic field strengths measured in Tesla (T).",
    referenceLink: ""
  },
  {
    text: "In T1-weighted imaging, which of the following tissues appears bright?",
    options: ["Subcutaneous fat", "Cerebrospinal fluid", "Compact cortical bone", "Air in paranasal sinuses"],
    correctIndex: 0,
    explanation: "Fat has a short T1 relaxation time and appears bright (hyperintense) on T1-weighted images.",
    referenceLink: ""
  },
  {
    text: "What is the main purpose of the radiofrequency (RF) coils in MRI?",
    options: ["Transmitting and receiving signals", "Creating the main magnetic field", "Spatially encoding the signals", "Cooling the superconducting magnet"],
    correctIndex: 0,
    explanation: "RF coils transmit RF pulses into the patient and receive the resulting resonance signals.",
    referenceLink: ""
  },
  {
    text: "Which of the following is considered a primary contraindication for MRI?",
    options: ["Cardiac pacemaker", "Dental silver fillings", "Titanium orthopedic plate", "Intravenous plastic cannula"],
    correctIndex: 0,
    explanation: "Metallic implants like pacemakers can malfunction or experience heating under strong MRI fields.",
    referenceLink: ""
  }
];
export const BASIC_MRI = expandTo30Questions(BASE_BASIC_MRI, ChallengeTopic.MRI, ChallengeLevel.BASIC);

const BASE_BASIC_CT = [
  {
    text: "What does the Hounsfield unit of 0 (zero) represent?",
    options: ["The density of pure water", "The density of compact bone", "The density of ambient air", "The density of skeletal muscle"],
    correctIndex: 0,
    explanation: "Water is the reference standard in CT calibration and is assigned a value of 0 HU.",
    referenceLink: ""
  },
  {
    text: "Which of the following parameters directly controls slice thickness?",
    options: ["Pre-detector collimation", "Tube current (mA) selection", "Peak voltage (kVp) level", "Display window width"],
    correctIndex: 0,
    explanation: "Collimation of the X-ray beam restricts its width before it hits the detectors, setting the slice thickness.",
    referenceLink: ""
  },
  {
    text: "The circular frame of the CT scanner that houses the tube is called:",
    options: ["Gantry", "Console", "Couch", "Aperture"],
    correctIndex: 0,
    explanation: "The gantry contains the rotating slip rings, X-ray tube, filters, collimators, and detectors.",
    referenceLink: ""
  },
  {
    text: "What is the primary purpose of a bow-tie filter in CT?",
    options: ["Equalizing beam intensity", "Increasing beam energy", "Reducing gantry rotation speed", "Magnifying the output image"],
    correctIndex: 0,
    explanation: "Bow-tie filters match the body's cylindrical shape to deliver a uniform radiation intensity to the detectors.",
    referenceLink: ""
  },
  {
    text: "A pitch value of less than 1.0 in helical CT scanning indicates:",
    options: ["Overlapping slice acquisition", "Gaps between scanning slices", "Very high patient throughput", "Reduced patient radiation dose"],
    correctIndex: 0,
    explanation: "A pitch of less than 1.0 means the table moves less than the beam width per rotation, causing overlap.",
    referenceLink: ""
  }
];
export const BASIC_CT = expandTo30Questions(BASE_BASIC_CT, ChallengeTopic.CT, ChallengeLevel.BASIC);

const BASE_BASIC_USS = [
  {
    text: "What is the range of sound frequencies used in clinical ultrasound?",
    options: ["2 MHz to 15 MHz", "20 Hz to 20,000 Hz", "50 kHz to 100 kHz", "500 MHz to 1000 MHz"],
    correctIndex: 0,
    explanation: "Diagnostic ultrasound utilizes high frequencies, typically in the range of 2 to 15 Megahertz.",
    referenceLink: ""
  },
  {
    text: "Which type of transducer is best suited for scanning deep abdominal organs?",
    options: ["Curvilinear array", "High-frequency linear", "Endocavity transducer", "Intraoperative probe"],
    correctIndex: 0,
    explanation: "Curvilinear probes provide lower frequencies with a wider sector format, ideal for depth penetration.",
    referenceLink: ""
  },
  {
    text: "An structure that reflects a large amount of ultrasound waves appears:",
    options: ["Hyperechoic (white)", "Anechoic (black)", "Hypoechoic (dark gray)", "Isoechoic (medium gray)"],
    correctIndex: 0,
    explanation: "Highly reflective structures reflect most of the sound and appear bright white or hyperechoic.",
    referenceLink: ""
  },
  {
    text: "Which of the following substances appears completely black (anechoic)?",
    options: ["Clear fluid", "Gallstone", "Liver tissue", "Compact bone"],
    correctIndex: 0,
    explanation: "Fluid does not have internal acoustic interfaces, so it transmits all sound and appears anechoic.",
    referenceLink: ""
  },
  {
    text: "What physical phenomenon allows ultrasound crystals to produce sound?",
    options: ["Piezoelectric effect", "Photoelectric effect", "Compton scattering", "Thermionic emission"],
    correctIndex: 0,
    explanation: "The piezoelectric effect converts electrical energy into mechanical sound waves and vice versa.",
    referenceLink: ""
  }
];
export const BASIC_USS = expandTo30Questions(BASE_BASIC_USS, ChallengeTopic.USS, ChallengeLevel.BASIC);

const BASE_BASIC_SAFETY = [
  {
    text: "What does the radiation safety acronym ALARA stand for?",
    options: ["As Low As Reasonably Achievable", "As Late As Radiologist Approves", "Always Limit All Radiation Area", "Action Level And Radioprotection Act"],
    correctIndex: 0,
    explanation: "ALARA is the guiding principle of keeping patient dose as low as reasonably achievable.",
    referenceLink: ""
  },
  {
    text: "Which of the following is the most effective way to reduce scatter?",
    options: ["Beam collimation", "Increasing grid ratio", "Increasing the kVp", "Shortening exposure time"],
    correctIndex: 0,
    explanation: "Collimating the beam reduces the volume of tissue irradiated, which directly decreases scatter production.",
    referenceLink: ""
  },
  {
    text: "What is the annual occupational effective dose limit for a worker?",
    options: ["20 mSv per year", "50 mSv per year", "100 mSv per year", "5 mSv per year"],
    correctIndex: 0,
    explanation: "Most international bodies recommend an occupational limit of 20 mSv averaged over defined 5-year periods.",
    referenceLink: ""
  },
  {
    text: "Which material is primarily used to shield diagnostic X-ray rooms?",
    options: ["Lead sheets", "Copper plates", "Aluminum foils", "Wood panels"],
    correctIndex: 0,
    explanation: "Lead has a high atomic number and density, making it extremely effective at absorbing diagnostic X-rays.",
    referenceLink: ""
  },
  {
    text: "The three cardinal principles of radiation protection are:",
    options: ["Time, distance, shielding", "Time, filtration, grids", "mAs, kVp, collimation", "Collimation, grids, lead"],
    correctIndex: 0,
    explanation: "Minimizing time, maximizing distance, and using shielding are the three fundamental rules of protection.",
    referenceLink: ""
  }
];
export const BASIC_SAFETY = expandTo30Questions(BASE_BASIC_SAFETY, ChallengeTopic.SAFETY, ChallengeLevel.BASIC);

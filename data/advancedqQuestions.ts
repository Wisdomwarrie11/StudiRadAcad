import { ChallengeLevel, ChallengeTopic } from '../types';
import { expandTo30Questions } from './questionGenerator';

const BASE_ADVANCED_TECHNIQUE = [
  {
    text: "Which of the following describes the 'heel effect' in an X-ray tube?",
    options: ["Higher intensity at cathode", "Higher intensity at anode", "Equal distribution of beam", "Reduced scatter at cathode"],
    correctIndex: 0,
    explanation: "Because X-rays are absorbed by the anode target itself, the beam intensity is higher on the cathode side.",
    referenceLink: ""
  },
  {
    text: "When performing an axial projection of the clavicle, the angle is:",
    options: ["15 to 30 degrees cephalad", "5 to 10 degrees caudad", "45 degrees cephalad", "Perpendicular to the IR"],
    correctIndex: 0,
    explanation: "An angle of 15 to 30 degrees cephalad projects the clavicle above the ribs and scapula.",
    referenceLink: ""
  },
  {
    text: "Which anatomical structure is best demonstrated in the Judet view?",
    options: ["Acetabular column fractures", "Femoral neck alignment", "Symphysis pubis integrity", "Iliac bone displacement"],
    correctIndex: 0,
    explanation: "The Judet view (internal and external obliques of pelvis) is the gold standard for acetabulum fractures.",
    referenceLink: ""
  },
  {
    text: "To optimize contrast in an obese patient's spine exam, one should:",
    options: ["Decrease kVp and increase mAs", "Increase kVp and decrease mAs", "Remove the grid completely", "Increase the field of view"],
    correctIndex: 0,
    explanation: "Using a lower kVp decreases scatter, while increasing mAs maintains the desired film density.",
    referenceLink: ""
  },
  {
    text: "The main clinical indication for a radiograph with suspended respiration is:",
    options: ["Eliminating motion blur", "Enhancing contrast scale", "Increasing spatial detail", "Reducing the patient dose"],
    correctIndex: 0,
    explanation: "Suspended breathing stops the movement of organs, completely removing respiration-induced motion artifacts.",
    referenceLink: ""
  }
];
export const ADVANCED_TECHNIQUE = expandTo30Questions(BASE_ADVANCED_TECHNIQUE, ChallengeTopic.TECHNIQUE, ChallengeLevel.ADVANCED);

const BASE_ADVANCED_SPECIAL_PROCEDURES = [
  {
    text: "Which of the following is most appropriate for a suspected tracheal leak?",
    options: ["Water-soluble iodinated agent", "High density barium paste", "Oily bronchography contrast", "Diluted barium suspension"],
    correctIndex: 0,
    explanation: "Water-soluble contrast is absorbable and safe if it leaks into the mediastinum or peritoneal cavity.",
    referenceLink: ""
  },
  {
    text: "In an endoscopic retrograde cholangiopancreatography (ERCP), contrast is injected into:",
    options: ["The common bile duct", "The portal vein system", "The main hepatic artery", "The duodenum lumen"],
    correctIndex: 0,
    explanation: "Contrast is cannulated and directly injected into the biliary tree and pancreatic ducts via the papilla.",
    referenceLink: ""
  },
  {
    text: "What is the primary medication kept on hand to treat bronchospasm after contrast?",
    options: ["Inhaled albuterol", "Intravenous saline", "Diphenhydramine tablet", "Oral methylprednisolone"],
    correctIndex: 0,
    explanation: "Beta-2 agonists like albuterol provide rapid bronchodilation in acute contrast-induced spasms.",
    referenceLink: ""
  },
  {
    text: "During sialogram imaging, a patient is given a sialagogue to:",
    options: ["Stimulate salivary flow", "Minimize motion blur", "Anesthetize the duct", "Reduce duct secretion"],
    correctIndex: 0,
    explanation: "Sialagogues (like lemon juice) stimulate saliva production to help locate ducts or flush contrast.",
    referenceLink: ""
  },
  {
    text: "For a percutaneous transhepatic cholangiography (PTC), contrast is introduced:",
    options: ["Directly into hepatic duct", "Through a duodenal tube", "Via the femoral artery", "Into the gallbladder wall"],
    correctIndex: 0,
    explanation: "PTC involves passing a needle through the abdominal wall directly into an intrahepatic bile duct.",
    referenceLink: ""
  }
];
export const ADVANCED_SPECIAL_PROCEDURES = expandTo30Questions(BASE_ADVANCED_SPECIAL_PROCEDURES, ChallengeTopic.SPECIAL_PROCEDURES, ChallengeLevel.ADVANCED);

const BASE_ADVANCED_MRI = [
  {
    text: "Which parameter primarily determines the amount of T1 weighting in a spin echo?",
    options: ["Repetition time (TR)", "Echo time (TE) length", "Inversion time (TI)", "Flip angle magnitude"],
    correctIndex: 0,
    explanation: "TR controls how much longitudinal magnetization recovers before the next RF excitation, governing T1 weighting.",
    referenceLink: ""
  },
  {
    text: "Which artifact is caused by tissues with different resonant frequencies in a voxel?",
    options: ["Chemical shift artifact", "Gibbs truncation effect", "Aliasing foldover error", "RF cross-talk artifact"],
    correctIndex: 0,
    explanation: "Chemical shift arises from the precessional frequency difference between fat and water protons.",
    referenceLink: ""
  },
  {
    text: "The precessional frequency of hydrogen protons is determined by:",
    options: ["The Larmor equation", "The Nyquist theorem", "The Beer-Lambert law", "The Faraday induction law"],
    correctIndex: 0,
    explanation: "Larmor equation (frequency = gyromagnetic ratio multiplied by field strength) governs precessional rate.",
    referenceLink: ""
  },
  {
    text: "What is the primary biological hazard associated with fast gradient switching?",
    options: ["Peripheral nerve stimulation", "Core body temperature rise", "Irreversible tissue necrosis", "DNA molecular mutation"],
    correctIndex: 0,
    explanation: "Rapidly changing gradient fields can induce electrical currents in tissue, causing peripheral nerve tingling.",
    referenceLink: ""
  },
  {
    text: "Gadolinium-based contrast agents work by primarily shortening:",
    options: ["T1 relaxation times", "T2 relaxation times", "Echo times of tissues", "Repetition times used"],
    correctIndex: 0,
    explanation: "Gadolinium is paramagnetic and shortens T1 relaxation times, causing bright enhancement on T1 images.",
    referenceLink: ""
  }
];
export const ADVANCED_MRI = expandTo30Questions(BASE_ADVANCED_MRI, ChallengeTopic.MRI, ChallengeLevel.ADVANCED);

const BASE_ADVANCED_CT = [
  {
    text: "Which of the following is the standard CT reconstruction algorithm for bone details?",
    options: ["High spatial frequency filter", "Low-pass smoothing algorithm", "Standard soft tissue kernel", "Iterative bone attenuation map"],
    correctIndex: 0,
    explanation: "High spatial frequency kernels (sharp filters) enhance edges and bone trabeculae at the expense of noise.",
    referenceLink: ""
  },
  {
    text: "What does a wider display window width (e.g. WW 1500) do to image contrast?",
    options: ["Decreases displayed contrast", "Increases displayed contrast", "Inverts black and white shades", "Eliminates high-frequency noise"],
    correctIndex: 0,
    explanation: "A wide window spreads the grayscale over more HU values, decreasing contrast between individual pixels.",
    referenceLink: ""
  },
  {
    text: "Which of the following is the main cause of cupping artifacts in CT?",
    options: ["Beam hardening effect", "Patient voluntary motion", "Partial volume averaging", "Detector channel failure"],
    correctIndex: 0,
    explanation: "As the beam passes through tissue, low energy photons are absorbed, shifting the average energy higher.",
    referenceLink: ""
  },
  {
    text: "The capability of a CT system to resolve small objects of high contrast is:",
    options: ["Spatial resolution", "Contrast resolution", "Temporal resolution", "Linearity coefficient"],
    correctIndex: 0,
    explanation: "Spatial resolution describes the scanner's ability to resolve tiny, high-contrast objects close together.",
    referenceLink: ""
  },
  {
    text: "An increase in CT slice thickness will result in which of the following?",
    options: ["Reduced image noise levels", "Increased spatial resolution", "Higher partial volume error", "Increased patient skin dose"],
    correctIndex: 0,
    explanation: "Thicker slices collect more photons per voxel, reducing statistical noise but increasing partial volume effects.",
    referenceLink: ""
  }
];
export const ADVANCED_CT = expandTo30Questions(BASE_ADVANCED_CT, ChallengeTopic.CT, ChallengeLevel.ADVANCED);

const BASE_ADVANCED_USS = [
  {
    text: "What determines the propagation speed of sound in a biological tissue?",
    options: ["Tissue stiffness and density", "The transducer frequency used", "The total sound power output", "The angle of beam incidence"],
    correctIndex: 0,
    explanation: "Sound velocity depends on the physical properties of the medium (bulk modulus and density).",
    referenceLink: ""
  },
  {
    text: "Which Doppler mode is capable of showing the highest velocity without aliasing?",
    options: ["Continuous wave Doppler", "Pulsed wave Doppler", "Color flow mapping", "Power amplitude Doppler"],
    correctIndex: 0,
    explanation: "Continuous wave Doppler uses separate transmit/receive crystals, allowing infinite velocity measurement.",
    referenceLink: ""
  },
  {
    text: "The loss of sound energy as it travels through tissue is called:",
    options: ["Attenuation of sound", "Refraction of wave", "Acoustic impedance", "Reverberation echo"],
    correctIndex: 0,
    explanation: "Attenuation is the reduction in amplitude and intensity of a sound wave as it travels through a medium.",
    referenceLink: ""
  },
  {
    text: "Which frequency is ideal for resolving superficial structures like thyroid nodules?",
    options: ["10 MHz to 15 MHz", "2 MHz to 5 MHz", "1 MHz to 2 MHz", "20 MHz to 30 MHz"],
    correctIndex: 0,
    explanation: "Superficial structures require high frequencies (10-15 MHz) for superior spatial resolution.",
    referenceLink: ""
  },
  {
    text: "Acoustic enhancement occurs posterior to which of the following structures?",
    options: ["A fluid-filled cyst", "A dense calcification", "A thick muscle band", "A gas-filled bowel loop"],
    correctIndex: 0,
    explanation: "Fluid attenuates sound very little, leaving more energy to create brighter echoes behind it.",
    referenceLink: ""
  }
];
export const ADVANCED_USS = expandTo30Questions(BASE_ADVANCED_USS, ChallengeTopic.USS, ChallengeLevel.ADVANCED);

const BASE_ADVANCED_SAFETY = [
  {
    text: "Which term describes the average radiation dose received by a local population?",
    options: ["Collective effective dose", "Genetically significant dose", "Skin erythema dose level", "Equivalent surface index"],
    correctIndex: 0,
    explanation: "Collective dose measures total population exposure, expressed in person-sieverts.",
    referenceLink: ""
  },
  {
    text: "The thickness of absorber required to reduce beam intensity by 50% is:",
    options: ["Half-value layer (HVL)", "Linear attenuation index", "Effective shield thickness", "Quarter-value thickness"],
    correctIndex: 0,
    explanation: "HVL is a direct measure of X-ray beam quality and penetrability.",
    referenceLink: ""
  },
  {
    text: "Which of the following is a deterministic (non-stochastic) effect?",
    options: ["Radiation-induced cataract", "Leukemia carcinogenesis", "Breast adenocarcinoma", "Genetic chromosome mutation"],
    correctIndex: 0,
    explanation: "Cataracts have a clear threshold dose below which they do not occur, classifying them as deterministic.",
    referenceLink: ""
  },
  {
    text: "What is the recommended maximum cumulative dose limit for a pregnant radiographer?",
    options: ["1 mSv over gestation", "5 mSv over gestation", "10 mSv over gestation", "20 mSv over gestation"],
    correctIndex: 0,
    explanation: "Most regulatory bodies mandate a fetal dose limit of 1 mSv during the entire pregnancy.",
    referenceLink: ""
  },
  {
    text: "The main purpose of secondary radiation barriers is to shield against:",
    options: ["Leakage and scatter radiation", "Primary direct X-ray beam", "High energy cosmic rays", "Low energy ultraviolet waves"],
    correctIndex: 0,
    explanation: "Secondary barriers are designed to protect only against leakage and scatter, not the primary beam.",
    referenceLink: ""
  }
];
export const ADVANCED_SAFETY = expandTo30Questions(BASE_ADVANCED_SAFETY, ChallengeTopic.SAFETY, ChallengeLevel.ADVANCED);

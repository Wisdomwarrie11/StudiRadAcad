import { ChallengeLevel, ChallengeTopic } from '../types';
import { expandTo30Questions } from './questionGenerator';

const BASE_MASTER_TECHNIQUE = [
  {
    text: "Which of the following describes the filtration of the primary diagnostic X-ray beam?",
    options: ["Increases the mean beam energy", "Decreases the mean beam energy", "Increases the total photon flux", "Reduces high energy X-ray photons"],
    correctIndex: 0,
    explanation: "Filtration absorbs low-energy ('soft') X-rays, thereby increasing the average (mean) energy of the remaining beam.",
    referenceLink: ""
  },
  {
    text: "To maintain the same image density when converting from a 12:1 grid to an 8:1 grid:",
    options: ["Reduce the exposure mAs", "Increase the exposure mAs", "Increase the peak kVp", "Reduce the focal spot size"],
    correctIndex: 0,
    explanation: "An 8:1 grid absorbs less scatter and primary beam than a 12:1 grid, so less mAs is needed to achieve the same density.",
    referenceLink: ""
  },
  {
    text: "The limiting factor for spatial resolution in diagnostic digital radiography is:",
    options: ["Detector pixel pitch size", "Anode focal spot diameter", "Monitor refresh rate speed", "Analog-to-digital converter"],
    correctIndex: 0,
    explanation: "The minimum size of detail that can be recorded is limited by the physical size of the pixels (pixel pitch).",
    referenceLink: ""
  },
  {
    text: "Which scan position best avoids superimposition of the sternum over the spine?",
    options: ["RAO oblique projection", "Direct PA projection", "LAO oblique projection", "True lateral projection"],
    correctIndex: 0,
    explanation: "A Right Anterior Oblique (RAO) position projects the sternum over the homogenous shadow of the heart.",
    referenceLink: ""
  },
  {
    text: "The prime reason for choosing a small focal spot in radiography is to:",
    options: ["Minimize geometric penumbra", "Increase heat storage capacity", "Shorten overall exposure times", "Decrease scatter output"],
    correctIndex: 0,
    explanation: "A smaller focal spot produces a sharper image by minimizing the penumbra or geometric unsharpness.",
    referenceLink: ""
  }
];
export const MASTER_TECHNIQUE = expandTo30Questions(BASE_MASTER_TECHNIQUE, ChallengeTopic.TECHNIQUE, ChallengeLevel.MASTER);

const BASE_MASTER_SPECIAL_PROCEDURES = [
  {
    text: "Which Contrast-Induced Nephropathy (CIN) risk factor is most critical to evaluate?",
    options: ["Estimated GFR level", "Baseline blood pressure", "Total body mass index", "Serum albumin levels"],
    correctIndex: 0,
    explanation: "The eGFR (glomerular filtration rate) is the most reliable index for staging renal function prior to contrast.",
    referenceLink: ""
  },
  {
    text: "During a myelogram, contrast is injected directly into which anatomical space?",
    options: ["Subarachnoid space", "Epidural cavity space", "Subdural cleavage space", "Central spinal canal"],
    correctIndex: 0,
    explanation: "Contrast must be placed into the subarachnoid space where the cerebrospinal fluid flows.",
    referenceLink: ""
  },
  {
    text: "Which of the following is the preferred premedication regimen for high-risk contrast patients?",
    options: ["Corticosteroids and antihistamines", "Prophylactic saline and diuretics", "Intravenous broad antibiotics", "Oral beta-blocker therapy"],
    correctIndex: 0,
    explanation: "A combination of prednisone and diphenhydramine is highly effective at reducing hypersensitivity reactions.",
    referenceLink: ""
  },
  {
    text: "During dacryocystography (DCG), contrast is introduced to examine:",
    options: ["The lacrimal drainage system", "The parotid glandular ducts", "The external auditory canal", "The sublingual salivary glands"],
    correctIndex: 0,
    explanation: "DCG is a contrast study designed to evaluate obstruction in the tear ducts and lacrimal sac.",
    referenceLink: ""
  },
  {
    text: "What is the primary diagnostic value of using a tilt table during myelography?",
    options: ["Controlling contrast position", "Reducing patient motion pain", "Minimizing CSF leakage rate", "Enhancing spatial resolution"],
    correctIndex: 0,
    explanation: "Gravity is used to guide the contrast agent column up or down the spinal subarachnoid space.",
    referenceLink: ""
  }
];
export const MASTER_SPECIAL_PROCEDURES = expandTo30Questions(BASE_MASTER_SPECIAL_PROCEDURES, ChallengeTopic.SPECIAL_PROCEDURES, ChallengeLevel.MASTER);

const BASE_MASTER_MRI = [
  {
    text: "The time interval between the initial 90-degree RF pulse and the 180-degree pulse is:",
    options: ["Exactly half of echo time (TE/2)", "The inversion recovery time", "Exactly equal to repetition time", "Determined by Larmor frequency"],
    correctIndex: 0,
    explanation: "In a standard spin echo sequence, the refocusing 180-degree pulse is applied exactly at TE / 2.",
    referenceLink: ""
  },
  {
    text: "Which pulse sequence is most sensitive to susceptibility magnetic artifacts?",
    options: ["Gradient-recalled echo (GRE)", "Fast spin-echo (FSE/TSE)", "Fluid attenuation recovery", "Diffusion weighted imaging"],
    correctIndex: 0,
    explanation: "GRE lacks the 180-degree refocusing pulse, meaning it is highly susceptible to field inhomogeneities.",
    referenceLink: ""
  },
  {
    text: "What does the Specific Absorption Rate (SAR) quantify in clinical MRI?",
    options: ["RF power deposition in tissue", "Gradient magnetic noise level", "Superconducting liquid boil-off", "Image signal-to-noise ratio"],
    correctIndex: 0,
    explanation: "SAR measures the rate at which RF energy is absorbed by body tissue, measured in Watts per kilogram.",
    referenceLink: ""
  },
  {
    text: "The gradient magnetic field that encodes spatial position along the z-axis is:",
    options: ["Slice-select gradient", "Frequency-encode gradient", "Phase-encoding gradient", "Larmor offset gradient"],
    correctIndex: 0,
    explanation: "By convention, the slice-select gradient operates along the z-axis to isolate transverse slices in axial scans.",
    referenceLink: ""
  },
  {
    text: "Which of the following techniques reduces the truncation (Gibbs) artifact?",
    options: ["Increasing acquisition matrix", "Decreasing receiver bandwidth", "Applying spatial presaturation", "Using a smaller field of view"],
    correctIndex: 0,
    explanation: "Increasing the matrix size increases spatial sampling, which directly reduces Gibbs ringing at high-contrast edges.",
    referenceLink: ""
  }
];
export const MASTER_MRI = expandTo30Questions(BASE_MASTER_MRI, ChallengeTopic.MRI, ChallengeLevel.MASTER);

const BASE_MASTER_CT = [
  {
    text: "Which detector characteristic refers to the percentage of active sensing area?",
    options: ["Geometric efficiency", "Absorption efficiency", "Scintillator conversion", "Dynamic response speed"],
    correctIndex: 0,
    explanation: "Geometric efficiency is the ratio of the active detector area to the total area exposed to the beam.",
    referenceLink: ""
  },
  {
    text: "In multi-slice helical CT, the reconstruction slice thickness is determined by:",
    options: ["Detector channel configuration", "Pre-patient collimation width", "Display field of view size", "X-ray tube focal spot size"],
    correctIndex: 0,
    explanation: "The physical width of the detector channels determines the thinnest slice that can be reconstructed.",
    referenceLink: ""
  },
  {
    text: "The Computed Tomography Dose Index (CTDI) represents:",
    options: ["The radiation dose per slice", "The total patient energy dose", "The lifetime stochastic risk", "The entrance skin exposure"],
    correctIndex: 0,
    explanation: "CTDI is a standardized measure of the radiation output of a CT scanner for a single rotation.",
    referenceLink: ""
  },
  {
    text: "Which CT artifact results from a single malfunctioning detector channel?",
    options: ["Ring artifact in third gen", "Streak artifact from bone", "Stair-step edge artifact", "Out-of-field display error"],
    correctIndex: 0,
    explanation: "A faulty detector in a rotating 3rd-generation scanner maps to a circular path, producing a ring artifact.",
    referenceLink: ""
  },
  {
    text: "The primary benefit of iterative reconstruction compared to FBP is:",
    options: ["Significant radiation reduction", "Faster image display times", "Elimination of motion blur", "Improved spatial resolution"],
    correctIndex: 0,
    explanation: "Iterative reconstruction algorithms can handle high noise, allowing for lower kVp and mA scans.",
    referenceLink: ""
  }
];
export const MASTER_CT = expandTo30Questions(BASE_MASTER_CT, ChallengeTopic.CT, ChallengeLevel.MASTER);

const BASE_MASTER_USS = [
  {
    text: "Which of the following describes the Huygens principle in ultrasound?",
    options: ["Wavefront is sum of wavelets", "Acoustic reflection coefficient", "Frequency shift of motion", "Thermal energy dissipation"],
    correctIndex: 0,
    explanation: "Huygens principle states that every point on a wavefront is a source of secondary spherical wavelets.",
    referenceLink: ""
  },
  {
    text: "The optimal thickness of the transducer matching layer is:",
    options: ["One-quarter of the wavelength", "One-half of the wavelength", "Equal to crystal thickness", "Determined by acoustic impedance"],
    correctIndex: 0,
    explanation: "A matching layer thickness of 1/4 wavelength maximizes transmission of sound into tissue.",
    referenceLink: ""
  },
  {
    text: "Which artifact results from the redirection of sound at a curved interface?",
    options: ["Refraction edge shadowing", "Reverberation echo rings", "Acoustic mirror imaging", "Speed of sound mismatch"],
    correctIndex: 0,
    explanation: "Refraction redirects sound waves at oblique boundaries, creating a shadow band posterior to the edge.",
    referenceLink: ""
  },
  {
    text: "The main clinical hazard associated with high-intensity ultrasound is:",
    options: ["Thermal tissue heating", "Stochastic cell mutations", "Electromagnetic interference", "Superficial skin burns"],
    correctIndex: 0,
    explanation: "High ultrasound intensity (especially in pulsed Doppler) can deposit thermal energy, heating tissues.",
    referenceLink: ""
  },
  {
    text: "Power Doppler imaging is primarily characterized by:",
    options: ["Independence from flow angle", "High velocity resolution", "Aliasing-free direction maps", "Extremely fast frame rates"],
    correctIndex: 0,
    explanation: "Power Doppler measures the amplitude of red blood cell reflections, making it highly angle-independent.",
    referenceLink: ""
  }
];
export const MASTER_USS = expandTo30Questions(BASE_MASTER_USS, ChallengeTopic.USS, ChallengeLevel.MASTER);

const BASE_MASTER_SAFETY = [
  {
    text: "Which radiation dose metric is most closely related to long-term risk?",
    options: ["Effective dose in Sieverts", "Absorbed dose in Grays", "Exposure in Roentgens", "Equivalent dose in Grays"],
    correctIndex: 0,
    explanation: "Effective dose takes into account both the type of radiation and the radiosensitivity of the exposed organs.",
    referenceLink: ""
  },
  {
    text: "The ten-day rule for females of childbearing age states that:",
    options: ["Scan only 10 days post menses", "Limit exposures to 10 mSv", "Report pregnancy after 10 days", "Shield pelvic region 10 times"],
    correctIndex: 0,
    explanation: "In fertile females, elective pelvic radiographs should ideally be done in the first 10 days of the menstrual cycle.",
    referenceLink: ""
  },
  {
    text: "Which of the following cells is considered the most radiosensitive?",
    options: ["Erythroblasts (red stem cells)", "Mature osteocyte bone cells", "Skeletal muscle fibers", "Myelinated nerve neurons"],
    correctIndex: 0,
    explanation: "According to Bergonie and Tribondeau, stem cells or rapidly dividing undifferentiated cells are highly radiosensitive.",
    referenceLink: ""
  },
  {
    text: "The principal objective of establishing Diagnostic Reference Levels is to:",
    options: ["Optimize patient radiation dose", "Limit physician exposure times", "Replace local legal regulations", "Set absolute maximum dose limits"],
    correctIndex: 0,
    explanation: "DRLs act as guideposts to highlight unusually high patient doses, promoting dose optimization.",
    referenceLink: ""
  },
  {
    text: "Which protective apron thickness provides the optimal balance of weight and shielding?",
    options: ["0.5 mm lead equivalent", "0.25 mm lead equivalent", "1.0 mm lead equivalent", "0.1 mm lead equivalent"],
    correctIndex: 0,
    explanation: "A 0.5 mm lead equivalent apron blocks over 90% of diagnostic scatter while remaining wearable.",
    referenceLink: ""
  }
];
export const MASTER_SAFETY = expandTo30Questions(BASE_MASTER_SAFETY, ChallengeTopic.SAFETY, ChallengeLevel.MASTER);

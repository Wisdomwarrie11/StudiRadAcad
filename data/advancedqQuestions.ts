import { ChallengeQuestion } from '../types';

export const ADVANCED_TECHNIQUE: ChallengeQuestion[] = [ 
  { text: "For a lateral cervical spine radiograph of an adult with suspected odontoid fracture, which technique adjustment most reliably reduces motion blur while preserving sharp cortical detail?", options: ["Increase SID to 200 cm", "Use a shorter exposure time with higher mA and appropriate kVp", "Decrease focal spot size but shorten SID", "Reduce mA and increase exposure time"], correctIndex: 1, explanation: "Shorter exposure time with higher mA reduces motion blur; kVp adjusted for penetration.", referenceLink: "http://evolve.elsevier.com" },
  { text: "When imaging the AP chest of a patient with scoliosis, which positioning and beam strategy best minimizes image distortion of the mediastinum?", options: ["AP supine with orthogonal beam", "Upright PA with patient rotated toward the film to align vertebrae vertical", "Upright PA with patient shoulders rolled forward and beam centered at T7", "Lateral decubitus with horizontal beam"], correctIndex: 2, explanation: "Standard upright PA with shoulders rolled reduces scapular shadow; centering at T7 yields consistent mediastinal projection.", referenceLink: "https://radiopaedia.org" },
  { text: "In digital radiography, detective quantum efficiency (DQE) most directly impacts which clinical outcome?", options: ["Spatial resolution only", "Image noise for a given patient dose", "Patient motion artifacts", "Distortion"], correctIndex: 1, explanation: "Higher DQE means better signal capture -> less noise at same dose; improves image quality or allows dose reduction.", referenceLink: "http://evolve.elsevier.com" },
  { text: "For pelvic radiography of a large adult where grid cut-off is suspected, which practical step reduces the risk of grid cutoff while preserving scatter cleanup?", options: ["Use a lower grid ratio", "Increase kVp and maintain current grid ratio", "Replace grid with air-gap technique only", "Increase SID without changing grid"], correctIndex: 0, explanation: "Lower grid ratio reduces sensitivity to misalignment and cutoff while still reducing scatter.", referenceLink: "http://evolve.elsevier.com" },
  { text: "An image displays excessive magnification of the hip prosthesis due to OID. To correct this while maintaining exposure factors, which adjustment is best?", options: ["Decrease SID and increase OID", "Increase SID and decrease OID", "Increase kVp only", "Use smaller focal spot"], correctIndex: 1, explanation: "Increasing SID and reducing OID reduces magnification; exposure factors may need minor change for receptor exposure.", referenceLink: "https://www.ncbi.nlm.nih.gov" },
  { text: "In AEC (automatic exposure control), which of these is the primary cause of an unexpectedly underexposed adult abdomen image?", options: ["Collimation wider than detector chamber", "Incorrectly placed phototiming chamber under a radiopaque object (e.g., lead marker)", "Too high kVp selection", "Using a grid"], correctIndex: 1, explanation: "A radiopaque object over the active AEC chamber prevents ionization reaching detector -> underexposure.", referenceLink: "http://evolve.elsevier.com" },
  { text: "For cesium iodide (CsI) scintillator-based flat-panel detectors versus Gd2O2S phosphor systems, which statement is correct regarding resolution and dose efficiency?", options: ["CsI has lower DQE and lower resolution", "CsI offers higher DQE with potential for lower dose while maintaining resolution", "Gd2O2S always produces better DQE than CsI", "Both have identical performance clinically"], correctIndex: 1, explanation: "Columnar CsI tends to guide light, improving DQE and allowing dose reduction relative to some phosphor screens.", referenceLink: "http://evolve.elsevier.com" },
  { text: "When using an extremity tabletop technique for a small bone study (e.g., scaphoid), which focal spot selection and SID give the best recorded detail?", options: ["Large focal spot, 100 cm SID", "Small focal spot, short SID (e.g., 40–50 cm) with high mA/short exposure", "Small focal spot, long SID (200 cm)", "Large focal spot, short SID"], correctIndex: 1, explanation: "Small focal spot reduces geometric unsharpness; short SID for extremity table reduces OID but maintain small focal spot and short exposure to reduce motion.", referenceLink: "http://evolve.elsevier.com" },
  { text: "Which compensating filter and placement is most appropriate for imaging the AP thoracic spine to even out exposure between thin anterior chest and dense posterior spine?", options: ["Wedge filter placed on tube toward thin side (anterior) with thick end toward posterior", "Wedge filter thick end toward anterior chest", "Nothing — use higher kVp only", "Use aluminum filtration at source"], correctIndex: 0, explanation: "A wedge compensating filter thick end toward denser part evens receptor exposure. For AP thoracic, thick end toward posterior spine.", referenceLink: "http://evolve.elsevier.com" },
  { text: "To minimize quantum mottle while imaging a child’s abdomen under pediatric dose constraints, which combination is optimal?", options: ["Reduce mA and increase time", "Use higher kVp and increase detector dose (technique to maintain SNR)", "Reduce kVp and reduce mAs drastically", "Always use grid with adult technique"], correctIndex: 1, explanation: "Increasing kVp (within diagnostic range) can allow lower mAs while maintaining receptor exposure, improving SNR without increasing dose too much; pediatric protocols tailored.", referenceLink: "https://www.ncbi.nlm.nih.gov" },
  { text: "For tomography (limited-angle/slab tomography), what parameter controls the plane of sharpest focus?", options: ["Exposure time", "Pivot point/fulcrum height relative to object", "kVp", "Grid ratio"], correctIndex: 1, explanation: "Fulcrum height determines the anatomic plane that remains in focus during tomography sweep.", referenceLink: "http://evolve.elsevier.com" },
  { text: "When intending to demonstrate subtle pneumothorax on supine trauma chest radiographs, which technique aids detection?", options: ["Standard AP supine only", "Use a horizontal beam with expiratory exposure and increased kVp", "Perform left lateral decubitus with horizontal beam to reveal pleural line", "Use fluoroscopy instead of radiography"], correctIndex: 2, explanation: "Lateral decubitus with horizontal beam often demonstrates free pleural air layering.", referenceLink: "https://radiopaedia.org" },
  { text: "For fine-detail extremity imaging (e.g., hand), which image receptor pixel size and focal spot should be chosen for maximal recorded detail?", options: ["Large pixel size, large focal spot", "Small pixel size detector and small focal spot (0.3 mm or less)", "Small pixel size but large focal spot is fine", "Pixel size irrelevant with grid ratio"], correctIndex: 1, explanation: "Small detector pixels + small focal spot reduce sampling and geometric unsharpness to maximize detail.", referenceLink: "http://evolve.elsevier.com" },
  { text: "Which of the following will NOT reduce motion blur during fluoroscopic image acquisition?", options: ["Increase pulse rate (pulsed fluoroscopy)", "Use image intensifier gain and higher frame averaging", "Ask patient to suspend respiration for brief acquisitions", "Increase mA and reduce exposure time per frame"], correctIndex: 1, explanation: "Frame averaging improves noise but can increase motion blur by combining frames; it doesn't reduce motion blur.", referenceLink: "https://www.aapm.org" },
  { text: "An AP pelvis shows unequal soft-tissue density between the hips due to obliquity. Which projection corrects pelvic rotation impact for acetabular assessment?", options: ["AP with internal rotation of both legs 15°", "Judet oblique views for acetabulum (internal and external oblique)", "Frog-leg lateral only", "AP with external rotation of legs"], correctIndex: 1, explanation: "Judet views provide targeted oblique projections of the acetabulum and correct for pelvic rotation.", referenceLink: "https://radiopaedia.org" },
  { text: "During a lateral thoracic spine radiograph on a large patient, excessive scatter is degrading image contrast. Which adjustment most improves contrast without excessively increasing dose?", options: ["Use a higher grid ratio (16:1)", "Switch to air-gap technique with increased SID", "Decrease kVp drastically", "Remove the grid to avoid grid cutoff"], correctIndex: 1, explanation: "Air-gap reduces scatter reaching the detector while maintaining contrast; increasing SID compensates for magnification.", referenceLink: "http://evolve.elsevier.com" },
  { text: "For a cross-table lateral hip in trauma, which technique minimizes motion blur and ensures adequate penetration?", options: ["Long exposure time with low mA", "High mA, short exposure time, and moderately high kVp", "Low kVp only", "Use small focal spot irrespective of mAs"], correctIndex: 1, explanation: "High mA + short exposure reduces motion; moderate kVp ensures penetration through the pelvis.", referenceLink: "https://radiopaedia.org" },
  { text: "When imaging a suspected foreign body in soft tissue, which factor most improves visualization of small metallic fragments?", options: ["Lower kVp (soft-tissue technique)", "Very high kVp", "Using a grid", "Increasing SID"], correctIndex: 0, explanation: "Low kVp increases subject contrast and visibility of small metal fragments.", referenceLink: "https://www.ncbi.nlm.nih.gov" },
  { text: "Which adjustment is most effective for reducing geometric unsharpness in lateral skull imaging?", options: ["Increase OID", "Decrease SID", "Use a smaller focal spot", "Use higher kVp"], correctIndex: 2, explanation: "Small focal spot reduces penumbra and improves recorded detail.", referenceLink: "http://evolve.elsevier.com" },
  { text: "For a lateral decubitus abdominal radiograph assessing free air, which technical factor is essential for optimal visualization?", options: ["High mAs and expiratory phase", "Horizontal beam with patient lying on left side", "Horizontal beam with patient lying on right side", "Using a wedge filter"], correctIndex: 1, explanation: "Left lateral decubitus with horizontal beam keeps gastric air away from liver, improving detection of pneumoperitoneum.", referenceLink: "https://radiopaedia.org" },
  { text: "A shoulder radiograph shows excessive noise. Technique used: 60 kVp, 5 mAs, no grid. What is the best adjustment to reduce noise while keeping dose reasonable?", options: ["Lower kVp and reduce mAs", "Increase mAs moderately and keep kVp constant", "Use a grid and maintain same mAs", "Double kVp"], correctIndex: 1, explanation: "Increasing mAs improves SNR; dose increase remains controlled.", referenceLink: "http://evolve.elsevier.com" },
  { text: "In digital radiography, which factor most strongly influences exposure indicator (EI) accuracy?", options: ["kVp selection", "mAs and detector dose", "OID distance", "Focal spot size"], correctIndex: 1, explanation: "EI reflects detector dose which is controlled primarily by mAs.", referenceLink: "https://www.aapm.org" },
  { text: "For soft tissue neck imaging to evaluate epiglottitis, which technique ensures optimal visibility of airway soft tissue?", options: ["High kVp and low mAs", "Low kVp and soft-tissue technique (60–70 kVp)", "Grid technique with 85 kVp", "Long SID only"], correctIndex: 1, explanation: "Soft-tissue neck requires low kVp to increase contrast in soft tissues.", referenceLink: "https://radiopaedia.org" },
  { text: "Which adjustment best reduces scatter when performing a mobile chest radiograph in a crowded ward?", options: ["Increase collimation tightly to lung fields", "Increase SID to >200 cm", "Use a stationary grid for all patients", "Lower mAs"], correctIndex: 0, explanation: "Tight collimation reduces scatter and improves contrast.", referenceLink: "http://evolve.elsevier.com" },
  { text: "During fluoroscopic GI studies, which factor most effectively reduces patient dose while maintaining diagnostic information?", options: ["Continuous fluoroscopy", "Pulse fluoroscopy at lowest acceptable pulse rate", "Doubling mA", "Removing filtration"], correctIndex: 1, explanation: "Pulsed fluoroscopy reduces dose significantly while preserving image quality.", referenceLink: "https://www.aapm.org" },
  { text: "A lateral facial bones radiograph shows elongation of structures. What is the most likely cause?", options: ["Improper CR angulation", "Excessive SID", "Incorrect kVp selection", "Grid ratio too low"], correctIndex: 0, explanation: "Incorrect beam angulation leads to elongation/foreshortening of structures.", referenceLink: "http://evolve.elsevier.com" },
  { text: "What is the most effective way to reduce aliasing artifacts in digital imaging?", options: ["Increase pixel size", "Ensure appropriate sampling frequency and proper grid use", "Lower mAs", "Increase patient-to-detector distance"], correctIndex: 1, explanation: "Correct sampling frequency and proper grid alignment minimize aliasing.", referenceLink: "https://www.ncbi.nlm.nih.gov" },
  { text: "Which factor mainly determines patient entrance skin dose (ESD) during radiography?", options: ["SID only", "mAs and beam intensity at skin surface", "Focal spot size", "Pixel resolution"], correctIndex: 1, explanation: "ESD is driven primarily by beam intensity and mAs.", referenceLink: "https://www.aapm.org" },
  { text: "For an AP axial C-spine, which change improves visualization of intervertebral joint spaces?", options: ["Increase cephalic angle to 20°", "Decrease cephalic angle to 5°", "Increase SID only", "Use a wedge filter"], correctIndex: 0, explanation: "A 15–20° cephalic angle opens the intervertebral spaces.", referenceLink: "https://radiopaedia.org" },
  { text: "On a lateral chest radiograph, the posterior ribs appear doubled with wide separation. What is the most likely cause?", options: ["Grid cutoff", "Patient rotation", "Low kVp", "Short SID"], correctIndex: 1, explanation: "Rotation results in double posterior rib borders.", referenceLink: "http://evolve.elsevier.com" }
];


export const ADVANCED_SAFETY: ChallengeQuestion[] = [
  // --- ORIGINAL 15 QUESTIONS ---
  { text: "According to ICRP principles, which of the following is the most appropriate operational interpretation of “optimisation (ALARA)”?", options: ["Always minimize dose regardless of image quality", "Balance diagnostic benefit with the minimal dose necessary, using constraints and diagnostic reference levels (DRLs)", "Optimize only for staff exposure, not patients", "Use dose limits for patients the same as occupational limits"], correctIndex: 1, explanation: "ALARA is a benefit-risk balance; use DRLs and constraints to optimize image quality vs dose.", referenceLink: "https://www.icrp.org" },
  { text: "For an occupational worker in radiology, which monitoring practice best detects chronic low-level exposure?", options: ["Rely solely on periodic whole-body bioassays", "Use monthly personal dosimeters (badge) at collar outside lead apron and ring dosimeters for interventional staff", "Visual inspection only", "Measure area dose only, never personal dosimetry"], correctIndex: 1, explanation: "Personal dosimetry (badge at collar, ring dosimeters for hands) is standard to monitor chronic exposure.", referenceLink: "https://www.icrp.org" },
  { text: "For a pregnant interventional radiologist performing fluoroscopy procedures, which action reduces fetal dose most effectively while maintaining procedural capability?", options: ["Leave apron off to avoid heat stress", "Wear a 0.5 mm Pb-equivalent apron plus a fetal shield at the abdomen and use pulsed fluoroscopy, lowest reasonable frame rate, and maximize distance from source", "Increase fluoroscopy frame rate to shorten procedure", "Use continuous fluoroscopy at same settings"], correctIndex: 1, explanation: "Proper protective aprons plus fetal shielding, pulsed fluoroscopy, low frame rate, and distance reduce fetal dose.", referenceLink: "https://www.icrp.org" },
  { text: "Which patient dose index is most appropriate for comparing CT scan protocols between scanners for a given body region?", options: ["DAP (dose-area product) only", "CTDIvol (Computed Tomography Dose Index volume) and DLP (Dose-Length Product) together", "Entrance skin exposure only", "KERMA-area product is irrelevant for CT"], correctIndex: 1, explanation: "CTDIvol and DLP are standardized for CT protocol comparisons and estimating patient dose metrics.", referenceLink: "https://www.aapm.org" },
  { text: "Which shielding material is most effective per unit thickness for diagnostic X-ray shielding in standard kilovoltage ranges (50–150 kVp)?", options: ["Concrete", "Lead", "Steel only", "Glass alone"], correctIndex: 1, explanation: "Lead provides high attenuation per thickness for diagnostic kVp ranges; design uses lead equivalence tables.", referenceLink: "https://www.icrp.org" },
  { text: "A CT Radiographer notices the scanner’s displayed CTDIvol for a pediatric head protocol is double the expected value. Which is the best immediate action?", options: ["Proceed with the scan; image quality will be better", "Stop and check protocol settings (mA, rotation time, slice thickness, pitch), confirm size-specific adjustments and scanner calibration, and consult physicist if needed", "Decrease kVp without checking other parameters", "Remove the patient from table and reschedule"], correctIndex: 1, explanation: "Verify protocol parameters and size-specific settings; consult medical physicist prior to scanning to avoid unnecessary dose.", referenceLink: "https://aapm.onlinelibrary.wiley.com" },
  { text: "For optimization in pediatric radiography, which approach most reduces stochastic risk while preserving diagnostic yield?", options: ["Use adult-protocol mAs scaled by weight/diameter, lower kVp than adults when appropriate, and avoid repeat exposures with immobilization/fast exposures", "Always use adult protocols scaled up", "Replace radiography with CT in children for speed", "Use maximal filtration regardless of patient size"], correctIndex: 0, explanation: "Weight/diameter-adapted mAs and appropriate kVp, plus limiting repeats, balances dose and diagnostic quality.", referenceLink: "https://www.ncbi.nlm.nih.gov" },
  { text: "Which statement about lead aprons and attenuation is correct?", options: ["A 0.5 mm Pb apron attenuates nearly 100% of all scatter at all energies.", "Attenuation depends on X-ray energy; 0.5 mm Pb gives substantial attenuation of scatter in diagnostic kVp but not complete protection at higher kVp.", "Lead aprons protect equally against primary beam and scatter.", "No apron is necessary if you stand behind the tube."], correctIndex: 1, explanation: "Attenuation is energy-dependent; lead apron reduces scatter significantly but not 100%, and it shouldn't be used in primary beam.", referenceLink: "https://www.icrp.org" },
  { text: "Which is the most appropriate use of Diagnostic Reference Levels (DRLs)?", options: ["Regulatory dose limits for individual patients", "Tools for comparing local practice to national/international medians to help optimize protocols when doses consistently exceed DRLs", "Absolute safe dose thresholds", "Only used in radiotherapy"], correctIndex: 1, explanation: "DRLs are investigation levels; they are not individual dose limits but benchmarks for protocol review.", referenceLink: "https://www.icrp.org" },
  { text: "For interventional cardiology procedures, which dosimetric quantity best correlates with risk of deterministic skin effects?", options: ["CTDIvol", "Kerma-area product (KAP or DAP) and cumulative air kerma at reference point (Ka,r)", "Entrance skin dose only in OSL badge units", "Effective dose (mSv)"], correctIndex: 1, explanation: "Cumulative air kerma and KAP better predict skin dose and deterministic effects for fluoroscopically guided procedures.", referenceLink: "https://www.aapm.org" },
  { text: "Which action most reduces patient dose in digital radiography without compromising detection of low-contrast lesions?", options: ["Increase mAs and reduce kVp drastically", "Use optimal kVp for body part, tight collimation, anti-scatter grid only where necessary, and appropriate detector exposure index targets", "Remove all filtration to increase detector exposure", "Use a heavy compensating filter on every exam"], correctIndex: 1, explanation: "Proper kVp, collimation, selective grid use, and targeted exposure indices optimize dose and maintain contrast detectability.", referenceLink: "https://www.ncbi.nlm.nih.gov" },
  { text: "For handling radioactive contamination incidents in a radiology department (non-therapeutic tracer spill), which immediate action is highest priority?", options: ["Leave the area and let contamination settle", "Evacuate/unrestricted area, isolate and restrict access, remove contaminated clothing, and notify radiation safety officer while performing contamination surveys", "Wipe the area with bare hands quickly to prevent spread", "Continue operations as usual after small spill"], correctIndex: 1, explanation: "Isolation, removal of contaminated clothing, and notification of RSO are immediate priorities to limit spread and exposure.", referenceLink: "https://www.icrp.org" },
  { text: "Which dosimeter type is preferred for monitoring interventional radiologists’ extremity dose?", options: ["Film badge at chest level only", "Ring dosimeters (TLD or OSL) at the base of the dominant hand or finger for accurate extremity dose monitoring", "Area monitors on the wall", "Pocket ionization chamber worn inside apron"], correctIndex: 1, explanation: "Ring dosimeters capture high extremity doses typical for hands near beam, and TLD/OSL provide accurate readings.", referenceLink: "https://www.icrp.org" },
  { text: "In nuclear medicine, which shielding strategy best reduces dose to staff when preparing or injecting Tc-99m?", options: ["Use syringe shields, remote handling tools, shielding vials, and minimize time at source", "Use only gloves", "No shielding with rapid injections is fine", "Use lead aprons only, no syringe shield"], correctIndex: 0, explanation: "Remote handling and syringe shields plus minimizing time and maximizing distance are core ALARA measures in NM.", referenceLink: "https://www.icrp.org" },
  { text: "For CT dose optimization, which combination of techniques has most evidence for lowering dose while maintaining diagnostic quality?", options: ["Increase tube current and ignore iterative reconstruction", "Use tube current modulation, lower kVp where appropriate, patient-size adapted protocols, and iterative reconstruction algorithms", "Use fixed high mA regardless of patient size", "Always use the highest pitch possible"], correctIndex: 1, explanation: "Tube current modulation, kVp adaptation, and iterative reconstruction reduce dose while preserving quality.", referenceLink: "https://aapm.onlinelibrary.wiley.com" },
  { text: "Which factor most strongly influences the development of deterministic skin injury during fluoroscopic procedures?", options: ["Effective dose accumulation", "Peak skin dose at specific entrance site", "Scatter dose to caregivers", "Average staff dose rate"], correctIndex: 1, explanation: "Deterministic injuries depend on localized peak skin dose, not effective dose.", referenceLink: "https://www.icrp.org" },
  { text: "In mammography, which approach best improves dose optimization while ensuring lesion detectability?", options: ["Using highest kVp available", "Using automatic exposure control (AEC), appropriate target-filter combinations, and compression", "Eliminating compression to reduce discomfort", "Using grid for all breast sizes"], correctIndex: 1, explanation: "AEC, proper target-filter combos, and compression optimize dose and image contrast.", referenceLink: "https://www.aapm.org" },
  { text: "Which operational measure best enhances staff radiation protection in a busy fluoroscopy suite?", options: ["Standing closer to patient for better workflow", "Consistent use of ceiling-suspended shields, table skirts, and maximizing distance from X-ray tube", "Turning off protective shields to prevent obstruction", "Using lead aprons alone"], correctIndex: 1, explanation: "Ceiling-suspended shields and distance are key for scatter protection.", referenceLink: "https://www.icrp.org" },
  { text: "Which scenario indicates overexposure risk due to digital detector 'dose creep'?", options: ["Consistently high exposure index across multiple technologists", "Consistent EI within manufacturer’s target", "Low exposure index with noisy images", "Scatter grid used appropriately"], correctIndex: 0, explanation: "High EI indicates excessive exposure due to dose creep.", referenceLink: "https://www.ncbi.nlm.nih.gov" },
  { text: "For high-dose interventional procedures, which documentation is required for patient follow-up?", options: ["Effective dose only", "Cumulative air kerma and KAP with fluoroscopy time", "Radiologist badge reading", "Tube current in mA only"], correctIndex: 1, explanation: "Cumulative air kerma and KAP predict deterministic effects and guide follow-up.", referenceLink: "https://www.aapm.org" },
  { text: "Which factor most reduces operator dose during mobile C-arm fluoroscopy?", options: ["Standing on tube side", "Standing on image intensifier/detector side", "Using high frame rate", "Placing patient far from detector"], correctIndex: 1, explanation: "Detector side has dramatically reduced scatter exposure.", referenceLink: "https://www.icrp.org" },
  { text: "During shielding design, which parameter is essential for calculating barrier thickness?", options: ["Technologist’s weight", "Workload (mA-min/week), use factor, occupancy factor, and distance", "Number of staff on shift", "Detector brand"], correctIndex: 1, explanation: "Workload, use, occupancy, and distance determine shielding requirements.", referenceLink: "https://www.icrp.org" },
  { text: "Which approach best minimizes patient dose during fluoroscopic procedures without affecting clinical outcomes?", options: ["Using continuous fluoroscopy", "Using last-image-hold, pulsed fluoroscopy, and minimizing magnification modes", "Keeping detector far from patient", "Increasing frame rate"], correctIndex: 1, explanation: "LIH, pulsed mode, and minimal magnification reduce exposure significantly.", referenceLink: "https://www.aapm.org" },
  { text: "In PET/CT, which practice best reduces staff exposure when handling F-18 radiopharmaceuticals?", options: ["Standing close to patient immediately after injection", "Using tungsten syringe shields and remote dispensing systems", "Eliminating all shielding for speed", "Using lead aprons only"], correctIndex: 1, explanation: "High-energy photons require tungsten shielding and remote handling.", referenceLink: "https://www.icrp.org" },
  { text: "Which action ensures correct use of personal dosimeters in interventional radiology?", options: ["Wearing dosimeter under apron only", "Using double dosimetry (one under apron, one outside at collar)", "Placing dosimeter in pocket", "Leaving dosimeters in control room"], correctIndex: 1, explanation: "Double dosimetry is recommended for accurate effective dose estimation.", referenceLink: "https://www.aapm.org" },
  { text: "Which parameter significantly increases fetal dose during pelvic CT?", options: ["Pitch increase", "Lowering kVp", "Scanning multiphase without clinical indication", "Reducing mA"], correctIndex: 2, explanation: "Unnecessary multiphase CT dramatically increases fetal dose.", referenceLink: "https://www.icrp.org" },
  { text: "Which method most effectively reduces lens dose to operators during interventional procedures?", options: ["Ceiling-suspended lead acrylic shields", "Wearing badge only", "Standing closer to patient", "Using lead apron alone"], correctIndex: 0, explanation: "Ceiling shields provide substantial lens dose reduction.", referenceLink: "https://www.icrp.org" },
  { text: "In radiography, which factor most increases skin entrance dose?", options: ["Higher kVp with decreased mAs", "Short SID with high mAs", "Using anti-scatter grid properly", "Tight collimation"], correctIndex: 1, explanation: "Short SID and high mAs greatly increase entrance skin dose.", referenceLink: "https://www.aapm.org" },
  { text: "For multi-detector CT, which factor increases dose most significantly?", options: ["Higher pitch", "Lower pitch", "Beam filtration", "Iterative reconstruction"], correctIndex: 1, explanation: "Low pitch increases radiation overlap and increases dose.", referenceLink: "https://www.aapm.org" },
  { text: "Which practice aligns with ICRP justification principles for pediatric CT?", options: ["Using CT as first-line imaging for minor trauma", "Ensuring clear clinical indication and considering ultrasound/MRI alternatives before CT", "Repeating CT when parent requests reassurance", "Using same protocol as adults"], correctIndex: 1, explanation: "Justification requires balancing benefit and alternatives, especially in pediatrics.", referenceLink: "https://www.icrp.org" }
];


export const ADVANCED_MRI: ChallengeQuestion[] = [
  // --- ORIGINAL 15 ---
  { text: "Which mechanism most directly shortens T1 relaxation time in paramagnetic contrast-enhanced tissues?", options: ["Increased molecular tumbling only", "Dipolar interactions from paramagnetic ions that enhance spin–lattice relaxation", "Gradient nonlinearity", "Increased static field inhomogeneity"], correctIndex: 1, explanation: "Gadolinium and other paramagnetic agents create local magnetic field fluctuations that increase energy exchange between spins and the lattice, shortening T1.", referenceLink: "https://radiopaedia.org" },
  { text: "For FLAIR brain imaging to null CSF signal, inversion time (TI) is chosen to:", options: ["Maximize CSF transverse magnetization", "Null longitudinal magnetization of CSF at readout", "Reduce T2* effects only", "Increase SNR of white matter"], correctIndex: 1, explanation: "FLAIR uses an inversion pulse with TI set so CSF longitudinal magnetization crosses zero at readout, suppressing CSF signal.", referenceLink: "https://radiopaedia.org" },
  { text: "Which artifact will worsen most at 3T compared with 1.5T and is often mitigated by using shorter echo times or SE sequences?", options: ["Chemical shift artifact", "Susceptibility artifact (signal loss/phase errors near air–tissue/blood products)", "Motion ghosting", "Slice thickness artifact"], correctIndex: 1, explanation: "Susceptibility differences scale with B0, so artifacts (e.g., at sinuses, hemorrhage) are larger at 3T; shorter TE and spin-echo help reduce them.", referenceLink: "https://radiopaedia.org" },
  { text: "Parallel imaging acceleration (e.g., SENSE) causes what penalty that must be accounted for clinically?", options: ["Reduced specific absorption rate (SAR) only", "SNR loss proportional to √(R) and geometry-dependent g-factor noise amplification", "Increased acquisition time", "Elimination of aliasing completely"], correctIndex: 1, explanation: "Parallel imaging reduces phase-encode lines (acceleration R) but reduces SNR roughly by √R and can amplify noise via the g-factor depending on coil geometry.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Which practical step best reduces radiofrequency (RF) heating risk for an implant during an MRI scan?", options: ["Increase flip angle", "Use higher SAR sequences (e.g., fast spin-echo)", "Follow device-specific MRI-conditional labeling and use lower-SAR scanning protocols when required", "Use body transmit coil instead of local coil always"], correctIndex: 2, explanation: "Manufacturer MRI-conditional labeling and adjusted low-SAR protocols minimize RF heating risk for implants.", referenceLink: "https://www.fda.gov" },
  { text: "In DWI, increasing the b-value primarily results in:", options: ["Higher SNR and less diffusion contrast", "Increased diffusion weighting (greater contrast for restricted diffusion) and increased noise", "Shorter acquisition time", "Decreased sensitivity to acute infarct"], correctIndex: 1, explanation: "Higher b-values increase diffusion weighting but reduce SNR.", referenceLink: "https://radiopaedia.org" },
  { text: "Which sequence is most sensitive to susceptibility from microbleeds or calcifications?", options: ["T1-weighted spin-echo", "Gradient-echo/T2*-weighted or susceptibility-weighted imaging (SWI)", "Proton-density weighted", "Short TI inversion recovery (STIR)"], correctIndex: 1, explanation: "Gradient-echo and SWI exploit field inhomogeneities and are highly sensitive to paramagnetic substances.", referenceLink: "https://radiopaedia.org" },
  { text: "A patient reports metallic taste and peripheral nerve stimulation during an MRI. The most likely cause is:", options: ["Static B0 field only", "Gradient switching causing rapidly changing magnetic fields that can stimulate nerves and induce voltages", "Inadequate magnet cooling", "RF coil tuning"], correctIndex: 1, explanation: "Rapid gradient switching can induce peripheral nerve stimulation; lowering slew rate helps.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Which practical MRI technique improves fat suppression in areas with B0 inhomogeneity?", options: ["Conventional frequency-selective fat-sat only", "Inversion-based methods (STIR) or Dixon techniques that separate water and fat by phase differences", "Simply increasing TR", "Decreasing bandwidth"], correctIndex: 1, explanation: "STIR and Dixon are robust where conventional fat-sat fails.", referenceLink: "https://radiopaedia.org" },
  { text: "Which quantitative MRI parameter is most commonly used to detect acute ischemia in the brain within hours of onset?", options: ["T1 relaxation time", "Apparent diffusion coefficient (ADC) reduction on DWI", "Increased T2 signal only", "Perfusion CT only"], correctIndex: 1, explanation: "Acute ischemia shows low ADC values before T2 changes.", referenceLink: "https://radiopaedia.org" },
  { text: "What does the “g-factor” in parallel imaging quantify?", options: ["Gradient strength per unit time", "Geometry-dependent noise amplification during reconstruction", "Global SNR of the system", "Gibbs ringing artifact magnitude"], correctIndex: 1, explanation: "The g-factor measures noise amplification from coil sensitivity patterns.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Which clinical scenario benefits most from inversion-recovery fat nulling (STIR) rather than frequency-selective fat saturation?", options: ["Imaging in regions with large B0 inhomogeneity (e.g., metal)", "Small-field spectroscopy", "When using Dixon exclusively", "For increasing T1 contrast"], correctIndex: 0, explanation: "STIR is robust to B0 variations, making it ideal near metal.", referenceLink: "https://radiopaedia.org" },
  { text: "Which parameter change reduces chemical shift artifact along the frequency-encoding direction?", options: ["Reduce bandwidth", "Increase bandwidth or use fat–water separation methods", "Decrease field strength only", "Use gradient-echo exclusively"], correctIndex: 1, explanation: "Higher bandwidth reduces fat–water displacement.", referenceLink: "https://radiopaedia.org" },
  { text: "The principal reason for cardiac gating in cine MRI is to:", options: ["Remove susceptibility artifacts", "Acquire images at consistent cardiac phases for motion assessment", "Increase T1 weighting", "Minimize SAR"], correctIndex: 1, explanation: "ECG gating synchronizes acquisition to cardiac motion.", referenceLink: "https://radiopaedia.org" },
  { text: "Which SAR management strategy reduces whole-body SAR during a high-field MRI exam?", options: ["Use longer TR, reduce flip angle, or select lower-SAR sequences", "Increase NEX", "Use higher flip angles", "Always use multi-band excitation"], correctIndex: 0, explanation: "SAR depends strongly on flip angle and duty cycle.", referenceLink: "https://www.fda.gov" },

  // --- NEW QUESTIONS BELOW (16–30) ---

  { text: "What is the main advantage of using a 3D MPRAGE sequence for brain imaging?", options: ["Fast T2* imaging", "High-resolution T1-weighted imaging with excellent gray–white differentiation", "Improved diffusion contrast", "Reduced SAR compared to 2D GRE"], correctIndex: 1, explanation: "MPRAGE provides high-resolution T1 images ideal for neuroanatomy and volumetry.", referenceLink: "https://radiopaedia.org" },

  { text: "In MR perfusion using DSC (dynamic susceptibility contrast), lesions with true perfusion deficit typically show:", options: ["Increased signal during bolus", "Signal drop proportional to susceptibility of the contrast bolus", "No signal change", "Pure T1 shortening"], correctIndex: 1, explanation: "DSC relies on T2*/susceptibility signal drop as gadolinium passes through microvasculature.", referenceLink: "https://radiopaedia.org" },

  { text: "What is the major effect of using a shorter echo train length (ETL) in fast spin-echo imaging?", options: ["Increased blurring and reduced resolution", "Reduced blurring and improved image sharpness", "Increased susceptibility artifacts", "Increased SAR"], correctIndex: 1, explanation: "Shorter ETL reduces T2 decay during acquisition, reducing blurring.", referenceLink: "https://radiopaedia.org" },

  { text: "Which MRI sequence is preferred for evaluating cartilage morphology and subtle chondral defects?", options: ["T1 SE", "3D spoiled gradient-echo or 3D PD-weighted sequences", "STIR", "SWI"], correctIndex: 1, explanation: "High-resolution 3D GRE or PD sequences show cartilage surfaces well.", referenceLink: "https://radiopaedia.org" },

  { text: "In MR angiography, time-of-flight (TOF) imaging relies primarily on:", options: ["Chemical shift", "Inflow enhancement of unsaturated blood into saturated background tissue", "Susceptibility effects", "Diffusion restriction"], correctIndex: 1, explanation: "TOF exploits inflow of fresh spins with higher signal.", referenceLink: "https://radiopaedia.org" },

  { text: "Which factor most increases slice crosstalk in 2D imaging?", options: ["Using interleaved multislice acquisition", "Using slices with minimal interslice gaps", "Increasing TR", "Using fat suppression"], correctIndex: 1, explanation: "Adjacent slices with little separation experience partial excitation and signal loss.", referenceLink: "https://radiopaedia.org" },

  { text: "What is the primary reason EPI is susceptible to geometric distortion?", options: ["Very short readout times", "Long echo-train readouts causing off-resonance pixel shifts", "High flip angles", "High bandwidth"], correctIndex: 1, explanation: "Long EPI readouts cause off-resonance distortions, especially near air–tissue interfaces.", referenceLink: "https://radiopaedia.org" },

  { text: "In MR spectroscopy, an elevated choline peak typically indicates:", options: ["Normal white matter", "Increased cell membrane turnover (often tumors or demyelination)", "High lipid contamination", "Acute hemorrhage"], correctIndex: 1, explanation: "Choline elevation reflects increased membrane turnover, common in malignancy or inflammation.", referenceLink: "https://radiopaedia.org" },

  { text: "What is the main advantage of Dixon fat–water separation over standard fat saturation?", options: ["Requires no phase coherence", "Provides robust fat suppression despite B0/B1 inhomogeneities", "No need for multiple echoes", "Shorter scan time"], correctIndex: 1, explanation: "Dixon is highly reliable even in challenging field conditions.", referenceLink: "https://radiopaedia.org" },

  { text: "Which is the most effective method to reduce Gibbs ringing?", options: ["Increase echo time", "Increase matrix size or apply smoothing filters", "Decrease TR", "Use STIR"], correctIndex: 1, explanation: "Gibbs artifact decreases with higher spatial resolution or smoothing.", referenceLink: "https://radiopaedia.org" },

  { text: "Which sequence is most susceptible to B1 inhomogeneity at 3T?", options: ["Inversion-recovery", "Fast spin-echo", "Gradient-echo sequences with high flip angles", "STIR"], correctIndex: 2, explanation: "GRE flip angles depend on B1 uniformity, making them more affected by B1 variations at high field.", referenceLink: "https://radiopaedia.org" },

  { text: "What is the main purpose of using flow compensation (gradient moment nulling)?", options: ["Suppress fat", "Reduce phase-related flow artifacts from moving spins", "Increase SNR", "Shorten TE"], correctIndex: 1, explanation: "Gradient moment nulling reduces flow-related dephasing.", referenceLink: "https://radiopaedia.org" },

  { text: "Which parameter primarily determines spatial resolution in MRI?", options: ["TR", "Matrix size and FOV in the phase-encode and frequency axes", "NEX", "Receiver bandwidth"], correctIndex: 1, explanation: "Resolution is determined by FOV divided by matrix size.", referenceLink: "https://radiopaedia.org" },

  { text: "Which phenomenon causes signal loss at metal-tissue interfaces?", options: ["Chemical shift only", "Large microscopic magnetic field gradients causing rapid dephasing", "T1 elongation", "RF saturation"], correctIndex: 1, explanation: "Metal causes strong field gradients → rapid T2* decay → signal voids.", referenceLink: "https://radiopaedia.org" },

  { text: "Why are STIR sequences contraindicated after gadolinium administration?", options: ["They are too slow", "STIR suppresses any tissue with short T1, including gadolinium-enhanced lesions", "They cause high SAR", "They distort anatomy"], correctIndex: 1, explanation: "STIR nulls short-T1 tissues, so gadolinium enhancement becomes suppressed and invisible.", referenceLink: "https://radiopaedia.org" }
];


export const ADVANCED_CT: ChallengeQuestion[] = [ 
  { text: "Dual-energy CT (DECT) can reliably separate iodine from calcium because:", options: ["Iodine and calcium have identical attenuation at low and high energies", "Their attenuation curves diverge with energy, enabling material decomposition using two spectra", "DECT uses magnetic gradients to differentiate materials", "DECT measures electrical conductivity, not attenuation"], correctIndex: 1, explanation: "Different energy-dependent attenuation allows decomposition algorithms to distinguish materials (iodine vs calcium).", referenceLink: "https://radiopaedia.org" },

  { text: "CTDIvol is best described as:", options: ["Exact patient organ dose for each patient", "A standardized scanner-output index measured in phantoms for protocol comparison and protocol optimization", "Peak skin dose in Gy", "The same as SSDE"], correctIndex: 1, explanation: "CTDIvol is a phantom-based estimate of scanner output; patient dose requires SSDE and organ models.", referenceLink: "https://www.aapm.org" },

  { text: "Which clinical advantage is provided by iterative reconstruction (IR) algorithms over filtered back projection (FBP)?", options: ["IR increases dose linearly with resolution", "IR reduces noise and permits diagnostic image quality at lower radiation doses", "IR eliminates the need for contrast agents", "IR halves scan time automatically"], correctIndex: 1, explanation: "IR reduces noise and artifacts, enabling dose reduction.", referenceLink: "https://radiopaedia.org" },

  { text: "A typical clinical cause of streak artifacts between dense bones on head CT is:", options: ["Photon starvation and beam hardening", "Low kVp only", "Detector saturation only", "Patient motion exclusively"], correctIndex: 0, explanation: "Dense bone produces beam hardening and photon starvation, resulting in streaks.", referenceLink: "https://radiopaedia.org" },

  { text: "Which adjustment helps reduce dose in pediatric CT?", options: ["Use adult protocols", "Use automatic exposure control (AEC), lower kVp where appropriate, and IR to maintain CNR", "Increase mA drastically", "Remove filtration"], correctIndex: 1, explanation: "Pediatric optimization uses AEC, lower kVp, and IR.", referenceLink: "https://www.aapm.org" },

  { text: "Which CT method is most dose-efficient for coronary CT in a patient with low, stable heart rate?", options: ["Retrospective gating", "Prospective ECG-triggered step-and-shoot acquisition", "Non-gated helical CT", "Any helical CT"], correctIndex: 1, explanation: "Prospective gating greatly reduces radiation dose.", referenceLink: "https://radiopaedia.org" },

  { text: "What is the primary physical cause of beam hardening?", options: ["Perfect monochromatic beam", "Preferential absorption of low-energy photons", "Detector noise", "Air gaps"], correctIndex: 1, explanation: "Low-energy photons are absorbed, shifting the spectrum and creating non-linear attenuation.", referenceLink: "https://radiopaedia.org" },

  { text: "Which adjustment reduces motion blur for moving organs?", options: ["Slow gantry rotation", "Very low pitch", "Fast rotation time, breath-hold, or gating", "Increase slice thickness"], correctIndex: 2, explanation: "Shorter exposure time reduces motion blur.", referenceLink: "https://www.aapm.org" },

  { text: "The CT number (HU) scale defines:", options: ["Bone = 0 HU", "Water = 0 HU and air ≈ -1000 HU", "Fat = 0 HU", "Muscle = 0 HU"], correctIndex: 1, explanation: "Water is 0 HU; air is –1000 HU.", referenceLink: "https://radiopaedia.org" },

  { text: "Virtual non-contrast images in DECT are generated by:", options: ["High-kVp only", "Material decomposition removing iodine contribution", "Increasing slice thickness", "Manual windowing"], correctIndex: 1, explanation: "DECT separates iodine and produces synthetic non-contrast images.", referenceLink: "https://radiopaedia.org" },

  { text: "Best method to reduce metallic artifacts in CT:", options: ["Lower kVp only", "Use MAR algorithms, higher kVp, thin slices, or IR", "Increase gantry tilt", "Reduce mA"], correctIndex: 1, explanation: "MAR software and high kVp reduce streaking.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },

  { text: "Which metric best compares stochastic risk across CT protocols?", options: ["CTDIvol", "DLP × conversion factor (effective dose)", "Peak skin dose", "SSDE alone"], correctIndex: 1, explanation: "Effective dose approximates population-level cancer risk.", referenceLink: "https://www.aapm.org" },

  { text: "In acute neuroimaging, DECT is useful for:", options: ["Auto cardiac function", "Differentiating hemorrhage from iodinated contrast", "Detecting pulmonary embolism only", "Ultrafine <0.1mm slices"], correctIndex: 1, explanation: "DECT generates iodine maps and virtual non-contrast images.", referenceLink: "https://radiopaedia.org" },

  { text: "A major factor affecting iodine contrast conspicuity on CT is:", options: ["Detector size", "kVp selection, iodine concentration, and timing", "Kernel only", "Room temperature"], correctIndex: 1, explanation: "Lower kVp increases iodine attenuation.", referenceLink: "https://radiopaedia.org" },

  // ---------- ADDED & EDITED QUESTIONS (15 MORE) ----------

  { text: "What is the main limitation of filtered back projection (FBP) at low dose?", options: ["Over-smoothing", "Excessive noise and streak artifacts", "Loss of contrast", "Inaccurate HU values only"], correctIndex: 1, explanation: "Low-dose FBP amplifies noise, producing grainy and streaky images.", referenceLink: "https://radiopaedia.org" },

  { text: "Automatic Exposure Control (AEC) adjusts which parameter in real time?", options: ["kVp during scan", "Tube current (mA) based on patient size and attenuation", "Gantry rotation speed", "Reconstruction kernel"], correctIndex: 1, explanation: "AEC modulates tube current to maintain image quality while minimizing dose.", referenceLink: "https://www.aapm.org" },

  { text: "A common sign of partial volume averaging is:", options: ["Uniform noise", "Blurring of tissue boundaries when a voxel contains mixed tissues", "Increased mA", "Beam hardening"], correctIndex: 1, explanation: "Mixed-tissue voxels generate averaged HU values causing blurring.", referenceLink: "https://radiopaedia.org" },

  { text: "Which factor most improves low-contrast detectability?", options: ["Sharp kernel", "Higher mAs and soft-tissue reconstruction kernel", "Increase pitch", "Decrease rotation speed"], correctIndex: 1, explanation: "Low noise and soft kernels improve visualization of subtle lesions.", referenceLink: "https://radiopaedia.org" },

  { text: "What is pitch in helical CT?", options: ["kVp ratio", "Table movement per rotation divided by beam width", "Reconstruction thickness", "Detector speed"], correctIndex: 1, explanation: "Pitch = table movement per rotation / total beam width.", referenceLink: "https://radiopaedia.org" },

  { text: "Increasing pitch generally results in:", options: ["Higher dose", "Lower dose but potential loss of longitudinal resolution", "Better contrast", "Improved metal artifact reduction"], correctIndex: 1, explanation: "Higher pitch reduces overlap and dose but may degrade image resolution.", referenceLink: "https://radiopaedia.org" },

  { text: "What is the most common cause of ring artifacts?", options: ["Patient motion", "Detector calibration errors or malfunctioning detector elements", "Beam hardening", "Centering error"], correctIndex: 1, explanation: "Faulty detector elements create circular rings.", referenceLink: "https://radiopaedia.org" },

  { text: "Why is proper patient centering important in CT?", options: ["To reduce gantry tilt", "To ensure accurate AEC performance and dose optimization", "To extend FOV", "To eliminate beam hardening"], correctIndex: 1, explanation: "Off-center positioning misleads AEC and increases dose unnecessarily.", referenceLink: "https://www.aapm.org" },

  { text: "The main advantage of thinner slices is:", options: ["Lower noise", "Better spatial resolution and reduced partial volume effect", "Lower dose automatically", "Higher contrast exclusively"], correctIndex: 1, explanation: "Thin slices improve detail but increase noise unless compensated.", referenceLink: "https://radiopaedia.org" },

  { text: "What determines spatial resolution along the x-y plane in CT?", options: ["mA", "Detector size, focal spot size, and reconstruction matrix", "kVp only", "Patient habitus alone"], correctIndex: 1, explanation: "Spatial resolution depends on system geometry and reconstruction matrix.", referenceLink: "https://radiopaedia.org" },

  { text: "What is blooming artifact?", options: ["Motion blur", "Apparent enlargement of high-density objects such as calcifications or metal due to partial volume and beam hardening", "Ring artifact", "Noise-related distortion"], correctIndex: 1, explanation: "Hard materials appear larger than reality due to physics and reconstruction limits.", referenceLink: "https://radiopaedia.org" },

  { text: "Which factor helps differentiate renal stones from phleboliths on CT?", options: ["kVp selection only", "Soft-tissue windowing and presence of soft-tissue rim sign", "Increasing mA", "Sagittal reformats only"], correctIndex: 1, explanation: "A soft-tissue rim favors ureteric stone; no rim suggests phlebolith.", referenceLink: "https://radiopaedia.org" },

  { text: "A high pitch (e.g., >2) on newer scanners is useful in:", options: ["Motion-free imaging of moving structures such as the aorta", "Brain imaging only", "Bone windows", "Metal artifact removal"], correctIndex: 0, explanation: "High pitch enables very fast acquisition, reducing motion artifacts.", referenceLink: "https://radiopaedia.org" },

  { text: "Which protocol adjustment reduces streak artifacts from contrast-filled SVC?", options: ["Increase kVp", "Use saline chaser, adjust injection site (left arm), or delay scanning", "Decrease slice thickness only", "Increase matrix size"], correctIndex: 1, explanation: "Dilution of contrast and optimizing injection side reduces streaking.", referenceLink: "https://radiopaedia.org" },

  { text: "A common reason for misregistration in CT angiography is:", options: ["Beam hardening", "Incorrect timing of contrast bolus relative to image acquisition", "Detector drift", "Low pitch"], correctIndex: 1, explanation: "Incorrect bolus timing causes vessels to appear poorly opacified.", referenceLink: "https://radiopaedia.org" }
];


export const ADVANCED_USS: ChallengeQuestion[] = [
  { text: "Axial resolution in diagnostic ultrasound is primarily determined by:", options: ["Transducer aperture only", "Spatial pulse length (shorter pulses = better axial resolution), achieved by higher frequency and fewer cycles per pulse", "PRF only", "Doppler angle only"], correctIndex: 1, explanation: "Axial resolution correlates with pulse length; shorter pulses (higher frequency / lower cycles) give finer axial detail.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Lateral resolution is most improved clinically by:", options: ["Increasing pulse repetition frequency (PRF) only", "Increasing transducer aperture and focusing (lower f-number) to narrow the beamwidth at focus", "Increasing time-gain compensation (TGC) only", "Using harmonic imaging only"], correctIndex: 1, explanation: "Lateral resolution depends on beamwidth set by aperture and focusing—larger aperture and tighter focus narrow the beam.", referenceLink: "SpringerLink" },
  { text: "Which Doppler parameter adjustment reduces aliasing in pulsed-wave Doppler?", options: ["Decrease PRF always", "Increase PRF (raise Nyquist limit), shift baseline, use CW Doppler for very high velocities, or reduce sample depth", "Use lower frequency probe only", "Increase wall filter to max always"], correctIndex: 1, explanation: "Aliasing occurs when Doppler shift exceeds Nyquist (PRF/2); increasing PRF or using CW Doppler avoids aliasing.", referenceLink: "https://radiopaedia.org" },
  { text: "Which artifact produces multiple parallel hyperechoic lines deep to a reflective surface (e.g., gas)?", options: ["Mirror artifact", "Reververation artifact due to repeated reflections between two strong reflectors", "Edge shadowing", "Speckle only"], correctIndex: 1, explanation: "Reverberation causes repeated echoes leading to parallel lines deeper than the true reflector.", referenceLink: "https://radiopaedia.org" },
  { text: "Tissue harmonic imaging (THI) improves image quality primarily because:", options: ["It acquires at the fundamental frequency only", "Harmonic signals are generated in tissue (nonlinear propagation) producing a narrower effective beam and reduced near-field and side-lobe artifacts, improving contrast and resolution", "It doubles PRF automatically", "It eliminates attenuation entirely"], correctIndex: 1, explanation: "Harmonic components arise during propagation; receiving harmonics reduces artifacts and enhances image clarity.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Why is the Mechanical Index (MI) displayed on ultrasound scanners and monitored in obstetrics?", options: ["It indicates image brightness only", "MI relates to cavitation potential (nonthermal mechanical bioeffects); keeping MI low reduces risk of cavitation particularly with contrast agents or in fetal imaging", "It measures radiation dose in mGy", "It controls probe frequency automatically"], correctIndex: 1, explanation: "MI estimates potential for cavitation; operators monitor MI (and TI) to follow ALARA-like acoustic exposure guidelines.", referenceLink: "https://www.aium.org" },
  { text: "Which step most reduces color-Doppler flash artifact from transducer motion?", options: ["Increase PRF only", "Lower color gain, use proper TGC, stabilize probe, and employ high-pass wall filters to suppress low-frequency clutter", "Lower imaging frequency only", "Increase focal depth only"], correctIndex: 1, explanation: "Motion-induced color flash arises from tissue/hand motion; reducing color gain and using wall filters and probe stabilization minimize it.", referenceLink: "https://www.bmus.org" },
  { text: "Continuous-wave (CW) Doppler is preferred over pulsed-wave (PW) Doppler when:", options: ["Measuring low velocities only", "Measuring very high velocities where aliasing in PW would occur, at the expense of range ambiguity", "Depth specificity is required always", "Color mapping is necessary"], correctIndex: 1, explanation: "CW Doppler detects very high velocities without aliasing but cannot localize depth.", referenceLink: "https://www.bmus.org" },
  { text: "Which factor most strongly limits penetration at high ultrasound frequencies?", options: ["Larger aperture only", "Frequency-dependent attenuation: higher frequencies attenuate more, reducing penetration though improving resolution", "PRF only", "Harmonic imaging only"], correctIndex: 1, explanation: "Attenuation rises with frequency, so higher frequencies give better resolution but less depth penetration.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Which ultrasound setting should be increased to improve visualization of deep structures when using a high-frequency probe that has poor penetration?", options: ["Decrease output power to zero", "Lower imaging frequency (select a lower-frequency probe or reduce frequency setting), increase gain appropriately, and consider THI on/off", "Increase PRF only", "Use higher MI always"], correctIndex: 1, explanation: "Lower frequency improves penetration; adjust gain and harmonics depending on depth.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "What causes “speckle” in ultrasound images and how is it usually managed clinically?", options: ["Electronic noise only; it cannot be reduced", "Interference of many scattered wavelets from small scatterers causes speckle; compounding, THI, or post-processing filters reduce it", "Single scatterer reflection only", "Incorrect PRF only"], correctIndex: 1, explanation: "Speckle is a coherent interference phenomenon and can be reduced by compounding or harmonic imaging.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Which clinical ultrasound technique provides best sensitivity for early detection of deep vein thrombosis (DVT)?", options: ["Color Doppler only", "Compression ultrasound combined with color and spectral Doppler", "CW Doppler only", "M-mode only"], correctIndex: 1, explanation: "Compression ultrasound is the most sensitive method for diagnosing DVT.", referenceLink: "https://www.aium.org" },
  { text: "Which ultrasound approach best reduces acoustic shadowing behind gallstones?", options: ["Increase probe frequency always", "Change probe angle, use THI, compound imaging, or adjust focal zones", "Decrease output power to zero", "Use CW Doppler through stone"], correctIndex: 1, explanation: "Shadowing is geometric; angulation and harmonics help visualize adjacent structures.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Which parameter most directly determines the Nyquist limit for pulsed-wave Doppler at a given depth?", options: ["Sampling frequency only", "Pulse repetition frequency (PRF); Nyquist = PRF/2", "Transducer aperture only", "Harmonic imaging only"], correctIndex: 1, explanation: "PRF limits maximum measurable Doppler shift.", referenceLink: "https://radiopaedia.org" },
  { text: "Which advanced ultrasound technique provides quantitative tissue stiffness estimates and is used to evaluate liver fibrosis?", options: ["Basic B-mode only", "Shear-wave elastography", "Color Doppler only", "Harmonic imaging only"], correctIndex: 1, explanation: "Shear-wave elastography quantifies stiffness in kPa and is widely used for fibrosis assessment.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "What is the primary cause of posterior acoustic enhancement behind cysts?", options: ["High absorption within the cyst", "Low attenuation within the fluid allowing stronger echoes distal to the structure", "High MI setting", "Reverberation from posterior wall"], correctIndex: 1, explanation: "Fluids attenuate minimally, creating increased echo amplitude behind the cyst.", referenceLink: "https://radiopaedia.org" },
  { text: "Which maneuver improves visualization of the pancreas on abdominal ultrasound?", options: ["Increased wall filter", "Patient drinks water to create a fluid window; use deep inspiration and left lateral decubitus", "Lower MI", "Use CW Doppler"], correctIndex: 1, explanation: "Water as an acoustic window and proper positioning improves pancreas visualization.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "In obstetric ultrasound, what does a low Thermal Index (TI) primarily indicate?", options: ["Low risk of heating biological tissues", "Better Doppler sensitivity", "Improved lateral resolution", "Better visualization of bones"], correctIndex: 0, explanation: "TI reflects potential tissue heating; low TI is preferred in fetal imaging.", referenceLink: "https://www.aium.org" },
  { text: "Which factor most improves frame rate in real-time ultrasound?", options: ["Increasing number of focal zones", "Reducing imaging depth and narrowing sector width", "Increasing overall gain only", "Using CW Doppler"], correctIndex: 1, explanation: "Shallower depth and narrower sector decrease line density, increasing frame rate.", referenceLink: "https://radiopaedia.org" },
  { text: "Which ultrasound artifact results in duplication of a structure across a strong reflector, such as the diaphragm?", options: ["Mirroring artifact", "Refraction artifact", "Ring-down artifact", "Aliasing"], correctIndex: 0, explanation: "Mirror-image artifact causes duplicated structures beyond a reflective interface.", referenceLink: "https://radiopaedia.org" },
  { text: "Which technique improves detection of low-velocity blood flow in organs like the testis?", options: ["Increase wall filter", "Lower pulse repetition frequency and increase color gain carefully", "Use CW Doppler", "Use very high frequency always"], correctIndex: 1, explanation: "Low PRF and increased gain improve sensitivity for slow flows.", referenceLink: "https://www.bmus.org" },
  { text: "Which property explains why ultrasound cannot pass through bone effectively?", options: ["Bone has low acoustic impedance", "Bone has very high acoustic impedance and high attenuation, leading to reflection and absorption", "Bone produces strong harmonics", "Bone reduces PRF"], correctIndex: 1, explanation: "High impedance mismatch and strong attenuation prevent deep penetration.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Which setting adjustment reduces clutter artifact in transabdominal pelvic ultrasound?", options: ["Increase MI", "Apply appropriate TGC, reduce color gain, and use harmonic imaging", "Increase number of focal zones", "Reduce dynamic range excessively"], correctIndex: 1, explanation: "Proper gain/TGC and harmonics suppress clutter noise.", referenceLink: "https://radiopaedia.org" },
  { text: "Which probe type is best for assessing deep abdominal structures in obese patients?", options: ["High-frequency linear probe", "Low-frequency curvilinear probe (2–5 MHz)", "Endocavity probe", "High-frequency hockey stick probe"], correctIndex: 1, explanation: "Low-frequency probes provide better penetration for deep structures.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "What is the main purpose of dynamic range adjustment in ultrasound?", options: ["Increase MI", "Alter the ratio of strongest to weakest detectable echoes, affecting image contrast", "Increase spatial resolution", "Improve Doppler angle"], correctIndex: 1, explanation: "Dynamic range controls contrast by compressing or expanding echo amplitude range.", referenceLink: "https://radiopaedia.org" },
  { text: "Which structure normally produces clean posterior acoustic shadowing?", options: ["Liver parenchyma", "Bone and gallstones", "Cysts", "Urine"], correctIndex: 1, explanation: "Highly attenuating structures block sound, causing clean shadowing.", referenceLink: "https://radiopaedia.org" },
  { text: "Which factor primarily improves contrast resolution in B-mode imaging?", options: ["Beamformer delay only", "Optimal dynamic range, harmonic imaging, and appropriate frequency selection", "Increasing PRF only", "Changing Doppler angle"], correctIndex: 1, explanation: "Contrast resolution improves with harmonic imaging and optimized dynamic range.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "Why is Doppler angle correction important when measuring blood flow velocities?", options: ["It increases frame rate", "To obtain accurate velocity estimation since Doppler shift depends on cosine of the angle", "It increases dynamic range", "It eliminates aliasing"], correctIndex: 1, explanation: "Velocity = (measured shift) / cos(θ); incorrect angle yields inaccurate values.", referenceLink: "https://radiopaedia.org" },
  { text: "Which technique is most helpful when scanning the appendix in suspected appendicitis?", options: ["Apply very high MI", "Use graded compression with a high-resolution linear probe", "Use CW Doppler", "Increase PRF"], correctIndex: 1, explanation: "Graded compression displaces bowel gas and improves visualization.", referenceLink: "https://www.ncbi.nlm.nih.gov/pmc" },
  { text: "What is the primary purpose of using M-mode in echocardiography?", options: ["To measure blood flow only", "To obtain high-temporal-resolution motion information for cardiac structures", "To visualize lungs only", "To enhance color Doppler"], correctIndex: 1, explanation: "M-mode offers excellent temporal resolution for cardiac wall and valve motion analysis.", referenceLink: "https://radiopaedia.org" }
];

export const ADVANCED_SPECIAL_PROCEDURES: ChallengeQuestion[] = [
  // 1
  {
    text: "During an HSG, free intraperitoneal spillage of contrast primarily indicates:",
    options: [
      "Partial obstruction of the fallopian tubes",
      "Patent fallopian tubes allowing contrast passage",
      "Contrast extravasation from uterine perforation",
      "Presence of early intrauterine pregnancy"
    ],
    correctIndex: 1,
    explanation: "Spillage of contrast into the peritoneal cavity confirms that the fallopian tubes are open.",
    referenceLink: "https://radiopaedia.org"
  },

  // 2
  {
    text: "Which contrast agent is preferred for suspected bowel perforation during gastrointestinal imaging?",
    options: [
      "High-density barium sulfate suspension",
      "Carbon dioxide insufflation only",
      "Water-soluble iodinated contrast (e.g., Gastrografin)",
      "Any contrast medium available"
    ],
    correctIndex: 2,
    explanation: "Water-soluble iodinated contrast is safer than barium if perforation is suspected because it reduces peritoneal irritation.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 3
  {
    text: "Which special procedure is ideal for evaluating the spinal canal for disc herniation or nerve root compression?",
    options: [
      "Retrograde urethrogram with fluoroscopy",
      "Myelography with intrathecal contrast",
      "Shoulder arthrography using iodinated contrast",
      "Hysterosalpingography of the pelvic cavity"
    ],
    correctIndex: 1,
    explanation: "Myelography involves intrathecal contrast to outline the spinal canal and detect disc or nerve abnormalities.",
    referenceLink: "https://radiopaedia.org"
  },

  // 4
  {
    text: "During ERCP, contrast is injected into which anatomical structure?",
    options: [
      "Portal vein under fluoroscopic guidance",
      "Common bile duct and pancreatic duct via the ampulla",
      "Duodenal lumen only without duct cannulation",
      "Gallbladder lumen directly through percutaneous access"
    ],
    correctIndex: 1,
    explanation: "ERCP cannulates the ampulla to opacify the biliary and pancreatic ducts for diagnostic or therapeutic purposes.",
    referenceLink: "https://www.gastrojournal.org"
  },

  // 5
  {
    text: "A patient undergoing arthrography most commonly receives contrast into:",
    options: [
      "Peritoneal cavity for abdominal visualization",
      "Joint space such as shoulder, knee, or hip",
      "Urinary bladder for cystography",
      "Subarachnoid space for spinal imaging"
    ],
    correctIndex: 1,
    explanation: "Arthrography involves injection of contrast directly into a joint to assess cartilage, ligaments, and labrum.",
    referenceLink: "https://radiopaedia.org"
  },

  // 6
  {
    text: "Which projection is routinely obtained during a hysterosalpingogram?",
    options: [
      "Posteroanterior chest projection for reference",
      "Anteroposterior pelvis projection for optimal uterine visualization",
      "Lateral skull projection for cranial anatomy",
      "Oblique lumbar spine projection for vertebral assessment"
    ],
    correctIndex: 1,
    explanation: "AP pelvis projection best visualizes the uterus and fallopian tubes during contrast administration.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 7
  {
    text: "A sialogram is performed to evaluate:",
    options: [
      "Thyroid gland morphology and nodules",
      "Salivary gland ducts for stones, strictures, or obstruction",
      "Pituitary gland for adenomas",
      "Paranasal sinuses for mucosal pathology"
    ],
    correctIndex: 1,
    explanation: "Sialography specifically evaluates the ductal anatomy of salivary glands for obstruction or calculi.",
    referenceLink: "https://radiopaedia.org"
  },

  // 8
  {
    text: "In a retrograde urethrogram (RUG), contrast is introduced through:",
    options: [
      "A Foley catheter inflated in the urinary bladder",
      "The penile urethral meatus under fluoroscopic guidance",
      "An intravenous line into a peripheral vein",
      "A nephrostomy tube accessing the renal pelvis"
    ],
    correctIndex: 1,
    explanation: "RUG introduces contrast at the distal urethral meatus to visualize urethral anatomy and detect strictures or trauma.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 9
  {
    text: "Which imaging modality is typically performed immediately after a myelogram for detailed spinal evaluation?",
    options: [
      "Ultrasound of the paraspinal muscles",
      "Magnetic resonance imaging of the spinal cord",
      "Computed tomography scan with intrathecal contrast",
      "Plain abdominal radiography for alignment"
    ],
    correctIndex: 2,
    explanation: "CT post-myelography provides high-resolution images of the spinal canal, nerve roots, and surrounding structures.",
    referenceLink: "https://radiopaedia.org"
  },

  // 10
  {
    text: "Which contrast medium is mandatory for intrathecal myelography?",
    options: [
      "Barium sulfate suspension",
      "High-osmolar iodinated contrast",
      "Nonionic water-soluble iodinated contrast",
      "Gadolinium-based contrast solution"
    ],
    correctIndex: 2,
    explanation: "Nonionic, low-osmolar iodinated contrast is required intrathecally for safety and optimal imaging.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 11
  {
    text: "Which special procedure evaluates vesicoureteral reflux in children or adults?",
    options: [
      "Hysterosalpingography to outline uterine cavity",
      "Voiding cystourethrogram during bladder filling and voiding",
      "ERCP for biliary duct visualization",
      "Lumbar myelography for spinal assessment"
    ],
    correctIndex: 1,
    explanation: "VCUG evaluates the bladder and urethra during voiding to detect reflux into the ureters.",
    referenceLink: "https://radiopaedia.org"
  },

  // 12
  {
    text: "A T-tube cholangiogram is typically performed to evaluate:",
    options: [
      "Splenic morphology post-surgery",
      "Residual stones or strictures in the biliary ducts after cholecystectomy",
      "Renal perfusion and cortical function",
      "Venous return from the thoracic cavity"
    ],
    correctIndex: 1,
    explanation: "T-tube cholangiography is performed post-cholecystectomy to check for retained stones or ductal abnormalities.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 13
  {
    text: "Which condition is best assessed with a fistulogram?",
    options: [
      "Gallbladder calculi and sludge",
      "Abnormal fistulous tracts connecting hollow organs or skin",
      "Cerebral aneurysms in the circle of Willis",
      "Articular cartilage or ligament tears"
    ],
    correctIndex: 1,
    explanation: "Fistulography outlines abnormal tracts to assist in diagnosis and surgical planning.",
    referenceLink: "https://radiopaedia.org"
  },

  // 14
  {
    text: "In an antegrade nephrostogram, contrast is injected through:",
    options: [
      "A peripheral intravenous line",
      "A nephrostomy tube accessing the renal pelvis",
      "A Foley catheter into the bladder",
      "A central venous catheter"
    ],
    correctIndex: 1,
    explanation: "Antegrade nephrostography evaluates the renal pelvis and ureter via nephrostomy access.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 15
  {
    text: "Which special procedure best evaluates fallopian tube blockage in infertility workups?",
    options: [
      "Lumbar myelography for nerve root evaluation",
      "Hysterosalpingography with contrast injection",
      "Voiding cystourethrogram for reflux assessment",
      "Arthrography for joint pathology"
    ],
    correctIndex: 1,
    explanation: "HSG is routinely used to assess tubal patency in infertility evaluations.",
    referenceLink: "https://radiopaedia.org"
  },

  // 16
  {
    text: "During ERCP, the patient is usually positioned in:",
    options: [
      "Supine on the table for endoscopy",
      "Left lateral decubitus or prone for duct cannulation",
      "Erect upright for gravity drainage",
      "Trendelenburg to improve visualization"
    ],
    correctIndex: 1,
    explanation: "Prone or left lateral positioning allows optimal endoscopic access to the ampulla for cannulation.",
    referenceLink: "https://www.giejournal.org"
  },

  // 17
  {
    text: "Which special procedure combines both endoscopy and fluoroscopy simultaneously?",
    options: [
      "Cystoscopy to evaluate bladder",
      "Endoscopic retrograde cholangiopancreatography (ERCP)",
      "Hysterosalpingography of the uterine cavity",
      "Voiding cystourethrogram of the urethra"
    ],
    correctIndex: 1,
    explanation: "ERCP combines endoscopic cannulation with fluoroscopic imaging to assess biliary and pancreatic ducts.",
    referenceLink: "https://radiopaedia.org"
  },

  // 18
  {
    text: "A successful shoulder arthrogram should demonstrate contrast outlining:",
    options: [
      "Only surrounding muscle tissue",
      "Joint capsule, labrum, and articular surfaces",
      "Pleural cavity without spillage",
      "Subarachnoid space in the cervical spine"
    ],
    correctIndex: 1,
    explanation: "Contrast should fill the joint capsule and articular structures for proper assessment.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 19
  {
    text: "Which projection is essential for visualizing the urethra during VCUG?",
    options: [
      "Oblique or lateral pelvis projection to outline urethra",
      "Posteroanterior chest projection for reference",
      "Lateral skull projection for cranial assessment",
      "Right lateral abdomen for bowel visualization"
    ],
    correctIndex: 0,
    explanation: "Oblique or lateral pelvis projections provide clear visualization of the urethra during voiding.",
    referenceLink: "https://radiopaedia.org"
  },

  // 20
  {
    text: "Which contrast medium is typically used for sialography?",
    options: [
      "Oil-based iodinated contrast for ductal evaluation",
      "Air only insufflation",
      "Barium sulfate suspension",
      "Gadolinium solution for MRI"
    ],
    correctIndex: 0,
    explanation: "Oil-based iodinated contrast allows detailed visualization of salivary ducts.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 21
  {
    text: "What is the primary purpose of a defecography study?",
    options: [
      "Evaluate biliary tract disease",
      "Assess anorectal function during defecation",
      "Localize urinary tract strictures",
      "Evaluate gastrointestinal bleeding sources"
    ],
    correctIndex: 1,
    explanation: "Defecography evaluates pelvic floor and rectal function during evacuation.",
    referenceLink: "https://radiopaedia.org"
  },

  // 22
  {
    text: "Which procedure assesses the patency of a dialysis graft or fistula?",
    options: [
      "Retrograde urethrogram",
      "Fistulogram using iodinated contrast",
      "Hysterosalpingography",
      "Lumbar myelography"
    ],
    correctIndex: 1,
    explanation: "Fistulography is used to evaluate vascular access patency and identify stenosis or thrombosis.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 23
  {
    text: "A patient with recurrent parotid gland swelling should undergo:",
    options: [
      "Sialography to detect ductal obstruction or stones",
      "Hysterosalpingography",
      "Lumbar myelography",
      "Retrograde urethrogram"
    ],
    correctIndex: 0,
    explanation: "Sialography demonstrates obstruction in salivary ducts as a cause of swelling.",
    referenceLink: "https://radiopaedia.org"
  },

  // 24
  {
    text: "Which special procedure is contraindicated in acute pancreatitis unless emergent?",
    options: [
      "CT abdomen for general evaluation",
      "ERCP unless indicated for cholangitis or obstruction",
      "Hysterosalpingography",
      "Voiding cystourethrogram"
    ],
    correctIndex: 1,
    explanation: "ERCP may worsen pancreatitis and is reserved for urgent biliary decompression.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 25
  {
    text: "For lumbar myelography, the needle is usually inserted at:",
    options: [
      "C2–C3 for cervical evaluation",
      "L3–L4 or L4–L5 below spinal cord termination",
      "T1–T2 for thoracic access",
      "S1–S2 for sacral imaging"
    ],
    correctIndex: 1,
    explanation: "Lumbar puncture below the spinal cord avoids cord injury during intrathecal contrast injection.",
    referenceLink: "https://radiopaedia.org"
  },

  // 26
  {
    text: "Which procedure examines mucosal patterns of the small bowel using contrast?",
    options: [
      "Enteroclysis with direct small bowel contrast infusion",
      "ERCP for pancreatic and biliary ducts",
      "Cystography of the bladder",
      "Arthrography for joint evaluation"
    ],
    correctIndex: 0,
    explanation: "Enteroclysis delivers contrast directly into the small intestine for detailed mucosal assessment.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 27
  {
    text: "Which imaging method is used to evaluate patency of biliary ducts after cholecystectomy?",
    options: [
      "Enteroclysis for small bowel assessment",
      "T-tube cholangiography for post-surgical biliary evaluation",
      "Hysterosalpingography for uterine tubes",
      "Arthrography for joint evaluation"
    ],
    correctIndex: 1,
    explanation: "T-tube cholangiograms are performed to assess biliary duct patency after gallbladder surgery.",
    referenceLink: "https://radiopaedia.org"
  },

  // 28
  {
    text: "Which structure must be visualized in a normal retrograde urethrogram?",
    options: [
      "Renal pelvis for drainage assessment",
      "Urethral lumen to evaluate for strictures or trauma",
      "Gallbladder for stones",
      "Uterine cavity for fertility evaluation"
    ],
    correctIndex: 1,
    explanation: "RUG outlines the urethra to detect obstruction, trauma, or strictures.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  },

  // 29
  {
    text: "What is the purpose of fluoroscopic spot images during HSG?",
    options: [
      "Detect gallstones in the biliary system",
      "Capture uterine filling and tubal contrast passage",
      "Assess renal perfusion dynamically",
      "Evaluate spinal canal stenosis"
    ],
    correctIndex: 1,
    explanation: "Spot images document uterine and tubal filling during hysterosalpingography.",
    referenceLink: "https://radiopaedia.org"
  },

  // 30
  {
    text: "During ERCP, failure of contrast to enter the common bile duct suggests:",
    options: [
      "Normal biliary anatomy with free flow",
      "Ampullary obstruction, stone, or stricture preventing passage",
      "Patent ducts with unobstructed contrast flow",
      "Air embolism within portal circulation"
    ],
    correctIndex: 1,
    explanation: "Obstruction prevents contrast from entering the bile duct, indicating pathology at the ampulla or distal duct.",
    referenceLink: "https://pubmed.ncbi.nlm.nih.gov"
  }
];

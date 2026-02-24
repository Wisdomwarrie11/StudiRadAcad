
export interface CTQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: 'MCQ' | 'TF';
}

export interface CTTopic {
  id: string;
  title: string;
  description: string;
  questions: CTQuestion[];
}

export const CT_TOPICS: CTTopic[] = [
  {
    id: 'intro-to-ct',
    title: 'INTRODUCTION TO COMPUTED TOMOGRAPHY',
    description: 'Master the fundamentals of CT imaging, from gantry components to Hounsfield units.',
    questions: [
      {
        id: 'q1',
        text: 'Computed tomography is primarily defined as:',
        options: [
          'Acquisition of cross-sectional two-dimensional slices of tissue',
          'Production of three-dimensional images only',
          'Fluoroscopic imaging technique',
          'Nuclear imaging method'
        ],
        correctAnswer: 'A',
        explanation: 'CT acquires cross-sectional 2D slices of tissues.',
        type: 'MCQ'
      },
      {
        id: 'q2',
        text: 'In CT, the X-ray tube and detectors are housed within the:',
        options: ['Console', 'Couch', 'DAS', 'Gantry'],
        correctAnswer: 'D',
        explanation: 'The gantry is the circular frame containing tube and detectors.',
        type: 'MCQ'
      },
      {
        id: 'q3',
        text: 'The main function of CT detectors is to:',
        options: [
          'Generate X-rays',
          'Store images',
          'Measure transmitted X-rays and convert them to electrical signals',
          'Reduce patient motion'
        ],
        correctAnswer: 'C',
        explanation: 'Detectors convert transmitted photons into electrical signals.',
        type: 'MCQ'
      },
      {
        id: 'q4',
        text: 'Who discovered X-rays in 1895?',
        options: ['Allan Cormack', 'Godfrey Hounsfield', 'Wilhelm Conrad Rontgen', 'Marie Curie'],
        correctAnswer: 'C',
        explanation: 'Rontgen discovered X-rays in 1895.',
        type: 'MCQ'
      },
      {
        id: 'q5',
        text: 'The first CT patient scan occurred in approximately:',
        options: ['1965', '1971', '1973', '1980'],
        correctAnswer: 'C',
        explanation: 'First patient scan was in 1973.',
        type: 'MCQ'
      },
      {
        id: 'q6',
        text: 'Hounsfield Unit (HU) is used to measure:',
        options: ['Image noise', 'Tissue density', 'Slice thickness', 'Radiation time'],
        correctAnswer: 'B',
        explanation: 'HU quantifies density in CT imaging.',
        type: 'MCQ'
      },
      {
        id: 'q7',
        text: 'The typical HU scale range mentioned in the text is:',
        options: ['Tissue density', '-100 HU', '0 HU', '50 HU'],
        correctAnswer: 'A',
        explanation: 'The provided range is −1000 to +3000.',
        type: 'MCQ'
      },
      {
        id: 'q8',
        text: 'Windowing in CT primarily manipulates the:',
        options: ['Scan speed', 'Tube current', 'Detector efficiency', 'Gray scale display'],
        correctAnswer: 'D',
        explanation: 'Windowing adjusts grayscale using CT numbers.',
        type: 'MCQ'
      },
      {
        id: 'q9',
        text: 'A voxel refers to:',
        options: [
          'Three-dimensional volume element',
          'Two-dimensional picture element',
          'Image matrix',
          'Reconstruction filter'
        ],
        correctAnswer: 'A',
        explanation: 'Voxel is the 3D volume element.',
        type: 'MCQ'
      },
      {
        id: 'q10',
        text: 'The matrix in CT imaging is composed of:',
        options: [
          'Voxels only',
          'HU values',
          'Pixels arranged in rows and columns',
          'Detectors only'
        ],
        correctAnswer: 'C',
        explanation: 'Matrix is made of pixels in rows and columns.',
        type: 'MCQ'
      },
      {
        id: 'q11',
        text: 'Which parameter primarily controls X-ray beam energy?',
        options: ['mA', 'Time', 'kVp', 'Pitch'],
        correctAnswer: 'C',
        explanation: 'kVp determines beam energy.',
        type: 'MCQ'
      },
      {
        id: 'q12',
        text: 'CTDI is best described as a measure of:',
        options: [
          'Image contrast',
          'Table speed',
          'Pixel size',
          'Radiation dose delivered by the CT scanner'
        ],
        correctAnswer: 'D',
        explanation: 'CTDI estimates patient radiation dose.',
        type: 'MCQ'
      },
      {
        id: 'q13',
        text: 'Dose Length Product (DLP) represents:',
        options: ['Total radiation dose over scan length', 'Slice thickness', 'Detector efficiency', 'Tube heat'],
        correctAnswer: 'A',
        explanation: 'DLP measures total radiation dose.',
        type: 'MCQ'
      },
      {
        id: 'q14',
        text: 'The scout image in CT is also called the:',
        options: ['Localizer', 'Reconstruction', 'Scanogram', 'Projection map'],
        correctAnswer: 'C',
        explanation: 'Scanogram is the scout image.',
        type: 'MCQ'
      },
      {
        id: 'q15',
        text: 'Spatial resolution refers to the ability to:',
        options: [
          'Reduce radiation dose',
          'Improve contrast',
          'Increase scan speed',
          'Distinguish two small objects separately'
        ],
        correctAnswer: 'D',
        explanation: 'It reflects image sharpness.',
        type: 'MCQ'
      },
      {
        id: 'q16',
        text: 'Pitch in CT is defined as the ratio of:',
        options: [
          'Table movement to detector width per rotation',
          'mA to kVp',
          'Slice thickness to matrix size',
          'Voltage to time'
        ],
        correctAnswer: 'A',
        explanation: 'That is the correct definition of pitch.',
        type: 'MCQ'
      },
      {
        id: 'q17',
        text: 'Image noise appears on CT images as:',
        options: ['Bright rings', 'Uniform density', 'Grainy or speckled pattern', 'Smooth shading'],
        correctAnswer: 'C',
        explanation: 'Noise produces grainy appearance.',
        type: 'MCQ'
      },
      {
        id: 'q18',
        text: 'Which of the following is NOT a common CT artifact mentioned?',
        options: ['Streaks', 'Rings', 'Blurring', 'Aliasing lines'],
        correctAnswer: 'D',
        explanation: 'Aliasing was not listed in the text.',
        type: 'MCQ'
      },
      {
        id: 'q19',
        text: 'The bow-tie filter primarily functions to:',
        options: ['Increase noise', 'Store image data', 'Move the patient', 'Equalize beam intensity'],
        correctAnswer: 'D',
        explanation: 'It equalizes beam intensity and reduces dose.',
        type: 'MCQ'
      },
      {
        id: 'q20',
        text: 'Which collimator reduces scatter radiation reaching the detectors?',
        options: ['Post-patient collimator', 'Pre-patient collimator', 'Bow-tie filter', 'Generator'],
        correctAnswer: 'A',
        explanation: 'Post-patient collimator reduces scatter.',
        type: 'MCQ'
      },
      {
        id: 'q21',
        text: 'The Data Acquisition System (DAS) primarily:',
        options: ['Generates X-rays', 'Displays images', 'Converts analog signals to digital data', 'Moves the table'],
        correctAnswer: 'C',
        explanation: 'DAS digitizes and amplifies signals.',
        type: 'MCQ'
      },
      {
        id: 'q22',
        text: 'Filtered back projection is an example of:',
        options: ['Image display method', 'Detector type', 'Windowing tool', 'Reconstruction algorithm'],
        correctAnswer: 'D',
        explanation: 'It is a traditional reconstruction method.',
        type: 'MCQ'
      },
      {
        id: 'q23',
        text: 'Which reconstruction method is noted for reducing noise and radiation dose?',
        options: ['Iterative reconstruction', 'Filtered back projection', 'Analog reconstruction', 'Manual reconstruction'],
        correctAnswer: 'A',
        explanation: 'Iterative reconstruction reduces noise and dose.',
        type: 'MCQ'
      },
      {
        id: 'q24',
        text: 'Maximum Intensity Projection (MIP) is best for visualizing:',
        options: ['Airways', 'Soft tissue only', 'High-density structures like contrast vessels', 'Fat planes'],
        correctAnswer: 'C',
        explanation: 'MIP highlights high-density structures.',
        type: 'MCQ'
      },
      {
        id: 'q25',
        text: 'Minimum Intensity Projection (MinIP) is particularly useful for:',
        options: ['Bone imaging', 'Contrast vessels', 'Metal implants', 'Airways and low-density areas'],
        correctAnswer: 'D',
        explanation: 'It highlights low-density structures.',
        type: 'MCQ'
      },
      {
        id: 'q26',
        text: 'A wide window width produces:',
        options: ['Low contrast image', 'High contrast image', 'Increased noise', 'Increased spatial resolution'],
        correctAnswer: 'A',
        explanation: 'Wide WW → low contrast.',
        type: 'MCQ'
      },
      {
        id: 'q27',
        text: 'Increasing kVp generally results in:',
        options: [
          'Higher contrast and lower dose',
          'More noise',
          'Greater penetration and lower contrast',
          'Smaller field of view'
        ],
        correctAnswer: 'C',
        explanation: 'Higher kVp increases penetration but lowers contrast.',
        type: 'MCQ'
      },
      {
        id: 'q28',
        text: 'Increasing mA primarily affects:',
        options: ['Spatial resolution', 'Pitch', 'Slice thickness', 'Noise level'],
        correctAnswer: 'D',
        explanation: 'Higher mA reduces noise but increases dose.',
        type: 'MCQ'
      },
      {
        id: 'q29',
        text: 'Thin CT slices (0.5–1.25 mm) typically provide:',
        options: [
          'Better spatial resolution with more noise',
          'Lower spatial resolution',
          'Lower dose only',
          'Poor detail'
        ],
        correctAnswer: 'A',
        explanation: 'Thin slices improve detail but increase noise.',
        type: 'MCQ'
      },
      {
        id: 'q30',
        text: 'Thick CT slices (5–10 mm) generally result in:',
        options: ['Higher noise', 'Increased contrast', 'Lower noise but reduced resolution', 'Higher spatial resolution'],
        correctAnswer: 'C',
        explanation: 'Thick slices reduce noise but reduce detail.',
        type: 'MCQ'
      },
      {
        id: 'q31',
        text: 'Which is NOT listed as a major CT component group?',
        options: ['Imaging system', 'Computer system', 'Display system', 'Magnetic system'],
        correctAnswer: 'D',
        explanation: 'Magnetic system is not part of CT components.',
        type: 'MCQ'
      },
      {
        id: 'q32',
        text: 'The patient couch in CT should be:',
        options: ['Metallic', 'Radiopaque', 'Radiolucent and stable', 'Flexible'],
        correctAnswer: 'C',
        explanation: 'Couch must be radiolucent and precisely controlled.',
        type: 'MCQ'
      },
      {
        id: 'q33',
        text: 'Which parameter combination forms mAs?',
        options: ['kVp × time', 'Pitch × time', 'kVp × mA', 'mA × time'],
        correctAnswer: 'D',
        explanation: 'mAs = mA × time.',
        type: 'MCQ'
      },
      {
        id: 'q34',
        text: 'One major clinical application of CT is:',
        options: ['Detection of tumors and metastasis', 'Measuring blood pressure', 'Hearing assessment', 'ECG monitoring'],
        correctAnswer: 'A',
        explanation: 'CT is widely used for tumor detection.',
        type: 'MCQ'
      },
      {
        id: 'q35',
        text: 'CT is useful in radiotherapy primarily for:',
        options: [
          'Dose calculation and planning',
          'Increasing beam energy',
          'Patient sedation',
          'Contrast injection'
        ],
        correctAnswer: 'A',
        explanation: 'CT images are used for radiotherapy planning.',
        type: 'MCQ'
      },
      {
        id: 'q36',
        text: 'Proper patient centering in CT is achieved using:',
        options: ['Detector calibration', 'Windowing', 'Laser positioning lights', 'Pitch adjustment'],
        correctAnswer: 'C',
        explanation: 'Lasers help horizontal and vertical centering.',
        type: 'MCQ'
      },
      {
        id: 'q37',
        text: 'Motion reduction in CT mainly aims to:',
        options: ['Increase HU values', 'Reduce kVp', 'Increase slice thickness', 'Prevent image blurring'],
        correctAnswer: 'D',
        explanation: 'Motion causes blur and artifacts.',
        type: 'MCQ'
      },
      {
        id: 'q38',
        text: 'SFOV primarily determines the:',
        options: ['Region of the body scanned', 'Image reconstruction diameter', 'Pixel size only', 'Detector width'],
        correctAnswer: 'A',
        explanation: 'SFOV defines scanned body region.',
        type: 'MCQ'
      },
      {
        id: 'q39',
        text: 'DFOV refers to the:',
        options: ['Scan length', 'Pitch value', 'Image reconstruction diameter', 'Table speed'],
        correctAnswer: 'C',
        explanation: 'DFOV is the reconstructed image diameter.',
        type: 'MCQ'
      },
      {
        id: 'q40',
        text: 'Modern CT scanners continue to evolve mainly through advances in:',
        options: ['Film processing', 'Darkroom techniques', 'Manual reconstruction', 'Artificial intelligence and machine learning'],
        correctAnswer: 'D',
        explanation: 'The notes highlight AI and machine learning advancements.',
        type: 'MCQ'
      }
    ]
  },
  {
    id: 'ct-in-radiotherapy',
    title: 'Application of CT in Radiotherapy',
    description: 'Explore how CT simulation, CBCT, and 4D CT are used in modern radiation oncology.',
    questions: [
      {
        id: 'r1',
        text: 'The primary reason CT is essential in radiotherapy is that it:',
        options: [
          'Provides anatomical detail needed for accurate tumor targeting',
          'Replaces all other imaging modalities',
          'Eliminated the need for immobilization devices',
          'Reduces treatment time to zero'
        ],
        correctAnswer: 'A',
        explanation: 'CT provides the anatomical information required for precise tumor localization and treatment planning.',
        type: 'MCQ'
      },
      {
        id: 'r2',
        text: 'Which type of CT is acquired directly on the treatment machine for image-guided radiotherapy?',
        options: ['Simulation CT', 'Conventional diagnostic CT', 'Cone-Beam CT', 'Spiral CT'],
        correctAnswer: 'C',
        explanation: 'Cone-Beam CT is performed on the LINAC for daily setup verification in IGRT.',
        type: 'MCQ'
      },
      {
        id: 'r3',
        text: 'A major advantage of CT simulation over conventional CT is:',
        options: [
          'It produces functional images',
          'It uses no radiation',
          'It replaces the Treatment Planning System',
          'It reproduces the treatment position'
        ],
        correctAnswer: 'D',
        explanation: 'CT simulators are designed with flat couches, lasers, and immobilization support to mimic treatment setup.',
        type: 'MCQ'
      },
      {
        id: 'r4',
        text: 'In CT-based treatment planning, Hounsfield Units are primarily used to:',
        options: ['Estimate tissue electron density', 'Measure patient weight', 'Control gantry rotation', 'Determine breathing rate'],
        correctAnswer: 'A',
        explanation: 'HU values are converted to electron density for accurate dose calculation.',
        type: 'MCQ'
      },
      {
        id: 'r5',
        text: 'Which situation most strongly indicates the need for 4D CT?',
        options: ['Brain tumor with no motion', 'Wrist fracture imaging', 'Lung tumor affected by respiration', 'Dental assessment'],
        correctAnswer: 'C',
        explanation: '4D CT is used when tumor motion (especially respiratory motion) affects targeting accuracy.',
        type: 'MCQ'
      },
      {
        id: 'r6',
        text: 'During IGRT, daily CT imaging primarily helps to:',
        options: ['Increase tumor size', 'Replace treatment planning', 'Eliminate the need for immobilization', 'Detect and correct patient positioning errors'],
        correctAnswer: 'D',
        explanation: 'IGRT compares daily images with planning CT to correct setup errors.',
        type: 'MCQ'
      },
      {
        id: 'r7',
        text: 'One key limitation of CT in radiotherapy is:',
        options: [
          'Poor soft tissue contrast compared with MRI',
          'Lack of compatibility with TPS',
          'Inability to produce 3D images',
          'Extremely slow acquisition time'
        ],
        correctAnswer: 'A',
        explanation: 'CT has lower soft tissue contrast than MRI, which is why fusion imaging is often used.',
        type: 'MCQ'
      },
      {
        id: 'r8',
        text: 'Fusion of CT with PET primarily improves:',
        options: ['Gantry rotation speed', 'Detector efficiency', 'Visualization of metabolic activity', 'Table movement'],
        correctAnswer: 'C',
        explanation: 'PET provides metabolic information that complements CT anatomical detail.',
        type: 'MCQ'
      },
      {
        id: 'r9',
        text: 'CT simulation images form the foundation for radiotherapy treatment planning.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Planning CT acquired in treatment position is the basis for TPS planning.',
        type: 'TF'
      },
      {
        id: 'r10',
        text: 'Cone-Beam CT is mainly used for initial cancer staging.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'CBCT is primarily used for treatment verification and IGRT, not staging.',
        type: 'TF'
      },
      {
        id: 'r11',
        text: 'Motion artifacts in CT can reduce targeting accuracy in radiotherapy.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Respiratory motion can blur images and affect contouring accuracy.',
        type: 'TF'
      },
      {
        id: 'r12',
        text: 'One advantage of CT in radiotherapy is its ability to provide quantitative density information.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'CT provides numerical HU values used for dose calculation.',
        type: 'TF'
      },
      {
        id: 'r13',
        text: 'Adaptive radiotherapy may be required if repeated CT imaging shows significant anatomical changes.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Changes like tumor shrinkage or weight loss may require re-planning.',
        type: 'TF'
      },
      {
        id: 'r14',
        text: 'CT is superior to MRI for soft tissue differentiation in all clinical situations.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'MRI generally provides better soft tissue contrast.',
        type: 'TF'
      },
      {
        id: 'r15',
        text: 'Which of the following is NOT a purpose of CT simulation in radiotherapy?',
        options: [
          'Replace radiation therapy completely',
          'Acquire images in treatment position',
          'Enhance reproducibility with immobilization',
          'Allow use of contrast agents for tumor visualization'
        ],
        correctAnswer: 'A',
        explanation: 'CT simulation aids planning but does not replace radiotherapy itself.',
        type: 'MCQ'
      },
      {
        id: 'r16',
        text: 'The key difference between a CT simulator and a conventional CT is:',
        options: [
          'CT simulator produces lower resolution images',
          'Conventional CT uses flat couches',
          'Conventional CT provides motion management',
          'CT simulator integrates with Treatment Planning System'
        ],
        correctAnswer: 'D',
        explanation: 'CT simulators send images to TPS and include lasers and immobilization devices.',
        type: 'MCQ'
      },
      {
        id: 'r17',
        text: 'In radiotherapy, the Planning Target Volume (PTV) is:',
        options: [
          'Tumor volume plus margin for uncertainties',
          'The exact tumor volume without margin',
          'Only the surrounding healthy tissue',
          'Volume covered by immobilization devices'
        ],
        correctAnswer: 'A',
        explanation: 'PTV accounts for tumor and setup uncertainties.',
        type: 'MCQ'
      },
      {
        id: 'r18',
        text: 'Electron density derived from CT HU values is crucial for:',
        options: ['Patient positioning', 'Monitoring tumor shrinkage', 'Dose calculation in TPS', 'Contrast injection timing'],
        correctAnswer: 'C',
        explanation: 'Tissue density affects radiation absorption; HU helps TPS calculate dose.',
        type: 'MCQ'
      },
      {
        id: 'r19',
        text: 'Which is a limitation of CT in radiotherapy?',
        options: ['High spatial resolution', 'Fast acquisition', 'Compatibility with TPS', 'Poor soft tissue differentiation'],
        correctAnswer: 'D',
        explanation: 'CT is less effective than MRI for soft tissue contrast.',
        type: 'MCQ'
      },
      {
        id: 'r20',
        text: 'Daily CBCT in IGRT helps detect:',
        options: ['Positional errors and internal organ motion', 'Tissue density changes only', 'Radiation dose limits', 'Tumor histology'],
        correctAnswer: 'A',
        explanation: 'CBCT detects setup errors and internal organ changes.',
        type: 'MCQ'
      },
      {
        id: 'r21',
        text: 'A 4D CT scan adds which dimension to standard 3D CT?',
        options: ['Electrical conductivity', 'Color', 'Time', 'Temperature'],
        correctAnswer: 'C',
        explanation: '4D CT accounts for motion over the respiratory cycle.',
        type: 'MCQ'
      },
      {
        id: 'r22',
        text: 'The main role of fusion CT (CT+MRI or CT+PET) is:',
        options: [
          'Reduce scan time',
          'Replace the TPS',
          'Reduce contrast use',
          'Combine anatomical and functional information for better planning'
        ],
        correctAnswer: 'D',
        explanation: 'Fusion imaging improves tumor delineation and treatment accuracy.',
        type: 'MCQ'
      },
      {
        id: 'r23',
        text: 'Which is true regarding motion management in radiotherapy?',
        options: [
          '4D CT can help track tumor motion over breathing cycles',
          'Motion is ignored in standard TPS planning',
          'Motion management only applies to head and neck cancers',
          'CBCT cannot help with motion management'
        ],
        correctAnswer: 'A',
        explanation: '4D CT captures tumor movement for accurate targeting.',
        type: 'MCQ'
      },
      {
        id: 'r24',
        text: 'Which statement is correct about IGRT?',
        options: [
          'Uses pre-treatment imaging to align patient accurately',
          'Requires no immobilization',
          'Replaces CT simulation',
          'Does not account for breathing motion'
        ],
        correctAnswer: 'A',
        explanation: 'IGRT verifies and corrects patient positioning using imaging.',
        type: 'MCQ'
      },
      {
        id: 'r25',
        text: 'Adaptive radiotherapy may be required if:',
        options: [
          'Uses pre-treatment imaging to align patient accurately',
          'Tumor shrinks or patient anatomy changes during treatment',
          'CBCT is unavailable',
          'Immobilization devices are uncomfortable'
        ],
        correctAnswer: 'A',
        explanation: 'Changes in anatomy can alter dose distribution; plans may need adjustment.',
        type: 'MCQ'
      },
      {
        id: 'r26',
        text: 'The primary benefit of using contrast agents in CT simulation is:',
        options: [
          'Increase scan speed',
          'Reduce radiation exposure',
          'Replace MRI',
          'Enhance visualization of tumors and blood vessels'
        ],
        correctAnswer: 'D',
        explanation: 'Contrast helps distinguish tumors and vessels for planning.',
        type: 'MCQ'
      },
      {
        id: 'r27',
        text: 'Which statement about LINAC with IGRT is TRUE?',
        options: [
          'It allows real-time tumor position verification',
          'It cannot use CBCT',
          'It replaces the need for simulation CT',
          'It eliminates radiation exposure'
        ],
        correctAnswer: 'A',
        explanation: 'IGRT-equipped LINAC uses imaging to verify patient setup and tumor position.',
        type: 'MCQ'
      },
      {
        id: 'r28',
        text: 'A primary advantage of 4D CT over conventional CT is:',
        options: ['Lower radiation dose', 'Better bone visualization', 'Tracks tumor motion over time', 'Faster scan acquisition'],
        correctAnswer: 'C',
        explanation: '4D CT accounts for respiratory-induced tumor movement.',
        type: 'MCQ'
      },
      {
        id: 'r29',
        text: 'The dose-volume histogram (DVH) is used in radiotherapy to:',
        options: [
          'Measure radiation dose in specific structures',
          'Determine tumor histology',
          'Measure contrast enhancement',
          'Track patient movement'
        ],
        correctAnswer: 'A',
        explanation: 'DVH graphs dose distribution to tumors and organs at risk.',
        type: 'MCQ'
      },
      {
        id: 'r30',
        text: 'Which modality provides the best soft tissue contrast when fused with CT?',
        options: ['PET', 'Conventional X-ray', 'Ultrasound', 'MRI'],
        correctAnswer: 'D',
        explanation: 'MRI offers superior soft tissue contrast compared with CT.',
        type: 'MCQ'
      },
      {
        id: 'r31',
        text: 'Monte Carlo and Pencil Beam algorithms are used in TPS to:',
        options: ['Calculate radiation dose distribution', 'Reconstruct CT images', 'Control patient movement', 'Visualize organ motion'],
        correctAnswer: 'A',
        explanation: 'These algorithms use CT-derived tissue density for precise dose calculations.',
        type: 'MCQ'
      },
      {
        id: 'r32',
        text: 'Which scenario best justifies the use of fusion CT in radiotherapy?',
        options: [
          'Imaging a fractured wrist',
          'Standard head CT for trauma',
          'Planning treatment for prostate tumor with nearby critical structures',
          'Lung nodule assessment without radiation therapy'
        ],
        correctAnswer: 'C',
        explanation: 'Fusion CT enhances target delineation in complex anatomical areas.',
        type: 'MCQ'
      },
      {
        id: 'r33',
        text: 'A benefit of CT in radiotherapy is:',
        options: [
          'It is radiation-free',
          'It eliminates motion artifacts',
          'Replaces MRI',
          'Provides quantitative tissue density for dose calculation'
        ],
        correctAnswer: 'D',
        explanation: 'CT HU values allow precise dose planning based on tissue densities.',
        type: 'MCQ'
      },
      {
        id: 'r34',
        text: 'One challenge with repeated CBCT imaging is:',
        options: ['Increased cumulative radiation dose', 'Poor tumor localization', 'Inaccurate TPS calculations', 'Loss of immobilization'],
        correctAnswer: 'A',
        explanation: 'Frequent imaging increases patient radiation exposure.',
        type: 'MCQ'
      },
      {
        id: 'r35',
        text: 'The term "OAR" in radiotherapy refers to:',
        options: ['Optimized Acquisition Rate', 'Overall Activity Range', 'Organs At Risk', 'Output Adjustment Ratio'],
        correctAnswer: 'C',
        explanation: 'OARs are healthy structures to be spared during radiation.',
        type: 'MCQ'
      },
      {
        id: 'r36',
        text: 'Fusion CT can reduce radiation exposure to normal tissues.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Fusion CT helps in better target delineation, potentially sparing normal tissues.',
        type: 'TF'
      },
      {
        id: 'r37',
        text: '4D CT is only useful for liver and brain tumors.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'It’s also useful for lung and abdominal tumors with motion.',
        type: 'TF'
      },
      {
        id: 'r38',
        text: 'IGRT may use either manual or automatic image registration to correct patient positioning.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Both manual and automatic registration techniques are used in IGRT.',
        type: 'TF'
      },
      {
        id: 'r39',
        text: 'Adaptive radiotherapy is unnecessary if a tumor shrinks during treatment.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Tumor shrinkage often necessitates re-planning to ensure accurate dose delivery.',
        type: 'TF'
      },
      {
        id: 'r40',
        text: 'High spatial resolution of CT images is advantageous for accurate tumor delineation.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Better resolution allows for more precise identification of tumor boundaries.',
        type: 'TF'
      }
    ]
  },
  {
    id: 'ct-abdomen-pelvis',
    title: 'SECTIONAL ANATOMY: ABDOMEN & PELVIS',
    description: 'Master the sectional anatomy of the abdomen and pelvis as seen on CT scans.',
    questions: [
      {
        id: 'ap1',
        text: 'Which structure forms the superior boundary of the abdominal cavity?',
        options: ['Diaphragm', 'Sacral promontory', 'Pelvic floor', 'Iliac crest'],
        correctAnswer: 'A',
        explanation: 'The diaphragm separates the thoracic and abdominal cavities.',
        type: 'MCQ'
      },
      {
        id: 'ap2',
        text: 'The peritoneal cavity in males is:',
        options: ['Open to the exterior', 'Communicates with the bladder', 'Part of the retroperitoneum', 'Closed'],
        correctAnswer: 'D',
        explanation: 'In males, the peritoneal cavity is a closed serous cavity.',
        type: 'MCQ'
      },
      {
        id: 'ap3',
        text: 'The greater sac of the peritoneum is located:',
        options: ['Posterior to the stomach', 'Inside the liver', 'Between the anterior abdominal wall and abdominal viscera', 'Within the pelvis'],
        correctAnswer: 'C',
        explanation: 'The greater sac occupies the space between anterior abdominal wall and viscera.',
        type: 'MCQ'
      },
      {
        id: 'ap4',
        text: 'Structures considered retroperitoneal include:',
        options: ['Kidneys, adrenal glands, pancreas', 'Liver, gallbladder, and spleen', 'Stomach and ovaries', 'Small intestines'],
        correctAnswer: 'A',
        explanation: 'Retroperitoneal organs lie posterior to the peritoneum.',
        type: 'MCQ'
      },
      {
        id: 'ap5',
        text: 'Which lobe of the liver is smallest?',
        options: ['Left lobe', 'Right lobe', 'Caudate lobe', 'Quadrate lobe'],
        correctAnswer: 'C',
        explanation: 'The caudate lobe is the smallest, located between the IVC and ligamentum venosum.',
        type: 'MCQ'
      },
      {
        id: 'ap6',
        text: 'The portal vein receives blood from:',
        options: ['Superior mesenteric and splenic veins', 'Inferior vena cava', 'Hepatic veins', 'Renal veins'],
        correctAnswer: 'A',
        explanation: 'Portal vein is formed by the superior mesenteric and splenic veins.',
        type: 'MCQ'
      },
      {
        id: 'ap7',
        text: 'Which part of the gallbladder is continuous with the cystic duct?',
        options: ['Fundus', 'Body', 'Fossa', 'Neck'],
        correctAnswer: 'D',
        explanation: 'The neck leads into the cystic duct and joins the common hepatic duct to form the CBD.',
        type: 'MCQ'
      },
      {
        id: 'ap8',
        text: 'The pancreas is located:',
        options: ['Retroperitoneally, posterior to the stomach', 'Intraperitoneally, anterior to the stomach', 'Within the liver', 'In the pelvic cavity'],
        correctAnswer: 'A',
        explanation: 'The pancreas lies retroperitoneally, posterior to the stomach.',
        type: 'MCQ'
      },
      {
        id: 'ap9',
        text: 'Which vessel is located posterior to the pancreatic head?',
        options: ['Superior mesenteric artery', 'Common bile duct', 'Portal vein', 'Gastroduodenal artery'],
        correctAnswer: 'C',
        explanation: 'The portal vein runs posterior to the pancreatic head.',
        type: 'MCQ'
      },
      {
        id: 'ap10',
        text: 'The spleen receives arterial blood from:',
        options: ['Hepatic artery', 'Superior mesenteric artery', 'Renal artery', 'Splenic artery'],
        correctAnswer: 'D',
        explanation: 'The splenic artery supplies the spleen, entering at the splenic hilum.',
        type: 'MCQ'
      },
      {
        id: 'ap11',
        text: 'Which adrenal vein drains directly into the IVC?',
        options: ['Right adrenal vein', 'Left adrenal vein', 'Both', 'Neither'],
        correctAnswer: 'A',
        explanation: 'Right adrenal vein drains directly into the IVC; left drains via renal vein.',
        type: 'MCQ'
      },
      {
        id: 'ap12',
        text: 'The renal pelvis is:',
        options: ['Part of the kidney cortex', 'A minor calyx', 'The largest portion of the collecting system', 'Continuous with the urethra'],
        correctAnswer: 'C',
        explanation: 'The renal pelvis collects urine from major calyces and continues as the ureter.',
        type: 'MCQ'
      },
      {
        id: 'ap13',
        text: 'The abdominal aorta bifurcates at approximately:',
        options: ['T12', 'L2', 'S1', 'L4'],
        correctAnswer: 'D',
        explanation: 'The abdominal aorta divides into right and left common iliac arteries at L4.',
        type: 'MCQ'
      },
      {
        id: 'ap14',
        text: 'The IVC receives tributaries from:',
        options: ['Hepatic veins', 'Renal veins', 'Right gonadal vein', 'All of the above'],
        correctAnswer: 'D',
        explanation: 'IVC drains blood from multiple abdominal and pelvic structures.',
        type: 'MCQ'
      },
      {
        id: 'ap15',
        text: 'The female urethra is approximately:',
        options: ['3-4 cm', '18-20 cm', '10-12 cm', '6-8 cm'],
        correctAnswer: 'A',
        explanation: 'Female urethra is short, 3-4 cm, draining urine from the bladder.',
        type: 'MCQ'
      },
      {
        id: 'ap16',
        text: 'Which uterine layer is the muscular thickest layer?',
        options: ['Endometrium', 'Perimetrium', 'Epimetrium', 'Myometrium'],
        correctAnswer: 'D',
        explanation: 'The myometrium is the muscular, thickest part of the uterine wall.',
        type: 'MCQ'
      },
      {
        id: 'ap17',
        text: 'The ovarian ligament connects:',
        options: ['Ovary to uterine wall', 'Ovary to pelvic wall', 'Ovary to kidney', 'Ovary to peritoneum'],
        correctAnswer: 'A',
        explanation: 'Ovarian ligament attaches the inferior aspect of ovary to uterus.',
        type: 'MCQ'
      },
      {
        id: 'ap18',
        text: 'The suspensory ligament of the ovary contains:',
        options: ['Uterine vessels', 'Ureter', 'Ovarian vessels', 'Fallopian tubes'],
        correctAnswer: 'C',
        explanation: 'The suspensory ligament attaches the superior ovary to lateral pelvic wall and contains ovarian vessels.',
        type: 'MCQ'
      },
      {
        id: 'ap19',
        text: 'On a CT scan, a patient’s liver shows a lesion in segment IV. This segment belongs to:',
        options: ['Right lobe lateral section', 'Caudate lobe', 'Right lobe posterior section', 'Left lobe medial section'],
        correctAnswer: 'D',
        explanation: 'Segment IV corresponds to the medial section of the left lobe (Couinaud classification).',
        type: 'MCQ'
      },
      {
        id: 'ap20',
        text: 'The caudate lobe of the liver is supplied only by the right portal vein.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'The caudate lobe receives branches from both right and left portal veins.',
        type: 'TF'
      },
      {
        id: 'ap21',
        text: 'A patient has a blockage in the cystic duct. Where is bile primarily accumulating?',
        options: ['Gallbladder', 'Common bile duct', 'Left hepatic duct', 'Pancreatic duct'],
        correctAnswer: 'A',
        explanation: 'Bile will accumulate in the gallbladder since the cystic duct drains it.',
        type: 'MCQ'
      },
      {
        id: 'ap22',
        text: 'During surgery, a retroperitoneal mass is found anterior to the aorta, posterior to the peritoneum. Which organs could be involved?',
        options: ['Stomach and spleen', 'Liver and gallbladder', 'Kidneys, pancreas, adrenal glands', 'Ovaries and uterus'],
        correctAnswer: 'C',
        explanation: 'Retroperitoneal structures include kidneys, pancreas, adrenal glands.',
        type: 'MCQ'
      },
      {
        id: 'ap23',
        text: 'The right kidney is usually lower than the left kidney due to the liver.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'The liver displaces the right kidney inferiorly.',
        type: 'TF'
      },
      {
        id: 'ap24',
        text: 'A patient has a pancreatic head tumor compressing a vessel posteriorly. Which vessel is likely affected?',
        options: ['Common bile duct', 'Superior mesenteric artery', 'Splenic vein', 'Portal vein'],
        correctAnswer: 'D',
        explanation: 'The portal vein lies posterior to the pancreatic head and can be compressed by tumors.',
        type: 'MCQ'
      },
      {
        id: 'ap25',
        text: 'On CT, the spleen appears heterogeneous immediately after contrast injection. What is the most likely explanation?',
        options: ['Normal early arterial phase enhancement', 'Hemorrhage', 'Infarction', 'Cystic lesion'],
        correctAnswer: 'A',
        explanation: 'Early arterial phase of contrast can make spleen appear heterogeneous temporarily.',
        type: 'MCQ'
      },
      {
        id: 'ap26',
        text: 'The peritoneum covers the bladder completely.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Only the superior surface of the bladder is covered by peritoneum.',
        type: 'TF'
      },
      {
        id: 'ap27',
        text: 'Which structure passes through the urogenital diaphragm?',
        options: ['Ureter', 'Portal vein', 'Male urethra', 'Pancreatic duct'],
        correctAnswer: 'C',
        explanation: 'The urethra passes through the urogenital diaphragm containing the external sphincter.',
        type: 'MCQ'
      },
      {
        id: 'ap28',
        text: 'A CT shows a mass located superior to the kidney, triangular in shape, adjacent to the aorta. Which organ is this most likely?',
        options: ['Pancreas', 'Kidney cortex', 'Spleen', 'Left adrenal gland'],
        correctAnswer: 'D',
        explanation: 'The left adrenal gland is retroperitoneal, triangular, and superior to the kidney.',
        type: 'MCQ'
      },
      {
        id: 'ap29',
        text: 'The female peritoneal cavity communicates with the exterior via uterine tubes, uterus, and vagina.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Unlike males, females have an open peritoneal cavity via reproductive organs.',
        type: 'TF'
      },
      {
        id: 'ap30',
        text: 'In a patient with partial hepatectomy, which liver segments would be removed if the surgeon targets the right lobe posterior section?',
        options: ['II, III', 'V, VI', 'I, IV', 'VII, VIII'],
        correctAnswer: 'D',
        explanation: 'Right lobe posterior section corresponds to segments VII and VIII.',
        type: 'MCQ'
      },
      {
        id: 'ap31',
        text: 'Scenario: A patient has obstruction of the left ureter. Which structure is directly affected?',
        options: ['Minor calyces', 'Renal pelvis', 'Bladder', 'All of the above'],
        correctAnswer: 'D',
        explanation: 'Obstruction affects urine flow from minor calyces → major calyces → renal pelvis → ureter → bladder.',
        type: 'MCQ'
      },
      {
        id: 'ap32',
        text: 'The main pancreatic duct (duct of Wirsung) joins which structure at the ampulla of Vater?',
        options: ['Common bile duct', 'Hepatic artery', 'Portal vein', 'Superior mesenteric vein'],
        correctAnswer: 'A',
        explanation: 'The pancreatic duct joins the CBD at the ampulla of Vater.',
        type: 'MCQ'
      },
      {
        id: 'ap33',
        text: 'The urinary bladder’s internal urethral sphincter provides voluntary control over urination.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'The internal sphincter is involuntary; the external urethral sphincter allows voluntary control.',
        type: 'TF'
      },
      {
        id: 'ap34',
        text: 'During imaging, the superior mesenteric vein joins the splenic vein to form:',
        options: ['Inferior vena cava', 'Renal vein', 'Portal vein', 'Common iliac vein'],
        correctAnswer: 'C',
        explanation: 'The portal vein is formed by the confluence of the superior mesenteric and splenic veins.',
        type: 'MCQ'
      },
      {
        id: 'ap35',
        text: 'Which ligament anchors the liver to the diaphragm?',
        options: ['Falciform ligament', 'Gastrosplenic ligament', 'Hepatoduodenal ligament', 'Coronary and triangular ligaments'],
        correctAnswer: 'D',
        explanation: 'Coronary and triangular ligaments attach liver to diaphragm.',
        type: 'MCQ'
      },
      {
        id: 'ap36',
        text: 'Scenario: A patient presents with obstruction of the prostatic urethra. Which gender is affected and why?',
        options: ['Male, because the urethra passes through prostate', 'Female, due to short urethra', 'Both, because all urethras pass through similar structures', 'Neither'],
        correctAnswer: 'A',
        explanation: 'Only males have a prostatic urethra passing through the prostate.',
        type: 'MCQ'
      },
      {
        id: 'ap37',
        text: 'The liver is entirely covered by peritoneum.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'The bare area, gallbladder fossa, and IVC surface are not covered by peritoneum.',
        type: 'TF'
      },
      {
        id: 'ap38',
        text: 'On CT, a lesion in the posterior superior liver section affects which segments?',
        options: ['II and III', 'I and IV', 'VII and VIII', 'V and VI'],
        correctAnswer: 'C',
        explanation: 'Posterior superior section corresponds to right lobe posterior segments VII and VIII.',
        type: 'MCQ'
      },
      {
        id: 'ap39',
        text: 'Scenario: A patient with obstructed right adrenal vein shows dilatation of which structure?',
        options: ['Inferior vena cava', 'Right renal vein', 'Portal vein', 'Both A and B'],
        correctAnswer: 'D',
        explanation: 'The right adrenal vein drains directly into the IVC, which can back up into the renal vein.',
        type: 'MCQ'
      },
      {
        id: 'ap40',
        text: 'The abdominal aorta gives rise to both paired and unpaired branches supplying abdominal organs.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Paired branches include renal, gonadal arteries; unpaired include celiac trunk, SMA, IMA.',
        type: 'TF'
      }
    ]
  },
  {
    id: 'ct-thorax-spine',
    title: 'CT THORAX & LUMBOSACRAL SPINE',
    description: 'Detailed anatomy and evaluation of the thorax and lumbosacral spine on CT.',
    questions: [
      {
        id: 'ts1',
        text: 'The thoracic cavity is divided into how many compartments?',
        options: ['Three', 'Two', 'Four', 'Five'],
        correctAnswer: 'A',
        explanation: 'The thoracic cavity is divided into two lateral pleural cavities and a central mediastinum.',
        type: 'MCQ'
      },
      {
        id: 'ts2',
        text: 'Which structure is NOT found in the mediastinum?',
        options: ['Heart', 'Great vessels', 'Lungs', 'Thymus'],
        correctAnswer: 'C',
        explanation: 'The lungs occupy the pleural cavities, not the mediastinum.',
        type: 'MCQ'
      },
      {
        id: 'ts3',
        text: 'The trachea bifurcates into the right and left main bronchi at the level of:',
        options: ['C6', 'T10', 'L1', 'T4-T5'],
        correctAnswer: 'D',
        explanation: 'The carina, where the trachea bifurcates, is at the level of T4-T5.',
        type: 'MCQ'
      },
      {
        id: 'ts4',
        text: 'Which lung has three lobes?',
        options: ['Right lung', 'Left lung', 'Both', 'Neither'],
        correctAnswer: 'A',
        explanation: 'The right lung has superior, middle, and inferior lobes.',
        type: 'MCQ'
      },
      {
        id: 'ts5',
        text: 'The pulmonary trunk bifurcates into right and left pulmonary arteries at the level of:',
        options: ['T2', 'T6', 'T4', 'T8'],
        correctAnswer: 'C',
        explanation: 'The pulmonary trunk bifurcates at the level of T4, just below the aortic arch.',
        type: 'MCQ'
      },
      {
        id: 'ts6',
        text: 'The esophagus is located ________ to the trachea in the upper thorax.',
        options: ['Anterior', 'Lateral', 'Superior', 'Posterior'],
        correctAnswer: 'D',
        explanation: 'The esophagus lies posterior to the trachea.',
        type: 'MCQ'
      },
      {
        id: 'ts7',
        text: 'The azygos vein typically drains into the:',
        options: ['Superior vena cava', 'Inferior vena cava', 'Left brachiocephalic vein', 'Hemiazygos vein'],
        correctAnswer: 'A',
        explanation: 'The azygos vein arches over the right main bronchus to drain into the SVC.',
        type: 'MCQ'
      },
      {
        id: 'ts8',
        text: 'How many vertebrae typically make up the lumbar spine?',
        options: ['5', '7', '12', '4'],
        correctAnswer: 'A',
        explanation: 'There are typically 5 lumbar vertebrae (L1-L5).',
        type: 'MCQ'
      },
      {
        id: 'ts9',
        text: 'The spinal cord typically ends at the level of:',
        options: ['T12-L1', 'L3-L4', 'S1-S2', 'L5-S1'],
        correctAnswer: 'A',
        explanation: 'In adults, the conus medullaris (end of spinal cord) is usually at T12-L1 or L1-L2.',
        type: 'MCQ'
      },
      {
        id: 'ts10',
        text: 'The intervertebral disc consists of an outer ________ and an inner ________.',
        options: ['Annulus fibrosus, nucleus pulposus', 'Nucleus pulposus, annulus fibrosus', 'Cortex, medulla', 'Ligament, tendon'],
        correctAnswer: 'A',
        explanation: 'The annulus fibrosus is the tough outer ring; the nucleus pulposus is the gelatinous center.',
        type: 'MCQ'
      },
      {
        id: 'ts11',
        text: 'The "Scottie Dog" appearance on oblique lumbar spine imaging is formed by parts of the:',
        options: ['Vertebral body', 'Spinous process', 'Transverse process', 'Lamina and pedicle'],
        correctAnswer: 'D',
        explanation: 'The Scottie Dog is formed by the pedicle, pars interarticularis, and articular processes.',
        type: 'MCQ'
      },
      {
        id: 'ts12',
        text: 'The ligamentum flavum connects the:',
        options: ['Vertebral bodies', 'Spinous processes', 'Laminae of adjacent vertebrae', 'Transverse processes'],
        correctAnswer: 'C',
        explanation: 'Ligamentum flavum connects the laminae and helps maintain upright posture.',
        type: 'MCQ'
      },
      {
        id: 'ts13',
        text: 'The exit point for spinal nerves is the:',
        options: ['Intervertebral foramen', 'Vertebral foramen', 'Transverse foramen', 'Sacral hiatus'],
        correctAnswer: 'A',
        explanation: 'Spinal nerves exit the vertebral column through the intervertebral foramina.',
        type: 'MCQ'
      },
      {
        id: 'ts14',
        text: 'The sacrum is formed by the fusion of how many vertebrae?',
        options: ['3', '4', '6', '5'],
        correctAnswer: 'D',
        explanation: 'The sacrum is typically formed by the fusion of 5 sacral vertebrae.',
        type: 'MCQ'
      },
      {
        id: 'ts15',
        text: 'The aortic arch begins and ends at the level of the sternal angle.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'The aortic arch starts and ends at the level of T4-T5 (sternal angle).',
        type: 'TF'
      },
      {
        id: 'ts16',
        text: 'The right pulmonary artery is longer than the left pulmonary artery.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'The right pulmonary artery must travel further to reach the right lung, passing posterior to the SVC.',
        type: 'TF'
      },
      {
        id: 'ts17',
        text: 'The psoas muscles are located ________ to the lumbar vertebrae.',
        options: ['Lateral', 'Anterior', 'Posterior', 'Superior'],
        correctAnswer: 'A',
        explanation: 'The psoas major muscles lie lateral to the lumbar vertebral bodies.',
        type: 'MCQ'
      },
      {
        id: 'ts18',
        text: 'Which structure is the most anterior in the superior mediastinum?',
        options: ['Esophagus', 'Trachea', 'Aorta', 'Thymus'],
        correctAnswer: 'D',
        explanation: 'The thymus (or its remnant) is the most anterior structure in the superior mediastinum.',
        type: 'MCQ'
      },
      {
        id: 'ts19',
        text: 'The cauda equina is located within the subarachnoid space below the level of L2.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'The cauda equina is the collection of nerve roots below the conus medullaris.',
        type: 'TF'
      },
      {
        id: 'ts20',
        text: 'The internal carotid arteries supply the thoracic organs.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Internal carotid arteries supply the brain; thoracic organs are supplied by branches of the thoracic aorta.',
        type: 'TF'
      }
    ]
  },
  {
    id: 'ct-pattern-recognition',
    title: 'CHEST & LUMBOSACRAL SPINE PATTERN RECOGNITION',
    description: 'Learn to identify common pathological patterns on CT scans of the chest and spine.',
    questions: [
      {
        id: 'pr1',
        text: 'A "ground-glass opacity" on chest CT is characterized by:',
        options: ['Hazy increase in lung density with preserved vessel outlines', 'Complete obscuration of underlying vessels', 'Solid mass formation', 'Air-filled cavities'],
        correctAnswer: 'A',
        explanation: 'Ground-glass opacity is a hazy increase in density that does not obscure underlying bronchovascular structures.',
        type: 'MCQ'
      },
      {
        id: 'pr2',
        text: 'The "tree-in-bud" pattern is most suggestive of:',
        options: ['Pulmonary embolism', 'Lung cancer', 'Small airway inflammation/infection', 'Heart failure'],
        correctAnswer: 'C',
        explanation: 'Tree-in-bud pattern represents impaction of small airways with mucus, pus, or fluid.',
        type: 'MCQ'
      },
      {
        id: 'pr3',
        text: '"Honeycombing" on high-resolution CT (HRCT) is a hallmark of:',
        options: ['Acute pneumonia', 'Asthma', 'Pneumothorax', 'End-stage pulmonary fibrosis'],
        correctAnswer: 'D',
        explanation: 'Honeycombing represents irreversible lung destruction and fibrosis.',
        type: 'MCQ'
      },
      {
        id: 'pr4',
        text: 'A "signet ring sign" in the lung indicates:',
        options: ['Bronchiectasis', 'Normal anatomy', 'Pulmonary nodule', 'Pleural effusion'],
        correctAnswer: 'A',
        explanation: 'The signet ring sign occurs when the bronchus is larger than its accompanying artery, indicating bronchiectasis.',
        type: 'MCQ'
      },
      {
        id: 'pr5',
        text: 'The "halo sign" (a nodule surrounded by ground-glass) is classically associated with:',
        options: ['Invasive aspergillosis', 'Tuberculosis', 'Sarcoidosis', 'Lung collapse'],
        correctAnswer: 'A',
        explanation: 'In immunocompromised patients, the halo sign often represents hemorrhage around a fungal nodule.',
        type: 'MCQ'
      },
      {
        id: 'pr6',
        text: '"Crazy paving" pattern consists of ground-glass opacity with superimposed:',
        options: ['Cavities', 'Large masses', 'Interlobular septal thickening', 'Pleural thickening'],
        correctAnswer: 'C',
        explanation: 'Crazy paving is seen in conditions like alveolar proteinosis and certain infections.',
        type: 'MCQ'
      },
      {
        id: 'pr7',
        text: 'On a spine CT, a "vacuum phenomenon" within a disc space indicates:',
        options: ['Infection', 'Acute fracture', 'Malignancy', 'Degenerative disc disease'],
        correctAnswer: 'D',
        explanation: 'The vacuum phenomenon is gas (mostly nitrogen) within a degenerating disc.',
        type: 'MCQ'
      },
      {
        id: 'pr8',
        text: 'A "Schmorl node" is defined as:',
        options: ['Herniation of disc material into the vertebral body', 'A primary bone tumor', 'A type of spinal fracture', 'Nerve root compression'],
        correctAnswer: 'A',
        explanation: 'Schmorl nodes are common degenerative findings where the disc protrudes through the vertebral endplate.',
        type: 'MCQ'
      },
      {
        id: 'pr9',
        text: 'The "winking owl sign" on a spine radiograph/CT indicates:',
        options: ['Normal facet joint', 'Disc herniation', 'Destruction of a vertebral pedicle', 'Spondylolisthesis'],
        correctAnswer: 'C',
        explanation: 'Loss of a pedicle (often due to metastasis) creates the appearance of an owl missing an eye.',
        type: 'MCQ'
      },
      {
        id: 'pr10',
        text: 'Spondylolysis is a defect in which part of the vertebra?',
        options: ['Vertebral body', 'Spinous process', 'Pars interarticularis', 'Transverse process'],
        correctAnswer: 'C',
        explanation: 'Spondylolysis is a stress fracture or defect in the pars interarticularis.',
        type: 'MCQ'
      },
      {
        id: 'pr11',
        text: '"Bamboo spine" is a classic description for:',
        options: ['Osteoporosis', 'Degenerative spondylosis', 'Spinal stenosis', 'Ankylosing spondylitis'],
        correctAnswer: 'D',
        explanation: 'Extensive syndesmophyte formation in ankylosing spondylitis gives the spine a bamboo-like appearance.',
        type: 'MCQ'
      },
      {
        id: 'pr12',
        text: 'A "centrilobular nodule" is located in the center of the secondary pulmonary lobule.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Centrilobular nodules are related to the small airways or arteries at the center of the lobule.',
        type: 'TF'
      },
      {
        id: 'pr13',
        text: 'Pleural plaques are most commonly associated with exposure to:',
        options: ['Asbestos', 'Silica', 'Coal dust', 'Beryllium'],
        correctAnswer: 'A',
        explanation: 'Calcified or non-calcified pleural plaques are a hallmark of asbestos exposure.',
        type: 'MCQ'
      },
      {
        id: 'pr14',
        text: 'The "split pleura sign" is highly suggestive of:',
        options: ['Pneumothorax', 'Lung cancer', 'Empyema', 'Pulmonary edema'],
        correctAnswer: 'C',
        explanation: 'Enhancement of both visceral and parietal pleura with fluid between them indicates empyema.',
        type: 'MCQ'
      },
      {
        id: 'pr15',
        text: 'An "air bronchogram" occurs when air-filled bronchi are visible against ________ lung.',
        options: ['Normal', 'Hyperinflated', 'Collapsed', 'Consolidated/Fluid-filled'],
        correctAnswer: 'D',
        explanation: 'Air bronchograms indicate that the small airways are patent while the surrounding alveoli are filled with fluid or cells.',
        type: 'MCQ'
      },
      {
        id: 'pr16',
        text: 'The "ivory vertebra" refers to a vertebral body that is:',
        options: ['Markedly sclerotic (dense)', 'Completely destroyed', 'Fractured', 'Displaced anteriorly'],
        correctAnswer: 'A',
        explanation: 'An ivory vertebra is very dense, often due to metastasis (e.g., prostate cancer) or Paget disease.',
        type: 'MCQ'
      },
      {
        id: 'pr17',
        text: 'Modic changes on MRI (and reflected on CT) describe changes in the:',
        options: ['Nerve roots', 'Facet joints', 'Vertebral endplates', 'Spinous processes'],
        correctAnswer: 'C',
        explanation: 'Modic changes are signal/density changes in the endplates related to disc degeneration.',
        type: 'MCQ'
      },
      {
        id: 'pr18',
        text: 'A "wedge fracture" typically involves the posterior element of the vertebra.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Wedge fractures primarily involve the anterior portion of the vertebral body.',
        type: 'TF'
      },
      {
        id: 'pr19',
        text: 'The "feeding vessel sign" is a pulmonary artery leading directly to a nodule, often seen in:',
        options: ['Septic emboli', 'Asthma', 'Bronchitis', 'Pneumothorax'],
        correctAnswer: 'A',
        explanation: 'A vessel leading to a peripheral nodule is common in hematogenous spread of infection or metastasis.',
        type: 'MCQ'
      },
      {
        id: 'pr20',
        text: '"Beading" of the interlobular septa is a common finding in sarcoidosis.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Sarcoidosis often causes nodular (beaded) thickening of the septa due to granulomas.',
        type: 'TF'
      }
    ]
  },
  {
    id: 'ct-protocols-abdomen',
    title: 'CT PROTOCOLS: ABDOMEN, PELVIS & MSK',
    description: 'Guidelines and parameters for scanning the abdomen, pelvis, and musculoskeletal system.',
    questions: [
      {
        id: 'pa1',
        text: 'For a routine CT Abdomen/Pelvis, what is the typical oral contrast volume and timing?',
        options: ['450-900ml, 60-90 minutes before', '100ml, 5 minutes before', '2000ml, 24 hours before', 'No oral contrast is needed'],
        correctAnswer: 'A',
        explanation: 'Adequate bowel opacification usually requires 450-900ml of oral contrast given over 60-90 minutes.',
        type: 'MCQ'
      },
      {
        id: 'pa2',
        text: 'The "portal venous phase" of liver enhancement typically occurs at:',
        options: ['15-20 seconds', '35-40 seconds', '5-10 minutes', '60-70 seconds'],
        correctAnswer: 'D',
        explanation: 'Portal venous phase (maximal liver enhancement) occurs around 60-70 seconds post-injection.',
        type: 'MCQ'
      },
      {
        id: 'pa3',
        text: 'Which phase is best for detecting hypervascular liver lesions like HCC?',
        options: ['Late arterial phase', 'Non-contrast', 'Portal venous phase', 'Excretory phase'],
        correctAnswer: 'A',
        explanation: 'Late arterial phase (35-40s) is crucial for identifying hypervascular tumors.',
        type: 'MCQ'
      },
      {
        id: 'pa4',
        text: 'In CT Urography, the "nephrographic phase" is used to evaluate:',
        options: ['Renal stones', 'Arterial anatomy', 'Renal parenchyma/masses', 'Ureteral filling defects'],
        correctAnswer: 'C',
        explanation: 'The nephrographic phase (80-100s) provides optimal enhancement of the renal parenchyma.',
        type: 'MCQ'
      },
      {
        id: 'pa5',
        text: 'For MSK CT, which reconstruction algorithm is typically preferred for bone detail?',
        options: ['Soft tissue kernel', 'Iterative reconstruction only', 'Standard kernel', 'Bone/Sharp kernel'],
        correctAnswer: 'D',
        explanation: 'A sharp or bone kernel is used to maximize spatial resolution for bony structures.',
        type: 'MCQ'
      },
      {
        id: 'pa6',
        text: 'When scanning for suspected renal calculi (stones), IV contrast is usually:',
        options: ['Not administered', 'Mandatory', 'Administered only in the arterial phase', 'Administered only in the delayed phase'],
        correctAnswer: 'A',
        explanation: 'Non-contrast CT is the gold standard for detecting renal stones as contrast can mask them.',
        type: 'MCQ'
      },
      {
        id: 'pa7',
        text: 'The "Excretory phase" in CT Urography is typically acquired after:',
        options: ['1 minute', '8-10 minutes', '3 minutes', '30 minutes'],
        correctAnswer: 'B',
        explanation: 'Excretory (delayed) phase allows contrast to fill the collecting system and ureters.',
        type: 'MCQ'
      },
      {
        id: 'pa8',
        text: 'For a CT of the Pancreas, which phase is most important for assessing vascular involvement?',
        options: ['Early arterial', 'Portal venous', 'Pancreatic phase (late arterial)', 'Delayed'],
        correctAnswer: 'C',
        explanation: 'The pancreatic phase (35-45s) provides peak enhancement of the pancreas and peripancreatic vessels.',
        type: 'MCQ'
      },
      {
        id: 'pa9',
        text: 'In MSK CT, "Metal Artifact Reduction" (MAR) software is used to:',
        options: ['Increase radiation dose', 'Make bones look softer', 'Speed up the scan', 'Reduce streaks from orthopedic implants'],
        correctAnswer: 'D',
        explanation: 'MAR algorithms help minimize the dark and light streaks caused by metal hardware.',
        type: 'MCQ'
      },
      {
        id: 'pa10',
        text: 'Water can be used as a "negative" oral contrast agent to distend the stomach.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Water provides good distension without obscuring the mucosa or causing artifacts.',
        type: 'TF'
      },
      {
        id: 'pa11',
        text: 'For a CT Cystogram, contrast is usually administered via:',
        options: ['Foley catheter (retrograde)', 'IV injection', 'Oral ingestion', 'Intramuscular injection'],
        correctAnswer: 'A',
        explanation: 'CT Cystography requires retrograde filling of the bladder to check for rupture or leaks.',
        type: 'MCQ'
      },
      {
        id: 'pa12',
        text: 'Which of the following is a contraindication for IV contrast?',
        options: ['History of mild hives', 'Previous appendectomy', 'Severe renal failure (low GFR)', 'Age over 65'],
        correctAnswer: 'C',
        explanation: 'Severe renal impairment increases the risk of contrast-induced nephropathy or NSF.',
        type: 'MCQ'
      },
      {
        id: 'pa13',
        text: 'The "bolus tracking" technique uses a ROI placed in a major vessel to trigger the scan.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Bolus tracking ensures the scan starts when contrast reaches a specific Hounsfield Unit (HU) threshold.',
        type: 'TF'
      },
      {
        id: 'pa14',
        text: 'For a CT of the Hip for fracture, the scan should include:',
        options: ['Only the joint space', 'The entire pelvis', 'The lumbar spine', 'From the iliac crest to the mid-femur'],
        correctAnswer: 'D',
        explanation: 'Adequate coverage is needed to assess the fracture extent and any associated pelvic injuries.',
        type: 'MCQ'
      },
      {
        id: 'pa15',
        text: 'Dual-energy CT (DECT) can be used to differentiate between gout and pseudogout.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'DECT can identify the chemical composition of crystals (uric acid vs. calcium).',
        type: 'TF'
      },
      {
        id: 'pa16',
        text: 'The "equilibrium phase" in liver imaging occurs at approximately:',
        options: ['3-5 minutes', '30 seconds', '70 seconds', '20 minutes'],
        correctAnswer: 'A',
        explanation: 'Equilibrium phase is a delayed phase where contrast has washed out of most structures.',
        type: 'MCQ'
      },
      {
        id: 'pa17',
        text: 'In a CT of the Adrenal glands, "washout" calculations help differentiate:',
        options: ['Cyst from solid mass', 'Infection from inflammation', 'Adenoma from malignancy', 'Left from right gland'],
        correctAnswer: 'C',
        explanation: 'Adenomas typically wash out contrast faster than malignant lesions.',
        type: 'MCQ'
      },
      {
        id: 'pa18',
        text: 'For a CT Enterography, a large volume of neutral oral contrast (e.g., Volumen) is used to distend the:',
        options: ['Stomach', 'Large bowel', 'Esophagus', 'Small bowel'],
        correctAnswer: 'D',
        explanation: 'Enterography focuses on the small bowel loops.',
        type: 'MCQ'
      },
      {
        id: 'pa19',
        text: 'Pitch in CT is defined as the ratio of table feed per rotation to the total beam width.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Pitch affects scan speed, image quality, and patient dose.',
        type: 'TF'
      },
      {
        id: 'pa20',
        text: 'Automated tube current modulation (ATCM) is used to:',
        options: ['Adjust dose based on patient size and attenuation', 'Increase radiation dose', 'Keep the X-ray tube cool', 'Speed up reconstruction'],
        correctAnswer: 'A',
        explanation: 'ATCM reduces dose in thinner areas and increases it in denser areas to maintain image quality.',
        type: 'MCQ'
      }
    ]
  },
  {
    id: 'ct-protocols-neck-thorax',
    title: 'CT PROTOCOLS: NECK, THORAX & MEDIASTINUM',
    description: 'Scanning protocols for the neck and chest regions, including vascular studies.',
    questions: [
      {
        id: 'pn1',
        text: 'For a routine CT Chest, the scan is typically performed during:',
        options: ['Full inspiration (breath-hold)', 'Quiet breathing', 'Full expiration', 'Valsalva maneuver'],
        correctAnswer: 'A',
        explanation: 'Inspiration distends the lungs and improves contrast between air and tissue.',
        type: 'MCQ'
      },
      {
        id: 'pn2',
        text: 'A CT Pulmonary Angiogram (CTPA) is specifically designed to detect:',
        options: ['Lung cancer', 'Pneumonia', 'Aortic aneurysm', 'Pulmonary embolism'],
        correctAnswer: 'D',
        explanation: 'CTPA uses rapid IV injection and precise timing to opacify the pulmonary arteries.',
        type: 'MCQ'
      },
      {
        id: 'pn3',
        text: 'In a CTPA, the ROI for bolus tracking is usually placed in the:',
        options: ['Pulmonary trunk', 'Ascending aorta', 'Left atrium', 'Superior vena cava'],
        correctAnswer: 'A',
        explanation: 'The pulmonary trunk is the target for maximal contrast opacification in CTPA.',
        type: 'MCQ'
      },
      {
        id: 'pn4',
        text: 'For a CT of the Neck, why is the patient often asked to say "E-E-E" during the scan?',
        options: ['To keep them awake', 'To check their hearing', 'To distend the laryngeal vestibule and vocal cords', 'To reduce dental artifacts'],
        correctAnswer: 'C',
        explanation: 'Phonation helps visualize the vocal cords and surrounding structures.',
        type: 'MCQ'
      },
      {
        id: 'pn5',
        text: 'High-Resolution CT (HRCT) of the chest uses:',
        options: ['Thick slices and soft kernel', 'Contrast enhancement only', 'Slow scan speeds', 'Thin slices (1mm) and sharp kernel'],
        correctAnswer: 'D',
        explanation: 'HRCT is designed to see fine lung parenchyma detail using thin sections and high-spatial frequency algorithms.',
        type: 'MCQ'
      },
      {
        id: 'pn6',
        text: 'A "Triple Rule-Out" CT scan evaluates for:',
        options: ['Pneumonia, Cancer, and TB', 'PE, Aortic Dissection, and Coronary Artery Disease', 'Stroke, Heart Attack, and Fracture', 'None of the above'],
        correctAnswer: 'B',
        explanation: 'Triple rule-out is a specialized chest CT for patients with acute chest pain.',
        type: 'MCQ'
      },
      {
        id: 'pn7',
        text: 'For a CT of the Thoracic Aorta (Aortic Dissection), the scan should extend from:',
        options: ['Sternal notch to iliac bifurcation', 'Neck to diaphragm', 'Heart only', 'Lungs only'],
        correctAnswer: 'A',
        explanation: 'Dissections can extend from the arch down into the abdominal aorta and iliacs.',
        type: 'MCQ'
      },
      {
        id: 'pn8',
        text: 'In a CT Neck, the "split-bolus" technique is used to:',
        options: ['Reduce the amount of contrast used', 'Reduce radiation dose', 'Opacify both arteries and veins simultaneously', 'Make the scan faster'],
        correctAnswer: 'C',
        explanation: 'Split-bolus allows visualization of both vascular structures in a single acquisition.',
        type: 'MCQ'
      },
      {
        id: 'pn9',
        text: 'Low-dose CT (LDCT) is the recommended screening tool for:',
        options: ['Breast cancer', 'Colon cancer', 'Thyroid nodules', 'Lung cancer in high-risk smokers'],
        correctAnswer: 'D',
        explanation: 'LDCT reduces radiation risk while effectively detecting early-stage lung nodules.',
        type: 'MCQ'
      },
      {
        id: 'pn10',
        text: 'The "thoracic outlet" is the region where structures pass from the neck into the:',
        options: ['Axilla and arm', 'Abdomen', 'Head', 'Pelvis'],
        correctAnswer: 'A',
        explanation: 'Thoracic outlet syndrome involves compression of nerves or vessels in this region.',
        type: 'MCQ'
      },
      {
        id: 'pn11',
        text: 'For a CT Chest, "windowing" for lungs typically uses a width (WW) of ________ and level (WL) of ________.',
        options: ['WW 400, WL 40', 'WW 80, WL 30', 'WW 1500, WL -600', 'WW 2000, WL 500'],
        correctAnswer: 'C',
        explanation: 'Lung windows require a wide width and low level to see air-filled structures.',
        type: 'MCQ'
      },
      {
        id: 'pn12',
        text: 'The "mediastinal window" is used to evaluate the heart, great vessels, and lymph nodes.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Mediastinal windows (e.g., WW 350, WL 40) optimize soft tissue contrast.',
        type: 'TF'
      },
      {
        id: 'pn13',
        text: 'Saline flush (chaser) after IV contrast injection helps to:',
        options: ['Push the contrast bolus forward and reduce artifacts in the SVC', 'Hydrate the patient', 'Cool the contrast down', 'Dilute the contrast'],
        correctAnswer: 'A',
        explanation: 'Saline clears dense contrast from the subclavian vein and SVC, reducing streak artifacts.',
        type: 'MCQ'
      },
      {
        id: 'pn14',
        text: 'In a CTPA, a "transient interruption of contrast" can be caused by:',
        options: ['The patient holding their breath too long', 'Contrast being too cold', 'Deep inspiration causing un-opacified blood from the IVC to enter the heart', 'The scanner being too slow'],
        correctAnswer: 'C',
        explanation: 'Deep inspiration can draw un-opacified blood from the IVC, diluting the contrast in the pulmonary arteries.',
        type: 'MCQ'
      },
      {
        id: 'pn15',
        text: 'For a CT Neck, the scan range typically goes from the ________ to the ________.',
        options: ['Vertex, C7', 'Chin, diaphragm', 'Nose, heart', 'External auditory meatus, sternal notch'],
        correctAnswer: 'D',
        explanation: 'This range covers the major salivary glands down to the thoracic inlet.',
        type: 'MCQ'
      },
      {
        id: 'pn16',
        text: 'Cardiac gating (ECG-gating) is used in CT Coronary Angiography to:',
        options: ['Synchronize data acquisition with a specific phase of the cardiac cycle', 'Stop the heart from beating', 'Reduce the amount of contrast', 'Make the scan louder'],
        correctAnswer: 'A',
        explanation: 'Gating minimizes motion artifacts from the beating heart.',
        type: 'MCQ'
      },
      {
        id: 'pn17',
        text: 'The "sternal angle" (Angle of Louis) is a landmark for the level of the carina.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'The sternal angle is at the T4-T5 level, where the trachea bifurcates.',
        type: 'TF'
      },
      {
        id: 'pn18',
        text: 'A "Pancoast tumor" is located in the:',
        options: ['Base of the lung', 'Mediastinum', 'Apex of the lung', 'Diaphragm'],
        correctAnswer: 'C',
        explanation: 'Pancoast tumors are superior sulcus tumors at the lung apex.',
        type: 'MCQ'
      },
      {
        id: 'pn19',
        text: 'Prospective gating triggers the X-ray tube only during diastole to reduce dose.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Prospective gating is more dose-efficient than retrospective gating.',
        type: 'TF'
      },
      {
        id: 'pn20',
        text: 'For a CT of the Thymus, the scan should be centered on the:',
        options: ['Upper neck', 'Posterior mediastinum', 'Lower abdomen', 'Anterior superior mediastinum'],
        correctAnswer: 'D',
        explanation: 'The thymus is located in the anterior superior mediastinum, anterior to the great vessels.',
        type: 'MCQ'
      }
    ]
  },
  {
    id: 'ct-protocols-head-cns',
    title: 'CT PROTOCOLS: HEAD & CNS',
    description: 'Master the protocols and anatomy for CT imaging of the head and central nervous system.',
    questions: [
      {
        id: 'hc1',
        text: 'The Central Nervous System (CNS) consists of the:',
        options: ['Brain and peripheral nerves', 'Skull and vertebrae', 'Brain and meninges', 'Brain and spinal cord'],
        correctAnswer: 'D',
        explanation: 'The CNS is made up of the brain and spinal cord. Peripheral nerves belong to the PNS.',
        type: 'MCQ'
      },
      {
        id: 'hc2',
        text: 'The spinal cord extends from the:',
        options: ['Cervical spine to sacrum', 'Thoracic spine to sacrum', 'Skull base to coccyx', 'Back of the brain to lumbar region'],
        correctAnswer: 'D',
        explanation: 'The spinal cord extends from the medulla oblongata (back of the brain) to the lumbar region (usually L1-L2).',
        type: 'MCQ'
      },
      {
        id: 'hc3',
        text: 'One major advantage of CT over MRI is:',
        options: ['High sensitivity for hemorrhage', 'Better soft tissue contrast', 'Use of non-ionizing radiation', 'Imaging in any plane'],
        correctAnswer: 'A',
        explanation: 'CT is highly sensitive for detecting acute hemorrhage and calcifications, and is much faster than MRI.',
        type: 'MCQ'
      },
      {
        id: 'hc4',
        text: 'An advantage of MRI over CT is:',
        options: ['High sensitivity for bone detail', 'Better soft tissue contrast', 'Short imaging time', 'Higher radiation dose'],
        correctAnswer: 'B',
        explanation: 'MRI provides superior soft tissue contrast and does not use ionizing radiation.',
        type: 'MCQ'
      },
      {
        id: 'hc5',
        text: 'A common indication for non-contrast CT brain is:',
        options: ['Aneurysm', 'AV malformation', 'Intracranial hemorrhage', 'Brain metastasis'],
        correctAnswer: 'C',
        explanation: 'Acute intracranial hemorrhage is best detected on non-contrast CT.',
        type: 'MCQ'
      },
      {
        id: 'hc6',
        text: 'CT number (Hounsfield Unit) for water is approximately:',
        options: ['-1000', '-100', '50', '0'],
        correctAnswer: 'D',
        explanation: 'Water is defined as 0 HU. Air is -1000, fat is ~-100, and soft tissue is ~50.',
        type: 'MCQ'
      },
      {
        id: 'hc7',
        text: 'CT number for air is approximately:',
        options: ['-100', '-1000', '0', '+1000'],
        correctAnswer: 'B',
        explanation: 'Air has a CT value of approximately -1000 HU.',
        type: 'MCQ'
      },
      {
        id: 'hc8',
        text: 'Typical brain window setting is:',
        options: ['W:400 L:40', 'W:1600 L:-600', 'W:70 L:30', 'W:2000 L:500'],
        correctAnswer: 'C',
        explanation: 'Brain window settings are typically narrow (e.g., 70/30) for optimal grey-white differentiation.',
        type: 'MCQ'
      },
      {
        id: 'hc9',
        text: 'The typical IV contrast volume for brain CT is:',
        options: ['20–30 mL', '100–120 mL', '150 mL', '50–60 mL'],
        correctAnswer: 'D',
        explanation: '50–60 mL at about 1 mL/s is standard for contrast-enhanced brain CT.',
        type: 'MCQ'
      },
      {
        id: 'hc10',
        text: 'The scan delay for contrast-enhanced brain CT is:',
        options: ['5 minutes', '30 seconds', '1 minute', '3 minutes'],
        correctAnswer: 'A',
        explanation: 'Brain CT contrast scans for tumors or metastases are typically performed after a 5-minute delay to allow for blood-brain barrier breakdown.',
        type: 'MCQ'
      },
      {
        id: 'hc11',
        text: 'The typical scan direction for brain CT is:',
        options: ['Oblique', 'Caudocranial', 'Lateral', 'Craniocaudal'],
        correctAnswer: 'B',
        explanation: 'Brain CT commonly scans from caudal to cranial (base to vertex) to reduce artifacts.',
        type: 'MCQ'
      },
      {
        id: 'hc12',
        text: 'Posterior fossa window setting is approximately:',
        options: ['400/50', '160/60', '2000/500', '90/35'],
        correctAnswer: 'D',
        explanation: 'Narrower window settings (e.g., 90/35) improve visualization of posterior fossa structures.',
        type: 'MCQ'
      },
      {
        id: 'hc13',
        text: 'CT Myelography is primarily used for:',
        options: ['Spinal canal evaluation', 'Brain tumor assessment', 'Lung disease', 'Liver lesions'],
        correctAnswer: 'A',
        explanation: 'CT myelography evaluates the spinal canal, nerve roots, and CSF spaces after intrathecal contrast injection.',
        type: 'MCQ'
      },
      {
        id: 'hc14',
        text: 'The concentration of contrast used in CT Myelography is:',
        options: ['180–240 mg/mL', '50 mg/mL', '100 mg/mL', '350 mg/mL'],
        correctAnswer: 'A',
        explanation: 'Myelographic contrast concentration typically ranges from 180–240 mg/mL.',
        type: 'MCQ'
      },
      {
        id: 'hc15',
        text: 'The maximum iodine dose in CT Myelography is:',
        options: ['1 g', '2 g', '5 g', '3 g'],
        correctAnswer: 'D',
        explanation: 'The maximum recommended iodine dose for intrathecal injection is approximately 3 grams.',
        type: 'MCQ'
      },
      {
        id: 'hc16',
        text: 'A typical cervical spine CT scan extends from:',
        options: ['C2 to T12', 'C1 to T1', 'C7 to L1', 'Skull to sacrum'],
        correctAnswer: 'B',
        explanation: 'Cervical spine CT typically covers from the skull base (C1) through T1.',
        type: 'MCQ'
      },
      {
        id: 'hc17',
        text: 'Thoracic spine CT scan extent is:',
        options: ['C1 – T1', 'T12 – Sacrum', 'C7 – L1', 'Skull base – T12'],
        correctAnswer: 'C',
        explanation: 'Thoracic spine CT typically extends from C7 to L1 to ensure full coverage.',
        type: 'MCQ'
      },
      {
        id: 'hc18',
        text: 'Lumbar spine CT scan extent is:',
        options: ['C7 – L1', 'C1 – T1', 'L1 – Coccyx', 'T12 – Sacrum'],
        correctAnswer: 'D',
        explanation: 'Lumbar spine CT covers from T12 to the sacrum.',
        type: 'MCQ'
      },
      {
        id: 'hc19',
        text: 'One method of reducing motion artifact in brain CT is:',
        options: ['Using head straps', 'Increasing slice thickness', 'Reducing kVp', 'Increasing FOV'],
        correctAnswer: 'A',
        explanation: 'Immobilization devices such as head straps or foam pads are essential to reduce motion artifacts.',
        type: 'MCQ'
      },
      {
        id: 'hc20',
        text: 'An important consideration in pediatric CT protocols is:',
        options: ['Increasing exposure factors', 'Reducing radiation dose', 'Increasing scan duration', 'Avoiding positioning aids'],
        correctAnswer: 'B',
        explanation: 'Pediatric protocols emphasize radiation dose reduction (ALARA principle) while maintaining diagnostic quality.',
        type: 'MCQ'
      }
    ]
  },
  {
    id: 'ct-patient-assessment',
    title: 'PATIENT ASSESSMENT & CONTRAST MEDIA',
    description: 'Essential knowledge for patient care, communication, and contrast media safety in CT.',
    questions: [
      {
        id: 'pa1',
        text: 'Effective communication in CT includes:',
        options: ['Using both verbal and non-verbal skills', 'Ignoring patient questions', 'Speaking only to relatives', 'Avoiding eye contact'],
        correctAnswer: 'A',
        explanation: 'Effective communication involves both verbal and non-verbal methods to ensure patient understanding and cooperation.',
        type: 'MCQ'
      },
      {
        id: 'pa2',
        text: 'Obtaining accurate medical history is important because it:',
        options: ['Delays the procedure', 'Prevents protocol selection', 'Replaces consent', 'Ensures patient safety and proper protocol'],
        correctAnswer: 'D',
        explanation: 'Medical history helps identify allergies, renal issues, pregnancy, and other risks to ensure a safe exam.',
        type: 'MCQ'
      },
      {
        id: 'pa3',
        text: 'One way to reduce patient anxiety is to:',
        options: ['Develop rapport and explain clearly', 'Avoid explaining the procedure', 'Rush the patient', 'Ignore patient concerns'],
        correctAnswer: 'A',
        explanation: 'Building rapport and explaining the procedure clearly helps reduce fear and improves patient cooperation.',
        type: 'MCQ'
      },
      {
        id: 'pa4',
        text: 'Informed consent must be:',
        options: ['Verbal only', 'Willing and informed', 'Forced', 'Signed after the procedure'],
        correctAnswer: 'B',
        explanation: 'Consent must be voluntary and based on a clear understanding of the procedure, risks, and benefits.',
        type: 'MCQ'
      },
      {
        id: 'pa5',
        text: 'Before CT examination, metallic materials should be:',
        options: ['Covered', 'Ignored', 'Removed', 'Painted'],
        correctAnswer: 'C',
        explanation: 'Metallic objects can cause significant streak artifacts and degrade image quality.',
        type: 'MCQ'
      },
      {
        id: 'pa6',
        text: 'NPO (nothing by mouth) before contrast CT helps to:',
        options: ['Increase noise', 'Increase radiation dose', 'Reduce scan time', 'Improve image quality and reduce aspiration risk'],
        correctAnswer: 'D',
        explanation: 'Fasting reduces the risk of vomiting and aspiration if a contrast reaction occurs.',
        type: 'MCQ'
      },
      {
        id: 'pa7',
        text: 'Contrast media improves:',
        options: ['Visibility of structures', 'Radiation dose', 'Scan duration', 'Detector function'],
        correctAnswer: 'A',
        explanation: 'Contrast enhances the differentiation between organs, vessels, and abnormalities.',
        type: 'MCQ'
      },
      {
        id: 'pa8',
        text: 'Iodinated contrast media are classified clinically based on:',
        options: ['Color', 'Osmolality', 'Cost', 'Taste'],
        correctAnswer: 'B',
        explanation: 'Clinical classification is primarily based on osmolality (HOCM vs. LOCM) and ionicity.',
        type: 'MCQ'
      },
      {
        id: 'pa9',
        text: 'High-osmolality contrast media (HOCM) are:',
        options: ['Iso-osmolar to plasma', 'Non-ionic dimers', 'Five to eight times serum osmolality', 'Used routinely intrathecally today'],
        correctAnswer: 'C',
        explanation: 'HOCM have much higher osmolality than blood, which increases the risk of adverse reactions.',
        type: 'MCQ'
      },
      {
        id: 'pa10',
        text: 'Low-osmolality contrast media (LOCM) are preferred for:',
        options: ['External use only', 'Skin cleaning', 'Radiation reduction', 'Intravascular administration'],
        correctAnswer: 'D',
        explanation: 'LOCM are safer, better tolerated, and preferred for most intravascular applications.',
        type: 'MCQ'
      },
      {
        id: 'pa11',
        text: 'An example of a nonionic monomer contrast agent is:',
        options: ['Iopamidol', 'Barium sulphate', 'Water', 'Gastrografin'],
        correctAnswer: 'A',
        explanation: 'Iopamidol is a commonly used low-osmolality nonionic monomer.',
        type: 'MCQ'
      },
      {
        id: 'pa12',
        text: 'Common vein for contrast administration is the:',
        options: ['Carotid artery', 'Jugular nerve', 'Antecubital vein', 'Popliteal artery'],
        correctAnswer: 'C',
        explanation: 'The antecubital vein is the standard site for IV contrast injection due to its size and accessibility.',
        type: 'MCQ'
      },
      {
        id: 'pa13',
        text: 'Adverse reactions to iodinated contrast usually occur within:',
        options: ['24 hours', '12 hours', 'One week', 'First 30 minutes'],
        correctAnswer: 'D',
        explanation: 'The majority of acute contrast reactions occur within 30 minutes of injection.',
        type: 'MCQ'
      },
      {
        id: 'pa14',
        text: 'A common mild contrast reaction is:',
        options: ['Urticaria', 'Fracture', 'Tumor', 'Infection'],
        correctAnswer: 'A',
        explanation: 'Urticaria (hives) is a common mild reaction that usually requires minimal treatment.',
        type: 'MCQ'
      },
      {
        id: 'pa15',
        text: 'Initial management of severe contrast reaction includes:',
        options: ['Continue injection', 'Ignore symptoms', 'Discontinue injection', 'Increase contrast rate'],
        correctAnswer: 'C',
        explanation: 'At the first sign of a reaction, the contrast injection must be stopped immediately.',
        type: 'MCQ'
      },
      {
        id: 'pa16',
        text: 'A power injector is used to:',
        options: ['Reduce noise', 'Increase kVp', 'Position patient', 'Deliver contrast at controlled rate'],
        correctAnswer: 'D',
        explanation: 'Power injectors allow for precise control of flow rate, volume, and timing of contrast delivery.',
        type: 'MCQ'
      },
      {
        id: 'pa17',
        text: 'An example of CT-guided interventional procedure is:',
        options: ['CT-guided lung biopsy', 'Mammography', 'Ultrasound scan', 'ECG'],
        correctAnswer: 'A',
        explanation: 'CT is frequently used to guide needles for biopsies, drainages, and other procedures.',
        type: 'MCQ'
      },
      {
        id: 'pa18',
        text: 'After sedation, the patient should:',
        options: ['Drive home alone', 'Go home assisted', 'Leave immediately', 'Resume strenuous activity'],
        correctAnswer: 'B',
        explanation: 'Sedated patients must be monitored until stable and must have a responsible adult to assist them home.',
        type: 'MCQ'
      },
      {
        id: 'pa19',
        text: 'The main purpose of premedication in high-risk patients is to:',
        options: ['Increase image contrast', 'Prevent adverse reactions', 'Increase radiation dose', 'Shorten scan time'],
        correctAnswer: 'B',
        explanation: 'Premedication (e.g., steroids and antihistamines) helps reduce the risk of allergic-like reactions.',
        type: 'MCQ'
      },
      {
        id: 'pa20',
        text: 'Efficient communication during CT examination helps to:',
        options: ['Increase scan time', 'Delay diagnosis', 'Avoid protocol selection', 'Promote accurate diagnosis and treatment'],
        correctAnswer: 'D',
        explanation: 'Good communication ensures patient safety, cooperation, and high-quality diagnostic results.',
        type: 'MCQ'
      }
    ]
  }
];

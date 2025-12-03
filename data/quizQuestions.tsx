export interface Question {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }
  
  export const quizQuestions: Question[] = [
    {
      "id": 1,
      "question": "What is the primary purpose of a grid in radiography?",
      "options": [
        "Reduce scatter radiation",
        "Increase exposure",
        "Enhance soft tissue contrast",
        "Protect the patient"
      ],
      "answer": "Reduce scatter radiation"
    },
    {
      "id": 2,
      "question": "Which imaging technique is best suited for viewing soft tissues?",
      "options": [
        "X-ray",
        "MRI",
        "CT",
        "Ultrasound"
      ],
      "answer": "MRI"
    },
    {
      "id": 3,
      "question": "Which view is best to examine the maxillary sinuses?",
      "options": [
        "Lateral view",
        "Waters view",
        "AP view",
        "Towne view"
      ],
      "answer": "Waters view"
    },
    {
      "id": 4,
      "question": "What is the unit of X-ray exposure?",
      "options": [
        "Becquerel",
        "Gray",
        "Sievert",
        "Roentgen"
      ],
      "answer": "Roentgen"
    },
    {
      "id": 5,
      "question": "Which part of the X-ray tube produces electrons?",
      "options": [
        "Anode",
        "Cathode",
        "Glass envelope",
        "Collimator"
      ],
      "answer": "Cathode"
    },
    {
      "id": 6,
      "question": "Which radiographic technique is commonly used for chest imaging?",
      "options": [
        "PA view",
        "Lateral view",
        "AP view",
        "Oblique view"
      ],
      "answer": "PA view"
    },
    {
      "id": 7,
      "question": "What does ALARA stand for in radiation protection?",
      "options": [
        "As Low As Reasonably Achievable",
        "As Late As Radiation Allows",
        "A Low And Radiographic Adjustment",
        "All Levels Are Reduced Accordingly"
      ],
      "answer": "As Low As Reasonably Achievable"
    },
    {
      "id": 8,
      "question": "What causes motion blur in radiographic images?",
      "options": [
        "Low contrast",
        "Overexposure",
        "Patient movement",
        "Underexposure"
      ],
      "answer": "Patient movement"
    },
    {
      "id": 9,
      "question": "Which contrast media is commonly used in CT scans?",
      "options": [
        "Barium sulfate",
        "Iodine",
        "Air",
        "Gadolinium"
      ],
      "answer": "Iodine"
    },
    {
      "id": 10,
      "question": "What is the normal SID (source-to-image distance) for a chest X-ray?",
      "options": [
        "40 inches",
        "72 inches",
        "50 inches",
        "36 inches"
      ],
      "answer": "72 inches"
    },
    {
      "id": 11,
      "question": "Which bone is best visualized using an oblique hand X-ray?",
      "options": [
        "Scaphoid",
        "Radius",
        "Ulna",
        "Metacarpal"
      ],
      "answer": "Scaphoid"
    },
    {
      "id": 12,
      "question": "In MRI, what does T1-weighted imaging highlight?",
      "options": [
        "Fat",
        "Water",
        "Bone",
        "Air"
      ],
      "answer": "Fat"
    },
    {
      "id": 13,
      "question": "Which radiographic position is best for visualizing the lumbar spine?",
      "options": [
        "AP view",
        "Lateral view",
        "Oblique view",
        "Axial view"
      ],
      "answer": "Lateral view"
    },
    {
      "id": 14,
      "question": "What artifact can appear from metal objects during MRI scans?",
      "options": [
        "Beam hardening",
        "Motion artifact",
        "Metal artifact",
        "Ghosting"
      ],
      "answer": "Metal artifact"
    },
    {
      "id": 15,
      "question": "Which modality uses no ionizing radiation?",
      "options": [
        "CT",
        "MRI",
        "X-ray",
        "PET"
      ],
      "answer": "MRI"
    },
    {
      "id": 16,
      "question": "What does the term 'radiolucent' mean?",
      "options": [
        "Allows X-rays to pass through",
        "Absorbs X-rays completely",
        "Reflects radiation",
        "Increases image resolution"
      ],
      "answer": "Allows X-rays to pass through"
    },
    {
      "id": 17,
      "question": "Which imaging method is best for detecting gallstones?",
      "options": [
        "X-ray",
        "MRI",
        "Ultrasound",
        "PET"
      ],
      "answer": "Ultrasound"
    },
    {
      "id": 18,
      "question": "Which structure appears white on a standard X-ray?",
      "options": [
        "Air",
        "Muscle",
        "Bone",
        "Fat"
      ],
      "answer": "Bone"
    },
    {
      "id": 19,
      "question": "In fluoroscopy, what is the role of the image intensifier?",
      "options": [
        "To block scatter radiation",
        "To enhance image brightness",
        "To produce X-rays",
        "To convert X-rays to sound waves"
      ],
      "answer": "To enhance image brightness"
    },
    {
      "id": 20,
      "question": "Which radiographic procedure evaluates the esophagus?",
      "options": [
        "IVU",
        "Barium swallow",
        "CT brain",
        "Ultrasound abdomen"
      ],
      "answer": "Barium swallow"
    }
  ];
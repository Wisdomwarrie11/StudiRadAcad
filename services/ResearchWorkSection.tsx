import React, { useState } from 'react';
import { 
  Globe2, 
  Building2, 
  Send, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  FileText
} from 'lucide-react';
import TermsModal from './TermsModal';

const QUALIFICATIONS = [
  'Undergraduate (B.Sc. / B.Tech Radiography)',
  'Postgraduate Diploma (PGD)',
  'Masters (M.Sc.)',
  'Doctorate (Ph.D.)',
  'Clinical Residency / Fellowship',
  'Practicing Radiographer'
];

const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'United Kingdom',
  'South Africa',
  'Kenya',
  'United States',
  'Canada',
  'Australia',
  'India',
  'Ireland',
  'Other'
];

const UNIVERSITIES_BY_COUNTRY: Record<string, string[]> = {
  Nigeria: [
    'University of Nigeria, Nsukka (UNN / UNTH)',
    'University of Lagos (UNILAG / LUTH)',
    'Nnamdi Azikiwe University (UNIZIK / NAUTH)',
    'Bayero University Kano (BUK / AKTH)',
    'University of Calabar (UNICAL / UCTH)',
    'University of Maiduguri (UNIMAID / UMTH)',
    'Ahmadu Bello University (ABU / ABUTH)',
    'Usmanu Danfodiyo University Sokoto (UDUS / UDUTH)',
    'Federal University of Technology Owerri (FUTO)',
    'Lead City University',
    'PAMO University of Medical Sciences',
    'Madonna University, Elele',
    'University of Medical Sciences, Ondo (UNIMED)',
    'Other (Type below)'
  ],
  Ghana: [
    'University of Ghana (UG / Korle-Bu)',
    'Kwame Nkrumah University of Science and Technology (KNUST)',
    'University of Cape Coast (UCC)',
    'University of Health and Allied Sciences (UHAS)',
    'Radford University College',
    'Other (Type below)'
  ],
  'United Kingdom': [
    'City, University of London',
    'University of Leeds',
    'University of Exeter',
    'Birmingham City University',
    'Cardiff University',
    'University of Hertfordshire',
    'Sheffield Hallam University',
    'University of Salford',
    'Glasgow Caledonian University',
    'Kingston University London / St George\'s',
    'University of Portsmouth',
    'Ulster University',
    'Other (Type below)'
  ],
  'South Africa': [
    'University of Johannesburg (UJ)',
    'University of Pretoria',
    'Cape Peninsula University of Technology (CPUT)',
    'Durban University of Technology (DUT)',
    'Central University of Technology (CUT)',
    'Nelson Mandela University',
    'University of the Free State',
    'Other (Type below)'
  ],
  Kenya: [
    'Jomo Kenyatta University of Agriculture and Technology (JKUAT)',
    'Kenya Medical Training College (KMTC)',
    'Moi University',
    'Kenyatta University',
    'University of Nairobi',
    'Other (Type below)'
  ],
  'United States': [
    'Thomas Jefferson University',
    'University of North Carolina at Chapel Hill',
    'Ohio State University',
    'University of Oklahoma Health Sciences Center',
    'Rutgers University',
    'Virginia Commonwealth University',
    'Emory University',
    'Johns Hopkins University',
    'Other (Type below)'
  ],
  Canada: [
    'University of Toronto / The Michener Institute',
    'McMaster University',
    'University of British Columbia',
    'University of Alberta',
    'Dalhousie University',
    'BCIT (British Columbia Institute of Technology)',
    'Other (Type below)'
  ],
  Australia: [
    'University of Sydney',
    'Monash University',
    'Queensland University of Technology (QUT)',
    'RMIT University',
    'University of Newcastle',
    'Curtin University',
    'University of South Australia',
    'Other (Type below)'
  ],
  India: [
    'All India Institute of Medical Sciences (AIIMS, New Delhi)',
    'Manipal Academy of Higher Education (MAHE)',
    'Christian Medical College (CMC), Vellore',
    'Tata Memorial Centre, Mumbai',
    'Jamia Hamdard, New Delhi',
    'PGIMER Chandigarh',
    'Other (Type below)'
  ],
  Ireland: [
    'University College Dublin (UCD)',
    'Trinity College Dublin',
    'University College Cork (UCC)',
    'Other (Type below)'
  ],
  Other: [
    'Other (Type below)'
  ]
};

const SERVICE_OPTIONS = [
  { id: 'consultation', label: 'Consultation', desc: 'Topic selection, research questions, and project planning' },
  { id: 'editing', label: 'Editing', desc: 'Checking, scientific proofreading, grammar, and referencing' },
  { id: 'data_analysis', label: 'Data Analysis', desc: 'Statistical analysis with SPSS, Excel, charts, and results write-up' }
];

export const ResearchWorkSection: React.FC = () => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [isRadiographyAffirmed, setIsRadiographyAffirmed] = useState(true);
  const [country, setCountry] = useState('Nigeria');
  const [selectedUni, setSelectedUni] = useState(UNIVERSITIES_BY_COUNTRY['Nigeria'][0]);
  const [customUni, setCustomUni] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['consultation']);
  const [customRequirement, setCustomRequirement] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const uniList = UNIVERSITIES_BY_COUNTRY[country] || ['Other (Type below)'];
  const isTypingUni = selectedUni === 'Other (Type below)' || !selectedUni;
  const finalUniversity = isTypingUni ? customUni : selectedUni;

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const getCompiledServicesText = (): string => {
    const list = selectedServices.map(s => {
      if (s === 'consultation') return 'consultation';
      if (s === 'editing') return 'editing';
      if (s === 'data_analysis') return 'data analysis';
      return s;
    });

    if (customRequirement.trim()) {
      list.push(customRequirement.trim());
    }

    if (list.length === 0) return 'research work';
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (!qualification) {
      setValidationError('Please select your qualification level.');
      return;
    }

    if (!isRadiographyAffirmed) {
      setValidationError('Please confirm that your work or study is in the Radiography / Medical Imaging field.');
      return;
    }

    if (!country) {
      setValidationError('Please select your country.');
      return;
    }

    if (!finalUniversity.trim()) {
      setValidationError('Please choose or enter your university.');
      return;
    }

    if (selectedServices.length === 0 && !customRequirement.trim()) {
      setValidationError('Please choose at least one service or write what you need.');
      return;
    }

    if (!acceptedTerms) {
      setValidationError('Please agree to the Terms and Conditions to proceed.');
      return;
    }

    // Direct to official WhatsApp without showing any template to the user
    const qualificationText = qualification;
    const uniText = finalUniversity.trim();
    const servicesText = getCompiledServicesText();

    const message = `Hello StudiRad, My name is ${name.trim()} from ${country}, currently undergoing training as an ${qualificationText} in ${uniText}. I am interested in ${servicesText}.`;
    const whatsappUrl = `https://wa.me/2347041197027?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="research" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Active Service
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] tracking-tight">
            Research Work Support
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Guidance for undergraduate projects, postgraduate dissertations, master’s theses, and clinical papers.
          </p>

          {/* Radiographer restriction notice */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold text-center">
            <span>Notice: This research service is strictly for Radiographers and Medical Imaging students.</span>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Full Name & Qualification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Qualification Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                >
                  <option value="">-- Choose qualification --</option>
                  {QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field Confirmation Checkbox */}
            <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRadiographyAffirmed(!isRadiographyAffirmed)}
                className="text-[#002147] focus:outline-none"
              >
                {isRadiographyAffirmed ? (
                  <CheckSquare size={18} className="text-[#002147]" />
                ) : (
                  <Square size={18} className="text-gray-400" />
                )}
              </button>
              <label 
                onClick={() => setIsRadiographyAffirmed(!isRadiographyAffirmed)} 
                className="text-xs text-gray-700 font-medium cursor-pointer select-none"
              >
                I confirm that my study or training is in <strong>Radiography or Medical Imaging</strong>.
              </label>
            </div>

            {/* Country and University */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <Globe2 size={14} className="text-gray-500" /> Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    const newCountry = e.target.value;
                    setCountry(newCountry);
                    const defaultUni = (UNIVERSITIES_BY_COUNTRY[newCountry] || ['Other (Type below)'])[0];
                    setSelectedUni(defaultUni);
                    setCustomUni('');
                  }}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <Building2 size={14} className="text-gray-500" /> University / Hospital <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147] mb-2"
                >
                  {uniList.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>

                {isTypingUni && (
                  <input
                    type="text"
                    required
                    placeholder="Type your university name..."
                    value={customUni}
                    onChange={(e) => setCustomUni(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                  />
                )}
              </div>
            </div>

            {/* Service Selection */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Select Service Needed (You can choose more than one) <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SERVICE_OPTIONS.map((srv) => {
                  const isChecked = selectedServices.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isChecked 
                          ? 'bg-blue-50/70 border-[#002147] shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-bold ${isChecked ? 'text-[#002147]' : 'text-gray-800'}`}>
                            {srv.label}
                          </span>
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                            isChecked ? 'bg-[#002147] text-white' : 'border border-gray-300 text-transparent'
                          }`}>
                            ✓
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-snug">
                          {srv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom specification box */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Or write specifically what you want (Optional):
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Need help with questionnaire design or analyzing survey responses..."
                  value={customRequirement}
                  onChange={(e) => setCustomRequirement(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147] resize-none"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2 border-t border-gray-200">
              <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                    className="text-[#002147] focus:outline-none shrink-0"
                  >
                    {acceptedTerms ? (
                      <CheckSquare size={18} className="text-[#002147]" />
                    ) : (
                      <Square size={18} className="text-gray-400" />
                    )}
                  </button>
                  <span 
                    onClick={() => setAcceptedTerms(!acceptedTerms)} 
                    className="text-xs text-gray-700 font-medium cursor-pointer select-none"
                  >
                    I agree to the Terms and Conditions for research support.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#002147] hover:underline whitespace-nowrap self-start sm:self-auto"
                >
                  <FileText size={13} /> View Terms
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!acceptedTerms}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${
                  acceptedTerms
                    ? 'bg-[#002147] hover:bg-[#001733] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        accepted={acceptedTerms}
        onAccept={() => setAcceptedTerms(true)}
      />
    </section>
  );
};

export default ResearchWorkSection;

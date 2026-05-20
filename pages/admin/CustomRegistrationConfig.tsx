import React from 'react';
import { Plus, Trash2, HelpCircle, Check, Info } from 'lucide-react';

export interface RegistrationField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'select' | 'textarea';
  required: boolean;
  options?: string; // Comma separated list of options for 'select'
  isSystem?: boolean; // System default fields like name/email/whatsapp
}

interface CustomRegistrationConfigProps {
  hasCustomRegistration: boolean;
  setHasCustomRegistration: (val: boolean) => void;
  customConfirmationMessage: string;
  setCustomConfirmationMessage: (val: string) => void;
  registrationFields: RegistrationField[];
  setRegistrationFields: (fields: RegistrationField[]) => void;
}

const DEFAULT_MESSAGE = "Congratulations! Your registration is complete. To successfully join the class, please click this link to access our Google Classroom: https://classroom.google.com/c/ODY1MjQ3MzU5MzI0?cjc=g5bxu3tn";

const DEFAULT_SYSTEM_FIELDS: RegistrationField[] = [
  { id: 'fullname', label: 'Full Name', type: 'text', required: true, isSystem: true },
  { id: 'email', label: 'Email Address', type: 'email', required: true, isSystem: true },
  { id: 'whatsapp', label: 'WhatsApp Number', type: 'tel', required: true, isSystem: true },
  { 
    id: 'qualification', 
    label: 'Qualification', 
    type: 'select', 
    required: true, 
    options: 'Student, Pre-intern, Intern, Radiographer', 
    isSystem: true 
  }
];

export default function CustomRegistrationConfig({
  hasCustomRegistration,
  setHasCustomRegistration,
  customConfirmationMessage,
  setCustomConfirmationMessage,
  registrationFields,
  setRegistrationFields
}: CustomRegistrationConfigProps) {

  // If we toggle on and the fields are empty or they only have the defaults, initialize
  const handleToggle = (checked: boolean) => {
    setHasCustomRegistration(checked);
    if (checked && registrationFields.length === 0) {
      setRegistrationFields([...DEFAULT_SYSTEM_FIELDS]);
      if (!customConfirmationMessage) {
        setCustomConfirmationMessage(DEFAULT_MESSAGE);
      }
    }
  };

  const addField = () => {
    const newField: RegistrationField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      options: ''
    };
    setRegistrationFields([...registrationFields, newField]);
  };

  const removeField = (id: string) => {
    setRegistrationFields(registrationFields.filter(f => f.id !== id));
  };

  const updateField = (id: string, key: keyof RegistrationField, value: any) => {
    const updated = registrationFields.map(f => {
      if (f.id === id) {
        return { ...f, [key]: value };
      }
      return f;
    });
    setRegistrationFields(updated);
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Custom Registration</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Enable a secure on-site registration form for clients.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={hasCustomRegistration}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-primary"></div>
        </label>
      </div>

      {hasCustomRegistration && (
        <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Info size={14} className="text-brand-primary" /> Fields & Questions
              </span>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-inner"
              >
                <Plus size={12} /> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {registrationFields.map((field, idx) => (
                <div 
                  key={field.id}
                  className={`p-5 rounded-2xl border ${field.isSystem ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-200'} space-y-4`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                        {field.isSystem ? 'Default Field' : 'Custom Field'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          disabled={field.isSystem}
                          checked={field.required}
                          onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                          className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-slate-300 rounded"
                        />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Required</span>
                      </label>

                      {!field.isSystem && (
                        <button
                          type="button"
                          onClick={() => removeField(field.id)}
                          className="p-1 px-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium uppercase tracking-wider flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Field Name / Label *</label>
                      <input 
                        type="text"
                        required
                        disabled={field.isSystem}
                        placeholder="e.g. Specialty, Place of Work, Level"
                        value={field.label}
                        onChange={(e) => updateField(field.id, 'label', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Input Type</label>
                      <select
                        disabled={field.isSystem}
                        value={field.type}
                        onChange={(e) => updateField(field.id, 'type', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm appearance-none"
                      >
                        <option value="text">Text Input</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone / Tel</option>
                        <option value="select">Dropdown Select</option>
                        <option value="textarea">Multi-line Text</option>
                      </select>
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        Dropdown Options <span className="text-slate-300 font-medium italic">(Comma-separated)</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Intern, Practitioner, Student, Post-grad"
                        value={field.options || ''}
                        onChange={(e) => updateField(field.id, 'options', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
              Custom Confirmation Message *
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g. Congratulations! Please click this link to access Google Classroom..."
              value={customConfirmationMessage}
              onChange={(e) => setCustomConfirmationMessage(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold transition-all text-sm resize-none"
            ></textarea>
            <p className="text-[10px] text-slate-400 font-medium">Use full clickable URLs (e.g. https://classroom.google.com/...) - they will be formatted automatically as clickable links for students.</p>
          </div>
        </div>
      )}
    </div>
  );
}

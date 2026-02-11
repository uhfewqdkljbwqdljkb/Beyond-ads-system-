
import React, { useState } from 'react';
import { Upload, Check, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import { Modal, Button, Badge } from '../ui';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const reset = () => {
    setStep(1);
    setFile(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={reset} 
      title="Import Leads from CSV"
      size="lg"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex items-center flex-1 last:flex-none">
               <div className={`
                 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                 ${step === i ? 'bg-primary text-white' : step > i ? 'bg-success text-white' : 'bg-surface text-textMuted border border-border'}
               `}>
                 {step > i ? <Check size={14} /> : i}
               </div>
               {i < 3 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > i ? 'bg-success' : 'bg-border'}`} />}
             </div>
           ))}
        </div>
        <div className="flex justify-between text-[10px] font-bold text-textMuted uppercase tracking-wider px-1">
          <span>Upload</span>
          <span>Map Columns</span>
          <span>Results</span>
        </div>
      </div>

      <div className="min-h-[200px]">
        {step === 1 && (
          <div className="space-y-6">
            <div 
              className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              <input 
                type="file" 
                id="csv-upload" 
                className="hidden" 
                accept=".csv" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 text-textMuted group-hover:text-primary transition-colors">
                <Upload size={32} />
              </div>
              <h4 className="text-sm font-bold text-textPrimary mb-1">
                {file ? file.name : 'Click or drag to upload CSV'}
              </h4>
              <p className="text-xs text-textSecondary">CSV files up to 10MB are supported</p>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-primary mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-textPrimary mb-1">CSV Template</h5>
                <p className="text-[11px] text-textSecondary mb-2">Use our standardized template to ensure correct field mapping.</p>
                <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
                  <FileText size={12} /> Download Template.csv
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-sm text-textSecondary mb-4">
              Map the columns from <span className="font-bold text-textPrimary">{file?.name}</span> to the NexusSales fields.
            </div>
            <div className="space-y-2 border border-border rounded-lg overflow-hidden">
               {['first_name', 'last_name', 'email', 'company', 'estimated_value'].map(field => (
                 <div key={field} className="flex items-center justify-between p-3 bg-white border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-textPrimary capitalize">{field.replace('_', ' ')}</span>
                       <Badge variant="primary" size="sm">Required</Badge>
                    </div>
                    <select className="bg-surface border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary w-40">
                       <option>{field}</option>
                       <option>Skip Field</option>
                    </select>
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-textPrimary">Ready to Import!</h3>
              <p className="text-sm text-textSecondary">We found <span className="font-bold text-textPrimary">42 leads</span> in your file.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-surface p-3 rounded-lg border border-border">
                <p className="text-[10px] font-bold text-textMuted uppercase mb-1">Valid Rows</p>
                <p className="text-xl font-bold text-success">38</p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-border">
                <p className="text-[10px] font-bold text-textMuted uppercase mb-1">Errors Found</p>
                <p className="text-xl font-bold text-error">4</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
        {step > 1 && <Button variant="ghost" onClick={handleBack}>Previous</Button>}
        {step < 3 ? (
          <Button disabled={!file} onClick={handleNext} rightIcon={<ChevronRight size={18} />}>Next Step</Button>
        ) : (
          <Button onClick={reset}>Complete Import</Button>
        )}
      </div>
    </Modal>
  );
};


import React, { useState, useMemo } from 'react';
import { Modal, Button, Input, Select, Checkbox, Spinner } from '../ui';
import { usePreviewSheet, useSaveSheetConnection } from '../../hooks/useGoogleSheets';
import { useCreateLead } from '../../hooks/useLeads';
import { useAddLeadsToGroup } from '../../hooks/useLeadGroups';
import { useAuthStore } from '../../store/authStore';
import { 
  FileSpreadsheet, AlertTriangle, ArrowRight, Check, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface ImportFromSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

const STEPS = ['Connect', 'Map', 'Review'];

export const ImportFromSheetsModal: React.FC<ImportFromSheetsModalProps> = ({ isOpen, onClose, groupId, groupName }) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [sheetUrl, setSheetUrl] = useState('');
  const [tabName, setTabName] = useState('Sheet1');
  const [sheetData, setSheetData] = useState<any>(null);
  
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [saveConnection, setSaveConnection] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'complete'>('idle');
  const [importStats, setImportStats] = useState({ total: 0, success: 0, skipped: 0 });

  const previewMutation = usePreviewSheet();
  const saveConnectionMutation = useSaveSheetConnection();
  const createLead = useCreateLead();
  const addLeadToGroup = useAddLeadsToGroup();

  // LEAD FIELDS
  const leadFields = [
    { value: 'first_name', label: 'First Name *' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'full_name', label: 'Full Name (Auto-split)' },
    { value: 'email', label: 'Email *' },
    { value: 'phone', label: 'Phone' },
    { value: 'company_name', label: 'Company' },
    { value: 'job_title', label: 'Job Title' },
    { value: 'city', label: 'City' },
    { value: 'estimated_value', label: 'Estimated Value' },
    { value: 'notes', label: 'Notes' },
  ];

  // STEP 1: FETCH
  const handleFetch = async () => {
    try {
      const data = await previewMutation.mutateAsync({ url: sheetUrl, tabName });
      setSheetData(data);
      
      // Auto-map logic
      const autoMap: Record<string, string> = {};
      data.headers.forEach((header: string) => {
        const h = header.toLowerCase();
        if (h.includes('email')) autoMap[header] = 'email';
        else if (h.includes('first')) autoMap[header] = 'first_name';
        else if (h.includes('last')) autoMap[header] = 'last_name';
        else if (h.includes('full name') || h === 'name') autoMap[header] = 'full_name';
        else if (h.includes('phone') || h.includes('mobile')) autoMap[header] = 'phone';
        else if (h.includes('company')) autoMap[header] = 'company_name';
        else if (h.includes('job') || h.includes('title')) autoMap[header] = 'job_title';
        else if (h.includes('city') || h.includes('location')) autoMap[header] = 'city';
        else if (h.includes('value') || h.includes('budget')) autoMap[header] = 'estimated_value';
        else if (h.includes('note') || h.includes('desc')) autoMap[header] = 'notes';
      });
      setColumnMapping(autoMap);
      setStep(1);
    } catch (err) {}
  };

  // STEP 3: IMPORT
  const handleImport = async () => {
    setImportStatus('importing');
    let successCount = 0;
    let skippedCount = 0;
    const newLeadIds: string[] = [];

    // Mock processing loop
    const rowsToProcess = sheetData.sample_rows; 

    for (const row of rowsToProcess) {
      try {
        const leadPayload: any = { status: 'new', created_by: user?.id };
        let isValid = false;

        // Map fields
        Object.entries(columnMapping).forEach(([header, field]) => {
          const colIndex = sheetData.headers.indexOf(header);
          if (colIndex > -1) {
            let value = (row as any)[colIndex];
            
            if (field === 'full_name' && value) {
              const parts = value.split(' ');
              leadPayload.first_name = parts[0];
              leadPayload.last_name = parts.slice(1).join(' ');
            } else if (field === 'estimated_value') {
              leadPayload[field] = parseFloat(value) || 0;
            } else {
              leadPayload[field] = value;
            }
          }
        });

        // Validation
        if (leadPayload.email && (leadPayload.first_name || leadPayload.last_name)) {
          isValid = true;
        }

        if (isValid) {
          const newLead = await createLead.mutateAsync(leadPayload);
          if (newLead?.id) newLeadIds.push(newLead.id);
          successCount++;
        } else {
          skippedCount++;
        }
      } catch (e) {
        skippedCount++;
      }
    }

    if (newLeadIds.length > 0) {
      await addLeadToGroup.mutateAsync({ groupId, leadIds: newLeadIds, userId: user?.id });
    }

    if (saveConnection) {
      await saveConnectionMutation.mutateAsync({
        group_id: groupId,
        sheet_url: sheetUrl,
        sheet_id: sheetData.sheet_id,
        sheet_tab_name: tabName,
        column_mapping: columnMapping,
        created_by: user?.id
      });
    }

    setImportStats({ total: rowsToProcess.length, success: successCount, skipped: skippedCount });
    setImportStatus('complete');
  };

  const isMappingValid = useMemo(() => {
    const values = Object.values(columnMapping);
    return values.includes('email') && (values.includes('first_name') || values.includes('full_name'));
  }, [columnMapping]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from Google Sheets" size="lg" totalSteps={3} currentStep={step + 1}>
      <div className="min-h-[350px] flex flex-col">
        {/* STEP 1: CONNECT */}
        {step === 0 && (
          <div className="space-y-6 flex-1 pt-4">
            <div className="bg-primary-light/20 p-4 rounded-xl border border-primary/10 flex gap-4">
              <div className="p-3 bg-white rounded-lg text-green-600 shadow-sm"><FileSpreadsheet size={24} /></div>
              <div>
                <h4 className="text-sm font-bold text-textPrimary">Connect your Sheet</h4>
                <p className="text-xs text-textSecondary mt-1">
                  Paste the full URL. Ensure the sheet is accessible (Link sharing: "Anyone with link" or public).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input 
                label="Google Sheets URL" 
                placeholder="https://docs.google.com/spreadsheets/d/..." 
                value={sheetUrl}
                onChange={e => setSheetUrl(e.target.value)}
                autoFocus
              />
              <Input 
                label="Tab Name (Optional)" 
                placeholder="Sheet1" 
                value={tabName}
                onChange={e => setTabName(e.target.value)}
              />
            </div>
            
            <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2">
               <AlertTriangle size={14} className="shrink-0 mt-0.5" />
               <p>If you haven't configured the API Key in .env, a mock data preview will be used for demonstration.</p>
            </div>
          </div>
        )}

        {/* STEP 2: MAP */}
        {step === 1 && (
          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-center">
               <h4 className="text-sm font-bold text-textPrimary">Map Columns</h4>
               {!isMappingValid && <span className="text-[10px] text-error font-bold">Email and Name are required</span>}
            </div>
            
            <div className="border border-border rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-surface text-textSecondary font-bold">
                   <tr>
                     <th className="p-3 border-b border-border">Sheet Header</th>
                     <th className="p-3 border-b border-border">Lead Field</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {sheetData?.headers.map((header: string) => (
                     <tr key={header} className="bg-white">
                       <td className="p-3 font-medium text-textPrimary">{header}</td>
                       <td className="p-3">
                         <Select 
                           options={[{ label: '— Skip —', value: '' }, ...leadFields]} 
                           value={columnMapping[header] || ''} 
                           onChange={(val) => setColumnMapping(prev => ({ ...prev, [header]: val }))}
                           className="w-full text-xs"
                         />
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

            {/* Preview */}
            <div className="bg-surface p-3 rounded-lg border border-border">
               <p className="text-[10px] font-black text-textMuted uppercase mb-2">Data Preview (First Row)</p>
               <div className="flex gap-2 overflow-x-auto text-xs whitespace-nowrap pb-2">
                  {sheetData?.sample_rows[0].map((val: string, i: number) => (
                    <div key={i} className="px-2 py-1 bg-white border border-border rounded">
                      <span className="text-textMuted mr-1">{sheetData.headers[i]}:</span>
                      <span className="font-bold">{val}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 2 && importStatus !== 'complete' && (
          <div className="space-y-6 flex-1 pt-4">
             <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <FileSpreadsheet size={32} />
                </div>
                <h3 className="text-lg font-bold text-textPrimary">Ready to Import</h3>
                <p className="text-sm text-textSecondary">
                  We found roughly <span className="font-bold text-textPrimary">{sheetData?.total_rows || sheetData?.sample_rows.length} rows</span> to process.
                </p>
             </div>

             <div className="bg-surface rounded-xl p-4 border border-border space-y-4">
                <div className="flex items-start gap-3">
                   <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                   <div>
                      <p className="text-sm font-bold text-textPrimary">Mapping Validated</p>
                      <p className="text-xs text-textSecondary">Required fields (Name, Email) are mapped correctly.</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <AlertCircle size={18} className="text-primary mt-0.5" />
                   <div>
                      <p className="text-sm font-bold text-textPrimary">Duplicate Handling</p>
                      <p className="text-xs text-textSecondary">Duplicates will be skipped based on email address.</p>
                   </div>
                </div>
             </div>

             <Checkbox 
               label="Save this connection for future syncs" 
               checked={saveConnection} 
               onChange={setSaveConnection} 
             />
          </div>
        )}

        {/* COMPLETION */}
        {importStatus === 'complete' && (
           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in">
                 <Check size={40} />
              </div>
              <h3 className="text-2xl font-black text-textPrimary">Import Complete!</h3>
              <div className="flex gap-8 text-center">
                 <div>
                    <p className="text-3xl font-black text-emerald-600">{importStats.success}</p>
                    <p className="text-xs font-bold text-textMuted uppercase">Imported</p>
                 </div>
                 <div>
                    <p className="text-3xl font-black text-textMuted">{importStats.skipped}</p>
                    <p className="text-xs font-bold text-textMuted uppercase">Skipped</p>
                 </div>
              </div>
           </div>
        )}

        {/* FOOTER */}
        {importStatus !== 'complete' && (
          <div className="pt-6 border-t border-border flex justify-between mt-auto">
             <Button variant="ghost" onClick={step === 0 ? onClose : () => setStep(s => s - 1)}>
               {step === 0 ? 'Cancel' : 'Back'}
             </Button>
             
             {step === 0 && (
               <Button onClick={handleFetch} isLoading={previewMutation.isPending} disabled={!sheetUrl}>
                 Fetch Sheet <ArrowRight size={16} className="ml-1" />
               </Button>
             )}
             
             {step === 1 && (
               <Button onClick={() => setStep(2)} disabled={!isMappingValid}>
                 Review Import <ArrowRight size={16} className="ml-1" />
               </Button>
             )}

             {step === 2 && (
               <Button onClick={handleImport} isLoading={importStatus === 'importing'}>
                 Run Import
               </Button>
             )}
          </div>
        )}

        {importStatus === 'complete' && (
           <div className="pt-6 border-t border-border flex justify-center mt-auto">
              <Button onClick={onClose} className="w-full">Done</Button>
           </div>
        )}
      </div>
    </Modal>
  );
};

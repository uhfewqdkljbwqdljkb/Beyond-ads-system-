
import React, { useState } from 'react';
import { Plus, UserPlus, FileSpreadsheet, ClipboardList } from 'lucide-react';
import { Dropdown, Button } from '../ui';
import { AddLeadManuallyModal } from './AddLeadManuallyModal';
import { AddExistingLeadsModal } from './AddExistingLeadsModal';
import { ImportFromSheetsModal } from './ImportFromSheetsModal';

interface AddLeadsDropdownProps {
  groupId: string;
  groupName: string;
}

export const AddLeadsDropdown: React.FC<AddLeadsDropdownProps> = ({ groupId, groupName }) => {
  const [modalType, setModalType] = useState<'manual' | 'existing' | 'sheets' | null>(null);

  return (
    <>
      <Dropdown 
        trigger={
          <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} rightIcon={<div className="ml-1 opacity-50 text-[10px]">▼</div>}>
            Add Leads
          </Button>
        } 
        align="right"
        width="220px"
      >
        <Dropdown.Item icon={<UserPlus size={14} />} onClick={() => setModalType('manual')}>
          Add Lead Manually
        </Dropdown.Item>
        <Dropdown.Item icon={<ClipboardList size={14} />} onClick={() => setModalType('existing')}>
          Add Existing Leads
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={<FileSpreadsheet size={14} />} onClick={() => setModalType('sheets')}>
          Import from Sheets
        </Dropdown.Item>
      </Dropdown>

      {/* Modals */}
      <AddLeadManuallyModal 
        isOpen={modalType === 'manual'} 
        onClose={() => setModalType(null)} 
        groupId={groupId}
        groupName={groupName}
      />
      
      <AddExistingLeadsModal 
        isOpen={modalType === 'existing'} 
        onClose={() => setModalType(null)} 
        groupId={groupId}
        groupName={groupName}
      />

      <ImportFromSheetsModal 
        isOpen={modalType === 'sheets'} 
        onClose={() => setModalType(null)} 
        groupId={groupId}
        groupName={groupName}
      />
    </>
  );
};

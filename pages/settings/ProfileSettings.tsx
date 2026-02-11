import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Mail, 
  Camera, 
  ShieldCheck, 
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Input, Toggle, Avatar, Badge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [showPass, setShowPass] = useState(false);

  const [notifs, setNotifs] = useState({
    email: true,
    leadAssigned: true,
    dealStage: true,
    invoicePaid: false,
    commApproved: true,
    dailyDigest: false
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handlePassUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully');
  };

  return (
    <div className="space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-border">
        <div className="relative group">
          <Avatar name={`${user?.firstName} ${user?.lastName}`} size="xl" src={user?.avatar || ''} className="ring-4 ring-primary-light" />
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white hover:bg-primary-hover transition-colors">
            <Camera size={16} />
          </button>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-textPrimary tracking-tight">{user?.firstName} {user?.lastName}</h2>
          <p className="text-textSecondary font-medium">{user?.email}</p>
          <div className="flex gap-2 mt-3 justify-center md:justify-start">
            <Badge variant="primary" className="uppercase tracking-widest text-[10px] font-black">{user?.role?.replace('_', ' ')}</Badge>
            <Badge variant="success" dot>Online</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Personal Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <User size={20} />
            <h3 className="text-lg font-bold text-textPrimary">Personal Information</h3>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" defaultValue={user?.firstName} required />
              <Input label="Last Name" defaultValue={user?.lastName} required />
            </div>
            <Input label="Email Address" defaultValue={user?.email} readOnly disabled helperText="Email cannot be changed. Contact support to update login identity." />
            <Input label="Phone Number" placeholder="+1 (555) 000-0000" leftIcon={<Smartphone size={16} />} />
            <Button type="submit">Save Profile Changes</Button>
          </form>
        </section>

        {/* Password Update */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Lock size={20} />
            <h3 className="text-lg font-bold text-textPrimary">Security</h3>
          </div>
          <form onSubmit={handlePassUpdate} className="space-y-4 p-6 bg-surface rounded-2xl border border-border">
            <Input 
              label="Current Password" 
              type={showPass ? 'text' : 'password'} 
              placeholder="••••••••"
              rightIcon={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
            />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
            <Button variant="outline" fullWidth type="submit">Update Password</Button>
          </form>
        </section>
      </div>

      {/* Notifications */}
      <section className="space-y-6 pt-8 border-t border-border">
        <div className="flex items-center gap-2 text-primary">
          <Bell size={20} />
          <h3 className="text-lg font-bold text-textPrimary">Notification Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <Toggle 
            label="Enable Email Notifications" 
            checked={notifs.email} 
            onChange={(v) => setNotifs({...notifs, email: v})} 
          />
          <Toggle 
            label="New Lead Assigned" 
            checked={notifs.leadAssigned} 
            onChange={(v) => setNotifs({...notifs, leadAssigned: v})} 
          />
          <Toggle 
            label="Deal Stage Changed" 
            checked={notifs.dealStage} 
            onChange={(v) => setNotifs({...notifs, dealStage: v})} 
          />
          <Toggle 
            label="Invoice Paid Notifications" 
            checked={notifs.invoicePaid} 
            onChange={(v) => setNotifs({...notifs, invoicePaid: v})} 
          />
          <Toggle 
            label="Commission Approved" 
            checked={notifs.commApproved} 
            onChange={(v) => setNotifs({...notifs, commApproved: v})} 
          />
          <Toggle 
            label="Daily Performance Digest" 
            checked={notifs.dailyDigest} 
            onChange={(v) => setNotifs({...notifs, dailyDigest: v})} 
          />
        </div>
        <div className="pt-4">
          <Button variant="secondary" onClick={() => toast.success('Preferences saved')}>Save Preferences</Button>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
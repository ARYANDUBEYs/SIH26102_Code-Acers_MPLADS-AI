import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User, Mail, Shield, Save } from 'lucide-react';

export const ProfileForm = () => {
  const { user } = useAuth();
  const { showToast } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [department, setDepartment] = useState(user?.department || '');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Profile credentials updated successfully', 'success');
  };

  return (
    <Card title="Security & Officer Credentials" subtitle="Update official contact and nodal mapping" className="max-w-xl mx-auto mt-6">
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <Input
          label="Officer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={User}
        />
        <Input
          label="Govt Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
        />
        <Input
          label="Designation / Rank"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <Input
          label="Assigned Ministry / Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="sm" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

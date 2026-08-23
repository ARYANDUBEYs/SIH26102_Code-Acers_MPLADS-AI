import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { ProfileCard } from '../../features/profile/ProfileCard';

export const Profile = () => {
  return (
    <PageLayout
      title="Officer Profile & Security Credentials"
      subtitle="Digital signature status, 2FA authorization, and department assignments."
      breadcrumbs={['Dashboard', 'Profile']}
    >
      <div className="pt-4">
        <ProfileCard />
      </div>
    </PageLayout>
  );
};

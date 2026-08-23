import React from 'react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/helpers';

export const DashboardChart = ({
  title,
  subtitle,
  children,
  action,
  icon: Icon,
  className = '',
}) => {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={action}
      icon={Icon}
      className={cn('w-full', className)}
      bodyClassName="h-72 sm:h-80 w-full pt-2"
    >
      {children}
    </Card>
  );
};

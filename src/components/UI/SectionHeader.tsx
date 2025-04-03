
import React from 'react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkTo?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, linkText, linkTo }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {linkText && linkTo && (
        <Link to={linkTo} className="text-sm text-primary hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;

import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Belum Ada Data',
  description = 'Tidak ada rekaman data yang cocok atau belum ada data yang ditambahkan.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-amber-200">
      <div className="w-16 h-16 rounded-full bg-[#FFF5E6] flex items-center justify-center text-[#E8913A] mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-[#4A2C0A]">{title}</h4>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-[#E8913A] hover:bg-[#D57C26] text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

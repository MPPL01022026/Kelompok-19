import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#4A2C0A]">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {message}
          </p>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-sm transition-colors ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#E8913A] hover:bg-[#D57C26]'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

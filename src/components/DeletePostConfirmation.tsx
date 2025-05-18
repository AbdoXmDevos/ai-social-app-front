import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

interface DeletePostConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePostConfirmation({
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}: DeletePostConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1B2730] p-6 rounded-xl w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Delete Post
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PostDeletedNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function PostDeletedNotification({
  isVisible,
  onClose
}: PostDeletedNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 mx-auto w-full max-w-md z-50 animate-slide-down">
      <div className="bg-red-500/90 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <p className="font-medium">Post deleted successfully</p>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

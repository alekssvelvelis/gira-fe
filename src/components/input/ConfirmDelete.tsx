import { useState } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-10 transition-opacity flex justify-center items-center duration-300">
            <div 
                id='invite-card' 
                className='w-[315px] text-center bg-darkened-surface border rounded border-gray-300 flex flex-col justify-center p-8'
                onClick={(e) => e.stopPropagation()} 
            >
                <p className='color-green font-light text-xl'>{title}</p>
                <p className='color-green font-light text-xl'>{description}</p>
                <button className='p-2 my-4 bg-accent hover:bg-primary transition-all duration-300' onClick={onConfirm}>Confirm</button>
            </div>
        </div>
    );
}
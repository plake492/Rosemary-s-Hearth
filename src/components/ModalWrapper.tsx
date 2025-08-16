import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalWrapperProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showModal?: boolean;
  setShowModal?: (value: boolean) => void;
  hideCloseButton?: boolean;
};

// Global modal stack for z-index management
let modalStack: number[] = [];

export default function ModalWrapper({
  children,
  className,
  style,
  showModal,
  setShowModal,
  hideCloseButton = false,
}: ModalWrapperProps) {
  const [stackIndex, setStackIndex] = useState(0);
  const modalId = useRef(Math.random());

  React.useEffect(() => {
    const isModalOpen = showModal;

    if (isModalOpen) {
      // Add this modal to the stack
      modalStack.push(modalId.current);
      setStackIndex(modalStack.length - 1);
      document.body.style.overflow = 'hidden';
      console.log('Modal opened, stack index:', modalStack.length - 1);
    } else {
      // Remove this modal from the stack
      const index = modalStack.indexOf(modalId.current);
      if (index > -1) {
        modalStack.splice(index, 1);
      }

      // Only restore scroll if no other modals are open
      if (modalStack.length === 0) {
        document.body.style.overflow = '';
      }
      console.log('Modal closed, remaining modals:', modalStack.length);
    }

    return () => {
      // Cleanup on unmount
      const index = modalStack.indexOf(modalId.current);
      if (index > -1) {
        modalStack.splice(index, 1);
      }
      if (modalStack.length === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [showModal]);

  const closeModal = () => {
    if (setShowModal) {
      setShowModal(false);
    }
  };

  const renderModal = () => {
    if (!showModal) {
      return null;
    }

    const baseZIndex = 1000;
    const calculatedZIndex = baseZIndex + stackIndex * 10;

    return createPortal(
      <div
        className="modal-backdrop"
        onClick={closeModal}
        style={{ zIndex: calculatedZIndex }}
      >
        <div
          className={`modal-wrapper max-w-lg bg-white ${className ? className : ''}`}
          style={{
            ...style,
            zIndex: calculatedZIndex + 1,
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {!hideCloseButton && (
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>
          )}
          {children}
        </div>
      </div>,
      document.body,
    );
  };

  return <>{renderModal()}</>;
}

import React, { useState } from 'react';

type ModalWrapperProps = {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  closeOverride?: boolean;
  openOverride?: boolean;
  setOpenOverride?: (value: boolean) => void;
};

export default function ModalWrapper({
  children,
  trigger,
  className,
  style,
  closeOverride,
  openOverride,
  setOpenOverride,
}: ModalWrapperProps) {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if ((open || openOverride) && !closeOverride) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, closeOverride, openOverride]);

  const closeModal = () => {
    setOpen(false);
    if (setOpenOverride) {
      setOpenOverride(false);
    }
  };

  return (
    <>
      {trigger && (
        <span onClick={() => setOpen(true)} style={{ display: 'inline-block' }}>
          {trigger}
        </span>
      )}
      {(open || openOverride) && !closeOverride && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className={`modal-wrapper${className ? ' ' + className : ''}`}
            style={style}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

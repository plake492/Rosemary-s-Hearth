import React, { useState } from 'react';

type ModalWrapperProps = {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
};

export default function ModalWrapper({
  children,
  trigger,
  className,
}: ModalWrapperProps) {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ display: 'inline-block' }}>
        {trigger}
      </span>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className={`modal-wrapper${className ? ' ' + className : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setOpen(false)}
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

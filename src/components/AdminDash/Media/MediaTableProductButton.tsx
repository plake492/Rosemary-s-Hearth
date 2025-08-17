import React from 'react';

interface MediaTableProductButtonProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  stepTwoNext: () => void;
}

export default function MediaTableProductButton({ setCurrentStep, stepTwoNext }: MediaTableProductButtonProps) {
  return (
    <div className="sticky bottom-0 right-0 p-4 bg-cream width-full flex justify-between gap-4">
      <button
        type="button"
        className="bg-cream text-orange-900 px-4 py-2 rounded disabled:opacity-50 cursor-pointer border-orange-900 border"
        onClick={() => setCurrentStep(1)}
      >
        back
      </button>
      <button
        type="button"
        className="text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer bg-brown disabled:opacity-50"
        onClick={stepTwoNext}
      >
        Continue
      </button>
    </div>
  );
}

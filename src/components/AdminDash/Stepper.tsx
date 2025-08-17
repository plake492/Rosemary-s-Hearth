import React from 'react';

interface StepperProps {
  config: { step: number; label: string }[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  stepsCompleted?: number[]; // Optional array to track completed steps
}

export default function Stepper({
  config,
  currentStep,
  setCurrentStep,
  stepsCompleted = [],
}: StepperProps) {
  return (
    <div className="flex items-center justify-around mb-8">
      {config.map(({ step, label }) => (
        <div key={step} className="flex flex-col items-center">
          <div className="grid justify-items-center">
            <div>{label}</div>
            <div
              onClick={() => {
                if (step <= currentStep || stepsCompleted.includes(step)) {
                  setCurrentStep(step);
                }
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === currentStep
                  ? 'border-4 border-yellow-400'
                  : step < currentStep
                    ? 'bg-brown text-cream hover:bg-brown-dark transition-colors'
                    : 'border-2 border-brown text-brown bg-transparent'
              } ${stepsCompleted.includes(step) ? 'bg-brown text-cream cursor-pointer' : ''}`}
            >
              {step}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

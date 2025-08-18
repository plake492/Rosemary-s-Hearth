import React from 'react';

interface StepperProps {
  config: { step: number; label: string }[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  stepsCompleted?: number[]; // Optional array to track completed steps
}

export default function Stepper({ config, currentStep, setCurrentStep, stepsCompleted = [] }: StepperProps) {
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
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold${
                step === currentStep
                  ? 'border-4 border-yellow-400 bg-brown'
                  : step < currentStep
                    ? 'text-cream hover:bg-brown transition-colors'
                    : 'border-brown bg-zinc-200'
              } ${stepsCompleted.includes(step) ? ' text-cream  bg-sage border-sage hover:bg-sage-hover cursor-pointer pointer-events-all' : ''}`}
            >
              {step}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

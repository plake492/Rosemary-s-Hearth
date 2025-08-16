import React from 'react';

interface StepperProps {
  config: { step: number; label: string }[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Stepper({
  config,
  currentStep,
  setCurrentStep,
}: StepperProps) {
  return (
    <div className="flex items-center justify-around mb-8">
      {config.map(({ step, label }) => (
        <div key={step} className="flex flex-col items-center">
          <div className="grid justify-items-center">
            <div>{label}</div>
            <div
              onClick={() => setCurrentStep(step)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === currentStep
                  ? 'bg-brown text-cream border-4 border-yellow-400'
                  : step < currentStep
                    ? 'bg-brown text-cream cursor-pointer hover:bg-brown-dark transition-colors'
                    : 'border-2 border-brown text-brown bg-transparent'
              }`}
            >
              {step}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

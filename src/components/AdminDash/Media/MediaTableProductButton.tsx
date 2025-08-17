import React from 'react';
import Button from '@/components/Button';

interface MediaTableProductButtonProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  stepTwoNext: () => void;
}

export default function MediaTableProductButton({ setCurrentStep, stepTwoNext }: MediaTableProductButtonProps) {
  return (
    <div className="sticky bottom-0 right-0 p-4 bg-cream width-full flex justify-between gap-4">
      <Button variant="border" type="button" className="cursor-pointer" onClick={() => setCurrentStep(1)}>
        Back
      </Button>
      <Button type="button" variant="primary" className="cursor-pointer" onClick={stepTwoNext}>
        Continue
      </Button>
    </div>
  );
}

import React, { FC, useEffect, useState } from 'react';
import { createSeed } from '../../messaging';
import { ConfirmSeed } from './ConfirmSeed';
import { SeedView } from './SeedView';

export const NewAccount: FC = () => {
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  const [step, setStep] = useState(0);

  useEffect((): void => {
    createSeed()
      .then(setAccount)
      .catch((error: Error) => console.error(error));
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    step > 0 && setStep(step - 1);
  };

  const renderStep = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return (
          <SeedView onContinue={nextStep}
            seedPhrase={account?.seed} />
        );
      case 1:
        return (
          <ConfirmSeed onBack={prevStep}
            onContinue={nextStep}
            seedPhrase={account?.seed} />
        );
    }
  };

  return (
    <>
      {renderStep(step)}
    </>
  );
};

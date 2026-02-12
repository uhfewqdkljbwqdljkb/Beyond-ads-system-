import React from 'react';
import { Check, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button.jsx';

export const MultiStepForm = ({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isValid,
  submitLabel = "Submit",
  children
}) => {
  const isLastStep = currentStep === steps.length;

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Progress Bar */}
      <div className="px-6 py-6 border-b border-zinc-50 bg-surface/30">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          {/* Connector Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-zinc-100 -z-10 mx-8" />
          
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 group">
                <div 
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-4
                    ${isCompleted ? 'bg-emerald-500 border-white text-white shadow-sm' : 
                      isActive ? 'bg-primary border-white text-white shadow-md scale-110' : 
                      'bg-white border-zinc-100 text-zinc-300'}
                  `}
                >
                  {isCompleted ? <Check size={16} strokeWidth={4} /> : stepNum}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-zinc-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-8 py-8 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-zinc-100 bg-white flex items-center justify-between shrink-0">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="text-zinc-400 hover:text-zinc-900"
        >
          Cancel
        </Button>
        
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <Button 
              variant="subtle" 
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => onStepChange(currentStep - 1)}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          
          {isLastStep ? (
            <Button 
              onClick={onSubmit} 
              isLoading={isSubmitting}
              disabled={!isValid}
              className="min-w-[120px]"
            >
              {submitLabel}
            </Button>
          ) : (
            <Button 
              rightIcon={<ChevronRight size={16} />}
              onClick={() => onStepChange(currentStep + 1)}
              disabled={!isValid}
              className="min-w-[120px]"
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
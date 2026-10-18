interface MasteryToastProps {
  visible: boolean;
  gain: number;
}

export default function MasteryToast({ visible, gain }: MasteryToastProps) {
  return (
    <div 
      className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg bg-blue-600 text-white text-sm font-medium transition-all duration-300 z-50 transform 
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      +{gain} mastery gained
    </div>
  );
}

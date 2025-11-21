
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://iili.io/f3oxHQI.jpg",
      title: "زهقت من المواعيد المضروبة؟",
      desc: "التيم عندك كل ما تسألهم على التاسك يقولولك 'بكرة إن شاء الله' وبكرة مبيجيش؟ الديدلاين بقى مجرد اقتراح مش إلتزام؟",
      sub: "إحنا حاسين بيك.."
    },
    {
      id: 2,
      image: "https://iili.io/f3ounSe.jpg",
      title: "الحل: نظام \"شد ودان\" الصارم",
      desc: "مفيش هزار هنا. نظام إدارة مهام مربوط بذكاء اصطناعي (شد ودان) بيراقب كل كبيرة وصغيرة. لو التاسك اتأخرت، السيستم مش هيبعت إيميل.. السيستم هيحفل عليك.",
      sub: "الذكاء الاصطناعي بقى توكسيك."
    },
    {
      id: 3,
      image: "https://iili.io/f3nkzIj.jpg",
      title: "الفضيحة بدل الخصم",
      desc: "بدل ما نخصم فلوس، إحنا هنخلي المتخاذل يدفع من كرامته. أحكام محرجة، بوستات اعتذار، وتغيير صور بروفايل.",
      sub: "مستعد للعبة؟"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />

      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg border border-slate-200 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center min-h-[600px]">
        
        <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
          <div className="transition-all duration-500 flex items-center justify-center w-full h-64 bg-transparent">
             <img 
                src={slides[step].image} 
                alt={slides[step].title} 
                className="max-w-full max-h-full object-contain rounded-[20px] shadow-sm" 
             />
          </div>
          
          <div className="space-y-3 animate-fade-in">
            <h1 className="text-3xl font-black text-slate-800">{slides[step].title}</h1>
            <p className="text-slate-500 text-lg leading-relaxed">{slides[step].desc}</p>
            <p className="text-nazir-500 font-bold text-sm tracking-wider mt-2">{slides[step].sub}</p>
          </div>
        </div>

        <div className="w-full mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-nazir-dark' : 'w-2 bg-slate-200'}`} 
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="group bg-nazir-dark hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10"
          >
            {step === slides.length - 1 ? 'يلا بينا' : 'التالي'}
            {step === slides.length - 1 ? null : <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />}
          </button>
        </div>

      </div>
    </div>
  );
};

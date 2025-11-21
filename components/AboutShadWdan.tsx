
import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Play, Zap, Star, AlertTriangle } from 'lucide-react';

export const AboutShadWdan: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* --- NAV --- */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 pointer-events-none">
        <button 
            onClick={goBack} 
            className="pointer-events-auto group flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-md hover:bg-white text-nazir-dark rounded-full shadow-lg border border-slate-200 transition-all transform hover:-translate-y-1 font-bold"
        >
            <ArrowLeft size={20} />
            <span className="hidden md:inline">رجوع للمكتب</span>
        </button>
      </div>

      {/* --- SECTION 1: THE HERO (White Background) --- */}
      <section className="relative pt-32 pb-48 md:pb-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12 relative z-10">
            
            {/* Text Content */}
            <div className="text-center md:text-right order-2 md:order-1">
                <h4 className="text-amber-500 font-black text-xl md:text-2xl mb-2 uppercase tracking-widest">تعرف على</h4>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-tight mb-6">
                    شـــد<br/>ودان
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-bold max-w-md ml-auto leading-relaxed">
                    السيستم ده مش معمول عشان يدلعك. ده معمول عشان يخلي "الديدلاين" ليه هيبة.
                    نظام إدارة مهام توكسيك.. بس لمصلحتك.
                </p>

                <div className="mt-10 flex flex-col md:flex-row items-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/40 animate-pulse cursor-pointer hover:scale-110 transition-transform">
                      <Play fill="white" className="text-white ml-1" size={28} />
                   </div>
                   <span className="font-bold text-slate-400 uppercase tracking-wider text-sm">شاهد المعاناة</span>
                </div>
            </div>

            {/* Hero Character (Logo) */}
            <div className="order-1 md:order-2 flex justify-center relative">
                 <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 animate-fade-in">
                    <img 
                        src="https://iili.io/f3oqJuS.png" 
                        alt="Shad Wdan Character" 
                        className="w-full h-full object-contain drop-shadow-2xl hover:rotate-3 transition-transform duration-500"
                    />
                     {/* Decorative Badge */}
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl -rotate-6 transform border-2 border-slate-100">
                        <span className="font-black text-2xl text-slate-800 block text-center leading-none">
                            100%<br/><span className="text-sm text-amber-500">جودة</span>
                        </span>
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 2: THE PROBLEM (Yellow/Amber Slanted Background) --- */}
      <section className="relative py-32 bg-amber-400 transform -skew-y-3 origin-top-left mt-[-50px] z-20 border-t-8 border-white">
        {/* Un-skew content */}
        <div className="transform skew-y-3 max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 items-center gap-12">
                
                {/* Character Image (Floating Over Edges) */}
                <div className="relative flex justify-center md:-mt-20">
                    <img 
                        src="https://iili.io/f3oxHQI.jpg" 
                        alt="The Victim" 
                        className="w-72 md:w-96 rounded-[40px] border-8 border-white shadow-2xl rotate-3 hover:-rotate-1 transition-transform duration-500"
                    />
                    
                    {/* Signboard Graphic similar to 'I'm with stupid' */}
                    <div className="absolute bottom-10 -left-10 md:-left-20 bg-[#d2b48c] p-6 shadow-xl transform -rotate-12 border-t-4 border-l-4 border-[#c1a27a]">
                        <h3 className="font-black text-slate-800 text-3xl text-center leading-none" style={{fontFamily: 'cursive'}}>
                            أنا<br/>مكسّل
                        </h3>
                        <div className="w-full h-1 bg-black/10 my-2"></div>
                        <div className="flex justify-center">
                             <ArrowLeft className="text-slate-800" size={32} strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center md:text-right text-slate-900">
                    <h4 className="text-white/80 font-black text-xl md:text-2xl mb-2 uppercase tracking-widest">قابل الضحية</h4>
                    <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-md mb-6">
                        الموظف<br/>الكسول
                    </h1>
                    <p className="text-slate-800 text-lg md:text-xl font-bold leading-relaxed">
                         دايماً عنده أعذار. "النت فصل"، "اللاب توب سخن"، "قطتي عندها اكتئاب".
                         الشخص ده محتاج معاملة خاصة. محتاج حد يفكره إن الشغل مش "Open Buffet" تختار منه اللي يعجبك.
                    </p>
                     <div className="mt-10 flex justify-center md:justify-start">
                        <div className="bg-white text-amber-600 px-8 py-4 rounded-full font-black text-xl shadow-lg flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                            <AlertTriangle fill="currentColor" size={24} />
                            <span>مطلوب القبض عليه</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 3: THE PUNISHMENT (White Slanted) --- */}
      <section className="relative py-32 bg-white transform -skew-y-3 mt-[-80px] pt-40 z-10 border-t-8 border-slate-900/5">
         <div className="transform skew-y-3 max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 items-center gap-12">
                 
                 {/* Text Content */}
                 <div className="text-center md:text-right order-2 md:order-1">
                    <h4 className="text-red-500 font-black text-xl md:text-2xl mb-2 uppercase tracking-widest">طريقة التعامل</h4>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6">
                        السلخانة<br/><span className="text-red-500">العلنية</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-bold leading-relaxed mb-6">
                        مفيش خصم فلوس.. الفلوس بتروح وتيجي. الكرامة هي اللي مبتتعوضش.
                        النظام بيحكم عليك بعقوبات اجتماعية محرجة قدام التيم كله.
                    </p>
                    <ul className="space-y-3 font-bold text-slate-600 text-right inline-block">
                        <li className="flex items-center gap-3"><Star fill="#f59e0b" className="text-amber-500" /> تغني مهرجانات بصوتك</li>
                        <li className="flex items-center gap-3"><Star fill="#f59e0b" className="text-amber-500" /> تتصور سيلفي من زاوية مرعبة</li>
                        <li className="flex items-center gap-3"><Star fill="#f59e0b" className="text-amber-500" /> تغير صورتك لـ "بطاطا"</li>
                    </ul>
                </div>

                {/* Character Image */}
                <div className="order-1 md:order-2 relative flex justify-center md:-mt-10">
                     <img 
                        src="https://iili.io/f3nkzIj.jpg" 
                        alt="The Punishment" 
                        className="w-72 md:w-96 rounded-[40px] border-8 border-amber-400 shadow-2xl -rotate-3 hover:rotate-2 transition-transform duration-500"
                    />
                    <div className="w-20 h-20 rounded-full bg-red-500 absolute -top-6 -right-6 border-4 border-white flex items-center justify-center shadow-lg animate-bounce">
                        <Zap fill="white" className="text-white" size={32} />
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER (Creative Card Section) --- */}
      <section className="relative pt-20 pb-32 px-6 bg-white overflow-hidden">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-16">
             
             {/* Creative Card */}
             <div className="relative flex justify-center order-2 md:order-1 mt-10 md:mt-0">
                 <div className="relative group w-full max-w-sm cursor-default">
                     {/* Back decorative card (Shadow) */}
                     <div className="absolute inset-0 bg-slate-900 translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
                     
                     {/* Main Card */}
                     <div className="relative bg-amber-400 p-3 z-10 transition-transform group-hover:-translate-y-2">
                         {/* Image Container - Sharp */}
                         <div className="bg-white mb-4 relative overflow-hidden">
                             <img 
                               src="https://iili.io/f3ounSe.jpg" 
                               alt="Ready?" 
                               className="w-full h-72 object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-700" 
                             />
                             <div className="absolute bottom-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                 Recruiting
                             </div>
                         </div>
                         
                         {/* Card Content */}
                         <div className="p-4 text-center border-2 border-slate-900 bg-white">
                             <h2 className="text-4xl font-black text-slate-900 uppercase leading-none mb-2">
                                 مطلوب متطوعين
                             </h2>
                             <p className="font-bold text-slate-500 text-sm">
                                 هل تمتلك الشجاعة الكافية؟
                             </p>
                             <div className="mt-4 flex justify-center gap-2">
                                 <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                                 <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                                 <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                             </div>
                         </div>
                     </div>

                     {/* Floating Sticker */}
                     <div className="absolute -top-8 -right-8 bg-white p-4 shadow-xl rotate-12 border-2 border-slate-100 z-20 group-hover:rotate-6 transition-transform">
                         <span className="font-black text-2xl text-amber-500 block text-center leading-none">
                             JOIN<br/>NOW
                         </span>
                     </div>
                 </div>
             </div>

             {/* Text & CTA */}
             <div className="text-center md:text-right order-1 md:order-2">
                  <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                     القرار<br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-red-600">
                         قرارك إنت
                     </span>
                  </h2>
                  <p className="text-xl text-slate-500 font-bold mb-10 leading-relaxed max-w-lg ml-auto">
                     النظام ده مش لأي حد. ده للناس اللي عايزة تنجز وتتعلم الالتزام.. حتى لو بالطريقة الصعبة.
                     لو خايف على "الـ Image" بتاعتك، المكان ده مش ليك.
                  </p>

                  <button 
                   onClick={goBack}
                   className="relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-black text-white bg-slate-900 transition-all duration-300 hover:bg-nazir-500 hover:scale-105 shadow-2xl group"
                 >
                   <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                   <span className="relative flex items-center gap-4 text-2xl">
                       <span>أنا قدها (ابدأ)</span>
                       <ArrowLeft size={28} className="group-hover:-translate-x-2 transition-transform" />
                   </span>
                 </button>
             </div>
         </div>
      </section>

    </div>
  );
};

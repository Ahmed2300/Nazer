
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Bot, Key, Users, Shield, ExternalLink, CheckCircle } from 'lucide-react';

interface HowToGuideProps {
    onClose: () => void;
}

const steps = [
    {
        id: 1,
        title: 'إنشاء بوت تيليجرام',
        subtitle: 'الخطوة الأولى: كلم BotFather',
        icon: Bot,
        color: 'bg-blue-500',
        instructions: [
            { text: 'افتح تيليجرام وابحث عن', highlight: '@BotFather' },
            { text: 'ابعت له الأمر', highlight: '/newbot' },
            { text: 'اختار اسم للبوت (مثال: شد ودان بوت)' },
            { text: 'اختار يوزرنيم للبوت (لازم ينتهي بـ bot)' },
        ],
        tip: '💡 BotFather هو البوت الرسمي من تيليجرام لإنشاء البوتات',
        link: 'https://t.me/BotFather',
        linkText: 'افتح BotFather',
    },
    {
        id: 2,
        title: 'نسخ التوكن',
        subtitle: 'الخطوة الثانية: احفظ التوكن',
        icon: Key,
        color: 'bg-amber-500',
        instructions: [
            { text: 'بعد إنشاء البوت، BotFather هيبعتلك رسالة فيها التوكن' },
            { text: 'التوكن شكله كده:', highlight: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz' },
            { text: 'انسخ التوكن كامل (اضغط عليه مطولاً)' },
            { text: 'احفظه في مكان آمن - هتحتاجه بعدين!' },
        ],
        tip: '⚠️ التوكن ده سري! متشاركوش مع حد',
        warning: true,
    },
    {
        id: 3,
        title: 'إنشاء قناة (Channel)',
        subtitle: 'الخطوة الثالثة: اعمل قناة للتيم',
        icon: Users,
        color: 'bg-teal-500',
        instructions: [
            { text: 'افتح تيليجرام واضغط على "قناة جديدة" أو "New Channel"' },
            { text: 'اختار اسم للقناة (مثال: فريق العمل)' },
            { text: 'اختار نوع القناة: عامة أو خاصة' },
            { text: 'ممكن تستخدم قناة موجودة عندك بالفعل' },
        ],
        tip: '📢 القناة أفضل للإعلانات الرسمية - البوت هيبعت الإشعارات فيها',
    },
    {
        id: 4,
        title: 'إضافة البوت كأدمن',
        subtitle: 'الخطوة الرابعة: البوت يبقى أدمن',
        icon: Shield,
        color: 'bg-purple-500',
        instructions: [
            { text: 'افتح إعدادات القناة (اضغط على اسم القناة)' },
            { text: 'اضغط على "Administrators" أو "المسؤولون"' },
            { text: 'اضغط على "Add Admin" وابحث عن البوت' },
            { text: 'فعّل صلاحية "Post Messages" أو "نشر الرسائل"' },
        ],
        tip: '🔑 البوت لازم يكون أدمن عشان يقدر يبعت رسائل في القناة',
    },
    {
        id: 5,
        title: 'الحصول على Channel ID',
        subtitle: 'الخطوة الأخيرة: جيب الـ ID',
        icon: Key,
        color: 'bg-rose-500',
        instructions: [
            { text: 'ابعت أي رسالة في القناة' },
            { text: 'افتح اللينك ده في المتصفح:' },
            { text: '', highlight: 'api.telegram.org/bot[TOKEN]/getUpdates' },
            { text: 'استبدل [TOKEN] بالتوكن بتاعك' },
            { text: 'ابحث عن "chat":{"id": وانسخ الرقم (هيكون سالب)', highlight: '-100xxxxxxxxxx' },
        ],
        tip: '📝 الـ Channel ID بيبدأ بـ -100 للقنوات',
        link: 'https://t.me/RawDataBot',
        linkText: 'أو استخدم @RawDataBot',
    },
];

export const HowToGuide: React.FC<HowToGuideProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = steps[currentStep];
    const Icon = step.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
                {/* Header */}
                <div className={`${step.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-black/10" />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Icon size={32} />
                        </div>
                        <div>
                            <p className="text-white/80 text-sm font-bold mb-1">{step.subtitle}</p>
                            <h2 className="text-2xl font-black">{step.title}</h2>
                        </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex gap-2 mt-6 justify-center">
                        {steps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentStep(idx)}
                                className={`h-2 rounded-full transition-all ${idx === currentStep
                                    ? 'w-8 bg-white'
                                    : idx < currentStep
                                        ? 'w-2 bg-white/60'
                                        : 'w-2 bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    {/* Instructions */}
                    <div className="space-y-4 mb-6">
                        {step.instructions.map((instruction, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-full ${step.color} text-white flex items-center justify-center flex-shrink-0 text-sm font-bold`}>
                                    {idx + 1}
                                </div>
                                <p className="text-slate-700 font-medium leading-relaxed pt-0.5">
                                    {instruction.text}
                                    {instruction.highlight && (
                                        <code className="mx-1 px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-sm border border-slate-200">
                                            {instruction.highlight}
                                        </code>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Tip Box */}
                    <div className={`p-4 rounded-xl ${step.warning ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-200'}`}>
                        <p className={`text-sm font-bold ${step.warning ? 'text-amber-700' : 'text-slate-600'}`}>
                            {step.tip}
                        </p>
                    </div>

                    {/* External Link */}
                    {step.link && (
                        <a
                            href={step.link}
                            target="_blank"
                            rel="noreferrer"
                            className={`mt-4 flex items-center justify-center gap-2 ${step.color} text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-opacity`}
                        >
                            <ExternalLink size={18} />
                            {step.linkText}
                        </a>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${currentStep === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <ChevronRight size={20} />
                        السابق
                    </button>

                    <span className="text-slate-400 font-bold text-sm">
                        {currentStep + 1} / {steps.length}
                    </span>

                    {currentStep === steps.length - 1 ? (
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                        >
                            <CheckCircle size={20} />
                            تمام، فهمت!
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${step.color} text-white hover:opacity-90 transition-opacity`}
                        >
                            التالي
                            <ChevronLeft size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

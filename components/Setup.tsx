
import React, { useState } from 'react';
import { Hash, Key, CheckCircle, ArrowLeft, Type, Image as ImageIcon, Upload, BookOpen } from 'lucide-react';
import { uploadToImgBB } from '../services/imageService';
import { HowToGuide } from './HowToGuide';

interface SetupProps {
  onSaveConfig: (token: string, channelId: string, name: string, image: string) => void;
  onCancel?: () => void;
}

export const Setup: React.FC<SetupProps> = ({ onSaveConfig, onCancel }) => {
  const [token, setToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token && channelId && teamName) {
      setLoading(true);

      let finalImageUrl = '';
      if (selectedImage) {
        const uploadedUrl = await uploadToImgBB(selectedImage);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      await onSaveConfig(token, channelId, teamName, finalImageUrl);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-slate-200 p-10 rounded-3xl shadow-xl relative my-10">
        {onCancel && (
          <button onClick={onCancel} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold">
            <ArrowLeft size={16} /> رجوع
          </button>
        )}

        <div className="text-center mb-8 mt-4">
          <img
            src="https://iili.io/f3oqJuS.png"
            alt="Shad Wdan Logo"
            className="w-20 h-20 mx-auto mb-4 drop-shadow-md"
          />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">تأسيس كتيبة جديدة</h2>
          <p className="text-slate-500 text-sm">دخل بيانات البوت والجروب عشان نأسس غرفة عمليات (Dashboard) جديدة.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Team Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اسم الكتيبة (الروم)</label>
            <div className="relative group">
              <Type className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder-slate-400 text-sm focus:bg-white"
                placeholder="مثال: وحوش الجافاسكريبت"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">لوجو الكتيبة (اختياري)</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-slate-300" size={24} />
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-500 rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all text-sm font-bold">
                  <Upload size={16} />
                  {selectedImage ? 'تغيير الصورة' : 'رفع صورة'}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4"></div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4 text-sm text-slate-500 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-700">خطوات الإعداد:</span>
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold text-xs bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <BookOpen size={14} /> دليل مصور
              </button>
            </div>
            <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">1</span> اعمل بوت جديد من @BotFather وهات التوكن.</p>
            <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">2</span> ضيف البوت أدمن في الجروب بتاعكم.</p>
            <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">3</span> هات الـ Channel/Group ID.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Bot API Token</label>
            <div className="relative group">
              <Key className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder-slate-400 font-mono text-sm focus:bg-white"
                placeholder="123456789:AbCdEfGhIjKlMnOpQrStUvWxYz"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Channel / Group ID</label>
            <div className="relative group">
              <Hash className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder-slate-400 font-mono text-sm focus:bg-white"
                placeholder="-100123456789"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/20 transition-all transform active:scale-95 text-lg mt-6 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'جاري رفع البيانات...' : <> <CheckCircle size={20} /> تأسيس وبدء العمل </>}
          </button>
        </form>
      </div>

      {/* How-To Guide Modal */}
      {showGuide && <HowToGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
};

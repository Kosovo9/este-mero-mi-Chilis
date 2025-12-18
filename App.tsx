import React, { useState, useRef } from 'react';
import { TRANSLATIONS, STYLES } from './constants';
import { AppState, StyleOption, SubjectType } from './types';
import { generateChristmasImage } from './services/geminiService';
import { startLiveSession, stopLiveSession } from './services/liveService';
import { UploadIcon, CheckIcon, SparklesIcon, EditIcon, LockIcon } from './components/Icons';
import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';
import { AffiliateModal, DonationModal, PricingModal } from './components/Modals';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'landing',
    language: 'en',
    selectedSubjectType: null,
    selectedImage: null,
    selectedStyle: null,
    customPrompt: '',
    generatedImage: null,
    error: null,
    isVoiceActive: false,
    activeModal: 'none',
    credits: 1
  });

  const [activeTab, setActiveTab] = useState<'studio' | 'global'>('studio');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[state.language];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, selectedImage: reader.result as string, step: 'subject' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.selectedImage || !state.selectedStyle || !state.selectedSubjectType) return;
    if (state.credits <= 0) {
      setState(prev => ({ ...prev, activeModal: 'pricing' }));
      return;
    }

    setState(prev => ({ ...prev, step: 'processing', error: null }));
    try {
      const result = await generateChristmasImage(
        state.selectedImage!,
        state.selectedStyle!,
        state.selectedSubjectType!,
        state.customPrompt
      );
      setState(prev => ({ ...prev, generatedImage: result, step: 'result', credits: prev.credits - 1 }));
    } catch (err) {
      setState(prev => ({ ...prev, step: 'style', error: t.error }));
    }
  };

  const handleReset = () => {
    setState({
      ...state,
      step: 'landing',
      selectedImage: null,
      selectedStyle: null,
      selectedSubjectType: null,
      generatedImage: null,
      error: null
    });
  };

  // --- RENDERS ---

  const renderSubject = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 animate-fadeIn py-12">
      <h2 className="text-4xl md:text-5xl font-serif text-christmas-cream mb-2">{t.subjectTitle}</h2>
      <p className="text-christmas-cream/50 mb-12">Identify subjects to ensure identity lock 1:1 precision.</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl">
        {(['couple', 'family', 'kids', 'man', 'woman'] as SubjectType[]).map(type => (
          <button
            key={type}
            onClick={() => setState(prev => ({ ...prev, selectedSubjectType: type, step: 'style' }))}
            className="p-8 rounded-3xl bg-white/5 border-2 border-white/10 hover:border-christmas-gold hover:bg-christmas-gold/10 transition-all group flex flex-col items-center"
          >
            <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">
              {type === 'couple' ? '👩‍❤️‍👨' : type === 'family' ? '👨‍👩‍👧‍👦' : type === 'kids' ? '👶' : type === 'man' ? '🧔' : '👩'}
            </span>
            <span className="font-bold text-sm uppercase tracking-widest text-christmas-cream group-hover:text-christmas-gold">{t.subjects[type]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStyle = () => (
    <div className="flex flex-col items-center min-h-screen pt-8 px-4 pb-48 animate-fadeIn w-full">
      <h2 className="text-4xl font-serif text-christmas-cream mb-8">{t.styleTitle}</h2>
      
      {/* Tabs */}
      <div className="flex bg-white/5 p-1.5 rounded-full mb-12 border border-white/10 shadow-lg">
        <button 
          onClick={() => setActiveTab('studio')}
          className={`px-10 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'studio' ? 'bg-christmas-gold text-christmas-dark shadow-lg' : 'text-white/60 hover:text-white'}`}
        >
          {t.categories.studio}
        </button>
        <button 
          onClick={() => setActiveTab('global')}
          className={`px-10 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'global' ? 'bg-christmas-gold text-christmas-dark shadow-lg' : 'text-white/60 hover:text-white'}`}
        >
          {t.categories.global}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl w-full">
        {STYLES.filter(s => s.category === activeTab || s.isCustom).map(style => {
          const isSelected = state.selectedStyle?.id === style.id;
          return (
            <button 
              key={style.id}
              onClick={() => setState(prev => ({ ...prev, selectedStyle: style }))}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all group ${isSelected ? 'border-christmas-gold scale-105 shadow-[0_0_30px_rgba(212,175,55,0.3)] z-10' : 'border-transparent opacity-80 hover:opacity-100'}`}
            >
              <div className="aspect-[4/5] bg-gray-800 relative overflow-hidden">
                <img 
                    src={style.imageSrc} 
                    alt={style.nameKey} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`} 
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60`}></div>
                
                {style.isCustom && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <EditIcon />
                    </div>
                )}
              </div>
              <div className="p-4 bg-black/90 absolute bottom-0 left-0 right-0 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-christmas-cream/90">{t.styles[style.nameKey]}</p>
              </div>
              {isSelected && <div className="absolute top-3 right-3 bg-christmas-gold text-christmas-dark p-1.5 rounded-full shadow-lg"><CheckIcon /></div>}
            </button>
          );
        })}
      </div>

      {state.selectedStyle?.isCustom && (
        <div className="w-full max-w-2xl mt-12 animate-fadeIn">
            <label className="block text-christmas-gold mb-3 font-serif text-lg">{t.customStyleTitle}</label>
            <textarea 
                value={state.customPrompt}
                onChange={(e) => setState(prev => ({ ...prev, customPrompt: e.target.value }))}
                className="w-full p-6 bg-white/5 border border-christmas-gold/30 rounded-2xl text-christmas-cream h-40 outline-none focus:border-christmas-gold transition-colors resize-none shadow-inner"
                placeholder={t.customStylePlaceholder}
            />
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-christmas-dark via-christmas-dark/95 to-transparent flex justify-center z-50 pointer-events-none">
        <button 
          onClick={handleGenerate}
          disabled={!state.selectedStyle || (state.selectedStyle.id === 'custom' && !state.customPrompt)}
          className={`pointer-events-auto px-20 py-5 rounded-full font-bold text-xl transition-all shadow-2xl flex items-center gap-3 active:scale-95 ${
            (!state.selectedStyle || (state.selectedStyle.id === 'custom' && !state.customPrompt))
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            : 'bg-christmas-gold text-christmas-dark hover:bg-yellow-400 hover:scale-105 border border-yellow-300' 
          }`}
        >
          {state.credits <= 0 && <LockIcon />} {t.generateBtn}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-christmas-dark text-christmas-cream selection:bg-christmas-gold selection:text-christmas-dark scroll-smooth">
      <header className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-christmas-dark/80 backdrop-blur-md z-[60]">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={handleReset}>
          <div className="w-10 h-10 bg-christmas-gold rounded-full flex items-center justify-center text-christmas-dark font-serif font-bold text-2xl group-hover:rotate-12 transition-transform">C</div>
          <span className="font-serif text-2xl hidden sm:block">pic.<span className="text-christmas-gold">christmas</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div onClick={() => setState(prev => ({ ...prev, activeModal: 'pricing' }))} className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-full cursor-pointer hover:bg-white/10 transition-all flex items-center gap-3 group">
            <span className="text-christmas-gold text-lg group-hover:scale-125 transition-transform">★</span> 
            <span className="font-bold tracking-tight">{state.credits}</span>
            <div className="w-5 h-5 rounded-full bg-christmas-gold text-christmas-dark flex items-center justify-center text-[10px] font-bold">+</div>
          </div>
          <button 
            onClick={() => setState(prev => ({ ...prev, language: prev.language === 'en' ? 'es' : 'en' }))} 
            className="text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
          >
            {state.language}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto min-h-[70vh]">
        {state.step === 'landing' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fadeIn">
            <div className="mb-12 relative">
                <div className="absolute -inset-20 bg-christmas-gold/10 rounded-full blur-[120px] animate-pulse"></div>
                <h1 className="text-7xl md:text-9xl font-serif mb-8 gold-gradient leading-tight">{t.title}</h1>
                <p className="text-xl md:text-2xl opacity-80 mb-16 max-w-2xl mx-auto font-light leading-relaxed">{t.subtitle}</p>
                <button 
                    onClick={() => setState(prev => ({ ...prev, step: 'upload' }))} 
                    className="group relative px-16 py-6 bg-christmas-gold text-christmas-dark font-black rounded-full text-2xl shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:shadow-[0_0_70px_rgba(212,175,55,0.6)] hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        <SparklesIcon /> {t.ctaStart}
                    </span>
                </button>
            </div>
          </div>
        )}
        {state.step === 'upload' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">{t.uploadTitle}</h2>
            <p className="text-christmas-cream/50 mb-12 text-center max-w-lg">{t.uploadDesc}</p>
            <div 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full max-w-2xl h-96 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-christmas-gold hover:bg-white/5 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-christmas-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 rounded-full bg-white/5 mb-6 group-hover:scale-110 transition-transform">
                <UploadIcon />
              </div>
              <p className="font-serif text-2xl text-christmas-gold">Click or Drop Portrait</p>
              <p className="text-xs text-christmas-cream/30 mt-4 uppercase tracking-[0.2em]">High quality JPG/PNG supported</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          </div>
        )}
        {state.step === 'subject' && renderSubject()}
        {state.step === 'style' && renderStyle()}
        {state.step === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fadeIn">
            <div className="relative w-24 h-24 mb-12">
                <div className="absolute inset-0 border-4 border-christmas-gold/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-christmas-gold rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-christmas-gold"><SparklesIcon /></div>
            </div>
            <h3 className="text-3xl font-serif gold-gradient mb-4">{t.processing}</h3>
            <p className="text-christmas-cream/50 font-light tracking-wide">Identity lock engaged. Fine-tuning Oscar-level lighting...</p>
          </div>
        )}
        {state.step === 'result' && (
          <div className="flex flex-col items-center py-12 px-4 animate-fadeIn">
            <h2 className="text-4xl font-serif mb-12 gold-gradient">Your 8K Masterpiece is Ready</h2>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-[0_50px_100px_rgba(0,0,0,0.6)] mb-16 max-w-3xl w-full transform hover:scale-[1.01] transition-transform">
              <img src={state.generatedImage!} className="w-full h-auto border border-gray-100" alt="Result" />
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
              <a 
                href={state.generatedImage!} 
                download="my-christmas-portrait.jpg" 
                className="flex-1 bg-christmas-green text-white py-5 rounded-full font-bold text-center text-lg hover:bg-green-700 transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {t.downloadBtn}
              </a>
              <button 
                onClick={handleReset} 
                className="flex-1 border-2 border-christmas-gold text-christmas-gold py-5 rounded-full font-bold text-lg hover:bg-christmas-gold/10 transition-all"
              >
                {t.tryAgainBtn}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer t={t} />
      <VoiceAssistant isActive={state.isVoiceActive} onToggle={async () => {
          if (state.isVoiceActive) {
              await stopLiveSession();
              setState(s => ({ ...s, isVoiceActive: false }));
          } else {
              const ok = await startLiveSession(() => setState(s => ({ ...s, isVoiceActive: false })));
              if (ok) setState(s => ({ ...s, isVoiceActive: true }));
          }
      }} t={t} />
      
      <AffiliateModal isOpen={state.activeModal === 'affiliate'} onClose={() => setState(prev => ({ ...prev, activeModal: 'none' }))} t={t} />
      <DonationModal isOpen={state.activeModal === 'donation'} onClose={() => setState(prev => ({ ...prev, activeModal: 'none' }))} t={t} />
      <PricingModal isOpen={state.activeModal === 'pricing'} onClose={() => setState(prev => ({ ...prev, activeModal: 'none' }))} onPurchase={(n) => setState(prev => ({ ...prev, credits: prev.credits + n }))} t={t} />
    </div>
  );
};

export default App;

import React from 'react';

export const ProTip = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-6 p-5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex gap-4 items-start shadow-[0_2px_10px_rgba(0,229,255,0.05)] text-right rtl">
      <div className="flex-shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20"></path>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      <div>
        <h4 className="text-[#00E5FF] font-bold text-sm tracking-wider uppercase mb-1">טיפ של מקצוענים</h4>
        <div className="text-white/80 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

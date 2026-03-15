import React from 'react';

export const InteractiveWidget = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] bg-[#09090b]">
      <div className="px-6 py-4 bg-[#121217] border-b border-white/5 flex items-center justify-between">
         <h3 className="text-white font-bold text-sm tracking-wider">{title}</h3>
         <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF0055]/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD32F]/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]/50"></div>
         </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

import React from 'react';

const ContentLoader = () => {
    return (
        <div className="p-4 w-full mx-auto">
            <div className="animate-pulse flex space-x-6">
                <div className="rounded-full bg-slate-200 h-40 w-40"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="space-y-3 animate-pulse mt-[15px]">
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-3 mt-[10px] animate-pulse">
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded"></div>
            </div>
        </div>
    )
}

export default ContentLoader;
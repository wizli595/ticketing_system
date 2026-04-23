export default function RootLoading() {
  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Pulsing logo */}
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary-600 flex items-center justify-center animate-pulse-slow">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </div>

        {/* Spinner bar */}
        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-1/3 bg-primary-500 rounded-full animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </div>

        <p className="text-sm text-slate-400 dark:text-slate-500 mt-4 font-medium">Loading...</p>
      </div>
    </div>
  );
}

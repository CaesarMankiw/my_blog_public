export default function BackgroundGrid() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-200/40 rounded-full mix-blend-multiply blur-[80px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-indigo-200/40 rounded-full mix-blend-multiply blur-[80px] animate-blob [animation-delay:2s]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-pink-200/30 rounded-full mix-blend-multiply blur-[80px] animate-blob [animation-delay:4s]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/80 via-transparent to-slate-50/80" />
    </div>
  );
}

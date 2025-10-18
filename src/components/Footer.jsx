export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-3">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-2">
            <img src="/ch.png" alt="commentHub logo" className="h-5 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-[#1e3a5f]">
                Comment
              </span>
              <span className="text-xs font-bold text-[#3b82f6]">Hub</span>
            </div>
          </div>

          {/* Slogan */}
          <p className="text-sm text-gray-600 italic">
            Where every voice finds its thread
          </p>
        </div>
      </div>
    </footer>
  );
}

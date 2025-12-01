import Link from 'next/link';
import { FaExclamationTriangle, FaArrowLeft, FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-custom-black via-custom-jet to-custom-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="glass-dark rounded-3xl p-12 border border-white/10">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-custom-accent/20 mb-8">
            <FaExclamationTriangle className="text-custom-accent text-4xl" />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-custom-seasalt mb-6">
            Blog Post Not Found
          </h2>

          {/* Description */}
          <p className="text-custom-platinum text-lg mb-8 max-w-md mx-auto">
            The blog post you're looking for doesn't exist or may have been removed.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
            >
              <FaArrowLeft /> Back to Blog
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 glass-dark border border-white/20 text-white font-semibold rounded-xl hover:border-custom-accent transition-all"
            >
              <FaHome /> Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

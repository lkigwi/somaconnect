import { useState } from 'react';

const LABELS = ['', 'Poor 😕', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent! 🌟'];

export default function RatingModal({ session, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ sessionId: session.id, tutorName: session.tutor, rating, comment });
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
        style={{ animation: 'scaleIn 0.25s ease-out' }}
      >
        {/* Avatar + heading */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-black text-xl">{session.avatar}</span>
          </div>
          <h3 className="text-2xl font-black text-navy">Rate Your Session</h3>
          <p className="text-gray-500 text-sm mt-1">
            with <strong className="text-navy">{session.tutor}</strong> · {session.subject}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span>⭐</span>
            Rating required to continue
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1.5 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="text-5xl leading-none transition-all duration-100 hover:scale-125 focus:outline-none"
              style={{ color: star <= (hover || rating) ? '#F4A261' : '#E5E7EB' }}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-gray-500 h-5 mb-5 transition-all">
          {LABELS[hover || rating] || 'Tap a star to rate'}
        </p>

        {/* Comment */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Leave a comment <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!rating || submitting}
          className={`w-full py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
            rating && !submitting
              ? 'bg-gradient-to-r from-teal to-blue-600 text-white hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-teal/30'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            '⭐ Submit & Continue'
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Your feedback helps tutors improve.
        </p>
      </div>
    </div>
  );
}

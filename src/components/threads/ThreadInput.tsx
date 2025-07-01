import PropTypes from 'prop-types';
import useInput from '../../hooks/UseInput';
import { Send, Hash, Type, MessageSquare } from 'lucide-react';

export interface AddThreadProp {
    title: string;
    body: string;
    category: string;
}

interface ThreadInputProps {
    addThread: (thread: AddThreadProp) => void;
    isSubmitting?: boolean;
}

export default function ThreadInput({ addThread, isSubmitting = false }: ThreadInputProps) {
  const { value: title, onChange: onTitleChange } = useInput('');
  const { value: body, onChange: onBodyChange } = useInput('');
  const { value: category, onChange: onCategoryChange, setValue: setCategory } = useInput('');

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && category.trim() && body.trim()) {
      addThread({
        title: title.trim(),
        body: body.trim(),
        category: category.trim()
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
                        Buat Thread Baru
          </h2>
          <p className="text-sm text-gray-600 mt-1">Bagikan ide dan pemikiran kamu dengan komunitas</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Type className="w-4 h-4 text-gray-500" />
                            Judul Thread
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={onTitleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Tulis judul yang menarik untuk thread kamu..."
                required
                maxLength={100}
              />
              <div className="absolute right-3 top-3 text-xs text-gray-400">
                {title.length}/100
              </div>
            </div>
          </div>

          {/* Category Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Hash className="w-4 h-4 text-gray-500" />
                            Kategori
            </label>
            <input
              type="text"
              value={category}
              onChange={onCategoryChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="Contoh: teknologi, olahraga, musik, lifestyle..."
              required
              maxLength={30}
            />
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2 mt-2">
                {['teknologi', 'lifestyle', 'musik', 'olahraga'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setCategory(tag)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
                  >
                                        #{tag}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-400">
                {category.length}/30
              </div>
            </div>
          </div>

          {/* Body Textarea */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4 text-gray-500" />
                            Isi Thread
            </label>
            <div className="relative">
              <textarea
                value={body}
                onChange={(event) => onBodyChange(event)}
                rows={6}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Tulis ide, pemikiran, atau pertanyaan kamu di sini. Jelaskan dengan detail agar pembaca bisa memahami dengan baik..."
                required
                maxLength={500}
              />
              <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                {body.length}/500
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                Thread akan langsung dipublikasi
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !category.trim() || !body.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                                    Publikasikan Thread
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 Tips untuk Thread yang Menarik:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Gunakan judul yang jelas dan menarik perhatian</li>
          <li>• Pilih kategori yang tepat agar mudah ditemukan</li>
          <li>• Jelaskan ide kamu dengan detail dan terstruktur</li>
          <li>• Ajukan pertanyaan untuk memancing diskusi</li>
        </ul>
      </div>
    </div>
  );
}

ThreadInput.propTypes = {
  addThread: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};
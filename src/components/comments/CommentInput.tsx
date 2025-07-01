import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader2, Info, Smile, } from 'lucide-react';
import useInput from '../../hooks/UseInput';

interface CommentInputProps {
  addComment: (comment: string) => void;
}

export default function CommentInput({ addComment }: CommentInputProps) {
  const { value: comment, onChange: onCommentChange, setValue: setComment } = useInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const onCommentSubmit = async () => {
    if (comment.trim() === '' || isLoading) return;

    setIsLoading(true);
    try {
      await addComment(comment.trim());
      setComment('');
      setIsFocused(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onCommentSubmit();
    }
    if (e.key === 'Escape') {
      setIsFocused(false);
      textareaRef.current?.blur();
    }
  };

  const handleClear = () => {
    setComment('');
    setIsFocused(false);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = comment.substring(0, start) + emoji + comment.substring(end);
      setComment(newValue);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😊', '😄', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '😂', '😭', '🙏'];

  const characterCount = comment.length;
  const maxCharacters = 1000;
  const isNearLimit = characterCount > maxCharacters * 0.8;
  const isOverLimit = characterCount > maxCharacters;
  const progress = (characterCount / maxCharacters) * 100;

  return (
    <section className="mt-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Tulis Komentar
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bagikan pendapat Anda tentang topik ini
            </p>
          </div>
        </div>

        {/* Character Progress */}
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="100, 100"
                className="text-gray-200 dark:text-gray-700"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${progress}, 100`}
                className={`transition-all duration-300 ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-blue-500'
                  }`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-medium ${isOverLimit ? 'text-red-600 dark:text-red-400' :
                  isNearLimit ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                }`}>
                {characterCount > 99 ? '99+' : characterCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Container */}
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 ${isFocused
          ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={3}
          value={comment}
          onChange={onCommentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          maxLength={maxCharacters}
          className={`w-full rounded-t-2xl p-4 text-sm text-gray-900 dark:text-gray-100 bg-transparent resize-none focus:outline-none transition-all duration-200 min-h-[80px] max-h-[200px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          placeholder="Tulis komentar yang membangun dan relevan..."
          aria-label="Tulis komentar Anda"
          style={{ scrollbarWidth: 'thin' }}
        />

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700"></div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4">
          {/* Left Tools */}
          <div className="flex items-center space-x-2">
            {/* Emoji Picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Tambah emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="grid grid-cols-6 gap-1">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="hidden sm:flex items-center text-xs text-gray-500 dark:text-gray-400">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Ctrl
              </kbd>
              <span className="mx-1">+</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Enter
              </kbd>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Clear Button */}
            {comment.trim() && (
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-1" />
                Batal
              </button>
            )}

            {/* Submit Button */}
            <button
              onClick={onCommentSubmit}
              disabled={comment.trim() === '' || isLoading || isOverLimit}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 ${comment.trim() === '' || isLoading || isOverLimit
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">Tips untuk komentar yang baik:</p>
          <ul className="space-y-1 text-xs">
            <li>• Gunakan bahasa yang sopan dan konstruktif</li>
            <li>• Pastikan komentar relevan dengan topik diskusi</li>
            <li>• Hindari spam, flamming, atau konten yang menyinggung</li>
          </ul>
        </div>
      </div>

      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </section>
  );
}
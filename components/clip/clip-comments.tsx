'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'

interface Comment {
  id: string
  id_customer: string
  id_nft_item: string
  comment: string
  dates: string
  name: string
  avatar: string
  avatar_url: string
  time_ago: string
  heart: string
  isLiked?: boolean
}

interface ClipCommentsProps {
  showComments: boolean
  comments: Comment[]
  commentsLoading: boolean
  commentInput: string
  isSubmittingComment: boolean
  showAllComments: boolean
  onClose: () => void
  onCommentInputChange: (value: string) => void
  onSubmitComment: (e: React.FormEvent) => void
  onShowAllComments: (show: boolean) => void
  onLikeComment: (commentId: string) => void
  isMobile?: boolean
  videoOrientation?: 'portrait' | 'landscape'
  onChangeOrientation?: (o: 'portrait' | 'landscape') => void
}

export function ClipComments({
  showComments,
  comments,
  commentsLoading,
  commentInput,
  isSubmittingComment,
  showAllComments,
  onClose,
  onCommentInputChange,
  onSubmitComment,
  onShowAllComments,
  onLikeComment,
  isMobile = false,
}: ClipCommentsProps) {
  const displayedComments = showAllComments ? comments : comments.slice(0, 5)

  if (!showComments) return null

  // --- DESKTOP VERSION ---
  if (!isMobile) {
    return (
      <div className="col-span-4 bg-[#0b0f19] border border-white/10 flex flex-col h-[82vh] z-50 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-bold text-lg">Komentar</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {commentsLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4 px-4 pb-10">
              {displayedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Image src={comment.avatar_url} alt={comment.name} width={40} height={40} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{comment.name}</p>
                    <p className="text-gray-300 text-xs mt-1 leading-relaxed break-words">{comment.comment}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-gray-500 text-xs">{comment.time_ago}</span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onLikeComment(comment.id)
                        }}
                        className={`flex items-center gap-1 transition-colors active:scale-110 ${
                          comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart 
                          className="w-3 h-3" 
                          strokeWidth={2} 
                          fill={comment.isLiked ? "currentColor" : "none"} 
                        />
                        <span className="text-xs">{comment.heart}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length > 5 && !showAllComments && (
                <button
                  onClick={() => onShowAllComments(true)}
                  className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                >
                  View more comments ({comments.length - 5})...
                </button>
              )}
              {comments.length > 5 && showAllComments && (
                <button
                  onClick={() => onShowAllComments(false)}
                  className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                >
                  Show less
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No comments yet</p>
            </div>
          )}
        </div>

        <form onSubmit={onSubmitComment} className="border-t border-white/10 px-4 py-3 bg-[#0b0f19] rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tambahkan komentar..."
              value={commentInput}
              onChange={(e) => onCommentInputChange(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !commentInput.trim()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
            >
              {isSubmittingComment ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // --- MOBILE VERSION ---
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full bg-[#1a1a2e] border-t border-white/20 rounded-t-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <h3 className="text-white font-semibold text-base">Comments</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {commentsLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-5 px-6 py-5 pb-10">
              {displayedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3 pb-4 border-b border-white/5 last:border-b-0">
                  <Image src={comment.avatar_url} alt={comment.name} width={40} height={40} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{comment.name}</p>
                      <span className="text-gray-500 text-xs">{comment.time_ago}</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-2 leading-relaxed break-words">{comment.comment}</p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onLikeComment(comment.id)
                      }}
                      className={`mt-2 flex items-center gap-1 transition-colors active:scale-110 ${
                        comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        strokeWidth={2} 
                        fill={comment.isLiked ? "currentColor" : "none"} 
                      />
                      <span className="text-xs">{comment.heart}</span>
                    </button>
                  </div>
                </div>
              ))}

              {comments.length > 5 && !showAllComments && (
                <button
                  onClick={() => onShowAllComments(true)}
                  className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                >
                  View more comments ({comments.length - 5})...
                </button>
              )}
              {comments.length > 5 && showAllComments && (
                <button
                  onClick={() => onShowAllComments(false)}
                  className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                >
                  Show less
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No comments yet</p>
            </div>
          )}
        </div>

        <form onSubmit={onSubmitComment} className="border-t border-white/10 px-6 py-4 flex-shrink-0 bg-[#1a1a2e]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => onCommentInputChange(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !commentInput.trim()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
            >
              {isSubmittingComment ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
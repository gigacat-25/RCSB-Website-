"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { ChatBubbleLeftRightIcon, UserCircleIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface Comment {
  id: number;
  user_name: string;
  user_email: string;
  user_image: string | null;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  projectId: number;
}

export default function CommentsSection({ projectId }: CommentsSectionProps) {
  const { user, isLoaded } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetch(`https://rcsb-api-worker.impact1-iceas.workers.dev/api/projects/${projectId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          user_name: user.fullName || user.username || "Anonymous",
          user_email: user.primaryEmailAddress?.emailAddress,
          user_image: user.imageUrl,
          content: newComment.trim(),
        }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        const errorData = await res.json();
        console.error("Failed to post comment:", errorData.error);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return <div className="animate-pulse bg-gray-100 h-20 rounded-2xl mb-8"></div>;

  return (
    <div className="mt-20 border-t border-gray-100 pt-16">
      <h3 className="text-3xl font-heading font-black text-brand-blue mb-10 flex items-center gap-4">
        <ChatBubbleLeftRightIcon className="w-8 h-8 text-brand-gold" />
        Conversations ({comments.length})
      </h3>

      {/* Post a comment */}
      <div className="bg-gray-50 p-8 rounded-[40px] mb-12 border border-brand-azure/10">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <img 
                src={user.imageUrl} 
                className="w-12 h-12 rounded-full border-2 border-brand-gold shadow-sm" 
                alt="Your profile"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the conversation..."
                  className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-gold min-h-[120px] transition-all"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-brand-gray font-medium mb-4">Want to share your thoughts?</p>
            <SignInButton mode="modal">
              <button className="bg-brand-gold text-brand-blue px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-brand-azure hover:text-white transition-all">
                Sign in to Comment
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {loading ? (
          [1, 2].map((i) => <div key={i} className="animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>)
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-5 group">
              <div className="flex-shrink-0">
                {comment.user_image ? (
                  <img src={comment.user_image} className="w-12 h-12 rounded-full shadow-sm" alt={comment.user_name} />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-heading font-bold text-brand-blue">{comment.user_name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-brand-gray leading-relaxed bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-none shadow-sm transition-all group-hover:shadow-md">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-50">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-brand-gray italic">No comments yet. Be the first to start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}

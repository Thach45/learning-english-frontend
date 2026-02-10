import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCreatePost,
  useCommunityFeed,
  useListFollowing,
} from "../hooks/useCommunity";
import { FeedItem } from "../types/community";
import FeedCard from "../components/community/FeedCard";
import CreatePostBox from "../components/community/CreatePostBox";
import FriendsListSidebar from "../components/community/FriendsListSidebar";
import FriendsListModal from "../components/community/FriendsListModal";
import { useMe } from "../hooks/useAuthApi";

const UserProgressDashboard: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "posts">("all");
  const [page, setPage] = useState(1);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);

  const createPostMutation = useCreatePost();
  const { data: followingData, isLoading: followingLoading } = useListFollowing(1, 20);
  const { data: user } = useMe();

  // Hook gọi ở top level — khi page thay đổi, query key đổi → tự fetch trang mới
  const { data: feedData, isLoading: feedLoading } = useCommunityFeed({ page, pageSize: 5, filter });

  // Append items khi có data mới + dùng isFinished từ backend
  useEffect(() => {
    if (feedData?.items) {
      setFeedItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = feedData.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newItems];
      });
      setIsFinished(feedData.isFinished);
    }
  }, [feedData]);

  // Reset feedItems khi đổi filter
  useEffect(() => {
    setFeedItems([]);
    setPage(1);
    setIsFinished(false);
  }, [filter]);

  // Infinite scroll: chỉ tăng page khi chưa hết data và không đang loading
  useEffect(() => {
    if (isFinished) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !feedLoading && !isFinished) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "20px", threshold: 0 },
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [feedLoading, isFinished]);
  const handleNewPost = async (payload: {
    content: string;
    privacy: "PUBLIC" | "FOLLOWERS_ONLY" | "PRIVATE";
    type: string;
    sharedStudySetId?: string;
  }) => {
    const { content, privacy, sharedStudySetId } = payload;
    await createPostMutation.mutateAsync({
      content,
      type: payload.type as "USER_POST" | "STUDY_SET_SHARE",
      privacy,
      sharedStudySetId,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Main Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Cộng đồng học tập
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Cập nhật hoạt động và thành tích từ bạn bè.
            </p>
          </div>

          <button className="relative p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-gray-50"></span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT COLUMN: FEED --- */}
          <div className="lg:col-span-8 space-y-6">
            {/* Create Post */}
            {user && (
              <CreatePostBox
                currentUser={user}
                onPost={handleNewPost}
                isSubmitting={createPostMutation.isPending}
              />
            )}

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                Tất cả
              </button>

              <button
                onClick={() => setFilter("posts")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === "posts" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                Thảo luận
              </button>
            </div>

            {/* Feed List */}
            <div className="space-y-4">
              {feedLoading && (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse"
                    />
                  ))}
                </div>
              )}
              <AnimatePresence>
                {feedItems
                  .filter((item) => {
                    if (filter === "all") return true;
                    if (filter === "posts")
                      return (
                        item.type === "post" || item.type === "study_set_shared"
                      );
                    return true;
                  })
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <FeedCard item={item} />
                    </motion.div>
                  ))}
                {!isFinished && (
                  <div ref={loaderRef} className="py-4 text-center text-sm text-gray-400">
                    {feedLoading ? 'Đang tải...' : ''}
                  </div>
                )}
                {isFinished && feedItems.length > 0 && (
                  <div className="py-4 text-center text-sm text-gray-400">
                    Đã hiển thị tất cả bài viết
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Load More */}
            <div className="text-center py-4">
              <button className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                Xem thêm hoạt động cũ hơn
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Danh sách bạn bè --- */}
          <div className="lg:col-span-4">
            <FriendsListSidebar
              friends={
                followingData ?? { items: [], total: 0, page: 1, pageSize: 20 }
              }
              isLoading={followingLoading}
              onViewAll={() => setFriendsModalOpen(true)}
            />
            <FriendsListModal
              isOpen={friendsModalOpen}
              onClose={() => setFriendsModalOpen(false)}
              items={followingData?.items ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgressDashboard;

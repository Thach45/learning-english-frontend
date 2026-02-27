import React, { useState } from 'react';
import { ArrowRight, BookOpen, Heart, MessageSquare, Users, X } from 'lucide-react';

const AboutCommunity: React.FC = () => {
  const [showFeedPreview, setShowFeedPreview] = useState(false);

  const CommunityFeedCard = () => (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 shadow-xl relative z-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Cộng đồng học tập</h3>
        </div>
        <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm relative text-gray-500">
          <Users className="w-4 h-4" />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <div className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-900 text-white shadow-sm">
          Tất cả
        </div>
        <div className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-gray-600 border border-gray-200">
          Thảo luận
        </div>
      </div>

      {/* Create Post Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6 flex gap-3 items-center">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`}
          alt="Avatar"
          className="w-9 h-9 rounded-full border border-gray-100"
        />
        <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-gray-400 text-sm border border-gray-100">
          Bạn đang nghĩ gì?
        </div>
        <button className="bg-indigo-600 text-white p-2 rounded-lg">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {/* FeedCard Mockup */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-gray-100"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">
                Minh Anh <span className="text-gray-500 font-medium">đã chia sẻ một bộ thẻ</span>
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">2 giờ trước • Công khai</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            Các bạn học kĩ bộ 500 từ vựng này trước khi thi IELTS Reading nhé! Cực kỳ sát với đề thi dạo gần đây.
          </p>

          {/* Shared Study Set Box */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:border-indigo-200 transition-colors">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">IELTS Reading Core 500</p>
                <p className="text-xs text-gray-500 font-medium">500 thuật ngữ</p>
              </div>
            </div>
            <button className="text-indigo-600 font-bold text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              Lưu bộ thẻ
            </button>
          </div>

          {/* Like / Comment actions */}
          <div className="flex gap-6 mt-4 pt-3 border-t border-gray-100 text-gray-500 text-sm font-medium">
            <div className="flex gap-1.5 items-center cursor-pointer hover:text-red-500">
              <Heart className="w-4 h-4" /> 24
            </div>
            <div className="flex gap-1.5 items-center cursor-pointer hover:text-indigo-600">
              <MessageSquare className="w-4 h-4" /> 5
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="community" className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Side */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold border border-gray-200 mb-6">
              <Users className="w-4 h-4" />
              <span>Mạng xã hội học tập</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.15]">
              Cộng đồng học tập <br /> <span className="text-indigo-600">tương tác trực tiếp.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-xl">
              Bạn không đơn độc. Giao diện Feed thân thiện giúp bạn theo dõi bạn bè, thả tim, bình luận và chia sẻ
              nhanh các Bộ thẻ từ vựng hữu ích.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-100">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <strong className="text-gray-900 block text-base mb-1">
                    Chia sẻ & Lưu bộ thẻ (Study Set Share)
                  </strong>
                  <span className="text-gray-500 text-sm leading-relaxed">
                    Công khai thư viện từ vựng cá nhân để mọi người cùng học. Một nút bấm để lưu ngay bộ thẻ của người
                    khác.
                  </span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-100">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <strong className="text-gray-900 block text-base mb-1">
                    Bài đăng & Bình luận (User Post)
                  </strong>
                  <span className="text-gray-500 text-sm leading-relaxed">
                    Đăng bài thảo luận, đặt câu hỏi ngữ pháp và tương tác qua các comment dưới mỗi bài học.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFeedPreview(true)}
              className="bg-white border-2 border-indigo-600 text-indigo-600 font-bold px-6 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              Xem Bảng tin cộng đồng <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dashboard feed mockup */}
          <div className="lg:w-1/2 relative w-full">
            <CommunityFeedCard />
          </div>
        </div>
      </div>
      {/* Modal preview feed */}
      {showFeedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowFeedPreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
            <CommunityFeedCard />
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutCommunity;


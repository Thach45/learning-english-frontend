import React from 'react';
import { BarChart3, CheckCircle2, ScanText, Sparkles, Target, TextSelect, Award, BookOpen, MessageSquare, Heart, Users, Globe, Shield } from 'lucide-react';

const AboutFeatures: React.FC = () => {
  return (
    <>
      {/* Bento Grid Features Section */}
      <section id="features" className="py-24 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-bold tracking-wider text-xs uppercase mb-3 bg-indigo-50 inline-block px-3 py-1 rounded-full border border-indigo-100">
              Hệ sinh thái học tập
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Các tính năng chuyên biệt
            </h3>
            <p className="text-gray-500 text-lg font-medium">
              Kết hợp giữa trí tuệ nhân tạo, thiết kế tối giản và khoa học thần kinh để đem lại hiệu suất ghi nhớ tốt nhất.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: AI Article Extraction (Large) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <ScanText className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">AI Trích xuất từ vựng</h4>
                <p className="text-gray-500 leading-relaxed text-base">
                  Đừng học từ vựng lẻ tẻ. Chỉ cần dán URL hoặc nội dung bài báo, AI của chúng tôi sẽ tự động phân tích và trích xuất các từ vựng cốt lõi thành Bộ thẻ từ vựng ngay lập tức.
                </p>
              </div>

              {/* Article Extraction Mockup UI */}
              <div className="flex-1 w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
                  <p className="text-xs text-gray-400 mb-2">Đang phân tích bài viết...</p>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">
                    The rapid{' '}
                    <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold cursor-pointer">
                      evolution
                    </span>{' '}
                    of technology has created{' '}
                    <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold cursor-pointer">
                      unprecedented
                    </span>{' '}
                    opportunities...
                  </p>
                </div>
                <div className="flex items-center justify-between bg-white border border-indigo-100 p-3 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Tìm thấy 12 từ vựng mới</p>
                      <p className="text-xs text-gray-500">Đã tạo thành bộ thẻ.</p>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg">Lưu ngay</button>
                </div>
              </div>
            </div>

            {/* Feature 2: Dictionary Shortcut */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                  <TextSelect className="w-6 h-6 text-gray-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Phím tắt tra từ</h4>
                <p className="text-gray-500 leading-relaxed text-sm mb-6">
                  Tích hợp công cụ tra từ điển cực nhanh (Dictionary Shortcut) trực tiếp trong giao diện học. Không cần chuyển tab hay mất tập trung.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-white shadow-lg">
                <div className="flex gap-2 items-center mb-3">
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs font-mono font-bold">Ctrl</span>
                  <span className="text-gray-400">+</span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs font-mono font-bold">D</span>
                </div>
                <p className="text-sm font-medium">Bật nhanh cửa sổ từ điển</p>
              </div>
            </div>

            {/* Feature 3: Analytics & Progress */}
            <div className="bg-gray-900 rounded-3xl p-8 md:p-10 shadow-xl border border-gray-800 text-white relative overflow-hidden">
              <div className="relative z-10 w-4/5">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 border border-gray-700">
                  <BarChart3 className="w-6 h-6 text-gray-300" />
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight">Đường cong lãng quên</h4>
                <p className="text-gray-400 leading-relaxed text-sm mb-6">
                  Thuật toán Spaced Repetition (Lặp lại ngắt quãng) tối ưu hóa thời gian nhắc lại từng thẻ từ.
                </p>
              </div>

              {/* Chart Overlay Mockup */}
              <div className="absolute -right-4 -bottom-4 w-48 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl">
                <p className="text-gray-500 text-xs font-bold mb-1 uppercase">Độ ghi nhớ</p>
                <div className="flex items-end gap-2 mb-3">
                  <p className="text-gray-900 font-extrabold text-3xl">
                    92<span className="text-lg">%</span>
                  </p>
                </div>
                <div className="flex gap-1.5 h-10 items-end">
                  <div className="w-1/4 bg-gray-200 rounded-sm h-[40%]"></div>
                  <div className="w-1/4 bg-gray-200 rounded-sm h-[60%]"></div>
                  <div className="w-1/4 bg-gray-200 rounded-sm h-[75%]"></div>
                  <div className="w-1/4 bg-indigo-600 rounded-sm h-[100%]"></div>
                </div>
              </div>
            </div>

            {/* Feature 4: Gamification & Achievements */}
            <div
              id="gamification"
              className="md:col-span-2 bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-10"
            >
              <div className="flex-1 w-full bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                {/* Achievement Notification Mockup */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Thành tích mới</p>
                    <p className="font-bold text-gray-900 text-sm">Chăm chỉ: Tuần đầu tiên</p>
                  </div>
                  <span className="ml-auto bg-amber-50 text-amber-600 font-bold text-xs px-2 py-1 rounded">
                    +50 XP
                  </span>
                </div>

                {/* Event Logs Mockup */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    <p className="text-sm font-semibold text-gray-800">Hoàn thành bài Test #1</p>
                  </div>
                  <span className="text-indigo-600 font-bold text-sm">+20 XP</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Hệ thống Gamification</h4>
                <p className="text-gray-500 leading-relaxed text-base">
                  Nhận điểm kinh nghiệm (XP) sau mỗi hoạt động, duy trì chuỗi Streak và thu thập Huy hiệu (Achievements).
                  Học tập không còn là áp lực khi mọi nỗ lực đều được ghi nhận.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutFeatures;


import React from 'react';
import { Globe, MessageSquare, Shield } from 'lucide-react';

const AboutFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src="/blinky.png"
                  alt="BlinkyVocab logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">BlinkyVocab</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              Nền tảng học từ vựng toàn diện với tính năng Trích xuất bài báo bằng AI, Flashcards và hệ thống Mạng xã hội học tập.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Học tập</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Study Sets
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Trích xuất bài báo (AI)
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Bài kiểm tra (Quiz)
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Thành tích (Achievements)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Cộng đồng</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Bảng tin (Feed)
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Tìm kiếm bạn bè
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Bảng xếp hạng (Leaderboard)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Hệ thống</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  Admin Dashboard <Shield className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Thiết lập tài khoản
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-gray-400">
            © 2026 BlinkyVocab Inc. (Developed internally)
          </p>
          <div className="flex gap-6">
            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              🇻🇳 Tiếng Việt
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AboutFooter;


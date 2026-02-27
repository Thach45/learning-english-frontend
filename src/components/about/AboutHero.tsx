import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, Flame, PlayCircle, ScanText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AboutHeroProps {
  me?: unknown;
}

const AboutHero: React.FC<AboutHeroProps> = ({ me }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Trích xuất AI', 'Cộng đồng', 'Gamification', 'Spaced Repetition'];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8">
              <ScanText className="w-4 h-4" />
              <span>Nền tảng tích hợp AI trích xuất từ vựng mới nhất</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-6">
              Làm chủ tiếng Anh <br className="hidden md:block" /> qua{' '}
              <span className="text-indigo-600 inline-block min-w-[300px] text-left">
                {words[currentWord]}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Quên đi cách học truyền thống. Tự động trích xuất từ vựng từ bài báo bất kỳ, thi đua nhận XP và
              tương tác cùng bạn bè trên mạng xã hội học tập.
            </p>

            {!me && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-s transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Tạo tài khoản miễn phí <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-s transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlayCircle className="w-5 h-5 text-indigo-600" /> Đã có tài khoản? Đăng nhập
                </button>
              </div>
            )}

            {me && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Vào học ngay <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Hero Visual (Dashboard Mockup matching App logic) */}
          <div className="lg:w-1/2 relative w-full z-10 flex justify-center lg:justify-end">
            {/* Floating Gamification Badge */}
            <div className="absolute -left-6 top-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 z-20 animate-[bounce_4s_infinite]">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Chuỗi học tập</p>
                <p className="text-base font-extrabold text-gray-900">14 Ngày liên tiếp</p>
              </div>
            </div>

            {/* Floating Achievement Badge */}
            <div className="absolute -right-4 bottom-24 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 z-20 animate-[bounce_5s_infinite_reverse]">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Huy hiệu mới</p>
                <p className="text-base font-extrabold text-gray-900">Người khởi đầu</p>
              </div>
            </div>

            {/* Main App Card Mockup */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-200 overflow-hidden w-full max-w-md transform transition-transform hover:-translate-y-1 duration-300">
              {/* Mockup Header XP Bar (XPProgressBar) */}
              <div className="bg-gray-50 border-b border-gray-100 p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-800">Cấp độ 5</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    1,250 / 2,000 XP
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[62%] rounded-full"></div>
                </div>
              </div>

              {/* Mockup Body (FlashcardView) */}
              <div className="p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs font-bold text-gray-400 uppercase">Học từ mới</div>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                    15/45
                  </span>
                </div>

                {/* Flashcard */}
                <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-8 text-center aspect-[4/3] flex flex-col justify-center relative cursor-pointer hover:border-indigo-200 transition-colors group">
                  <span className="absolute top-4 left-4 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md text-xs font-bold">
                    Tính từ
                  </span>

                  <h3 className="text-4xl font-extrabold text-gray-900 mb-2">Procrastinate</h3>
                  <p className="text-gray-400 font-medium mb-4 text-lg">/prəˈkræstɪneɪt/</p>

                  {/* Hover Reveal Area */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center border-2 border-indigo-100">
                    <p className="text-2xl font-bold text-gray-800 mb-3">Trì hoãn</p>
                    <p className="text-sm text-gray-500">
                      "I always procrastinate when it comes to doing my homework."
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-white border-2 border-gray-200 text-gray-700 rounded-xl py-3 font-bold hover:bg-gray-50 transition-colors">
                    Quên
                  </button>
                  <button className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                    Nhớ (→)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;


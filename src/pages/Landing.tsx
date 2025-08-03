

import type React from "react"
import { type ReactNode, useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  BookOpen,
  Zap,
  Target,
  Star,
  MessageSquare,
  BarChart,
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  Play,
  Users,
  Award,
  Clock,
} from "lucide-react"
import TextType from "../components/animation/TextType"

// Define TypeScript interfaces
interface FeatureCardProps {
  icon: ReactNode
  title: string
  children: ReactNode
  delay?: number
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
  }),
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

// --- COMPONENTS ---

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center space-x-2 group" aria-label="Trang chủ VocabMaster">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              VocabMaster
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Tính năng
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Cách hoạt động
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
            >
              Đánh giá
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">
              Đăng nhập
            </a>
            <a
              href="/register"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
            >
              Bắt đầu miễn phí
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-100 bg-white"
          >
            <nav className="flex flex-col space-y-4 px-6">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600"
              >
                Tính năng
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600"
              >
                Cách hoạt động
              </a>
              <a
                href="#testimonials"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600"
              >
                Đánh giá
              </a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                <a href="/login" className="text-gray-600 hover:text-gray-900">
                  Đăng nhập
                </a>
                <a href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-center">
                  Bắt đầu miễn phí
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

// Hero Section
const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-200 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="container mx-auto px-6 relative z-10 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Được tin dùng bởi hơn 10,000+ học viên
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <TextType 
              textColors={["text-gray-800", "text-blue-600", "text-green-600"]}
              text={["Học Từ Vựng Tiếng Anh", "Hiệu Quả Hơn", "Dễ Dàng Hơn"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
            
            <br />
            <span className="text-blue-600">Thông Minh Hơn</span>
          </h1>
        </motion.div>

        <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          VocabMaster biến việc học từ vựng thành một trải nghiệm thú vị với hệ thống lặp lại ngắt quãng khoa học và các
          yếu tố game hóa hấp dẫn.
        </motion.p>

        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-blue-500/40 flex items-center group"
            >
              Bắt đầu học miễn phí
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium group">
              <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center mr-3 group-hover:shadow-xl transition-shadow duration-300">
                <Play className="w-5 h-5 text-blue-600 ml-1" />
              </div>
              Xem demo 2 phút
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-gray-600 text-sm">Học viên</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-gray-600 text-sm">Từ vựng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-gray-600 text-sm">Hài lòng</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer border border-gray-100 h-full"
    >
      <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
        <div className="text-blue-600 group-hover:text-white transition-colors duration-300">{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-sm">{children}</p>
    </motion.div>
  )
}

// Features Section
const Features = () => {
  return (
    <section id="features" className="min-h-screen flex items-center justify-center bg-white py-20">
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="text-center mb-12">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Tính năng nổi bật
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tại Sao Chọn VocabMaster?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những công cụ mạnh mẽ được thiết kế để tối ưu hóa quá trình học từ vựng của bạn.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard icon={<Zap className="w-7 h-7" />} title="Học Tập Thông Minh">
            Thuật toán lặp lại ngắt quãng được chứng minh khoa học giúp bạn ghi nhớ từ vựng hiệu quả gấp 5 lần.
          </FeatureCard>

          <FeatureCard icon={<Star className="w-7 h-7" />} title="Game Hóa Học Tập">
            Tích lũy XP, streak, thành tích và thử thách hàng ngày. Học từ vựng chưa bao giờ thú vị đến thế!
          </FeatureCard>

          <FeatureCard icon={<BookOpen className="w-7 h-7" />} title="Bộ Từ Tùy Chỉnh">
            Tạo các bộ từ vựng theo chủ đề riêng hoặc chọn từ thư viện với hàng nghìn bộ từ chất lượng cao.
          </FeatureCard>

          <FeatureCard icon={<Target className="w-7 h-7" />} title="Đa Dạng Chế Độ">
            Flashcards, Quiz, Matching Game và nhiều chế độ học khác phù hợp với mọi phong cách học tập.
          </FeatureCard>

          <FeatureCard icon={<MessageSquare className="w-7 h-7" />} title="Từ Điển AI">
            Tra cứu tức thì với AI, bao gồm phát âm chuẩn, ví dụ thực tế và gợi ý từ đồng nghĩa.
          </FeatureCard>

          <FeatureCard icon={<BarChart className="w-7 h-7" />} title="Phân Tích Chi Tiết">
            Dashboard trực quan theo dõi tiến độ, điểm yếu và đưa ra lời khuyên cá nhân hóa.
          </FeatureCard>
        </div>
      </motion.div>
    </section>
  )
}

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      title: "Chọn Bộ Từ Vựng",
      description: "Khám phá thư viện hoặc tạo bộ từ riêng theo nhu cầu của bạn.",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Học Với AI",
      description: "Hệ thống AI thông minh sẽ tối ưu hóa lịch học và đưa ra các từ vựng phù hợp.",
      icon: <Zap className="w-8 h-8" />,
    },
    {
      title: "Theo Dõi Tiến Độ",
      description: "Xem kết quả học tập qua biểu đồ trực quan và duy trì động lực học tập.",
      icon: <BarChart className="w-8 h-8" />,
    },
  ]

  return (
    <section id="how-it-works" className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="text-center mb-16">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Quy trình đơn giản
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Bắt Đầu Chỉ Với 3 Bước</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hành trình chinh phục từ vựng của bạn bắt đầu ngay bây giờ.
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200 -translate-y-1/2"></div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full mx-auto mb-6 shadow-lg border-4 border-blue-200 relative z-10 hover:scale-110 transition-transform duration-300 group cursor-pointer">
                  <span className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// Testimonials Section
const Testimonials = () => {
  const testimonials = [
    {
      text: "VocabMaster đã thay đổi hoàn toàn cách tôi học từ vựng. Tính năng spaced repetition thực sự hiệu quả!",
      name: "Nguyễn Minh Anh",
      role: "Sinh viên IELTS",
      avatar: "MA",
    },
    {
      text: "Giao diện đẹp, dễ sử dụng và đặc biệt là tính năng gamification rất thú vị. Con tôi học như chơi game.",
      name: "Trần Quốc Bảo",
      role: "Phụ huynh",
      avatar: "QB",
    },
    {
      text: "Là một lập trình viên, tôi cần học nhiều thuật ngữ kỹ thuật. VocabMaster cho phép tôi tạo bộ từ riêng và học rất hiệu quả.",
      name: "Lê Hoàng Nam",
      role: "Software Engineer",
      avatar: "LN",
    },
  ]

  return (
    <section id="testimonials" className="min-h-screen flex items-center justify-center bg-white py-20">
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="text-center mb-16">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4 mr-2" />
              Câu chuyện thành công
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">10,000+ Học Viên Tin Tưởng</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những câu chuyện truyền cảm hứng từ cộng đồng VocabMaster.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer border border-gray-100"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full mr-4 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// CTA Section
const CTA = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="container mx-auto px-6 text-center relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-100 rounded-full text-sm font-medium mb-6">
          <Award className="w-4 h-4 mr-2" />
          Tham gia cộng đồng học tập
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Sẵn Sàng Để Chinh Phục
          <br />
          <span className="text-blue-200">Vốn Từ Vựng?</span>
        </h2>

        <p className="text-blue-100 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          Tham gia cộng đồng VocabMaster ngay hôm nay và bắt đầu xây dựng một nền tảng từ vựng vững chắc cho tương lai
          của bạn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center group"
          >
            Đăng ký tài khoản miễn phí
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          <div className="text-blue-200 text-sm">✨ Không cần thẻ tín dụng • Hủy bất cứ lúc nào</div>
        </div>
      </motion.div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">VocabMaster</span>
            </div>
            <p className="text-gray-400 mb-4">Học từ vựng thông minh hơn với công nghệ AI và khoa học nhận thức.</p>
          </div>

          {[
            {
              title: "Sản phẩm",
              links: [
                { href: "#features", text: "Tính năng" },
                { href: "#pricing", text: "Bảng giá" },
                { href: "/mobile", text: "Ứng dụng mobile" },
              ],
            },
            {
              title: "Hỗ trợ",
              links: [
                { href: "/help", text: "Trung tâm trợ giúp" },
                { href: "/contact", text: "Liên hệ" },
                { href: "/community", text: "Cộng đồng" },
              ],
            },
            {
              title: "Pháp lý",
              links: [
                { href: "/terms", text: "Điều khoản sử dụng" },
                { href: "/privacy", text: "Chính sách bảo mật" },
                { href: "/security", text: "Bảo mật" },
              ],
            },
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 VocabMaster. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Được phát triển tại Việt Nam 🇻🇳</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      <Helmet>
        <title>VocabMaster - Học Từ Vựng Tiếng Anh Thông Minh | Ứng dụng học từ vựng hiệu quả</title>
        <meta
          name="description"
          content="VocabMaster - Ứng dụng học từ vựng tiếng Anh thông minh với AI và spaced repetition. Học hiệu quả, nhớ lâu hơn. Miễn phí 100%!"
        />
        <meta
          name="keywords"
          content="học tiếng anh, từ vựng tiếng anh, flashcard, spaced repetition, học từ vựng, AI, ứng dụng học tiếng anh"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563EB" />
        <link rel="canonical" href="https://vocabmaster.com" />
        <style>
          {`
          .animate-blob {
            animation: blob 7s infinite;
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
        </style>
      </Helmet>

      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage

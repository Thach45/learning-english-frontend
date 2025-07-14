import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Share2, Download, Calendar, TrendingUp, Book, Trophy, ArrowLeft } from 'lucide-react';
import { mockUser } from '../data/mockData';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const user = mockUser;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const learningStats = [
    { label: 'Words Learned', value: user.totalWordsLearned, change: '+12 this week', icon: Book },
    { label: 'Study Streak', value: `${user.streak} days`, change: 'Personal best!', icon: Calendar },
    { label: 'Current Level', value: user.level, change: '+2 this month', icon: Trophy },
    { label: 'Total XP', value: user.xp, change: '+250 this week', icon: TrendingUp }
  ];

  const recentActivity = [
    { date: '2025-01-03', activity: 'Completed 15 flashcards', xp: 75 },
    { date: '2025-01-03', activity: 'Finished Business Quiz', xp: 120 },
    { date: '2025-01-02', activity: 'Learned 8 new words', xp: 80 },
    { date: '2025-01-02', activity: 'Maintained 7-day streak', xp: 50 },
    { date: '2025-01-01', activity: 'Unlocked "Week Warrior" achievement', xp: 100 }
  ];

  const shareProgress = () => {
    const shareText = `I've learned ${user.totalWordsLearned} words and maintained a ${user.streak}-day streak on VocabMaster! 🎯📚 #VocabularyLearning #English`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Progress',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    }
  };

  const exportData = () => {
    const userData = {
      profile: user,
      stats: learningStats,
      activity: recentActivity
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vocab-master-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <div className="flex space-x-2">
            <button
              onClick={shareProgress}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              onClick={exportData}
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar || `https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100`}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.level}
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {user.createdAt.toLocaleDateString()}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <Book className="h-4 w-4 mr-1" />
                  {user.totalWordsLearned} words learned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {learningStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                        <p className="text-xs text-green-600">{stat.change}</p>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-gray-900 font-medium">{activity.activity}</p>
                          <p className="text-sm text-gray-600">{activity.date}</p>
                        </div>
                        <span className="text-blue-600 font-medium">+{activity.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Words Mastered</span>
                        <span className="font-medium">{Math.round(user.totalWordsLearned * 0.8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Accuracy</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Study Time</span>
                        <span className="font-medium">42h 30m</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-medium">3 / 5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">In Progress</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-medium">60%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goal Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Words This Week</span>
                        <span className="font-medium">18 / 25</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Study Days</span>
                        <span className="font-medium">5 / 7</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Learning Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Daily Goal</p>
                        <p className="text-sm text-gray-600">Number of words to learn per day</p>
                      </div>
                      <select className="border border-gray-300 rounded-lg px-3 py-2">
                        <option value="10">10 words</option>
                        <option value="15">15 words</option>
                        <option value="20" selected>20 words</option>
                        <option value="25">25 words</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Difficulty Level</p>
                        <p className="text-sm text-gray-600">Preferred vocabulary difficulty</p>
                      </div>
                      <select className="border border-gray-300 rounded-lg px-3 py-2">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate" selected>Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Daily Reminders</p>
                        <p className="text-sm text-gray-600">Get notified to practice daily</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Achievement Alerts</p>
                        <p className="text-sm text-gray-600">Celebrate your milestones</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Weekly Progress</p>
                        <p className="text-sm text-gray-600">Weekly summary emails</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Public Profile</p>
                        <p className="text-sm text-gray-600">Allow others to see your progress</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Share Vocabulary</p>
                        <p className="text-sm text-gray-600">Make your vocabularies public by default</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
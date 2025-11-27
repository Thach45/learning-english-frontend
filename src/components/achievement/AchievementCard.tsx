// import React from 'react';
// import { Trophy } from 'lucide-react';
// import { UserAchievement } from '../../types/achievement';
// // import { getRarityConfig, getProgressColor } from '../../utils/achievement';

// interface AchievementCardProps {
//   userAchievement: UserAchievement;
// }

// export const AchievementCard: React.FC<AchievementCardProps> = ({ userAchievement }) => {
//   const { achievement, progress, isCompleted } = userAchievement;
//   const rarityConfig = getRarityConfig(achievement.rarity);
//   const progressPercentage = Math.min((progress / achievement.targetValue) * 100, 100);
//   const progressColor = getProgressColor(progress, achievement.targetValue);

//   return (
//     <div className={`border ${rarityConfig.borderColor} rounded-lg p-4 hover:shadow-md transition-shadow`}>
//       <div className="flex items-center justify-between mb-3">
//         <div className={`${rarityConfig.iconColor} transition-colors duration-300`}>
//           {achievement.icon ? (
//             <img src={achievement.icon} alt={achievement.title} className="w-8 h-8" />
//           ) : (
//             <Trophy className="w-8 h-8" />
//           )}
//         </div>
//         <span className={`text-xs px-2 py-1 rounded-full font-medium ${rarityConfig.bgColor} ${rarityConfig.textColor}`}>
//           {rarityConfig.label}
//         </span>
//       </div>

//       <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
//       <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

//       {achievement.duration && (
//         <p className="text-xs text-gray-500 mb-2">
//           Thời hạn: {achievement.duration} ngày
//         </p>
//       )}

//       <div className="space-y-2">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Tiến độ</span>
//           <span className="font-medium text-gray-900">
//             {progress} / {achievement.targetValue}
//           </span>
//         </div>

//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div
//             className={`${progressColor} h-2 rounded-full transition-all duration-500`}
//             style={{ width: `${progressPercentage}%` }}
//           />
//         </div>

//         <div className="flex justify-between items-center text-xs">
//           <span className={`${rarityConfig.textColor} font-medium`}>
//             {Math.round(progressPercentage)}% Hoàn thành
//           </span>
//           {isCompleted && (
//             <span className="text-green-600 font-medium flex items-center">
//               <Trophy className="w-3 h-3 mr-1" />
//               Đã hoàn thành
//             </span>
//           )}
//         </div>

//         {achievement.xpReward > 0 && (
//           <div className="text-xs text-yellow-600 font-medium mt-2">
//             Phần thưởng: {achievement.xpReward} XP
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
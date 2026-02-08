import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { ListFollowersResponseDto } from '../../types/community';

type FriendsListSidebarProps = {
  friends: ListFollowersResponseDto;
  isLoading: boolean;
  onViewAll?: () => void;
};

const FriendsListSidebar: React.FC<FriendsListSidebarProps> = ({
  friends,
  isLoading = false,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Danh sách bạn bè
        </h3>
        {friends.total > 0 && (
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
            {friends.total}
          </span>
        )}
      </div>

      <div>
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 mt-1 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : friends.total === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">Chưa có bạn bè nào.</p>
            <p className="text-xs mt-1">Theo dõi người khác để thấy họ ở đây.</p>
          </div>
        ) : (
          friends.items.map((friend) => (
            <Link
              key={friend.id}
              to={`/profile/${friend.id}`}
              className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <img
                src={friend.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`}
                alt={friend.name}
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{friend.name}</h4>
                {friend.level != null && (
                  <p className="text-xs text-gray-500">Level {friend.level}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {friends.total > 0 && (
        <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Xem tất cả bạn bè
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendsListSidebar;

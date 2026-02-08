import React from 'react';
import { Link } from 'react-router-dom';
import { X, UserMinus } from 'lucide-react';
import { useUnfollowUser } from '../../hooks/useCommunity';

export interface FriendItem {
  id: string;
  name: string;
  avatarUrl?: string | null;
  level?: number;
}

type FriendsListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: FriendItem[];
};

const FriendsListModal: React.FC<FriendsListModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const unfollowMutation = useUnfollowUser();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-gray-900">Danh sách bạn bè</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              Chưa có bạn bè nào.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                >
                  <Link
                    to={`/profile/${friend.id}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                    onClick={onClose}
                  >
                    <img
                      src={
                        friend.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`
                      }
                      alt={friend.name}
                      className="w-10 h-10 rounded-full border border-gray-200 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {friend.name}
                      </p>
                      {friend.level != null && (
                        <p className="text-xs text-gray-500">Level {friend.level}</p>
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => unfollowMutation.mutate(friend.id)}
                    disabled={unfollowMutation.isPending}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    {unfollowMutation.isPending && unfollowMutation.variables === friend.id
                      ? 'Đang xử lý...'
                      : 'Huỷ follow'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default FriendsListModal;

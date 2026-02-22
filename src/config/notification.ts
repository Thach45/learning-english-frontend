import { useNotification } from '../context/NotificationContext';

// Notification message templates
export const NOTIFICATION_MESSAGES = {
  // Auth messages
  AUTH: {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.',
    REGISTER_SUCCESS: 'Đăng ký thành công!',
    REGISTER_FAILED: 'Đăng ký thất bại. Vui lòng thử lại.',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    PASSWORD_CHANGED: 'Mật khẩu đã được thay đổi thành công!',
    PROFILE_UPDATED: 'Thông tin cá nhân đã được cập nhật!'
  },

  // Study Set messages
  STUDY_SET: {
    CREATED: 'Bộ từ vựng đã được tạo thành công!',
    UPDATED: 'Bộ từ vựng đã được cập nhật!',
    DELETED: 'Bộ từ vựng đã được xóa!',
    CREATE_FAILED: 'Tạo bộ từ vựng thất bại.',
    UPDATE_FAILED: 'Cập nhật bộ từ vựng thất bại.',
    DELETE_FAILED: 'Xóa bộ từ vựng thất bại.',
    LINK_COPIED: 'Link bộ từ vựng đã được copy!',
    EMPTY_TITLE: 'Vui lòng nhập tiêu đề bộ từ vựng.',
    EMPTY_CATEGORY: 'Vui lòng chọn chủ đề.'
  },

  // Vocabulary messages
  VOCABULARY: {
    ADDED: 'Từ vựng đã được thêm!',
    UPDATED: 'Từ vựng đã được cập nhật!',
    DELETED: 'Từ vựng đã được xóa!',
    ADD_FAILED: 'Thêm từ vựng thất bại.',
    UPDATE_FAILED: 'Cập nhật từ vựng thất bại.',
    DELETE_FAILED: 'Xóa từ vựng thất bại.',
    AUTO_SUGGESTION_FAILED: 'Không lấy được gợi ý tự động!'
  },

  // Category messages
  CATEGORY: {
    CREATED: 'Chủ đề đã được tạo!',
    UPDATED: 'Chủ đề đã được cập nhật!',
    DELETED: 'Chủ đề đã được xóa!',
    CREATE_FAILED: 'Tạo chủ đề thất bại.',
    UPDATE_FAILED: 'Cập nhật chủ đề thất bại.',
    DELETE_FAILED: 'Xóa chủ đề thất bại.',
    EMPTY_TITLE: 'Vui lòng nhập tên chủ đề.'
  },

  // Learning messages
  LEARNING: {
    PROGRESS_SAVED: 'Tiến độ học tập đã được lưu!',
    PROGRESS_FAILED: 'Lưu tiến độ thất bại.',
    QUIZ_COMPLETED: 'Hoàn thành bài kiểm tra!',
    QUIZ_FAILED: 'Làm bài kiểm tra thất bại.',
    REVIEW_COMPLETED: 'Hoàn thành ôn tập!',
    NEW_WORD_LEARNED: 'Từ mới đã được học!',
    WORD_REVIEWED: 'Từ vựng đã được ôn tập!',
    WORD_MASTERED: 'Từ vựng đã được thành thạo!'
  },

  // Gamification messages
  GAMIFICATION: {
    XP_EARNED: (xp: number) => `+${xp} XP!`,
    LEVEL_UP: (level: number) => `Chúc mừng! Bạn đã lên cấp ${level}!`,
    STREAK_UPDATED: (streak: number) => `Streak: ${streak} ngày!`,
    ACHIEVEMENT_UNLOCKED: (title: string) => `Thành tựu: ${title}!`,
    DAILY_GOAL_COMPLETED: 'Hoàn thành mục tiêu hàng ngày!',
    DAILY_GOAL_PROGRESS: (progress: number) => `Mục tiêu: ${progress}%`
  },

  // General messages
  GENERAL: {
    NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
    SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định.',
    LOADING: 'Đang tải...',
    SAVING: 'Đang lưu...',
    DELETING: 'Đang xóa...',
    COPIED: 'Đã copy vào clipboard!',
    UPDATED: 'Đã cập nhật!',
    DELETED: 'Đã xóa!'
  }
} as const;

// Notification helper functions
export const useNotificationHelper = () => {
  const { addNotification } = useNotification();

  const showSuccess = (title: string, message: string, duration = 5000) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration,
      autoClose: true
    });
  };

  const showError = (title: string, message: string, duration = 7000) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration,
      autoClose: true
    });
  };

  const showWarning = (title: string, message: string, duration = 6000) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration,
      autoClose: true
    });
  };

  const showInfo = (title: string, message: string, duration = 5000) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration,
      autoClose: true
    });
  };

  const showAchievement = (title: string, message: string, duration = 8000) => {
    addNotification({
      type: 'achievement',
      title,
      message,
      duration,
      autoClose: true
    });
  };

  const showXP = (title: string, message: string, duration = 4000) => {
    addNotification({
      type: 'xp',
      title,
      message,
      duration,
      autoClose: true
    });
  };

  // Quick notification methods
  const notify = {
    // Auth notifications
    loginSuccess: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.AUTH.LOGIN_SUCCESS),
    loginFailed: (error?: string) => showError('Đăng nhập thất bại', error || NOTIFICATION_MESSAGES.AUTH.LOGIN_FAILED),
    registerSuccess: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.AUTH.REGISTER_SUCCESS),
    registerFailed: (error?: string) => showError('Đăng ký thất bại', error || NOTIFICATION_MESSAGES.AUTH.REGISTER_FAILED),
    logoutSuccess: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.AUTH.LOGOUT_SUCCESS),
    passwordChanged: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.AUTH.PASSWORD_CHANGED),
    profileUpdated: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.AUTH.PROFILE_UPDATED),

    // Study Set notifications
    studySetCreated: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.STUDY_SET.CREATED),
    studySetUpdated: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.STUDY_SET.UPDATED),
    studySetDeleted: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.STUDY_SET.DELETED),
    studySetCreateFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.STUDY_SET.CREATE_FAILED),
    studySetUpdateFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.STUDY_SET.UPDATE_FAILED),
    studySetDeleteFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.STUDY_SET.DELETE_FAILED),
    studySetLinkCopied: () => showInfo('Thành công', NOTIFICATION_MESSAGES.STUDY_SET.LINK_COPIED),
    emptyTitle: () => showWarning('Cảnh báo', NOTIFICATION_MESSAGES.STUDY_SET.EMPTY_TITLE),
    emptyCategory: () => showWarning('Cảnh báo', NOTIFICATION_MESSAGES.STUDY_SET.EMPTY_CATEGORY),

    // Vocabulary notifications
    vocabularyAdded: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.VOCABULARY.ADDED),
    vocabularyUpdated: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.VOCABULARY.UPDATED),
    vocabularyDeleted: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.VOCABULARY.DELETED),
    vocabularyAddFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.VOCABULARY.ADD_FAILED),
    vocabularyUpdateFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.VOCABULARY.UPDATE_FAILED),
    vocabularyDeleteFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.VOCABULARY.DELETE_FAILED),
    autoSuggestionFailed: () => showWarning('Cảnh báo', NOTIFICATION_MESSAGES.VOCABULARY.AUTO_SUGGESTION_FAILED),

    // Category notifications
    categoryCreated: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.CATEGORY.CREATED),
    categoryUpdated: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.CATEGORY.UPDATED),
    categoryDeleted: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.CATEGORY.DELETED),
    categoryCreateFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.CATEGORY.CREATE_FAILED),
    categoryUpdateFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.CATEGORY.UPDATE_FAILED),
    categoryDeleteFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.CATEGORY.DELETE_FAILED),
    categoryEmptyTitle: () => showWarning('Cảnh báo', NOTIFICATION_MESSAGES.CATEGORY.EMPTY_TITLE),

    // Learning notifications
    progressSaved: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.LEARNING.PROGRESS_SAVED),
    progressFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.LEARNING.PROGRESS_FAILED),
    quizCompleted: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.LEARNING.QUIZ_COMPLETED),
    quizFailed: (error?: string) => showError('Thất bại', error || NOTIFICATION_MESSAGES.LEARNING.QUIZ_FAILED),
    reviewCompleted: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.LEARNING.REVIEW_COMPLETED),
    newWordLearned: (word: string) => showSuccess('Từ mới', `Đã học: ${word}`),
    wordReviewed: (word: string) => showInfo('Ôn tập', `Đã ôn: ${word}`),
    wordMastered: (word: string) => showAchievement('Thành thạo', `Đã thành thạo: ${word}`),

    // Gamification notifications
    xpEarned: (xp: number, reason?: string) => {
      const message = reason ? `${NOTIFICATION_MESSAGES.GAMIFICATION.XP_EARNED(xp)} - ${reason}` : NOTIFICATION_MESSAGES.GAMIFICATION.XP_EARNED(xp);
      showXP('XP Earned', message);
    },
    levelUp: (level: number) => showAchievement('Level Up!', NOTIFICATION_MESSAGES.GAMIFICATION.LEVEL_UP(level)),
    streakUpdated: (streak: number) => showInfo('Streak', NOTIFICATION_MESSAGES.GAMIFICATION.STREAK_UPDATED(streak)),
    achievementUnlocked: (title: string) => showAchievement('Achievement!', NOTIFICATION_MESSAGES.GAMIFICATION.ACHIEVEMENT_UNLOCKED(title)),
    dailyGoalCompleted: () => showAchievement('Daily Goal!', NOTIFICATION_MESSAGES.GAMIFICATION.DAILY_GOAL_COMPLETED),
    dailyGoalProgress: (progress: number) => showInfo('Daily Goal', NOTIFICATION_MESSAGES.GAMIFICATION.DAILY_GOAL_PROGRESS(progress)),

    // General notifications
    networkError: () => showError('Lỗi mạng', NOTIFICATION_MESSAGES.GENERAL.NETWORK_ERROR),
    serverError: () => showError('Lỗi máy chủ', NOTIFICATION_MESSAGES.GENERAL.SERVER_ERROR),
    unknownError: () => showError('Lỗi', NOTIFICATION_MESSAGES.GENERAL.UNKNOWN_ERROR),
    copied: () => showInfo('Thành công', NOTIFICATION_MESSAGES.GENERAL.COPIED),
    updated: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.GENERAL.UPDATED),
    deleted: () => showSuccess('Thành công', NOTIFICATION_MESSAGES.GENERAL.DELETED),

    // Custom notifications
    custom: {
      success: (title: string, message: string) => showSuccess(title, message),
      error: (title: string, message: string) => showError(title, message),
      warning: (title: string, message: string) => showWarning(title, message),
      info: (title: string, message: string) => showInfo(title, message),
      achievement: (title: string, message: string) => showAchievement(title, message),
      xp: (title: string, message: string) => showXP(title, message)
    }
  };

  return { notify, addNotification };
};

// Error handler utility
export const handleApiError = (error: any, notify: any) => {
  console.error('API Error:', error);
  
  if (error?.response?.status === 401) {
    notify.loginFailed('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    return;
  }
  
  if (error?.response?.status === 403) {
    notify.custom.error('Quyền truy cập', 'Bạn không có quyền thực hiện hành động này.');
    return;
  }
  
  if (error?.response?.status === 404) {
    notify.custom.error('Không tìm thấy', 'Dữ liệu không tồn tại hoặc đã bị xóa.');
    return;
  }
  
  if (error?.response?.status >= 500) {
    notify.serverError();
    return;
  }
  
  if (error?.code === 'NETWORK_ERROR') {
    notify.networkError();
    return;
  }
  
  // Default error message
  const errorMessage = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi không xác định.';
  notify.custom.error('Lỗi', errorMessage);
};

export default useNotificationHelper; 
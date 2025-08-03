# Migration Guide: Notification System

## Tổng quan

Hướng dẫn chuyển đổi từ hệ thống thông báo cũ (alert, console.log) sang hệ thống notification mới.

## Bước 1: Import Notification Helper

```tsx
// Thêm vào đầu file
import { useNotificationHelper } from '../utils/notification';
```

## Bước 2: Sử dụng Hook

```tsx
const MyComponent = () => {
  const { notify } = useNotificationHelper();
  
  // ... rest of component
};
```

## Bước 3: Thay thế Alert/Console.log

### Thay thế Alert

```tsx
// ❌ Cũ
alert('Tạo study set thành công!');
alert('Vui lòng nhập tiêu đề');
alert('Xóa thất bại!');

// ✅ Mới
notify.studySetCreated();
notify.emptyTitle();
notify.studySetDeleteFailed('Lỗi cụ thể');
```

### Thay thế Console.log cho User Feedback

```tsx
// ❌ Cũ
console.log('Error:', error);
console.log('Success:', response);

// ✅ Mới
notify.studySetCreateFailed(error.message);
notify.studySetCreated();
```

## Migration Examples

### 1. StudySetDetail.tsx

```tsx
// ❌ Cũ
const handleAddVocabulary = async () => {
  try {
    await api.addVocabulary(data);
    alert('Thêm từ vựng thành công!');
  } catch (error) {
    alert(error?.response?.data?.message || 'Thêm từ vựng thất bại.');
  }
};

// ✅ Mới
const { notify } = useNotificationHelper();

const handleAddVocabulary = async () => {
  try {
    await api.addVocabulary(data);
    notify.vocabularyAdded();
  } catch (error) {
    notify.vocabularyAddFailed(error?.response?.data?.message);
  }
};
```

### 2. Profile.tsx

```tsx
// ❌ Cũ
const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

const handleUpdateProfile = async () => {
  try {
    const response = await api.updateProfile(data);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
  } catch (err) {
    setMessage({ type: 'error', text: err.message });
  }
};

// ✅ Mới
const { notify } = useNotificationHelper();

const handleUpdateProfile = async () => {
  try {
    await api.updateProfile(data);
    notify.profileUpdated();
  } catch (error) {
    notify.custom.error('Lỗi', error.message);
  }
};
```

### 3. Categories.tsx

```tsx
// ❌ Cũ
const handleCreateCategory = async () => {
  if (!title.trim()) {
    alert("Vui lòng nhập tiêu đề");
    return;
  }
  
  try {
    await api.createCategory(data);
    // success handling
  } catch (error) {
    alert(error?.response?.data?.message || "Tạo chủ đề thất bại.");
  }
};

// ✅ Mới
const { notify } = useNotificationHelper();

const handleCreateCategory = async () => {
  if (!title.trim()) {
    notify.categoryEmptyTitle();
    return;
  }
  
  try {
    await api.createCategory(data);
    notify.categoryCreated();
  } catch (error) {
    notify.categoryCreateFailed(error?.response?.data?.message);
  }
};
```

## Error Handling Migration

### Trước
```tsx
try {
  const response = await api.someCall();
} catch (error) {
  if (error.response?.status === 401) {
    // handle unauthorized
  } else if (error.response?.status === 404) {
    // handle not found
  } else {
    alert(error.message);
  }
}
```

### Sau
```tsx
import { handleApiError } from '../utils/notification';

try {
  const response = await api.someCall();
  notify.custom.success('Thành công', 'Thao tác hoàn tất');
} catch (error) {
  handleApiError(error, notify);
}
```

## Files cần Migration

### High Priority
- [ ] `frontend/src/pages/StudySetDetail.tsx`
- [ ] `frontend/src/pages/Profile.tsx`
- [ ] `frontend/src/pages/Categories.tsx`
- [ ] `frontend/src/pages/StudySets.tsx`
- [ ] `frontend/src/pages/Login.tsx`
- [ ] `frontend/src/pages/Register.tsx`

### Medium Priority
- [ ] `frontend/src/components/pageStudySets/CreateStudySetModal.tsx`
- [ ] `frontend/src/components/pageStudySets/EditStudySetModal.tsx`
- [ ] `frontend/src/pages/CategoryDetail.tsx`

### Low Priority
- [ ] `frontend/src/pages/Achievements.tsx`
- [ ] `frontend/src/components/gamification/XPNotification.tsx`

## Testing Checklist

### Functional Testing
- [ ] Success notifications hiển thị đúng
- [ ] Error notifications hiển thị đúng
- [ ] Warning notifications hiển thị đúng
- [ ] Auto-close hoạt động
- [ ] Manual close hoạt động
- [ ] Multiple notifications stack đúng

### Visual Testing
- [ ] Colors đúng cho từng loại
- [ ] Icons hiển thị đúng
- [ ] Animations mượt mà
- [ ] Mobile responsive
- [ ] Z-index đúng (không bị che)

### Error Scenarios
- [ ] Network error
- [ ] Server error (500)
- [ ] Unauthorized (401)
- [ ] Not found (404)
- [ ] Validation errors
- [ ] Unknown errors

## Performance Considerations

### Trước
```tsx
// ❌ Có thể gây memory leak
setTimeout(() => setShowNotification(false), 3000);
```

### Sau
```tsx
// ✅ Tự động cleanup
addNotification({
  type: 'success',
  title: 'Thành công',
  message: 'Thao tác hoàn tất',
  duration: 5000, // Auto cleanup
  autoClose: true
});
```

## Rollback Plan

Nếu cần rollback:

1. **Tạm thời**: Comment out notification calls, restore alert/console.log
2. **Hoàn toàn**: Remove NotificationProvider from App.tsx
3. **Partial**: Keep notification system but disable auto-close

## Benefits sau Migration

### 1. Consistency
- Tất cả notifications có cùng style
- Consistent messaging across app
- Unified error handling

### 2. User Experience
- Non-blocking notifications
- Smooth animations
- Better visual feedback
- Appropriate timing

### 3. Maintainability
- Centralized message management
- Easy to update messages
- Type-safe notifications
- Reusable components

### 4. Accessibility
- Screen reader friendly
- Keyboard navigation
- High contrast colors
- Clear visual hierarchy

## Common Patterns

### Success Pattern
```tsx
try {
  await apiCall();
  notify.successMethod();
} catch (error) {
  notify.errorMethod(error.message);
}
```

### Validation Pattern
```tsx
if (!requiredField) {
  notify.validationWarning();
  return;
}
```

### Loading Pattern
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await apiCall();
    notify.success();
  } catch (error) {
    notify.error(error.message);
  } finally {
    setIsLoading(false);
  }
};
``` 
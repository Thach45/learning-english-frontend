import api from './api';

export async function uploadArticleFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/vocabulary/upload-article', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log(res.data);
  return res.data?.data || res.data;
}

export async function analyzeText(text: string) {
  const res = await api.post('/vocabulary/analyze-text', { text });
  return res.data?.data || res.data;
}


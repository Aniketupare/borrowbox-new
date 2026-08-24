export const MOCK_CHAT_MESSAGES: Record<string, { id: string; sender: 'me' | 'them'; text: string; timestamp: string }[]> = {
  c1: [
    { id: 'm1', sender: 'them', text: 'Is the drill still available?', timestamp: '10:00 AM' },
    { id: 'm2', sender: 'me', text: 'Yes, it is!', timestamp: '10:05 AM' },
  ],
  c2: [
    { id: 'm3', sender: 'them', text: 'Thanks for lending the tent!', timestamp: 'Yesterday' },
  ]
};

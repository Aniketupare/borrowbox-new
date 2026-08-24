import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getMessages } from '../api/messages';
import { Button } from '../components/ui/Button';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';

export const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
    retry: false,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await apiClient.post(`/messages/${conversationId}`, { content });
      return data;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', conversationId], (old: any) => [...(old || []), newMessage]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  useEffect(() => {
    if (socket && conversationId) {
      socket.emit('join_conversation', conversationId);
      socket.on('receive_message', (newMessage) => {
        queryClient.setQueryData(['messages', conversationId], (old: any) => {
          const exists = (old || []).some((m: any) => m._id === newMessage._id);
          if (exists) return old;
          return [...(old || []), newMessage];
        });
      });
      return () => { socket.off('receive_message'); };
    }
  }, [socket, conversationId, queryClient]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId) return;

    if (socket && socket.connected) {
      socket.emit('send_message', { conversationId, content: inputText });
      setInputText('');
    } else {
      // Fallback to HTTP POST if socket is disconnected
      sendMutation.mutate(inputText);
      setInputText('');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-text">Loading messages...</div>;

  const safeMessages = Array.isArray(messages) ? messages : [];
  // Sort messages oldest to newest
  const sortedMessages = [...safeMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-64px)]">
      <Link to="/messages" className="text-accent hover:underline mb-4 block">&larr; Back to Messages</Link>
      
      <div className="bg-surface border border-border rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center font-bold text-primary">💬</div>
          <h2 className="font-semibold text-primary">Chat Conversation</h2>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-background rounded-xl border border-border flex flex-col gap-4 mb-4 shadow-inner">
        {sortedMessages.length > 0 ? (
          sortedMessages.map(m => {
            if (!m || !m.sender) return null;
            const senderId = typeof m.sender === 'object' ? (m.sender as any)._id || (m.sender as any).id : m.sender;
            const isMe = String(senderId) === String(user?.id);
            const senderName = typeof m.sender === 'object' ? (m.sender as any).name : 'User';

            return (
              <div key={m._id || Math.random()} className={`max-w-[80%] p-3.5 rounded-2xl flex flex-col ${isMe ? 'bg-accent text-white self-end rounded-br-none shadow-sm' : 'bg-surface text-primary border border-border self-start rounded-bl-none shadow-sm'}`}>
                {!isMe && <span className="text-xs font-semibold text-accent mb-1">{senderName}</span>}
                <p className="text-sm leading-relaxed">{m.content}</p>
                <span className={`text-[10px] opacity-70 block text-right mt-1.5 ${isMe ? 'text-white/80' : 'text-text'}`}>
                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 text-text">No messages in this conversation yet. Say hello!</div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input 
          className="flex-grow p-3 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-accent" 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          placeholder="Type a message..." 
        />
        <Button type="submit" disabled={sendMutation.isPending}>Send</Button>
      </form>
    </div>
  );
};

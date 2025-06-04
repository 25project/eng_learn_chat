import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

export default function Chat() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const navigate = useNavigate();

  const subtopicData: Record<string, string[]> = {
    '병원에서 의사와 환자': ['기침이 날 때', '복통이 있을 때', '처방 받기'],
    '레스토랑에서 주문하기': ['음식 주문하기', '채식 메뉴 요청', '계산 요청'],
    '공항에서 체크인하기': ['수하물 맡기기', '탑승권 발급 받기', '지연 안내 받기'],
    '호텔에서 체크인하기': ['예약 확인하기', '방 업그레이드 요청', '조식 문의'],
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setSelectedSubtopic('');
  };

  const handleSubtopicSelect = async (subtopic: string) => {
    setSelectedSubtopic(subtopic);
    const initMsg = `You selected: ${selectedTopic} - ${subtopic}`;
    setMessages([initMsg]);

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${selectedTopic} - ${subtopic}`,
          userMessage: '',
          messages: '', // 초기엔 히스토리 없음
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, `🤖: ${data.reply}`]);
    } catch (err) {
      setMessages((prev) => [...prev, '❌ Gemini 응답 오류가 발생했습니다.']);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, `🧑: ${input}`];
    setMessages(newMessages);
    setInput('');

    // 🔥 히스토리 문자열 생성
    const chatHistory = newMessages
        .filter((msg) => msg.startsWith('🤖:') || msg.startsWith('🧑:'))
        .join('\n');

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${selectedTopic} - ${selectedSubtopic}`,
          userMessage: input,
          messages: chatHistory,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, `🤖: ${data.reply}`]);
    } catch (err) {
      console.error('Error communicating with Gemini API:', err);
      setMessages((prev) => [...prev, '❌ Gemini 응답 오류가 발생했습니다.']);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExit = () => {
    setSelectedTopic('');
    setSelectedSubtopic('');
    setMessages([]);
    setInput('');
    navigate('/feedback');
  };

  return (
      <div className="chat-container">
        <div className="chat-box">
          {(selectedTopic && selectedSubtopic) && (
              <button className="exit-button" onClick={handleExit}>❌</button>
          )}

          <div className="chat-header">
            {selectedTopic && selectedSubtopic
                ? `💬 롤플레이: ${selectedTopic} - ${selectedSubtopic}`
                : selectedTopic
                    ? `💬 세부 상황 선택: ${selectedTopic}`
                    : '💬 롤플레이 주제 선택'}
          </div>

          {!selectedTopic && (
              <div className="topic-selection">
                <p>어떤 롤플레이를 할까요?</p>
                {Object.keys(subtopicData).map((topic) => (
                    <button key={topic} onClick={() => handleTopicSelect(topic)}>
                      {topic.includes('병원') && '🏥'}
                      {topic.includes('레스토랑') && '🍽️'}
                      {topic.includes('공항') && '✈️'}
                      {topic.includes('호텔') && '🏨'} {topic}
                    </button>
                ))}
              </div>
          )}

          {selectedTopic && !selectedSubtopic && (
              <div className="topic-selection">
                <p>{selectedTopic} - 어떤 상황인가요?</p>
                {subtopicData[selectedTopic].map((sub) => (
                    <button key={sub} onClick={() => handleSubtopicSelect(sub)}>
                      {sub}
                    </button>
                ))}
                <button onClick={() => setSelectedTopic('')}>🔙 주제로 돌아가기</button>
              </div>
          )}

          {selectedTopic && selectedSubtopic && (
              <>
                <div className="chat-messages">
                  {messages.map((msg, idx) => (
                      <div key={idx} className="message">
                        <span>{msg}</span>
                      </div>
                  ))}
                </div>

                <div className="chat-input-area">
                  <input
                      className="chat-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                  />
                  <button className="send-button" onClick={handleSend}>
                    Send
                  </button>
                </div>
              </>
          )}
        </div>
      </div>
  );
}

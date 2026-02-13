'use client';

import { useMemo, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type CostChatProps = {
  itemName: string;
  region: string;
  stats: {
    average: number;
    min: number;
    max: number;
    sampleSize?: number;
    source?: string;
  };
  seedRange: {
    min: number;
    max: number;
    source?: string;
  };
};

const SUGGESTED_QUESTIONS = ['이 가격이 비싼 건가요?', '이 항목이 뭔가요?', '어떤 보험이 좋을까요?'];
const MAX_TURNS = 10;

export default function CostChat({ itemName, region, stats, seedRange }: CostChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요! 진료비 관점에서 항목 설명, 가격 비교, 절약 팁을 도와드릴게요. 궁금한 점을 편하게 물어보세요.\n\n※ 이 정보는 참고용이며 의료 판단이 아닙니다.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatHistory = useMemo(
    () => messages.filter((message, index) => !(index === 0 && message.role === 'assistant')).slice(-MAX_TURNS * 2),
    [messages]
  );

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || isLoading) {
      return;
    }

    setIsLoading(true);
    setInput('');

    const nextMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(nextMessages);

    try {
      const response = await fetch('/api/cost-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          history: chatHistory,
          context: {
            itemName,
            region,
            stats,
            seedRange
          }
        })
      });

      if (!response.ok || !response.body) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error ?? '분석 응답을 불러오지 못했습니다.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        streamedText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: streamedText };
          return updated;
        });
      }

      const finalizedText = streamedText.trim();
      if (!finalizedText) {
        throw new Error('AI 응답이 비어 있습니다. 잠시 후 다시 시도해주세요.');
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: finalizedText };
        return updated.slice(-(MAX_TURNS * 2 + 1));
      });
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `요청 처리 중 문제가 생겼어요: ${fallbackMessage}\n\n※ 이 정보는 참고용이며 의료 판단이 아닙니다.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-4xl px-4">
      <div className="pointer-events-auto ml-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-sm font-bold text-slate-900">진료비 AI 분석 채팅</span>
          <span className="text-xs font-medium text-slate-500">{isOpen ? '접기' : '열기'}</span>
        </button>

        {isOpen ? (
          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.role === 'user' ? 'ml-auto max-w-[85%] bg-blue-600 text-white' : 'max-w-[90%] bg-white text-slate-800'
                  }`}
                >
                  {message.content || (isLoading && message.role === 'assistant' ? '분석 중...' : '')}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="진료비에 대해 궁금한 점을 입력해주세요"
                rows={2}
                className="min-h-[56px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-200 transition focus:ring"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                전송
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

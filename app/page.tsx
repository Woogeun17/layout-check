'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bookmark, Check, ChevronDown, Heart, MessageCircle, MoreVertical,
  Music2, Pause, Play, RotateCcw, Share2, Upload, Volume2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const overlayItems = [
  { id: 'safe', label: '안전 영역', description: '텍스트와 로고 권장 범위' },
  { id: 'actions', label: '우측 액션', description: '좋아요·댓글·공유 버튼' },
  { id: 'caption', label: '하단 정보', description: '채널명·설명·음원 영역' },
] as const;

type OverlayId = (typeof overlayItems)[number]['id'];

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>();
  const [fileName, setFileName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [opacity, setOpacity] = useState(78);
  const [overlays, setOverlays] = useState<Record<OverlayId, boolean>>({ safe: true, actions: true, caption: true });

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);

  const loadVideo = (file?: File) => {
    if (!file || !file.type.startsWith('video/')) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play(); else video.pause();
  };

  const reset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(undefined);
    setFileName('');
    setIsPlaying(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-[#171816]">
      <header className="flex h-[72px] items-center justify-between border-b border-black/8 bg-[#f8f7f3] px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-[#d9ff45] text-black shadow-[inset_0_0_0_1px_rgb(0_0_0/8%)]"><Play className="size-4 fill-current" /></div>
          <p className="text-[15px] font-bold tracking-[-0.02em]">Layout Check</p>
        </div>
        <span className="hidden items-center gap-1.5 text-xs text-black/50 sm:flex"><Check className="size-3.5 text-[#658200]" /> 영상은 브라우저에서만 처리됩니다</span>
      </header>

      <div className="mx-auto grid max-w-[1360px] gap-5 px-4 py-5 lg:grid-cols-[300px_minmax(390px,1fr)_300px] lg:px-6 lg:py-7">
        <aside className="order-2 rounded-2xl border border-black/8 bg-[#faf9f6] p-5 lg:order-1">
          <div className="mb-5 flex items-center justify-between">
            <div><p className="eyebrow">01 / VIDEO</p><h2 className="mt-1 text-lg font-bold tracking-[-0.03em]">영상 불러오기</h2></div>
            {videoUrl && <Button variant="ghost" size="icon" aria-label="영상 초기화" onClick={reset}><RotateCcw /></Button>}
          </div>
          <button
            className="group flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 bg-white px-5 text-center transition hover:border-black/45 hover:bg-[#fdfff4] focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); loadVideo(event.dataTransfer.files[0]); }}
          >
            <span className="mb-3 grid size-11 place-items-center rounded-full bg-[#d9ff45] transition group-hover:scale-105"><Upload className="size-5" /></span>
            <span className="max-w-48 truncate text-sm font-semibold">{fileName || '영상 파일을 선택하세요'}</span>
            <span className="mt-1.5 text-xs leading-5 text-black/45">MP4, MOV, WebM<br />9:16 세로 영상을 권장합니다</span>
          </button>
          <input ref={inputRef} className="sr-only" type="file" accept="video/*" onChange={(event) => loadVideo(event.target.files?.[0])} />
          <div className="my-6 h-px bg-black/8" />
          <p className="eyebrow mb-3">미리보기 기기</p>
          <button className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-white px-3.5 py-3 text-left">
            <span><span className="block text-sm font-semibold">YouTube Shorts</span><span className="mt-0.5 block text-xs text-black/40">모바일 · 9:16</span></span><ChevronDown className="size-4 text-black/40" />
          </button>
          <div className="mt-4 rounded-xl bg-[#eeece5] p-3.5 text-xs leading-5 text-black/55">실제 UI는 기기, 앱 버전, 계정 설정에 따라 조금 달라질 수 있습니다.</div>
        </aside>

        <section className="order-1 flex min-h-[620px] items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-[#20211f] px-4 py-6 shadow-[0_20px_60px_rgb(0_0_0/10%)] lg:order-2 lg:min-h-[calc(100vh-130px)]">
          <div className="relative aspect-[9/16] h-[min(76vh,720px)] max-h-[720px] overflow-hidden rounded-[28px] bg-[#111] shadow-[0_26px_70px_rgb(0_0_0/45%)] ring-1 ring-white/15">
            {videoUrl ? (
              <video ref={videoRef} src={videoUrl} className="h-full w-full object-cover" loop playsInline onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onClick={togglePlay} />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#41433d_0%,#242522_36%,#151614_78%)]">
                <div className="flex flex-col items-center text-center text-white/45"><Upload className="mb-3 size-7" /><p className="text-sm font-semibold text-white/70">영상 미리보기</p><p className="mt-1 text-[11px]">왼쪽에서 파일을 불러오세요</p></div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0" style={{ opacity: opacity / 100 }}>
              <div className="absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
              <div className="absolute right-3 top-5 flex items-center gap-5 text-white drop-shadow-md"><Volume2 className="size-5" /><MoreVertical className="size-5" /></div>
              {overlays.safe && <div className="absolute bottom-[18%] left-[7%] right-[18%] top-[9%] rounded-lg border border-dashed border-[#d9ff45]/90 bg-[#d9ff45]/[0.035]"><span className="absolute left-2 top-2 rounded bg-[#d9ff45] px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-black">SAFE AREA</span></div>}
              {overlays.actions && (
                <div className="absolute bottom-[12.5%] right-2.5 flex flex-col items-center gap-3 text-white">
                  <Action icon={<Heart />} label="1.2만" /><Action icon={<MessageCircle />} label="328" /><Action icon={<Share2 />} label="공유" /><Action icon={<Bookmark />} label="저장" />
                  <div className="mt-1 grid size-9 place-items-center rounded-lg border-2 border-white/75 bg-neutral-800"><Music2 className="size-4" /></div>
                </div>
              )}
              {overlays.caption && (
                <div className="absolute bottom-5 left-3 right-[17%] text-white drop-shadow-md">
                  <div className="mb-2 flex items-center gap-2"><div className="size-7 rounded-full border border-white/70 bg-gradient-to-br from-[#d9ff45] to-[#6d811d]" /><span className="text-[11px] font-bold">@your_channel</span><span className="rounded border border-white/60 px-2 py-1 text-[9px] font-bold">구독</span></div>
                  <p className="line-clamp-2 text-[10px] leading-4">여기에 영상 설명과 해시태그가 표시됩니다. 중요한 텍스트가 가려지지 않는지 확인하세요.</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[9px]"><Music2 className="size-3" /> 오리지널 사운드 · your_channel</p>
                </div>
              )}
            </div>
            {videoUrl && <button onClick={togglePlay} aria-label={isPlaying ? '일시 정지' : '재생'} className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition hover:opacity-100 focus:opacity-100">{isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}</button>}
          </div>
        </section>

        <aside className="order-3 rounded-2xl border border-black/8 bg-[#faf9f6] p-5">
          <p className="eyebrow">02 / OVERLAY</p><h2 className="mt-1 text-lg font-bold tracking-[-0.03em]">레이아웃 표시</h2><p className="mt-1 text-xs leading-5 text-black/45">확인할 요소만 켜고 끌 수 있어요.</p>
          <div className="mt-5 divide-y divide-black/8 border-y border-black/8">
            {overlayItems.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-center justify-between gap-3 py-4">
                <span><span className="block text-sm font-semibold">{item.label}</span><span className="mt-0.5 block text-[11px] text-black/40">{item.description}</span></span>
                <Switch checked={overlays[item.id]} onCheckedChange={(checked) => setOverlays((current) => ({ ...current, [item.id]: checked }))} aria-label={`${item.label} 표시`} />
              </label>
            ))}
          </div>
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between text-sm"><span className="font-semibold">UI 불투명도</span><span className="font-mono text-xs text-black/45">{opacity}%</span></div>
            <Slider value={[opacity]} min={20} max={100} step={1} onValueChange={(value) => setOpacity(Array.isArray(value) ? value[0] : value)} aria-label="UI 불투명도" />
          </div>
          <div className="mt-7 rounded-xl border border-[#c9e64d] bg-[#f4ffd0] p-4">
            <p className="text-xs font-bold text-[#3f5100]">빠른 체크</p>
            <ul className="mt-2.5 space-y-2 text-[11px] leading-4 text-[#52620f]"><li className="flex gap-2"><Check className="mt-0.5 size-3 shrink-0" /> 핵심 문구는 안전 영역 안쪽</li><li className="flex gap-2"><Check className="mt-0.5 size-3 shrink-0" /> 오른쪽 20%에는 로고 배치 금지</li><li className="flex gap-2"><Check className="mt-0.5 size-3 shrink-0" /> 자막은 하단 설명보다 위쪽</li></ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="flex flex-col items-center gap-0.5 text-[8px] font-semibold [&_svg]:size-6 [&_svg]:fill-black/20"><span className="grid size-8 place-items-center rounded-full bg-black/10">{icon}</span><span>{label}</span></div>;
}

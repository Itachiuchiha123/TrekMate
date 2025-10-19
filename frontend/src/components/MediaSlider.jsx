import React, { useState, useRef, useEffect } from "react";

const MediaSlider = ({ medias, currentIdx, onPrev, onNext, setIdx }) => {
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [moved, setMoved] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const videoRef = useRef(null);

  // Video play/pause and mute state
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  // Video progress state
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  // Double click to zoom (desktop only)
  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (!zoomed) {
      setZoomed(true);
      setZoomOrigin({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      setPan({ x: 0, y: 0 });
      setLastPan({ x: 0, y: 0 });
    } else {
      setZoomed(false);
      setPan({ x: 0, y: 0 });
      setLastPan({ x: 0, y: 0 });
    }
  };

  // Touch events: no double-tap zoom on mobile
  const handleTouchStart = (e) => {
    if (!zoomed) setStartX(e.touches[0].clientX);
    setMoved(false);
    if (zoomed) {
      setPanStart({
        x: e.touches[0].clientX - lastPan.x,
        y: e.touches[0].clientY - lastPan.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (zoomed && panStart) {
      setPan({
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y,
      });
      setLastPan({
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y,
      });
      return;
    }
    setMoved(true);
  };
  const handleTouchEnd = (e) => {
    if (!zoomed && startX !== null) {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (diff > 50) onNext();
      else if (diff < -50) onPrev();
    }
    setStartX(null);
    setMoved(false);
    setPanStart(null);
  };

  // Mouse events for swipe and pan
  const handleMouseDown = (e) => {
    if (zoomed) {
      setIsDragging(true);
      setPanStart({ x: e.clientX - lastPan.x, y: e.clientY - lastPan.y });
    } else {
      setIsDragging(true);
      setStartX(e.clientX);
      setMoved(false);
    }
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    if (zoomed && panStart) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      setLastPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    setMoved(true);
  };
  const handleMouseUp = (e) => {
    if (isDragging && !zoomed && startX !== null) {
      const endX = e.clientX;
      const diff = startX - endX;
      if (diff > 50) onNext();
      else if (diff < -50) onPrev();
    }
    setIsDragging(false);
    setStartX(null);
    setMoved(false);
    setPanStart(null);
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
    setStartX(null);
    setMoved(false);
    setPanStart(null);
  };

  // Prevent click if dragging
  const handleClick = (e) => {
    if (moved) e.preventDefault();
  };

  // Zoom style
  const getZoomStyle = () => {
    if (!zoomed) return {};
    return {
      transform: `scale(2) translate(${pan.x / 2}px, ${pan.y / 2}px)`,
      transition: isDragging || panStart ? "none" : "transform 0.2s",
      cursor: isDragging ? "grabbing" : "grab",
    };
  };

  // Play/pause on click/tap
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setVideoPlaying(true);
    } else {
      video.pause();
      setVideoPlaying(false);
    }
  };

  // Toggle mute
  const handleMuteToggle = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setVideoMuted(video.muted);
  };

  // Keep mute state in sync
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = videoMuted;
  }, [videoMuted, currentIdx]);

  // Pause video when out of viewport or on slide change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          setVideoPlaying(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [currentIdx]);

  // Update time/duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setVideoTime(video.currentTime);
    const handleLoadedMetadata = () => setVideoDuration(video.duration);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentIdx]);

  // Seek handler
  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !videoDuration) return;
    const rect = e.target.getBoundingClientRect();
    const percent = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );
    video.currentTime = percent * videoDuration;
    setVideoTime(video.currentTime);
  };

  // Format time helper
  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full flex flex-col items-center bg-black/90 px-0 py-2 relative select-none">
      <div
        className="relative w-full flex justify-center"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {medias.map(
          (url, i) =>
            i === currentIdx && (
              <div
                key={i}
                className="rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden w-full max-w-2xl mx-auto mb-2 bg-black relative min-h-[400px] md:min-h-[600px] flex items-center justify-center"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                style={{
                  cursor: isDragging ? "grabbing" : zoomed ? "grab" : "grab",
                }}
              >
                {url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <video
                      ref={videoRef}
                      src={url}
                      className="w-full max-h-[600px] object-contain bg-black"
                      style={getZoomStyle()}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      onClick={handleVideoClick}
                      playsInline
                      muted={videoMuted}
                    />
                    {/* Play/Pause overlay icon */}
                    <button
                      type="button"
                      onClick={handleVideoClick}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white focus:outline-none"
                      style={{ display: videoPlaying ? "none" : "flex" }}
                      tabIndex={-1}
                      aria-label={videoPlaying ? "Pause" : "Play"}
                    >
                      {videoPlaying ? (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <rect
                            x="12"
                            y="10"
                            width="5"
                            height="20"
                            rx="2"
                            fill="white"
                          />
                          <rect
                            x="23"
                            y="10"
                            width="5"
                            height="20"
                            rx="2"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <polygon points="14,10 32,20 14,30" fill="white" />
                        </svg>
                      )}
                    </button>
                    {/* Speaker/mute icon */}
                    <button
                      type="button"
                      onClick={handleMuteToggle}
                      className="absolute bottom-12 right-4 bg-black/60 rounded-full p-2 text-white focus:outline-none"
                      tabIndex={-1}
                      aria-label={videoMuted ? "Unmute" : "Mute"}
                    >
                      {videoMuted ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 9L5 13H2v-2h3l4-4v8l-4-4H2v-2h3l4-4v8z"
                            fill="white"
                          />
                          <line
                            x1="16"
                            y1="8"
                            x2="22"
                            y2="16"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <line
                            x1="22"
                            y1="8"
                            x2="16"
                            y2="16"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 9L5 13H2v-2h3l4-4v8l-4-4H2v-2h3l4-4v8z"
                            fill="white"
                          />
                          <path
                            d="M16 8c1.656 1.656 1.656 4.344 0 6"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </button>
                    {/* Video progress bar */}
                    <div className="absolute bottom-2 left-0 right-0 flex items-center px-4">
                      <span
                        className="text-xs text-white mr-2"
                        style={{ minWidth: 36 }}
                      >
                        {formatTime(videoTime)}
                      </span>
                      <div
                        className="flex-1 h-2 bg-white/30 rounded-full cursor-pointer relative"
                        onClick={handleSeek}
                        style={{ minWidth: 0 }}
                      >
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{
                            width: videoDuration
                              ? `${(videoTime / videoDuration) * 100}%`
                              : "0%",
                          }}
                        ></div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 left-0 h-4 w-4 rounded-full bg-blue-500 shadow"
                          style={{
                            left: videoDuration
                              ? `calc(${
                                  (videoTime / videoDuration) * 100
                                }% - 8px)`
                              : "-8px",
                            pointerEvents: "none",
                          }}
                        ></div>
                      </div>
                      <span
                        className="text-xs text-white ml-2"
                        style={{ minWidth: 36 }}
                      >
                        {formatTime(videoDuration)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt="Post Media"
                    className="w-full max-h-[600px] object-contain bg-black"
                    style={getZoomStyle()}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                )}
              </div>
            )
        )}
        {medias.length > 1 && !zoomed && (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 z-10 hover:bg-black"
              aria-label="Previous"
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 z-10 hover:bg-black"
              aria-label="Next"
            >
              &#8594;
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {medias.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-2 h-2 rounded-full ${
                    i === currentIdx ? "bg-blue-500" : "bg-gray-400"
                  } opacity-80`}
                  onClick={() => setIdx(i)}
                  style={{ cursor: "pointer" }}
                ></span>
              ))}
            </div>
          </>
        )}
        {zoomed && (
          <button
            type="button"
            className="absolute top-4 right-4 bg-black/70 text-white rounded-full px-3 py-1 z-20 text-sm font-semibold hover:bg-black"
            onClick={() => {
              setZoomed(false);
              setPan({ x: 0, y: 0 });
              setLastPan({ x: 0, y: 0 });
            }}
          >
            Reset Zoom
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaSlider;

import React, { useState } from "react";

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

  // Double click/tap to zoom
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
  // Double tap for mobile (timer-based)
  const doubleTapTimeout = React.useRef(null);
  const [tapCount, setTapCount] = useState(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTapCount((prev) => prev + 1);
      if (doubleTapTimeout.current) clearTimeout(doubleTapTimeout.current);
      doubleTapTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, 350);
      if (tapCount === 1) {
        setZoomed((z) => !z);
        setPan({ x: 0, y: 0 });
        setLastPan({ x: 0, y: 0 });
        setTapCount(0);
        if (doubleTapTimeout.current) clearTimeout(doubleTapTimeout.current);
        e.preventDefault();
        return;
      }
    }
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
                  <video
                    src={url}
                    controls
                    className="w-full max-h-[600px] object-contain bg-black"
                    style={getZoomStyle()}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
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

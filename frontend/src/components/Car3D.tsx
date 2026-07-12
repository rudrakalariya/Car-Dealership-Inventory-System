export default function Car3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="sketchfab-embed-wrapper w-full h-full">
        <iframe
          title="(FREE) Porsche 911 Carrera 4S"
          frameBorder="0"
          allowFullScreen
          // @ts-expect-error React types don't natively support mozallowfullscreen for iframe
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking="true"
          execution-while-out-of-viewport="true"
          execution-while-not-rendered="true"
          web-share="true"
          src="https://sketchfab.com/models/d01b254483794de3819786d93e0e1ebf/embed?autostart=1&autospin=0.2&ui_infos=0&ui_watermark_link=0&ui_watermark=0&transparent=1"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}

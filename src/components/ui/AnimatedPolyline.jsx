import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function AnimatedPolyline({ positions, color = "#3b82f6" }) {
  const map = useMap();
  const layerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!positions || positions.length === 0) return;

    // Hapus layer lama
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    cancelAnimationFrame(animRef.current);

    const polyline = L.polyline(positions, {
      color,
      weight: 5,
      opacity: 1,
    }).addTo(map);

    layerRef.current = polyline;

    const tryAnimate = () => {
      const el = polyline._path;
      if (!el) {
        setTimeout(tryAnimate, 50);
        return;
      }

      const length = el.getTotalLength?.() ?? 500;

      // Setup awal: garis tersembunyi penuh
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
      el.style.transition = "none";

      let start = null;
      const duration = 2000; // ms — durasi garis tergambar sekali

      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1); // 0 → 1, berhenti di 1

        // Easing: easeInOut agar halus
        const ease = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        el.style.strokeDashoffset = `${length * (1 - ease)}`;

        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        }
      };

      animRef.current = requestAnimationFrame(animate);
    };

    tryAnimate();

    return () => {
      cancelAnimationFrame(animRef.current);
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [positions, color, map]);

  return null;
}
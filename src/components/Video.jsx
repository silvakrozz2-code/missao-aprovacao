import { useState } from "react";
import { Play } from "lucide-react";
import { N } from "@/estado.js";
import { inteira } from "@/nucleo/videos.js";

/* Toca no app só o trecho do assunto: o player do YouTube começa no início e para no fim definidos.
   O vídeo continua no canal do professor (visualização conta para ele); nada é baixado nem copiado. */
export function TrechoVideo({ v, ini, fim, titulo }) {
  const [on, setOn] = useState(false);
  const vid = N.VIDEOS[v]; if (!vid) return null;
  const s = N.segs(ini), e = fim ? N.segs(fim) : null;
  const src = `https://www.youtube-nocookie.com/embed/${vid.id}?start=${s}${e ? `&end=${e}` : ""}&autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-risco-2 bg-black">
      {on ? <iframe src={src} title={titulo} className="absolute inset-0 size-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        : <button type="button" onClick={() => setOn(true)} aria-label={inteira([v, ini, fim]) ? `Assistir aqui: ${titulo}` : `Assistir aqui: ${titulo}, de ${ini}${fim ? ` até ${fim}` : ""}`} className="group absolute inset-0">
          <img src={`https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover opacity-55 transition-opacity group-hover:opacity-70" />
          <span className="absolute inset-0 bg-[linear-gradient(transparent_40%,rgba(0,0,0,.8))]" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-giz text-lousa shadow-2xl transition-transform group-hover:scale-110"><Play className="ml-1 size-7 fill-current" /></span>
          <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-left text-white"><b className="leading-tight">{titulo}</b><span className="num shrink-0 rounded-md bg-black/70 px-1.5 text-sm">{inteira([v, ini, fim]) ? "aula inteira" : `${ini}${fim ? ` → ${fim}` : ""}`}</span></span>
        </button>}
    </div>
  );
}

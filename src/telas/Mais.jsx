import { CalendarDays, ChartColumn, MessageCircle, Timer, FileClock, Moon, NotebookPen, Scale, Dumbbell, Settings, HardDriveDownload, ChevronRight, SunMoon, LogOut } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { Spotlight } from "@/components/efeitos/efeitos.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Cabeca } from "./comum.jsx";

export default function Mais() {
  const n = useNucleo(); const S = n.getS(); const o = S.obj;
  const grupos = [
    ["Planejar", [["plano", CalendarDays, "Mapa da semana", "Planner montado com as suas horas livres"], ["desempenho", ChartColumn, "Desempenho", "Acerto por matéria, tema, simulados e medalhas"], ["vespera", Moon, "Modo véspera", "Só resumos, números e checklist do dia"]]],
    ["Estudar", [["tutor", MessageCircle, "Tutor", "Tire dúvidas e veja o que estudar"], ["foco", Timer, "Foco (pomodoro)", "Timer 25/5 com ciclos"], ["simulado", FileClock, "Simulado", "Prova completa ou mini"], ["erros", NotebookPen, "Caderno de erros", "Seus erros com o motivo que você anotou"], ["leis", Scale, "Leis e links", "Texto oficial e videoaulas"], ...(o === "npor" ? [["taf", Dumbbell, "TAF", "Registre corrida, flexão, abdominal e barra"]] : [])]],
    ["Configurar", [["ajustes", Settings, "Ajustes", "Datas das provas, tom, fonte e tema"], ["backup", HardDriveDownload, "Backup", "Passe seu progresso do PC para o celular"]]],
  ];
  const claro = S.cfg.tema === "light";
  return (
    <div className="flex flex-col gap-6">
      <Cabeca eyebrow={n.OBJS[o].nome} titulo="Mais">Ferramentas de apoio. Estas telas abrem na versão clássica do app, com o mesmo progresso salvo.</Cabeca>
      {grupos.map(([nome, itens]) => (
        <section key={nome} className="flex flex-col gap-2">
          <h2 className="mao text-xl text-marca">{nome}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {itens.map(([r, Ic, t, d]) => (
              <Spotlight key={r} as="a" href={`/classico/#${r}`} className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-risco bg-folha p-3.5 transition-colors hover:border-risco-2">
                <span className="relative grid size-10 place-items-center rounded-xl bg-folha-2 text-acc"><Ic className="size-5" /></span>
                <span className="relative min-w-0"><b className="block leading-tight">{t}</b><span className="text-sm text-apagado">{d}</span></span>
                <ChevronRight className="relative size-5 text-apagado" />
              </Spotlight>))}
          </div>
        </section>))}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => { S.cfg.tema = claro ? "dark" : "light"; n.salvar(); n.render(); }}><SunMoon /> {claro ? "Usar lousa escura" : "Usar tema claro"}</Button>
        <form method="post" action="/api/entrar?sair=1"><Button type="submit" variant="ghost"><LogOut /> Sair da conta</Button></form>
      </div>
    </div>
  );
}

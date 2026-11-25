import { Landmark, BookOpenText, Calculator, Monitor, Scale, ShieldHalf, Globe, PenTool, Languages, FlaskConical, BookMarked } from "lucide-react";
const MAPA = { esp: Landmark, port: BookOpenText, rl: Calculator, info: Monitor, leg: Scale, mat: Calculator, hist: ShieldHalf, geo: Globe, red: PenTool, ling: Languages, hum: Globe, nat: FlaskConical };
export const IconeMat = ({ mid, ...p }) => { const C = MAPA[mid] || BookMarked; return <C aria-hidden {...p} />; };

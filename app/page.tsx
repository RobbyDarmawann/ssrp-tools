"use client";

import { useState, useRef, useCallback } from "react";
import Draggable from "react-draggable";
import { toPng } from "html-to-image";
import { Upload, Plus, Trash2, Download, RefreshCcw, MessageSquare, User, Globe, Image as ImageIcon, Settings, Type, Layout, Moon, Sun, Languages, MessageCircle, Radio, Volume1 } from "lucide-react";

// Tipe baris diperbarui dengan tambahan ooc, radio, dan low
type LineType = 'chat' | 'me' | 'do' | 'ooc' | 'radio' | 'low';

type ChatLine = {
  id: string;
  text: string;
  type: LineType;
  customColor: string; 
};

type TextGroup = {
  id: string;
  lines: ChatLine[];
  fontSize: number;
  x: number; 
  y: number; 
};

// --- KAMUS BAHASA (DICTIONARY) ---
const dict = {
  id: {
    title: "SSRP Studio",
    exportBtn: "Ekspor Gambar",
    startTitle: "Mulai Buat SSRP",
    startDesc: "Unggah screenshot dari dalam game untuk mulai meracik roleplay. Gambar diproses sepenuhnya di browser.",
    chooseImage: "Pilih Gambar",
    properties: "Pengaturan",
    canvasSize: "Ukuran Kanvas",
    textLayers: "Lapisan Teks",
    addLayer: "Tambah Layer",
    emptyLayer: "Belum ada percakapan",
    layer: "Layer",
    fontSize: "Ukuran Font",
    normal: "Biasa",
    reset: "Reset",
    builtBy: "Dibuat oleh",
    typeHere: "Ketik chat/RP di sini..."
  },
  en: {
    title: "SSRP Studio",
    exportBtn: "Export Image",
    startTitle: "Create your SSRP",
    startDesc: "Upload an in-game screenshot to start crafting your roleplay. Processed entirely in your browser.",
    chooseImage: "Choose Image",
    properties: "Properties",
    canvasSize: "Canvas Size",
    textLayers: "Text Layers",
    addLayer: "Add Layer",
    emptyLayer: "No conversations yet",
    layer: "Layer",
    fontSize: "Font Size",
    normal: "Normal",
    reset: "Reset",
    builtBy: "Built by",
    typeHere: "Type chat/RP here..."
  }
};

// Fungsi bantuan untuk mendapatkan warna default sesuai konteks roleplay SAMP
const getDefaultColor = (type: LineType) => {
  switch(type) {
    case 'chat': return '#ffffff';
    case 'me': return '#c2a2da'; // Ungu RP
    case 'do': return '#c2a2da'; // Ungu RP
    case 'ooc': return '#b9c9bf'; // Putih keabu-abuan khas OOC
    case 'radio': return '#33aa33'; // Hijau Faction (bisa diganti misal #8D8DFF untuk PD)
    case 'low': return '#c8c8c8';
    default: return '#ffffff';
  }
};

const DraggableText = ({ group, onDrag }: { group: TextGroup; onDrag: (id: string, x: number, y: number) => void; }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const sampTextShadow = "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000";

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" position={{ x: group.x, y: group.y }} onDrag={(e, data) => onDrag(group.id, data.x, data.y)}>
      <div ref={nodeRef} className="absolute cursor-move w-max transition-transform hover:scale-[1.01] active:scale-100" style={{ fontSize: `${group.fontSize}px` }}>
        {group.lines.map((line) => {
          const defaultColor = getDefaultColor(line.type);
          const finalColor = line.customColor !== "" ? line.customColor : defaultColor;

          return (
            <div
              key={line.id}
              style={{
                color: finalColor,
                fontFamily: "Arial, Tahoma, sans-serif", 
                fontWeight: "bold",
                textShadow: sampTextShadow,
                lineHeight: "1.2",
                whiteSpace: "pre-wrap",
              }}
            >
              {line.text || " "}
            </div>
          );
        })}
      </div>
    </Draggable>
  );
};

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [textGroups, setTextGroups] = useState<TextGroup[]>([]);
  const [canvasWidth, setCanvasWidth] = useState<number>(1280);
  const [canvasHeight, setCanvasHeight] = useState<number>(720);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useState<boolean>(true);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const t = dict[lang];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleExport = useCallback(async () => {
    if (canvasRef.current === null) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true, quality: 1.0 });
      const link = document.createElement('a');
      link.download = `SSRP_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengekspor gambar:", err);
      alert("Terjadi kesalahan saat mengekspor gambar.");
    }
  }, [canvasRef]);

  const addTextGroup = () => {
    const newGroup: TextGroup = {
      id: Date.now().toString(),
      fontSize: 16,
      x: 24, y: 24,
      lines: [{ id: Date.now().toString() + "-1", text: "Nama_Karakter says: ", type: 'chat', customColor: "" }],
    };
    setTextGroups([...textGroups, newGroup]);
  };

  const deleteTextGroup = (id: string) => setTextGroups(textGroups.filter((group) => group.id !== id));
  const updateGroupSetting = (id: string, key: keyof TextGroup, value: number) => setTextGroups(textGroups.map(g => g.id === id ? { ...g, [key]: value } : g));
  const handleDrag = (id: string, x: number, y: number) => setTextGroups(prev => prev.map(g => g.id === id ? { ...g, x, y } : g));

  const addLineToGroup = (groupId: string, type: LineType) => {
    let defaultText = "";
    if (type === 'chat') defaultText = "Nama_Karakter says: ";
    if (type === 'me') defaultText = "* Nama_Karakter ";
    if (type === 'do') defaultText = "* ... (( Nama_Karakter ))";
    if (type === 'ooc') defaultText = "(( [OOC] Nama_Karakter:  ))";
    if (type === 'radio') defaultText = "** [Radio] Nama_Karakter: ";
    if (type === 'low') defaultText = "Nama_Karakter says [low]: ";

    setTextGroups(textGroups.map(group => group.id === groupId ? {
      ...group, lines: [...group.lines, { id: Date.now().toString(), text: defaultText, type, customColor: "" }]
    } : group));
  };

  const updateLine = (groupId: string, lineId: string, key: keyof ChatLine, value: string) => {
    setTextGroups(textGroups.map(group => group.id === groupId ? {
      ...group, lines: group.lines.map(line => line.id === lineId ? { ...line, [key]: value } : line)
    } : group));
  };

  const removeLine = (groupId: string, lineId: string) => {
    setTextGroups(textGroups.map(group => group.id === groupId ? { ...group, lines: group.lines.filter(line => line.id !== lineId) } : group));
  };

  const themeClasses = isDark ? "bg-zinc-950 text-zinc-200 border-zinc-800" : "bg-gray-50 text-zinc-800 border-gray-200";
  const panelClasses = isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200";
  const cardClasses = isDark ? "bg-zinc-900 border-zinc-800" : "bg-gray-50 border-gray-200";
  const inputClasses = isDark ? "bg-zinc-950 border-zinc-800 focus:border-indigo-500/50 text-white" : "bg-white border-gray-300 focus:border-indigo-500 text-black";
  const workspaceBg = isDark ? "bg-[#121214]" : "bg-[#e5e5e5]";

  const getLineLabel = (type: LineType) => {
    switch(type) {
      case 'chat': return t.normal;
      case 'me': return '/me';
      case 'do': return '/do';
      case 'ooc': return 'OOC';
      case 'radio': return 'Radio';
      case 'low': return 'Low';
      default: return '';
    }
  };

  return (
    <main className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${themeClasses} selection:bg-indigo-500/30`}>
      <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 z-10 transition-colors ${panelClasses}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layout size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-wide">{t.title}</h1>
          </div>
          
          <div className="h-6 w-px bg-zinc-500/30"></div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-md hover:bg-zinc-500/10 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setLang(lang === 'id' ? 'en' : 'id')} className={`flex items-center gap-1.5 p-2 rounded-md hover:bg-zinc-500/10 transition-colors text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <Languages size={18} /> {lang.toUpperCase()}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="https://github.com/RobbyDarmawann" target="_blank" rel="noreferrer" className={`text-sm font-medium flex items-center gap-2 hover:text-indigo-500 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7a4.6 4.6 0 0 0-1.39-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.35-3.5 1.25a11.39 11.39 0 0 0-6.2 0C6.5 2.8 5.4 3.15 5.4 3.15a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.2c0 5.6 3.36 6.65 6.5 7a4.8 4.8 0 0 0-1 3.03V22"></path>
              <path d="M9 20c-5 1.5-5-2.5-7-3"></path>
            </svg>
            <span className="hidden sm:inline">{t.builtBy} RobbyDarmawann</span>
          </a>
          
          {image && (
            <button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95">
              <Download size={16} /> {t.exportBtn}
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 relative overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-500/50 [&::-webkit-scrollbar-thumb]:rounded-full ${workspaceBg}`}>
          
          {!image ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`w-20 h-20 mb-6 rounded-2xl border flex items-center justify-center shadow-sm ${cardClasses}`}>
                <ImageIcon size={32} className={isDark ? "text-zinc-600" : "text-zinc-400"} />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{t.startTitle}</h2>
              <p className={`mb-8 max-w-sm text-center text-sm leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {t.startDesc}
              </p>
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/25 active:scale-95">
                <Upload size={18} />
                <span>{t.chooseImage}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          ) : (
            <div className="min-h-full min-w-full flex items-center justify-center p-8">
              <div ref={canvasRef} className="relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden bg-black transition-all duration-300 ring-1 ring-black/10" style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
                <img src={image} alt="SSRP Background" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                {textGroups.map((group) => (
                  <DraggableText key={group.id} group={group} onDrag={handleDrag} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={`w-[360px] flex flex-col z-10 shadow-2xl border-l transition-colors ${panelClasses}`}>
          <div className={`p-4 border-b flex items-center gap-2 ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
            <Settings size={18} className="text-indigo-500" />
            <h2 className="font-semibold">{t.properties}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-500/50 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="space-y-2">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{t.canvasSize}</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-medium">W</span>
                  <input type="number" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} className={`w-full rounded-md pl-8 pr-3 py-2 text-sm outline-none transition-all border ${inputClasses}`} />
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-medium">H</span>
                  <input type="number" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} className={`w-full rounded-md pl-8 pr-3 py-2 text-sm outline-none transition-all border ${inputClasses}`} />
                </div>
              </div>
            </div>

            {image && (
              <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{t.textLayers}</label>
                  <button onClick={addTextGroup} className="text-indigo-600 hover:text-indigo-500 text-xs font-medium flex items-center gap-1 transition-colors">
                    <Plus size={14} /> {t.addLayer}
                  </button>
                </div>

                {textGroups.length === 0 ? (
                  <div className={`border rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 ${isDark ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <Type size={20} />
                    <p className="text-sm">{t.emptyLayer}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {textGroups.map((group, index) => (
                      <div key={group.id} className={`border rounded-xl overflow-hidden transition-all ${cardClasses}`}>
                        
                        <div className={`px-3 py-2 flex justify-between items-center border-b ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-gray-100 border-gray-200'}`}>
                          <span className="font-semibold text-xs flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> {t.layer} {index + 1}
                          </span>
                          <button onClick={() => deleteTextGroup(group.id)} className="text-zinc-400 hover:text-red-500 transition-colors p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="p-3 space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 font-medium">{t.fontSize}</label>
                              <input type="number" value={group.fontSize} onChange={(e) => updateGroupSetting(group.id, 'fontSize', Number(e.target.value))} className={`w-full rounded-md p-1.5 text-xs text-center outline-none border ${inputClasses}`} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 font-medium">X Pos</label>
                              <input type="number" value={Math.round(group.x)} onChange={(e) => updateGroupSetting(group.id, 'x', Number(e.target.value))} className={`w-full rounded-md p-1.5 text-xs text-center outline-none border ${inputClasses}`} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 font-medium">Y Pos</label>
                              <input type="number" value={Math.round(group.y)} onChange={(e) => updateGroupSetting(group.id, 'y', Number(e.target.value))} className={`w-full rounded-md p-1.5 text-xs text-center outline-none border ${inputClasses}`} />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {group.lines.map((line) => (
                              <div key={line.id} className={`group relative rounded-md p-2 border transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800 focus-within:border-indigo-500/50' : 'bg-white border-gray-300 focus-within:border-indigo-500'}`}>
                                <div className="absolute -top-2 left-2 px-1 text-[9px] font-bold uppercase tracking-wider rounded bg-zinc-900 text-zinc-400">
                                  {getLineLabel(line.type)}
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <textarea
                                    value={line.text}
                                    onChange={(e) => updateLine(group.id, line.id, "text", e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-xs resize-none h-auto min-h-[18px]"
                                    placeholder={t.typeHere}
                                    rows={1}
                                  />
                                  <button onClick={() => removeLine(group.id, line.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all self-start">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-4 h-4 rounded-sm overflow-hidden relative border border-zinc-400/20">
                                    <input type="color" value={line.customColor || getDefaultColor(line.type)} onChange={(e) => updateLine(group.id, line.id, "customColor", e.target.value)} className="absolute -top-2 -left-2 w-8 h-8 cursor-pointer" />
                                  </div>
                                  {line.customColor !== "" && (
                                    <button onClick={() => updateLine(group.id, line.id, "customColor", "")} className="text-[10px] text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                                      <RefreshCcw size={10} /> {t.reset}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Tombol preset yang baru disusun dalam bentuk grid */}
                          <div className="grid grid-cols-3 gap-1.5 pt-1">
                            <button onClick={() => addLineToGroup(group.id, 'chat')} className={`py-1.5 rounded-md text-[10px] font-medium flex items-center justify-center gap-1 transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              <MessageSquare size={10} /> {t.normal}
                            </button>
                            <button onClick={() => addLineToGroup(group.id, 'me')} className={`py-1.5 rounded-md text-[10px] text-[#c2a2da] font-medium flex items-center justify-center gap-1 transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              <User size={10} /> /me
                            </button>
                            <button onClick={() => addLineToGroup(group.id, 'do')} className={`py-1.5 rounded-md text-[10px] text-[#c2a2da] font-medium flex items-center justify-center gap-1 transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              <Globe size={10} /> /do
                            </button>
                            <button onClick={() => addLineToGroup(group.id, 'ooc')} className={`py-1.5 rounded-md text-[10px] text-[#b9c9bf] font-medium flex items-center justify-center gap-1 transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              <MessageCircle size={10} /> OOC
                            </button>
                            <button onClick={() => addLineToGroup(group.id, 'radio')} className={`py-1.5 rounded-md text-[10px] text-[#33aa33] font-medium flex items-center justify-center gap-1 transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              <Radio size={10} /> Radio
                            </button>
                            <button onClick={() => addLineToGroup(group.id, 'low')} className={`py-1.5 rounded-md text-[10px] text-zinc-300 font-medium flex items-center justify-center gap-1 transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              <Volume1 size={10} /> Low
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
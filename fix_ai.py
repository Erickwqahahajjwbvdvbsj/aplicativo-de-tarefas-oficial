with open("src/components/ScreenAI.tsx", "r") as f:
    content = f.read()

# Replace bg
content = content.replace('bg-[#F4F5F9]', 'bg-[#1f1f1f]')

# Replace header
import re
header_pattern = r'\{/\* Header \*/\}.*?(?=\{/\* AI Card \*/\})'
new_header = """{/* Header */}
      <div className="flex justify-between items-center mb-6 px-2 shrink-0 pt-2">
        <h1 className="text-white font-bold text-[22px] leading-tight">Assistente IA</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-[#303030] shadow-sm hover:bg-white/10 transition">
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>
      """
content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)

# Replace prompt info
prompts_pattern = r'\{/\* Prompts info \*/\}.*?(?=\{/\* Input Box \*/\})'
new_prompts = """{/* Prompts info */}
      <div className="flex justify-between items-center px-3 mb-4 shrink-0">
        <div className="flex items-center gap-1.5 text-white font-bold text-[11px]">
          <Sparkles className="w-4 h-4 fill-white text-white" /> 16 prompts restantes
        </div>
        <span className="text-white/50 text-[10px] font-bold">Desenvolvido por GPT-4.5</span>
      </div>
      """
content = re.sub(prompts_pattern, new_prompts, content, flags=re.DOTALL)

# Replace input box
input_pattern = r'\{/\* Input Box \*/\}.*?(?=\s*</div>\s*\n\s*\}\);)'
new_input = """{/* Input Box */}
      <div className="relative mb-5 shrink-0 px-1">
        <input 
          type="text" 
          placeholder="Pergunte qualquer coisa.." 
          className="w-full bg-[#303030] border border-white/10 placeholder-white/50 text-white rounded-[28px] py-4 pl-5 pr-14 text-[13px] font-bold shadow-[0_2px_15px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition">
          <Send className="w-4 h-4 text-black -mt-0.5 ml-0.5" />
        </button>
      </div>
"""
# wait, the last div and bottom nav
# we need to append bottom nav right before the last </div>

# And imports:
# We need Home, CalendarDays, Focus, MessageCircle, User from lucide-react.
# Let's just update imports.
content = content.replace("import { ArrowLeft, Menu, Settings2, Camera, Mic, Video, Sparkles, Send } from 'lucide-react';", "import { Menu, Settings2, Camera, Mic, Video, Sparkles, Send, Home, CalendarDays, Focus, MessageCircle, User } from 'lucide-react';")

# Props change
content = content.replace("export function ScreenAI({ onBack }: { onBack: () => void }) {", "export function ScreenAI({ onNavigate }: { onNavigate: (tab: 'home' | 'roadmap' | 'ai' | 'profile' | 'focus' | 'notifications') => void }) {")

# Append bottom nav
bottom_nav = """      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-[#303030] rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] px-6 flex justify-between items-center z-50">
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col items-center gap-1 min-w-[48px] hover: transition"
        >
          <Home className="w-[22px] h-[22px] text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] mt-1">
            Início
          </span>
        </button>

        <button
          onClick={() => onNavigate("roadmap")}
          className="flex flex-col items-center gap-1 min-w-[48px] hover: transition"
        >
          <CalendarDays className="w-[22px] h-[22px] text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] mt-1">
            Tarefas
          </span>
        </button>

        <button
          onClick={() => onNavigate("focus")}
          className="flex flex-col items-center gap-1 min-w-[48px] hover: transition"
        >
          <Focus className="w-[22px] h-[22px] text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] mt-1">Foco</span>
        </button>

        <button
          onClick={() => onNavigate("ai")}
          className="flex flex-col items-center gap-1 min-w-[48px]"
        >
          <MessageCircle className="w-[22px] h-[22px] text-[#ff3838]" />
          <span className="text-[10px] font-bold text-[#ff3838] mt-1">Chat</span>
        </button>

        <button
          onClick={() => onNavigate("profile")}
          className="flex flex-col items-center gap-1 min-w-[48px] hover: transition"
        >
          <User className="w-[22px] h-[22px] text-[#aaaaaa]" />
          <span className="text-[10px] font-bold text-[#aaaaaa] mt-1">
            Perfil
          </span>
        </button>
      </div>
    </div>
  );
}"""
content = re.sub(r'\{/\* Input Box \*/\}.*$', new_input + bottom_nav, content, flags=re.DOTALL)

with open("src/components/ScreenAI.tsx", "w") as f:
    f.write(content)

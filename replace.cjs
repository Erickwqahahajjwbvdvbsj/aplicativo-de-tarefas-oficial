const fs = require('fs');
const files = ['src/components/ScreenGoals.tsx', 'src/components/ScreenHome.tsx', 'src/components/ScreenRoadmap.tsx'];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/<Home\s+size=\{24\}\s+className="text-\[#aaaaaa\]"\s*\/>/g, '<img src="https://i.ibb.co/LXjJp2qm/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-165702-0000.png" alt="Início" className="w-[26px] h-[26px] object-contain opacity-75" referrerPolicy="no-referrer" />');
  c = c.replace(/<Home\s+size=\{24\}\s+className="text-\[#ff3838\]"\s*\/>/g, '<img src="https://i.ibb.co/LXjJp2qm/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-165702-0000.png" alt="Início" className="w-[26px] h-[26px] object-contain" referrerPolicy="no-referrer" />');
  fs.writeFileSync(f, c);
});
console.log("Done!");

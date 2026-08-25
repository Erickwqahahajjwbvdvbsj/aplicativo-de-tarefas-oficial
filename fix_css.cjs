const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

// Ensure we also disable user select maybe? Or just the tap highlight color is enough.
// Actually, they specifically said: "quando vai tipo tocando na tela vai meio que escurecendo e quando você solta o dedo meu que fica ao normal"
// This is exactly what `-webkit-tap-highlight-color: transparent` fixes!


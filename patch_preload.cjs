const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const lockIconUrl = '"https://i.ibb.co/RkjZrzH6/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260819-132338-0000.png"';

if (!code.includes(lockIconUrl)) {
    // find ICONS_TO_PRELOAD and append
    code = code.replace(
        /const ICONS_TO_PRELOAD = \[\n/,
        `const ICONS_TO_PRELOAD = [\n  ${lockIconUrl},\n`
    );
    fs.writeFileSync('src/App.tsx', code);
    console.log('Added lock icon to ICONS_TO_PRELOAD');
} else {
    console.log('Lock icon already in ICONS_TO_PRELOAD');
}

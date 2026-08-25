const fs = require('fs');
let code = fs.readFileSync('src/components/ScreenHome.tsx', 'utf8');

const regex = /addTask\(\{\s*title: selectedTask\.title \|\| "",\s*description: selectedTask\.description \|\| "",\s*priority: selectedTask\.priority \|\| "",\s*category: selectedTask\.category \|\| "",\s*effort: selectedTask\.effort \|\| "",\s*completed: false,\s*\}\);/g;

if(code.match(regex)) {
    console.log("Already fixed duplication in Home");
} else {
    // Need to verify duplication
}

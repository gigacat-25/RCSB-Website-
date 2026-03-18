const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
            if (!dirPath.includes('node_modules')) callback(dirPath);
        }
    });
}

const replacements = [
    { regex: /bg-white(?![\w\-\/]| dark:bg-slate-800)/g, replace: "bg-white dark:bg-slate-800" },
    { regex: /bg-brand-light(?![\w\-\/]| dark:bg-slate-900)/g, replace: "bg-brand-light dark:bg-slate-900" },
    { regex: /text-brand-gray\/80(?![\w\-\/]| dark:text-slate-300)/g, replace: "text-brand-gray/80 dark:text-slate-300" },
    { regex: /text-brand-gray\/60(?![\w\-\/]| dark:text-slate-400)/g, replace: "text-brand-gray/60 dark:text-slate-400" },
    { regex: /text-brand-gray(?![\w\-\/]| dark:text-slate-200)/g, replace: "text-brand-gray dark:text-slate-200" },
    { regex: /border-gray-100(?![\w\-\/]| dark:border-slate-700)/g, replace: "border-gray-100 dark:border-slate-700" },
    { regex: /border-gray-200(?![\w\-\/]| dark:border-slate-700)/g, replace: "border-gray-200 dark:border-slate-700" },
    { regex: /bg-gray-50(?![\w\-\/]| dark:bg-slate-800\/50)/g, replace: "bg-gray-50 dark:bg-slate-800/50" },
    { regex: /text-brand-blue(?![\w\-\/]| dark:text-brand-azure| \w*border)/g, replace: "text-brand-blue dark:text-brand-azure" }
];

function processFiles(dir) {
    walkDir(dir, (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        replacements.forEach(({ regex, replace }) => {
            let newContent = content.replace(regex, replace);
            if (newContent !== content) {
                content = newContent;
                changed = true;
            }
        });

        if (changed) {
            content = content.replace(/(dark:bg-slate-800\s*)+/g, 'dark:bg-slate-800 ');
            content = content.replace(/(dark:bg-slate-900\s*)+/g, 'dark:bg-slate-900 ');
            content = content.replace(/(dark:text-slate-300\s*)+/g, 'dark:text-slate-300 ');
            content = content.replace(/(dark:text-slate-400\s*)+/g, 'dark:text-slate-400 ');
            content = content.replace(/(dark:text-slate-200\s*)+/g, 'dark:text-slate-200 ');
            content = content.replace(/(dark:border-slate-700\s*)+/g, 'dark:border-slate-700 ');
            content = content.replace(/(dark:bg-slate-800\/50\s*)+/g, 'dark:bg-slate-800/50 ');
            content = content.replace(/(dark:text-brand-azure\s*)+/g, 'dark:text-brand-azure ');

            content = content.replace(/ \s+"/g, ' "');
            content = content.replace(/ \s+'/g, " '");
            content = content.replace(/ \s+`/g, " `");

            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Updated: " + filePath);
        }
    });
}

processFiles(path.join(__dirname, 'app'));
processFiles(path.join(__dirname, 'components'));

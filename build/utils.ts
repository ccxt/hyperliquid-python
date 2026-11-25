import * as fs from 'fs'
import path from 'path'
import { exec, execSync } from 'node:child_process';


function mkdir (dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function cp(source: string, destination: string): void {
    // check if source is file or dir
    if (!fs.existsSync(source)) {
        throw new Error(`Source file/directory does not exist: ${source}`);
    }
    const stats = fs.statSync(source);
    if (stats.isFile()) {
        // get parent directory
        const parentDir = path.dirname(destination);
        // check if parent directory exists
        mkdir(parentDir);
        fs.copyFileSync(source, destination);
        return;
    }
    mkdir(destination);
    const files = fs.readdirSync(source);
    for (const file of files) {
        const srcPath = path.join(source, file);
        const destPath = path.join(destination, file);
        cp(srcPath, destPath);
    }
}

function capitalize (str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function regexAll (text: string, array: any[]) {
    for (const i in array) {
        const regexValue = array[i][0];
        const flags = (typeof regexValue === 'string') ? 'g' : undefined;
        const regex = new RegExp (regexValue, flags);
        text = text.replace (regex, array[i][1]);
    }
    return text;
}

function sanitizePackageName (name:string) {
    return name.replace(/-/g, '_');
}



function jsonFromFile (path: string) {
    return JSON.parse(fs.readFileSync(path).toString());
}


const argvs = process.argv.slice(2);
let exchange = argvs[0];
if (!exchange || exchange.includes('--')) {
    const nameFile = __dirname + '/../exchange_name';
    if (fs.existsSync(nameFile)) {
        exchange = fs.readFileSync(nameFile, 'utf8').trim();
    }
}
if (!exchange) {
    console.error('Please pass exchange name to build script or set it in a "exchange_name" file in the root of the project');
    process.exit(1);
}


export {
    cp,
    mkdir,
    capitalize,
    sanitizePackageName,
    regexAll,
    exec,
    execSync,
    argvs,
    jsonFromFile,
    exchange as exchangeArgv,
}

export default {}
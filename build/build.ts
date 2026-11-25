import * as fs from 'fs'
import path from 'path'

import { argvs, sanitizePackageName, exchangeArgv, execSync, cp, capitalize, regexAll } from './utils';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


class build {

    language:string = 'python';

    exchange:string;
    sourceFolder:string;
    destinationFolder:string;
    downloadAndDelete:boolean;

    constructor(exchange: string) {
        this.exchange = exchange;
        this.sourceFolder = __dirname +  `/ccxt/`;
        this.destinationFolder = __dirname +  `/../${exchange}/ccxt/`;
        this.downloadAndDelete = !argvs.includes('--nodownload');
    }

    async downloadCcxtRepo() {
        try {
            execSync('rm -rf ccxt/', { stdio: 'ignore' });
        } catch (ex) {
            execSync('if exist "ccxt" (rmdir /s /q ccxt)'); // for windows (temporarily :)
        }
        execSync ('git clone --depth 1 https://github.com/ccxt/ccxt.git');
    }

    copyCcxtFiles (exchange:string): void {
        const sourceDir = this.sourceFolder + '/python/ccxt/';
        const copyList = [
            // exchange files
            `${exchange}.py`,
            `abstract/${exchange}.py`,
            `async_support/${exchange}.py`,
            // base files
            'base',
            'async_support/base',
            '__init__.py',
            'async_support/__init__.py',
            // pro files
            'pro/__init__.py',
            `pro/${exchange}.py`,
            // static dependencies
            'static_dependencies',
        ];
        for (const file of copyList) {
            cp(sourceDir + file,  this.destinationFolder + file);
        }
    }
    
    allExchangesList:string[] = [];

    async setAllExchangesList () {
        this.allExchangesList = fs.readdirSync(__dirname + '/ccxt/ts/src/').filter(file => file.endsWith('.ts')).map(file => file.replace('.ts', ''));  //  [... fs.readFileSync('./ccxt/python/ccxt/__init__.py').matchAll(/from ccxt\.([a-z0-9_]+) import \1\s+# noqa/g)].map(match => match[1]);
        if (this.allExchangesList.length === 0) {
            throw new Error('No exchanges list found');
        }
    }

    async cleanInitFile(filePath: string, async = false) {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        for (const id of this.allExchangesList) {
            if (id !== this.exchange) {
                fileContent = regexAll (fileContent, [
                    [ new RegExp(`from ccxt\.${id} import ${id}.+\n`), '' ],
                    [ new RegExp(`from ccxt\.async_support\.${id} import ${id}.+\n`), '' ],
                    [ new RegExp(`from ccxt\.pro\.${id} import ${id}.+\n`), '' ],
                    [ new RegExp(`\\s+'${id}',\n`), '' ],
                ]).trim ()
            }
        }
        const importJunction = `import sys\n` + 
                               `import ${this.exchange}.ccxt as ccxt_module\n` + 
                               `sys.modules[\'ccxt\'] = ccxt_module\n\n`;
        fileContent = importJunction + fileContent;
        fs.writeFileSync(filePath, fileContent + '\n');
    }

    creataPackageInitFile () {
        const capitalized = capitalize (this.exchange);
        const cont = '' +
            'import sys\n' +
            `import ${this.exchange}.ccxt as ccxt_module\n` +
            'sys.modules[\'ccxt\'] = ccxt_module\n' +
            '\n' +
            `from ${this.exchange}.ccxt import ${this.exchange} as ${capitalized}Sync\n` +
            `from ${this.exchange}.ccxt.async_support.${this.exchange} import ${this.exchange} as ${capitalized}Async\n` +
            `from ${this.exchange}.ccxt.pro.${this.exchange} import ${this.exchange} as ${capitalized}Ws\n`
        fs.writeFileSync(this.destinationFolder + '/../__init__.py', cont);
    }

    editWsHeaders () {
        const path = this.destinationFolder + `pro/${this.exchange}.py`;
        const fileContent = fs.readFileSync(path, 'utf8');
        const addLine = `from ccxt.async_support import ${this.exchange} as ${this.exchange}Async\n`;
        const newContent = fileContent.replace(/class \w+\(.*?\):/, addLine + `\n\nclass ${this.exchange}(${this.exchange}Async):`);
        fs.writeFileSync(path, newContent);
    }

    globalConfigs: any = {};

    createMetaPackage () {
        const originalPackage = JSON.parse (fs.readFileSync (__dirname + '/ccxt/package.json', 'utf8'));
        const exchangesConfigContent = fs.readFileSync(__dirname + '/global-configs.json', 'utf8');
        this.globalConfigs = JSON.parse(exchangesConfigContent);
        const packageJson = {
            name: this.exchange,
            description: `A Python cryptocurrency trading library for ${this.exchange}`,
            keywords:  [this.exchange].concat (this.globalConfigs.keywords),
        };
        const extended = Object.assign (originalPackage, packageJson);
        extended['repository']['url'] = `https://github.com/ccxt/${this.language}-${this.exchange}.git`;
        // remove all props except
        const neededProps = ['name', 'version', 'description', 'keywords', 'repository', 'readme', 'author', 'license', 'bugs', 'homepage', 'collective', 'ethereum'];
        // remove with inline
        for (const key in extended) {
            if (!neededProps.includes(key)) {
                delete extended[key];
            }
        }
        extended['project_urls'] = {
            'Homepage': 'https://ccxt.com',
            'Documentation': 'https://github.com/ccxt/ccxt/wiki',
            'Discord': 'https://discord.gg/ccxt',
            'Twitter': 'https://twitter.com/ccxt_official',
            'Funding': 'https://opencollective.com/ccxt',
        };
        const stringified = JSON.stringify(extended, null, 4);
        fs.writeFileSync (__dirname + '/../meta.json', stringified);
    }

    replaceGlobalRegexes (text: string, array: any[] = []) {
        let newText = text;
        newText = regexAll (newText, [
            ['__exchangeName__', this.exchange],
            ['__ExchangeName__', capitalize(this.exchange)],
            ['__HOMEPAGE_URL__', 'https://github.com/ccxt/' + this.language + '-' + this.exchange],
        ]);
        const defaults: any = {
            '__LINK_TO_OFFICIAL_EXCHANGE_DOCS__': `https://www.google.com/search?q=google+${this.exchange}+cryptocurrency+exchange+api+docs`,
            '__EXAMPLE_SYMBOL__': 'BTC/USDC',
        };
        const exchangeConfig = this.globalConfigs['exchanges'][this.exchange];
        const allReplacements = Object.assign (defaults, exchangeConfig);
        for (const key in allReplacements) {
            const defaultValue = defaults[key];
            let value = exchangeConfig[key] || defaultValue; // use default if value not set
            newText = newText.replace(new RegExp(`${key}`, 'g'), value);
        }
        return newText;
    }

    commonContentReplace (filePath: string) {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        fileContent = this.replaceGlobalRegexes(fileContent);
        fs.writeFileSync(filePath, fileContent);
    }
    
    generateExamples () {
        const destinationDir = __dirname + `/../examples/`;
        cp (__dirname + '/templates/examples/', destinationDir);
        // iterate through files and make replacements
        const files = fs.readdirSync(destinationDir);
        for (const file of files) {
            this.commonContentReplace (destinationDir + file);
        }
    }

    generateReadme () {
        const target = __dirname + `/../README.md`;
        cp (__dirname + '/templates/README.md', target);
        this.commonContentReplace (target);
        this.updateReadmeWithMethods()
    }

    generatePyprojectToml () {
        const target = __dirname + `/../pyproject.toml`;
        cp (__dirname + '/templates/pyproject.toml', target);
        this.commonContentReplace (target);
    }

    async init () {
        if (this.downloadAndDelete) {
            await this.downloadCcxtRepo ();
        }
        this.copyCcxtFiles (this.exchange);
        await this.setAllExchangesList ();
        await this.creataPackageInitFile ();

        await this.cleanInitFile (this.destinationFolder + '__init__.py');
        await this.cleanInitFile (this.destinationFolder + 'async_support/__init__.py');
        await this.cleanInitFile (this.destinationFolder + 'pro/__init__.py');
        this.editWsHeaders ();

        // Remove git dir now (after reading exchanges)
        this.createMetaPackage ();
        this.generateExamples ();
        this.generateReadme ();
        if (this.downloadAndDelete) {
            fs.rmSync(__dirname + '/ccxt/', { recursive: true, force: true });
        }
        console.log ("Done!");
    }



    sortMethods(methods: string[]) {
        return methods.sort((a, b) => {
            const aPriority = a.startsWith('fetch') || a.startsWith('create') ? 0 : 1;
            const bPriority = b.startsWith('fetch') || b.startsWith('create') ? 0 : 1;
            return aPriority - bPriority || a.localeCompare(b);
        });
    }


    updateReadme(methods: string[], rawMethods: string[], wsMethods: string[], readmePath: string) {
        let readmeContent = fs.readFileSync(readmePath, 'utf8');

        const methodsFormatted = methods.map(method => `- \`${method}\``).join('\n');
        const rawMethodsFormatted = rawMethods.map(method => `- \`${method}\``).join('\n');
        const wsMethodsFormatted = wsMethods.map(method => `- \`${method}\``).join('\n');

        const newMethodsSection = `### REST Unified\n\n${methodsFormatted}\n`;

        const newWsMethodsSection = `### WS Unified\n\n${wsMethodsFormatted}\n`;

        const newRawMethodsSection = `### REST Raw\n\n${rawMethodsFormatted}\n`;

        // Replace the existing #Methods section
        const regex = /### REST Unified\n[\s\S]*?(?=\n#|$)/;
        if (regex.test(readmeContent)) {
            readmeContent = readmeContent.replace(regex, newMethodsSection);
        } else {
            readmeContent += `\n${newMethodsSection}`;
        }

        // handleRestRaw
        const rawMethodRegex = /### REST Raw\n[\s\S]*?(?=\n#|$)/
        if (rawMethodRegex.test(readmeContent)) {
            readmeContent = readmeContent.replace(rawMethodRegex, newRawMethodsSection);
        } else {
            readmeContent += `\n${newRawMethodsSection}`;
        }

        // handleWs
        const wsRegex = /### WS Unified\n[\s\S]*?(?=\n#|$)/;
        if (wsRegex.test(readmeContent)) {
            readmeContent = readmeContent.replace(wsRegex, newWsMethodsSection);
        } else {
            readmeContent += `\n${newWsMethodsSection}`;
        }

        fs.writeFileSync(readmePath, readmeContent, 'utf8');
    }

    async updateReadmeWithMethods() {
        const filePath = this.destinationFolder + '/' + this.exchange + '.py';
        const wsFilePath = this.destinationFolder + '/pro/' + this.exchange + '.py';
        const abstractFile = this.destinationFolder + '/abstract/' + this.exchange + '.py';
        const readme =  __dirname + '/../README.md';


        const content = fs.readFileSync(filePath, 'utf8');
        const wsContent = fs.readFileSync(wsFilePath, 'utf8');
        const abstractContent = fs.readFileSync(abstractFile, 'utf8');
        const methodRegex = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)/g;
        const abstractRegex = /\s+(\w+)\s=\s\w+\s=\s/g
        let restMethods: string[] = [];
        let wsMethods: string[] = [];
        let rawMethods: string[] = [];
        let match;

        while ((match = methodRegex.exec(content)) !== null) {
            const name = match[1];
            if (name.startsWith('parse') || name.startsWith('sign') || name.startsWith('handle') || name.startsWith('load')) {
                continue;
            }
            restMethods.push(`${name}(${match[2]})`);
        }

        while ((match = methodRegex.exec(wsContent)) !== null) {
            const name = match[1];
            if (name.startsWith('handle') || name.startsWith('parse') || name.startsWith('request') || name.startsWith('ping')) {
                continue;
            }
            wsMethods.push(`${name}(${match[2]})`);
        }

        while ((match = abstractRegex.exec(abstractContent)) !== null) {
            const name = match[1];
            rawMethods.push(`${name}(request)`);
        }


        // console.log(this.sortMethods(re))
        this.updateReadme(this.sortMethods(restMethods), rawMethods, wsMethods, readme);
        return restMethods;
    }
}


// -------------------------------------------------------------------------------- //


const builder = new build(exchangeArgv);
if (argvs[1] === '--methods') {
    builder.updateReadmeWithMethods()
} else {
    builder.init()
}

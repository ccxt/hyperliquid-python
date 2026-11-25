import * as fs from 'fs'
import path from 'path'
import * as semver from 'semver';

import { argvs, sanitizePackageName, mkdir, jsonFromFile, exchangeArgv, execSync, cp, capitalize, regexAll } from './utils';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


class pypi {

    exchange:string;
    exchangeConfigs:any;
    rootDir:string = __dirname + `/../`;
    tempPyDir:string = this.rootDir + `/temp_pypi/`;

    constructor(exchange: string) {
        this.exchange = exchange;
        this.exchangeConfigs = jsonFromFile(__dirname + `/global-configs.json`)['exchanges'];
        this.init(exchange);
    }

    init(exchange: string) {
        // create skeleton dirs
        mkdir (this.tempPyDir);
        mkdir (this.tempPyDir + '/tests/'); // just empty folder
        // copy python folder to temp dir
        const pypiPackageName = this.exchangeConfigs[exchange].__PYTHON_PACKAGE_NAME__;
        const pypiPackageNameSanitized = this.exchange; //sanitizePackageName (pypiPackageName);
        const pkgDir = this.tempPyDir + '/src/' + pypiPackageNameSanitized;
        mkdir (pkgDir);
        cp (this.rootDir + `/${this.exchange}`, pkgDir);
        // copy readme
        cp (this.rootDir + `/README.md`, this.tempPyDir + '/README.md');
        // write pyproject.toml
        const verion = this.defineVersion ();
        fs.writeFileSync(this.tempPyDir + '/pyproject.toml', this.pyprojectTolmContent(pypiPackageName, verion));
        this.pythonPackageBuild ();
    }

    pyprojectTolmContent(pypiPackageName:string, newVersion: string) {
        const content = '' +
            `[build-system]\n` +
            `requires = ["hatchling"]\n` +
            `build-backend = "hatchling.build"\n` +
            `\n` + 
            `[tool.hatch.build.sources]\n` +
            `directory = "src"\n` +
            `\n` +
            `[tool.hatch.build.targets.wheel]\n` +
            `sources = ["src"]\n` +
            `only-include = ["src/${this.exchange}"]\n` +
            `\n` +
            `[project]\n` +
            `name = "${pypiPackageName}"\n` +
            `version = "` + newVersion + `"\n` +
            `authors = [\n` +
            `    { name="CCXT", email="info@ccxt.trade" },\n` +
            `]\n` +
            `description = "${this.exchange} crypto exchange api client"\n` +
            `readme = "README.md"\n` +
            `requires-python = ">=3.8"\n` +
            `classifiers = [\n` +
            `    "Programming Language :: Python :: 3",\n` +
            `    "Operating System :: OS Independent",\n` +
            `    "Intended Audience :: Developers",\n` +
            `    "Intended Audience :: Financial and Insurance Industry",\n` +
            `    "Intended Audience :: Information Technology",\n` +
            `    "Topic :: Software Development :: Build Tools",\n` +
            `    "Topic :: Office/Business :: Financial :: Investment",\n` +
            `    "License :: OSI Approved :: MIT License",\n` +
            `]\n` +
            `license = {text = "MIT"}\n` +
            `\n` +
            `[project.urls]\n` +
            `Homepage = "https://github.com/ccxt/ccxt"\n` +
            `Issues = "https://github.com/ccxt/ccxt"\n` +
            ''
        ;
        return content;
    }

    defineVersion () {
        const res = execSync(`pip index versions ` + this.exchangeConfigs[this.exchange].__PYTHON_PACKAGE_NAME__);
        const versions = res.toString().trim();
        const matches = versions.match(/\((\S+)\)/);
        // @ts-ignore
        let currentVersion = matches[1];
        if (!currentVersion) {
            currentVersion = '0.0.1';
        } else {
            // some weird values, e.g. 123.0 or alike
            if ((currentVersion.match(/\./g) || []).length < 2) {
                currentVersion += '.0';
            }
        }
        const newVersion = semver.inc(currentVersion, 'patch');
        return newVersion;
    }

    pythonPackageBuild () {
        const res = execSync(`cd ${this.tempPyDir} && python -m build`);
        console.log(res.toString());
    }

}


// if (! process.env.PYPI_API_SECRET_SP)

new pypi(exchangeArgv);

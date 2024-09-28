#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tsNode = __importStar(require("ts-node"));
const deploy_1 = require("./deploy");
// Register ts-node to handle TypeScript files
tsNode.register({
    compilerOptions: {
        module: 'commonjs',
    },
});
async function main() {
    const args = process.argv.slice(2);
    console.log('Received arguments:', args);
    if (args[0] === 'deploy') {
        let configPath = 'srm.config.ts';
        let envFilePath = '.env';
        console.log('Initial config path:', configPath);
        console.log('Initial env file path:', envFilePath);
        // Parse command-line arguments
        for (let i = 1; i < args.length; i += 2) {
            console.log(`Checking argument: ${args[i]}`);
            if (args[i] === '--config') {
                configPath = args[i + 1] || configPath;
                console.log('Updated config path:', configPath);
            }
            else if (args[i] === '--env') {
                envFilePath = args[i + 1] || envFilePath;
                console.log('Updated env file path:', envFilePath);
            }
        }
        console.log(`Final config path: ${configPath}`);
        console.log(`Final env file path: ${envFilePath}`);
        // Check if the config file exists
        if (!fs_1.default.existsSync(configPath)) {
            console.error(`Configuration file not found: ${configPath}`);
            process.exit(1);
        }
        // Check if the .env file exists
        if (!fs_1.default.existsSync(envFilePath)) {
            console.warn(`Warning: Environment file not found: ${envFilePath}`);
            console.warn('Proceeding without environment variables. Make sure STRIPE_SECRET_KEY is set.');
        }
        try {
            await (0, deploy_1.deploy)(configPath, envFilePath);
        }
        catch (error) {
            console.error('Error during deployment:', error);
            if (error instanceof Error && error.message.includes('Cannot find module')) {
                console.error(`Make sure the configuration file exists at: ${path_1.default.resolve(process.cwd(), configPath)}`);
            }
            process.exit(1);
        }
    }
    else {
        console.error('Unknown command. Use "srm deploy --config [path-to-config] --env [path-to-env-file]"');
        process.exit(1);
    }
}
main().catch((error) => {
    console.error('Error executing SRM command:', error);
    process.exit(1);
});

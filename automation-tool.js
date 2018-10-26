const commands = require('./commands');

// #! /usr/bin/env node
const fs = require("fs");
const os = require("os");
const _ = require("lodash");
const vorpal = require('vorpal')();
const chalk = vorpal.chalk;

// MODULE HIERARCHY: tests/app > commands > coremodules > utils
    // utils ONLY import other utils  
    // coremodules (prodticket, articles, snippets, config) import utils but NOT commands 
    // commands import utils AND core modules directly.
    // tests/app import core modules and utils through commands module 

// ------------------------------------------------------------
// CLI DELIMITER 
// ------------------------------------------------------------
vorpal
    // Define app delimiter (the name in the command line) 
    .delimiter(chalk.magenta('op-automation-tool$'))
    .use(commands.commands)
    // Show the delimiter prompt in the shell (keep the prompt running)
    .show();
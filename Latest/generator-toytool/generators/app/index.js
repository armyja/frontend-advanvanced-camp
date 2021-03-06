var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    async initPackage() {
        let answer = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname // Default to current folder name
            },
        ])
        const pkgJson = {
            "name": answer.name,
            "version": "1.0.0",
            "description": "",
            "main": "generators/app/index.js",
            "scripts": {
                "build": "webpack",
                "coverage": "nyc mocha",
                "test": "nyc mocha --require @babel/register"
            },
            "author": "",
            "license": "ISC",
            "devDependencies": {
                // "webpack": "^4.1.0",
                // "vue-loader": "^15.9.1",
                // "css-loader": "^3.2.0",
                // "vue-style-loader": "^4.1.0",
                // "vue-template-compiler": "^2.5.16",
            },
            "dependencies": {
                // "vue": "^2.5.16",
            }
        }


        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
        this.npmInstall(["vue"], { 'save-dev': false });
        this.npmInstall(["webpack", "webpack-cli", "vue-loader@^15.2.1", "vue-template-compiler",
            "babel-loader",
            "babel-plugin-istanbul", "@istanbuljs/nyc-config-babel",
            "mocha", "nyc",
            "@babel/core", "@babel/preset-env", "@babel/register",
            "vue-style-loader", "css-loader", "copy-webpack-plugin"], { 'save-dev': true });


        this.fs.copyTpl(
            this.templatePath('sample-test.js'),
            this.destinationPath('test/sample-test.js'),
        );
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc'),
        );
        this.fs.copyTpl(
            this.templatePath('.nycrc'),
            this.destinationPath('.nycrc'),
        );
        this.fs.copyTpl(
            this.templatePath('HelloWorld.vue'),
            this.destinationPath('src/HelloWorld.vue'),
        );
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js'),
        );
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js'),
        );
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'),
            { title: answer.name }
        );
    }
};
# dSebastien's reveal.js presentations template

## About
This is a simple template and build script for modern presentations based on [Reveal.js](http://lab.hakim.se/reveal-js/).

* Create your slide deck using markdown alone
* Edit your metadata in a single configuration file
* Tweak Reveal.JS as you wish in the provided template
* Use a few NPM commands to build your presentation and serve it to the world
* See the results live (thanks to [BrowserSync](http://www.browsersync.io/))

## Status & roadmap
Check out the current [TODO list](TODO.md)

## Usage
* Clone the repository
* Run `npm install` to download all dependencies
* Edit the slide deck using markdown: presentation/main.md
  * you can create additional markdown (md) files and they'll get merged into a single slide deck
  * additional md files MUST start with --- (slide separator) otherwise the merge operation will not do what you want. The file names will dictate the order in which they're merged (i.e., follow a natural order in your filenames)
  * note that 'main.md' must exist and is always loaded first. All other files are appended to this one before all the markdown is converted to reveal.js HTML slides
  * use ---- to create slides beneath the current one
* Run `npm run debug` to quickly launch the presentation based on the Markdown contents using [reveal-md](https://github.com/webpro/reveal-md). 
  * note that the debug mode won't take your metadata and configuration into account.
  * moreover, the debug mode doesn't support multiple markdown files, it'll only take the main.md one into account
* Run `npm run build` to convert your presentation to HTML
* Run `npm run serve` to watch your presentation for changes, automatically convert to HTML and display the results in your browser
* Run `npm run clean` to clean all output directories
* Run `npm run help` to list all available commands

## Options and customization
You can customize the options and metadata (e.g., deck title, author, description, theme, ...) by editing the 'presentation/config.json' file.

If you need, you can add additional entries to the configuration file and refer to these using {{key}} (without whitespace inside) in your slide deck. The placeholders will all get resolved during the build. This is useful in case you reuse code/contents across slides in your deck.

Note that all entries having a key ending with '_comment' in the config file just serve as comments given that comments aren't supported in JSON :)

You can also adapt the template file and refer to custom placeholders within.

Finally, if you wish to customize the template or the options of Reveal.js, then you can edit the 'presentation/template.html' file. Reference for Reveal.js options: https://github.com/hakimel/reveal.js#configuration

## Dependencies
* reveal.js: the reveal.js library
* reveal-md: launch a Reveal.js presentation from a markdown file: https://www.npmjs.com/package/reveal-md
* browser-sync: live page reload & browser syncing: https://www.npmjs.com/package/browser-sync
* gulp-replace: string replace plugin for gulp: https://www.npmjs.com/package/gulp-replace
* gulp-if: conditionally run a task: https://www.npmjs.com/package/gulp-if
* gulp-change: modify file contents: https://www.npmjs.com/package/gulp-change
* gulp-debug: useful to verify the stream contents: https://www.npmjs.com/package/gulp-debug
* gulp-concat: concatenate files: https://www.npmjs.com/package/gulp-concat
* gulp-jsonlint: validate JSON: https://www.npmjs.com/package/gulp-jsonlint
* gulp-rename: rename files: https://www.npmjs.com/package/gulp-rename
* gulp-npm-files: list package.json dependencies so that we can process them (e.g., copy them to the dist folder): https://www.npmjs.com/package/gulp-npm-files
* gulp-changed: only pass through changed files: https://www.npmjs.com/package/gulp-changed
* gulp-filter: filter vynil files in a stream: https://www.npmjs.com/package/gulp-filter

## Authors
### Sebastien Dubois
* [@Blog](http://www.dsebastien.net)
* [@Twitter](http://twitter.com/dSebastien)
* [@GitHub](http://github.com/dSebastien)

## License
This project and all associated source code is licensed under the terms of the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
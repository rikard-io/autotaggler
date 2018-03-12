# AutoTaggler

> A quick way to tag files (audio for now) in the browser. Open your files, add some tags, do some keyboard-mapping and start tagging!

### This is an experiment, it's full of bad humour, bugs and lint warnings.

Features an extremely naive AI-bot (based on deeplearn.js and knn-image-classifier). Basically extracts the FFT of the files, draws it to a canvas (!🙈) and process it a image classification problem.

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report
```

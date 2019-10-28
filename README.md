To reproduce, clone this repo and run the following command

```bash
yarn build
```

This would invoke webpack build mode in production and you can see that it hangs.

Also you can try

```bash
yarn start
```

It will start webpack dev server, while setting NODE_ENV to 'development'. Here
the webpack.config.js will set `async: false` and things will work.

## Cause of the Issue

Please check the content of `src/index.ts` file

```ts
// comment the following lines and the issue will be fixed
import "./style.scss";
import "./style.less";

const mainNode = document.querySelector("#main-app");
// intentional ts error
mainNode.textContent = "This is main app";
if (mainNode) {
}
```

NOTICE THERE ARE TWO IMPORTS OF `style.less` and `style.scss` file.

The issue is present under two conditions:

1. When the fork-ts-checker is run in `async: false` mode.
2. When there is a `.less` import and `.scss` import.

### Further finding

When there is only import of `.less` file, I get the following error

```
Starting type checking service...
Using 1 worker with 2048MB memory limit
Hash: d40833bb5f8da83a960f
Version: webpack 4.41.2
Time: 4502ms
Built at: 10/28/2019 12:34:46 PM
 2 assets
Entrypoint main = bundle.js bundle.js.map
[0] multi ./src/index.ts 28 bytes {0} [built]
[1] ./src/index.ts 245 bytes {0} [built]
[2] ./src/style.less 2.01 KiB {0} [built] [failed] [1 error]

ERROR in ./src/style.less
Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
NonErrorEmittedError: (Emitted value instead of an instance of Error) [object Object]
    at runLoaders (/somepath/node_modules/webpack/lib/NormalModule.js:313:13)
    at /somepath/node_modules/loader-runner/lib/LoaderRunner.js:367:11
    at /somepath/node_modules/loader-runner/lib/LoaderRunner.js:182:20
    at context.callback (/somepath/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at childCompiler.runAsChild (/somepath/node_modules/mini-css-extract-plugin/dist/loader.js:135:14)
    at compile (/somepath/node_modules/webpack/lib/Compiler.js:343:11)
    at hooks.afterCompile.callAsync.err (/somepath/node_modules/webpack/lib/Compiler.js:681:15)
    at _next0 (eval at create (/somepath/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:16:1)
    at _err0 (eval at create (/somepath/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:24:1)
    at ForkTsCheckerWebpackPlugin.afterCompileCallback (/somepath/node_modules/fork-ts-checker-webpack-plugin/lib/index.js:594:13)
    at ForkTsCheckerWebpackPlugin.handleServiceMessage (/somepath/node_modules/fork-ts-checker-webpack-plugin/lib/index.js:531:24)
    at serviceRpc.rpc.then.result (/somepath/node_modules/fork-ts-checker-webpack-plugin/lib/index.js:298:38)
    at processTicksAndRejections (internal/process/task_queues.js:86:5)
 @ ./src/index.ts 3:0-22
 @ multi ./src/index.ts

ERROR in /somepath/src/index.ts
ERROR in /somepath/src/index.ts(7,1):
7:1 Object is possibly 'null'.
     5 | const mainNode = document.querySelector("#main-app");
     6 | // intentional ts error
  >  7 | mainNode.textContent = "This is main app";
       | ^
     8 | if (mainNode) {
     9 | }
    10 |
Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js??ref--7-1!node_modules/postcss-loader/src/index.js??ref--7-2!node_modules/less-loader/dist/cjs.js??ref--7-3!src/style.less:
    Entrypoint mini-css-extract-plugin = *
    [0] ./node_modules/css-loader/dist/cjs.js??ref--7-1!./node_modules/postcss-loader/src??ref--7-2!./node_modules/less-loader/dist/cjs.js??ref--7-3!./src/style.less 439 bytes {0} [built]
        + 1 hidden module

    ERROR in /somepath/src/index.ts
    ERROR in /somepath/src/index.ts(7,1):
    7:1 Object is possibly 'null'.
         5 | const mainNode = document.querySelector("#main-app");
         6 | // intentional ts error
      >  7 | mainNode.textContent = "This is main app";
           | ^
         8 | if (mainNode) {
         9 | }
        10 |
```

So it looks like, the plugin is looking into the output of the less file, which
it shouldn't.

When importing just the `style.scss` file it gives

```
Starting type checking service...
Using 1 worker with 2048MB memory limit
Hash: 203af3aae71826fd7a46
Version: webpack 4.41.2
Time: 4536ms
Built at: 10/28/2019 12:36:51 PM
 3 assets
Entrypoint main = bundle.js bundle.js.map
[0] multi ./src/index.ts 28 bytes {0} [built]
[1] ./src/index.ts 246 bytes {0} [built]
[2] ./src/style.scss 2.01 KiB {0} [built] [failed] [1 error]

ERROR in ./src/style.scss
Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
NonErrorEmittedError: (Emitted value instead of an instance of Error) [object Object]
    at runLoaders (/somepath/node_modules/webpack/lib/NormalModule.js:313:13)
    at /somepath/node_modules/loader-runner/lib/LoaderRunner.js:367:11
    at /somepath/node_modules/loader-runner/lib/LoaderRunner.js:182:20
    at context.callback (/somepath/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at childCompiler.runAsChild (/somepath/node_modules/mini-css-extract-plugin/dist/loader.js:135:14)
    at compile (/somepath/node_modules/webpack/lib/Compiler.js:343:11)
    at hooks.afterCompile.callAsync.err (/somepath/node_modules/webpack/lib/Compiler.js:681:15)
    at _next0 (eval at create (/somepath/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:16:1)
    at _err0 (eval at create (/somepath/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:24:1)
    at ForkTsCheckerWebpackPlugin.afterCompileCallback (/somepath/node_modules/fork-ts-checker-webpack-plugin/lib/index.js:594:13)
    at ForkTsCheckerWebpackPlugin.handleServiceMessage (/somepath/node_modules/fork-ts-checker-webpack-plugin/lib/index.js:531:24)
    at serviceRpc.rpc.then.result (/somepath/node_modules/fork-ts-checker-webpack-plugin/lib/index.js:298:38)
    at processTicksAndRejections (internal/process/task_queues.js:86:5)
 @ ./src/index.ts 2:0-22
 @ multi ./src/index.ts

ERROR in /somepath/src/index.ts
ERROR in /somepath/src/index.ts(7,1):
7:1 Object is possibly 'null'.
     5 | const mainNode = document.querySelector("#main-app");
     6 | // intentional ts error
  >  7 | mainNode.textContent = "This is main app";
       | ^
     8 | if (mainNode) {
     9 | }
    10 |
Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js??ref--6-1!node_modules/postcss-loader/src/index.js??ref--6-2!node_modules/sass-loader/dist/cjs.js??ref--6-3!src/style.scss:
    Entrypoint mini-css-extract-plugin = *
    [0] ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/postcss-loader/src??ref--6-2!./node_modules/sass-loader/dist/cjs.js??ref--6-3!./src/style.scss 2.93 KiB {0} [built]
    [3] ./src/assets/bg.jpg 42 bytes {0} [built]
        + 2 hidden modules

    ERROR in /somepath/src/index.ts
    ERROR in /somepath/src/index.ts(7,1):
    7:1 Object is possibly 'null'.
         5 | const mainNode = document.querySelector("#main-app");
         6 | // intentional ts error
      >  7 | mainNode.textContent = "This is main app";
           | ^
         8 | if (mainNode) {
         9 | }
        10 |
```

So here also the plugin is looking into the `style.scss` file, while it shouldn't.

I guess this is the root cause.

# Benchmarks

## Eslint

`hyperfine --runs 3 --warmup 1 'npx eslint src'`

|     date     | delay | node  |      machine      | comment                    |
| :----------: | :---: | :---: | :---------------: | -------------------------- |
| 2024-06-08#1 | 5.8s  | 20.15 | romain gram zorin | with eslint-plugin-shuunen |

Note 1 : to show time taken by rules : `TIMING=1 npx eslint src`

Note 2 : to view final config : `npx eslint --print-config src/app.vue > eslint-vue.config.json && npx eslint --print-config src/main.ts > eslint-ts.config.json`

Note 3 : to list eslint scanned files : `DEBUG=eslint:cli-engine npx eslint src`

# Ngrx Workshop

## Raw friends

```shell
cd projects/raw-friends/src/app/
ng generate module friends
ng g c friends/views/quotes-view --module=friends
ng g c friends/views/episode-view --module=friends
ng g s friends/services/quote
```


## Scaffolding  

```shell
ng new ngrx-wkshp --create-application=false
ng generate application raw-friends --routing --style=less
ng generate application ngrx-friends --routing --style=less
# uninstall karma/jasmine testing 
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter @types/jasmine  jasmine-core
# install jest 
npm install --save-dev jest @types/jest @angular-builders/jest@16
# init jest 
npx jest --init
# Would you like to use Jest when running "test" script in "package.json"? » (Y/n) => n
# Would you like to use Typescript for the configuration file? » (y/N) => N
# Choose the test environment that will be used for testing  => jsdom (browser-like)
# Do you want Jest to add coverage reports?  => y
# Which provider should be used to instrument code for coverage? => babel
# Automatically clear mock calls, instances, contexts and results before every test? => N

# Uncomment testMatch in "jest.config.js"

# Edit projects/raw-friends/tsconfig.spec.json and projects/ngrx-friends/tsconfig.spec.json
# "types": [ "node","jest" ],
# "esModuleInterop": true

# edit angular.json raw-friends and ngrx-friends "architect" section
# "test": {
#     "builder": "@angular-builders/jest:run",
#     "options": {
#       "configPath": "../../jest.config.js"
#     }
#   }

ng add @angular/material@16 --theme=indigo-pink --animations=enabled --typography --project raw-friends
ng add @angular/material@16 --theme=indigo-pink --animations=enabled --typography --project ngrx-friends

ng add @ngrx/store@16 --project ngrx-friends
ng add @ngrx/effects@16 --project ngrx-friends
ng add @ngrx/store-devtools@16 --project ngrx-friends

ng add @ngrx/eslint-plugin@16 --project ngrx-friends
```

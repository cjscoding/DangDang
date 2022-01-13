# Typescript

> 기본 설정
>
> ```node
> npm init -y
> npm install -g typescript
> ```
>
> ```json
> //tsconfig.json
> {
>   "compilerOptions": {
>     "target": "es2016",
>     "module": "commonjs",
>     "sourceMap": true,
>   },
>   "include": ["index.ts"],
>   "exclude": ["node_modules"],
> }
> ```
>
> ```json
> //package.json
> {
>     ...,
>     //alias 설정
>     "scripts": {
>     "start": "node index.js",
>     "prestart": "tsc"
>   	}
> }
> ```
>
> ```typescript
> ...
> export {};
> ```
>
> 문법
>
> 함수
>
> ```typescript
> const func = (var1:string, var2, var3?:number):void => {}; //?는 optional
> ```
>
> 객체
>
> ```typescript
> interface Human {
>   name:string,
>   age:number,
>   gender:string,
> }
> //or
> class Human {
>   public name:string;
>   public age:number;
>   public gender: string;
>   constructor(name:string, age:number, gender:string) {
>     this.name = name;
>     this.age = age;
>     this.gender = gender;
>   }
> }
> ```



> tsc-watch
>
> ```node
> npm install tsc-watch --save-dev
> ```
>
> ```json
> {
>     ...,
>     "scripts": {
>     	"start": "tsc-watch --onSuccess \"node dist/index.js\""
>   	},
> }
> ```
>
> ```json
> {
>     "compilerOptions": {
>       	...,
>         "outDir": "dist"
>     },
>     "include": ["src/**/*"],
>     ...
> }
> ```



> 블록체인
>
> ```node
> npm i crypto-js
> ```
>
> crypto에 있는 SHA256 해쉬함수를 사용해야함. 만드는 과정은 생략.


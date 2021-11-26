/*eslint-disable*/
import vuePlugin from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'
import typescript from '@rollup/plugin-typescript';

import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import dts from 'rollup-plugin-dts'

const NAME = pkg.name;
const VERSION = pkg.version;

const banner = `/*!
  * ${NAME} v${VERSION}
  * (c) ${new Date().getFullYear()} Jenesius
  * @license MIT
  */`

const outputConfig = {
	cjs: {
		file: pkg.main,
		format: `cjs`,
	},
	
}

function createConfig(format, output) {
	if (!output) {
		console.log(require('chalk').yellow(`invalid format: "${format}"`))
		process.exit(1)
	}

	output.banner = banner

	output.globals = {
		vue: 'Vue',
	}

	const isGlobalBuild = format === 'global'
	
	if (isGlobalBuild) output.name = 'JenesiusVueModal'

	const external = ['vue']

	return {
		input: "./plugin/index.ts",
		external,
		plugins: [
			peerDepsExternal(),
			resolve(),
			typescript({ tsconfig: './tsconfig.json' }),
			vuePlugin({
				preprocessStyles: true
			}),
			
			//babel({ babelHelpers: 'bundled', extensions: [".js", ".ts"] }),
			commonjs(),
			postcss(),
		],
		output,

	}
}


const packageConfigs = Object.keys(outputConfig).map(format =>
	createConfig(format, outputConfig[format])
)


function createDeclarationConfig(){
	
	return {
		input: './dist/dts/index.d.ts',
		output: [{ file: 'dist/index.d.ts', format: 'es' }],
		plugins: [dts()],
	}
	
}
export default [...packageConfigs];


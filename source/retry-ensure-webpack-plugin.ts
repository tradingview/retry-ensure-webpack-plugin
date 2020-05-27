export namespace Webpack5 {
	export interface Plugin {
		apply(compiler: Compiler): void;
	}
	export interface Compiler {
		hooks: {
			thisCompilation: {
				tap(
					pluginName: string,
					callback: (compilation: Compilation) => void,
				): void;
			}
		}
	}
	export interface Compilation {
		mainTemplate: {
			hooks: {
				requireExtensions: {
					tap(
						pluginName: string,
						callback: (source: string, chunk: Chunk) => string,
					): void;
				}
			}
		}
	}
	export interface Chunk {
		hasAsyncChunks(): boolean;
	}
}

export namespace Webpack4 {
	export interface Plugin {
		apply(compiler: Compiler): void;
	}
	export interface Compiler {
		hooks: {
			thisCompilation: {
				tap(
					pluginName: string,
					callback: (compilation: Compilation) => void,
				): void;
			}
		}
	}
	export interface Compilation {
		mainTemplate: {
			hooks: {
				requireExtensions: {
					tap(
						pluginName: string,
						callback: (source: string, chunk: Chunk) => string,
					): void;
				}
			}
		}
	}
	export interface Chunk {}
}



declare const _TEMPLATE_PLACEHOLDER: string;

export interface Options {
	max?: number,
	delay?: number | string,
}

type UnsafeOptions = {
	[key in keyof Options]-?: unknown;
}

export class RetryEnsureWebpackPlugin implements Webpack4.Plugin, Webpack5.Plugin {
	private readonly _max: number;
	private readonly _delay: number | string;

	public constructor(options?: Options) {
		const finalOptions: UnsafeOptions = Object.assign(
			{
				max: 3,
				delay: 'retriedTimes * retriedTimes * 1000',
			},
			options
		);

		if (typeof finalOptions.max !== 'number') {
			throw new TypeError('options.max should be a number');
		}

		if (isNaN(finalOptions.max) || finalOptions.max < 0) {
			throw new RangeError('optons.max should be a nonnegative number');
		}

		this._max = finalOptions.max;

		if (typeof finalOptions.delay === 'number') {
			if (!isFinite(finalOptions.delay) || finalOptions.delay < 0) {
				throw new RangeError('options.delay should be a nonnegative finite number');
			}
		} else if (typeof finalOptions.delay !== 'string') {
			throw new TypeError('options.delay should be a number or string')
		}

		this._delay = finalOptions.delay;
	}

	public apply(compiler: Webpack4.Compiler | Webpack5.Compiler): void {
		if (this._max <= 0) {
			// Zero retries is what Webpack does by default.
			// Nothing to do here.
			return;
		}

		compiler.hooks.thisCompilation.tap('RetryEnsureWebpackPlugin', (compilation: Webpack4.Compilation | Webpack5.Compilation) => {
			compilation.mainTemplate.hooks.requireExtensions.tap('RetryEnsureWebpackPlugin', (source: string, chunk: Webpack4.Chunk | Webpack5.Chunk): string => {
				if ('hasAsyncChunks' in chunk) {
					// Webpack 5
					if (!chunk.hasAsyncChunks()) {
						return source;
					}
				}

				return source + (_TEMPLATE_PLACEHOLDER
					.replace('_MAX_CATCHABLE_PLACEHODER', String(this._max - 1))
					.replace('_DELAY_PLACEHODER', String(this._delay))
				);
			});
		});
	}
}

import { Plugin, Compiler, compilation } from 'webpack';

declare const _TEMPLATE_PLACEHOLDER: string;

export interface Options {
	max?: number,
	delay?: number | string,
}

export class RetryEnsureWebpackPlugin implements Plugin {
	private readonly _max: number;
	private readonly _delay: number | string;

	public constructor(options?: Options) {
		const finalOptions: Record<string, unknown> = Object.assign(
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

	public apply(compiler: Compiler): void {
		if (this._max <= 0) {
			// Zero retries is what Webpack does by default.
			// Nothing to do here.
			return;
		}

		compiler.hooks.thisCompilation.tap('RetryEnsureWebpackPlugin', (compilation: compilation.Compilation) => {
			compilation.mainTemplate.plugin('require-extensions', (source: string): string => {
				return source + (_TEMPLATE_PLACEHOLDER
					.replace('_MAX_CATCHABLE_PLACEHODER', String(this._max - 1))
					.replace('_DELAY_PLACEHODER', String(this._delay))
				);
			});
		});
	}
}

// retry-ensure-webpack-plugin {

type EnsuredModule = { "__brand": "EnsuredModule" };
type ChunkId = string | number;
type EnsureFunction = (chunkId: ChunkId) => Promise<EnsuredModule>;

declare const __webpack_require__: {
	e: EnsureFunction
}
declare const _MAX_CATCHABLE_PLACEHODER: number;
declare const _DELAY_PLACEHODER: number;

const _WebpackRetry_originalEnsure: EnsureFunction = __webpack_require__.e;
const _WebpackRetry_pendingPromises: Record<ChunkId, Promise<EnsuredModule>> = Object.create(null);

function _WebpackRetry_tryLoad(chunkId: ChunkId, retriedTimes: number): Promise<EnsuredModule> {
	return (_WebpackRetry_originalEnsure(chunkId)
		.catch(function (): Promise<EnsuredModule> {
			return new Promise(function (resolve: (ensuredModule: EnsuredModule | Promise<EnsuredModule>) => void) {
				const retry = (): void => {
					// Clean up. No-op if the listener is not set
					window.removeEventListener('online', retry, false);
					if (navigator.onLine === false) {
						// If navigator.onLine is supported, and is offline, wait for online
						window.addEventListener('online', retry, false);
					} else if (retriedTimes < _MAX_CATCHABLE_PLACEHODER) {
						// Retry with a catch
						resolve(_WebpackRetry_tryLoad(chunkId, retriedTimes + 1));
					} else {
						// Last try: Use the original ensure function
						resolve(_WebpackRetry_originalEnsure(chunkId));
					}
				}
				setTimeout(retry, _DELAY_PLACEHODER);
			});
		})
	);
}
__webpack_require__.e = function (chunkId: ChunkId): Promise<EnsuredModule> {
	if (!_WebpackRetry_pendingPromises[chunkId]) {
		_WebpackRetry_pendingPromises[chunkId] = _WebpackRetry_tryLoad(chunkId, 0);
		const cleanup = () => {
			delete _WebpackRetry_pendingPromises[chunkId];
		};
		_WebpackRetry_pendingPromises[chunkId].then(cleanup, cleanup);
	}
	return _WebpackRetry_pendingPromises[chunkId];
};


// } retry-ensure-webpack-plugin

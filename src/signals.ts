/**
 * Note: It would be amazing if we could allow any signal-like library,
 * but due to (TypeScript limitations)[1], we can't. So, we include the
 * Preact signals core package, as it's is the simplest one, and might
 * work with the existing Preact ecosystem. In the (distant) future,
 * this package ideas could be implemented with the (Signals Proposal)[2].
 * [1]: https://github.com/Microsoft/TypeScript/issues/1213
 * [2]: https://github.com/tc39/proposal-signals
 */
export { type Signal, effect, batch, computed, signal, untracked } from "@preact/signals-core";

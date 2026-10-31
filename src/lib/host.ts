/** Tells the Rust side the UI is ready: closes the splash window and reveals the main one. */
export async function splashDone(): Promise<void> {
	const { invoke } = await import('@tauri-apps/api/core');
	await invoke('splash_done');
}

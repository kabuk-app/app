//! Kabuk shell. Thin on purpose: windows and the splash hand-over live here, everything else is
//! the SvelteKit UI and, later, the Rust core.

use tauri::{AppHandle, Manager};

const SPLASH: &str = "splash";
const MAIN: &str = "main";

/// Called by the UI once it is ready and the 800 ms minimum has passed (decided in the UI).
/// Reveals the main window and closes the splash window. On mobile there is no splash window,
/// the native splash is dismissed by the system when the activity draws.
#[tauri::command]
fn splash_done(app: AppHandle) -> Result<(), String> {
	if let Some(main) = app.get_webview_window(MAIN) {
		main.show().map_err(|e| e.to_string())?;
		main.set_focus().map_err(|e| e.to_string())?;
	}
	if let Some(splash) = app.get_webview_window(SPLASH) {
		splash.close().map_err(|e| e.to_string())?;
	}
	Ok(())
}

#[cfg(desktop)]
fn open_splash(app: &AppHandle) -> tauri::Result<()> {
	tauri::WebviewWindowBuilder::new(app, SPLASH, tauri::WebviewUrl::App("splash.html".into()))
		.title("Kabuk")
		.inner_size(360.0, 240.0)
		.decorations(false)
		.resizable(false)
		.center()
		.always_on_top(true)
		.build()?;
	Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.setup(|app| {
			#[cfg(desktop)]
			open_splash(app.handle())?;
			#[cfg(mobile)]
			let _ = app;
			Ok(())
		})
		.invoke_handler(tauri::generate_handler![splash_done])
		.run(tauri::generate_context!())
		.expect("error while running Kabuk");
}

import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  const appPath = app.getAppPath();
  const htmlPath = path.join(appPath, 'dist', 'renderer', 'index.html');

  win.loadFile(htmlPath);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

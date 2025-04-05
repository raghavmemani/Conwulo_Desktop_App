const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const WebSocket = require('socket.io')(8080); // WebSocket server
const puppeteer = require('puppeteer');
const path = require('path');

let win;

// Ignore SSL Certificate Errors (if needed)
app.commandLine.appendSwitch('ignore-certificate-errors');

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { nodeIntegration: true },
    });

    win.loadFile(path.join(__dirname, 'index.html')); // Load local HTML file
    console.log("Electron App Started...");
});

// WebSocket Server to listen for commands from the mobile app
WebSocket.on('connection', (socket) => {
    console.log('Mobile App Connected');

    socket.on('message', async (message) => {
        console.log(`Received: ${message}`);

        if (message === 'open_notepad') {
            openNotepad();
        } else if (message === 'open_new_tab') {
            await openNewTab();
        }
    });
});

// Function to Open Notepad
function openNotepad() {
    console.log('Opening Notepad...');
    exec('notepad.exe'); // Runs Notepad application
}

// Function to Open New Tab in Chrome using Puppeteer
async function openNewTab() {
    console.log('Opening New Tab in Chrome...');

    const browser = await puppeteer.launch({
        headless: false, // Run in normal mode (not headless)
        args: ['--disable-extensions-except=/path/to/extension', '--load-extension=/path/to/extension']
    });

    const page = await browser.newPage();
    await page.goto('https://google.com');

    console.log('New tab opened');
}

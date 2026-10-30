// =====================================================================
//  FENIX — the projects shown on the site.
//
//  Easiest way to add or change a project: open editor.html
//  (in the Site_with_my_pjojects folder) and fill in the form.
//
//  Editing by hand works too: copy a whole { ... } block, change the
//  texts, keep the quotes and commas. Order here = order on the site.
// =====================================================================
window.PROJECTS = [
  {
    "id": "read-and-enjoy",
    "section": "online",
    "title": "Read & Enjoy",
    "badge": "Web app",
    "status": "online",
    "color": "cyan",
    "description": "A reader for books and language learning. Upload a book, read it right in your browser and learn new words with flashcards.",
    "tags": [".txt", ".fb2", ".epub", ".rtf", ".pdf", ".docx"],
    "visual": "book",
    "button": {
      "text": "Open the reader ↗",
      "link": "https://read-and-enjoy.onrender.com"
    }
  },
  {
    "id": "wild-labyrinth",
    "section": "online",
    "title": "Wild Labyrinth",
    "badge": "Game · itch.io",
    "status": "play online",
    "color": "pink",
    "description": "A multiplayer maze that never stops changing. Collect four crystals of your color, steal your rivals' gems, rotate maze tiles, teleport — and be the first to get back to your corner. Watch out for bears!",
    "tags": ["up to 4 players", "bots", "private rooms", "plays on mobile"],
    "visual": "maze",
    "button": {
      "text": "Play ↗",
      "link": "https://starter-programist.itch.io/wild-labrynth"
    }
  },
  {
    "id": "youtube-links",
    "section": "download",
    "title": "YouTube Channel Links",
    "badge": "Tool · Windows",
    "icon": "youtube",
    "color": "red",
    "description": "Collects links to every video on a YouTube channel. Paste the channel URL — get the full list of videos.",
    "tags": ["Python", "yt-dlp"],
    "visual": "terminal",
    "terminal": {
      "ask": "Paste a YouTube channel link: ",
      "answer": "https://youtube.com/@Google",
      "output": [
        "https://www.youtube.com/watch?v=DDjr6gXqtN8",
        "https://www.youtube.com/watch?v=lL7L6DiGeLc",
        "https://www.youtube.com/watch?v=WMjVP7QQyDI",
        "… and 2027 more links",
        "Press Enter to exit..."
      ]
    },
    "download": {
      "file": "downloads/YouTube_Channel_Links.exe",
      "label": "Download .exe",
      "size": "21.5 MB"
    },
    "code": {
      "file": "downloads/youtube_channel_links.py",
      "install": "pip install yt-dlp",
      "notes": [
        {"lines": "1", "text": "Imports yt-dlp — the library that knows how to talk to YouTube."},
        {"lines": "4-5", "text": "Asks for the channel link, strips extra parameters and points it at the channel's Videos tab."},
        {"lines": "7-8", "text": "Grabs the list of videos without downloading a single one (extract_flat)."},
        {"lines": "10-11", "text": "Prints the link of every video, one per line."},
        {"lines": "13", "text": "Waits for Enter, so the window doesn't close before you copy the links."}
      ]
    }
  },
  {
    "id": "tab-links",
    "section": "download",
    "title": "Browser Tab Links",
    "badge": "Tool · Windows",
    "icon": "tabs",
    "color": "cyan",
    "description": "Copies the URLs of all open browser tabs. Enter the number of tabs, switch to your browser — the tool walks through them and prints every link.",
    "tags": ["Python", "PyAutoGUI", "pyperclip"],
    "visual": "terminal",
    "terminal": {
      "ask": "How many tabs are open in the browser? ",
      "answer": "3",
      "output": [
        "Script started! Quickly switch to the browser window...",
        "https://read-and-enjoy.onrender.com/",
        "https://starter-programist.itch.io/wild-labrynth",
        "https://notebooklm.google.com/",
        "=== DONE ==="
      ]
    },
    "download": {
      "file": "downloads/Browser_Tab_Links.exe",
      "label": "Download .exe",
      "size": "15.2 MB"
    },
    "code": {
      "file": "downloads/browser_tab_links.py",
      "install": "pip install pyautogui pyperclip",
      "notes": [
        {"lines": "1-3", "text": "Loads the tools: time for pauses, pyautogui to press keys, pyperclip to read the clipboard."},
        {"lines": "5-7", "text": "Asks how many tabs to visit, then gives you 5 seconds to switch to the browser."},
        {"lines": "10-11", "text": "Ctrl+L selects the address bar of the current tab."},
        {"lines": "13-14", "text": "Ctrl+C copies the URL to the clipboard."},
        {"lines": "16-18", "text": "Ctrl+Tab jumps to the next tab, and the copied URL is printed."},
        {"lines": "20-21", "text": "Done! Waits for Enter before closing."}
      ]
    }
  },
  {
    "id": "notebooklm-deduper",
    "section": "download",
    "title": "NotebookLM Deduper",
    "badge": "Extension · Chrome",
    "icon": "puzzle",
    "color": "violet",
    "description": "Finds identical sources in a NotebookLM notebook and removes the extras in a couple of clicks. Matches by link, or by title when there's no link.",
    "visual": "notebooklm",
    "download": {
      "file": "downloads/notebooklm_deduper.zip",
      "label": "Download .zip",
      "size": "5 KB"
    },
    "install": [
      "Unzip the archive — you'll get the `notebooklm_deduper` folder.",
      "Open `chrome://extensions` in Chrome.",
      "Turn on “Developer mode” in the top right corner.",
      "Click “Load unpacked” and pick the folder."
    ]
  }
];

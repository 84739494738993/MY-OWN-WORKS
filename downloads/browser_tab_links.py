import time
import pyautogui  # Presses the keys
import pyperclip  # Reads the clipboard (copy/paste)

col = int(input("How many tabs are open in the browser? "))
print("Script started! Quickly switch to the browser window...")
time.sleep(5)

for i in range(col):
    pyautogui.hotkey("ctrl", "l")
    time.sleep(0.1)

    pyautogui.hotkey("ctrl", "c")
    time.sleep(0.1)

    pyautogui.hotkey("ctrl", "tab")
    time.sleep(0.1)
    print(pyperclip.paste())

print("\n=== DONE ===")
input("\nPress Enter to exit...")

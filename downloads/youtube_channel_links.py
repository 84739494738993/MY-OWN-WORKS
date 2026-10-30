import yt_dlp


channel_url = input("Paste a YouTube channel link: ")
videos_url = channel_url.split("?")[0].rstrip("/") + "/videos"

with yt_dlp.YoutubeDL({"extract_flat": True, "skip_download": True, "quiet": True}) as ydl:
    result = ydl.extract_info(videos_url, download=False)

for video in result["entries"]:
    print(video["url"])

input("\nPress Enter to exit...")

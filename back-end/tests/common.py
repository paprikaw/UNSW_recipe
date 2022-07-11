import os
import requests

port = 8080
url = f"http://localhost:{port}/"
thumbnailDir = "./../src/imgs/thumbnails"

def reset_server():
    requests.delete(url + 'reset')
    for file in os.scandir(thumbnailDir):
        os.remove(file.path)
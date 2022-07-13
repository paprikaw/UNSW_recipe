import os
import requests

port = 8080
url = f"http://localhost:{port}/"

def reset_server():
    thumbnails = os.path.abspath(
        os.path.join(os.path.dirname(os.path.dirname(__file__)),'src/imgs/thumbnails')
    )
    requests.delete(url + 'reset')
    for file in os.scandir(thumbnails):
        os.remove(file.path)
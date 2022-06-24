import requests

port = 8080
url = f"http://localhost:{port}/"

def reset_server():
    requests.delete(url + 'reset')
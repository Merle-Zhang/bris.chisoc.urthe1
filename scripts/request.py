import requests
import json
from pythonosc.udp_client import SimpleUDPClient

import sched, time

from datetime import datetime

ip = "127.0.0.1"
port = 53000

client = SimpleUDPClient(ip, port)  # Create client

shut = -1
boom = -1

startTime = time.time()

print ("\n================================================\n")
r = requests.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx456eee36c1ef6263&secret=dc409a7a1d46e00ac8b83f0bda90ca09')
print(str(datetime.now()) + " Get AT:\n", r.json())
at = r.json()['access_token']
print(str(datetime.now()) + " Access Token:\n", at)

startTime = time.time()


s = sched.scheduler(time.time, time.sleep)
def do_something(sc): 
    global startTime
    global r
    global at
    global shut
    global boom

    print ("\n================================================\n")
    if (time.time() - startTime) > 3600 :
        r = requests.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx456eee36c1ef6263&secret=dc409a7a1d46e00ac8b83f0bda90ca09')
        print(str(datetime.now()) + " Get AT:\n", r.json())
        at = r.json()['access_token']
        print(str(datetime.now()) + " Access Token:\n", at)

        startTime = time.time()
    post = requests.post('https://api.weixin.qq.com/tcb/invokecloudfunction?access_token='+at+'&env=dev-coqgb&name=count')
    print(str(datetime.now()) + " Post count\n", post.json())

    if boom != json.loads(post.json()['resp_data'])['boom']:
        client.send_message("/cue/5/go", 123)   # Send float message
        boom = json.loads(post.json()['resp_data'])['boom']
        print(str(datetime.now()) + " BOOOOOOOOOOOM!!!!!!!")
    if shut != json.loads(post.json()['resp_data'])['shut']:
        client.send_message("/cue/10/go", 123)   # Send float message
        shut = json.loads(post.json()['resp_data'])['shut']
        print(str(datetime.now()) + " SHUUUUUUUUUUT!!!!!!!")


    print(str(datetime.now()) + " Boom: ", boom)
    print(str(datetime.now()) + " Shut: ", shut)


    s.enter(3, 1, do_something, (sc,))

s.enter(3, 1, do_something, (s,))
s.run()


#!/usr/bin/python
import time
import json
import urllib
import os
import BaseHTTPServer
from pymongo import MongoClient
import datetime


HOST_NAME = 'localhost'
PORT_NUMBER = 31337
DATA_FILE = 'checkin.log'

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        data_string = self.rfile.read(int(self.headers['Content-Length']))
        dec = urllib.unquote(data_string).decode('utf8')
        data = json.loads(dec[5:])
        data_file.write('%s\n' % json.dumps(data))
        data_file.flush()
        print "Now saving it into the DB"
        print data['database']
        print data['database']['_id']
        updateDB(data['database'])
def updateDB(user):
    client = MongoClient()
    db = client.test
    email = user['email']
    print email
    cur = db.users.find({'email':email})
    myUsers = list(cur)
    if len(myUsers) is 1:
        print "He exist!"
        curTime = (datetime.datetime.now()-datetime.datetime(1970,1,1)).total_seconds()
        print curTime
        db.users.update({'email':email},{'$set':{'status.checkedIn':True,'status.checkInTime':curTime}})
        print "Updated and done!"
    else:
        print "I could not find him!"



script_dir = os.path.dirname(os.path.realpath(__file__))
filename = os.path.join(script_dir, DATA_FILE)
data_file = open(filename, 'a')

def main():
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)

if __name__ == '__main__':
    main()

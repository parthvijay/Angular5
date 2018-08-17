import json
from pprint import pprint
import sys
import smtplib
import email
from email.mime.text import MIMEText
import os
import shutil 


stage = "4"
dev = "3"
prod = "5"
enteredValue = input("please enter your deployment env:")

with open('./data/config.json') as f:
    data = json.load(f)

pprint(data["env"])

if (enteredValue == data["env"]):
   print("you entered a correct env")
   if(data["env"] == 4):
        print("executing deployment command, sit back and relax")
        os.system("ng build --base-href https://rewardstg.cloudapps.cisco.com/qualifications/app/")
        path = '/Users/pavijayv/Documents/cisco-ready-qualification/dist'
        source = os.listdir(path)
        destination = '/Users/pavijayv/Documents/server/ticaz53xstg/htdocs/qualifications/app/'
        for files in source:
                if files.endswith('*'):
                    shutil.move(path+files,destination)
        print("copied files to destination ready to execute git commands")
   if(data["env"] == 5):
        print("executing deployment command, sit back and relax")
        os.system("ng build --base-href https://rewarddash.cloudapps.cisco.com/qualifications/app/")
        path = '/Users/pavijayv/Documents/cisco-ready-qualification/dist'
        source = os.listdir(path)
        destination = '/Users/pavijayv/Documents/server/ticaz53xstg/htdocs/qualifications/app/'
        for files in source:
                if files.endswith('*'):
                    shutil.move(path+files,destination)
        print("copied files to destination ready to execute git commands")
else:
    print("you made a BUMMER!!!!,please check your email")
    fp = open('textFile.txt', 'rb')
    # Create a text/plain message
    msg = MIMEText(fp.read())
    fp.close()
    msg['Subject'] = 'You made a bummer while deploying the code' 
    msg['From'] = "kedeshmu@cisco.com"
    msg['To'] = "kedeshmu@cisco.com"
    s = smtplib.SMTP('outbound.cisco.com')
    s.sendmail("kedeshmu@cisco.com", ["kedeshmu@cisco.com"], msg.as_string())
    s.quit()
   







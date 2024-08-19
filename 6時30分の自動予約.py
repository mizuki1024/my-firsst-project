import time
from cgitb import html
from json import load
import numpy
import chromedriver_binary
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome import service
from selenium import webdriver
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
import time
import sys
import datetime
import signal
import os
import requests
options = Options()
options.add_argument('--disable-gpu')
options.add_argument('--disable-extensions')
options.add_argument('--proxy-server="direct://"')
options.add_argument('--proxy-bypass-list=*')
options.add_argument('--start-maximized')
import schedule
import time
from selenium.webdriver.chrome.service import Service
driver_path = (r"C:\Users\mizuk\Downloads\edgedriver_win64 (5)")

service = Service(executable_path=driver_path)
driver = webdriver.Edge(r"C:\Users\mizuk\Downloads\edgedriver_win64 (5)")

driver = webdriver.Edge(service=service)
driver.get("http://yoyaku.fds.okinawa/Scripts/MGrqispi015.dll?APPNAME=NK-YOYAKU&PRGNAME=pclogin")
my_id = driver.find_element(By.NAME, "ID")
password = driver.find_element(By.NAME, "Pass")
submit = driver.find_element(By.ID, "login_btn")
my_id.clear()
password.clear()
my_id.send_keys("220490")
password.send_keys("0310")
submit.click()
submit = driver.find_element(By.XPATH, "//*[@value='技能予約']")
submit.click()
win_height = driver.execute_script("return window.innerHeight")
last_top = 1
last_height = driver.execute_script("return document.body.scrollHeight")
top = last_top
top += int(win_height * 2.8) #お試し
driver.execute_script("window.scrollTo(0, %d)" % top)
#submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[1]")
#submit.click()
#submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[2]")
#submit.click()
win_height = driver.execute_script("return window.innerHeight")
last_top = 1
last_height = driver.execute_script("return document.body.scrollHeight")
top = last_top
top += int(win_height * 3.4) #お試し
driver.execute_script("window.scrollTo(0, %d)" % top)
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[3]")
submit.click()
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[4]")
submit.click()
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[5]")
submit.click()
win_height = driver.execute_script("return window.innerHeight")
last_top = 1
last_height = driver.execute_script("return document.body.scrollHeight")
top = last_top
top += int(win_height * 4) #お試し
driver.execute_script("window.scrollTo(0, %d)" % top)
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[6]")
submit.click()
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[7]")
submit.click()
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[8]")
submit.click()
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[9]")
submit.click()
win_height = driver.execute_script("return window.innerHeight")
last_top = 1
last_height = driver.execute_script("return document.body.scrollHeight")
top = last_top
top += int(win_height * 4.6) #お試し
driver.execute_script("window.scrollTo(0, %d)" % top)
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[10]")
submit.click()
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[11]")
submit.click()
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[12]")
submit.click()
win_height = driver.execute_script("return window.innerHeight")
last_top = 1
last_height = driver.execute_script("return document.body.scrollHeight")
top = last_top
top += int(win_height * 5) #お試し
driver.execute_script("window.scrollTo(0, %d)" % top)
submit = driver.find_element(By.XPATH, "/html/body/div[2]/table[2]/tbody/tr[3]/td[13]")
submit.click()
submi.click()

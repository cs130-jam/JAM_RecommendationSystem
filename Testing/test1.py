#!/usr/bin/env python
# coding: utf-8

# In[2]:


import reco as module_0
import unittest
import os
import json
import pymysql
import pandas as pd
from sklearn.neighbors import NearestNeighbors



# In[3]:

connection=pymysql.connect(host='localhost',port=int(3306),user='root',passwd='1234abcd',db='employee_management_system')
mycursor = connection.cursor()




def test_case_insert_user():    
    request_body = {'uid':'00000000-0000-0000-0000-000000000005','genres':{'Chicago Blues': 50, 'Alternative Rock': 60, 'Boogie Woogie': 0}}
    str_0 = module_0.insert_user(request_body)
    assert str_0 == "204"
    
    request_body = {'uid':'00000000-0000-0000-0000-000000000005','genres':{'Chicago Blues': 0, 'Alternative Rock': 0, 'Boogie Woogie': 0}}
    str_1 = module_0.insert_user(request_body)
    assert str_1 == "204"
    
    request_body = {'uid':'00000000-0000-0000-0000-000000000005','genres':{}}
    str_2 = module_0.insert_user(request_body)
    assert str_2 == "204"
    


# In[4]:


def test_case_get_user_interests():    
    uid = '00000000-0000-0000-0000-000000000005'
    str_0 = module_0.get_user_interests(uid)
    assert str_0 == "204"
    
    request_body = #enter uid with no interest # this user has no interest
    str_1 = module_0.get_user_interests(uid)
    assert str_1 == None
    
    
    


# In[5]:


def test_case_get_match():    
    uid = '00000000-0000-0000-0000-000000000005'
    str_0 = module_0.get_match(uid)
    assert str_0 == "204"
    
    request_body = #enter uid with no interest # this user has no interest 
    str_1 = module_0.get_match(uid)   #this user will get random recommendation
    assert str_1 == "204"


# In[ ]:





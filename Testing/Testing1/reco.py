#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os
import json
import pymysql
import pandas as pd
from sklearn.neighbors import NearestNeighbors


# In[ ]:





# In[2]:


def insert_user(request_body):
    total_genre_count = sum(request_body.genres.values())
    if total_genre_count == 0:
            total_genre_count = 1
    filled_genres = defaultdict(int, request_body.genres)
    normalized_genres = {genre: filled_genres[genre] / total_genre_count for genre in genres}
    sql = "INSERT INTO user_interests (uid, interests) VALUES (%s, %s) ON DUPLICATE KEY UPDATE interests=%s"
    genres_json = json.dumps(normalized_genres)
    with connection.cursor() as cursor:
        cursor.execute(sql, (request_body.uid, genres_json, genres_json))

    connection.commit()
    return "204"


# In[3]:


def get_match(uid):
    page_size = 50
    page_index = 1
    
   
    user_interests = get_user_interests1(uid)
    
    dfsql = pd.read_sql_query("SELECT uid, interests FROM user_interests WHERE uid!=%s", connection, params=[uid])
    genres_table = pd.DataFrame(dfsql["interests"].apply(json.loads).tolist())
    if user_interests == None:
        random_reco = genres_table.sample(genres_table.shape[0])
        indices = random_reco.index.tolist()
        page_list = indices[page_index*page_size:page_index*page_size + page_size]
        
    else: 
        knn = NearestNeighbors(n_neighbors=genres_table.shape[0]).fit(genres_table)
        distances, indices = knn.kneighbors(user_interests)
        page_list = indices.tolist()[0][page_index*page_size:page_index*page_size + page_size]
        
    total_pages = math.ceil(dfsql.shape[0] / page_size)
    uid_list = dfsql.iloc[page_list, :]['uid']).tolist() #if execution could reach this point its success
    return "204"


# In[4]:


def get_user_interests(uid):
    with connection.cursor() as cursor:
        sql_query = "SELECT interests FROM user_interests WHERE uid=%s"
        cursor.execute(sql_query, uid)
        user_interests = cursor.fetchone()
        if user_interests is None:
            return None

        user_interests_table = pd.DataFrame([json.loads(user_interests[0])])
        return "204"#user_interests_table


# In[5]:


def get_user_interests1(uid):
    with connection.cursor() as cursor:
        sql_query = "SELECT interests FROM user_interests WHERE uid=%s"
        cursor.execute(sql_query, uid)
        user_interests = cursor.fetchone()
        if user_interests is None:
            return None

        user_interests_table = pd.DataFrame([json.loads(user_interests[0])])
        return user_interests_table


# In[ ]:





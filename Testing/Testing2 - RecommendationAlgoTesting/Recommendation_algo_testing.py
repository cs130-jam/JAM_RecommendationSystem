#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os
import json
import pymysql
import pandas as pd
from sklearn.neighbors import NearestNeighbors


# In[2]:


connection=pymysql.connect(host='localhost',port=int(3306),user='root',passwd='1234abcd',db='employee_management_system')
mycursor = connection.cursor()


# In[3]:


genres = ["Boogie Woogie", "Pub Rock", "Chicago Blues", "Alternative Rock", "Country Rock", "Country Blues", "Soundtrack", "Delta Blues", "Blues Rock", "Pop Rap", "East Coast Blues", "Electric Blues", "Harmonica Blues", "Folk Rock", "Rock & Roll", "AOR", "Hill Country Blues", "Rhythm & Blues", "Jump Blues", "Soul-Jazz", "Louisiana Blues", "Fusion", "Bayou Funk", "Memphis Blues", "Soul", "Folk", "Modern Electric Blues", "Prog Rock", "Piano Blues", "Soft Rock", "Ragtime", "Contemporary Jazz", "Piedmont Blues", "Classic Rock", "Texas Blues", "Brass Band", "Jazz-Funk", "Industrial", "Marches", "Contemporary", "Neo-Classical", "Military", "Pipe & Drum", "Educational", "Story", "Nursery Rhymes", "Baroque", "Abstract", "Experimental", "Ambient", "Choral", "Hard Rock", "Symphonic Rock", "Classical", "Early", "Impressionist", "Modern Classical", "Medieval", "Renaissance", "Aboriginal", "Modern", "Darkwave", "Score", "Neo-Romantic", "Opera", "Easy Listening", "Musical", "Operetta", "Vocal", "Oratorio", "Lounge", "Post-Modern", "Romantic", "Serial", "Twelve-tone", "Zarzuela", "IDM", "Techno", "Acid", "House", "Acid House", "Acid Jazz", "Downtempo", "Ballroom", "RnB/Swing", "Rocksteady", "Ska", "Baltimore Club", "UK Garage", "Bassline", "Beatdown", "Berlin-School", "Breakbeat", "Big Beat", "Bleep", "Hardcore", "Jungle", "Breakcore", "Breaks", "Broken Beat", "Chillwave", "Glitch", "Electro", "Chiptune", "Synth-pop", "Disco", "Dance-pop", "Black Metal", "Doom Metal", "Drone", "Dark Ambient", "Deep House", "Future Jazz", "Deep Techno", "New Wave", "Pop Rock", "Punk", "Disco Polo", "Eurodance", "Trance", "Donk", "Gabber", "Doomcore", "Drum n Bass", "Post-Punk", "Dub", "Avantgarde", "Dub Techno", "Minimal Techno", "Dubstep", "Dungeon Synth", "EBM", "Electro House", "Trip Hop", "Electro Swing", "Acoustic", "Electroacoustic", "Europop", "Electroclash", "Euro House", "Euro-Disco", "Eurobeat", "Hard Trance", "Psychedelic Rock", "Ghetto", "Bass Music", "Hip Hop", "Footwork", "Freestyle", "J-Core", "Tribal", "Funkot", "Contemporary R&B", "Ballad", "Garage House", "Ghetto House", "Ghettotech", "Glitch Hop", "Goa Trance", "Grime", "Halftime", "Hands Up", "Happy Hardcore", "New Beat", "Hard Beat", "Progressive House", "Tech House", "Hard House", "Hard Techno", "Hardstyle", "Harsh Noise Wall", "Hi NRG", "Funk", "P.Funk", "Hip-House", "Illbient", "Spoken Word", "Italo House", "Italo-Disco", "Italodance", "Speedcore", "Jazzdance", "Jersey Club", "Juke", "Jumpstyle", "Latin", "Jazzy Hip-Hop", "Leftfield", "Lento Violento", "Makina", "Minimal", "Ragga HipHop", "Dancehall", "Moombahton", "Musique Concrète", "Neo Trance", "Tech Trance", "Neofolk", "Nerdcore Techno", "New Age", "Art Rock", "Noise", "Indie Rock", "Nu-Disco", "Neo Soul", "Power Electronics", "Progressive Trance", "Progressive Breaks", "Tribal House", "Psy-Trance", "Rhythmic Noise", "Schranz", "Skweee", "Education", "Sound Collage", "Speed Garage", "Synthwave", "Post Rock", "Tropical House", "UK Funky", "Vaporwave", "Witch House", "Psychedelic", "Latin Jazz", "African", "Andalusian Classical", "Andean Music", "Appalachian Music", "Hindustani", "Ghazal", "Bhangra", "Bengali Music", "Religious", "Bangladeshi Classical", "Basque Music", "Indian Classical", "Radioplay", "Speech", "Bluegrass", "Cajun", "Calypso", "Reggae", "Cambodian Classical", "Jazz-Rock", "Canzone Napoletana", "Carnatic", "Ethereal", "Catalan Music", "Celtic", "Chacarera", "Zamba", "Bolero", "Polka", "Guarania", "Chamamé", "Chinese Classical", "Salsa", "Kaseko", "Chutney", "Cobla", "Copla", "Country", "Éntekhno", "Cretan", "Dangdut", "Laïkó", "Fado", "Filk", "Flamenco", "Funaná", "Zouk", "Gagaku", "Gamelan", "Galician Traditional", "Krautrock", "Għana", "Bollywood", "Qawwali", "Griot", "Highlife", "Roots Reggae", "Soca", "MPB", "Gwo Ka", "Hawaiian", "Afrobeat", "Honky Tonk", "Hillbilly", "Southern Rock", "Huayno", "Mariachi", "Jota", "Pasodoble", "Jug Band", "Keroncong", "Danzon", "Kizomba", "Klasik", "Music Hall", "Klezmer", "Korean Court Music", "Lao Music", "Persian Classical", "Tango", "Liscio", "Luk Krung", "Beat", "Luk Thung", "Chanson", "Maloya", "Mbalax", "Min'yō", "Mizrahi", "Mo Lam", "Morna", "Field Recording", "Mouth Music", "Mugham", "Népzene", "Garage Rock", "Nhạc Vàng", "Viking Metal", "Nordic", "Ottoman Classical", "Overtone Singing", "Space-Age", "Pacific", "Novelty", "Philippine Classical", "Phleng Phuea Chiwit", "Piobaireachd", "Parody", "Comedy", "Progressive Bluegrass", "Raï", "Rebetiko", "Romani", "Rune Singing", "Salegy", "Sámi Music", "Schlager", "Sea Shanties", "Séga", "Sephardic", "Soukous", "Rumba", "Taarab", "Tamil Film Music", "Thai Classical", "Volksmusik", "Waiata", "Western Swing", "Yemenite Jewish", "Zemer Ivri", "Zydeco", "Boogie", "Conscious", "Free Funk", "Theme", "Cool Jazz", "Gogo", "Swingbeat", "Gospel", "Minneapolis Sound", "New Jack Swing", "UK Street Soul", "Beatbox", "Bongo Flava", "Hiplife", "Kwaito", "Boom Bap", "Bounce", "Britcore", "Cloud Rap", "Gangsta", "Crunk", "Cut-up/DJ", "DJ Battle Tool", "Favela Funk", "G-Funk", "Go-Go", "Hardcore Hip-Hop", "Horrorcore", "Hyphy", "Post Bop", "Modal", "Instrumental", "Miami Bass", "Motswako", "Phonk", "Screw", "Thug Rap", "Spaza", "Dream Pop", "Indie Pop", "Trap", "Turntablism", "Afro-Cuban Jazz", "Avant-garde Jazz", "Hard Bop", "Big Band", "Bop", "Smooth Jazz", "Bossa Nova", "Jangle Pop", "Cape Jazz", "Dark Jazz", "Dixieland", "Free Improvisation", "Free Jazz", "Gypsy Jazz", "Afro-Cuban", "Rockabilly", "Swing", "Stride", "Aguinaldo", "Samba", "Axé", "Bachata", "Baião", "Forró", "Choro", "Bambuco", "Batucada", "Beguine", "Cha-Cha", "Twist", "Son", "Trova", "Guajira", "Guaguancó", "Bomba", "Boogaloo", "Bossanova", "Candombe", "Carimbó", "Cumbia", "Descarga", "Champeta", "Charanga", "Merengue", "Compas", "Conjunto", "Ranchera", "Corrido", "Marimba", "Cuatro", "Mambo", "Cubano", "Gaita", "Guaracha", "Jibaro", "Joropo", "Lambada", "Reggae-Pop", "Marcha Carnavalesca", "Musette", "Música Criolla", "Norteño", "Nueva Cancion", "Nueva Trova", "Occitan", "Pachanga", "Plena", "Porro", "Quechua", "Reggaeton", "Samba-Canção", "Seresta", "Son Montuno", "Sonero", "Tejano", "Timba", "Vallenato", "Audiobook", "Surf", "Dialogue", "Erotic", "Health-Fitness", "Interview", "Monolog", "Movie Effects", "Poetry", "Political", "Promotional", "Public Broadcast", "Speed Metal", "Thrash", "Heavy Metal", "Public Service Announcement", "Sermon", "Sound Art", "Grunge", "Sound Poetry", "Special Effects", "Technical", "Space Rock", "Therapy", "Barbershop", "Break-In", "Bubblegum", "Cantopop", "City Pop", "Enka", "Kayōkyoku", "Ethno-pop", "Hokkien Pop", "Indo-Pop", "J-pop", "K-pop", "Karaoke", "Levenslied", "Light Music", "Mandopop", "Néo Kyma", "Ryūkōka", "Villancicos", "Azonto", "Bubbling", "Lovers Rock", "Dub Poetry", "Junkanoo", "Mento", "Ragga", "Rapso", "Reggae Gospel", "Steel Band", "Acid Rock", "Arena Rock", "Glam", "Atmospheric Black Metal", "Brit Pop", "Coldwave", "Crust", "Death Metal", "Deathcore", "Goth Rock", "Deathrock", "Depressive Black Metal", "Doo Wop", "Emo", "Folk Metal", "Funeral Doom Metal", "Funk Metal", "Grindcore", "Goregrind", "Gothic Metal", "Groove Metal", "Horror Rock", "Industrial Metal", "J-Rock", "K-Rock", "Lo-Fi", "Math Rock", "Progressive Metal", "Melodic Death Metal", "Melodic Hardcore", "Metalcore", "Mod", "NDW", "No Wave", "Noisecore", "Nu Metal", "Oi", "Pop Punk", "Pornogrind", "Post-Hardcore", "Post-Metal", "Power Metal", "Power Pop", "Power Violence", "Sludge Metal", "Psychobilly", "Rock Opera", "Shoegaze", "Skiffle", "Stoner Rock", "Swamp Pop", "Symphonic Metal", "Technical Death Metal", "Yé-Yé", "Cabaret", "Vaudeville", "Video Game Music"] 


# In[4]:



def get_match_algo(uid):
    page_size = 50
    page_index = 1
    user_interests = get_user_interests(uid) 
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
    return (dfsql.iloc[page_list, :]['uid']).tolist()

def get_match_random(uid):
    page_size = 50
    page_index = 1
    user_interests = get_user_interests(uid)
    dfsql = pd.read_sql_query("SELECT uid, interests FROM user_interests WHERE uid!=%s", connection, params=[uid])
    genres_table = pd.DataFrame(dfsql["interests"].apply(json.loads).tolist())
    random_reco = genres_table.sample(genres_table.shape[0])
    indices = random_reco.index.tolist()
    page_list = indices[page_index*page_size:page_index*page_size + page_size]
    total_pages = math.ceil(dfsql.shape[0] / page_size)
    return (dfsql.iloc[page_list, :]['uid']).tolist()

def get_user_interests(uid):
    with connection.cursor() as cursor:
        sql_query = "SELECT interests FROM user_interests WHERE uid=%s"
        cursor.execute(sql_query, uid)
        user_interests = cursor.fetchone()
        if user_interests is None:
            return None

        user_interests_table = pd.DataFrame([json.loads(user_interests[0])])
        return user_interests_table


# In[5]:


# generated the recommendations with and without the algorithms and compared 
#with the given user to understand the effectiveness of our algo
uid = '00000000-0000-0000-0000-000000000005'
algo_rec = get_match_algo(uid)
algo_random = get_match_random(uid)


# In[ ]:





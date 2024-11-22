import time
import random
import requests

NODE_MASTER_URL = "http://node-master:5000/add_block"
AGENT_NAME = f"Agent-{random.randint(1, 15)}"

def generate_random_data():
    return f"{AGENT_NAME} Latitude-{random.uniform(-90.00000, 90.00000)}Longitude-{random.uniform(-180.00000, 180.00000)}"

while True:
    data = generate_random_data()
    try:
        response = requests.post(NODE_MASTER_URL, json={"data": data})
        if response.status_code == 201:
            print(f"{AGENT_NAME}: Bloco adicionado com sucesso: {data}")
        else:
            print(f"{AGENT_NAME}: Erro adicionando bloco. Response: {response.text}")
    except Exception as e:
        print(f"{AGENT_NAME}: Erro conectando ao agente mestre: {e}")
    time.sleep(random.randint(15, 30))

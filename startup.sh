sudo apt-get install python3
sudo apt install python3.8-venv
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
python3 OneOnOne/manage.py makemigrations
python3 OneOnOne/manage.py migrate

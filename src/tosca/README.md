tosca
=====

Advanced FacetView User Interface

Create virtualenv using SciFlo system packages
----------------------------------------------
virtualenv --system-site-packages env

Install Dependencies via pip
----------------------------
pip install flask
pip install gunicorn

Create database
---------------
python db_create.py

To run in development mode
--------------------------
python run.py

To run in production mode
--------------------------
As a daemon:       gunicorn -w4 -b 0.0.0.0:8879 --keyfile=server.key --certfile=server.pem -k gevent --daemon -p tosca.pid tosca:app
In the foreground: gunicorn -w4 -b 0.0.0.0:8879 --keyfile=server.key --certfile=server.pem -k gevent -p tosca.pid tosca:app

from tosca import app


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8879, debug=True, processes=2)

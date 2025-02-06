import logging
from flask import Flask, render_template

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)


@app.route('/')
def index():
    """Render the main page with the solar system visualization."""
    return render_template('index.html')


@app.route('/0')
def index0():
    """Render the main page with the solar system visualization."""
    return render_template('index0.html')


@app.route('/2')
def index2():
    """Render the main page with the solar system visualization."""
    return render_template('index2.html')


@app.route('/3')
def index3():
    """Render the main page with the solar system visualization."""
    return render_template('index3.html')


@app.route('/10')
def index10():
    """Render the main page with the solar system visualization."""
    return render_template('index10.html')

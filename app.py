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

#!/usr/bin/env python3
import os
import random
import tempfile
import html2text
from epub_conversion.utils import open_book, convert_epub_to_lines
from flask import Flask, request, render_template
from generativepoetry.decomposer import cutup as cutup_technique
from generativepoetry.decomposer import markov as markov_technique
from generativepoetry.decomposer import get_gutenberg_document, get_internet_archive_document, ParsedText
from gutenberg.query import get_metadata
from flask import jsonify
from formatter import *
import requests
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/sampledocument", methods=['GET'])
def sample_document_routet():
    format = request.args.get('format')
    sample_size = int(request.args.get('sample_size')
                      ) if request.args.get('sample_size') else False
    url = request.args.get('url') if request.args.get('url') else False
    if not url:
        language = False
        while language != "en":
            # Pick book at random (max id is currently 61720)
            document_id = random.randint(1, 61720)
            language_set = get_metadata('language', document_id)
            language = list(language_set)[0] if len(language_set) else False
        url = "http://www.gutenberg.org/ebooks/" + str(document_id)
        document = ParsedText(get_gutenberg_document(url))
    else:
        if 'gutenberg.org' in url:
            document = ParsedText(get_gutenberg_document(url))
        if 'archive.org' in url:
            document = ParsedText(get_internet_archive_document(url))
    return jsonify(sample=sample_document(document, format, sample_size))


@app.route("/uploaddocument", methods=['POST'])
def upload_document_route():
    upload = request.files['file']
    if upload.filename.endswith('epub'):
        handle, filename = tempfile.mkstemp()
        os.close(handle)
        upload.save(filename)
        book = open_book(filename)
        h = html2text.HTML2Text()
        file_text = h.handle(" ".join(convert_epub_to_lines(book)))
    elif upload.filename.endswith('txt'):
        file_text = upload.read()
    else:
        raise Exception("Invalid file type")
    document = ParsedText(file_text)
    format = request.args.get('format')
    sample_size = int(request.args.get('sample_size')
                      ) if request.args.get('sample_size') else False
    return jsonify(sample=sample_document(document, format, sample_size))


@app.route("/neuralnet", methods=['POST'])
def neuralnet():
    cleaned_input = request.get_json()['input']
    cleaned_input = clean(request.get_data().decode(encoding='UTF-8'))
    # ngram_size = int(request.args.get('ngram_size'))
    # output_format = request.args.get('output_format')
    # output = " ".join(neuralnet_technique(cleaned_input, ngram_size=ngram_size, num_output_sentences=13))
    # if output_format == 'aphorisms':
    #     output = format_aphorisms(output)
    # return jsonify(output=output)
    headers = {
        'Authorization': 'Bearer 15d8e223-d76e-419d-8196-0e91fd48c3d6',
        'Content-Type': 'application/json',
    }
    data = '{"prompt": {"text": "' + cleaned_input + '"},"length": 300}'
    response = requests.post('https://api.inferkit.com/v1/models/ca81eeb1-df94-4403-aab0-569923f4d354/generate',
                             headers=headers, data=data)
    return response.json()


@app.route("/cutup", methods=['POST'])
def cutup():
    cleaned_input = request.get_json()['input']
    cutup_min_size = int(request.args.get('cutupmin'))
    cutup_max_size = int(request.args.get('cutupmax'))
    output = " ".join(cutup_technique(
        cleaned_input, min_cutout_words=cutup_min_size, max_cutout_words=cutup_max_size))
    output_format = request.args.get('output_format')
    if output_format == 'aphorisms':
        output = format_aphorisms(output)
    return jsonify(output=output)


if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=7878,
        debug=True
    )

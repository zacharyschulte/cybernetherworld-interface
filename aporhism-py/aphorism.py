

# def getPos(sentence):
#     words = nltk.word_tokenize(sentence)
#     taggedWords = nltk.pos_tag(words)
#     taggedWords = map(lambda tag: tag[1], taggedWords)
#     listToStr = ' '.join(map(str, taggedWords))
#     return listToStr


# def filterOne(sentences_to_filter):
#     for el in sentences_to_filter:
#         if len(el) > 5 or re.match("/\b(?:my|me|he|she|his|her|him|I)\b/gi", el):
#             return False
#         else:
#             return True


# def nounVerbs(sentences):
#     for el in sentences:
#         pos = getPos(el)
#         if re.match("/NN.? VB[ZP]/", pos):
#             return True
#         else:
#             return False


def format_aphorisms(text):
    sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')
    sentences = sent_detector.tokenize(text.strip())
    formatted_output = ""
    aphorism_number = 1

    firstfilter_sentences = list(filter(lambda el: len(el) < 70, sentences))
    # secondfilter = filter(nounVerbs, firstfilter_sentences)
    # secondfilter_sentences = list(secondfilter)

    while(len(firstfilter_sentences)):
        formatted_output += "—" + str(aphorism_number) + "—\n"
        for i in range(random.randint(1, 3)):
            if firstfilter_sentences:
                formatted_output += firstfilter_sentences.pop(0) + " "
            else:
                return formatted_output
        formatted_output += '\n\n'
        aphorism_number += 1
    return formatted_output

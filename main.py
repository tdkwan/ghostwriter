from textblob import TextBlob
import random
import datetime
import time
import sys
import pprint
import nltk
from nltk.corpus import stopwords
stop = stopwords.words('english')

valences = ['inspired', 'annoyed', 'discontent', 'nostalgic']
getTransVerb = {
                'inspired' : 'inspires',
                'annoyed' : 'annoys',
                }
connotations = {
    'inspired' : 'positive',
    'annoyed' : 'negative',
    'discontent' : 'negative',
    'nostalgic' : 'positive'
}
settings = ["The last flecks of light cascade across trees. \nIt's a warm Tuesday evening in June and "]
actions = [" and thinking of ",
            " and pondering his "]

clarifications = [" is "]
clarifications_mid = [" by "]
clarifications_end = [ " because" ]

positive_event_verb = [" tells "]
positive_event_object = [" something that (you) have been waiting to hear for years. "]
positive_event_continuation = [" tells "]

negative_event_verb = [" diseappears from the life of "]
negative_event_object = [" hasn't been seen for 2 years now. So "]
negative_event_continuation = [" feels "]
today = datetime.date.today()

story = ""

def main():
    global story
    user = ""
    story = ""
    character = ""
    printIntro()
    user = getUserInfo()
    while (1):
        valence = ""
        valence = random.choice(valences)
        printInstructions()
        response = readResponse() # empty read expected to start story
        genesisResponse = genesis(user, valence)
        names = extractNames(genesisResponse)
        organizations = extractOrganizations(genesisResponse)
        # read logic, searches for who or what, no where yet.
        # depending on input given, (who, what where) print and gather clarification
        if len(names) != 0: # there is a name given
            for name in names:
                character = name
        elif len(organizations) != 0:
            for org in organizations:
                character = org 
        else:
            readError()
        clarification(user, character, valence)
        event(user, character, valence)
        print("\n")
        printStory()

def genesis(user, valence):
    global story
    while True: # in case of shuffle
        prompt = generatePrompt(user, valence)
        print(prompt)
        prompt = cleanString(prompt)
        prompting()
        response = readResponse()
        if response != 'SHUFFLE':
            break
    response = cleanString(response)
    story += prompt
    story += " " + response
    return response

def clarification(user, character, valence):
    global story
    while True:
        clarification = generateClarification(user, character, valence)
        clarification = cleanString(clarification)
        print(clarification)
        prompting()
        clarificationResponse = readResponse()
        if clarificationResponse != 'SHUFFLE':
            break
    clarificationResponse = cleanString(clarificationResponse)
    story += " " + clarification
    story += " " + clarificationResponse
    
    return clarificationResponse

def generatePositiveEvent(user, character, valence):
    event = random.randint(0,len(positive_event_verb) - 1)
    return (character + positive_event_verb[event]
        user + positive_event_object[event] + character + 
        positive_event_continuation[event] + user)

def generateNegativeEvent(user, character, valence):
    event = random.randint(0, len(negative_event_verb) - 1)
    return (character + negative_event_verb[event]
        user + negative_event_object[event] + character + 
        negative_event_continuation[event] + user)

def event(user, character, valence):
    global story
    connotation = connotations.get(valence)
    event = ""
    while True:
        if connotation == 'positive':
            print("positive")
            event = generatePositiveEvent(user, character, valence)
        elif connotation == 'negative':
            print("negative")
            event = generateNegativeEvent(user, character, valence)
        else:
            print("neutral")
        print("Generating Event")
        print(event)
        prompting()
        eventResponse = readResponse()
        if eventResponse != 'SHUFFLE':
            break
    story += " " + event
    story += " " + eventResponse
        

def cleanString(input):
    input[1:]
    return input.rstrip()

def printStory():
    global story
    print("\nThe story thus far")
    prompting()
    print(story)

def generateClarification(name, character, valence):
    return name + random.choice(clarifications) + valence + random.choice(clarifications_mid) + character + random.choice(clarifications_end)
    
def getUserInfo():
    print("What's your name?")
    user = raw_input("Name: ")
    print("\n")
    return user

def printInstructions():
    print("press ENTER to begin a new story")

def handleInput():
    response = raw_input(">")
    return response

def extractNames(text):
    names = []
    sentences = preprocess_response(text)
    for tagged_sentence in sentences:
        for chunk in nltk.ne_chunk(tagged_sentence):
            if type(chunk) == nltk.tree.Tree:
                if chunk.label() == 'PERSON':
                    names.append(' '.join([c[0] for c in chunk]))
    return names

def readError():
    print("Sorry input not recognized")

def extractOrganizations(text):
    organizations = []
    sentences = preprocess_response(text)
    for tagged_sentence in sentences:
        for chunk in nltk.ne_chunk(tagged_sentence):
            if type(chunk) == nltk.tree.Tree:
                if chunk.label() == 'ORGANIZATION':
                    organizations.append(' '.join([c[0] for c in chunk]))
    return organizations

def preprocess_response(text):
    text = ' '.join([i for i in text.split() if i not in stop])
    sentences = nltk.sent_tokenize(text)
    sentences = [nltk.word_tokenize(sent) for sent in sentences]
    sentences = [nltk.pos_tag(sent) for sent in sentences]
    return sentences

def clearAndReset():
    story = ""
    main()

def printIntro():
    print("\n\n-----------------------")    
    print("GHOSTWRITER - NARRATIVE ENGINE")
    print("6-10-19 TEST BUILD v1.0")
    print("Commands:")
    print("\t enter START - to start your story")
    print("\t enter DONE - quit at anytime")
    print("\t enter SHUFFLE - for a different prompt")
    print("\t enter RESET - to reset your story")
    print("-----------------------\n")
    print(today)
    print("\n")
    print("This is a story about you...")
    print("\n")

def prompting():
    ellipsis = "..."
    for dot in ellipsis:
        sys.stdout.write(dot)
        time.sleep(0.8)
    print("\n")

def generatePrompt(user, valence):
    global story
    time.sleep(1)
    print("Generating Prompt"),
    prompting()
    return populatePrompt(user, valence)

def readResponse():
    response = raw_input(">")
    if response in functions: # basic functionality
        functions[response]()
    return response

def populatePrompt(name, valence):
    return random.choice(settings) + name + " is " + valence + random.choice(actions)

def exit():
    sys.exit()

functions = {
            "START" : generatePrompt,
            "DONE" : exit,
            "RESET" : clearAndReset
            }

if __name__ == '__main__':
    main()
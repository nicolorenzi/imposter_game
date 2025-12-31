# data.py
import random

CATEGORIES = {
    "animals": [
        "dog", "cat", "elephant", "giraffe", "lion", "tiger", "bear", 
        "monkey", "zebra", "penguin", "dolphin", "shark", "eagle", "parrot",
        "kangaroo", "koala", "panda", "gorilla", "cheetah", "wolf", "fox",
        "rabbit", "horse", "cow", "pig", "chicken", "duck", "snake", "lizard"
    ],
    
    "food": [
        "pizza", "burger", "sushi", "pasta", "taco", "sandwich", "salad",
        "ice cream", "cake", "cookie", "donut", "pancake", "waffle", "steak",
        "chicken wings", "french fries", "burrito", "ramen", "curry", 
        "dumplings", "spring rolls", "lasagna", "spaghetti",
        "croissant", "bagel", "muffin", "pie"
    ],
    
    "locations": [
        "beach", "mountain", "desert", "forest", "city", "airport", "hospital",
        "school", "restaurant", "gym", "library", "park", "zoo", "museum",
        "cinema", "mall", "hotel", "cafe", "subway", "train station", "harbor",
        "lighthouse", "castle", "pyramid", "temple", "church", "stadium", "bridge",
        "skyscraper", "farm"
    ],
    
    "occupations": [
        "doctor", "teacher", "chef", "pilot", "firefighter", "police officer",
        "engineer", "artist", "musician", "athlete", "scientist", "lawyer",
        "nurse", "accountant", "architect", "dentist", "veterinarian", "pharmacist", 
        "writer", "journalist", "photographer", "actor", "dancer", "surgeon", "therapist"
    ],
    
    "sports": [
        "soccer", "basketball", "baseball", "tennis", "swimming", "golf",
        "hockey", "volleyball", "boxing", "skiing", "surfing", "skateboarding",
        "rugby", "cricket", "badminton", "table tennis", "martial arts", "cycling",
        "running", "gymnastics", "wrestling", "fencing", "archery", "bowling",
        "rock climbing", "ice skating", "snowboarding", "lacrosse", "polo", "rowing"
    ],
    
    "films": [
        "Titanic", "Avatar", "The Godfather", "Star Wars", "Jurassic Park",
        "The Lion King", "Frozen", "Spider-Man", "Iron Man", "Batman",
        "The Avengers", "Harry Potter", "Lord of the Rings", "Finding Nemo",
        "Toy Story", "Shrek", "The Matrix", "Forrest Gump", "Inception",
        "Pulp Fiction", "The Dark Knight", "Gladiator", "The Shawshank Redemption",
        "Back to the Future", "E.T.", "Jaws", "Rocky", "Top Gun", "Indiana Jones"
    ],
    
    "video Games": [
        "Minecraft", "Fortnite", "Roblox", "Grand Theft Auto", "Call of Duty",
        "FIFA", "Pokemon", "Mario Kart", "Super Mario", "The Legend of Zelda",
        "Among Us", "League of Legends", "Overwatch", "Valorant", "Apex Legends",
        "Counter-Strike", "Rocket League", "Fall Guys", "Animal Crossing", "Sims",
        "Tetris", "Pac-Man", "Street Fighter", "Mortal Kombat", "Sonic",
        "Donkey Kong", "Halo"
    ],
    
    "Soccer Players": [
        "Lionel Messi", "Cristiano Ronaldo", "Neymar", "Kylian Mbappe", "Erling Haaland",
        "Kevin De Bruyne", "Mohamed Salah", "Robert Lewandowski", "Luka Modric",
        "Karim Benzema", "Vinicius Junior", "Jude Bellingham", "Harry Kane",
        "Ronaldinho", "Zinedine Zidane", "Pele", "Diego Maradona", "David Beckham",
        "Sergio Ramos", "Virgil van Dijk", "Thibaut Courtois", "Manuel Neuer",
        "Paul Pogba", "Eden Hazard", "Luis Suarez", "Gareth Bale", "Andres Iniesta", "Sergio Ramos", 
        "Pepe", "Marco Sau"
    ],
    
    "Historical Events": [
        "World War II", "Moon Landing", "American Revolution",
        "Industrial Revolution", "Great Depression", "9/11 Attacks",
        "Signing of Declaration of Independence", "Discovery of America", "Renaissance",
        "Cold War", "Vietnam War", "Civil Rights Movement",
        "Pearl Harbor", "D-Day", "Titanic Sinking", "First Flight", "Internet Invention",
        "Fall of Roman Empire", "Black Death", "Boston Tea Party",
        "Watergate Scandal", "Chernobyl Disaster", "Charlie Kirk Death"
    ],
    
    "school": [
        "classroom", "homework", "exam", "backpack", "textbook", "pencil",
        "notebook", "ruler", "whiteboard", "chalkboard",
        "desk", "chair", "locker", "cafeteria", "gymnasium", "playground",
        "recess", "detention", "report card", "graduation", "field trip",
        "science lab", "art class", "music class", "PE class", "library", "principal"
    ],
    
    "countries": [
        "United States", "China", "India", "Brazil", "Russia", "Japan",
        "Germany", "United Kingdom", "France", "Italy", "Spain", "Canada",
        "Mexico", "Australia", "South Korea", "Argentina", "Egypt", "Turkey",
        "South Africa", "Saudi Arabia", "Netherlands", "Switzerland", "Sweden",
        "Norway", "Greece", "Portugal", "Thailand", "Vietnam", "Nigeria"
    ],
    
    "brands": [
        "Apple", "Samsung", "Nike", "Adidas", "Coca-Cola", "Pepsi", "McDonald's",
        "Starbucks", "Google", "Amazon", "Microsoft", "Facebook", "Instagram",
        "Twitter", "YouTube", "Netflix", "Spotify", "Disney", "Toyota", "BMW",
        "Mercedes", "Tesla", "IKEA", "Walmart", "Target", "Gucci", "Louis Vuitton",
        "Rolex", "Sony", "Nintendo"
    ],

    "christmas": [
        "Santa Claus", "reindeer", "Christmas tree", "presents", "candy cane",
        "snowman", "gingerbread house", "mistletoe", "Christmas lights", "ornament",
        "stocking", "wreath", "sleigh", "North Pole", "elf", "jingle bells",
        "snow", "hot chocolate", "fireplace", "Christmas carol", "Rudolph",
        "gift wrapping", "Christmas Eve", "nativity scene", "star", "angel",
        "eggnog", "fruitcake", "Christmas cookies", "advent calendar"
    ]
}

def get_random_category_and_word():
    """Returns a random category and word from that category"""
    category = random.choice(list(CATEGORIES.keys()))
    word = random.choice(CATEGORIES[category])
    return category, word

def get_all_categories():
    """Returns list of all available categories"""
    return list(CATEGORIES.keys())

def get_words_from_category(category):
    """Returns all words from a specific category"""
    return CATEGORIES.get(category, [])
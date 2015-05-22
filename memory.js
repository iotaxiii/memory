var memoryImageCardBack = "disneycastle.jpg" 
var memoryImages;

var memoryLastClicked;

var memoryState = 'user';

var memoryMinPairs = 3;
var memoryMaxPairs = 24;

var delay = 1000;

var memorySteps = 0;

function memoryInit() {
  var pairs = parseInt(document.getElementById('paircount').value, 10);

  memoryMinPairs = parseInt(document.getElementById('paircount').getAttribute('min'), 10);
  memoryMaxPairs = parseInt(document.getElementById('paircount').getAttribute('max'), 10);

  var validPairs = /\D/;
  
  while (validPairs.test(pairs) || pairs < memoryMinPairs || pairs > memoryMaxPairs) {
    pairs = prompt('You must enter a number between ' + memoryMinPairs + ' and ' + memoryMaxPairs + '.  How many pairs?');
  }

  var picCategory = document.getElementById('cardpics').value;
  setImages(picCategory);
  
  memorySteps = 0;
  memoryInitPairs(pairs);
}

function memoryInitPairs(pairCount) {
  var cardsLeft = pairCount * 2;
  var cardCountWidth = memoryGetCardCountWidth(pairCount);
  var cardCountRows = Math.floor(cardsLeft/cardCountWidth);
  
  if (cardCountRows > cardCountWidth) {
    var temp = cardCountWidth;
    cardCountWidth = cardCountRows;
    cardCountRows = temp;
  }
  
  var cardWidth = memoryGetCardWidthPx(cardCountWidth)
  var cardHeight = cardWidth*getScreenRatio();

  var cardContainer = document.getElementById('memoryCardsContainer');
  cardContainer.innerHTML = '';
  
  for (var i=0; i < cardCountRows; i++) {
    var cardRow = document.createElement('div');
    cardRow.setAttribute('class', 'cardrow');
    for (var j=0; j < cardCountWidth; j++) {
      var card = document.createElement('img');
      card.setAttribute('id', 'card'+cardsLeft);
      card.setAttribute('class', 'card');
      card.setAttribute('src', memoryImageCardBack);
      card.setAttribute('width', cardWidth);
      card.setAttribute('height', cardHeight);
      cardRow.appendChild(card);
      cardsLeft--;
    }
    cardContainer.appendChild(cardRow);
  }

  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.cssClass { height:' + cardHeight + 'px; }';
  document.getElementsByTagName('head')[0].appendChild(style);
  
  memoryAssignCards(pairCount*2);
}

//get the multiples of the card count nearest to the square root of the card count
function memoryGetCardCountWidth(pairCount) {
  var cardCount = pairCount * 2;
  var temp = Math.round(Math.sqrt(cardCount));
  var found = ((cardCount % temp) == 0);
  
  var down = temp - 1;
  var up = temp + 1;
  
  while (!found) {
    if ((cardCount % up) == 0)
      temp = up;
    else if ((cardCount % down) == 0)
      temp = down;
      
    up--;
    down--;
    
    found = ((cardCount % temp) == 0);
  }

  return temp;
}

function memoryAssignCards(cardCount) {
  var temp = [];
  for (var i = 0; i < cardCount/2; i++) {
    temp[i] = memoryImages[i];
    temp[cardCount-i-1] = memoryImages[i];
  }
  
  for (var i = 0; i < cardCount; i++) {
    var imageFound = false;
    
    while (!imageFound) {
      var index = Math.floor(Math.random() * cardCount);
      if (temp[index] != '') {
        imageFound = true;
      }
    }
    
    if (document.addEventListener) {
      document.getElementById('card' + (i+1)).addEventListener('click', memoryClickCard, false);
    } else {
      document.getElementById('card' + (i+1)).attachEvent('onclick', memoryClickCard);
    }
    
    document.getElementById('card' + (i+1)).setAttribute("image", temp[index]);
    temp[index] = '';
    imageFound = false;
  }
}

function memoryClickCard(e) {
  if (!e) var e = window.event;
  e = e.srcElement;

  if (memoryState == 'user') {
    memoryFlipCard(e.getAttribute('id'));
  
    if (memoryLastClicked) {
      memorySwitchState();
      memoryIncrementSteps();
      setTimeout('memorySwitchState()', delay);
      if (memoryIsMatch(e)) {
        setTimeout('memoryCloseMatch(' + e.getAttribute('id') + ', memoryLastClicked)', delay);
      } else {
        setTimeout('memoryFlipCardBack(' + e.getAttribute("id") + ')', delay);
        setTimeout('memoryFlipCardBack(' + memoryLastClicked.getAttribute('id') + ')', delay);
        memoryLastClicked = undefined;
      }
    } else {
      memoryLastClicked = e;  
    }
  }
}

function memoryIncrementSteps() {
  memorySteps++;
  document.getElementById('memoryCounter').innerHTML = memorySteps + " steps.";
}

function memorySwitchState() {
  if (memoryState == 'user') {
    memoryState = 'wait';
  } else {
    memoryState = 'user';
  }
}

function memoryIsMatch(e) {
  if (!e) var e = window.event;
  
  var newClickedImage = e.getAttribute('image');
  var oldClickedImage = memoryLastClicked.getAttribute('image');

  if (newClickedImage == oldClickedImage && e != memoryLastClicked) {
    return true;
  } else {
    return false;
  }
}

function memoryCloseMatch(card1, card2) {
  card1.style.visibility = 'hidden';
  card2.style.visibility = 'hidden';
  memoryLastClicked = undefined;
}

function memoryFlipCard(id) {
  memorySetSrc(id, document.getElementById(id).getAttribute('image'));
}

function memoryFlipCardBack(object) {
  memorySetSrc(object.getAttribute('id'), memoryImageCardBack);
}

function memorySetSrc(id, src) {
  var element = document.getElementById(id);
  element.setAttribute('src', src);
}

function memoryGetCardWidthPx(cardCountWidth) {
  if (window.innerWidth)
    var temp = window.innerWidth;
  else
    var temp = document.body.clientWidth;
  
  temp = Math.floor((temp-20)/(cardCountWidth));
  
  //temp = temp / 2;
  
  return temp-12;
}

function getScreenRatio() {
  var width, height;
  if (window.innerWidth) {
    width = window.innerWidth;
    height = window.innerHeight;
  } else {
    width = document.body.clientWidth;
    height = document.body.clientHeight;
  }
  
  return height/width;  
}

function setImages(input) {
  switch(input) {
    case 'fairies':
        memoryImages = fairyImages;
        break;
    case 'frozen':
        memoryImages = frozenImages;
        break;
    case 'shapes':
        memoryImages = shapeImages;
        break;
    default:
        memoryImages = frozenImages;
  }   
}

var shapeDir = "shapes/";
var shapeImages = [
  shapeDir + "red circle.png",
  shapeDir + "blue circle.png",
  shapeDir + "green circle.png",
  shapeDir + "yellow circle.png",
  shapeDir + "orange circle.png",
  shapeDir + "purple circle.png",
  shapeDir + "pink circle.png",
  shapeDir + "black circle.png",
  shapeDir + "red square.png",
  shapeDir + "blue square.png",
  shapeDir + "green square.png",
  shapeDir + "yellow square.png",
  shapeDir + "orange square.png",
  shapeDir + "purple square.png",
  shapeDir + "pink square.png",
  shapeDir + "black square.png",
  shapeDir + "red diamond.png",
  shapeDir + "blue diamond.png",
  shapeDir + "green diamond.png",
  shapeDir + "yellow diamond.png",
  shapeDir + "orange diamond.png",
  shapeDir + "purple diamond.png",
  shapeDir + "pink diamond.png",
  shapeDir + "black diamond.png",
];

var frozenDir = "frozen/";
var frozenImages = [
  frozenDir + "anna.jpg",
  frozenDir + "annachristoff.jpg",
  frozenDir + "annaelsa.jpg",
  frozenDir + "christoff.jpg",
  frozenDir + "christoff2.jpg",
  frozenDir + "christoffsven.png",
  frozenDir + "duke.jpg",
  frozenDir + "dukeguards.jpg",
  frozenDir + "elsachildpowers.jpg",
  frozenDir + "elsaicecastle.jpg",
  frozenDir + "elsapower.jpg",
  frozenDir + "elsapower2.jpg",
  frozenDir + "elsasnowflake.jpg",
  frozenDir + "groupolafcenter.jpg",
  frozenDir + "marshmallow.jpg",
  frozenDir + "marshmallow2.jpg",
  frozenDir + "hans.jpg",
  frozenDir + "hanshorse.jpg",
  frozenDir + "hanshorse2.jpg",
  frozenDir + "olaf.jpg",
  frozenDir + "olafflower.jpg",
  frozenDir + "olafsummer.jpg",
  frozenDir + "protagonists.jpg",
  frozenDir + "sisterschristoffsvenolaf.jpg",
  frozenDir + "sistersheart.jpg",
  frozenDir + "sven.jpg",
  frozenDir + "sven2.jpg",
  frozenDir + "trolls.jpg"
];

var fairyDir = "fairies/";
var fairyImages = [
  fairyDir + "fawn.jpg",
  fairyDir + "fawnbirds.jpg",
  fairyDir + "fivefairies.jpg",
  fairyDir + "gruff.jpg",
  fairyDir + "grufffairies.jpg",
  fairyDir + "iridessa.jpg",
  fairyDir + "iridessa2.jpg",
  fairyDir + "nyx.jpg",
  fairyDir + "nyxfaun.jpg",
  fairyDir + "periwinkle.jpg",
  fairyDir + "queen.jpg",
  fairyDir + "queentink.jpg",
  fairyDir + "rosetta.jpg",
  fairyDir + "rosetta2.jpg",
  fairyDir + "rotgfairy.jpg",
  fairyDir + "rotgfairy2.jpg",
  fairyDir + "rotgfairy3.jpg",
  fairyDir + "silvermist.jpg",
  fairyDir + "tinkerbell.jpg",
  fairyDir + "tinkerbell2.jpg",
  fairyDir + "tinkerbellfriendssnow.jpg",
  fairyDir + "tinkerbellpiratefairy.jpg",
  fairyDir + "tinkerbellsilvermist.png",
  fairyDir + "tinkperiwhistle.jpg",
  fairyDir + "tinkperiwings.jpg",
  fairyDir + "tinkvidia.jpg",
  fairyDir + "vidia.jpg",
  fairyDir + "zarina.jpg"
];
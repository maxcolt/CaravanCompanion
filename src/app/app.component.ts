import { Component } from '@angular/core';

class playedCard{
    value: string;
    suit: string;
    location: string;
    attachments: playedCard[];

    public constructor(value: string, suit: string, location: string){
      this.value = value;
      this.suit = suit;
      this.location = location;
      this.attachments = [];
    }

    getNumericalValue(): number{
      if(this.value == "A")
        return 1;
      else{
        return parseInt(this.value);
      }
    }

    getDisplay()
    {
      let display: string = this.value + this.suit;
      for(let card in this.attachments)
      {
        display += this.attachments[card].getDisplay();
      }
      
      return display;
    }

    getPoints(): number{
      const notNumbers: string = "AJQK";
      let score: number = 0;
      if(notNumbers.indexOf(this.value) < 0)
        score = parseInt(this.value);
      else if(this.value == "A")
        score = 1;
      for(let card in this.attachments){
        if(this.attachments[card].value == 'K')
          score *= 2;
      }

      return score;
    }

    attachFaceCard(value: string, suit: string, location: string, faceCards: string){
      for(let card in this.attachments){
        if(this.attachments[card].value == value && this.attachments[card].suit == suit)
          return;
      }
      if(faceCards.indexOf(value) >= 0)
      {
        this.attachments.push(new playedCard(value, suit, location));
      }
        
    }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'caravancompanion';
  lastKey : string = "";
  lastSuit: string = "";

  

  truckScore: number = 0;

  trainScore: number = 0;

  boatScore: number = 0;
 
  playedCards: playedCard[] = [];
  faceCards: string = "JQK";


  pressKey(key: string)
  { 
    this.lastKey = key ;
    this.lastSuit = "";
  }
  pressSuit(suit: string)
  {
    this.lastSuit = suit
  }
  pressJoker(){
    if(this.lastKey != "" && this.lastSuit != "" && this.faceCards.indexOf(this.lastKey) < 0){
      let toRemove: playedCard[] = [];
      if(this.lastKey == "A"){
        for(let card in this.playedCards){
          if(this.playedCards[card].suit == this.lastSuit && !(this.playedCards[card].suit == this.lastSuit && this.playedCards[card].value == this.lastKey))
            toRemove.push(this.playedCards[card]);
        }
      }
      else{
        for(let card in this.playedCards){
          if(this.playedCards[card].value == this.lastKey && !(this.playedCards[card].suit == this.lastSuit && this.playedCards[card].value == this.lastKey))
            toRemove.push(this.playedCards[card]);
        }
      }
      for(let card in toRemove){
        this.removeCard(toRemove[card]);
      }
      this.clear();
    }
  }

  calculateScore(){
    this.truckScore = 0;
    this.trainScore = 0;
    this.boatScore = 0;
    for(let card in this.playedCards){
      if(this.playedCards[card].location == 'C'){
        this.truckScore += this.playedCards[card].getPoints();
      }
      else if(this.playedCards[card].location == 'T'){
        this.trainScore += this.playedCards[card].getPoints();
      }
      else if(this.playedCards[card].location == 'B'){
        this.boatScore += this.playedCards[card].getPoints();
      }
    }
  }

  scoreIndicator(caravan: string): string{
    let score: number = 0;
    if(caravan == 'C')
      score = this.truckScore;
    else if(caravan == 'T')
      score = this.trainScore;
    else if(caravan == 'B')
      score = this.boatScore;
    
    if(score < 21)
      return "🔺";
    else if(score > 26)
      return "🔻";
    else
      return "✅";
  }


  addCard(caravan: string){
    if(this.faceCards.indexOf(this.lastKey) < 0){
      for(let card in this.playedCards){
        if(this.playedCards[card].value == this.lastKey && this.playedCards[card].suit == this.lastSuit){
          this.clear();
          return;
        }
      }
      let lastKeyNum: number = this.lastKey == "A" ? 1 : parseInt(this.lastKey);
      let caravanCards = this.getCaravanCards(caravan);
      if((this.getSymbol(caravan) == "➕")
      || (this.getSymbol(caravan) == "↕️" && this.lastKey != caravanCards[caravanCards.length - 1].value)
      || (this.getSymbol(caravan) == "⬆️" && lastKeyNum > caravanCards[caravanCards.length - 1].getNumericalValue())
      || (this.getSymbol(caravan) == "⬇️" && lastKeyNum < caravanCards[caravanCards.length - 1].getNumericalValue())
      || (this.lastSuit == caravanCards[caravanCards.length - 1].suit))
      {
        if((this.lastKey != "" && this.lastSuit != "")){
          let card: playedCard = new playedCard(this.lastKey, this.lastSuit, caravan);
          this.playedCards.push(card);
          this.calculateScore();
        }
      }
      this.clear();
    }
    console.log(this.playedCards);
  }

  removeCard(card: playedCard){
    this.playedCards.splice(this.playedCards.indexOf(card), 1)
    this.calculateScore();
  }


  getCaravanCards(caravan: string){
    let caravanCards: playedCard[] = [];
    for(let card in this.playedCards){
      if(this.playedCards[card].location.slice(0, 1) == caravan){
        caravanCards.push(this.playedCards[card]);
      }
    }
    return caravanCards;
  }

  getSymbol(caravan: string): string{
    let caravanCards: playedCard[] = this.getCaravanCards(caravan);
    if(caravanCards.length == 0){
      return "➕";
    }
    else if(caravanCards.length == 1){
      return "↕️";
    }
    else if(caravanCards.length > 1){
      if(caravanCards[caravanCards.length - 1].getNumericalValue() > caravanCards[caravanCards.length - 2].getNumericalValue()){
        return "⬆️";
      }
      else if(caravanCards[caravanCards.length - 1].getNumericalValue() < caravanCards[caravanCards.length - 2].getNumericalValue()){
        return "⬇️";
      }
      else{
        return "?";
      }
    }
    else{
      return "?";
    }
    
  }

  undo()
  {
    this.playedCards.pop();
    this.calculateScore();
  }

  clear()
  {
    this.lastKey = "";
    this.lastSuit = "";
  }
}

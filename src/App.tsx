import { useState } from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  app: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  button: { margin: 16 },
  card: { border: '1px solid black', margin: 8, padding: 4, paddingTop: 8, paddingBottom: 8, borderRadius: 3 },
  cards: { display: 'flex', flexDirection: 'row' },
})

interface ICard {
  suit: string
  value: string
}

// h = hjerte, s = spar, r = ruter, k = kløver
const cardSuits = ['h', 's', 'r', 'k']
const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'kn', 'd', 'k', 'js']
const sequentialValues = cardValues.join('')

const deck: ICard[] = []

cardSuits.map((suit) => {
  cardValues.map((value) => {
    deck.push({ value: value, suit: suit })
  })
})

const getRandomCards = () => {
  const tempDeck = [...deck]
  const fiveCards: ICard[] = []

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * tempDeck.length)
    fiveCards.push(tempDeck[randomIndex])
    tempDeck.splice(randomIndex, 1)
  }

  return fiveCards
}

const cardsInSequence = (hand: ICard[]) => {
  const values = hand.map((card) => card.value)
  const pictureCards = cardValues.slice(9)
  const uniqueSuits = Array.from(new Set(hand.map((card) => card.suit)))

  const pictureCardsInHand = pictureCards.filter((value) => {
    if (values.includes(value)) {
      values.splice(values.indexOf(value), 1)
      return value
    }
  })
  const sortedCards = [...values.sort(), ...pictureCardsInHand].join('')

  if (!sequentialValues.includes(sortedCards)) {
    return 'High card'
  }
  return uniqueSuits.length === 1 ? 'Straight Flush' : 'Straight'
}

const findSameCards = (hand: ICard[]) => {
  const handValues = hand.map((card) => card.value).sort()
  const valueCounts: { value: string; count: number }[] = []

  handValues.map((card, index) => {
    const currentValueCount = valueCounts.find((valueCount) => valueCount.value === card)
    if (currentValueCount) {
      currentValueCount.count += 1
    } else {
      valueCounts.push({ value: card, count: 1 })
    }
  })

  return valueCounts
}

const analyzeHand = (hand: ICard[]) => {
  const sameCards = findSameCards(hand)
  const sameCardsCounts = sameCards.map((count) => count.count).sort()

  switch (sameCards.length) {
    //case 1: Only 4 cards of each rank so this case will never happen

    case 2:
      if (sameCardsCounts[0] === 2) {
        // if samecardscounts === [2,3] "then full house"
        return 'Full House'
      }
      // if [1,4] and one of them is a wild card thn it is five of a kind, but
      // since we don't have a joker and no specific wild cards:
      // if [1,4] then "four of a kind"
      return 'Four of a kind'
    case 3:
      if (sameCardsCounts[1] === 1) {
        //if [1,1,3] then "three of a kind"
        return 'Three of a kind'
      }
      // if [1,2,2] then "two pair"
      return 'Two pair'
    case 4:
      // if [1,1,1,2] then "one pair"
      return 'One pair'
    case 5:
      //if [1,1,1,1,1] and values not in sequence, then "high card"
      //if they are in sequence, then check if they are in the same suit
      // if they are in the same suit, then "straight flush", otherwise "straight"
      return cardsInSequence(hand)

    default:
      break
  }
}

export const App = () => {
  const classes = useStyles()

  const [newHand, setNewHand] = useState(getRandomCards())

  return (
    <div className={classes.app}>
      <h1>Poker Hand Aanalyzer</h1>
      <h2 className={classes.cards}>
        {newHand.map((hand, index) => (
          <div key={index} className={classes.card}>
            {hand.value + hand.suit}
          </div>
        ))}
      </h2>
      <div>{analyzeHand(newHand)}</div>
      <div className={classes.button}>
        <button onClick={() => setNewHand(getRandomCards())}>New Hand</button>
      </div>
    </div>
  )
}

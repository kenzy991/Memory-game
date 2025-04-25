import { useState, useEffect, useRef } from "react";
import Cards from "./Cards";
import SingleCard from "./SingleCard";

function GameController() {
  const [cardsState, setCardsState] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null); 

  const initializeGame = () => {
    let duplicated = [...Cards, ...Cards].map((card, index) => ({
      ...card,
      id: index,
      isFlipped: false,
      passed: false,
    }));

    setCardsState(shuffleCards(duplicated));
    setFirstCard(null);
    setSecondCard(null);
    setFlipped(false);
    setMoves(0);
    setTime(0);
    setIsGameOver(false);

    clearInterval(timerRef.current); 
    timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
  };

  const shuffleCards = (cards) => {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  };

  const flipCard = (card) => {
    if (flipped || card === firstCard || card.isFlipped || card.passed) return;

    const updatedCards = cardsState.map((e) =>
      e.id === card.id ? { ...e, isFlipped: true } : e
    );
    setCardsState(updatedCards);

    if (!firstCard) {
      setFirstCard(card);
    } else {
      setSecondCard(card);
      setFlipped(true);
      setTimeout(() => {
        checkMatch(card);
      }, 800);
    }
  };

  const checkMatch = (secondCardParam) => {
    setMoves((prev) => prev + 1);

    if (firstCard.name === secondCardParam.name) {
      setCardsState((prevCards) =>
        prevCards.map((card) =>
          card.name === firstCard.name ? { ...card, passed: true } : card
        )
      );
    } 
    else {
      setCardsState((prevCards) =>prevCards.map((card) =>card.id === firstCard.id || card.id === secondCardParam.id? 
      { ...card, isFlipped: false }: card
        )
      );
    }

    setFirstCard(null);
    setSecondCard(null);
    setFlipped(false);
  };

  useEffect(() => {
    if (cardsState.length > 0 && cardsState.every((card) => card.passed)) {
      clearInterval(timerRef.current);
      setIsGameOver(true);
    }
  }, [cardsState]);

  const restartGame = () => {
    clearInterval(timerRef.current); 
    initializeGame();
  };

  useEffect(() => {
    initializeGame();
    return () => clearInterval(timerRef.current); 
  }, []);

  return (
    <div className="h-[98%] rounded-2xl border-blue-50 bg-black flex flex-col items-center justify-center p-6">
      <div className="bg-purple-400 text-white rounded-2xl p-4 w-full text-center mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">MATCH CARDS</h1>
        <div className="flex justify-between items-center text-black font-semibold text-xl">
          <p>Moves: {moves}</p>
          <p>Time: {time}s</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cardsState.map((card) => (
          <SingleCard key={card.id} card={card} flipCard={() => flipCard(card)} />
        ))}
      </div>

      {isGameOver && (
        <div className="bg-black text-purple-400 mt-8 p-4 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2"> You win!</h2>
        </div>
      )}

      <button onClick={restartGame} className="mt-4 px-6 py-2 bg-purple-400 text-black rounded-xl font-semibold hover:bg-purple-500 transition" > New Game</button>
    </div>
  );
}

export default GameController;

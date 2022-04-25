import axios from "axios";
import React, { useState, useContext, useEffect } from "react";

// categories with values from api
const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const url =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";
// const tempUrl =
//   "https://opentdb.com/api.php?amount=4&category=21&difficulty=easy&type=multiple";
// const tempUrl =
//   "https://opentdb.com/api.php?amount=50&category=24&difficulty=medium";  // test zero results

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true); // display setup form
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0); // each question
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // display results after quiz

  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);
    const response = await axios(url).catch((err) => console.log(err));
    if (response) {
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setWaiting(false);
        setError(false); // wipe previous error
      } else {
        setWaiting(true); // display setup form
        // setLoading(false); // may need to add to change
        setError(true);
      }
    } else {
      setWaiting(true); // display setup form
    }
  };

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      if (index > questions.length - 1) {
        openModal();
        return 0;
      } else {
        return index;
      }
    });
  };

  // __Check Answer__ Clicked answer (one attempt) will immediately be checked and moved to next question
  const checkAnswer = (value) => {
    if (value) {
      setCorrect((oldState) => oldState + 1);
    }
    nextQuestion();
  };

  // __Modal__
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setWaiting(true); // display setup form to play again
    setCorrect(0);
    setIsModalOpen(false);
  };

  // __Setup Form__
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({ ...quiz, [name]: value });
  };

  // __Setup Query and Fetch__
  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    fetchQuestions(url);
  };

  /* Only used for initial setup
  useEffect(() => {
    fetchQuestions(tempUrl);
  }, []);
  */

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };

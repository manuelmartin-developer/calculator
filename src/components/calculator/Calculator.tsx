import { useEffect, useState } from "react";
import "./Calculator.scss";
import useWindowSize from "../../hooks/useWindowSize";
import ConfettiExplosion from "react-confetti-explosion";
import { set } from "adminjs/types/src/utils/flat/set";

const Calculator = () => {
  // Constants
  const { width } = useWindowSize();
  const operators = ["+", "-", "*", "/"];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Component states
  const [displayFontSize, setDisplayFontSize] = useState(6);
  const [currentNumber, setCurrentNumber] = useState("0");
  const [previousNumber, setPreviousNumber] = useState("0");
  const [operator, setOperator] = useState("");
  const [isTimeForParty, setIsTimeForParty] = useState(false);
  const [isASadParty, setIsASadParty] = useState(false);

  // Helper functions
  const handleNumber = (value: string) => {
    if (currentNumber === "0") {
      setCurrentNumber(value);
    } else {
      setCurrentNumber(currentNumber + value);
    }
  };

  const handleOperator = (value: string) => {
    if (operator) {
      setOperator(value);
      return;
    }

    setOperator(value);
    setPreviousNumber(currentNumber);
    setCurrentNumber("0");
  };

  const handleEqual = () => {
    const current = Number(currentNumber);
    const previous = Number(previousNumber);

    switch (operator) {
      case "+":
        setCurrentNumber((previous + current).toString());
        setIsTimeForParty(true);
        break;
      case "-":
        setCurrentNumber((previous - current).toString());
        setIsTimeForParty(true);
        break;
      case "*":
        setCurrentNumber((previous * current).toString());
        setIsTimeForParty(true);
        break;
      case "/":
        if (current === 0) {
          setIsASadParty(true);
          setIsTimeForParty(true);
          setCurrentNumber(":(");
          setOperator("");
          setPreviousNumber("0");
          return;
        }
        setCurrentNumber((previous / current).toString());
        break;
      default:
        break;
    }
    setOperator("");
    setPreviousNumber("0");
  };

  const handleClear = () => {
    setCurrentNumber("0");
    setPreviousNumber("0");
    setOperator("");
  };

  const handleToggleSign = () => {
    if (currentNumber === "0") {
      return;
    }

    if (currentNumber[0] === "-") {
      setCurrentNumber(currentNumber.substring(1));
    } else {
      setCurrentNumber("-" + currentNumber);
    }
  };

  const handleDecimal = () => {
    if (currentNumber.includes(".")) {
      return;
    }

    setCurrentNumber(currentNumber + ".");
  };

  const handleBackspace = () => {
    if (currentNumber.length === 1) {
      setCurrentNumber("0");
    } else {
      setCurrentNumber(currentNumber.substring(0, currentNumber.length - 1));
    }
  };

  useEffect(() => {
    if (!width) return;
    // Calculate by trial and error
    // This looks good on my 1920x1080 monitor
    const constantBasedOnWidth =
      width < 500 ? 13 : width >= 500 && width < 1800 ? 6 : 5;

    setDisplayFontSize(constantBasedOnWidth - currentNumber.length * 0.22);
  }, [currentNumber, width]);

  return (
    <div className="calculator">
      <div
        className="calculator_display"
        style={{ fontSize: `${displayFontSize}vw` }}
      >
        <span>{currentNumber}</span>
      </div>
      <div className="calculator_keypad">
        <div className="input_keys">
          <div className="function_keys">
            <button className="calculator_key" onClick={handleClear}>
              AC
            </button>
            <button className="calculator_key" onClick={handleToggleSign}>
              ±
            </button>
            <button className="calculator_key" onClick={handleBackspace}>
              ⌫
            </button>
          </div>
          <div className="digit_keys">
            {numbers.reverse().map((number) => (
              <button
                className={`calculator_key key-${number}`}
                key={number}
                onClick={() => handleNumber(number.toString())}
              >
                {number}
              </button>
            ))}
            <button
              style={{ visibility: "hidden", pointerEvents: "none" }}
            ></button>
            <button
              className="calculator_key key-decimal"
              onClick={handleDecimal}
            >
              .
            </button>
          </div>
        </div>
        <div className="operator_keys">
          {operators.map((operator) => (
            <button
              className={`calculator_key key-${operator}`}
              key={operator}
              onClick={() => handleOperator(operator)}
            >
              {operator}
            </button>
          ))}
          <button className="calculator_key key-equal" onClick={handleEqual}>
            =
          </button>
          {isTimeForParty && (
            <ConfettiExplosion
              onComplete={() => {
                setIsTimeForParty(false);
                setIsTimeForParty(false);
              }}
              duration={3000}
              colors={
                !isASadParty
                  ? ["#808080", "#A9A9A9", "#C0C0C0", "#D3D3D3", "#DCDCDC"]
                  : [
                      "#FF0000",
                      "#FF7F00",
                      "#FFFF00",
                      "#00FF00",
                      "#0000FF",
                      "#4B0082"
                    ]
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;

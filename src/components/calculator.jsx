import React, { useState, lazy, Suspense } from 'react';
import 'tailwindcss/tailwind.css';

const ConfettiExplosion = lazy(() => import('react-confetti-explosion'));

const Button = ({ label, onClick, className }) => (
  <button
    onClick={() => onClick(label)}
    className={`w-13 h-12 p-2 text-lg font-bold text-white bg-gray-800 rounded ${className}`}
  >
    {label}
  </button>
);

const Display = ({ input, result }) => (
  <div className="relative p-4 mb-2 text-2xl text-right text-white bg-gray-700 rounded">
    <div className="absolute top-0 left-0 flex items-center">
      <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
    </div>
    <div>{input}</div>
    <div className="text-3xl">{result}</div>
  </div>
);

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [memory, setMemory] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [degMode, setDegMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleButtonClick = (label) => {
    if (!isNaN(label) || label === '.') {
      setInput(prev => prev + label);
    } else {
      switch (label) {
        case 'C':
          setInput('');
          setResult(null);
          setHistory([]);
          break;
        case '±':
          setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
          break;
        case '%':
          setInput(prev => (parseFloat(prev) / 100).toString());
          break;
        case '÷':
        case '×':
        case '−':
        case '+':
        case '(':
        case ')':
          setInput(prev => prev + label);
          break;
        case '=':
          try {
            const evalResult = eval(input.replace('×', '*').replace('÷', '/').replace('−', '-'));
            setResult(evalResult);
            setHistory(prev => [...prev, { input, result: evalResult }]);
            setInput(evalResult.toString());
          } catch (e) {
            setResult('Error');
          }
          break;
        case 'mc':
          setMemory(null);
          break;
        case 'mr':
          setInput(memory ?? '');
          break;
        case 'm+':
          setMemory(prev => (prev ? prev + parseFloat(input) : parseFloat(input)));
          break;
        case 'm-':
          setMemory(prev => (prev ? prev - parseFloat(input) : -parseFloat(input)));
          break;
        case 'x²':
          setInput(prev => (parseFloat(prev) ** 2).toString());
          break;
        case 'x³':
          setInput(prev => (parseFloat(prev) ** 3).toString());
          break;
        case 'x^':
          setInput(prev => prev + '**');
          break;
        case 'eˣ':
          setInput(prev => (Math.exp(parseFloat(prev))).toString());
          break;
        case '10ˣ':
          setInput(prev => (10 ** parseFloat(prev)).toString());
          break;
        case '1/x':
          setInput(prev => (1 / parseFloat(prev)).toString());
          break;
        case '√x':
          setInput(prev => (Math.sqrt(parseFloat(prev))).toString());
          break;
        case '∛x':
          setInput(prev => (Math.cbrt(parseFloat(prev))).toString());
          break;
        case 'y√x':
          setInput(prev => prev + '**(1/');
          break;
        case 'ln':
          setInput(prev => (Math.log(parseFloat(prev))).toString());
          break;
        case 'log₁₀':
          setInput(prev => (Math.log10(parseFloat(prev))).toString());
          break;
        case 'x!':
          setInput(prev => (factorial(parseFloat(prev))).toString());
          break;
        case 'sin':
          setInput(prev => (degMode ? Math.sin(toRadians(parseFloat(prev))) : Math.sin(parseFloat(prev))).toString());
          break;
        case 'cos':
          setInput(prev => (degMode ? Math.cos(toRadians(parseFloat(prev))) : Math.cos(parseFloat(prev))).toString());
          break;
        case 'tan':
          setInput(prev => (degMode ? Math.tan(toRadians(parseFloat(prev))) : Math.tan(parseFloat(prev))).toString());
          break;
        case 'π':
          setInput(prev => prev + Math.PI);
          break;
        case 'e':
          setInput(prev => prev + Math.E);
          break;
        case 'Rand':
          setInput(prev => Math.random().toString());
          break;
        case 'Rad':
          setDegMode(!degMode);
          break;
        case 'sinh':
          setInput((prev) => Math.sinh(parseFloat(prev)).toString());
          break;
        case 'cosh':
          setInput((prev) => Math.cosh(parseFloat(prev)).toString());
          break;
        case 'tanh':
          setInput((prev) => Math.tanh(parseFloat(prev)).toString());
          break;
        default:
          break;
      }
    }

    if ((label === '6' && input.includes('5')) || (label === '5' && input.includes('6'))) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  };

  const toRadians = (deg) => (deg * Math.PI) / 180;

  const factorial = (n) => {
    if (n < 0) return 'Error';
    return n ? n * factorial(n - 1) : 1;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <button onClick={toggleTheme} className="absolute top-1 right-4 p-2 rounded-full bg-gray-800">{theme === 'light' ? '🌙' : '☀️'}</button>
        {confetti && (
          <Suspense fallback={<div>Loading...</div>}>
            <ConfettiExplosion />
          </Suspense>
        )}
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg max-w-2xl mx-auto h-full">
          <Display input={input} result={result} />
          <div className="grid grid-cols-10 gap-0.5">
            <Button label="(" onClick={handleButtonClick} />
            <Button label=")" onClick={handleButtonClick} />
            <Button label="mc" onClick={handleButtonClick} />
            <Button label="m+" onClick={handleButtonClick} />
            <Button label="m-" onClick={handleButtonClick} />
            <Button label="mr" onClick={handleButtonClick} />
            <Button label="C" onClick={handleButtonClick} />
            <Button label="±" onClick={handleButtonClick} />
            <Button label="%" onClick={handleButtonClick} />
            <Button label="÷" onClick={handleButtonClick} className="bg-yellow-600" />
            <Button label="2ⁿᵈ" onClick={handleButtonClick} />
            <Button label="x²" onClick={handleButtonClick} />
            <Button label="x³" onClick={handleButtonClick} />
            <Button label="x^" onClick={handleButtonClick} />
            <Button label="eˣ" onClick={handleButtonClick} />
            <Button label="10ˣ" onClick={handleButtonClick} />
            <Button label="7" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="8" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="9" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="×" onClick={handleButtonClick} className="bg-yellow-600" />
            <Button label="1/x" onClick={handleButtonClick} />
            <Button label="√x" onClick={handleButtonClick} />
            <Button label="∛x" onClick={handleButtonClick} />
            <Button label="y√x" onClick={handleButtonClick} />
            <Button label="ln" onClick={handleButtonClick} />
            <Button label="log₁₀" onClick={handleButtonClick} />
            <Button label="4" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="5" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="6" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="−" onClick={handleButtonClick} className="bg-yellow-600" />
            <Button label="x!" onClick={handleButtonClick} />
            <Button label="sin" onClick={handleButtonClick} />
            <Button label="cos" onClick={handleButtonClick} />
            <Button label="tan" onClick={handleButtonClick} />
            <Button label="e" onClick={handleButtonClick} />
            <Button label="EE" onClick={handleButtonClick} />
            <Button label="1" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="2" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="3" onClick={handleButtonClick} className="bg-gray-600 text-black" />
            <Button label="+" onClick={handleButtonClick} className="bg-yellow-600" />
            <Button label="Rad" onClick={handleButtonClick} />
            <Button label="sinh" onClick={handleButtonClick} />
            <Button label="cosh" onClick={handleButtonClick} />
            <Button label="tanh" onClick={handleButtonClick} />
            <Button label="π" onClick={handleButtonClick} />
            <Button label="Rand" onClick={handleButtonClick} />
            <Button label="0" onClick={handleButtonClick} className="col-span-2 bg-gray-600 text-black" />
            <Button label="." onClick={handleButtonClick} className="bg-gray-600" />
            <Button label="=" onClick={handleButtonClick} className="bg-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
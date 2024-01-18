import React, { useState } from "react";
import python from "./Assets/python.png";
import java from "./Assets/java.png";
import cpp from "./Assets/c-.png";
import clang from "./Assets/c-program-icon.png";
import javascript from "./Assets/js.png";
import "./App.css";
import applogo from "./Assets/codecraft.png";

import CodeMirror from "@uiw/react-codemirror";

import { vscodeDarkInit } from "@uiw/codemirror-theme-vscode";

function App() {
  const [languagedata] = useState({
    option1: [python, "python", "py"],
    option2: [java, "java", "java"],
    option3: [cpp, "cpp", "cpp"],
    option4: [clang, "c", "c"],
    option5: [javascript, "javascript", "js"],
  });

  const [selectedOption, setSelectedOption] = useState("option1");
  const [userLang, setUserLang] = useState("python");
  const [userCode, setUserCode] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [extension, setExtension] = useState("py");
  const [userInput, setUserInput] = useState(""); // Add new state for user input

  const handleSelectChange = (event) => {
    const selectedKey = event.target.value;
    setUserLang(languagedata[selectedKey][1]);
    setExtension(languagedata[selectedKey][2]);
    setSelectedOption(selectedKey);
    setUserCode(helloWorldPrograms[languagedata[selectedKey][1]]);
    console.log(`Selected Language: ${languagedata[selectedKey][1]}`);
    console.log(`Selected Extension: ${languagedata[selectedKey][2]}`);
  };

  const helloWorldPrograms = {
    python: 'print("Hello, World!")',
    java: 'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }',
    cpp: '#include <iostream>\nint main() { std::cout << "Hello, World!" << std::endl; return 0; }',
    c: '#include <stdio.h>\nint main() { printf("Hello, World!\\n"); return 0; }',
    javascript: 'console.log("Hello, World!");',
  };

  // Function to call the compile endpoint
  async function compile() {
    const replacedCode = userCode;
    const inputValues = userInput.split(/[,\s]+/); // Split input by commas or spaces

    const url = "https://onecompiler-apis.p.rapidapi.com/api/v1/run";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "221532c986msh72be4f288cb3473p1e92a7jsncfdb9fe37cab",
        "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
      },
      body: JSON.stringify({
        language: userLang,
        stdin: inputValues.join("\n"), // Convert input array to newline-separated string
        files: [
          {
            name: `index.${extension}`,
            content: replacedCode,
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const resp = JSON.parse(result);
      setUserOutput(resp.stdout);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to clear the output screen
  function clearOutput() {
    setUserOutput("");
  }

  return (
    <div className="maindiv">
      <div className="headermaindiv">
        <img src={applogo} alt="applogo" />
      </div>
      <div className="iconsmaindiv">
        {Object.keys(languagedata).map((key) => (
          <div
            key={key}
            className="icondiv"
            onClick={() => {
              setUserLang(languagedata[key][1]);
              setExtension(languagedata[key][2]);
              setUserCode(helloWorldPrograms[languagedata[key][1]]);
              setSelectedOption(key);
            }}
          >
            <img src={languagedata[key][0]} alt={key} />
          </div>
        ))}
        <div className="icondropdown">
          <div>
            <img src={languagedata[selectedOption][0]} alt={selectedOption} />
          </div>
          <select value={selectedOption} onChange={handleSelectChange}>
            {Object.keys(languagedata).map((key) => (
              <option key={key} value={key}>
                {languagedata[key][1]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ideandshellmaindiv">
        <div className="shell">
          <div className="editor">
            <CodeMirror
              height="70vh"
              width="auto"
              theme={vscodeDarkInit({
                settings: {
                  caret: "#c6c6c6",
                  fontFamily: "monospace",
                },
              })}
              language={userLang}
              defaultLanguage="python"
              value={userCode}
              onChange={(value) => {
                setUserCode(value);
              }}
            />
          </div>

          <div className="input-area">
            <label htmlFor="userInput">User Input:</label>
            <textarea
              id="userInput"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter input values separated by commas or spaces..."
            />

            <div className="runbtn">
              <button onClick={() => compile()} className="run-btn">
                Run
              </button>
            </div>
          </div>
        </div>

        <div className="output">
          <div className="text">
            Output Screen
            <br />
            {userLang}
          </div>
          <div className="answediv">{userOutput}</div>
          <button
            onClick={() => {
              clearOutput();
            }}
            className="clear-btn"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="footermaindiv">
        Copyright &copy; 2024 All Right Reserved
      </div>
    </div>
  );
}

export default App;

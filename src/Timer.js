import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import imgs from "./images";
const Timer = () => {
  const [randVal, setRandVal] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [bgList, setbgList] = useState(imgs);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setRandVal(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setRandVal((randVal) => Math.floor(Math.random() * bgList.length));
      }, 2000);
    } else if (!isActive && randVal !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, randVal]);

  useEffect(() => {
    document.getElementById('main').style.webkitTransition = "opacity 1s ease-in-out";
    document.getElementById('main').style.mozTransition = "opacity 1s ease-in-out";
    document.getElementById('main').style.oTransition = "opacity 1s ease-in-out";
    document.getElementById('main').style.transition = "opacity 1s ease-in-out";
    document.getElementById('main').background = bgList[randVal];
    
  }, [randVal]);

  return <>{}</>;
};

export default Timer;

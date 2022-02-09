import { useEffect, useState } from "react";

export default function ASDF(){
  const [counts, setCount] = useState([0])

  useEffect(() => {
    let countsState = [...counts]
    const btn = document.querySelector("#btn")
    function click() {
      countsState = [...countsState, countsState[countsState.length - 1] + 1]
      setCount(countsState)
    }
    btn.addEventListener("click", click)
    return () => {
      btn.removeEventListener("click", click)
    }
  }, [])

  console.log("스크립트", counts[0])
  return<div>
    {counts.map(c => {
      console.log("렌더링", c)
    })}
    <button id="btn">클릭</button>
    <h1>{counts}</h1>
  </div>
}
import { useEffect, useRef, useState } from "react";

export default function ASDF(){
  const [counts, setCount] = useState([0])
  const [ok, setOk] = useState(true)
  let y = 1;
  useEffect(() => {
    console.log("마운트", counts[0])
  }, [counts])

  console.log(+ new Date())
  console.log(+ new Date())
  console.log("스크립트", counts[0])
  return<div>
    {counts.map(c => {
      console.log("렌더링", c)
    })}
    <button onClick={()=> setCount([counts[0] + 1])}>클릭</button>
    <h1>{y}</h1>
    <button onClick={()=> y += 1}>클릭</button><br/>
  </div>
}
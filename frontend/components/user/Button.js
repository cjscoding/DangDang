export default function Button({ text }) {
  return (
    <div>
      <button>{text}</button>
      <style jsx>
        {`
          div {
            margin-bottom: 0.3rem;
          }

          button {
            width: 200px;
            padding: 0.8rem 1rem;
            border: none;
            border-radius: 5px;
          }

          button:hover {
            cursor: pointer;
            background-color: lightgray;
          }
        `}
      </style>
    </div>
  );
}

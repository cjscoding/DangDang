import styles from "../../../scss/team/board/board.module.scss";
import { useEffect, useState } from "react";

export default function Pagination({ totalCount, postsPerPage, paginate }) {
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    const numArr = [];
    for (let i = 0; i < Math.ceil(totalCount / postsPerPage); i++) {
      numArr.push(i);
    }
    setPageNumbers(numArr);
  }, [totalCount]);

  return (
    <nav>
      <ul className={styles.pagination}>
        <li>
          <a onClick={() => paginate(0)}>first</a>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <a onClick={() => paginate(number)}>{number + 1}</a>
          </li>
        ))}
        <li>
          <a onClick={() => paginate(pageNumbers[pageNumbers.length - 1])}>
            last
          </a>
        </li>
      </ul>
    </nav>
  );
}

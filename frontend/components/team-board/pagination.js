import styles from "../../scss/team-board/board.module.scss";

import { useEffect, useState } from "react";

export default function Pagination({ allRoomsCount, postsPerPage, paginate }) {
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    const numArr = [];
    for (let i = 0; i < Math.ceil(allRoomsCount / postsPerPage); i++) {
      numArr.push(i);
    }
    setPageNumbers(numArr);
  }, [allRoomsCount]);

  return (
    <nav>
      <ul className={styles.pagination}>
        {pageNumbers.map((number) => (
          <li key={number}>
            <a onClick={() => paginate(number)}>{number + 1}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

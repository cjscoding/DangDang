import styles from "../../scss/team-board/board.module.scss";
import { fetchRooms } from "../../store/actions/roomAction";
import { useEffect, useState } from "react";

export default function Pagination({ postsPerPage, paginate }) {
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    fetchRooms().then((res) => {
      const cnt = res.rooms.length;
      const numArr = [];
      for (let i = 0; i < Math.ceil(cnt / postsPerPage); i++) {
        numArr.push(i);
      }
      setPageNumbers(numArr);
    });
  }, []);

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

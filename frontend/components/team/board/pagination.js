import styles from "../../../scss/team/board/board.module.scss";
import { useEffect, useState } from "react";

export default function Pagination({
  totalCount,
  postsPerPage,
  paginate,
  curPage,
}) {
  const [pageNumbers, setPageNumbers] = useState([]);
  const totalPage = Math.ceil(totalCount / postsPerPage);

  const goPrevPage = () => {
    if (curPage === 0) {
      paginate(0);
    } else {
      paginate(curPage - 1);
    }
  };

  const goNextPage = () => {
      console.log(curPage);
      console.log(totalPage-1);
    if (curPage === totalPage - 1) {
      paginate(totalPage-1);
    } else {
      paginate(curPage + 1);
    }
  };

  useEffect(() => {
    const numArr = [];
    if (totalPage <= 10) {
      for (let i = 0; i < totalPage; i++) {
        numArr.push(i);
      }
    } else if (curPage < 5) {
      for (let i = 0; i < 9; i++) {
        numArr.push(i);
      }
    } else if (curPage > totalPage - 5) {
      for (let i = totalPage - 9; i < totalPage; i++) {
        numArr.push(i);
      }
    } else {
      for (let i = curPage - 4; i < curPage + 5; i++) {
        numArr.push(i);
      }
    }
    setPageNumbers(numArr);
  }, [totalCount, curPage]);

  return (
    <nav>
      <ul className={styles.pagination}>
        <li>
          <a onClick={() => paginate(0)}>first</a>
        </li>
        <li>
          <a onClick={goPrevPage}>prev</a>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <a onClick={() => paginate(number)}>{number + 1}</a>
          </li>
        ))}
        <li>
          <a onClick={goNextPage}>next</a>
        </li>

        <li>
          <a onClick={() => paginate(totalPage - 1)}>
            last
          </a>
        </li>
      </ul>
    </nav>
  );
}

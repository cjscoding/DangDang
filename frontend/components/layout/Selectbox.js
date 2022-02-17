import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "../../scss/layout/selectbox.module.scss";
import { getAllQuestionList } from "../../api/admin";
import { setQuestionList } from "../../store/actions/adminAction";

const mapDispatchToProps = (dispatch) => {
  return {
    setQuestionList: (questions) => dispatch(setQuestionList(questions)),
  };
};

export default connect(null, mapDispatchToProps)(selectBox);

function selectBox({ values, setQuestionList }) {
  const [visible, setVisible] = useState(false);
  const [field, setfield] = useState("공통");

  // selectbox 이벤트 추가
  useEffect(() => {
    window.addEventListener("click", showMenu);
    return () => window.removeEventListener("click", showMenu);
  }, []);

  useEffect(() => {
    const nextField = field === "IT" ? "기술" : field;
    const params = {
      page: 0,
      size: 10,
    };
    getAllQuestionList(
      params,
      ({ data: { response } }) => {
        console.log(response.content);
        const nextQuestions = response.content;
        setQuestionList(nextQuestions);
      },
      (error) => console.log(error)
    );
  }, [field]);

  const showMenu = (event) => {
    event.stopPropagation();
    if (event.target.matches(".fieldContent")) {
      setVisible((curr) => !curr);
    } else {
      setVisible(false);
    }
  };

  const handleClick = (value) => {
    setfield(value);
  };

  return (
    <div className={styles.selectBox}>
      <div className="fieldContent">
        <span>{field}</span>
        <i className={`fas fa-angle-down ${styles.arrow}`}></i>
      </div>
      <ul className={visible ? styles.active : styles.hide}>
        {values.map((value) => (
          <li key={value} onClick={() => handleClick(value)}>
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

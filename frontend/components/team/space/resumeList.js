import styles from "../../../scss/team/space/resume.module.scss";

export default function ResumeList({ resume, index }) {
  return (
    <div className={styles.resumeOneItem}>
      <h4>
        Q{index + 1} : {resume.resumeQuestionList[0].question}
      </h4>
      <p>
        A{index + 1} : {resume.resumeQuestionList[0].answer}
      </p>
    </div>
  );
}

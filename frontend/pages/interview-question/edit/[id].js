// import Link from "next/link";
// import { connect } from "react-redux";
// import { useRouter } from "next/router";
// import { useState } from "react";

// // function mapStateToProps({ questionReducer }) {
// //   return {
// //     question: questionReducer.myQuestions.filter(
// //       (myQuestion) => myQuestion.id === router.query.id
// //     ),
// //   };
// // }
// export default connect()(editQuestion);

// function editQuestion({ question }) {
//   const router = useRouter();
//   const options = ["공통", "기술", "인성", "기타"];
//   const [values, setValues] = useState({
//     field: question.field,
//     question: question.question,
//     answer: question.answer,
//   });
//   const handleChange = ({ target: { id, value } }) => {
//     const nextValues = {
//       ...values,
//       [id]: value,
//     };
//     setValues(nextValues);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <div>
//       질문 수정하기
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="field">
//             분류
//             <select id="field" onChange={handleChange}>
//               {options.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>
//         <div>
//           <label htmlFor="question">
//             질문
//             <input
//               id="question"
//               type="text"
//               value={values.question}
//               onChange={handleChange}
//               required
//             />
//           </label>
//         </div>
//         <div>
//           <label htmlFor="answer">
//             답
//             <textarea
//               id="answer"
//               value={values.answer}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
//         <button type="submit">등록하기</button>
//       </form>
//       <Link href="/interview-question/me">목록으로</Link>
//     </div>
//   );
// }

export default function editQuestion() {
  return <div> MintChoco</div>;
}

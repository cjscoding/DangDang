import { connect } from "react-redux"

function mapStateToProps(state) {
  return {
    selectedQuestion: state.wsReducer.selectedQuestion,
    seconds: state.timerReducer.seconds,
  };
}
export default connect(mapStateToProps, null)(ShowQuestion)

function ShowQuestion({selectedQuestion, seconds}){
  return <>
    <h1>{selectedQuestion}</h1>
    <h1>{parseInt(seconds / 60)}분 {seconds % 60}초</h1>
  </>
}
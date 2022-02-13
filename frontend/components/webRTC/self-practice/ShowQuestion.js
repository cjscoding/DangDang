import { connect } from "react-redux"

function mapStateToProps(state) {
  return {
    selectedQuestion: state.wsReducer.selectedQuestion,
  };
}
export default connect(mapStateToProps, null)(ShowQuestion)

function ShowQuestion({selectedQuestion}){
  return <>
    <h1>{selectedQuestion}</h1>
  </>
}
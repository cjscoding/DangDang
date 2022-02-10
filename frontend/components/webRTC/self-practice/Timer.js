import { connect } from "react-redux"

function mapStateToProps(state) {
  return {
    seconds: state.timerReducer.seconds,
  };
}
export default connect(mapStateToProps, null)(ShowQuestion)

function ShowQuestion({seconds}){
  return <>
    <span>{parseInt(seconds / 60)}분 {seconds % 60}초</span>
  </>
}
import { connect } from "react-redux"

function mapStateToProps(state) {
  let timeStampInterval = state.timerReducer.curTime - state.timerReducer.startTIme
  if(timeStampInterval < 0) timeStampInterval = 0
  const seconds = Math.round(timeStampInterval / 1000)
  return {
    seconds
  };
}
export default connect(mapStateToProps, null)(ShowQuestion)

function ShowQuestion({seconds}){
  return <>
    <span>{parseInt(seconds / 60)}분 {seconds % 60}초</span>
  </>
}

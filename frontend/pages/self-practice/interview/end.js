import { useEffect } from "react";
import { connect } from "react-redux";


function mapStateToProps(state) {
  return {
    ws: state.wsReducer.ws,
  };
}
export default connect(mapStateToProps, null)(EndInterview)

function EndInterview({ws}) {
  useEffect(()=>{
    window.onbeforeunload = function() {
      sendMessage({
        id : 'del',
      });
      ws.close();
    }
  }, [])
  return <>
    <h1>면접끝</h1>
  </>
}
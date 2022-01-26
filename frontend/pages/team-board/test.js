// import axios from "axios";
import { fetchRooms } from "../../store/actions/roomAction";
// import { connect } from "react-redux";

// function mapStateToProps(state) {
//   return {
//     rooms: state.roomReducer.rooms,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     getInterview: () => dispatch(getRoomList()),
//   };
// }

// export default connect(null, mapDispatchToProps)(Test);

export default function Test() {
  let rooms = [];

  fetchRooms();

  return (
    <div>
      <h1>test</h1>
      {rooms?.map((room, index) => (
        <div className="room" key={index}>
          <h2>------------------</h2>
          <p>{room.id}</p>
          <p>{room.name}</p>
          <p>{room.description}</p>
        </div>
      ))}
    </div>
  );
}

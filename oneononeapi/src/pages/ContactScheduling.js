import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useParams } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';

function getCurrentDate(date) {
  let tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
  let currTime = (new Date(date - tzoffset)).toISOString().split('T')[0];
  return currTime
}

function CurrentTimeslots({ currDay, timeslots, onTimeslotAdd, timeslotSelection }) {
  const timeslotKey = getCurrentDate(currDay);
  const currTimeslots = timeslots[timeslotKey];
  return (
    <div className="border border-[#a0a096] rounded flex flex-col items-center space-y-2 p-2">
      <div>
        <p>{currDay.toDateString()}</p>
      </div>
      <h1>Available Timeslots</h1>
      {currTimeslots? (
        currTimeslots.map((timeslot) => {
          if (!(timeslot.id in timeslotSelection)){
            return <Timeslot onTimeslotAdd={onTimeslotAdd} timeslot={timeslot} key={timeslot.id}/>;
          }
          return <div key={timeslot.id}></div>;
        })
      ) : (
        <div className="text-gray-400">
          No timeslots available this date
        </div>
      )}
    </div>
  );
}

function SelectedTimeslots({ timeslotSelection, onTimeslotAdd, handleSubmit, error }) {
  let timeslots = [];
  for (const [timeslotid, timeslot] of Object.entries(timeslotSelection)) {
    timeslots.push(<Timeslot onTimeslotAdd={onTimeslotAdd} timeslot={timeslot} key={timeslotid}/>);
  };
  return (
    <div className="border border-[#a0a096] rounded flex flex-col items-center p-2">
      <h1>Selected Timeslots</h1>
      <div className="flex flex-col items-center space-y-2">
        {timeslots}
      </div>
      <div className="w-full mt-auto">
        <button onClick={handleSubmit} className="border border-slate-400 rounded bg-slate-200 hover:bg-slate-300 p-2 w-full mt-2" type="submit">
          <p className="">Submit</p>
        </button>
        {error? <div className="flex flex-col items-center"><p className="text-red-500 italic">There was an error</p></div> : <div></div>}
      </div>
    </div>
  );
}

function Timeslot({ timeslot, onTimeslotAdd }){
  return (
    <button onClick={() => onTimeslotAdd(timeslot)} className={"border border-slate-400 rounded hover:bg-slate-300 p-2 w-full " + (timeslot.high_priority? "bg-green-2":"")}>
      <p>Time: {new Date(timeslot.start_time).toLocaleTimeString('en-US')} - {new Date(timeslot.end_time).toLocaleTimeString('en-US')}</p>
      <p>Priority: {timeslot.high_priority? "High": "Low"}</p>
    </button>
  );
}

function ContactScheduling() {
  let { calendarId, contactId } = useParams();
  // timeslots is an object with key = date (in string yyyy-mm-dd)
  // and values is a list of timeslots with start_time in that day
  let [ timeslots, setTimeslots ] = useState({});
  // key: timeslot id;  value: timeslot
  // contains timeslots that the user have selected
  let [ timeslotSelection, setTimeslotSelection ] = useState({});
  let [ availableDates, setAvailableDates] = useState([new Date(), new Date()]);
  let [ submitError, setSubmitError ] = useState(false);
  const [currDay, onDateChange] = useState(new Date());

  function handleTimeslotAdd(timeslot){
    if (timeslot.id in timeslotSelection) {
      let newTimeslotSelection = {...timeslotSelection};
      delete newTimeslotSelection[timeslot.id];
      setTimeslotSelection(newTimeslotSelection);
    } else {
      setTimeslotSelection({...timeslotSelection, [timeslot.id]:timeslot});
    }
  }

  function makeEvent(timeslotId) {
    return fetch('http://localhost:8000/api/events/', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timeslot: timeslotId, contact: contactId}),
    });
  }
  
  async function handleSubmit() {
    let errors = false;
    for (const [timeslotId, _] of Object.entries(timeslotSelection)) {
      let res = await makeEvent(timeslotId);
      errors = errors || !res.ok;
    }
    setSubmitError(errors);
  }

  // get timeslots for this calendar
  useEffect(() => {
    fetch(
      `http://localhost:8000/api/calendars/${calendarId}/timeslots/`
    ).then(res => {
      // if status is not 200 (some error), return empty list
      return res.status === 200? res.json() : [];
    }).then(resJson => {
      let timeslotObj = {};
      let minDate = new Date();
      let maxDate = new Date();
      for (const timeslot of resJson) {
        const timeslotStartTime = new Date(timeslot.start_time);
        const timeslotStartDate = getCurrentDate(timeslotStartTime);
        minDate = timeslotStartTime.getTime() < minDate.getTime()? timeslotStartTime : minDate;
        maxDate = timeslotStartTime.getTime() > maxDate.getTime()? timeslotStartTime : maxDate;
        const timeslotToAdd = {
          ...timeslot,
          selected: false
        };
        if (timeslotStartDate in timeslotObj) {
          timeslotObj[timeslotStartDate].push(timeslotToAdd);
        } else {
          timeslotObj[timeslotStartDate] = [timeslotToAdd];
        }
      }
      setAvailableDates([minDate, maxDate]);
      setTimeslots(timeslotObj);
    });
  }, [calendarId, contactId]);

  return (
    <div className="flex justify-center space-x-4">
      <div>
        <Calendar className="rounded" onChange={onDateChange} value={currDay} minDate={new Date(availableDates[0])} maxDate={new Date(availableDates[1])} />
      </div>
      <CurrentTimeslots currDay={currDay} timeslots={timeslots} timeslotSelection={timeslotSelection} onTimeslotAdd={handleTimeslotAdd}/>
      <SelectedTimeslots timeslotSelection={timeslotSelection} onTimeslotAdd={handleTimeslotAdd} handleSubmit={handleSubmit} error={submitError}/>
    </div>
  );
}

export default ContactScheduling;

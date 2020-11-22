import React, { useState } from 'react';
import './App.css';

function App() {
  const [chatState, setChatState] = useState('start');
  const [from, setFrom] = useState('City');
  const [to, setTo] = useState('City');

  const clearState = () => {
    setChatState('start');
    setFrom('City');
    setTo('City');
  };

  const airEmissions = (km) => {
    return 115 * km;
  };

  const ferryEmissions = (km) => {
    return 20 * km;
  };

  const carEmissions = (km) => {
    return 100 * km;
  };

  const busEmissions = (km) => {
    return 5 * km;
  };

  const places = [
    {
      name: 'Helsinki',
      tallinn: {
        options: [
          {
            modes: [{ name: 'Airplane', distance: 80 }],
            emissionsG: airEmissions(80),
            timeM: 45,
          },
          {
            modes: [{ name: 'Ferry', distance: 80 }],
            emissionsG: ferryEmissions(80),
            timeM: 150,
          },
        ],
      },
      stockholm: {
        options: [
          {
            modes: [{ name: 'Airplane', distance: 400 }],
            emissionsG: airEmissions(400),
            timeM: 60,
          },
          {
            modes: [{ name: 'Ferry', distance: 500 }],
            emissionsG: ferryEmissions(500),
            timeM: 18 * 60,
          },
          {
            modes: [
              { name: 'Private Car', distance: 150 },
              { name: 'Ferry', distance: 300 },
            ],
            emissionsG: ferryEmissions(300) + carEmissions(150),
            timeM: 10 * 60,
          },
          {
            modes: [
              { name: 'Bus', distance: 150 },
              { name: 'Ferry', distance: 300 },
            ],
            emissionsG: ferryEmissions(300) + busEmissions(150),
            timeM: 11 * 60,
          },
        ],
      },
    },
    {
      name: 'Tallinn',
      helsinki: {
        options: [
          {
            modes: [{ name: 'Airplane', distance: 80 }],
            emissionsG: airEmissions(80),
            timeM: 45,
          },
          {
            modes: [{ name: 'Ferry', distance: 80 }],
            emissionsG: ferryEmissions(80),
            timeM: 150,
          },
        ],
      },
      stockholm: {
        options: [
          {
            modes: [{ name: 'Airplane', distance: 400 }],
            emissionsG: airEmissions(400),
            timeM: 60,
          },
          {
            modes: [{ name: 'Ferry', distance: 450 }],
            emissionsG: ferryEmissions(450),
            timeM: 16 * 60,
          },
        ],
      },
    },
    {
      name: 'Stockholm',
      helsinki: {
        options: [
          {
            modes: [{ name: 'Airplane', distance: 400 }],
            emissionsG: airEmissions(400),
            timeM: 60,
          },
          {
            modes: [{ name: 'Ferry', distance: 500 }],
            emissionsG: ferryEmissions(500),
            timeM: 18 * 60,
          },
          {
            modes: [
              { name: 'Ferry', distance: 300 },
              { name: 'Private Car', distance: 150 },
            ],
            emissionsG: ferryEmissions(300) + carEmissions(150),
            timeM: 10 * 60,
          },
          {
            modes: [
              { name: 'Ferry', distance: 300 },
              { name: 'Bus', distance: 150 },
            ],
            emissionsG: ferryEmissions(300) + busEmissions(150),
            timeM: 11 * 60,
          },
        ],
      },
      tallinn: {
        options: [
          {
            modes: [{ name: 'Airplane', distance: 400 }],
            emissionsG: airEmissions(400),
            timeM: 60,
          },
          {
            modes: [{ name: 'Ferry', distance: 450 }],
            emissionsG: ferryEmissions(450),
            timeM: 16 * 60,
          },
        ],
      },
    },
  ];

  function renderSwitch(state) {
    switch (state) {
      case 'start':
        return <ChatStart setChatState={setChatState} />;
      case 'choose_from':
        return (
          <SelectLocation
            places={places}
            isFrom={true}
            setChatState={setChatState}
            setFrom={setFrom}
            setTo={setTo}
            from={from}
            to={to}
          />
        );
      case 'choose_to':
        return (
          <SelectLocation
            places={places}
            isFrom={false}
            setChatState={setChatState}
            setFrom={setFrom}
            setTo={setTo}
            from={from}
            to={to}
          />
        );
      case 'results':
        return (
          <Results
            from={from}
            to={to}
            places={places}
            setChatState={setChatState}
            clearState={clearState}
          />
        );
      default:
        return <p>How did ya get here? ":D"</p>;
    }
  }

  return <div className="App">{renderSwitch(chatState)}</div>;
}

function ChatStart({ setChatState }) {
  return (
    <div className="App-header">
      <p>
        <b>
          Hi! I am your CO<sup>2</sup>-traveller! I will help you estimate how much carbon emissions
          your travels will cause.
        </b>
      </p>

      <p>
        Press <b>Start</b> to estimate your emissions!
      </p>

      <div className="Actions">
        <button class="Button" onClick={() => setChatState('choose_from')}>
          Start
        </button>
      </div>
    </div>
  );
}

function SelectLocation({ places, isFrom, setChatState, setFrom, setTo, from, to }) {
  console.log(places);
  console.log(from);
  const remaining = isFrom ? places : places.filter((p) => p.name !== from);
  return (
    <div className="App-header">
      {isFrom ? (
        <>
          <p>
            <b>Okay! Let's go!!</b>
          </p>

          <p> First, choose the city your trip starts from: </p>
          {createDynamicSelect(remaining, 'City', setFrom, from)}
        </>
      ) : (
        <>
          <p>
            <b>You chose {from} as your starting point</b>
          </p>

          <p> Now, choose the city you're traveling to: </p>
          {createDynamicSelect(remaining, 'City', setTo, to)}
        </>
      )}

      <div className="Actions">
        {isFrom ? (
          <>
            <button class="Button" onClick={() => setChatState('start')}>
              Go Back
            </button>
            <button
              class="Button"
              disabled={from === 'City'}
              onClick={() => setChatState('choose_to')}
            >
              Next
            </button>
          </>
        ) : (
          <>
            <button class="Button" onClick={() => setChatState('choose_from')}>
              Go Back
            </button>
            <button class="Button" disabled={to === 'City'} onClick={() => setChatState('results')}>
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function createDynamicSelect(options, placeholder, onChange, value) {
  console.log('Options: ', options);
  console.log('value: ', value);

  return (
    <select class="Select" name="location" value={value} onChange={(e) => onChange(e.target.value)}>
      <option class="Option" value={placeholder} disabled selected hidden>
        {placeholder}
      </option>
      {options.map((o) => {
        return (
          <option key={o.name} value={o.name}>
            {o.name}
          </option>
        );
      })}
    </select>
  );
}

function Results({ from, to, places, setChatState, clearState }) {
  const fromFull = places.find((p) => p.name === from);
  const toFull = fromFull[to.toLowerCase()];
  return (
    <div className="App-header">
      <p>
        <b>
          These are your travel options from {from} to {to}
        </b>
      </p>

      {toFull.options.map((o, i) => {
        return (
          <p class="Result">
            [{i + 1}] Transport by{' '}
            {o.modes.map((m) => m.name + ' (' + m.distance + ' km)').join(' + ')} | Time:{' '}
            {formatMinutes(o.timeM)} | Total CO<sup>2</sup> emissions: {o.emissionsG} g
          </p>
        );
      })}
      <div className="Actions">
        <button class="Button" onClick={() => setChatState('choose_to')}>
          Go Back
        </button>
        <button class="Button" onClick={() => clearState()}>
          New Trip
        </button>
      </div>
    </div>
  );
}

function formatMinutes(minutes) {
  const hours = minutes / 60;
  const remainingM = minutes - hours * 60;

  return remainingM > 0 ? hours + ' h ' + remainingM + ' min' : hours + ' h';
}

export default App;

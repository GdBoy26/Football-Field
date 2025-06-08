import React, { useState, useMemo } from 'react';
import PLAYERS_DATA from './playerData.json'; 
import { POSITION_COORDS_MAP, orderedPositionSlots } from './positionCoord';

const POSITION_GROUPS = {
  Forwards: ['Winger', 'Striker'],
  Midfielders: ['Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder'], 
  Defenders: ['Center Back', 'Wing Back', 'Full Back'], 
  Goalkeepers: ['Goalkeeper'], 
};

function App() {
  const [selectedGroup, setSelectedGroup] = useState(null); 
  const [selectedPlayer, setSelectedPlayer] = useState(null); 
  const [displayedPlayersInGroup, setDisplayedPlayersInGroup] = useState([]); 
  const playersWithCoords = useMemo(() => {
    const positionCounters = {
      'Goalkeeper': 0,
      'Center Back': 0,
      'Full Back': 0,
      'Wing Back': 0,
      'Defensive Midfielder': 0,
      'Central Midfielder': 0,
      'Attacking Midfielder': 0,
      'Winger': 0,
      'Striker': 0,
    };

    const getAssignedCoords = (player) => {
      const positionType = player.position;
      let slotKey = null;

      let currentCount = positionCounters[positionType];
      let slots = orderedPositionSlots[positionType];

      if (!slots || slots.length === 0) {
        console.warn(`No defined slots for position type: ${positionType}`);
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      }

      slotKey = slots[currentCount % slots.length];
      
      positionCounters[positionType]++;

      return POSITION_COORDS_MAP[slotKey] || { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    };

    return PLAYERS_DATA.map(player => ({
      ...player,
      coords: getAssignedCoords(player)
    }));
  }, [PLAYERS_DATA]);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(prevSelectedPlayer => 
      prevSelectedPlayer && prevSelectedPlayer.id === player.id ? null : player
    );
  };

  const handleGroupClick = (groupName) => {
    const newSelectedGroup = groupName === selectedGroup ? null : groupName;
    setSelectedGroup(newSelectedGroup);
    setSelectedPlayer(null); 

    if (newSelectedGroup) {
      const playersForGroup = playersWithCoords.filter(player => {
        const positionsInGroup = POSITION_GROUPS[newSelectedGroup];
        return positionsInGroup && positionsInGroup.includes(player.position);
      });
      setDisplayedPlayersInGroup(playersForGroup);
    } else {
      setDisplayedPlayersInGroup([]); 
    }
  };

  const isPlayerHighlighted = (player) => {
    if (selectedPlayer && selectedPlayer.id === player.id) {
      return true; 
    }
    if (selectedGroup) {
      const positionsInGroup = POSITION_GROUPS[selectedGroup];
      return positionsInGroup && positionsInGroup.includes(player.position);
    }
    return false; 
  };

  const BACKGROUND_IMAGE_URL = '/field-bg.jpg';

  return (
    <div className="font-inter flex flex-col items-center min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-green-400">
        Football Team Roster
      </h1>
      <div className="w-full flex flex-wrap justify-center gap-2 mb-6 p-2 bg-gray-700/70 rounded-md max-w-7xl">
        {Object.keys(POSITION_GROUPS).map((group) => (
          <button
            key={group}
            onClick={() => handleGroupClick(group)}
            className={`px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300
              ${selectedGroup === group ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-green-700 text-gray-200 hover:bg-green-500 hover:text-white'}`}>
            {group}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-gray-800 rounded-lg shadow-xl overflow-hidden"> 
        <div className="relative flex-1 bg-gray-900 rounded-l-lg overflow-hidden">
          <div className="relative w-full pb-[160%]" 
               style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#3b5f3b' }}>
            {playersWithCoords.map((player) => {
              const isHighlighted = isPlayerHighlighted(player);

              return (
                <div
                  key={player.id}
                  className={`absolute flex flex-col items-center cursor-pointer transition-all duration-300 transform -translate-x-1/2
                    ${isHighlighted ? 'bg-yellow-400 text-gray-900 font-bold p-2 rounded-md shadow-2xl z-10 scale-110 ring-4 ring-yellow-300' : 'text-gray-900 hover:scale-105 hover:bg-white/70'}`}
                  style={{ top: player.coords.top, left: player.coords.left, transform: player.coords.transform }}
                  onClick={() => handlePlayerClick(player)}
                >
                  <span className={`text-sm sm:text-base md:text-lg whitespace-nowrap text-center ${isHighlighted ? 'text-gray-900' : 'text-white'}`}>
                    {player.name}
                  </span>
                  <span className={`text-xs ${isHighlighted ? 'text-gray-700' : 'text-gray-300'}`}>
                    #{player.jersey_number}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96 p-6 bg-gray-900 rounded-r-lg md:rounded-bl-none overflow-y-auto max-h-[800px]">
          <h2 className="text-2xl font-bold mb-6 text-green-400">Player Details</h2>
          {selectedPlayer && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-4"> 
              <h3 className="text-xl font-bold text-white mb-2">{selectedPlayer.name}</h3>
              <p className="text-gray-300 mb-1">
                <strong className="text-green-300">Jersey Number:</strong> {selectedPlayer.jersey_number}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-green-300">Position:</strong> {selectedPlayer.position}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-green-300">Foot Preference:</strong> {selectedPlayer.foot}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-green-300">Goals:</strong> {selectedPlayer.goals}
              </p>
              <p className="text-gray-300 mb-4">
                <strong className="text-green-300">Assists:</strong> {selectedPlayer.assists}
              </p>

              <div className="mb-4">
                <p className="text-gray-300 mb-2">
                  <strong className="text-green-300">Fitness Level:</strong> {selectedPlayer.fitness_level}%
                </p>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${selectedPlayer.fitness_level}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {displayedPlayersInGroup.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-white mb-4">Players in {selectedGroup}</h3>
                <ul className="flex flex-col gap-2"> 
                    {displayedPlayersInGroup.map(player => (
                        <li 
                            key={player.id} 
                            onClick={() => handlePlayerClick(player)} 
                            className={`p-3 rounded-md cursor-pointer transition-colors duration-200 
                                ${selectedPlayer && selectedPlayer.id === player.id ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            <span className="font-semibold text-lg">{player.name}</span>
                            <span className="text-sm text-gray-400 ml-2">#{player.jersey_number}</span>
                        </li>
                    ))}
                </ul>
            </div>
          )}

          {!selectedPlayer && displayedPlayersInGroup.length === 0 && (
            <p className="text-gray-400 text-center py-10">
              Click on a player on the field or a position group button to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

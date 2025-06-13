import React, { useState, useMemo, useCallback } from 'react';
import playersData from './playersData.json'; 
import { generateDynamicPositionCoords } from './positionCoords';
import { mapFieldCoords } from './fieldMap';

const PLAYERS_DATA = playersData;

const POSITION_GROUPS = {
  Forwards: ['Winger', 'Striker'],
  Midfielders: ['Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder'],
  Defenders: ['Center Back', 'Wing Back', 'Full Back'],
  Goalkeepers: ['Goalkeeper'],
};

function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [highlightedPlayersInGroup, setHighlightedPlayersInGroup] = useState([]);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const [onFieldPlayers, setOnFieldPlayers] = useState(() => PLAYERS_DATA.map(player => player.id));

  const playersOnFieldWithCoords = useMemo(() => {
    const groupedPlayers = {};

    PLAYERS_DATA.filter(p => onFieldPlayers.includes(p.id)).forEach(player => {
      if (!groupedPlayers[player.position]) groupedPlayers[player.position] = [];
      groupedPlayers[player.position].push(player);
    });

    const playerWithCoords = [];

    for (const [position, players] of Object.entries(groupedPlayers)) {
      const coordsList = generateDynamicPositionCoords(position, players.length);

      players.forEach((player, index) => {
        const coords = coordsList[index] || mapFieldCoords(50, 50);
        playerWithCoords.push({ ...player, coords });
      });
    }

    return playerWithCoords;
  }, [onFieldPlayers]);

  const handlePlayerClick = useCallback((player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.find(p => p.id === player.id);
      if (isSelected) return prev.filter(p => p.id !== player.id);
      return [player, ...prev];
    });
  }, []);

  const handleGroupClick = useCallback((groupName) => {
    const newSelectedGroup = groupName === selectedGroup ? null : groupName;
    setSelectedGroup(newSelectedGroup);
    if (newSelectedGroup) {
      const playersForGroup = PLAYERS_DATA.filter(player => {
        const positionsInGroup = POSITION_GROUPS[newSelectedGroup];
        return positionsInGroup && positionsInGroup.includes(player.position);
      });
      setHighlightedPlayersInGroup(playersForGroup.map(p => p.id));
      setSelectedPlayers(playersForGroup);
    } else {
      setHighlightedPlayersInGroup([]);
      setSelectedPlayers([]);
    }
  }, [selectedGroup]);

  const isPlayerHighlightedOnField = useCallback((player) => {
    if (selectedPlayers.some(p => p.id === player.id)) return true;
    if (selectedGroup) {
      const positionsInGroup = POSITION_GROUPS[selectedGroup];
      return positionsInGroup && positionsInGroup.includes(player.position);
    }
    return false;
  }, [selectedPlayers, selectedGroup]);

  const isPlayerVisibleOnField = useCallback((player) => {
    if (!selectedGroup) return true;
    const positionsInGroup = POSITION_GROUPS[selectedGroup];
    return positionsInGroup && positionsInGroup.includes(player.position);
  }, [selectedGroup]);

  const togglePlayerOnField = useCallback((playerId) => {
    setOnFieldPlayers(prevOnFieldPlayers => {
      if (prevOnFieldPlayers.includes(playerId)) {
        return prevOnFieldPlayers.filter(id => id !== playerId);
      } else {
        return [...prevOnFieldPlayers, playerId];
      }
    });
  }, []);

  const BACKGROUND_IMAGE_URL = 'field-bg.jpg';

  return (
    <div className="font-inter flex flex-col items-center min-h-screen bg-gray-900 text-white px-2 sm:px-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-green-400">
        Football Team Roster
      </h1>

      {/* Group Filter Buttons */}
      <div className="w-full flex flex-wrap justify-center gap-2 mb-6 p-2 bg-gray-700/70 rounded-md max-w-[1600px]">
        {Object.keys(POSITION_GROUPS).map((group) => (
          <button
            key={group}
            onClick={() => handleGroupClick(group)}
            className={`px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300
              ${selectedGroup === group ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-green-700 text-gray-200 hover:bg-green-500 hover:text-white'}`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-[1600px] rounded-lg shadow-xl overflow-hidden gap-2">
        {/* Left Sidebar: All Players List */}
        <div className="w-full md:w-64 lg:w-72 p-4 bg-gray-900">
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              {showMobileDropdown ? 'Hide All Players' : 'Show All Players'}
            </button>
          </div>

          {(showMobileDropdown || window.innerWidth >= 768) && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-green-400">All Players</h2>
              <ul className="flex flex-col gap-2">
                {PLAYERS_DATA.map(player => (
                  <li
                    key={player.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors duration-200 flex items-center justify-between
                      ${highlightedPlayersInGroup.includes(player.id) ? 'bg-yellow-700 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => handlePlayerClick(player)}>
                    <div>
                      <span className="font-semibold text-lg">{player.name}</span>
                      <span className="text-sm text-gray-400 ml-2">#{player.jersey_number}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayerOnField(player.id);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                        onFieldPlayers.includes(player.id)
                          ? 'bg-green-400 text-white'
                          : 'bg-gray-600 text-gray-200 hover:bg-green-400 hover:text-white'
                      }`}>
                      {onFieldPlayers.includes(player.id) ? 'On Field' : 'Off Field'}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Center: Field Map */}
        <div className="relative flex-1 pb-[90%]">
          <div className="absolute inset-0"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#3b5f3b' }}>
            {playersOnFieldWithCoords.map((player) => {
              const isHighlighted = isPlayerHighlightedOnField(player);
              const isVisible = isPlayerVisibleOnField(player);
              if (!isVisible) return null;

              return (
                <div
                  key={player.id}
                  title={player.name}
                  className={`absolute flex items-center justify-center px-4 py-2 rounded-full font-bold text-sm sm:text-base text-center cursor-pointer transition-all duration-300
                    transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap
                    ${isHighlighted ? 'bg-yellow-400 border-yellow-300 scale-125 text-black shadow-md' : 'bg-white/90 hover:bg-green-300 text-black border-white shadow-sm'}`}
                  style={{ top: player.coords.top, left: player.coords.left }}
                  onClick={() => handlePlayerClick(player)}>
                  {selectedGroup ? `${player.name} #${player.jersey_number}` : `#${player.jersey_number}`}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Selected Players */}
        <div className="w-full md:w-[400px] p-4 bg-gray-900">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Selected Players</h2>

          {selectedPlayers.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              Click on a player on the field or from the 'All Players or the Pin on the Field' list to view details.
            </p>
          ) : (
            <>
              {selectedPlayers.length > 0 && (
                <button
                  onClick={() => setSelectedPlayers([])}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
                  Clear All Selected Players
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedPlayers.map(player => (
                  <div key={player.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-white mb-2">{player.name}</h3>
                    <p className="text-gray-300 mb-1">
                      <strong className="text-green-300">Jersey Number:</strong> {player.jersey_number}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <strong className="text-green-300">Position:</strong> {player.position}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <strong className="text-green-300">Foot Preference:</strong> {player.foot}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <strong className="text-green-300">Goals:</strong> {player.goals}
                    </p>
                    <p className="text-gray-300 mb-2">
                      <strong className="text-green-300">Assists:</strong> {player.assists}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <strong className="text-green-300">Fitness Level:</strong> {player.fitness_level}%
                    </p>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${player.fitness_level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
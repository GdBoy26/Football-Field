import { mapFieldCoords } from './fieldMap';

export const POSITION_COORDS_MAP = {
  'Goalkeeper_1': mapFieldCoords(38, 102),
  'Goalkeeper_2': mapFieldCoords(61, 102),
  'Full Back_L1': mapFieldCoords(5, 85),
  'Center Back_1': mapFieldCoords(23, 81),
  'Center Back_2': mapFieldCoords(78, 81),
  'Full Back_R1': mapFieldCoords(96, 85),
  'Center Back_3': mapFieldCoords(40, 78),
  'Center Back_4': mapFieldCoords(63, 78),
  'Wing Back_L1': mapFieldCoords(10, 69),
  'Wing Back_R1': mapFieldCoords(95, 69),
  'Defensive Midfielder_1': mapFieldCoords(35, 58),
  'Defensive Midfielder_2': mapFieldCoords(65, 58),
  'Central Midfielder_1': mapFieldCoords(23, 48),
  'Central Midfielder_2': mapFieldCoords(78, 48),
  'Attacking Midfielder_1': mapFieldCoords(35, 36),
  'Attacking Midfielder_2': mapFieldCoords(65, 36),
  'Winger_L1': mapFieldCoords(10, 27),
  'Striker_1': mapFieldCoords(40, 12),
  'Winger_R1': mapFieldCoords(90, 27),
  'Winger_L2': mapFieldCoords(25, 20),
  'Winger_R2': mapFieldCoords(75, 20),
  'Striker_2': mapFieldCoords(60, 12),
};

export const orderedPositionSlots = {
  'Goalkeeper': ['Goalkeeper_1', 'Goalkeeper_2'],
  'Center Back': ['Center Back_1', 'Center Back_2', 'Center Back_3', 'Center Back_4'],
  'Full Back': ['Full Back_L1', 'Full Back_R1'],
  'Wing Back': ['Wing Back_L1', 'Wing Back_R1'],
  'Defensive Midfielder': ['Defensive Midfielder_1', 'Defensive Midfielder_2'],
  'Central Midfielder': ['Central Midfielder_1', 'Central Midfielder_2'],
  'Attacking Midfielder': ['Attacking Midfielder_1', 'Attacking Midfielder_2'],
  'Winger': ['Winger_L1', 'Winger_R1', 'Winger_L2', 'Winger_R2'],
  'Striker': ['Striker_1', 'Striker_2'],
};

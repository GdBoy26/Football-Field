const FIELD_AREA_LEFT_OFFSET = 12;
const FIELD_AREA_RIGHT_OFFSET = 12;
const FIELD_AREA_TOP_OFFSET = 12;
const FIELD_AREA_BOTTOM_OFFSET = 12;

const FIELD_EFFECTIVE_WIDTH_RATIO = (100 - FIELD_AREA_LEFT_OFFSET - FIELD_AREA_RIGHT_OFFSET) / 100;
const FIELD_EFFECTIVE_HEIGHT_RATIO = (100 - FIELD_AREA_TOP_OFFSET - FIELD_AREA_BOTTOM_OFFSET) / 100;

export const mapFieldCoords = (originalLeft, originalTop) => {
    const adjustedLeft = FIELD_AREA_LEFT_OFFSET + (originalLeft * FIELD_EFFECTIVE_WIDTH_RATIO);
    const adjustedTop = FIELD_AREA_TOP_OFFSET + (originalTop * FIELD_EFFECTIVE_HEIGHT_RATIO);
    return { top: `${adjustedTop}%`, left: `${adjustedLeft}%`, transform: 'translateX(-50%)' };
};

import type { GameDTO, Cover, Genre } from '../server/models/Game';

// A function to map the JSON object to the GameDTO type
function mapJsonToGameDTO(json: any): GameDTO {
    const cover: Cover = json.cover ? {
        id: json.cover.id,
        imageId: json.cover.image_id,
    } : { id: 0, imageId: 'undefined' };

    return {
        id: json.id,
        cover: cover,
        firstReleaseDate: json.first_release_date,
        name: json.name,
    };
}

// The composable function
export function useGameDtoMapper() {
    const mapGameDto = (json: any): GameDTO => mapJsonToGameDTO(json);

    return {
        mapGameDto,
    };
}
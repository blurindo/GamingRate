export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event);

    const { searchQuery } = body

    const response = await fetch(
        "https://api.igdb.com/v4/games",
        { method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Client-ID': `${config.igdbClientId}`,
            'Authorization': `${config.igdbAuthorization}`,
          },
          body: `fields name, cover.image_id, storyline, first_release_date; search "${searchQuery}";`
      });
    
    const foundGames = await response.json();
    return {
        games: foundGames
    }
})
-- Fonction pour récupérer des IDs de musiques aléatoires liées à un artiste
CREATE OR REPLACE FUNCTION get_random_music_ids_by_artist(artist_id_param UUID, count_param INTEGER)
RETURNS TABLE (id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id
    FROM musics m
    INNER JOIN music_artists ma ON m.id = ma.music_id
    WHERE ma.artist_id = artist_id_param
    ORDER BY RANDOM()
    LIMIT count_param;
END;
$$ LANGUAGE plpgsql; 
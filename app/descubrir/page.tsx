"use client";
import { useState } from "react";

interface Cancion {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  collectionName: string;
}

const GENEROS = [
  { id: 14, nombre: "Pop" },
  { id: 21, nombre: "Rock" },
  { id: 18, nombre: "Hip-Hop" },
  { id: 7, nombre: "Electronica" },
  { id: 11, nombre: "Jazz" },
  { id: 6, nombre: "Country" },
  { id: 15, nombre: "R&B" },
  { id: 24, nombre: "Reggae" },
];

export default function Descubrir() {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [generoActivo, setGeneroActivo] = useState<number | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favoritos") || "[]");
    }
    return [];
  });

  const descubrir = async (generoId: number, generoNombre: string) => {
    setGeneroActivo(generoId);
    setCargando(true);
    try {
      const terminos = [generoNombre, "hits", "top", "best"];
      const termino = terminos[Math.floor(Math.random() * terminos.length)];
      const res = await fetch(
        `https://itunes.apple.com/search?term=${termino}&media=music&genreId=${generoId}&limit=20`
      );
      const data = await res.json();
      // Mezclar resultados aleatoriamente
      const mezclados = data.results.sort(() => Math.random() - 0.5);
      setCanciones(mezclados);
    } catch {
      console.error("Error descubriendo canciones");
    } finally {
      setCargando(false);
    }
  };

  const toggleFavorito = (cancion: Cancion) => {
    const favs: Cancion[] = JSON.parse(
      localStorage.getItem("favoritos-data") || "[]"
    );
    const ids: number[] = JSON.parse(
      localStorage.getItem("favoritos") || "[]"
    );

    if (ids.includes(cancion.trackId)) {
      const nuevosIds = ids.filter((id) => id !== cancion.trackId);
      const nuevosFavs = favs.filter((f) => f.trackId !== cancion.trackId);
      localStorage.setItem("favoritos", JSON.stringify(nuevosIds));
      localStorage.setItem("favoritos-data", JSON.stringify(nuevosFavs));
      setFavoritos(nuevosIds);
    } else {
      const nuevosIds = [...ids, cancion.trackId];
      const nuevosFavs = [...favs, cancion];
      localStorage.setItem("favoritos", JSON.stringify(nuevosIds));
      localStorage.setItem("favoritos-data", JSON.stringify(nuevosFavs));
      setFavoritos(nuevosIds);
    }
  };

  return (
    <div className="container">
      <h1 className="titulo-pagina">Descubrir</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "14px" }}>
        Elige un genero y descubre canciones aleatorias
      </p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "24px"
      }}>
        {GENEROS.map((genero) => (
          <button
            key={genero.id}
            onClick={() => descubrir(genero.id, genero.nombre)}
            style={{
              background: generoActivo === genero.id ? "var(--primary)" : "var(--surface2)",
              border: "none",
              borderRadius: "20px",
              padding: "8px 16px",
              color: generoActivo === genero.id ? "#000" : "var(--text)",
              fontWeight: generoActivo === genero.id ? 700 : 400,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {genero.nombre}
          </button>
        ))}
      </div>

      {cargando && (
        <p className="sin-resultados">Descubriendo canciones...</p>
      )}

      {!cargando && canciones.length === 0 && (
        <p className="sin-resultados">
          Selecciona un genero para descubrir musica
        </p>
      )}

      {!cargando && canciones.map((cancion) => (
        <div key={cancion.trackId} className="song-card">
          <img src={cancion.artworkUrl100} alt={cancion.trackName} />
          <div className="song-info">
            <h3>{cancion.trackName}</h3>
            <p>{cancion.artistName}</p>
            <p>{cancion.collectionName}</p>
          </div>
          {cancion.previewUrl && (
            <audio controls style={{ width: "80px", height: "32px" }}>
              <source src={cancion.previewUrl} type="audio/mpeg" />
            </audio>
          )}
          <button
            className="btn-fav"
            onClick={() => toggleFavorito(cancion)}
          >
            {favoritos.includes(cancion.trackId) ? "❤️" : "🤍"}
          </button>
        </div>
      ))}
    </div>
  );
}
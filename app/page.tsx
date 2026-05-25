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

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favoritos") || "[]");
    }
    return [];
  });

  const buscar = async () => {
    if (!busqueda.trim()) return;
    setCargando(true);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(busqueda)}&media=music&limit=20`
      );
      const data = await res.json();
      setCanciones(data.results);
    } catch {
      console.error("Error buscando canciones");
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
      <h1 className="titulo-pagina">Music Finder</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "14px" }}>
        Busca tus canciones favoritas
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Artista, cancion, album..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
        />
        <button onClick={buscar}>Buscar</button>
      </div>

      {cargando && (
        <p className="sin-resultados">Buscando...</p>
      )}

      {!cargando && canciones.length === 0 && (
        <p className="sin-resultados">
          Busca una cancion para empezar
        </p>
      )}

      {canciones.map((cancion) => (
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
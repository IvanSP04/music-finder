"use client";
import { useEffect, useState } from "react";

interface Cancion {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  collectionName: string;
}

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Cancion[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favoritos-data") || "[]");
    setFavoritos(data);
  }, []);

  const quitarFavorito = (id: number) => {
    const nuevos = favoritos.filter((f) => f.trackId !== id);
    const nuevosIds = nuevos.map((f) => f.trackId);
    localStorage.setItem("favoritos-data", JSON.stringify(nuevos));
    localStorage.setItem("favoritos", JSON.stringify(nuevosIds));
    setFavoritos(nuevos);
  };

  return (
    <div className="container">
      <h1 className="titulo-pagina">Mis Favoritos</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "14px" }}>
        {favoritos.length} canciones guardadas
      </p>

      {favoritos.length === 0 ? (
        <p className="sin-resultados">
          No tienes canciones favoritas aun. Busca y agrega algunas.
        </p>
      ) : (
        favoritos.map((cancion) => (
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
              onClick={() => quitarFavorito(cancion.trackId)}
            >
              ❌
            </button>
          </div>
        ))
      )}
    </div>
  );
}
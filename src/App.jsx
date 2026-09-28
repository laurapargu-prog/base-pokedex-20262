import { useEffect, useRef, useState } from 'react'
import cockpitImage from './assets/spaceship-cockpit.jpg'
import './App.css'

const quickSearches = [
  { label: 'Pikachu', value: 'pikachu', icon: '⚡' },
  { label: 'Charizard', value: 'charizard', icon: '🔥' },
  { label: 'Pokemon #25', value: '25', icon: '⭐' },
]

function LaunchScreen({ onComplete, onSearch, searchTerm, onSearchTermChange, status }) {
  const [bootStage, setBootStage] = useState('standby')
  const visualStage = bootStage === 'scanning' && status === 'success'
    ? 'target-found'
    : bootStage === 'scanning' && status === 'error'
      ? 'scan-error'
      : bootStage
  const isBooting = visualStage !== 'standby'

  useEffect(() => {
    let nextStage
    let delay

    if (visualStage === 'power') {
      nextStage = 'systems'
      delay = 550
    } else if (visualStage === 'systems') {
      nextStage = 'engines'
      delay = 600
    } else if (visualStage === 'engines') {
      nextStage = 'departure'
      delay = 700
    } else if (visualStage === 'target-found') {
      nextStage = 'departure'
      delay = 1100
    } else if (visualStage === 'scan-error') {
      nextStage = 'standby'
      delay = 1800
    } else if (visualStage === 'departure') {
      delay = 1150
    }

    if (!delay) return undefined

    const timer = window.setTimeout(() => {
      if (visualStage === 'departure') onComplete()
      else setBootStage(nextStage)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [visualStage, onComplete])

  function handleSearch(event) {
    event.preventDefault()
    if (!searchTerm.trim()) return
    setBootStage('scanning')
    onSearch(searchTerm)
  }

  const statusCopy = {
    standby: 'AWAITING PILOT INPUT',
    power: 'POWER ON',
    systems: 'SYSTEM ACTIVATED',
    engines: 'ENGINES ONLINE',
    departure: 'DEPARTURE',
    scanning: 'SCANNING DEEP SPACE...',
    'target-found': `TARGET FOUND · ${status === 'success' ? searchTerm.toUpperCase() : ''}`,
    'scan-error': 'SIGNAL NOT FOUND · RETRY SCAN',
  }[visualStage]

  return (
    <main className={`launch-screen launch-screen--${visualStage}`}>
      <img className="launch-cockpit-image" src={cockpitImage} alt="Interior de una nave espacial preparada para explorar el universo" />
      <div className="launch-image-shade" aria-hidden="true" />
      <div className="launch-vignette" aria-hidden="true" />

      <div className="launch-hud launch-hud-top" aria-hidden="true">
        <span><i /> POKÉMON DEEP SPACE</span>
        <span>FLIGHT DECK <b>·</b> 001</span>
      </div>

      <div className={`launch-search-screen launch-search-screen--${visualStage}`}>
        <p><i /> DEEP SPACE SPECIES SEARCH</p>
        <SearchForm value={searchTerm} onChange={onSearchTermChange} onSubmit={handleSearch} />
        {bootStage === 'scanning' && <span className="launch-search-message">SEARCHING POKÉMON DATABASE...</span>}
        {bootStage === 'target-found' && <span className="launch-search-message is-found">TARGET FOUND</span>}
      </div>

      {(bootStage === 'scanning' || bootStage === 'target-found' || bootStage === 'departure') && (
        <div className="launch-scan-effect" aria-hidden="true"><i /><i /><span /></div>
      )}

      <div className="launch-diagnostics" aria-hidden="true">
        <span className={isBooting ? 'signal-active' : ''} />
        <span className={bootStage === 'systems' || bootStage === 'engines' || bootStage === 'departure' ? 'signal-active' : ''} />
        <span className={bootStage === 'engines' || bootStage === 'departure' ? 'signal-active' : ''} />
        <span className={bootStage === 'departure' ? 'signal-active' : ''} />
      </div>

      <div className="launch-hud launch-hud-bottom" aria-live="polite">
        <div className="launch-status">
          <span className={isBooting ? 'launch-status-light is-lit' : 'launch-status-light'} />
          <span>{statusCopy}</span>
        </div>
        <button
          className="power-button"
          type="button"
          onClick={() => setBootStage('power')}
          disabled={isBooting || status === 'loading'}
        >
          <span className="power-glyph" aria-hidden="true">⏻</span>
          <span>{isBooting ? 'INITIATING' : 'ARRANCAR LA NAVE'}</span>
        </button>
      </div>

      {isBooting && <div className="departure-flare" aria-hidden="true" />}
    </main>
  )
}

function readVault(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

function getRarity(id) {
  if (id % 151 === 0 || id % 100 === 0) return 'Legendary vault'
  if (id % 25 === 0) return 'Ultra rare'
  if (id % 10 === 0) return 'Rare holographic'
  return 'Vault edition'
}

function SearchForm({ value, onChange, onSubmit }) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <label htmlFor="pokemon-input">Target designation</label>
      <div className="search-controls">
        <input
          id="pokemon-input"
          name="pokemon"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="ENTER NAME OR ID"
          autoComplete="off"
          required
        />
        <button type="submit"><span className="scan-button-light" aria-hidden="true" />SCAN</button>
      </div>
      <small>Pokémon database uplink · PokéAPI connected</small>
    </form>
  )
}

function CardBackArtwork({ label, isLoading = false }) {
  return (
    <div className="card-back-inner">
      <span className="card-orbit orbit-one" />
      <span className="card-orbit orbit-two" />
      <div className="vault-emblem">✦</div>
      <p className="scan-copy">
        {label}{isLoading && <span aria-hidden="true">...</span>}
      </p>
    </div>
  )
}

function CardBack({ status }) {
  const isLoading = status === 'loading'
  const isError = status === 'error'
  const label = isLoading ? 'SCANNING' : isError ? 'Card not found' : 'Mystery card'

  return (
    <article className={`vault-card card-back ${isLoading ? 'is-scanning' : ''} ${isError ? 'has-error' : ''}`}>
      <CardBackArtwork label={label} isLoading={isLoading} />
    </article>
  )
}

function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const cardRef = useRef(null)
  const types = pokemon.types.map(({ type }) => type.name).join(' · ')
  const abilities = pokemon.abilities.map(({ ability }) => ability.name).join(' · ')
  const stats = pokemon.stats.map(({ base_stat: value, stat }) => ({ label: stat.name, value }))

  const details = [
    ['Type', types],
    ['Height', `${pokemon.height / 10} m`],
    ['Weight', `${pokemon.weight / 10} kg`],
    ['Abilities', abilities],
  ]

  function updateCardTilt(event) {
    const card = cardRef.current
    if (!card) return

    const bounds = card.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    card.style.setProperty('--rotate-y', `${(x - 0.5) * 10}deg`)
    card.style.setProperty('--rotate-x', `${(0.5 - y) * 10}deg`)
    card.style.setProperty('--shine-x', `${x * 100}%`)
    card.style.setProperty('--shine-y', `${y * 100}%`)
  }

  function resetCardTilt() {
    const card = cardRef.current
    if (!card) return
    card.style.removeProperty('--rotate-y')
    card.style.removeProperty('--rotate-x')
    card.style.removeProperty('--shine-x')
    card.style.removeProperty('--shine-y')
  }

  return (
    <div className="card-aura">
      <span className="card-spark spark-one" aria-hidden="true" />
      <span className="card-spark spark-two" aria-hidden="true" />
      <span className="card-spark spark-three" aria-hidden="true" />
      <article
        ref={cardRef}
        className="vault-card reveal-card"
        onPointerMove={updateCardTilt}
        onPointerLeave={resetCardTilt}
      >
        <div className="card-flip">
          <div className="card-face card-face-back" aria-hidden="true">
            <CardBackArtwork label="Mystery card" />
          </div>
          <div className="card-face card-face-front">
            <div className="holo-layer" aria-hidden="true" />
      <header className="card-heading">
        <span>Pokémon card vault</span>
        <div>
          <strong>#{String(pokemon.id).padStart(3, '0')}</strong>
          <button
            className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </header>

      <div className="pokemon-showcase">
        <span className="energy-ring" aria-hidden="true" />
        <img src={pokemon.sprites.front_default} alt={`Imagen de ${pokemon.name}`} />
      </div>

      <div className="card-identity">
        <p>Discovered Pokémon</p>
        <h3>{pokemon.name}</h3>
        <span>{types}</span>
        <em>{getRarity(pokemon.id)}</em>
      </div>

      <div className="card-details">
        {details.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="card-stats" aria-label="Estadísticas base">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <span>{label}</span>
            <i><b style={{ width: `${Math.min(value, 100)}%` }} /></i>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <footer className="card-footer">
        <span>Authentic vault discovery</span>
        <span className="rarity-mark">✦ ✦ ✦</span>
      </footer>
          </div>
        </div>
      </article>
    </div>
  )
}

function ResultPanel({ pokemon, status, isFavorite, onToggleFavorite }) {
  return (
    <section className={`result result--${status}`} aria-live="polite">
      <p className="vault-status">
        {status === 'success'
          ? `TARGET FOUND · ${pokemon.name.toUpperCase()}`
          : status === 'loading'
            ? 'SEARCHING POKÉMON DATABASE...'
            : status === 'error'
              ? 'TARGET NOT FOUND'
              : 'DEEP SPACE UPLINK · STANDBY'}
      </p>
      <div className={`scan-feed ${status === 'loading' ? 'is-searching' : ''}`} aria-hidden="true">
        <span className={status === 'idle' ? '' : 'is-complete'}>SCANNING DEEP SPACE...</span>
        <span className={status === 'loading' ? 'is-active' : status === 'success' ? 'is-complete' : ''}>
          SEARCHING POKÉMON DATABASE...
        </span>
        {status === 'success' && <span className="is-found">TARGET FOUND</span>}
      </div>
      {status === 'success' && (
        <>
          <div className="materialize-effect" aria-hidden="true"><i /><i /><span /></div>
          <PokemonCard pokemon={pokemon} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
        </>
      )}
      {status !== 'success' && <CardBack status={status} />}
      {status === 'error' && <p className="error-message">Revisa el nombre o número e inténtalo de nuevo.</p>}
    </section>
  )
}

function CollectionShelf({ cards, onSelect }) {
  if (!cards.length) return null

  return (
    <section className="collection-shelf" aria-labelledby="shelf-title">
      <div>
        <p>Personal archive</p>
        <h2 id="shelf-title">Recently discovered</h2>
      </div>
      <div className="shelf-cards">
        {cards.map((card) => (
          <button key={card.id} type="button" onClick={() => onSelect(card.name)}>
            <img src={card.image} alt={`Carta de ${card.name}`} />
            <span>#{String(card.id).padStart(3, '0')}</span>
            <strong>{card.name}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}

function App() {
  const searchRequestRef = useRef(0)
  const [scannerOnline, setScannerOnline] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const [status, setStatus] = useState('idle')
  const [favorites, setFavorites] = useState(() => readVault('pokemon-card-vault-favorites'))
  const [recentCards, setRecentCards] = useState(() => readVault('pokemon-card-vault-recent'))

  useEffect(() => {
    document.title = 'Pokedex Explorer'
  }, [])

  function rememberPokemon(foundPokemon) {
    const card = {
      id: foundPokemon.id,
      name: foundPokemon.name,
      image: foundPokemon.sprites.front_default,
    }

    setRecentCards((current) => {
      const next = [card, ...current.filter((item) => item.id !== card.id)].slice(0, 6)
      localStorage.setItem('pokemon-card-vault-recent', JSON.stringify(next))
      return next
    })
  }

  function toggleFavorite() {
    if (!pokemon) return

    const card = { id: pokemon.id, name: pokemon.name, image: pokemon.sprites.front_default }
    setFavorites((current) => {
      const exists = current.some((item) => item.id === card.id)
      const next = exists ? current.filter((item) => item.id !== card.id) : [card, ...current]
      localStorage.setItem('pokemon-card-vault-favorites', JSON.stringify(next))
      return next
    })
  }

  async function searchPokemon(term = searchTerm) {
    const normalizedTerm = term.trim().toLowerCase()
    if (!normalizedTerm) return

    const requestId = ++searchRequestRef.current
    const scanStartedAt = Date.now()
    const waitForScan = () => new Promise((resolve) => {
      window.setTimeout(resolve, Math.max(0, 1000 - (Date.now() - scanStartedAt)))
    })

    setSearchTerm(normalizedTerm)
    setStatus('loading')
    setPokemon(null)

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(normalizedTerm)}`,
      )

      if (!response.ok) throw new Error('Pokemon no encontrado')

      const foundPokemon = await response.json()
      await waitForScan()
      if (requestId !== searchRequestRef.current) return
      setPokemon(foundPokemon)
      rememberPokemon(foundPokemon)
      setStatus('success')
    } catch {
      await waitForScan()
      if (requestId !== searchRequestRef.current) return
      setStatus('error')
    }
  }

  function returnToShip() {
    searchRequestRef.current += 1
    setPokemon(null)
    setStatus('idle')
    setSearchTerm('')
    setScannerOnline(false)
  }

  if (!scannerOnline) {
    return (
      <LaunchScreen
        onComplete={() => setScannerOnline(true)}
        onSearch={searchPokemon}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        status={status}
      />
    )
  }

  return (
    <main className="app-shell" data-flight-status={status}>
      <div className="space-flight" aria-hidden="true">
        <span className="star-depth stars-far" />
        <span className="star-depth stars-mid" />
        <span className="star-depth stars-near" />
        <span className="nebula nebula-one" />
        <span className="nebula nebula-two" />
        <span className="planet-horizon" />
        <div className="vault-particles"><i /><i /><i /><i /><i /></div>
      </div>

      <nav className="topbar">
        <strong><i className="ship-mark" aria-hidden="true" />Pokémon Deep Space</strong>
        <div className="topbar-actions">
          <span className="ship-readout"><i />SHIP SYSTEMS NOMINAL <b>·</b> SECTOR 001</span>
          <button className="return-button" type="button" onClick={returnToShip}>← BACK TO SHIP</button>
        </div>
      </nav>

      <section className="cockpit" aria-label="Nave de exploración">
        <aside className="scanner-console">
          <div className="console-heading">
            <div className="console-index"><span>01</span><i /></div>
            <p>Long-range biological scanner</p>
          </div>
          <h1>Pokémon<br /><span>scanner</span></h1>
          <p className="console-copy">Identify lifeforms across the outer sectors.</p>

          <SearchForm
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={(event) => {
              event.preventDefault()
              searchPokemon()
            }}
          />

          <section className="quick-searches" aria-labelledby="quick-title">
            <h2 id="quick-title">Saved coordinates</h2>
            <div className="route-map">
              {quickSearches.map(({ label, value, icon }) => (
                <button key={value} type="button" onClick={() => searchPokemon(value)}>
                  <span>{icon}</span>{label}
                </button>
              ))}
            </div>
          </section>

          <div className="instrument-bank" aria-hidden="true">
            <div className="instrument-readout">
              <span>SCAN RANGE</span><strong>∞ <small>LY</small></strong>
              <i><b /></i>
            </div>
            <div className="instrument-readout">
              <span>DATABASE LINK</span><strong>98.7<small>%</small></strong>
              <i><b /></i>
            </div>
            <div className="control-lights"><i /><i /><i /><span>FLIGHT CONTROL</span></div>
            <div className="radar-dial"><i /><b /><span /></div>
          </div>
          <div className="console-footline"><span>USS POKÉDEX</span><span>EXPLORATION SYSTEMS / 01</span></div>
        </aside>

        <section className="flight-display" aria-label="Ventana de exploración y resultado del escáner">
          <div className="display-header">
            <span><i /> EXTERIOR VIEW</span>
            <span>COORD <b>07:25:04</b></span>
          </div>
          <div className="window-scenery" aria-hidden="true">
            <div className="distant-planet"><span /></div>
            <i className="window-star star-a" /><i className="window-star star-b" />
            <i className="window-star star-c" /><i className="window-star star-d" />
          </div>
          <div className="projection-grid" aria-hidden="true" />
          <div className="display-reticle" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="display-data data-left" aria-hidden="true"><span>VELOCITY</span><strong>0.82 C</strong><i /></div>
          <div className="display-data data-right" aria-hidden="true"><span>SECTOR</span><strong>ORION / 07</strong><i /></div>
          <ResultPanel
            pokemon={pokemon}
            status={status}
            isFavorite={pokemon ? favorites.some((item) => item.id === pokemon.id) : false}
            onToggleFavorite={toggleFavorite}
          />
          <div className="display-footer" aria-hidden="true">
            <span><i /> DEEP SPACE TELEMETRY</span><span>LIVE <b /></span>
          </div>
        </section>
      </section>

      <CollectionShelf cards={recentCards} onSelect={searchPokemon} />

      <footer className="flight-footer">
        <span>DEEP SPACE EXPLORATION DIVISION</span>
        <span>POKÉAPI DATA UPLINK <i /></span>
      </footer>
    </main>
  )
}

export default App

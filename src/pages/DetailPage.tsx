import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { useEvolutionChain } from '../hooks/useEvolutionChain';
import { useWeaknesses } from '../hooks/useWeaknesses';
import { StatBar } from '../components/StatBar/StatBar';
import { EvolutionChainView } from '../components/EvolutionChainView/EvolutionChainView';
import { useFavoritesStore } from '../store/favoritesStore';
import { TYPE_LABELS_PT } from '../constants/typeLabels';
import { TYPE_COLORS } from '../constants/typeColors';
import type { PokemonTypeName } from '../constants/types';
import { capitalize, formatHeightM, formatPokedexNumber, formatWeightKg } from '../utils/formatters';
import { computeGenderRatio, getFlavorText, getGenus } from '../utils/speciesInfo';
import arrowBackIcon from '../assets/icons/arrow-back.png';
import favoriteActiveIcon from '../assets/icons/favorite-toggle-active.png';
import favoriteInactiveIcon from '../assets/icons/favorite-toggle-inactive.png';

const STAT_MAX = 255;

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);
  const navigate = useNavigate();
  const { pokemon, species, isLoading, error } = usePokemonDetails(pokemonId);
  const { stages } = useEvolutionChain(species?.evolution_chain.url ?? null);
  const weaknesses = useWeaknesses((pokemon?.types.map((entry) => entry.type.name) ?? []) as PokemonTypeName[]);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(pokemonId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  if (isLoading) return <p className="p-6">Carregando...</p>;
  if (error || !pokemon) return <p className="p-6 text-red-500">{error ?? 'Pokémon não encontrado'}</p>;

  const sprite =
    pokemon.sprites.versions['generation-v']['black-white'].front_default ??
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default ??
    '';
  const primaryType = pokemon.types[0]?.type.name as PokemonTypeName | undefined;
  const backgroundColor = (primaryType && TYPE_COLORS[primaryType]) || '#A8A878';
  const genus = species ? getGenus(species) : null;
  const flavorText = species ? getFlavorText(species) : null;
  const genderRatio = species ? computeGenderRatio(species.gender_rate) : null;
  const ability = pokemon.abilities[0]?.ability.name;

  return (
    <main className="mx-auto max-w-md pb-24 md:max-w-3xl">
      <div className="relative overflow-hidden px-4 pb-8 pt-6" style={{ backgroundColor }}>
        <div aria-hidden className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-8 w-8 items-center justify-center"
          >
            <img src={arrowBackIcon} alt="" className="h-5 w-5 brightness-0 invert" />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(pokemon.id)}
            aria-label={isFavorite ? 'Desfavoritar' : 'Favoritar'}
            className="flex h-8 w-8 items-center justify-center"
          >
            <img
              src={isFavorite ? favoriteActiveIcon : favoriteInactiveIcon}
              alt=""
              className="h-7 w-7 object-contain"
            />
          </button>
        </div>

        {sprite && (
          <img
            src={sprite}
            alt={pokemon.name}
            className="relative mx-auto mt-2 h-40 w-40 object-contain [image-rendering:pixelated]"
          />
        )}
      </div>

      <div className="px-4">
        <h1 className="mt-4 text-2xl font-bold">{capitalize(pokemon.name)}</h1>
        <p className="text-sm text-neutral-400">{formatPokedexNumber(pokemon.id)}</p>

        <div className="mt-3 flex gap-2">
          {pokemon.types.map((entry) => (
            <span
              key={entry.type.name}
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: TYPE_COLORS[entry.type.name as PokemonTypeName] }}
            >
              {TYPE_LABELS_PT[entry.type.name as PokemonTypeName] ?? capitalize(entry.type.name)}
            </span>
          ))}
        </div>

        {flavorText && <p className="mt-4 text-sm text-neutral-500">{flavorText}</p>}

        <hr className="my-4 border-neutral-200" />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-200 p-3">
            <p className="text-xs font-medium uppercase text-neutral-400">Peso</p>
            <p className="mt-1 font-semibold">{formatWeightKg(pokemon.weight)}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 p-3">
            <p className="text-xs font-medium uppercase text-neutral-400">Altura</p>
            <p className="mt-1 font-semibold">{formatHeightM(pokemon.height)}</p>
          </div>
          {genus && (
            <div className="rounded-xl border border-neutral-200 p-3">
              <p className="text-xs font-medium uppercase text-neutral-400">Categoria</p>
              <p className="mt-1 font-semibold">{genus}</p>
            </div>
          )}
          {ability && (
            <div className="rounded-xl border border-neutral-200 p-3">
              <p className="text-xs font-medium uppercase text-neutral-400">Habilidade</p>
              <p className="mt-1 font-semibold">{capitalize(ability)}</p>
            </div>
          )}
        </div>

        {genderRatio && (
          <section className="mt-6">
            <h2 className="mb-2 text-xs font-medium uppercase text-neutral-400">Gênero</h2>
            <div className="flex h-2 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full bg-blue-500" style={{ width: `${genderRatio.malePercent}%` }} />
              <div className="h-full bg-pink-400" style={{ width: `${genderRatio.femalePercent}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-xs text-neutral-500">
              <span>♂ {genderRatio.malePercent.toFixed(1).replace('.', ',')}%</span>
              <span>♀ {genderRatio.femalePercent.toFixed(1).replace('.', ',')}%</span>
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Estatísticas</h2>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.stat.name} label={stat.stat.name} value={stat.base_stat} max={STAT_MAX} />
          ))}
        </section>

        {weaknesses.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Fraquezas</h2>
            <div className="grid grid-cols-2 gap-2">
              {weaknesses.map((type) => (
                <span
                  key={type}
                  className="rounded-full px-3 py-1 text-center text-xs font-medium text-white"
                  style={{ backgroundColor: TYPE_COLORS[type] }}
                >
                  {TYPE_LABELS_PT[type]}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Evoluções</h2>
          <EvolutionChainView stages={stages} />
        </section>

        <button
          type="button"
          onClick={() => navigate(`/comparar?a=${pokemon.id}`)}
          className="mt-6 w-full rounded-full bg-neutral-900 py-3 text-sm font-semibold text-white"
        >
          Comparar
        </button>
      </div>
    </main>
  );
}

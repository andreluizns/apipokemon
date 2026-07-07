import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { useEvolutionChain } from '../hooks/useEvolutionChain';
import { useWeaknesses } from '../hooks/useWeaknesses';
import { EvolutionChainView } from '../components/EvolutionChainView/EvolutionChainView';
import { TypeBadge } from '../components/TypeBadge/TypeBadge';
import { FavoriteHeartIcon } from '../components/icons/FavoriteHeartIcon';
import { useFavoritesStore } from '../store/favoritesStore';
import { TYPE_DETAIL_BASE_BACKGROUNDS, TYPE_DETAIL_BACKGROUNDS } from '../constants/typeDetailBackgrounds';
import type { PokemonTypeName } from '../constants/types';
import { capitalize, formatHeightM, formatPokedexNumber, formatWeightKg } from '../utils/formatters';
import { computeGenderRatio, getFlavorText, getGenus } from '../utils/speciesInfo';
import arrowPokeIcon from '../assets/poke-page/arrow-poke.svg';
import pesoIcon from '../assets/poke-page/peso.svg';
import alturaIcon from '../assets/poke-page/altura.svg';
import categoriaIcon from '../assets/poke-page/categoria.svg';
import habilidadeIcon from '../assets/poke-page/habilidade.svg';

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
  const headerBaseBackground = primaryType && TYPE_DETAIL_BASE_BACKGROUNDS[primaryType];
  const headerWatermark = primaryType && TYPE_DETAIL_BACKGROUNDS[primaryType];
  const genus = species ? getGenus(species) : null;
  const flavorText = species ? getFlavorText(species) : null;
  const genderRatio = species ? computeGenderRatio(species.gender_rate) : null;
  const ability = pokemon.abilities[0]?.ability.name;

  return (
    <main className="mx-auto max-w-md pb-24 md:max-w-3xl">
      <div className="relative overflow-hidden px-4 pb-25 pt-6">
        {headerBaseBackground && (
          <img src={headerBaseBackground} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        )}
        {headerWatermark && (
          <img
            src={headerWatermark}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-90"
          />
        )}

        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-8 w-8 items-center justify-center"
          >
            <img src={arrowPokeIcon} alt="" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(pokemon.id)}
            aria-label={isFavorite ? 'Desfavoritar' : 'Favoritar'}
            className="flex h-8 w-8 items-center justify-center"
          >
            <FavoriteHeartIcon active={isFavorite} className="h-6 w-6" />
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
            <TypeBadge key={entry.type.name} type={entry.type.name as PokemonTypeName} />
          ))}
        </div>

        {flavorText && <p className="mt-4 text-sm text-neutral-500">{flavorText}</p>}

        <hr className="my-4 border-neutral-200" />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-200 p-3">
            <p className="flex items-center gap-1 text-xs font-medium uppercase text-neutral-400">
              <img src={pesoIcon} alt="" aria-hidden className="h-4 w-4" />
              Peso
            </p>
            <p className="mt-1 font-semibold">{formatWeightKg(pokemon.weight)}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 p-3">
            <p className="flex items-center gap-1 text-xs font-medium uppercase text-neutral-400">
              <img src={alturaIcon} alt="" aria-hidden className="h-4 w-4" />
              Altura
            </p>
            <p className="mt-1 font-semibold">{formatHeightM(pokemon.height)}</p>
          </div>
          {genus && (
            <div className="rounded-xl border border-neutral-200 p-3">
              <p className="flex items-center gap-1 text-xs font-medium uppercase text-neutral-400">
                <img src={categoriaIcon} alt="" aria-hidden className="h-4 w-4" />
                Categoria
              </p>
              <p className="mt-1 font-semibold">{genus}</p>
            </div>
          )}
          {ability && (
            <div className="rounded-xl border border-neutral-200 p-3">
              <p className="flex items-center gap-1 text-xs font-medium uppercase text-neutral-400">
                <img src={habilidadeIcon} alt="" aria-hidden className="h-4 w-4" />
                Habilidade
              </p>
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

        {weaknesses.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Fraquezas</h2>
            <div className="grid grid-cols-2 gap-2">
              {weaknesses.map((type) => (
                <TypeBadge key={type} type={type} size="lg" />
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

import { useParams } from "@solidjs/router";
import { Accessor, Component, createSignal, Setter, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useTmdb } from '../components/TmdbProvider';
import { TMDBTvGetDetails } from '../tmdb';

export const TvPage: Component = () => {

	const tmdb = useTmdb()

	const params = useParams()

	const [ tvDetails, setTvDetails ]: [ Accessor<TMDBTvGetDetails | undefined>, Setter<TMDBTvGetDetails | undefined> ] = createSignal()

	onMount(() => {

		tmdb.tmdbGetTvDetails({
			priority: 13,
			query: {
				tv_id: parseInt(params.tvId)
			}
		}).then((r) => {
			setTvDetails(r)
		})
	})

	return (
		<>
			<TvPageStyle>
				{params.tvId}
				<span>Tv Page</span>
				<p>
					{tvDetails()?.name}
				</p>
				<p>
					{tvDetails()?.overview}
				</p>
			</TvPageStyle>
		</>
	)
}

const TvPageStyle = styled("div")(() => {
	return {
		height: "100%",
		color: "white"
	}
})
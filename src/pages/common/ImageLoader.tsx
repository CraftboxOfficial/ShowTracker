import { BiRegularLoaderAlt } from 'solid-icons/bi';
import { Accessor, Component, createEffect, createSignal, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { tmdbGetImage } from 'src/components/TmdbProvider';
import { useTmdb } from '../../components/TmdbProvider';

interface imageLaderGetImage {
	size: number,
	path: string | null,
	imageType: "backdrop" | "logo" | "poster" | "profile" | "still"
}

export const ImageLoader: Component<{ data: { priority: number, query: imageLaderGetImage }, class?: string, hasLoadedSignal?: Setter<boolean> }> = (props) => {

	const tmdb = useTmdb()

	const [ image, setImage ]: [ Accessor<string | undefined>, Setter<string | undefined> ] = createSignal()
	const [ imageLoading, setImageLoading ] = createSignal(true)

	createEffect(async () => {
		setImageLoading(true)

		const config = await tmdb.tmdbGetConfiguration()

		let size: string

		const sizeArrPos = props.data.query.size
		switch (props.data.query.imageType) {
			case "backdrop": {
				size = config.images.backdrop_sizes[ sizeArrPos ]
				break
			}
			case "logo": {
				size = config.images.logo_sizes[ sizeArrPos ]
				break
			}
			case "poster": {
				size = config.images.poster_sizes[ sizeArrPos ]
				break
			}
			case "profile": {
				size = config.images.profile_sizes[ sizeArrPos ]
				break
			}
			case "still": {
				size = config.images.still_sizes[ sizeArrPos ]
				break
			}
		}

		if (props.data.query.path) {
			const gotImage = await tmdb.tmdbGetImage({
				priority: props.data.priority,
				query: {
					baseUrl: config.images.secure_base_url,
					path: props.data.query.path,
					size: size
				}
			})

			if (gotImage) {
				setImage(URL.createObjectURL(gotImage))
			}
		}

		setImageLoading(false)

		if (props.hasLoadedSignal) {
			props.hasLoadedSignal(true)
		}
	})

	return (
		<>
			<ImageLoaderStyle class={props.class}>
				<Show when={!imageLoading()} fallback={
					<div class="image-loading">
						<BiRegularLoaderAlt class="loading-ico" size={24} />
					</div>
				}>
					<Show when={image()} fallback={
						<div class="no-image">
							<span>No image</span>
						</div>
					}>
						<img src={image()} loading="lazy"></img>
					</Show>
				</Show>
			</ImageLoaderStyle>
		</>
	)
}

const ImageLoaderStyle = styled("div")((props) => {
	return {
		height: "inherit",
		width: "inherit",
		borderRadius: "inherit",

		img: {
			height: "inherit",
			width: "inherit",
			borderRadius: "inherit",
			boxShadow: "inherit"
		},

		".image-loading": {
			height: "inherit",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		},

		".no-image": {
			height: "inherit",
			// width: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",

			backgroundColor: props.theme?.card.accent,

			borderRadius: "inherit",

			// boxShadow: "8px 0 4px 0 #00000019",

			span: {
				fontSize: "1.1em",
				color: props.theme?.card.highlight2
			}
		},

		".loading-ico": {
			height: "calc(0.1em * 24)",
			width: "calc(0.1em * 24)",

			animationName: "loading",
			animationDuration: "1s",
			animationIterationCount: "infinite",
			animationTimingFunction: "ease-in-out"
		},

		"@keyframes loading": {
			"0%": {
				rotate: "0deg"
			},
			"100%": {
				rotate: "360deg"
			}
		}
	}
})
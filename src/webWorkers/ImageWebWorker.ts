self.onmessage = (e: MessageEvent<[ "ImageCache.temp.get", string ]>) => {
	console.log(e)
}

export {}
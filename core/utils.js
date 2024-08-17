const typeOf = (value) =>
	Object.prototype.toString.call(value).slice(8, -1).toLowerCase()

// cancellation axios
const Cancellation = {
	cancelSources: new Map(),
	createSourceToken() {
		return axios.CancelToken.source()
	},
	getToken(requestId) {
		if (this.isExistSource(requestId)) {
			return this.getSource(requestId)?.token
		} else {
			const newSource = this.createSourceToken()
			this.setSource(requestId, newSource)
			return newSource?.token
		}
	},
	getSource(requestId) {
		return this.cancelSources.get(requestId)
	},
	cancelLastRequest(requestId) {
		if (
			this.isExistSource(requestId) &&
			!this.isCanceledRequest(requestId)
		) {
			const token = this.getSource(requestId)
			token?.cancel('cancel')
			this.deleteSource(requestId)
		}
	},
	cancelAllRequest() {
		this.cancelSources.forEach((source) => {
			source?.cancel('cancel')
		})
		this.cancelSources = new Map()
	},
	deleteSource(requestId) {
		if (this.isExistSource(requestId)) {
			this.cancelSources.delete(requestId)
			return true
		}
		return false
	},
	isExistSource(requestId) {
		return !!this.getSource(requestId)
	},
	setSource(requestId, token) {
		this.cancelSources.set(requestId, token)
	},
	isCanceledRequest(requestId) {
		const token = this.getSource(requestId)
		const reason = token?.token?.reason
		return !!reason
	},
}

module.exports = { typeOf, Cancellation }
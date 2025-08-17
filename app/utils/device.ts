function getId() {
	const key = 'liucards-device-id'
	let id = localStorage.getItem(key)
	if (!id) {
		id = crypto.randomUUID()
		localStorage.setItem(key, id)
	}
	return id
}

export default {
	getId
}
function todo(title: string) {
    return {
        title: title,
        isDone: false,
        at: new Date().toISOString()
    };
}

export default {
    todo
}
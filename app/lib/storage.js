const storage = {
    get(k) {
        try {
            return JSON.parse(localStorage.getItem(k));
        } catch (e) {
            return null;
        }
    },
    set(k, v) {
        localStorage.setItem(k, JSON.stringify(v));
    }
};

export default storage;
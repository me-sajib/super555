exports.updateLocalStorageCoins = (coins) => {
    try {
        localStorage.setItem('user_coins', coins)
    } catch {}
}

const target = Math.floor(Math.random() * 100) + 1

process.stdout.write("Dévinez le juste prix (entre 1 et 100) : ")

process.stdin.setEncoding("utf-8")

process.stdin.on("data", (inputs) => {
    const guess = parseInt(inputs.trim(), 10)

    if (isNaN(guess)) {
        process.stdout.write("Ce n'est pas un nombre. Réessayer : ")
    } else if (guess < target) {
        process.stdout.write("C'est plus ! Essayez encore: ")
    } else if (guess > target) {
        process.stdout.write("C'est moins !  Essayez encore: ")
    } else {
        console.log("Bravo vous avez trouvé!")
        process.exit()
    }
})